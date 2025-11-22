"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { DashboardNav } from "@/components/dashboard-nav"
import { formatCurrency } from "@/lib/utils"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { Wallet, TrendingUp, Receipt, Loader2 } from "lucide-react"

// Chart colors matching theme
const COLORS = [
  "oklch(0.55 0.12 195)", // Primary
  "oklch(0.65 0.15 270)", // Chart 2
  "oklch(0.7 0.18 140)", // Chart 3
  "oklch(0.75 0.16 60)", // Chart 4
  "oklch(0.68 0.2 340)", // Chart 5
  "oklch(0.5 0.1 220)", // Extra
]

export default function DashboardPage() {
  const { user, token, isAuthenticated } = useAuth()
  const [summary, setSummary] = useState<any>(null)
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [period, setPeriod] = useState("month")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchData()
    }
  }, [isAuthenticated, token, period])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [summaryRes, monthlyRes] = await Promise.all([
        fetch(`/api/analytics/summary?period=${period}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/analytics/monthly", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const summaryData = await summaryRes.json()
      const monthlyData = await monthlyRes.json()

      if (summaryData.success) setSummary(summaryData.data)
      if (monthlyData.success) setMonthlyData(monthlyData.data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardNav />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name?.split(" ")[0]}! Here's your financial overview.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-card p-1 rounded-lg border shadow-sm">
            <button
              onClick={() => setPeriod("week")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                period === "week" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setPeriod("month")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                period === "month" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setPeriod("year")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                period === "year" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
              }`}
            >
              This Year
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-card p-6 rounded-xl border shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                  <h3 className="text-2xl font-bold mt-1">{formatCurrency(summary?.total || 0)}</h3>
                  <p className="text-xs text-muted-foreground mt-1">in selected period</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <Wallet className="h-6 w-6" />
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl border shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Top Category</p>
                  <h3 className="text-2xl font-bold mt-1">{summary?.topCategory?.name || "N/A"}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatCurrency(summary?.topCategory?.amount || 0)} spent
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl border shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                  <h3 className="text-2xl font-bold mt-1">{summary?.count || 0}</h3>
                  <p className="text-xs text-muted-foreground mt-1">total records</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <Receipt className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid gap-8 md:grid-cols-2">
              {/* Monthly Trend Chart */}
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">Spending Trend</h3>
                  <p className="text-sm text-muted-foreground">Last 6 months activity</p>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                        tickFormatter={(value) => formatCurrency(value)}
                      />
                      <RechartsTooltip
                        cursor={{ fill: "var(--muted)" }}
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid var(--border)",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Bar dataKey="total" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Breakdown Chart */}
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">Expense Breakdown</h3>
                  <p className="text-sm text-muted-foreground">Spending by category</p>
                </div>
                <div className="h-[300px] w-full">
                  {summary?.categories?.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={summary.categories}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {summary.categories.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          formatter={(value: number) => formatCurrency(value)}
                          contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid var(--border)",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          formatter={(value, entry: any) => (
                            <span className="text-sm text-muted-foreground ml-1">{value}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                      No expense data for this period
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
