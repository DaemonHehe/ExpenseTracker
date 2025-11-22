"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Plus, Search, ArrowUpDown, Edit, Trash2, Download, Loader2 } from "lucide-react"
import Link from "next/link"

interface Expense {
  _id: string
  title: string
  amount: number
  category: string
  date: string
  notes?: string
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const { token, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchExpenses()
    }
  }, [isAuthenticated, token, category, sortBy, sortOrder, startDate, endDate])

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated && token) {
        fetchExpenses()
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  const fetchExpenses = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      if (category && category !== "All") params.append("category", category)
      if (startDate) params.append("startDate", startDate)
      if (endDate) params.append("endDate", endDate)
      params.append("sortBy", sortBy)
      params.append("sortOrder", sortOrder)

      const res = await fetch(`/api/expenses?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      if (data.success) {
        setExpenses(data.data)
      }
    } catch (error) {
      console.error("Error fetching expenses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return

    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        setExpenses(expenses.filter((e) => e._id !== id))
      }
    } catch (error) {
      console.error("Error deleting expense:", error)
    }
  }

  const handleExportCSV = () => {
    const headers = ["Date", "Title", "Category", "Amount", "Notes"]
    const csvContent = [
      headers.join(","),
      ...expenses.map((e) =>
        [new Date(e.date).toLocaleDateString(), `"${e.title}"`, e.category, e.amount, `"${e.notes || ""}"`].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `expenses_export_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardNav />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
            <p className="text-muted-foreground">Manage and view your expense history</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportCSV} disabled={expenses.length === 0}>
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
            <Link href="/expenses/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Expense
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b bg-muted/10 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                className="pl-9 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Bills">Bills</option>
                <option value="Shopping">Shopping</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>

              <Input type="date" className="w-auto" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <span className="self-center text-muted-foreground">-</span>
              <Input type="date" className="w-auto" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/20">
                <tr>
                  <th className="px-6 py-3 cursor-pointer hover:bg-muted/30" onClick={() => toggleSort("date")}>
                    <div className="flex items-center">
                      Date {sortBy === "date" && <ArrowUpDown className="ml-1 h-3 w-3" />}
                    </div>
                  </th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3 cursor-pointer hover:bg-muted/30" onClick={() => toggleSort("amount")}>
                    <div className="flex items-center">
                      Amount {sortBy === "amount" && <ArrowUpDown className="ml-1 h-3 w-3" />}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    </td>
                  </tr>
                ) : expenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No expenses found. Try adjusting your filters or add a new expense.
                    </td>
                  </tr>
                ) : (
                  expenses.map((expense) => (
                    <tr key={expense._id} className="bg-card border-b hover:bg-muted/10">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{formatDate(expense.date)}</td>
                      <td className="px-6 py-4 font-medium">
                        {expense.title}
                        {expense.notes && (
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{expense.notes}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium">{formatCurrency(expense.amount)}</td>
                      <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                        <Link href={`/expenses/${expense._id}/edit`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(expense._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
