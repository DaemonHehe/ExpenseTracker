import { DashboardNav } from "@/components/dashboard-nav"
import { ExpenseForm } from "@/components/expense-form"

export default function NewExpensePage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardNav />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Add Expense</h1>
          <p className="text-muted-foreground">Record a new transaction in your tracker</p>
        </div>

        <div className="bg-card rounded-xl border shadow-sm p-6 md:p-8">
          <ExpenseForm />
        </div>
      </main>
    </div>
  )
}
