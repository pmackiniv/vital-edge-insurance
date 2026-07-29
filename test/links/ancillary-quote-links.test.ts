import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  ALLSTATE_HEALTH_SOLUTIONS,
  UHONE_ANCILLARY,
} from "../../src/lib/externalLinks";

describe("ancillary self-quote destinations", () => {
  it("uses the approved UnitedHealthcare broker destination", () => {
    const destination = new URL(UHONE_ANCILLARY);

    assert.equal(destination.protocol, "https:");
    assert.equal(destination.origin, "https://shop.uhone.com");
    assert.equal(destination.pathname, "/en/quote/census");
    assert.equal(destination.searchParams.get("brokerid"), "AA5620604");
  });

  it("uses the approved Allstate Health Solutions destination", () => {
    const destination = new URL(ALLSTATE_HEALTH_SOLUTIONS);

    assert.equal(destination.protocol, "https:");
    assert.equal(destination.origin, "https://customer.enroll.natgenhealth.com");
    assert.equal(destination.pathname, "/quick-quote/");
    assert.equal(
      destination.searchParams.get("agent"),
      "CfDJ8FIfQXHyEOZEm91JXGawb_HZSIuV-qXpMQ3xIPcSLZtjt_k9FumEyZoGRRPlQ5KlwyIAA80toXG285u3amEHnPq1Sw",
    );
    assert.equal(destination.searchParams.get("product"), "all-products");
  });

  it("keeps the carrier destinations distinct", () => {
    assert.notEqual(UHONE_ANCILLARY, ALLSTATE_HEALTH_SOLUTIONS);
    assert.notEqual(new URL(UHONE_ANCILLARY).origin, new URL(ALLSTATE_HEALTH_SOLUTIONS).origin);
  });
});
