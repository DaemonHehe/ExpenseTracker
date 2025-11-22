import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import Expense from "@/models/Expense"
import { authenticateRequest, createAuthResponse } from "@/lib/auth-middleware"
import { errorResponse, successResponse } from "@/lib/api-response"
import mongoose from "mongoose"
import { startOfMonth, startOfWeek, startOfYear } from "date-fns"

// GET /api/analytics/summary - Get summary metrics
export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req)
    if (!authResult) {
      return createAuthResponse("Unauthorized", 401)
    }

    await connectDB()

    const { searchParams } = new URL(req.url)
    const period = searchParams.get("period") || "month"
    const now = new Date()
    const startDate =
      period === "week"
        ? startOfWeek(now, { weekStartsOn: 1 })
        : period === "month"
          ? startOfMonth(now)
          : period === "year"
            ? startOfYear(now)
            : startOfMonth(now)

    const userId = new mongoose.Types.ObjectId(authResult.userId)

    // Aggregation pipeline for total and category breakdown
    const [totalResult, categoryResult] = await Promise.all([
      Expense.aggregate([
        {
          $match: {
            user: userId,
            date: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]),
      Expense.aggregate([
        {
          $match: {
            user: userId,
            date: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: "$category",
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { total: -1 } },
      ]),
    ])

    const total = totalResult.length > 0 ? totalResult[0].total : 0
    const count = totalResult.length > 0 ? totalResult[0].count : 0

    // Find top category
    const topCategory =
      categoryResult.length > 0
        ? { name: categoryResult[0]._id, amount: categoryResult[0].total }
        : { name: "N/A", amount: 0 }

    return successResponse({
      total,
      count,
      topCategory,
      categories: categoryResult.map((c) => ({
        name: c._id,
        value: c.total,
        count: c.count,
      })),
    })
  } catch (error: any) {
    console.error("Analytics summary error:", error)
    return errorResponse("Internal server error", 500)
  }
}
