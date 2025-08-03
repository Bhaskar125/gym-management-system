# Firebase Setup Guide for Gym Management System

## 🚀 Quick Setup Steps

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `gym-management-system`
4. Enable Google Analytics (optional)
5. Create project

### 2. Enable Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location closest to you
5. Click "Done"

### 3. Enable Authentication (Optional)
1. Go to "Authentication" in Firebase Console
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Save changes

### 4. Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" 
3. Click "Web" app icon (`</>`)
4. Register app with name: `gym-management-system`
5. Copy the configuration object

### 5. Set Up Environment Variables
1. Create `.env.local` file in your project root
2. Copy values from `.env.example`
3. Replace with your actual Firebase config values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-actual-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_actual_app_id
```

### 6. Update Firestore Security Rules
In Firebase Console > Firestore Database > Rules, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all reads and writes for development
    // TODO: Implement proper security rules for production
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **Important**: These rules allow all access. Implement proper security rules before production!

### 7. Seed Initial Data (Optional)
Add this to a component or create a seed script:

```typescript
import { seedDatabase } from '@/lib/firebase-seed'

// Call this once to populate initial data
await seedDatabase()
```

## 📊 Database Collections Structure

### Members Collection (`members`)
```typescript
{
  id: string (auto-generated)
  name: string
  email: string
  phone: string
  packageId: string
  joinDate: string
  active: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Bills Collection (`bills`)
```typescript
{
  id: string (auto-generated)
  memberId: string
  amount: number
  month: string
  paymentDate: string
  status: "Paid" | "Pending"
  receiptUrl?: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Packages Collection (`packages`)
```typescript
{
  id: string (auto-generated)
  name: string
  price: number
  duration: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Notifications Collection (`notifications`)
```typescript
{
  id: string (auto-generated)
  message: string
  target: "All" | string[]
  timestamp: timestamp
}
```

## 🔧 Usage in Components

### Using Firebase Hooks
```typescript
import { useMembers, useBills, usePackages } from '@/hooks/use-firebase-data'

function MyComponent() {
  const { members, loading, addMember } = useMembers()
  const { bills, payBill } = useBills()
  const { packages } = usePackages()

  // Your component logic
}
```

### Direct Firebase Operations
```typescript
import { memberOperations, billOperations } from '@/lib/firebase-operations'

// Add a new member
await memberOperations.create({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  packageId: 'premium',
  joinDate: '2024-01-15',
  active: true
})

// Update a bill
await billOperations.update('bill-id', {
  status: 'Paid',
  paymentDate: '2024-03-15'
})
```

## 🛡️ Security Considerations

1. **Environment Variables**: Never commit `.env.local` to git
2. **Firestore Rules**: Implement proper security rules before production
3. **Authentication**: Add user authentication for admin access
4. **Data Validation**: Validate data before writing to database
5. **Error Handling**: Implement proper error handling and user feedback

## 📱 Real-time Updates

The Firebase setup includes real-time listeners for:
- Member list updates
- Bill status changes  
- New notifications

Components will automatically update when data changes!

## 🚨 Troubleshooting

### Common Issues:
1. **"Firebase not initialized"**: Check `.env.local` file exists and has correct values
2. **"Permission denied"**: Update Firestore security rules
3. **"Network error"**: Check internet connection and Firebase project status
4. **"Quota exceeded"**: Check Firebase usage limits in console

### Debug Mode:
Add this to see Firebase operations in console:
```typescript
// In lib/firebase-operations.ts, uncomment console.log statements
```

---

🎉 **You're all set!** Your gym management system now has a complete Firebase backend with real-time data synchronization.