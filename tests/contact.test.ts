import assert from "node:assert/strict";
import test from "node:test";
import { createContactHandler } from "../server/contact.ts";
import { createContactDelivery } from "../server/contact-mail.ts";

const inquiry = {
  name: "Sam Example",
  email: "sam@example.com",
  phone: "+12025550104",
  jobTitle: "Design director",
  company: "Example Studio",
  companyWebsite: "https://studio.example/work",
  teamSize: "1–10",
  message: "I'd like a <script> tag displayed as text.",
  referral: "GitHub",
};

function request(body: unknown, headers?: Record<string, string>) {
  return new Request("https://portfolio.example/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

test("delivers the inquiry to the owner and sends the visitor a signed copy", async () => {
  const mail: Parameters<Parameters<typeof createContactDelivery>[1]>[0][] = [];
  const handle = createContactHandler(createContactDelivery("owner@example.com", async (message) => {
    mail.push(message);
  }));

  const response = await handle(request({ ...inquiry, phoneCountry: "US" }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, copySent: true });
  assert.equal(mail.length, 2);
  assert.equal(mail[0].from, "owner@example.com");
  assert.equal(mail[0].to, "owner@example.com");
  assert.equal(mail[0].replyTo, "sam@example.com");
  assert.match(mail[0].html, /&lt;script&gt;/);
  assert.match(mail[0].text, /Example Studio/);
  assert.equal(mail[1].to, "sam@example.com");
  assert.equal(mail[1].replyTo, "owner@example.com");
  assert.match(mail[1].html, /&lt;script&gt;/);
  for (const message of mail) {
    assert.match(message.text, /Phone country: United States/);
    assert.match(message.html, /Phone country: <\/strong>United States/);
  }
  for (const value of Object.values(inquiry)) assert.ok(mail[1].text.includes(value), `The copy is missing: ${value}`);
  for (const value of [inquiry.phone, inquiry.jobTitle, inquiry.companyWebsite]) {
    assert.ok(mail[0].text.includes(value), `The owner’s email is missing: ${value}`);
  }
  assert.match(mail[1].text, /Best,\s+Mohamed Reda/);
});

test("accepts an inquiry without the optional contact fields", async () => {
  const mail: Parameters<Parameters<typeof createContactDelivery>[1]>[0][] = [];
  const handle = createContactHandler(createContactDelivery("owner@example.com", async (message) => {
    mail.push(message);
  }));

  const response = await handle(request({ name: inquiry.name, email: inquiry.email, message: inquiry.message }));
  assert.deepEqual(await response.json(), { ok: true, copySent: true });
  assert.equal(mail.length, 2);
  for (const message of mail) assert.doesNotMatch(message.text, /Phone:|Phone country:|Job title:|Company website:/);
});

test("keeps a delivered inquiry successful if its copy cannot be sent", async () => {
  const handle = createContactHandler(createContactDelivery("owner@example.com", async ({ to }) => {
    if (to !== "owner@example.com") throw new Error("Receipt delivery failed");
  }));
  const response = await handle(request(inquiry));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, copySent: false });
});

test("rejects invalid, cross-origin, and oversized requests without sending mail", async () => {
  let delivered = 0;
  const handle = createContactHandler(async () => { delivered++; return true; });

  assert.equal((await handle(request({ ...inquiry, email: "a@example.com,b@example.com" }))).status, 400);
  assert.equal((await handle(request({ ...inquiry, companyWebsite: "mailto:sam@example.com" }))).status, 400);
  assert.equal((await handle(request({ ...inquiry, phone: { number: "555-0104" } }))).status, 400);
  assert.equal((await handle(request({ ...inquiry, phoneCountry: "ZZ" }))).status, 400);
  assert.equal((await handle(request({ ...inquiry, jobTitle: "x".repeat(101) }))).status, 400);
  assert.equal((await handle(request({ ...inquiry, message: "  " }))).status, 400);
  assert.equal((await handle(request(inquiry, { Origin: "https://other.example" }))).status, 403);
  assert.equal((await handle(request({ ...inquiry, padding: "x".repeat(33_000) }))).status, 413);
  assert.equal(delivered, 0);
});

test("ignores the bot field and limits repeated submissions to one recipient", async () => {
  let delivered = 0;
  const handle = createContactHandler(async () => { delivered++; return true; });

  assert.equal((await handle(request({ ...inquiry, website: "https://spam.example" }))).status, 200);
  assert.equal((await handle(request(inquiry))).status, 200);
  assert.equal((await handle(request(inquiry))).status, 200);
  assert.equal((await handle(request(inquiry))).status, 429);
  assert.equal(delivered, 2);
});

test("returns a failure when the inquiry cannot be delivered", async () => {
  const handle = createContactHandler(async () => { throw new Error("SMTP unavailable"); });
  assert.equal((await handle(request(inquiry))).status, 502);
});
