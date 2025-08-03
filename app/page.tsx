"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import AdminDashboard from "./components/admin-dashboard"
import MemberPortal from "./components/member-portal"
import PublicSearch from "./components/public-search"
import LoginForm from "./components/login-form"

export default function GymManagementSystem() {
  const [currentUser, setCurrentUser] = useState<{
    id: string
    name: string
    role: "admin" | "member" | "user"
  } | null>(null)

  const handleLogin = (user: { id: string; name: string; role: "admin" | "member" | "user" }) => {
    setCurrentUser(user)
  }

  const handleLogout = () => {
    setCurrentUser(null)
  }

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">💪 GymPro</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="capitalize">
                {currentUser.role}
              </Badge>
              <span className="text-sm text-gray-700">{currentUser.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {currentUser.role === "admin" && <AdminDashboard />}
          {currentUser.role === "member" && <MemberPortal memberId={currentUser.id} />}
          {currentUser.role === "user" && <PublicSearch />}
        </div>
      </main>
    </div>
  )
}
