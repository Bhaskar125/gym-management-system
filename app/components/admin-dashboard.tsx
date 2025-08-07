"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Users, CreditCard, Bell, FileText, Plus, Download, Filter, Edit, Trash2 } from "lucide-react"
import { useMembers, useBills, usePackages, useDashboardStats, useDietPlans } from "@/hooks/use-firebase-data"

// All data is now fetched from Firebase using custom hooks

export default function AdminDashboard() {
  const { members, loading: membersLoading, addMember, updateMember, deleteMember } = useMembers()
  const { bills, loading: billsLoading, addBill, updateBill, deleteBill } = useBills()
  const { packages, loading: packagesLoading, addPackage, updatePackage, deletePackage } = usePackages()
  const { dietPlans, loading: dietPlansLoading, addDietPlan, updateDietPlan, deleteDietPlan } = useDietPlans()
  const { stats, loading: statsLoading, refreshStats } = useDashboardStats()
  
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false)
  const [isDeleteMemberOpen, setIsDeleteMemberOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<any>(null)
  const [isCreateBillOpen, setIsCreateBillOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isAddDietPlanOpen, setIsAddDietPlanOpen] = useState(false)
  const [isEditDietPlanOpen, setIsEditDietPlanOpen] = useState(false)
  const [isDeleteDietPlanOpen, setIsDeleteDietPlanOpen] = useState(false)
  const [selectedDietPlan, setSelectedDietPlan] = useState<any>(null)
  const [dietPlanToDelete, setDietPlanToDelete] = useState<any>(null)

  const dashboardStats = [
    { title: "Total Members", value: stats.totalMembers, icon: Users, color: "text-blue-600" },
    { title: "Active Members", value: stats.activeMembers, icon: Users, color: "text-green-600" },
    { title: "Pending Bills", value: stats.pendingBills, icon: CreditCard, color: "text-orange-600" },
    { title: "Monthly Revenue", value: `$${stats.totalRevenue}`, icon: FileText, color: "text-purple-600" },
  ]

  const handleAddMember = async (memberData: any) => {
    try {
      const newMemberData: any = {
        name: memberData.name,
        email: memberData.email,
        phone: memberData.phone,
        password: memberData.password,
        joinDate: new Date().toISOString().split("T")[0],
        active: true,
      }

      // Only add optional fields if they have values
      if (memberData.packageId && memberData.packageId !== "none") {
        newMemberData.packageId = memberData.packageId
      }
      if (memberData.dietPlanId && memberData.dietPlanId !== "none") {
        newMemberData.dietPlanId = memberData.dietPlanId
      }
      if (memberData.dietNotes && memberData.dietNotes.trim()) {
        newMemberData.dietNotes = memberData.dietNotes.trim()
      }

      await addMember(newMemberData)
      setIsAddMemberOpen(false)
      await refreshStats() // Refresh dashboard stats
    } catch (error) {
      console.error('Failed to add member:', error)
      // You could show a toast notification here
    }
  }

  const handleCreateBill = async (billData: any) => {
    try {
      const newBillData = {
        ...billData,
        paymentDate: "",
        status: "Pending" as const,
      }
      await addBill(newBillData)
      setIsCreateBillOpen(false)
      await refreshStats() // Refresh dashboard stats
    } catch (error) {
      console.error('Failed to create bill:', error)
      // You could show a toast notification here
    }
  }

  const handleEditMember = (member: any) => {
    setSelectedMember(member)
    setIsEditMemberOpen(true)
  }

  const handleUpdateMember = async (memberData: any) => {
    try {
      if (selectedMember) {
        const updatedMemberData: any = {
          name: memberData.name,
          email: memberData.email,
          phone: memberData.phone,
          password: memberData.password,
          active: memberData.active,
        }

        // Only add optional fields if they have values
        if (memberData.packageId && memberData.packageId !== "none") {
          updatedMemberData.packageId = memberData.packageId
        }
        if (memberData.dietPlanId && memberData.dietPlanId !== "none") {
          updatedMemberData.dietPlanId = memberData.dietPlanId
        }
        if (memberData.dietNotes && memberData.dietNotes.trim()) {
          updatedMemberData.dietNotes = memberData.dietNotes.trim()
        }

        await updateMember(selectedMember.id, updatedMemberData)
        setIsEditMemberOpen(false)
        setSelectedMember(null)
        await refreshStats() // Refresh dashboard stats
      }
    } catch (error) {
      console.error('Failed to update member:', error)
      // You could show a toast notification here
    }
  }

  const handleDeleteMember = (member: any) => {
    setMemberToDelete(member)
    setIsDeleteMemberOpen(true)
  }

  const confirmDeleteMember = async () => {
    try {
      if (memberToDelete) {
        await deleteMember(memberToDelete.id)
        setIsDeleteMemberOpen(false)
        setMemberToDelete(null)
        await refreshStats() // Refresh dashboard stats
      }
    } catch (error) {
      console.error('Failed to delete member:', error)
      // You could show a toast notification here
    }
  }

  // Diet Plan handlers
  const handleAddDietPlan = async (dietPlanData: any) => {
    try {
      const newDietPlanData = {
        ...dietPlanData,
        createdDate: new Date().toISOString().split("T")[0],
        active: true,
      }
      await addDietPlan(newDietPlanData)
      setIsAddDietPlanOpen(false)
    } catch (error) {
      console.error('Failed to add diet plan:', error)
    }
  }

  const handleEditDietPlan = (dietPlan: any) => {
    setSelectedDietPlan(dietPlan)
    setIsEditDietPlanOpen(true)
  }

  const handleUpdateDietPlan = async (dietPlanData: any) => {
    try {
      if (selectedDietPlan) {
        await updateDietPlan(selectedDietPlan.id, dietPlanData)
        setIsEditDietPlanOpen(false)
        setSelectedDietPlan(null)
      }
    } catch (error) {
      console.error('Failed to update diet plan:', error)
    }
  }

  const handleDeleteDietPlan = (dietPlan: any) => {
    setDietPlanToDelete(dietPlan)
    setIsDeleteDietPlanOpen(true)
  }

  const confirmDeleteDietPlan = async () => {
    try {
      if (dietPlanToDelete) {
        await deleteDietPlan(dietPlanToDelete.id)
        setIsDeleteDietPlanOpen(false)
        setDietPlanToDelete(null)
      }
    } catch (error) {
      console.error('Failed to delete diet plan:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          dashboardStats.map((stat, index) => (
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
          ))
        )}
      </div>

      {/* Main Dashboard */}
      <Tabs defaultValue="members" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="bills">Bills</TabsTrigger>
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="diet-plans">Diet Plans</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Member Management</h2>
            <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader className="space-y-3">
                  <DialogTitle className="text-xl">Add New Member</DialogTitle>
                  <DialogDescription>Enter member details below</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                                                   <MemberForm onSubmit={handleAddMember} packages={packages} dietPlans={dietPlans} />
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Member Dialog */}
            <Dialog open={isEditMemberOpen} onOpenChange={setIsEditMemberOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader className="space-y-3">
                  <DialogTitle className="text-xl">Edit Member</DialogTitle>
                  <DialogDescription>Update member details below</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  {selectedMember && (
                    <EditMemberForm 
                      onSubmit={handleUpdateMember} 
                      packages={packages} 
                      dietPlans={dietPlans}
                      member={selectedMember}
                    />
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Delete Member Confirmation Dialog */}
            <Dialog open={isDeleteMemberOpen} onOpenChange={setIsDeleteMemberOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Member</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete {memberToDelete?.name}? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDeleteMemberOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={confirmDeleteMember}
                  >
                    Delete Member
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

                     <Card>
             <CardContent className="p-0">
               {membersLoading ? (
                 <div className="p-6 text-center">Loading members...</div>
               ) : (
                 <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead>Name</TableHead>
                       <TableHead>Email</TableHead>
                       <TableHead>Phone</TableHead>
                       <TableHead>Package</TableHead>
                       <TableHead>Join Date</TableHead>
                       <TableHead>Status</TableHead>
                       <TableHead>Actions</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.phone}</TableCell>
                      <TableCell>
                                                 <Badge variant="outline">{packages.find((p) => p.id === member.packageId)?.name}</Badge>
                      </TableCell>
                      <TableCell>{member.joinDate}</TableCell>
                      <TableCell>
                        <Badge variant={member.active ? "default" : "secondary"}>
                          {member.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditMember(member)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteMember(member)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                                       ))}
                   </TableBody>
                 </Table>
               )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bills Tab */}
        <TabsContent value="bills" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Bill Management</h2>
            <Dialog open={isCreateBillOpen} onOpenChange={setIsCreateBillOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Bill
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Bill</DialogTitle>
                  <DialogDescription>Generate a bill for a member</DialogDescription>
                </DialogHeader>
                <BillForm onSubmit={handleCreateBill} members={members} />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bills.map((bill) => {
                    const member = members.find((m) => m.id === bill.memberId)
                    return (
                      <TableRow key={bill.id}>
                        <TableCell className="font-medium">{member?.name}</TableCell>
                        <TableCell>${bill.amount}</TableCell>
                        <TableCell>{bill.month}</TableCell>
                        <TableCell>{bill.paymentDate || "Not paid"}</TableCell>
                        <TableCell>
                          <Badge variant={bill.status === "Paid" ? "default" : "destructive"}>{bill.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {bill.receiptUrl && (
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Packages Tab */}
        <TabsContent value="packages" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Fee Packages</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Package
            </Button>
          </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {packagesLoading ? (
               <div className="col-span-3 text-center p-6">Loading packages...</div>
             ) : (
               packages.map((pkg) => (
              <Card key={pkg.id}>
                <CardHeader>
                  <CardTitle>{pkg.name}</CardTitle>
                  <CardDescription>{pkg.duration}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-4">${pkg.price}</div>
                  <div className="space-y-2">
                    <Button className="w-full bg-transparent" variant="outline">
                      Edit Package
                    </Button>
                    <Button className="w-full" variant="destructive">
                      Delete Package
                    </Button>
                  </div>
                </CardContent>
                               </Card>
               ))
             )}
           </div>
        </TabsContent>

        {/* Diet Plans Tab */}
        <TabsContent value="diet-plans" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Diet Plans Management</h2>
            <Dialog open={isAddDietPlanOpen} onOpenChange={setIsAddDietPlanOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Diet Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader className="space-y-3">
                  <DialogTitle className="text-xl">Add New Diet Plan</DialogTitle>
                  <DialogDescription>Create a new diet plan for members</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <DietPlanForm onSubmit={handleAddDietPlan} />
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Diet Plan Dialog */}
            <Dialog open={isEditDietPlanOpen} onOpenChange={setIsEditDietPlanOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader className="space-y-3">
                  <DialogTitle className="text-xl">Edit Diet Plan</DialogTitle>
                  <DialogDescription>Update diet plan details below</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  {selectedDietPlan && (
                    <EditDietPlanForm 
                      onSubmit={handleUpdateDietPlan} 
                      dietPlan={selectedDietPlan}
                    />
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Delete Diet Plan Confirmation Dialog */}
            <Dialog open={isDeleteDietPlanOpen} onOpenChange={setIsDeleteDietPlanOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Diet Plan</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete "{dietPlanToDelete?.name}"? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDeleteDietPlanOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={confirmDeleteDietPlan}
                  >
                    Delete Diet Plan
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              {dietPlansLoading ? (
                <div className="p-6 text-center">Loading diet plans...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Calories</TableHead>
                      <TableHead>Protein</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dietPlans.map((dietPlan) => (
                      <TableRow key={dietPlan.id}>
                        <TableCell className="font-medium">{dietPlan.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{dietPlan.type}</Badge>
                        </TableCell>
                        <TableCell>{dietPlan.calorieTarget}</TableCell>
                        <TableCell>{dietPlan.proteinTarget}g</TableCell>
                        <TableCell>
                          <Badge variant={dietPlan.active ? "default" : "secondary"}>
                            {dietPlan.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditDietPlan(dietPlan)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteDietPlan(dietPlan)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Notifications</h2>
            <Dialog open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Bell className="h-4 w-4 mr-2" />
                  Send Notification
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Notification</DialogTitle>
                  <DialogDescription>Send alerts to members</DialogDescription>
                </DialogHeader>
                <NotificationForm onSubmit={() => setIsNotificationOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium">Payment Reminder</p>
                  <p className="text-sm text-gray-600">Sent to 5 members - 2 hours ago</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium">Holiday Notice</p>
                  <p className="text-sm text-gray-600">Sent to all members - 1 day ago</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium">New Equipment</p>
                  <p className="text-sm text-gray-600">Sent to premium members - 3 days ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Reports & Analytics</h2>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Member Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>New Members (This Month)</span>
                    <span className="font-bold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Members</span>
                    <span className="font-bold">{members.filter((m) => m.active).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inactive Members</span>
                    <span className="font-bold">{members.filter((m) => !m.active).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Paid Bills</span>
                    <span className="font-bold text-green-600">{bills.filter((b) => b.status === "Paid").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending Bills</span>
                    <span className="font-bold text-orange-600">
                      {bills.filter((b) => b.status === "Pending").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Revenue</span>
                    <span className="font-bold">
                      ${bills.filter((b) => b.status === "Paid").reduce((sum, b) => sum + b.amount, 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Member Form Component
 function MemberForm({ onSubmit, packages, dietPlans }: { onSubmit: (data: any) => Promise<void>; packages: any[]; dietPlans: any[] }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    packageId: "none",
    dietPlanId: "none",
    dietNotes: "",
  })

     const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault()
     await onSubmit(formData)
     setFormData({ name: "", email: "", phone: "", password: "", packageId: "none", dietPlanId: "none", dietNotes: "" })
   }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name and Email Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">Name</Label>
          <Input
            id="name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>
      
      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
        <Input
          id="phone"
          placeholder="Enter phone number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
      </div>
      
      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>
      
      {/* Package */}
      <div className="space-y-2">
        <Label htmlFor="package" className="text-sm font-medium">Membership Package</Label>
        <Select value={formData.packageId} onValueChange={(value) => setFormData({ ...formData, packageId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select a membership package" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Package</SelectItem>
            {packages.map((pkg) => (
              <SelectItem key={pkg.id} value={pkg.id}>
                <div className="flex justify-between items-center w-full">
                  <span>{pkg.name}</span>
                  <span className="text-green-600 font-medium">${pkg.price}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Diet Plan and Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="diet-plan" className="text-sm font-medium">Diet Plan (Optional)</Label>
          <Select value={formData.dietPlanId} onValueChange={(value) => setFormData({ ...formData, dietPlanId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select a diet plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Diet Plan</SelectItem>
              {dietPlans.filter(plan => plan.active).map((plan) => (
                <SelectItem key={plan.id} value={plan.id}>
                  <div className="flex justify-between items-center w-full">
                    <span>{plan.name}</span>
                    <span className="text-blue-600 font-medium">{plan.type}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="diet-notes" className="text-sm font-medium">Diet Notes</Label>
          <Textarea
            id="diet-notes"
            placeholder="Any specific dietary requirements or notes..."
            value={formData.dietNotes}
            onChange={(e) => setFormData({ ...formData, dietNotes: e.target.value })}
            className="resize-none"
            rows={3}
          />
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="pt-4">
        <Button type="submit" className="w-full h-11 text-base">
          Add Member
        </Button>
      </div>
    </form>
  )
}

// Edit Member Form Component
function EditMemberForm({ onSubmit, packages, dietPlans, member }: { onSubmit: (data: any) => Promise<void>; packages: any[]; dietPlans: any[]; member: any }) {
  const [formData, setFormData] = useState({
    name: member.name || "",
    email: member.email || "",
    phone: member.phone || "",
    password: member.password || "",
    packageId: member.packageId || "none",
    dietPlanId: member.dietPlanId || "none",
    dietNotes: member.dietNotes || "",
    active: member.active !== undefined ? member.active : true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name and Email Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-name" className="text-sm font-medium">Name</Label>
          <Input
            id="edit-name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-email" className="text-sm font-medium">Email</Label>
          <Input
            id="edit-email"
            type="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>
      
      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="edit-phone" className="text-sm font-medium">Phone Number</Label>
        <Input
          id="edit-phone"
          placeholder="Enter phone number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
      </div>
      
      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="edit-password" className="text-sm font-medium">Password</Label>
        <Input
          id="edit-password"
          type="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>
      
      {/* Package and Status Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-package" className="text-sm font-medium">Membership Package</Label>
          <Select value={formData.packageId} onValueChange={(value) => setFormData({ ...formData, packageId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select a package" />
            </SelectTrigger>
            <SelectContent>
              {packages.map((pkg) => (
                <SelectItem key={pkg.id} value={pkg.id}>
                  <div className="flex justify-between items-center w-full">
                    <span>{pkg.name}</span>
                    <span className="text-green-600 font-medium">${pkg.price}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-status" className="text-sm font-medium">Member Status</Label>
          <Select 
            value={formData.active ? "active" : "inactive"} 
            onValueChange={(value) => setFormData({ ...formData, active: value === "active" })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Active
                </div>
              </SelectItem>
              <SelectItem value="inactive">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                  Inactive
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Diet Plan and Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-diet-plan" className="text-sm font-medium">Diet Plan (Optional)</Label>
          <Select value={formData.dietPlanId} onValueChange={(value) => setFormData({ ...formData, dietPlanId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select a diet plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Diet Plan</SelectItem>
              {dietPlans.filter(plan => plan.active).map((plan) => (
                <SelectItem key={plan.id} value={plan.id}>
                  <div className="flex justify-between items-center w-full">
                    <span>{plan.name}</span>
                    <span className="text-blue-600 font-medium">{plan.type}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-diet-notes" className="text-sm font-medium">Diet Notes</Label>
          <Textarea
            id="edit-diet-notes"
            placeholder="Any specific dietary requirements or notes..."
            value={formData.dietNotes}
            onChange={(e) => setFormData({ ...formData, dietNotes: e.target.value })}
            className="resize-none"
            rows={3}
          />
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="pt-4">
        <Button type="submit" className="w-full h-11 text-base">
          Update Member
        </Button>
      </div>
    </form>
  )
}

// Bill Form Component
 function BillForm({ onSubmit, members }: { onSubmit: (data: any) => Promise<void>; members: any[] }) {
  const [formData, setFormData] = useState({
    memberId: "",
    amount: "",
    month: "",
  })

     const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault()
     await onSubmit({ ...formData, amount: Number.parseFloat(formData.amount) })
     setFormData({ memberId: "", amount: "", month: "" })
   }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="member">Member</Label>
        <Select value={formData.memberId} onValueChange={(value) => setFormData({ ...formData, memberId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select a member" />
          </SelectTrigger>
          <SelectContent>
            {members.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="month">Month</Label>
        <Input
          id="month"
          type="month"
          value={formData.month}
          onChange={(e) => setFormData({ ...formData, month: e.target.value })}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Create Bill
      </Button>
    </form>
  )
}

// Notification Form Component
function NotificationForm({ onSubmit }: { onSubmit: () => void }) {
  const [formData, setFormData] = useState({
    message: "",
    target: "All",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle notification sending logic here
    onSubmit()
    setFormData({ message: "", target: "All" })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="target">Send To</Label>
        <Select value={formData.target} onValueChange={(value) => setFormData({ ...formData, target: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Members</SelectItem>
            <SelectItem value="Active">Active Members Only</SelectItem>
            <SelectItem value="Premium">Premium Members Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Enter your notification message..."
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Send Notification
      </Button>
    </form>
  )
}

// Diet Plan Form Component
function DietPlanForm({ onSubmit }: { onSubmit: (data: any) => Promise<void> }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "Weight Loss" as any,
    description: "",
    calorieTarget: "",
    proteinTarget: "",
    carbTarget: "",
    fatTarget: "",
    dietaryRestrictions: [] as string[],
    mealPlan: [] as any[],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const processedData = {
      ...formData,
      calorieTarget: Number.parseInt(formData.calorieTarget),
      proteinTarget: Number.parseInt(formData.proteinTarget),
      carbTarget: Number.parseInt(formData.carbTarget),
      fatTarget: Number.parseInt(formData.fatTarget),
    }
    await onSubmit(processedData)
    setFormData({
      name: "",
      type: "Weight Loss",
      description: "",
      calorieTarget: "",
      proteinTarget: "",
      carbTarget: "",
      fatTarget: "",
      dietaryRestrictions: [],
      mealPlan: [],
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name and Type Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="diet-name" className="text-sm font-medium">Plan Name</Label>
          <Input
            id="diet-name"
            placeholder="Enter diet plan name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="diet-type" className="text-sm font-medium">Plan Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Weight Loss">Weight Loss</SelectItem>
              <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
              <SelectItem value="Athletic Performance">Athletic Performance</SelectItem>
              <SelectItem value="Custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="diet-description" className="text-sm font-medium">Description</Label>
        <Textarea
          id="diet-description"
          placeholder="Describe the diet plan goals and approach..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          required
        />
      </div>

      {/* Nutritional Targets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="calories" className="text-sm font-medium">Calories</Label>
          <Input
            id="calories"
            type="number"
            placeholder="2000"
            value={formData.calorieTarget}
            onChange={(e) => setFormData({ ...formData, calorieTarget: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="protein" className="text-sm font-medium">Protein (g)</Label>
          <Input
            id="protein"
            type="number"
            placeholder="150"
            value={formData.proteinTarget}
            onChange={(e) => setFormData({ ...formData, proteinTarget: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="carbs" className="text-sm font-medium">Carbs (g)</Label>
          <Input
            id="carbs"
            type="number"
            placeholder="200"
            value={formData.carbTarget}
            onChange={(e) => setFormData({ ...formData, carbTarget: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fat" className="text-sm font-medium">Fat (g)</Label>
          <Input
            id="fat"
            type="number"
            placeholder="70"
            value={formData.fatTarget}
            onChange={(e) => setFormData({ ...formData, fatTarget: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button type="submit" className="w-full h-11 text-base">
          Create Diet Plan
        </Button>
      </div>
    </form>
  )
}

// Edit Diet Plan Form Component
function EditDietPlanForm({ onSubmit, dietPlan }: { onSubmit: (data: any) => Promise<void>; dietPlan: any }) {
  const [formData, setFormData] = useState({
    name: dietPlan.name || "",
    type: dietPlan.type || "Weight Loss",
    description: dietPlan.description || "",
    calorieTarget: dietPlan.calorieTarget?.toString() || "",
    proteinTarget: dietPlan.proteinTarget?.toString() || "",
    carbTarget: dietPlan.carbTarget?.toString() || "",
    fatTarget: dietPlan.fatTarget?.toString() || "",
    active: dietPlan.active !== undefined ? dietPlan.active : true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const processedData = {
      ...formData,
      calorieTarget: Number.parseInt(formData.calorieTarget),
      proteinTarget: Number.parseInt(formData.proteinTarget),
      carbTarget: Number.parseInt(formData.carbTarget),
      fatTarget: Number.parseInt(formData.fatTarget),
    }
    await onSubmit(processedData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name and Type Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-diet-name" className="text-sm font-medium">Plan Name</Label>
          <Input
            id="edit-diet-name"
            placeholder="Enter diet plan name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-diet-type" className="text-sm font-medium">Plan Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Weight Loss">Weight Loss</SelectItem>
              <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
              <SelectItem value="Athletic Performance">Athletic Performance</SelectItem>
              <SelectItem value="Custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="edit-diet-description" className="text-sm font-medium">Description</Label>
        <Textarea
          id="edit-diet-description"
          placeholder="Describe the diet plan goals and approach..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          required
        />
      </div>

      {/* Nutritional Targets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-calories" className="text-sm font-medium">Calories</Label>
          <Input
            id="edit-calories"
            type="number"
            placeholder="2000"
            value={formData.calorieTarget}
            onChange={(e) => setFormData({ ...formData, calorieTarget: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-protein" className="text-sm font-medium">Protein (g)</Label>
          <Input
            id="edit-protein"
            type="number"
            placeholder="150"
            value={formData.proteinTarget}
            onChange={(e) => setFormData({ ...formData, proteinTarget: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-carbs" className="text-sm font-medium">Carbs (g)</Label>
          <Input
            id="edit-carbs"
            type="number"
            placeholder="200"
            value={formData.carbTarget}
            onChange={(e) => setFormData({ ...formData, carbTarget: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-fat" className="text-sm font-medium">Fat (g)</Label>
          <Input
            id="edit-fat"
            type="number"
            placeholder="70"
            value={formData.fatTarget}
            onChange={(e) => setFormData({ ...formData, fatTarget: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="edit-diet-status" className="text-sm font-medium">Status</Label>
        <Select 
          value={formData.active ? "active" : "inactive"} 
          onValueChange={(value) => setFormData({ ...formData, active: value === "active" })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Active
              </div>
            </SelectItem>
            <SelectItem value="inactive">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                Inactive
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button type="submit" className="w-full h-11 text-base">
          Update Diet Plan
        </Button>
      </div>
    </form>
  )
}
