import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  ALLSTATE_HEALTH_SOLUTIONS,
  ALLSTATE_HEALTH_SOLUTIONS_CANCER,
  ALLSTATE_HEALTH_SOLUTIONS_DVH,
  ALLSTATE_HEALTH_SOLUTIONS_SENIOR_INDEMNITY,
  UHONE_ANCILLARY,
} from "../../src/lib/externalLinks";

const APPROVED_ALLSTATE_AGENT_TOKEN =
  "CfDJ8HnG7iviitJBoT9st8R33ESm5X5ekuFHv5hLVs3I3rgo71CFdsJF37isVuSOTAoOmq_6VvG47Ekq0T-fpVQYH1tjdw";

describe("ancillary self-quote destinations", () => {
  it("uses the approved UnitedHealthcare broker destination", () => {
    const destination = new URL(UHONE_ANCILLARY);

    assert.equal(destination.protocol, "https:");
    assert.equal(destination.origin, "https://shop.uhone.com");
    assert.equal(destination.pathname, "/en/quote/census");
    assert.equal(destination.searchParams.get("brokerid"), "AA5620604");
  });

  it("uses the approved Allstate Health Solutions destinations", () => {
    const cases: Array<[string, string]> = [
      [ALLSTATE_HEALTH_SOLUTIONS, "all-products"],
      [ALLSTATE_HEALTH_SOLUTIONS_DVH, "dvh"],
      [ALLSTATE_HEALTH_SOLUTIONS_SENIOR_INDEMNITY, "senior-indemnity"],
      [ALLSTATE_HEALTH_SOLUTIONS_CANCER, "cancer-only"],
    ];

    for (const [href, expectedProduct] of cases) {
      const destination = new URL(href);
      assert.equal(destination.protocol, "https:");
      assert.equal(destination.origin, "https://customer.enroll.natgenhealth.com");
      assert.equal(destination.pathname, "/quick-quote/");
      assert.equal(destination.searchParams.get("agent"), APPROVED_ALLSTATE_AGENT_TOKEN);
      assert.equal(destination.searchParams.get("product"), expectedProduct);
    }
  });

  it("keeps the carrier destinations distinct", () => {
    assert.notEqual(UHONE_ANCILLARY, ALLSTATE_HEALTH_SOLUTIONS);
    assert.notEqual(new URL(UHONE_ANCILLARY).origin, new URL(ALLSTATE_HEALTH_SOLUTIONS).origin);
  });
});
