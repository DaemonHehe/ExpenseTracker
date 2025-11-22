"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

interface ExpenseFormProps {
  initialData?: {
    _id: string
    title: string
    amount: number
    category: string
    date: string
    notes?: string
  }
  isEditing?: boolean
}

const CATEGORIES = ["Food", "Transport", "Bills", "Shopping", "Entertainment", "Other"]

export function ExpenseForm({ initialData, isEditing = false }: ExpenseFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [amount, setAmount] = useState(initialData?.amount?.toString() || "")
  const [category, setCategory] = useState(initialData?.category || "Food")
  const [date, setDate] = useState(
    initialData?.date ? new Date(initialData.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
  )
  const [notes, setNotes] = useState(initialData?.notes || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { token } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const url = isEditing ? `/api/expenses/${initialData?._id}` : "/api/expenses"

      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          amount: Number.parseFloat(amount),
          category,
          date,
          notes,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      router.push("/expenses")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>}

      <div className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <Input
            id="title"
            placeholder="e.g., Weekly Groceries"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Amount (THB)
            </label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <select
              id="category"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-2">
          <label htmlFor="date" className="text-sm font-medium">
            Date
          </label>
          <div className="relative">
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <label htmlFor="notes" className="text-sm font-medium">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Additional details..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Adding..."}
            </>
          ) : isEditing ? (
            "Update Expense"
          ) : (
            "Add Expense"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} className="w-full md:w-auto">
          Cancel
        </Button>
      </div>
    </form>
  )
}
