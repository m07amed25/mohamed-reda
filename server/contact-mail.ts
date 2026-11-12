import { createElement as h, Fragment } from "react";
import {
  Body,
  Container,
  Head,
  Heading,
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
const sectionHeading = { fontSize: "16px", margin: "22px 0 6px" };
const countryNames = new Intl.DisplayNames(["en"], { type: "region" });

function renderDetails(details: [label: string, value: string][]) {
  const rows = details.filter(([, value]) => value);
  if (!rows.length) return null;

  return h(Text, { style: { ...paragraph, margin: "0", overflowWrap: "anywhere" } },
    ...rows.map(([label, value], index) => h(Fragment, { key: label },
      index > 0 && h("br"),
      h("strong", null, `${label}: `),
      value,
    )),
  );
}

async function renderMessage(title: string, inquiry: Inquiry, isCopy = false) {
  const {
    name, email, phone, phoneCountry, jobTitle, company, companyWebsite,
    location, profileUrl, preferredContact, projectType, budget, budgetCurrency, timeline,
    teamSize, message, referral,
  } = inquiry;
  const clientDetails = renderDetails([
    ["Name", name],
    ["Email", email],
    ["Phone", phone],
    ["Phone country", phoneCountry ? countryNames.of(phoneCountry) ?? phoneCountry : ""],
    ["Job title", jobTitle],
    ["Company", company],
    ["Company website", companyWebsite],
    ["City and country", location],
    ["Professional profile", profileUrl],
    ["Preferred contact method", preferredContact],
    ["Team size", teamSize],
    ["How you found me", referral],
  ]);
  const projectDetails = renderDetails([
    ["Project type", projectType],
    ["Budget", budget ? `${budget} ${budgetCurrency}` : ""],
    ["Timeline", timeline],
  ]);
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
            backgroundColor: "#ffffff",
            color: "#1c1917",
            fontFamily: "Arial, sans-serif",
            padding: "16px",
          },
        },
        h(
          Container,
          {
            style: {
              maxWidth: "560px",
            },
          },
          h(
            Heading,
            { as: "h1", style: { fontSize: "24px", margin: "0 0 12px" } },
            title,
          ),
          isCopy && h(Text, { style: paragraph }, "Thanks for reaching out. Here’s a copy of your inquiry."),
          h(Heading, { as: "h2", style: sectionHeading }, "Client details"),
          clientDetails,
          h(Heading, { as: "h2", style: sectionHeading }, "Project details"),
          projectDetails,
          h(Text, { style: { ...paragraph, marginTop: projectDetails ? "12px" : "0", overflowWrap: "anywhere" } },
            message.split(/\r?\n/).flatMap((part, index) => index ? [h("br", { key: index }), part] : [part]),
          ),
          isCopy && h(Text, { style: paragraph }, "I’ll get back to you after reviewing your inquiry. You can reply here if you’d like to add anything."),
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
