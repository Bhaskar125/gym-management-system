"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { User, CreditCard, Calendar, Package, Download, Apple } from "lucide-react"
import type { Member, Bill, Package as PackageType, DietPlan } from "@/app/types"

interface MemberPortalProps {
  memberId: string
}

// Mock data for member portal
const mockMember: Member = {
  id: "member-1",
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  packageId: "premium",
  joinDate: "2024-01-15",
  active: true,
  dietPlanId: "diet-1",
  dietNotes: "Looking to build muscle mass, prefer protein-heavy meals",
}

const mockBills: Bill[] = [
  {
    id: "1",
    memberId: "member-1",
    amount: 100,
    month: "2024-01",
    paymentDate: "2024-01-15",
    status: "Paid",
    receiptUrl: "/receipt1.pdf",
  },
  {
    id: "2",
    memberId: "member-1",
    amount: 100,
    month: "2024-02",
    paymentDate: "2024-02-15",
    status: "Paid",
    receiptUrl: "/receipt2.pdf",
  },
  {
    id: "3",
    memberId: "member-1",
    amount: 100,
    month: "2024-03",
    paymentDate: "",
    status: "Pending",
  },
]

const mockPackages: PackageType[] = [
  { id: "basic", name: "Basic Plan", price: 50, duration: "1 month" },
  { id: "premium", name: "Premium Plan", price: 100, duration: "1 month" },
  { id: "annual", name: "Annual Plan", price: 500, duration: "12 months" },
]

const mockDietPlan: DietPlan = {
  id: "diet-1",
  name: "Muscle Builder Pro",
  type: "Muscle Gain",
  description: "High protein plan designed for muscle building and strength gains.",
  calorieTarget: 2800,
  proteinTarget: 220,
  carbTarget: 280,
  fatTarget: 93,
  dietaryRestrictions: ["Lactose-free options available"],
  mealPlan: [
    {
      id: "1",
      mealType: "Breakfast",
      foods: [
        { name: "Protein Shake", quantity: "1 scoop", calories: 120, protein: 25, carbs: 3, fat: 1 },
        { name: "Whole Eggs", quantity: "3 large", calories: 210, protein: 18, carbs: 1, fat: 15 },
        { name: "Oatmeal", quantity: "1 cup", calories: 300, protein: 10, carbs: 54, fat: 6 },
      ],
      totalCalories: 630,
      notes: "Post-workout protein boost"
    },
    {
      id: "2",
      mealType: "Lunch",
      foods: [
        { name: "Grilled Chicken", quantity: "8 oz", calories: 370, protein: 70, carbs: 0, fat: 8 },
        { name: "Brown Rice", quantity: "1.5 cups", calories: 330, protein: 7, carbs: 68, fat: 3 },
        { name: "Mixed Vegetables", quantity: "1 cup", calories: 50, protein: 2, carbs: 12, fat: 0 },
      ],
      totalCalories: 750,
      notes: "Main meal of the day"
    },
  ],
  createdDate: "2024-01-01",
  active: true,
}

