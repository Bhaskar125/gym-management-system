import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Member, Bill, Package, Notification, DietPlan } from '@/app/types'

// Collection names
export const COLLECTIONS = {
  MEMBERS: 'members',
  BILLS: 'bills',
  PACKAGES: 'packages',
  NOTIFICATIONS: 'notifications',
  ADMINS: 'admins',
  DIET_PLANS: 'dietPlans',
} as const

// Member Operations
export const memberOperations = {
  // Create a new member
  async create(memberData: Omit<Member, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.MEMBERS), {
        ...memberData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error adding member:', error)
      throw error
    }
  },

  // Get all members
  async getAll(): Promise<Member[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.MEMBERS))
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Member[]
    } catch (error) {
      console.error('Error getting members:', error)
      throw error
    }
  },

  // Get member by ID
  async getById(id: string): Promise<Member | null> {
    try {
      const docRef = doc(db, COLLECTIONS.MEMBERS, id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Member
      }
      return null
    } catch (error) {
      console.error('Error getting member:', error)
      throw error
    }
  },

  // Update member
  async update(id: string, memberData: Partial<Member>) {
    try {
      const docRef = doc(db, COLLECTIONS.MEMBERS, id)
      await updateDoc(docRef, {
        ...memberData,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error('Error updating member:', error)
      throw error
    }
  },

  // Delete member
  async delete(id: string) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.MEMBERS, id))
    } catch (error) {
      console.error('Error deleting member:', error)
      throw error
    }
  },

  // Search members
  async search(searchTerm: string): Promise<Member[]> {
    try {
      const membersRef = collection(db, COLLECTIONS.MEMBERS)
      const querySnapshot = await getDocs(membersRef)
      
      const members = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Member[]

      // Client-side filtering for search (Firestore doesn't support complex text search)
      return members.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone.includes(searchTerm) ||
        member.id.includes(searchTerm)
      )
    } catch (error) {
      console.error('Error searching members:', error)
      throw error
    }
  },

  // Listen to real-time updates
  onSnapshot(callback: (members: Member[]) => void) {
    const unsubscribe = onSnapshot(collection(db, COLLECTIONS.MEMBERS), (snapshot) => {
      const members = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Member[]
      callback(members)
    })
    return unsubscribe
  },
}

// Bill Operations
export const billOperations = {
  // Create a new bill
  async create(billData: Omit<Bill, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.BILLS), {
        ...billData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error adding bill:', error)
      throw error
    }
  },

  // Get bills for a specific member
  async getByMemberId(memberId: string): Promise<Bill[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.BILLS),
        where('memberId', '==', memberId),
        orderBy('month', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Bill[]
    } catch (error) {
      console.error('Error getting bills:', error)
      throw error
    }
  },

  // Get all bills
  async getAll(): Promise<Bill[]> {
    try {
      const q = query(collection(db, COLLECTIONS.BILLS), orderBy('month', 'desc'))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Bill[]
    } catch (error) {
      console.error('Error getting all bills:', error)
      throw error
    }
  },

  // Update bill (e.g., mark as paid)
  async update(id: string, billData: Partial<Bill>) {
    try {
      const docRef = doc(db, COLLECTIONS.BILLS, id)
      await updateDoc(docRef, {
        ...billData,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error('Error updating bill:', error)
      throw error
    }
  },

  // Delete bill
  async delete(id: string) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.BILLS, id))
    } catch (error) {
      console.error('Error deleting bill:', error)
      throw error
    }
  },

  // Get pending bills
  async getPending(): Promise<Bill[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.BILLS),
        where('status', '==', 'Pending'),
        orderBy('month', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Bill[]
    } catch (error) {
      console.error('Error getting pending bills:', error)
      throw error
    }
  },
}

// Package Operations
export const packageOperations = {
  // Create a new package
  async create(packageData: Omit<Package, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.PACKAGES), {
        ...packageData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error adding package:', error)
      throw error
    }
  },

  // Get all packages
  async getAll(): Promise<Package[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.PACKAGES))
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Package[]
    } catch (error) {
      console.error('Error getting packages:', error)
      throw error
    }
  },

  // Update package
  async update(id: string, packageData: Partial<Package>) {
    try {
      const docRef = doc(db, COLLECTIONS.PACKAGES, id)
      await updateDoc(docRef, {
        ...packageData,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error('Error updating package:', error)
      throw error
    }
  },

  // Delete package
  async delete(id: string) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.PACKAGES, id))
    } catch (error) {
      console.error('Error deleting package:', error)
      throw error
    }
  },
}

