import assert from "node:assert/strict";
import { test } from "node:test";
import { getResourceContact } from "../../src/lib/resourceLeadContact";

test("a callback can be requested with a phone number and no email", () => {
  const contact = getResourceContact("Call", " (904) 555-0100 ", "");
  assert.equal(contact.hasRequiredContact, true);
  assert.equal(contact.emailRequired, false);
  assert.equal(contact.summary, "Call: (904) 555-0100");
});

test("an email request does not require a phone number", () => {
  const contact = getResourceContact("Email", "", " prospect@example.com ");
  assert.equal(contact.hasRequiredContact, true);
  assert.equal(contact.phoneRequired, false);
  assert.equal(contact.summary, "Email: prospect@example.com");
});

test("a text request uses the phone number while preserving an optional email", () => {
  const contact = getResourceContact("Text", "(904) 555-0100", "prospect@example.com");
  assert.equal(contact.hasRequiredContact, true);
  assert.equal(contact.phoneRequired, true);
  assert.equal(contact.summary, "Text: (904) 555-0100 | Email: prospect@example.com");
});

test("switching contact method requires the newly selected contact detail", () => {
  assert.equal(getResourceContact("Email", "(904) 555-0100", "   ").hasRequiredContact, false);
  assert.equal(getResourceContact("Call", "   ", "prospect@example.com").hasRequiredContact, false);
  assert.equal(getResourceContact("Text", "", "prospect@example.com").hasRequiredContact, false);
});
