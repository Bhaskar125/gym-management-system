// This file contains seed data to populate your Firebase database
// Run this once to set up initial data for testing

import { 
  memberOperations, 
  billOperations, 
  packageOperations, 
  notificationOperations 
} from './firebase-operations'

export const seedData = {
  packages: [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 50,
      duration: '1 month',
    },
    {
      id: 'premium', 
      name: 'Premium Plan',
      price: 100,
      duration: '1 month',
    },
    {
      id: 'annual',
      name: 'Annual Plan', 
      price: 500,
      duration: '12 months',
    },
  ],

  members: [
    {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      packageId: 'premium',
      joinDate: '2024-01-15',
      active: true,
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com', 
      phone: '+1234567891',
      packageId: 'basic',
      joinDate: '2024-02-01',
      active: true,
    },
    {
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+1234567892', 
      packageId: 'annual',
      joinDate: '2024-01-20',
      active: false,
    },
  ],

  notifications: [
    {
      message: 'Welcome to GymPro! Please complete your profile.',
      target: 'All',
      timestamp: new Date().toISOString(),
    },
    {
      message: 'Monthly payment reminder - due in 3 days.',
      target: 'All',
      timestamp: new Date().toISOString(),
    },
  ],
}

// Function to seed the database
export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')

    // Seed packages first
    console.log('📦 Seeding packages...')
    for (const packageData of seedData.packages) {
      const { id, ...data } = packageData
      await packageOperations.create(data)
    }

    // Seed members
    console.log('👥 Seeding members...')
    const memberIds: string[] = []
    for (const memberData of seedData.members) {
      const memberId = await memberOperations.create(memberData)
      memberIds.push(memberId)
    }

    // Seed bills for members
    console.log('💳 Seeding bills...')
    for (let i = 0; i < memberIds.length; i++) {
      const memberId = memberIds[i]
      
      // Create a few bills for each member
      const bills = [
        {
          memberId,
          amount: i === 0 ? 100 : i === 1 ? 50 : 500, // Based on package
          month: '2024-01',
          paymentDate: '2024-01-15',
          status: 'Paid' as const,
          receiptUrl: `/receipts/${memberId}-2024-01.pdf`,
        },
        {
          memberId,
          amount: i === 0 ? 100 : i === 1 ? 50 : 500,
          month: '2024-02', 
          paymentDate: '2024-02-15',
          status: 'Paid' as const,
          receiptUrl: `/receipts/${memberId}-2024-02.pdf`,
        },
        {
          memberId,
          amount: i === 0 ? 100 : i === 1 ? 50 : 500,
          month: '2024-03',
          paymentDate: '',
          status: 'Pending' as const,
        },
      ]

      for (const billData of bills) {
        await billOperations.create(billData)
      }
    }

    // Seed notifications
    console.log('📢 Seeding notifications...')
    for (const notificationData of seedData.notifications) {
      await notificationOperations.create(notificationData)
    }

    console.log('✅ Database seeding completed successfully!')
    return { success: true, message: 'Database seeded successfully' }

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    return { success: false, error }
  }
}

// Helper function to clear all data (use with caution!)
export async function clearDatabase() {
  console.log('⚠️  This will clear all data from the database')
  // Implementation would involve getting all documents and deleting them
  // Only use for development/testing
}