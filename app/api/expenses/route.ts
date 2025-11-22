import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import Expense from "@/models/Expense"
import { authenticateRequest, createAuthResponse } from "@/lib/auth-middleware"
import { errorResponse, successResponse } from "@/lib/api-response"

// GET /api/expenses - List expenses with filtering and sorting
export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req)
    if (!authResult) {
      return createAuthResponse("Unauthorized", 401)
    }

    await connectDB()

    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "date"
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1

    // Build query
    const query: any = { user: authResult.userId }

    if (startDate || endDate) {
      query.date = {}
      if (startDate) query.date.$gte = new Date(startDate)
      if (endDate) query.date.$lte = new Date(endDate)
    }

    if (category && category !== "All") {
      query.category = category
    }

    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { notes: { $regex: search, $options: "i" } }]
    }

    // Build sort object
    const sort: any = {}
    sort[sortBy] = sortOrder

    const expenses = await Expense.find(query).sort(sort)

    return successResponse(expenses)
  } catch (error: any) {
    console.error("Get expenses error:", error)
    return errorResponse("Internal server error", 500)
  }
}

// POST /api/expenses - Create new expense
export async function POST(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req)
    if (!authResult) {
      return createAuthResponse("Unauthorized", 401)
    }

    await connectDB()
    const body = await req.json()

    // Create expense with authenticated user's ID
    const expense = await Expense.create({
      ...body,
      user: authResult.userId,
    })

    return successResponse(expense, "Expense created successfully", 201)
  } catch (error: any) {
    console.error("Create expense error:", error)
    if (error.name === "ValidationError") {
      return errorResponse(error.message, 400)
    }
    return errorResponse("Internal server error", 500)
  }
}
