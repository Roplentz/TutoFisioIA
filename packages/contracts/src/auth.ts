import type {TenantId} from "./tenancy.js";

export type PlatformRole = "student" | "professor" | "coordinator" | "administrator";
export type Permission =
  | "tutor:use" | "progress:read:self" | "curriculum:read"
  | "curriculum:manage" | "students:read" | "reports:read"
  | "memberships:manage" | "tenant:configure" | "sessions:revoke";

const ROLE_PERMISSIONS: Readonly<Record<PlatformRole, readonly Permission[]>> = {
  student: ["tutor:use", "progress:read:self", "curriculum:read"],
  professor: ["tutor:use", "curriculum:read", "curriculum:manage", "students:read"],
  coordinator: ["tutor:use", "curriculum:read", "curriculum:manage", "students:read", "reports:read", "memberships:manage"],
  administrator: ["tutor:use", "curriculum:read", "curriculum:manage", "students:read", "reports:read", "memberships:manage", "tenant:configure", "sessions:revoke"]
};

export interface OidcClaims { iss: string; aud: string | readonly string[]; sub: string; exp: number; iat?: number; }
export interface IdentityProvider { issuer: string; audience: string; authorizationEndpoint: string; tokenEndpoint: string; jwksUri: string; }
export interface Membership { userId: string; tenantId: TenantId; role: PlatformRole; active: boolean; }
export interface AuthContext { userId: string; tenantId: TenantId; role: PlatformRole; sessionId: string; correlationId: string; }
export interface Session { id: string; userId: string; tenantId: TenantId; createdAt: string; expiresAt: string; revokedAt?: string; }
export interface AdministrativeAuditEvent { action: "role.changed" | "session.revoked" | "sso.configured"; actorId: string; tenantId: TenantId; targetId: string; occurredAt: string; correlationId: string; }

export class AuthenticationError extends Error { constructor() { super("Authentication failed"); this.name = "AuthenticationError"; } }
export class AuthorizationError extends Error { constructor() { super("Action is not permitted"); this.name = "AuthorizationError"; } }

export function validateOidcClaims(claims: OidcClaims, provider: IdentityProvider, nowEpochSeconds = Math.floor(Date.now() / 1000)): void {
  const audiences = typeof claims.aud === "string" ? [claims.aud] : claims.aud;
  if (claims.iss !== provider.issuer || !audiences.includes(provider.audience) || claims.sub.trim() === "" || claims.exp <= nowEpochSeconds) throw new AuthenticationError();
}

export function hasPermission(role: PlatformRole, permission: Permission): boolean { return ROLE_PERMISSIONS[role].includes(permission); }
export function requirePermission(context: AuthContext, permission: Permission): void { if (!hasPermission(context.role, permission)) throw new AuthorizationError(); }

export class InMemorySessionStore {
  readonly #sessions = new Map<string, Session>();
  readonly #audit: AdministrativeAuditEvent[] = [];
  constructor(private readonly now: () => Date = () => new Date()) {}
  create(session: Session): void { this.#sessions.set(session.id, session); }
  requireActive(sessionId: string): Session {
    const session = this.#sessions.get(sessionId);
    if (!session || session.revokedAt || new Date(session.expiresAt).getTime() <= this.now().getTime()) throw new AuthenticationError();
    return session;
  }
  revoke(actor: AuthContext, sessionId: string): void {
    requirePermission(actor, "sessions:revoke");
    const session = this.#sessions.get(sessionId);
    if (!session || session.tenantId !== actor.tenantId) throw new AuthorizationError();
    const revokedAt = this.now().toISOString();
    this.#sessions.set(sessionId, {...session, revokedAt});
    this.#audit.push({action: "session.revoked", actorId: actor.userId, tenantId: actor.tenantId, targetId: sessionId, occurredAt: revokedAt, correlationId: actor.correlationId});
  }
  auditTrail(): readonly AdministrativeAuditEvent[] { return [...this.#audit]; }
}

export function resolveMembership(userId: string, tenantId: TenantId, memberships: readonly Membership[]): Membership {
  const membership = memberships.find((item) => item.userId === userId && item.tenantId === tenantId && item.active);
  if (!membership) throw new AuthorizationError();
  return membership;
}
