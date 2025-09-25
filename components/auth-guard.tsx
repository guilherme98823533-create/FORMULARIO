"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireSubscription?: boolean
}

interface User {
  id: string
  email: string
  storeName: string
  subscriptionStatus: string
}

export function AuthGuard({ children, requireAuth = true, requireSubscription = false }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("[v0] Checking authentication...")

        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include", // Include cookies
        })

        if (response.ok) {
          const data = await response.json()
          console.log("[v0] Auth check successful:", data.user)

          setIsAuthenticated(true)
          setUser(data.user)

          // Check subscription requirement
          if (requireSubscription && data.user?.subscriptionStatus !== "active") {
            console.log("[v0] Subscription required but not active, redirecting...")
            router.push("/subscription")
            return
          }
        } else {
          console.log("[v0] Auth check failed:", response.status)
          setIsAuthenticated(false)
          setUser(null)

          if (requireAuth) {
            router.push("/login")
            return
          }
        }
      } catch (error) {
        console.error("[v0] Auth check error:", error)
        setIsAuthenticated(false)
        setUser(null)

        if (requireAuth) {
          router.push("/login")
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [requireAuth, requireSubscription, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return null
  }

  if (requireSubscription && isAuthenticated && user?.subscriptionStatus !== "active") {
    return null
  }

  return <>{children}</>
}
