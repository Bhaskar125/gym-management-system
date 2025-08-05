import { useState, useEffect } from 'react'
import { 
  memberOperations, 
  billOperations, 
  packageOperations, 
  notificationOperations,
  analyticsOperations,
  dietPlanOperations
} from '@/lib/firebase-operations'
import type { Member, Bill, Package, Notification, DietPlan } from '@/app/types'

// Hook for managing members
export function useMembers() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = memberOperations.onSnapshot((updatedMembers) => {
      setMembers(updatedMembers)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const addMember = async (memberData: Omit<Member, 'id'>) => {
    try {
      await memberOperations.create(memberData)
    } catch (err) {
      setError('Failed to add member')
      throw err
    }
  }

  const updateMember = async (id: string, memberData: Partial<Member>) => {
    try {
      await memberOperations.update(id, memberData)
    } catch (err) {
      setError('Failed to update member')
      throw err
    }
  }

  const deleteMember = async (id: string) => {
    try {
      await memberOperations.delete(id)
    } catch (err) {
      setError('Failed to delete member')
      throw err
    }
  }

  const searchMembers = async (searchTerm: string) => {
    try {
      setLoading(true)
      const results = await memberOperations.search(searchTerm)
      return results
    } catch (err) {
      setError('Failed to search members')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    members,
    loading,
    error,
    addMember,
    updateMember,
    deleteMember,
    searchMembers,
  }
}

// Hook for managing bills
export function useBills(memberId?: string) {
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true)
        const fetchedBills = memberId 
          ? await billOperations.getByMemberId(memberId)
          : await billOperations.getAll()
        setBills(fetchedBills)
      } catch (err) {
        setError('Failed to fetch bills')
      } finally {
        setLoading(false)
      }
    }

    fetchBills()
  }, [memberId])

  const addBill = async (billData: Omit<Bill, 'id'>) => {
    try {
      const id = await billOperations.create(billData)
      const newBill = { id, ...billData }
      setBills(prev => [newBill, ...prev])
    } catch (err) {
      setError('Failed to add bill')
      throw err
    }
  }

  const updateBill = async (id: string, billData: Partial<Bill>) => {
    try {
      await billOperations.update(id, billData)
      setBills(prev => prev.map(bill => 
        bill.id === id ? { ...bill, ...billData } : bill
      ))
    } catch (err) {
      setError('Failed to update bill')
      throw err
    }
  }

  const deleteBill = async (id: string) => {
    try {
      await billOperations.delete(id)
      setBills(prev => prev.filter(bill => bill.id !== id))
    } catch (err) {
      setError('Failed to delete bill')
      throw err
    }
  }

  const payBill = async (id: string) => {
    const paymentDate = new Date().toISOString().split('T')[0]
    await updateBill(id, { 
      status: 'Paid',
      paymentDate,
      receiptUrl: `/receipts/${id}.pdf`
    })
  }

  return {
    bills,
    loading,
    error,
    addBill,
    updateBill,
    deleteBill,
    payBill,
  }
}

// Hook for managing packages
export function usePackages() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const fetchedPackages = await packageOperations.getAll()
        setPackages(fetchedPackages)
      } catch (err) {
        setError('Failed to fetch packages')
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [])

  const addPackage = async (packageData: Omit<Package, 'id'>) => {
    try {
      const id = await packageOperations.create(packageData)
      const newPackage = { id, ...packageData }
      setPackages(prev => [...prev, newPackage])
    } catch (err) {
      setError('Failed to add package')
      throw err
    }
  }

  const updatePackage = async (id: string, packageData: Partial<Package>) => {
    try {
      await packageOperations.update(id, packageData)
      setPackages(prev => prev.map(pkg => 
        pkg.id === id ? { ...pkg, ...packageData } : pkg
      ))
    } catch (err) {
      setError('Failed to update package')
      throw err
    }
  }

  const deletePackage = async (id: string) => {
    try {
      await packageOperations.delete(id)
      setPackages(prev => prev.filter(pkg => pkg.id !== id))
    } catch (err) {
      setError('Failed to delete package')
      throw err
    }
  }

  return {
    packages,
    loading,
    error,
    addPackage,
    updatePackage,
    deletePackage,
  }
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const fetchedNotifications = await notificationOperations.getAll()
        setNotifications(fetchedNotifications)
      } catch (err) {
        setError('Failed to fetch notifications')
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const sendNotification = async (notificationData: Omit<Notification, 'id'>) => {
    try {
      const id = await notificationOperations.create(notificationData)
      const newNotification = { 
        id, 
        ...notificationData,
        timestamp: new Date().toISOString()
      }
      setNotifications(prev => [newNotification, ...prev])
    } catch (err) {
      setError('Failed to send notification')
      throw err
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await notificationOperations.delete(id)
      setNotifications(prev => prev.filter(notif => notif.id !== id))
    } catch (err) {
      setError('Failed to delete notification')
      throw err
    }
  }

  return {
    notifications,
    loading,
    error,
    sendNotification,
    deleteNotification,
  }
}

// Hook for dashboard analytics
export function useDashboardStats() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    inactiveMembers: 0,
    pendingBills: 0,
    totalRevenue: 0,
    totalPackages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshStats = async () => {
    try {
      setLoading(true)
      const dashboardStats = await analyticsOperations.getDashboardStats()
      setStats(dashboardStats)
    } catch (err) {
      setError('Failed to fetch dashboard stats')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refreshStats,
  }
}

// Hook for managing diet plans
export function useDietPlans() {
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = dietPlanOperations.subscribe((updatedDietPlans) => {
      setDietPlans(updatedDietPlans)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const addDietPlan = async (dietPlanData: Omit<DietPlan, 'id'>) => {
    try {
      await dietPlanOperations.create(dietPlanData)
    } catch (err) {
      setError('Failed to add diet plan')
      throw err
    }
  }

  const updateDietPlan = async (id: string, dietPlanData: Partial<DietPlan>) => {
    try {
      await dietPlanOperations.update(id, dietPlanData)
    } catch (err) {
      setError('Failed to update diet plan')
      throw err
    }
  }

  const deleteDietPlan = async (id: string) => {
    try {
      await dietPlanOperations.delete(id)
    } catch (err) {
      setError('Failed to delete diet plan')
      throw err
    }
  }

  const getDietPlanById = async (id: string) => {
    try {
      return await dietPlanOperations.getById(id)
    } catch (err) {
      setError('Failed to get diet plan')
      throw err
    }
  }

  const getActiveDietPlans = async () => {
    try {
      return await dietPlanOperations.getActive()
    } catch (err) {
      setError('Failed to get active diet plans')
      throw err
    }
  }

  return {
    dietPlans,
    loading,
    error,
    addDietPlan,
    updateDietPlan,
    deleteDietPlan,
    getDietPlanById,
    getActiveDietPlans,
  }
}