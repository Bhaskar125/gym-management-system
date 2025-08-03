"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Database, CheckCircle, AlertCircle, Loader } from "lucide-react"
import { seedDatabase } from "@/lib/firebase-seed"

export default function FirebaseSetup() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedResult, setSeedResult] = useState<{ success: boolean; message?: string; error?: any } | null>(null)

  const handleSeedDatabase = async () => {
    setIsSeeding(true)
    setSeedResult(null)
    
    try {
      const result = await seedDatabase()
      setSeedResult(result)
    } catch (error) {
      setSeedResult({ success: false, error })
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Firebase Database Setup
          </CardTitle>
          <CardDescription>
            Initialize your Firebase database with sample data for the gym management system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-medium">This will create:</h4>
            <div className="grid grid-cols-2 gap-2">
              <Badge variant="outline">📦 3 Membership Packages</Badge>
              <Badge variant="outline">👥 3 Sample Members</Badge>
              <Badge variant="outline">💳 9 Sample Bills</Badge>
              <Badge variant="outline">📢 2 Notifications</Badge>
            </div>
          </div>

          {seedResult && (
            <Alert>
              {seedResult.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {seedResult.success 
                  ? "✅ Database seeded successfully! You can now use the admin dashboard."
                  : `❌ Failed to seed database: ${seedResult.error?.message || 'Unknown error'}`
                }
              </AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleSeedDatabase} 
            disabled={isSeeding}
            className="w-full"
          >
            {isSeeding ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Seeding Database...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Seed Database with Sample Data
              </>
            )}
          </Button>

          <div className="text-sm text-muted-foreground">
            <p><strong>Note:</strong> Make sure you have:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Created a Firebase project</li>
              <li>Enabled Firestore Database</li>
              <li>Set up environment variables in .env.local</li>
              <li>Updated Firestore security rules for development</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}