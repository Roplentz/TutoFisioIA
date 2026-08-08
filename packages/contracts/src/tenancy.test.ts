import {describe, expect, it} from "vitest";
import {InMemoryTenantRepository, TenantAccessDeniedError, assertTenantAccess, tenantId, type Course, type TenantContext} from "./tenancy.js";

const tenantA = tenantId("institution-a");
const tenantB = tenantId("institution-b");
const now = () => new Date("2026-08-08T00:00:00.000Z");
const context = (id = tenantA): TenantContext => ({tenantId: id, actorId: "user-1", role: "professor", correlationId: "request-1"});

describe("tenant isolation", () => {
  it("rejects an empty tenant identifier", () => { expect(() => tenantId("  ")).toThrow("tenantId is required"); });
  it("allows access only when active and resource tenants match", () => {
    expect(() => assertTenantAccess(context(), tenantA)).not.toThrow();
    expect(() => assertTenantAccess(context(), tenantB)).toThrow(TenantAccessDeniedError);
  });
  it("prevents cross-tenant reads without revealing the record", () => {
    const course: Course = {id: "course-b", tenantId: tenantB, name: "Fisioterapia"};
    const repository = new InMemoryTenantRepository([course], now);
    expect(() => repository.findById(context(), course.id)).toThrow(TenantAccessDeniedError);
    expect(repository.auditTrail()[0]).toMatchObject({action: "academic.denied", outcome: "denied", tenantId: tenantA});
  });
  it("prevents cross-tenant writes and audits the attempt", () => {
    const repository = new InMemoryTenantRepository<Course>([], now);
    expect(() => repository.save(context(), {id: "course-b", tenantId: tenantB, name: "Medicina"})).toThrow(TenantAccessDeniedError);
    expect(repository.auditTrail()[0]?.action).toBe("academic.denied");
  });
  it("allows same-tenant reads and writes with an audit trail", () => {
    const repository = new InMemoryTenantRepository<Course>([], now);
    const course: Course = {id: "course-a", tenantId: tenantA, name: "Fisioterapia"};
    repository.save(context(), course);
    expect(repository.findById(context(), course.id)).toEqual(course);
    expect(repository.auditTrail().map((event) => event.action)).toEqual(["academic.write", "academic.read"]);
  });
});
