export type DomainName = "auth" | "curriculum" | "competencies" | "rag" | "tutor" | "learning" | "assessments" | "analytics" | "security" | "ai-gateway";

export interface DomainEvent<TPayload extends Record<string, unknown> = Record<string, unknown>> {
  id: string;
  name: `${DomainName}.${string}`;
  occurredAt: string;
  tenantId: string;
  correlationId: string;
  payload: TPayload;
}

export interface ModuleContract<TCommand, TResult> {
  execute(command: TCommand): Promise<TResult>;
}

export * from "./tenancy.js";
