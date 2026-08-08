export type TenantId = string & {readonly __brand: "TenantId"};
export type AcademicRole = "tenant-admin" | "professor" | "student" | "auditor";

export interface TenantContext { tenantId: TenantId; actorId: string; role: AcademicRole; correlationId: string; }
export interface Institution { id: TenantId; name: string; status: "active" | "suspended"; }
export interface Course { id: string; tenantId: TenantId; name: string; }
export interface Cohort { id: string; tenantId: TenantId; courseId: string; name: string; startsAt: string; endsAt?: string; }
export interface TenantScopedRecord { id: string; tenantId: TenantId; }
export interface TenantAuditEvent {
  action: "academic.read" | "academic.write" | "academic.denied";
  actorId: string; tenantId: TenantId; recordId?: string; correlationId: string;
  occurredAt: string; outcome: "allowed" | "denied";
}

export class TenantAccessDeniedError extends Error {
  constructor() { super("Academic resource is not available in the active tenant"); this.name = "TenantAccessDeniedError"; }
}

export function tenantId(value: string): TenantId {
  if (value.trim().length === 0) throw new TypeError("tenantId is required");
  return value as TenantId;
}

export function assertTenantAccess(context: TenantContext, resourceTenantId: TenantId): void {
  if (context.tenantId !== resourceTenantId) throw new TenantAccessDeniedError();
}

export class InMemoryTenantRepository<T extends TenantScopedRecord> {
  readonly #records = new Map<string, T>();
  readonly #audit: TenantAuditEvent[] = [];
  constructor(records: readonly T[] = [], private readonly now: () => Date = () => new Date()) {
    for (const record of records) this.#records.set(record.id, record);
  }
  findById(context: TenantContext, id: string): T | undefined {
    const record = this.#records.get(id);
    if (record && record.tenantId !== context.tenantId) {
      this.#recordAudit(context, "academic.denied", "denied", id);
      throw new TenantAccessDeniedError();
    }
    this.#recordAudit(context, "academic.read", "allowed", id);
    return record;
  }
  save(context: TenantContext, record: T): void {
    try { assertTenantAccess(context, record.tenantId); }
    catch (error) { this.#recordAudit(context, "academic.denied", "denied", record.id); throw error; }
    this.#records.set(record.id, record);
    this.#recordAudit(context, "academic.write", "allowed", record.id);
  }
  auditTrail(): readonly TenantAuditEvent[] { return [...this.#audit]; }
  #recordAudit(context: TenantContext, action: TenantAuditEvent["action"], outcome: TenantAuditEvent["outcome"], recordId: string): void {
    this.#audit.push({action, outcome, recordId, actorId: context.actorId, tenantId: context.tenantId, correlationId: context.correlationId, occurredAt: this.now().toISOString()});
  }
}
