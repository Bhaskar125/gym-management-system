export interface Member {
    id: string
    name: string
    email: string
    phone: string
    password: string
    packageId?: string
    joinDate: string
    active: boolean
    dietPlanId?: string
    dietNotes?: string
  }
  
  export interface Bill {
    id: string
    memberId: string
    amount: number
    month: string
    paymentDate: string
    status: "Paid" | "Pending"
    receiptUrl?: string
  }
  
  export interface Notification {
    id: string
    message: string
    target: "All" | string[] // list of memberIds
    timestamp: string
  }
  
  export interface Package {
    id: string
    name: string
    price: number
    duration: string
  }
  
  export interface DietPlan {
    id: string
    name: string
    type: "Weight Loss" | "Muscle Gain" | "Maintenance" | "Athletic Performance" | "Custom"
    description: string
    calorieTarget: number
    proteinTarget: number
    carbTarget: number
    fatTarget: number
    dietaryRestrictions: string[]
    mealPlan: MealPlan[]
    createdDate: string
    active: boolean
  }
  
  export interface MealPlan {
    id: string
    mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack"
    foods: Food[]
    totalCalories: number
    notes?: string
  }
  
  export interface Food {
    name: string
    quantity: string
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  