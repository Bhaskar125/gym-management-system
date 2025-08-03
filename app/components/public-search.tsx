"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, User, Calendar, Package, Phone, Mail } from "lucide-react"

// Mock data for public search using the new simplified types
const mockPublicMembers = [
  { 
    id: "1", 
    name: "John Doe", 
    email: "john@example.com",
    phone: "+1234567890",
    packageId: "premium", 
    joinDate: "2024-01-15", 
    active: true 
  },
  { 
    id: "2", 
    name: "Jane Smith", 
    email: "jane@example.com",
    phone: "+1234567891",
    packageId: "basic", 
    joinDate: "2024-02-01", 
    active: true 
  },
  { 
    id: "3", 
    name: "Mike Johnson", 
    email: "mike@example.com",
    phone: "+1234567892",
    packageId: "annual", 
    joinDate: "2024-01-20", 
    active: false 
  },
  { 
    id: "4", 
    name: "Sarah Wilson", 
    email: "sarah@example.com",
    phone: "+1234567893",
    packageId: "premium", 
    joinDate: "2024-01-10", 
    active: true 
  },
  { 
    id: "5", 
    name: "David Brown", 
    email: "david@example.com",
    phone: "+1234567894",
    packageId: "basic", 
    joinDate: "2024-02-15", 
    active: true 
  },
]

const mockPackages = [
  { id: "basic", name: "Basic Plan", price: 50, duration: "1 month" },
  { id: "premium", name: "Premium Plan", price: 100, duration: "1 month" },
  { id: "annual", name: "Annual Plan", price: 500, duration: "12 months" },
]

export default function PublicSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)

    // Mock search functionality
    setTimeout(() => {
      const results = mockPublicMembers.filter(
        (member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.id.includes(searchTerm) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.phone.includes(searchTerm)
      )
      setSearchResults(results)
      setIsSearching(false)
    }, 500)
  }

  const clearSearch = () => {
    setSearchTerm("")
    setSearchResults([])
  }

  const getPackageName = (packageId: string) => {
    const pkg = mockPackages.find(p => p.id === packageId)
    return pkg ? pkg.name : 'Unknown'
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg">
        <h1 className="text-4xl font-bold mb-4">💪 Member Directory</h1>
        <p className="text-xl opacity-90">Search and connect with our gym community</p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Member Search
          </CardTitle>
          <CardDescription>
            Search for gym members by name, ID, email, or phone number
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <Input
                id="search"
                type="text"
                placeholder="Enter member name, ID, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={isSearching || !searchTerm.trim()}>
              {isSearching ? "Searching..." : "Search"}
            </Button>
            {searchResults.length > 0 && (
              <Button type="button" variant="outline" onClick={clearSearch}>
                Clear
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Search Statistics */}
      {searchResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Results</p>
                  <p className="text-2xl font-bold">{searchResults.length}</p>
                </div>
                <User className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Members</p>
                  <p className="text-2xl font-bold text-green-600">
                    {searchResults.filter((m) => m.active).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Premium Members</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {searchResults.filter((m) => m.packageId === "premium").length}
                  </p>
                </div>
                <Package className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Basic Members</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {searchResults.filter((m) => m.packageId === "basic").length}
                  </p>
                </div>
                <User className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>
              Found {searchResults.length} member(s) matching your search
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-mono text-sm">{member.id}</TableCell>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />
                          {member.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1" />
                          {member.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getPackageName(member.packageId)}</Badge>
                    </TableCell>
                    <TableCell>{new Date(member.joinDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={member.active ? "default" : "secondary"}>
                        {member.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {searchTerm && searchResults.length === 0 && !isSearching && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">
              No members found matching "{searchTerm}". Try searching with a different term.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Initial State */}
      {!searchTerm && searchResults.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Search for Members</h3>
            <p className="text-gray-600 mb-6">
              Enter a member name, ID, email, or phone number to search our member database.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900">Total Members</h4>
                <p className="text-2xl font-bold text-blue-600">{mockPublicMembers.length}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900">Active Members</h4>
                <p className="text-2xl font-bold text-green-600">
                  {mockPublicMembers.filter(m => m.active).length}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-900">Packages Available</h4>
                <p className="text-2xl font-bold text-purple-600">{mockPackages.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Package Information */}
      <Card>
        <CardHeader>
          <CardTitle>Available Membership Packages</CardTitle>
          <CardDescription>Choose the package that best fits your fitness goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="p-6 border rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
                <p className="text-3xl font-bold text-blue-600 mb-2">${pkg.price}</p>
                <p className="text-gray-600 mb-4">Duration: {pkg.duration}</p>
                <Button className="w-full">Get Started</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}