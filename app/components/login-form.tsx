"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, Shield, Search, UserPlus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePackages, useDietPlans } from "@/hooks/use-firebase-data"
import { memberOperations } from "@/lib/firebase-operations"

interface LoginFormProps {
  onLogin: (user: { id: string; name: string; role: "admin" | "member" | "user" | "setup" | "debug" }) => void
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [activeTab, setActiveTab] = useState("user")
  const [isLoading, setIsLoading] = useState(false)
  
  // Registration form state
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    packageId: "none",
    dietPlanId: "none",
    dietNotes: ""
  })
  const [isRegistering, setIsRegistering] = useState(false)
  const [registrationError, setRegistrationError] = useState("")
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  
  // Get packages and diet plans for registration
  const { packages, loading: packagesLoading } = usePackages()
  const { dietPlans, loading: dietPlansLoading } = useDietPlans()

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

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsRegistering(true)
    setRegistrationError("")

    try {
      // Validate required fields
      if (!registerData.name || !registerData.email || !registerData.phone || !registerData.password) {
        setRegistrationError("Please fill in all required fields (name, email, phone, password)")
        setIsRegistering(false)
        return
      }

      // Create new member in Firebase - filter out undefined values
      const memberData: any = {
        name: registerData.name,
        email: registerData.email,
        phone: registerData.phone,
        password: registerData.password,
        joinDate: new Date().toISOString().split("T")[0],
        active: true,
      }

      // Only add optional fields if they have values
      if (registerData.packageId && registerData.packageId !== "none") {
        memberData.packageId = registerData.packageId
      }
      if (registerData.dietPlanId && registerData.dietPlanId !== "none") {
        memberData.dietPlanId = registerData.dietPlanId
      }
      if (registerData.dietNotes && registerData.dietNotes.trim()) {
        memberData.dietNotes = registerData.dietNotes.trim()
      }

      const memberId = await memberOperations.create(memberData)
      
      // Save the name before resetting form
      const memberName = registerData.name
      
      // Reset form and show success
      setRegisterData({
        name: "",
        email: "",
        phone: "",
        password: "",
        packageId: "none",
        dietPlanId: "none",
        dietNotes: ""
      })
      setRegistrationSuccess(true)
      
      // Auto-login the new member after 2 seconds
      setTimeout(() => {
        onLogin({ 
          id: memberId, 
          name: memberName, 
          role: "member" 
        })
      }, 2000)

    } catch (error) {
      console.error("Registration error:", error)
      setRegistrationError("Failed to create account. Please try again.")
    } finally {
      setIsRegistering(false)
    }
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
            <CardTitle className="text-center">Welcome to GymPro</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or register as a new member
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="user" className="text-xs">
                  <Search className="h-4 w-4 mr-1" />
                  Public
                </TabsTrigger>
                <TabsTrigger value="register" className="text-xs">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Register
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

              <TabsContent value="register" className="space-y-4 mt-4">
                {registrationSuccess ? (
                  <div className="text-center space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <UserPlus className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-green-800 mb-2">Registration Successful!</h3>
                      <p className="text-sm text-green-600">
                        Welcome to GymPro! You'll be automatically logged in...
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRegistration} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Full Name *</Label>
                      <Input
                        id="register-name"
                        placeholder="Enter your full name"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email Address *</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-phone">Phone Number *</Label>
                      <Input
                        id="register-phone"
                        placeholder="Enter your phone number"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password *</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Create a password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-package">Membership Package (Optional)</Label>
                      <Select 
                        value={registerData.packageId} 
                        onValueChange={(value) => setRegisterData({ ...registerData, packageId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a membership package" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Package</SelectItem>
                          {packagesLoading ? (
                            <SelectItem value="loading" disabled>Loading packages...</SelectItem>
                          ) : (
                            packages.map((pkg) => (
                              <SelectItem key={pkg.id} value={pkg.id}>
                                <div className="flex justify-between items-center w-full">
                                  <span>{pkg.name}</span>
                                  <span className="text-green-600 font-medium ml-2">${pkg.price}</span>
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-diet">Diet Plan (Optional)</Label>
                      <Select 
                        value={registerData.dietPlanId} 
                        onValueChange={(value) => setRegisterData({ ...registerData, dietPlanId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a diet plan (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Diet Plan</SelectItem>
                          {dietPlansLoading ? (
                            <SelectItem value="loading" disabled>Loading diet plans...</SelectItem>
                          ) : (
                            dietPlans.filter(plan => plan.active).map((plan) => (
                              <SelectItem key={plan.id} value={plan.id}>
                                <div className="flex justify-between items-center w-full">
                                  <span>{plan.name}</span>
                                  <span className="text-blue-600 font-medium ml-2">{plan.type}</span>
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-notes">Dietary Notes (Optional)</Label>
                      <Input
                        id="register-notes"
                        placeholder="Any dietary requirements or notes..."
                        value={registerData.dietNotes}
                        onChange={(e) => setRegisterData({ ...registerData, dietNotes: e.target.value })}
                      />
                    </div>
                    
                    {registrationError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{registrationError}</p>
                      </div>
                    )}
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isRegistering || packagesLoading}
                    >
                      {isRegistering ? "Creating Account..." : "Create Account"}
                    </Button>
                    
                    <p className="text-xs text-gray-600 text-center">
                      By registering, you agree to our terms and conditions
                    </p>
                  </form>
                )}
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
            <CardTitle className="text-sm">Demo Credentials & Registration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-2 bg-green-50 rounded text-xs text-center mb-3">
              <UserPlus className="h-4 w-4 mx-auto mb-1 text-green-600" />
              <span className="text-green-700 font-medium">New users can register instantly!</span>
            </div>
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