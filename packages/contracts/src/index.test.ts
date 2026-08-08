import {describe, expect, it} from "vitest";
import type {DomainEvent} from "./index.js";

describe("DomainEvent", () => {
  it("supports auditable, tenant-scoped events", () => {
    const event: DomainEvent<{competencyId: string}> = {id: "evt-1", name: "learning.evidence-recorded", occurredAt: "2026-08-08T00:00:00.000Z", tenantId: "tenant-1", correlationId: "request-1", payload: {competencyId: "bio-1"}};
    expect(event.tenantId).toBe("tenant-1");
  });
});
