"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  Database, 
  CheckCircle, 
  AlertCircle, 
  Loader, 
  Wifi, 
  Lock, 
  Settings,
  RefreshCw 
} from "lucide-react"
import { testFirebaseConnection, testFirebaseWrite, quickSeed } from "@/lib/firebase-test"

interface TestResult {
  success: boolean
  message?: string
  error?: string
  suggestion?: string
  [key: string]: any
}

export default function FirebaseDebug() {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<{
    connection?: TestResult
    write?: TestResult
    seed?: TestResult
  }>({})

  const runFullDiagnostic = async () => {
    setIsRunning(true)
    setResults({})

    // Test 1: Connection
    console.log('🔍 Running connection test...')
    const connectionResult = await testFirebaseConnection()
    setResults(prev => ({ ...prev, connection: connectionResult }))
    
    if (!connectionResult.success) {
      setIsRunning(false)
      return
    }

    // Test 2: Write permissions
    console.log('✍️ Running write test...')
    const writeResult = await testFirebaseWrite()
    setResults(prev => ({ ...prev, write: writeResult }))
    
    if (!writeResult.success) {
      setIsRunning(false)
      return
    }

    // Test 3: Quick seed
    console.log('🌱 Running quick seed...')
    const seedResult = await quickSeed()
    setResults(prev => ({ ...prev, seed: seedResult }))

    setIsRunning(false)
  }

  const TestResultCard = ({ title, result, icon: Icon }: { 
    title: string, 
    result?: TestResult, 
    icon: any 
  }) => (
    <Card className={`${result?.success === true ? 'border-green-200 bg-green-50' : 
                       result?.success === false ? 'border-red-200 bg-red-50' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-sm">
          <Icon className="h-4 w-4 mr-2" />
          {title}
          {result && (
            result.success ? (
              <CheckCircle className="h-4 w-4 ml-auto text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 ml-auto text-red-600" />
            )
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {!result ? (
          <div className="text-sm text-gray-500">Not tested yet</div>
        ) : (
          <div className="space-y-2">
            <div className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
              {result.success ? '✅ Success' : '❌ Failed'}
            </div>
            {result.error && (
              <div className="text-xs text-red-600 bg-red-100 p-2 rounded">
                {result.error}
              </div>
            )}
            {result.suggestion && (
              <div className="text-xs text-orange-600 bg-orange-100 p-2 rounded">
                💡 {result.suggestion}
              </div>
            )}
            {result.message && (
              <div className="text-xs text-green-600">
                {result.message}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Firebase Diagnostic Tool
          </CardTitle>
          <CardDescription>
            Diagnose Firebase connection and permission issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={runFullDiagnostic} 
            disabled={isRunning}
            className="w-full mb-6"
          >
            {isRunning ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Running Diagnostics...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Run Full Diagnostic
              </>
            )}
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TestResultCard
              title="Connection Test"
              result={results.connection}
              icon={Wifi}
            />
            <TestResultCard
              title="Write Permissions"
              result={results.write}
              icon={Lock}
            />
            <TestResultCard
              title="Quick Seed"
              result={results.seed}
              icon={Database}
            />
          </div>

          {/* Configuration Check */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-sm">Configuration Check</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span>API Key:</span>
                  <Badge variant="outline">
                    {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Auth Domain:</span>
                  <Badge variant="outline">
                    {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Project ID:</span>
                  <Badge variant="outline">
                    {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>App ID:</span>
                  <Badge variant="outline">
                    {process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Common Issues */}
          <Alert className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Common Issues:</strong>
              <ul className="mt-2 text-xs space-y-1">
                <li>• <strong>Permission denied:</strong> Update Firestore security rules</li>
                <li>• <strong>Connection timeout:</strong> Check internet connection</li>
                <li>• <strong>Not found:</strong> Enable Firestore in Firebase Console</li>
                <li>• <strong>Invalid API key:</strong> Check .env.local configuration</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}