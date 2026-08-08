import {describe, expect, it} from "vitest";
import {healthSnapshot} from "./health";

describe("healthSnapshot", () => {
  it("returns a stable service status and ISO timestamp", () => {
    expect(healthSnapshot(new Date("2026-08-08T00:00:00.000Z"))).toEqual({
      status: "ok",
      service: "tutoria-fisio-web",
      timestamp: "2026-08-08T00:00:00.000Z",
    });
  });
});
