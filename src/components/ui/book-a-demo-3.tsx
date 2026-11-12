import { useId, useRef, useState, type SubmitEvent } from "react";
import { ArrowUpRight, Check, LoaderCircle, Send } from "lucide-react";
import { isPossiblePhoneNumber, type Country } from "react-phone-number-input";
import { contactHref } from "@/components/hero/contact";
import { PhoneInput } from "@/components/reui/phone-input";

const control = "mt-2 min-h-12 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-base text-stone-950 caret-green-800 placeholder:text-stone-500 focus-visible:border-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800";

const prompts = [
  "Tell me what you’re building and who it’s for.",
  "Share any goals, deadlines, or work already in progress.",
  "I’ll reply by email so we can talk through next steps.",
];

type Status = { kind: "idle" | "sending" | "success" | "error"; message: string };

export function Bookademo3() {
  const [status, setStatus] = useState<Status>({ kind: "idle", message: "" });
  const [phone, setPhone] = useState("");
  const [phoneCountry, setPhoneCountry] = useState<Country>();
  const [phoneInvalid, setPhoneInvalid] = useState(false);
  const [phoneReset, setPhoneReset] = useState(0);
  const phoneId = useId();
  const sending = useRef(false);

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const form = event.currentTarget;
    if (phone && !isPossiblePhoneNumber(phone)) {
      setPhoneInvalid(true);
      form.ownerDocument.getElementById(phoneId)?.focus();
      return;
    }
    sending.current = true;
    const data = Object.fromEntries(new FormData(form));
    const fallback = "Your message could not be sent. Try again or email me directly.";
    setStatus({ kind: "sending", message: "Sending your message…" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, phone, phoneCountry }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true) {
        setStatus({ kind: "error", message: typeof result?.error === "string" ? result.error : fallback });
        return;
      }
      form.reset();
      setPhone("");
      setPhoneCountry(undefined);
      setPhoneReset((current) => current + 1);
      setStatus({ kind: "success", message: result.copySent
        ? "Message sent. Check your inbox for a copy."
        : "Message sent. I received your inquiry, but couldn’t email you a copy." });
    } catch {
      setStatus({ kind: "error", message: fallback });
    } finally {
      sending.current = false;
    }
  }

  const busy = status.kind === "sending";

  return (
    <section aria-labelledby="contact-heading" className="relative z-10 flex min-h-dvh items-center bg-stone-50 px-6 py-12 font-sans text-stone-950 selection:bg-green-200 selection:text-green-950 md:px-10 lg:py-8 motion-safe:lg:not-focus-within:sticky motion-safe:lg:not-focus-within:bottom-0">
      <div className="mx-auto grid w-full max-w-7xl items-start gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16 xl:gap-20">
        <div>
          <h2 id="contact-heading" className="max-w-[12ch] font-sans text-5xl leading-[0.98] font-bold tracking-[-0.04em] text-balance sm:text-7xl lg:text-8xl">
            Let’s build <span className="text-green-800">together.</span>
          </h2>
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-stone-700">
            Have a web project in mind? Tell me a little about it and let’s see how I can help.
          </p>
          <ul role="list" className="mt-7 grid max-w-sm gap-4 border-t border-stone-300 pt-6 text-sm leading-relaxed text-stone-700">
            {prompts.map((prompt) => (
              <li key={prompt} className="flex items-start gap-3">
                <Check aria-hidden="true" className="size-5 shrink-0 rounded-full bg-green-100 p-0.5 text-green-900" />
                {prompt}
              </li>
            ))}
          </ul>
          <a href={contactHref} className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-green-800 underline decoration-green-800/40 underline-offset-4 hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-800">
            Email me directly <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </div>

        <form aria-labelledby="contact-form-heading" onSubmit={submit} className="rounded-2xl border border-stone-300 bg-white p-5 sm:p-6 xl:p-8">
          <h3 id="contact-form-heading" className="font-sans text-2xl font-semibold tracking-tight">Tell me about your project</h3>
          <fieldset disabled={busy} className="mt-5 min-w-0 space-y-4 disabled:opacity-75">
            <fieldset className="min-w-0">
              <legend className="mb-4 text-base font-semibold">Your contact details</legend>
              <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
                <label className="text-sm font-medium">
                  Full name
                  <input name="name" autoComplete="name" maxLength={100} className={control} required />
                </label>
                <label className="text-sm font-medium">
                  Email
                  <input name="email" type="email" autoComplete="email" maxLength={254} className={control} required />
                </label>
                <div className="min-w-0 text-sm font-medium">
                  <label htmlFor={phoneId}>Phone number <span className="font-normal text-stone-600">(optional)</span></label>
                  <PhoneInput
                    key={phoneReset}
                    id={phoneId}
                    value={phone}
                    onChange={(value) => { setPhone(value); setPhoneInvalid(false); }}
                    onCountryChange={setPhoneCountry}
                    autoComplete="tel"
                    disabled={busy}
                    aria-invalid={phoneInvalid || undefined}
                    aria-describedby={phoneInvalid ? `${phoneId}-error` : undefined}
                    className="mt-2 *:min-h-12 *:border-stone-300 *:shadow-none [&_[data-slot=combobox-trigger]]:rounded-s-lg [&_[data-slot=input]]:rounded-e-lg [&_[data-slot=input]]:text-base [&_[data-slot=input]]:caret-green-800 [&_[data-slot=input]]:focus-visible:ring-green-800/30 [&_[data-slot=combobox-trigger]]:focus-visible:ring-green-800/30"
                  />
                  {phoneInvalid && <p id={`${phoneId}-error`} role="alert" className="mt-2 font-normal text-red-800">Check the country code and enter a complete phone number.</p>}
                </div>
                <label className="text-sm font-medium">
                  Job title <span className="font-normal text-stone-600">(optional)</span>
                  <input name="jobTitle" autoComplete="organization-title" maxLength={100} className={control} />
                </label>
                <label className="text-sm font-medium">
                  Company <span className="font-normal text-stone-600">(optional)</span>
                  <input name="company" autoComplete="organization" maxLength={150} className={control} />
                </label>
                <label className="text-sm font-medium">
                  Company website <span className="font-normal text-stone-600">(optional)</span>
                  <input name="companyWebsite" type="url" autoComplete="url" pattern="[Hh][Tt][Tt][Pp][Ss]?://.+" title="Enter a website starting with https:// or http://" maxLength={512} placeholder="https://example.com" className={control} />
                </label>
              </div>
            </fieldset>

            <div className="grid gap-x-5 gap-y-4 border-t border-stone-200 pt-4 sm:grid-cols-2">
              <label className="text-sm font-medium">
                Team size <span className="font-normal text-stone-600">(optional)</span>
                <select name="teamSize" defaultValue="" className={control}>
                  <option value="">Select a range</option>
                  <option>1–10</option>
                  <option>11–50</option>
                  <option>51–200</option>
                  <option>201+</option>
                </select>
              </label>
              <label className="text-sm font-medium">
                How did you find me? <span className="font-normal text-stone-600">(optional)</span>
                <input name="referral" maxLength={250} className={control} />
              </label>
            </div>

            <label className="block text-sm font-medium">
              Project details
              <textarea name="message" rows={3} maxLength={3000} placeholder="What would you like to build?" className={`${control} resize-y`} required />
            </label>
            <div hidden>
              <label>Leave this blank <input name="website" autoComplete="off" tabIndex={-1} /></label>
            </div>

            <button type="submit" className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-800 px-5 py-3 text-sm font-semibold text-white hover:bg-green-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-800 disabled:cursor-wait sm:w-auto">
              {busy ? "Sending…" : "Send message"}
              {busy ? <LoaderCircle aria-hidden="true" className="size-4 motion-safe:animate-spin" /> : <Send aria-hidden="true" className="size-4" />}
            </button>
          </fieldset>
          <p role="status" className={`mt-3 text-sm leading-relaxed ${status.kind === "error" ? "text-red-800" : "text-green-900"}`}>
            {status.message}
          </p>
        </form>
      </div>
    </section>
  );
}
