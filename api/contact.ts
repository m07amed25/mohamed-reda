import { createContactHandler } from "../server/contact.ts";
import { createGmailDelivery } from "../server/contact-mail.ts";

export default { fetch: createContactHandler(createGmailDelivery(process.env)) };
