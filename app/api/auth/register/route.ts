import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { query } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { email, password, storeName, ownerName, whatsapp } = await request.json()

    if (!email || !password || !storeName || !ownerName) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    // Verificar se email já existe
    const existingUser = await query("SELECT id FROM users WHERE email = $1", [email.toLowerCase()])

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Email já está em uso" }, { status: 409 })
    }

    // Gerar slug único para a loja
    const baseSlug = storeName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")

    let slug = baseSlug
    let counter = 1

    while (true) {
      const existingSlug = await query("SELECT id FROM users WHERE slug = $1", [slug])

      if (existingSlug.length === 0) break

      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Hash da senha
    const saltRounds = Number.parseInt(process.env.BCRYPT_ROUNDS || "12")
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Criar usuário
    const newUser = await query(
      `INSERT INTO users (email, password_hash, store_name, owner_name, whatsapp, slug, email_verified, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, false, NOW(), NOW())
       RETURNING id, email, store_name, owner_name, slug`,
      [email.toLowerCase(), passwordHash, storeName, ownerName, whatsapp || null, slug],
    )

    const userData = newUser[0]

    // Gerar JWT token
    const token = jwt.sign(
      {
        userId: userData.id,
        email: userData.email,
        emailVerified: false,
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
        emailVerified: false,
        storeName: userData.store_name,
        slug: userData.slug,
      },
    })

    // Definir cookie httpOnly
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
    })

    return response
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
