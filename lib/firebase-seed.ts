// This file contains seed data to populate your Firebase database
// Run this once to set up initial data for testing

import { 
  memberOperations, 
  billOperations, 
  packageOperations, 
  notificationOperations,
  dietPlanOperations 
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

  dietPlans: [
    {
      name: 'Weight Loss Pro',
      type: 'Weight Loss' as const,
      description: 'A comprehensive weight loss plan focusing on caloric deficit and balanced nutrition.',
      calorieTarget: 1800,
      proteinTarget: 140,
      carbTarget: 150,
      fatTarget: 60,
      dietaryRestrictions: ['No processed foods', 'Low sugar'],
      mealPlan: [
        {
          id: '1',
          mealType: 'Breakfast' as const,
          foods: [
            { name: 'Oatmeal', quantity: '1 cup', calories: 300, protein: 10, carbs: 54, fat: 6 },
            { name: 'Banana', quantity: '1 medium', calories: 105, protein: 1, carbs: 27, fat: 0 },
          ],
          totalCalories: 405,
          notes: 'High fiber start to the day'
        }
      ],
      createdDate: '2024-01-01',
      active: true,
    },
    {
      name: 'Muscle Builder',
      type: 'Muscle Gain' as const,
      description: 'High protein plan designed for muscle building and strength gains.',
      calorieTarget: 2800,
      proteinTarget: 220,
      carbTarget: 280,
      fatTarget: 93,
      dietaryRestrictions: ['Lactose-free options available'],
      mealPlan: [
        {
          id: '1',
          mealType: 'Breakfast' as const,
          foods: [
            { name: 'Protein Shake', quantity: '1 scoop', calories: 120, protein: 25, carbs: 3, fat: 1 },
            { name: 'Whole Eggs', quantity: '3 large', calories: 210, protein: 18, carbs: 1, fat: 15 },
          ],
          totalCalories: 330,
          notes: 'Post-workout protein boost'
        }
      ],
      createdDate: '2024-01-01',
      active: true,
    },
    {
      name: 'Maintenance Plus',
      type: 'Maintenance' as const,
      description: 'Balanced nutrition plan for maintaining current weight and overall health.',
      calorieTarget: 2200,
      proteinTarget: 165,
      carbTarget: 220,
      fatTarget: 77,
      dietaryRestrictions: [],
      mealPlan: [
        {
          id: '1',
          mealType: 'Lunch' as const,
          foods: [
            { name: 'Grilled Chicken', quantity: '6 oz', calories: 280, protein: 53, carbs: 0, fat: 6 },
            { name: 'Brown Rice', quantity: '1 cup', calories: 220, protein: 5, carbs: 45, fat: 2 },
          ],
          totalCalories: 500,
          notes: 'Balanced macro meal'
        }
      ],
      createdDate: '2024-01-01',
      active: true,
    },
    {
      name: 'Athletic Performance',
      type: 'Athletic Performance' as const,
      description: 'Optimized nutrition for athletes focusing on performance and recovery.',
      calorieTarget: 3200,
      proteinTarget: 200,
      carbTarget: 400,
      fatTarget: 107,
      dietaryRestrictions: ['Gluten-free', 'Anti-inflammatory focus'],
      mealPlan: [
        {
          id: '1',
          mealType: 'Snack' as const,
          foods: [
            { name: 'Greek Yogurt', quantity: '1 cup', calories: 150, protein: 20, carbs: 9, fat: 4 },
            { name: 'Berries', quantity: '1/2 cup', calories: 40, protein: 1, carbs: 10, fat: 0 },
          ],
          totalCalories: 190,
          notes: 'Recovery snack'
        }
      ],
      createdDate: '2024-01-01',
      active: true,
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
      dietNotes: 'Looking to build muscle mass, prefer protein-heavy meals',
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com', 
      phone: '+1234567891',
      packageId: 'basic',
      joinDate: '2024-02-01',
      active: true,
      dietNotes: 'Weight loss goal, no dairy products',
    },
    {
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+1234567892', 
      packageId: 'annual',
      joinDate: '2024-01-20',
      active: false,
      dietNotes: 'Maintaining current fitness level',
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

    // Seed diet plans
    console.log('🥗 Seeding diet plans...')
    const dietPlanIds: string[] = []
    for (const dietPlanData of seedData.dietPlans) {
      const dietPlanId = await dietPlanOperations.create(dietPlanData)
      dietPlanIds.push(dietPlanId)
    }

    // Seed members
    console.log('👥 Seeding members...')
    const memberIds: string[] = []
    for (let i = 0; i < seedData.members.length; i++) {
      const memberData = seedData.members[i]
      
      // Assign diet plans to some members based on their profile
      let memberWithDietPlan = { ...memberData }
      if (i === 0 && dietPlanIds.length > 1) {
        // John Doe gets Muscle Builder diet plan
        memberWithDietPlan.dietPlanId = dietPlanIds[1]
      } else if (i === 1 && dietPlanIds.length > 0) {
        // Jane Smith gets Weight Loss Pro diet plan
        memberWithDietPlan.dietPlanId = dietPlanIds[0]
      } else if (i === 2 && dietPlanIds.length > 2) {
        // Mike Johnson gets Maintenance Plus diet plan
        memberWithDietPlan.dietPlanId = dietPlanIds[2]
      }
      
      const memberId = await memberOperations.create(memberWithDietPlan)
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