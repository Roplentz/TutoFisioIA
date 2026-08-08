import {describe, expect, it} from "vitest";
import {AuthenticationError, AuthorizationError, InMemorySessionStore, hasPermission, requirePermission, resolveMembership, validateOidcClaims, type AuthContext, type IdentityProvider, type Session} from "./auth.js";
import {tenantId} from "./tenancy.js";

const tenantA = tenantId("institution-a");
const tenantB = tenantId("institution-b");
const provider: IdentityProvider = {issuer: "https://id.example.edu", audience: "tutoria-fisio", authorizationEndpoint: "https://id.example.edu/authorize", tokenEndpoint: "https://id.example.edu/token", jwksUri: "https://id.example.edu/jwks"};
const now = () => new Date("2026-08-08T12:00:00.000Z");
const admin: AuthContext = {userId: "admin-1", tenantId: tenantA, role: "administrator", sessionId: "admin-session", correlationId: "request-1"};
const session: Session = {id: "session-1", userId: "student-1", tenantId: tenantA, createdAt: "2026-08-08T11:00:00.000Z", expiresAt: "2026-08-08T13:00:00.000Z"};

describe("authentication and RBAC", () => {
  it("validates issuer, audience, subject and expiration", () => {
    expect(() => validateOidcClaims({iss: provider.issuer, aud: provider.audience, sub: "user-1", exp: 1_786_194_000}, provider, 1_786_190_400)).not.toThrow();
    expect(() => validateOidcClaims({iss: "https://attacker.invalid", aud: provider.audience, sub: "user-1", exp: 1_786_194_000}, provider, 1_786_190_400)).toThrow(AuthenticationError);
  });
  it("uses least privilege for students", () => {
    expect(hasPermission("student", "tutor:use")).toBe(true);
    expect(hasPermission("student", "curriculum:manage")).toBe(false);
  });
  it("blocks operations outside the assigned role", () => {
    const student: AuthContext = {...admin, role: "student"};
    expect(() => requirePermission(student, "memberships:manage")).toThrow(AuthorizationError);
  });
  it("requires an active membership in the selected tenant", () => {
    expect(resolveMembership("user-1", tenantA, [{userId: "user-1", tenantId: tenantA, role: "professor", active: true}]).role).toBe("professor");
    expect(() => resolveMembership("user-1", tenantB, [{userId: "user-1", tenantId: tenantA, role: "professor", active: true}])).toThrow(AuthorizationError);
  });
  it("revokes sessions immediately and audits the administrative action", () => {
    const store = new InMemorySessionStore(now); store.create(session); store.revoke(admin, session.id);
    expect(() => store.requireActive(session.id)).toThrow(AuthenticationError);
    expect(store.auditTrail()[0]).toMatchObject({action: "session.revoked", actorId: admin.userId, tenantId: tenantA, targetId: session.id});
  });
  it("prevents cross-tenant session revocation", () => {
    const store = new InMemorySessionStore(now); store.create({...session, tenantId: tenantB});
    expect(() => store.revoke(admin, session.id)).toThrow(AuthorizationError);
  });
  it("rejects expired sessions", () => {
    const store = new InMemorySessionStore(now); store.create({...session, expiresAt: "2026-08-08T11:59:59.000Z"});
    expect(() => store.requireActive(session.id)).toThrow(AuthenticationError);
  });
});