// Notification Operations
export const notificationOperations = {
  // Create a new notification
  async create(notificationData: Omit<Notification, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), {
        ...notificationData,
        timestamp: serverTimestamp(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error adding notification:', error)
      throw error
    }
  },

  // Get all notifications
  async getAll(): Promise<Notification[]> {
    try {
      const q = query(collection(db, COLLECTIONS.NOTIFICATIONS), orderBy('timestamp', 'desc'))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Notification[]
    } catch (error) {
      console.error('Error getting notifications:', error)
      throw error
    }
  },

  // Delete notification
  async delete(id: string) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.NOTIFICATIONS, id))
    } catch (error) {
      console.error('Error deleting notification:', error)
      throw error
    }
  },
}

// Diet Plan Operations
export const dietPlanOperations = {
  // Create a new diet plan
  async create(dietPlanData: Omit<DietPlan, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.DIET_PLANS), {
        ...dietPlanData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error adding diet plan:', error)
      throw error
    }
  },

  // Get all diet plans
  async getAll(): Promise<DietPlan[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.DIET_PLANS))
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as DietPlan[]
    } catch (error) {
      console.error('Error getting diet plans:', error)
      throw error
    }
  },

  // Get active diet plans
  async getActive(): Promise<DietPlan[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.DIET_PLANS),
        where('active', '==', true),
        orderBy('name')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as DietPlan[]
    } catch (error) {
      console.error('Error getting active diet plans:', error)
      throw error
    }
  },

  // Get diet plan by ID
  async getById(id: string): Promise<DietPlan | null> {
    try {
      const docRef = doc(db, COLLECTIONS.DIET_PLANS, id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as DietPlan
      }
      return null
    } catch (error) {
      console.error('Error getting diet plan:', error)
      throw error
    }
  },

  // Update a diet plan
  async update(id: string, updates: Partial<DietPlan>) {
    try {
      const docRef = doc(db, COLLECTIONS.DIET_PLANS, id)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error('Error updating diet plan:', error)
      throw error
    }
  },

  // Delete a diet plan
  async delete(id: string) {
    try {
      const docRef = doc(db, COLLECTIONS.DIET_PLANS, id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Error deleting diet plan:', error)
      throw error
    }
  },

  // Listen to diet plan changes
  subscribe(callback: (dietPlans: DietPlan[]) => void) {
    const q = query(
      collection(db, COLLECTIONS.DIET_PLANS),
      orderBy('name')
    )
    
    return onSnapshot(q, (querySnapshot) => {
      const dietPlans = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as DietPlan[]
      callback(dietPlans)
    })
  },

  // Get diet plans by type
  async getByType(type: DietPlan['type']): Promise<DietPlan[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.DIET_PLANS),
        where('type', '==', type),
        where('active', '==', true),
        orderBy('name')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as DietPlan[]
    } catch (error) {
      console.error('Error getting diet plans by type:', error)
      throw error
    }
  },
}

// Analytics Operations
export const analyticsOperations = {
  // Get dashboard stats
  async getDashboardStats() {
    try {
      const [members, bills, packages] = await Promise.all([
        memberOperations.getAll(),
        billOperations.getAll(),
        packageOperations.getAll(),
      ])

      const activeMembers = members.filter(m => m.active)
      const pendingBills = bills.filter(b => b.status === 'Pending')
      const paidBills = bills.filter(b => b.status === 'Paid')
      const totalRevenue = paidBills.reduce((sum, bill) => sum + bill.amount, 0)

      return {
        totalMembers: members.length,
        activeMembers: activeMembers.length,
        inactiveMembers: members.length - activeMembers.length,
        pendingBills: pendingBills.length,
        totalRevenue,
        totalPackages: packages.length,
      }
    } catch (error) {
      console.error('Error getting dashboard stats:', error)
      throw error
    }
  },
}