import { createElement as h } from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
  render,
  toPlainText,
} from "react-email";
import nodemailer from "nodemailer";
import type { Inquiry } from "./contact.ts";

type Message = {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  headers?: Record<string, string>;
};

const paragraph = { fontSize: "16px", lineHeight: "1.5" };
const countryNames = new Intl.DisplayNames(["en"], { type: "region" });

async function renderMessage(title: string, inquiry: Inquiry, isCopy = false) {
  const { name, email, phone, phoneCountry, jobTitle, company, companyWebsite, teamSize, message, referral } = inquiry;
  const details = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone],
    ["Phone country", phoneCountry ? countryNames.of(phoneCountry) ?? phoneCountry : ""],
    ["Job title", jobTitle],
    ["Company", company],
    ["Company website", companyWebsite],
    ["Team size", teamSize],
    ["How you found me", referral],
  ];
  const html = await render(
    h(
      Html,
      { lang: "en" },
      h(Head),
      h(Preview, null, title),
      h(
        Body,
        {
          style: {
            backgroundColor: "#f5f5f4",
            color: "#1c1917",
            fontFamily: "Arial, sans-serif",
            padding: "24px 12px",
          },
        },
        h(
          Container,
          {
            style: {
              backgroundColor: "#ffffff",
              borderTop: "3px solid #166534",
              maxWidth: "560px",
              padding: "24px",
            },
          },
          h(
            Heading,
            { as: "h1", style: { fontSize: "24px", margin: "0 0 20px" } },
            title,
          ),
          isCopy && h(Text, { style: paragraph }, "Thanks for reaching out. Here’s a copy of what you sent through my portfolio."),
          h(Hr, { style: { borderColor: "#e7e5e4" } }),
          ...details.filter(([, value]) => value).map(([label, value]) =>
            h(
              Text,
              { key: label, style: { ...paragraph, margin: "8px 0" } },
              h("strong", null, `${label}: `),
              value,
            ),
          ),
          h(Heading, { as: "h2", style: { fontSize: "16px", margin: "20px 0 8px" } }, "Project details"),
          h(Text, { style: { ...paragraph, marginTop: "0", overflowWrap: "anywhere" } },
            message.split(/\r?\n/).flatMap((part, index) => index ? [h("br", { key: index }), part] : [part]),
          ),
          isCopy && h(Hr, { style: { borderColor: "#e7e5e4" } }),
          isCopy && h(Text, { style: paragraph }, "I’ll review your message and get back to you. If you’d like to add anything, just reply to this email."),
          isCopy && h(Text, { style: paragraph }, "Best,", h("br"), "Mohamed Reda"),
        ),
      ),
    ),
  );
  return { html, text: toPlainText(html) };
}

export function createContactDelivery(
  mailbox: string,
  send: (message: Message) => Promise<unknown>,
) {
  return async (inquiry: Inquiry) => {
    const subject = "New portfolio inquiry";
    await send({
      from: mailbox,
      to: mailbox,
      replyTo: inquiry.email,
      subject,
      ...(await renderMessage(subject, inquiry)),
    });

    // The inquiry has been delivered; a failed receipt should not prompt a duplicate submission.
    try {
      const receipt = "Your message to Mohamed Reda";
      await send({
        from: mailbox,
        to: inquiry.email,
        replyTo: mailbox,
        subject: receipt,
        headers: { "Auto-Submitted": "auto-replied" },
        ...(await renderMessage(receipt, inquiry, true)),
      });
      return true;
    } catch {
      console.error("Contact receipt delivery failed.");
      return false;
    }
  };
}

export function createGmailDelivery(
  env: Readonly<Record<string, string | undefined>>,
) {
  const user = env.GMAIL_USER?.trim();
  const pass = env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  if (!user || !pass) return undefined;

  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    socketTimeout: 12_000,
  });
  return createContactDelivery(user, (message) => transport.sendMail(message));
}
