import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, PieChart, Wallet } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl">SimpleTracker</span>
          </div>
          <div className="space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-balance max-w-4xl mx-auto">
              Take Control of Your <span className="text-primary">Finances</span> with Ease
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              A simple, powerful expense tracker that helps you understand your spending habits and save more money.
            </p>
            <div className="flex items-center justify-center space-x-4 pt-4">
              <Link href="/auth/register">
                <Button size="lg" className="h-12 px-8 text-base">
                  Start Tracking Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-transparent">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-xl border shadow-sm space-y-4">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <Wallet className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Track Expenses</h3>
                <p className="text-muted-foreground">
                  Easily log your daily expenses and categorize them to see exactly where your money goes.
                </p>
              </div>
              <div className="bg-card p-8 rounded-xl border shadow-sm space-y-4">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <PieChart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Visual Analytics</h3>
                <p className="text-muted-foreground">
                  Beautiful charts and graphs help you visualize your spending patterns over time.
                </p>
              </div>
              <div className="bg-card p-8 rounded-xl border shadow-sm space-y-4">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Smart Insights</h3>
                <p className="text-muted-foreground">
                  Get monthly summaries and category breakdowns to make better financial decisions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} SimpleTracker. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
