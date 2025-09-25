import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Auth me check started")
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      console.log("[v0] No auth token found")
      return NextResponse.json({ error: "Token não encontrado" }, { status: 401 })
    }

    // Verificar token
    console.log("[v0] Verifying JWT token")
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    // Buscar dados atualizados do usuário
    console.log("[v0] Fetching user data for ID:", decoded.userId)
    const user = await query(
      `SELECT u.id, u.email, u.store_name, u.owner_name, u.whatsapp, u.slug, u.email_verified, u.created_at,
              s.status as subscription_status, s.expires_at as subscription_expires
       FROM users u
       LEFT JOIN subscriptions s ON u.id = s.user_id AND s.status = 'active'
       WHERE u.id = $1`,
      [decoded.userId],
    )

    console.log("[v0] User data query result:", user)

    if (user.length === 0) {
      console.log("[v0] User not found in database")
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    const userData = user[0]

    console.log("[v0] Auth me successful")
    return NextResponse.json({
      user: {
        id: userData.id,
        email: userData.email,
        emailVerified: userData.email_verified,
        storeName: userData.store_name,
        ownerName: userData.owner_name,
        whatsapp: userData.whatsapp,
        slug: userData.slug,
        createdAt: userData.created_at,
        subscriptionStatus: userData.subscription_status || "inactive",
        subscriptionExpires: userData.subscription_expires,
      },
    })
  } catch (error) {
    console.error("[v0] Auth me error:", error)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 })
  }
}
