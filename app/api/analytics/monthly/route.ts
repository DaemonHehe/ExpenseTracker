import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import Expense from "@/models/Expense"
import { authenticateRequest, createAuthResponse } from "@/lib/auth-middleware"
import { errorResponse, successResponse } from "@/lib/api-response"
import mongoose from "mongoose"

// GET /api/analytics/monthly - Get monthly trend data
export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req)
    if (!authResult) {
      return createAuthResponse("Unauthorized", 401)
    }

    await connectDB()
    const userId = new mongoose.Types.ObjectId(authResult.userId)

    // Get data for last 6 months
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
    sixMonthsAgo.setDate(1) // Start of the month

    const monthlyData = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          total: { $sum: "$amount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ])

    // Format for charts
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    // Fill in missing months
    const formattedData = []
    const current = new Date(sixMonthsAgo)
    const now = new Date()

    while (current <= now) {
      const year = current.getFullYear()
      const month = current.getMonth() + 1 // 1-12

      const found = monthlyData.find((d) => d._id.year === year && d._id.month === month)

      formattedData.push({
        name: `${monthNames[month - 1]}`,
        total: found ? found.total : 0,
        fullDate: new Date(current),
      })

      current.setMonth(current.getMonth() + 1)
    }

    return successResponse(formattedData)
  } catch (error: any) {
    console.error("Analytics monthly error:", error)
    return errorResponse("Internal server error", 500)
  }
}
