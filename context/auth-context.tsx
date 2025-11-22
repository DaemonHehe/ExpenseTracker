"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  _id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, userData: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check for existing session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  // Protect routes
  useEffect(() => {
    if (isLoading) return

    const publicPaths = ["/auth/login", "/auth/register", "/"]
    const isPublicPath = publicPaths.includes(pathname)

    if (!token && !isPublicPath) {
      router.push("/auth/login")
    } else if (token && isPublicPath && pathname !== "/") {
      // Redirect to dashboard if already logged in and trying to access auth pages
      router.push("/dashboard")
    }
  }, [token, pathname, isLoading, router])

  const login = (newToken: string, userData: User) => {
    localStorage.setItem("token", newToken)
    localStorage.setItem("user", JSON.stringify(userData))
    setToken(newToken)
    setUser(userData)
    router.push("/dashboard")
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
    router.push("/auth/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
