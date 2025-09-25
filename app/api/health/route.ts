import { NextResponse } from "next/server"
import { healthCheck } from "@/lib/database"

export async function GET() {
  try {
    const dbHealthy = await healthCheck()

    if (!dbHealthy) {
      return NextResponse.json({ status: "unhealthy", database: "disconnected" }, { status: 503 })
    }

    return NextResponse.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json({ status: "unhealthy", error: "Internal server error" }, { status: 500 })
  }
}
