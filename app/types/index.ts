export interface Member {
    id: string
    name: string
    email: string
    phone: string
    packageId: string
    joinDate: string
    active: boolean
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
  