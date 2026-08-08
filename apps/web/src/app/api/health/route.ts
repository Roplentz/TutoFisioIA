import {NextResponse} from "next/server";
import {healthSnapshot} from "@/lib/health";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(healthSnapshot());
}
