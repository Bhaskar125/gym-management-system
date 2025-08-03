"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, Shield, Search } from "lucide-react"

interface LoginFormProps {
  onLogin: (user: { id: string; name: string; role: "admin" | "member" | "user" | "setup" | "debug" }) => void
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [activeTab, setActiveTab] = useState("user")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Mock authentication - in real app, you'd call an API
    setTimeout(() => {
      let user: { id: string; name: string; role: "admin" | "member" | "user" | "setup" | "debug" }

      if (activeTab === "admin" && email === "admin@demo.com" && password === "admin") {
        user = { id: "admin-1", name: "Admin User", role: "admin" }
      } else if (activeTab === "member" && email === "member@demo.com" && password === "member") {
        user = { id: "member-1", name: "John Doe", role: "member" }
      } else if (activeTab === "user") {
        user = { id: "user-1", name: "Public User", role: "user" }
      } else {
        alert("Invalid credentials")
        setIsLoading(false)
        return
      }

      onLogin(user)
      setIsLoading(false)
    }, 1000)
  }

  const handleGuestAccess = () => {
    onLogin({ id: "guest-1", name: "Guest User", role: "user" })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">💪 GymPro</h1>
          <p className="text-gray-600">Gym Management System</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Choose your access level to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="user" className="text-xs">
                  <Search className="h-4 w-4 mr-1" />
                  Public
                </TabsTrigger>
                <TabsTrigger value="member" className="text-xs">
                  <Users className="h-4 w-4 mr-1" />
                  Member
                </TabsTrigger>
                <TabsTrigger value="admin" className="text-xs">
                  <Shield className="h-4 w-4 mr-1" />
                  Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value="user" className="space-y-4 mt-4">
                <div className="text-center space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <Search className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Access public member search and gym information
                    </p>
                  </div>
                  <Button onClick={handleGuestAccess} className="w-full">
                    Continue as Guest
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="member" className="space-y-4 mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="member-email">Email</Label>
                    <Input
                      id="member-email"
                      type="email"
                      placeholder="member@demo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="member-password">Password</Label>
                    <Input
                      id="member-password"
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign in as Member"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="admin" className="space-y-4 mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@demo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Admin Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Enter admin password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" variant="destructive" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign in as Admin"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Demo Credentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
            <Badge variant="outline">Member</Badge>
            <span>member@demo.com / member</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <Badge variant="destructive">Admin</Badge>
            <span>admin@demo.com / admin</span>
          </div>
          <div className="pt-2 border-t space-y-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs"
              onClick={() => onLogin({ id: "debug-1", name: "Debug User", role: "debug" })}
            >
              🔍 Firebase Diagnostics
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs"
              onClick={() => onLogin({ id: "setup-1", name: "Setup User", role: "setup" })}
            >
              🔧 Database Setup (After Debug)
            </Button>
          </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}