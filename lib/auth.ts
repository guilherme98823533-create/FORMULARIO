import jwt from "jsonwebtoken"
import type { NextRequest } from "next/server"

export interface AuthUser {
  userId: number
  email: string
  emailVerified: boolean
}

export function getAuthUser(request: NextRequest): AuthUser | null {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    return {
      userId: decoded.userId,
      email: decoded.email,
      emailVerified: decoded.emailVerified,
    }
  } catch (error) {
    return null
  }
}

export function requireAuth(request: NextRequest): AuthUser {
  const user = getAuthUser(request)

  if (!user) {
    throw new Error("Authentication required")
  }

  return user
}
