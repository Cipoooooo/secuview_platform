"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { mockUsers, mockTenant } from "@/lib/mock-data"

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, login } = useAuthStore()

  useEffect(() => {
    // Auto-login with mock data for demo purposes
    if (!isAuthenticated) {
      login(mockUsers[0], mockTenant)
    }
    router.push("/dashboard")
  }, [isAuthenticated, login, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Redirecting to dashboard...</p>
      </div>
    </div>
  )
}
