import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { query } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Login attempt started")
    const { email, password } = await request.json()

    if (!email || !password) {
      console.log("[v0] Missing email or password")
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    console.log("[v0] Searching for user:", email)
    // Buscar usuário no banco
    const user = await query(
      "SELECT id, email, password_hash, email_verified, store_name FROM users WHERE email = $1",
      [email.toLowerCase()],
    )

    console.log("[v0] User query result:", user)

    if (user.length === 0) {
      console.log("[v0] User not found")
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    const userData = user[0]

    // Verificar senha
    console.log("[v0] Verifying password")
    const isValidPassword = await bcrypt.compare(password, userData.password_hash)
    if (!isValidPassword) {
      console.log("[v0] Invalid password")
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    // Gerar JWT token
    console.log("[v0] Generating JWT token")
    const token = jwt.sign(
      {
        userId: userData.id,
        email: userData.email,
        emailVerified: userData.email_verified,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    )

    // Criar resposta com cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        emailVerified: userData.email_verified,
        storeName: userData.store_name,
      },
    })

    // Definir cookie httpOnly
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
    })

    console.log("[v0] Login successful")
    return response
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
