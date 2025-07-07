"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

interface User {
  id: string
  email: string
  username: string
  password: string
  isAdmin: boolean
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Get users from localStorage
      const usersData = localStorage.getItem("users")
      const users: User[] = usersData ? JSON.parse(usersData) : []

      // Check for admin login (hardcoded admin email)
      const isAdminEmail = email === "admin@communityportal.com"

      if (isAdminEmail && password === "admin123") {
        // Create admin user if doesn't exist
        let adminUser = users.find((u) => u.email === email)
        if (!adminUser) {
          adminUser = {
            id: "admin",
            email: "admin@communityportal.com",
            username: "Admin",
            password: "admin123",
            isAdmin: true,
          }
          users.push(adminUser)
          localStorage.setItem("users", JSON.stringify(users))
        }

        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            id: adminUser.id,
            email: adminUser.email,
            username: adminUser.username,
            isAdmin: true,
          }),
        )
        router.push("/")
        return
      }

      // Regular user login
      const user = users.find((u) => u.email === email && u.password === password)

      if (!user) {
        setError("Invalid email or password")
        return
      }

      // Store current user (without password)
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: user.id,
          email: user.email,
          username: user.username,
          isAdmin: user.isAdmin,
        }),
      )

      router.push("/")
    } catch (err) {
      setError("An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-orange-600">CommunityHub</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/register" className="text-orange-600 hover:text-orange-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-600 mb-2">Demo Credentials:</p>
            <p className="text-xs text-gray-600">Admin: admin@communityportal.com / admin123</p>
            <p className="text-xs text-gray-600">Or create a new account</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
