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

export function AuthGuard({ children, requireAuth = true, requireSubscription = false }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // TODO: Implement actual auth check
        // For now, simulate auth check
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Simulate checking authentication
        const token = localStorage.getItem("auth_token")
        const authenticated = !!token

        // Simulate checking subscription
        const subscription = localStorage.getItem("subscription_status")
        const activeSubscription = subscription === "active"

        setIsAuthenticated(authenticated)
        setHasActiveSubscription(activeSubscription)

        if (requireAuth && !authenticated) {
          router.push("/login")
          return
        }

        if (requireSubscription && authenticated && !activeSubscription) {
          router.push("/subscription")
          return
        }
      } catch (error) {
        console.error("Auth check failed:", error)
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

  if (requireSubscription && isAuthenticated && !hasActiveSubscription) {
    return null
  }

  return <>{children}</>
}
