"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { DashboardNav } from "@/components/dashboard-nav"
import { ExpenseForm } from "@/components/expense-form"
import { useAuth } from "@/context/auth-context"
import { Loader2 } from "lucide-react"

export default function EditExpensePage() {
  const params = useParams()
  const { token, isAuthenticated } = useAuth()
  const [expense, setExpense] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated && token && params.id) {
      const fetchExpense = async () => {
        try {
          const res = await fetch(`/api/expenses/${params.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          const data = await res.json()
          if (data.success) {
            setExpense(data.data)
          }
        } catch (error) {
          console.error("Error fetching expense:", error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchExpense()
    }
  }, [isAuthenticated, token, params.id])

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardNav />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Edit Expense</h1>
          <p className="text-muted-foreground">Update your transaction details</p>
        </div>

        <div className="bg-card rounded-xl border shadow-sm p-6 md:p-8">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : expense ? (
            <ExpenseForm initialData={expense} isEditing />
          ) : (
            <div className="text-center py-12 text-muted-foreground">Expense not found</div>
          )}
        </div>
      </main>
    </div>
  )
}
