import { db } from './firebase'
import { collection, addDoc, getDocs, connectFirestoreEmulator } from 'firebase/firestore'

// Test Firebase connection with timeout
export async function testFirebaseConnection() {
  const timeout = 10000 // 10 seconds timeout
  
  console.log('🔍 Testing Firebase connection...')
  
  try {
    // Test basic connection with timeout
    const testPromise = new Promise(async (resolve, reject) => {
      try {
        // Try to read from a collection (this will test connection)
        const testCollection = collection(db, 'test')
        const snapshot = await getDocs(testCollection)
        resolve({ success: true, collections: snapshot.size })
      } catch (error) {
        reject(error)
      }
    })

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout')), timeout)
    })

    const result = await Promise.race([testPromise, timeoutPromise]) as any
    
    console.log('✅ Firebase connection successful!')
    console.log(`📊 Collections found: ${result.collections}`)
    return { success: true, ...result }
    
  } catch (error: any) {
    console.error('❌ Firebase connection failed:', error.message)
    
    if (error.message.includes('timeout')) {
      return { 
        success: false, 
        error: 'Connection timeout - check your internet connection and Firebase config' 
      }
    }
    
    if (error.code === 'permission-denied') {
      return { 
        success: false, 
        error: 'Permission denied - check your Firestore security rules' 
      }
    }
    
    return { success: false, error: error.message }
  }
}

// Test basic write operation
export async function testFirebaseWrite() {
  console.log('✍️ Testing Firebase write operations...')
  
  try {
    const testDoc = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Firebase write test'
    }
    
    const writePromise = addDoc(collection(db, 'test'), testDoc)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Write timeout')), 10000)
    })
    
    const docRef = await Promise.race([writePromise, timeoutPromise])
    
    console.log('✅ Firebase write test successful!')
    console.log(`📝 Test document created with ID: ${(docRef as any).id}`)
    
    return { success: true, docId: (docRef as any).id }
    
  } catch (error: any) {
    console.error('❌ Firebase write test failed:', error.message)
    return { success: false, error: error.message }
  }
}

// Improved seeding with better error handling
export async function quickSeed() {
  console.log('🌱 Starting quick seed test...')
  
  try {
    // Test connection first
    const connectionTest = await testFirebaseConnection()
    if (!connectionTest.success) {
      throw new Error(`Connection failed: ${connectionTest.error}`)
    }
    
    // Test write permissions
    const writeTest = await testFirebaseWrite()
    if (!writeTest.success) {
      throw new Error(`Write failed: ${writeTest.error}`)
    }
    
    // If both tests pass, try to create one real document
    console.log('📦 Creating test package...')
    const packageDoc = {
      name: 'Test Package',
      price: 50,
      duration: '1 month',
      createdAt: new Date(),
    }
    
    const packageRef = await addDoc(collection(db, 'packages'), packageDoc)
    console.log(`✅ Test package created: ${packageRef.id}`)
    
    return { 
      success: true, 
      message: 'Quick seed successful! Firebase is working properly.',
      testDocId: writeTest.docId,
      packageId: packageRef.id 
    }
    
  } catch (error: any) {
    console.error('❌ Quick seed failed:', error)
    return { 
      success: false, 
      error: error.message,
      suggestion: getErrorSuggestion(error.message)
    }
  }
}

function getErrorSuggestion(errorMessage: string): string {
  if (errorMessage.includes('permission-denied')) {
    return 'Update your Firestore security rules to allow reads and writes'
  }
  
  if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
    return 'Check your internet connection and Firebase project settings'
  }
  
  if (errorMessage.includes('not-found')) {
    return 'Make sure your Firebase project exists and Firestore is enabled'
  }
  
  if (errorMessage.includes('invalid-api-key')) {
    return 'Check your Firebase API key in .env.local'
  }
  
  return 'Check your Firebase configuration and try again'
}