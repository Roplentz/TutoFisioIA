export type HealthStatus = "ok" | "degraded";

export function healthSnapshot(now = new Date()): {status: HealthStatus; service: string; timestamp: string} {
  return {status: "ok", service: "tutoria-fisio-web", timestamp: now.toISOString()};
}
