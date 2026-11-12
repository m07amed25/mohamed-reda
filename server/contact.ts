import { isSupportedCountry } from "react-phone-number-input";

export type Inquiry = {
  name: string;
  email: string;
  phone: string;
  phoneCountry: string;
  jobTitle: string;
  company: string;
  companyWebsite: string;
  teamSize: string;
  message: string;
  referral: string;
};

type DeliverInquiry = (inquiry: Inquiry) => Promise<boolean>;

const maxBodyBytes = 32 * 1024;
const windowMs = 10 * 60_000;
const emailAddress =
  /^[a-z0-9.!#$%&'*+\-/=?^_`{|}~]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i;

async function readBody(request: Request) {
  if (Number(request.headers.get("content-length")) > maxBodyBytes) return { tooLarge: true } as const;
  const reader = request.body?.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let body = "";

  if (reader) {
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > maxBodyBytes) return { tooLarge: true } as const;
        body += decoder.decode(value, { stream: true });
      }
    } finally {
      reader.releaseLock();
    }
  }

  const data: unknown = JSON.parse(body + decoder.decode());
  return { data };
}

function isCompanyWebsite(value: string) {
  if (!value) return true;
  if (value.length > 512 || !/^https?:\/\//i.test(value)) return false;
  try {
    const url = new URL(value);
    return Boolean(url.hostname && !url.username && !url.password);
  } catch {
    return false;
  }
}

function parseInquiry(data: Record<string, unknown>): Inquiry | null {
  const {
    name,
    email,
    phone = "",
    phoneCountry = "",
    jobTitle = "",
    company = "",
    companyWebsite = "",
    teamSize = "",
    message,
    referral = "",
  } = data;
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof phone !== "string" ||
    typeof phoneCountry !== "string" ||
    typeof jobTitle !== "string" ||
    typeof companyWebsite !== "string" ||
    typeof message !== "string" ||
    typeof company !== "string" ||
    typeof teamSize !== "string" ||
    typeof referral !== "string"
  )
    return null;

  const inquiry = {
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    phoneCountry: phoneCountry.trim().toUpperCase(),
    jobTitle: jobTitle.trim(),
    companyWebsite: companyWebsite.trim(),
    message: message.trim(),
    company: company.trim(),
    teamSize: teamSize.trim(),
    referral: referral.trim(),
  };

  if (
    !inquiry.name ||
    inquiry.name.length > 100 ||
    !emailAddress.test(inquiry.email) ||
    inquiry.email.length > 254 ||
    inquiry.phone.length > 40 ||
    /[\r\n]/.test(inquiry.phone) ||
    (inquiry.phoneCountry !== "" && !isSupportedCountry(inquiry.phoneCountry)) ||
    inquiry.jobTitle.length > 100 ||
    !isCompanyWebsite(inquiry.companyWebsite) ||
    !inquiry.message ||
    inquiry.message.length > 3000 ||
    inquiry.company.length > 150 ||
    !["", "1–10", "11–50", "51–200", "201+"].includes(inquiry.teamSize) ||
    inquiry.referral.length > 250
  )
    return null;

  return inquiry;
}

export function createContactHandler(deliver?: DeliverInquiry) {
  // ponytail: per-instance mail cap; use a shared limiter if the site scales across instances.
  let windowEnds = 0;
  let total = 0;
  const byEmail = new Map<string, number>();

  return async (request: Request): Promise<Response> => {
    if (request.method !== "POST") {
      return Response.json(
        { error: "Use POST to send a message." },
        { status: 405, headers: { Allow: "POST" } },
      );
    }
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin) {
      return Response.json(
        { error: "Submit the form from the portfolio." },
        { status: 403 },
      );
    }
    if (
      request.headers
        .get("content-type")
        ?.split(";")[0]
        .trim()
        .toLowerCase() !== "application/json"
    ) {
      return Response.json({ error: "Send a JSON request." }, { status: 415 });
    }

    let body: Awaited<ReturnType<typeof readBody>>;
    try {
      body = await readBody(request);
    } catch {
      return Response.json(
        { error: "The form data could not be read." },
        { status: 400 },
      );
    }
    if (body.tooLarge)
      return Response.json(
        { error: "Your message is too long." },
        { status: 413 },
      );

    const data = body.data;
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return Response.json(
        { error: "Enter your name, email, and message." },
        { status: 400 },
      );
    }
    const fields = data as Record<string, unknown>;
    if (fields.website) return Response.json({ ok: true, copySent: true });
    const inquiry = parseInquiry(fields);
    if (!inquiry)
      return Response.json(
        {
          error: "Check your contact details and message, then try again. Website links must start with https:// or http://.",
        },
        { status: 400 },
      );
    if (!deliver)
      return Response.json(
        { error: "The form is unavailable. Please email me directly." },
        { status: 503 },
      );

    const now = Date.now();
    if (now >= windowEnds) {
      windowEnds = now + windowMs;
      total = 0;
      byEmail.clear();
    }
    const key = inquiry.email.toLowerCase();
    const count = byEmail.get(key) ?? 0;
    if (count >= 2 || total >= 25) {
      return Response.json(
        {
          error: "Too many messages. Please wait a few minutes and try again.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((windowEnds - now) / 1000)),
          },
        },
      );
    }
    byEmail.set(key, count + 1);
    total++;

    try {
      const copySent = await deliver(inquiry);
      return Response.json({ ok: true, copySent });
    } catch {
      console.error("Contact inquiry delivery failed.");
      return Response.json(
        {
          error:
            "Your message could not be sent. Try again or email me directly.",
        },
        { status: 502 },
      );
    }
  };
}