export default function MemberPortal({ memberId }: MemberPortalProps) {
  const [member, setMember] = useState<Member>(mockMember)
  const [bills, setBills] = useState<Bill[]>(mockBills)
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null)

  useEffect(() => {
    // Find the member's package
    const pkg = mockPackages.find((p) => p.id === member.packageId)
    setSelectedPackage(pkg || null)
  }, [member.packageId])

  const memberBills = bills.filter((bill) => bill.memberId === memberId)
  const paidBills = memberBills.filter((bill) => bill.status === "Paid")
  const pendingBills = memberBills.filter((bill) => bill.status === "Pending")
  const totalPaid = paidBills.reduce((sum, bill) => sum + bill.amount, 0)

  const handlePayBill = (billId: string) => {
    setBills(
      bills.map((bill) =>
        bill.id === billId
          ? {
              ...bill,
              status: "Paid" as const,
              paymentDate: new Date().toISOString().split("T")[0],
              receiptUrl: `/receipt-${billId}.pdf`,
            }
          : bill
      )
    )
  }

  const stats = [
    { title: "Total Paid", value: `$${totalPaid}`, icon: CreditCard, color: "text-green-600" },
    { title: "Pending Bills", value: pendingBills.length, icon: CreditCard, color: "text-orange-600" },
    { title: "Member Since", value: member.joinDate, icon: Calendar, color: "text-blue-600" },
    { title: "Current Package", value: selectedPackage?.name || "None", icon: Package, color: "text-purple-600" },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {member.name}!</h1>
        <p className="text-gray-600 mt-2">Manage your gym membership and track your payments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="bills">Bills & Payments</TabsTrigger>
          <TabsTrigger value="package">Package Details</TabsTrigger>
          <TabsTrigger value="diet">Diet Plan</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
              <CardDescription>Your account details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <p className="text-lg font-semibold">{member.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email Address</label>
                  <p className="text-lg">{member.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone Number</label>
                  <p className="text-lg">{member.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Member ID</label>
                  <p className="text-lg font-mono">{member.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Join Date</label>
                  <p className="text-lg">{new Date(member.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <Badge variant={member.active ? "default" : "destructive"}>
                    {member.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <div className="pt-4">
                <Button>Update Profile</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bills Tab */}
        <TabsContent value="bills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Bills & Payment History
              </CardTitle>
              <CardDescription>Track your payments and download receipts</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memberBills.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell className="font-medium">{bill.month}</TableCell>
                      <TableCell>${bill.amount}</TableCell>
                      <TableCell>{bill.paymentDate || "Not paid"}</TableCell>
                      <TableCell>
                        <Badge variant={bill.status === "Paid" ? "default" : "destructive"}>
                          {bill.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {bill.status === "Pending" ? (
                            <Button size="sm" onClick={() => handlePayBill(bill.id)}>
                              Pay Now
                            </Button>
                          ) : (
                            bill.receiptUrl && (
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                Receipt
                              </Button>
                            )
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Package Tab */}
        <TabsContent value="package" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Current Package
              </CardTitle>
              <CardDescription>Your membership package details and options</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedPackage ? (
                <div className="space-y-6">
                  <div className="p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h3 className="text-2xl font-bold mb-2">{selectedPackage.name}</h3>
                    <p className="text-3xl font-bold text-blue-600 mb-2">${selectedPackage.price}</p>
                    <p className="text-gray-600">Duration: {selectedPackage.duration}</p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-4">Available Packages</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {mockPackages.map((pkg) => (
                        <div
                          key={pkg.id}
                          className={`p-4 border rounded-lg ${
                            pkg.id === member.packageId
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <h5 className="font-semibold">{pkg.name}</h5>
                          <p className="text-xl font-bold text-blue-600">${pkg.price}</p>
                          <p className="text-sm text-gray-600">{pkg.duration}</p>
                          {pkg.id !== member.packageId && (
                            <Button className="w-full mt-3" variant="outline" size="sm">
                              Switch to This Plan
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">No package selected</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Diet Plan Tab */}
        <TabsContent value="diet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Apple className="h-5 w-5 mr-2" />
                My Diet Plan
              </CardTitle>
              <CardDescription>Your personalized nutrition plan and goals</CardDescription>
            </CardHeader>
            <CardContent>
              {member.dietPlanId && mockDietPlan ? (
                <div className="space-y-6">
                  {/* Diet Plan Overview */}
                  <div className="p-6 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{mockDietPlan.name}</h3>
                        <Badge variant="outline" className="mb-2">{mockDietPlan.type}</Badge>
                        <p className="text-gray-600">{mockDietPlan.description}</p>
                      </div>
                      <Badge variant={mockDietPlan.active ? "default" : "secondary"}>
                        {mockDietPlan.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>

                  {/* Nutritional Targets */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Daily Targets</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 border rounded-lg text-center">
                        <p className="text-2xl font-bold text-blue-600">{mockDietPlan.calorieTarget}</p>
                        <p className="text-sm text-gray-600">Calories</p>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <p className="text-2xl font-bold text-green-600">{mockDietPlan.proteinTarget}g</p>
                        <p className="text-sm text-gray-600">Protein</p>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <p className="text-2xl font-bold text-orange-600">{mockDietPlan.carbTarget}g</p>
                        <p className="text-sm text-gray-600">Carbs</p>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <p className="text-2xl font-bold text-purple-600">{mockDietPlan.fatTarget}g</p>
                        <p className="text-sm text-gray-600">Fat</p>
                      </div>
                    </div>
                  </div>

                  {/* Sample Meals */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Sample Meals</h4>
                    <div className="space-y-4">
                      {mockDietPlan.mealPlan.map((meal) => (
                        <div key={meal.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-semibold">{meal.mealType}</h5>
                            <Badge variant="outline">{meal.totalCalories} calories</Badge>
                          </div>
                          <div className="space-y-2">
                            {meal.foods.map((food, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{food.name} ({food.quantity})</span>
                                <span className="text-gray-600">{food.calories} cal, {food.protein}g protein</span>
                              </div>
                            ))}
                          </div>
                          {meal.notes && (
                            <p className="text-sm text-gray-600 mt-2 italic">Note: {meal.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dietary Restrictions */}
                  {mockDietPlan.dietaryRestrictions.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Dietary Considerations</h4>
                      <div className="flex flex-wrap gap-2">
                        {mockDietPlan.dietaryRestrictions.map((restriction, index) => (
                          <Badge key={index} variant="outline">{restriction}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Personal Notes */}
                  {member.dietNotes && (
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Personal Notes</h4>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-700">{member.dietNotes}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <Button>Download Meal Plan</Button>
                    <Button variant="outline">Request Changes</Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Apple className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Diet Plan Assigned</h3>
                  <p className="text-gray-600 mb-4">Contact your trainer to get a personalized diet plan</p>
                  <Button>Request Diet Plan</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your recent gym activity and interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Payment Received</p>
                    <p className="text-sm text-gray-600">Payment for February 2024 - $100</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Profile Updated</p>
                    <p className="text-sm text-gray-600">Contact information updated</p>
                    <p className="text-xs text-gray-500">1 week ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Package Upgraded</p>
                    <p className="text-sm text-gray-600">Upgraded to Premium Plan</p>
                    <p className="text-xs text-gray-500">2 weeks ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}