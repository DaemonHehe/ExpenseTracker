import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import Expense from "@/models/Expense"
import { authenticateRequest, createAuthResponse } from "@/lib/auth-middleware"
import { errorResponse, successResponse } from "@/lib/api-response"

type RouteContext = { params: Promise<{ id: string }> }

// GET /api/expenses/:id - Get single expense
export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const authResult = await authenticateRequest(req)
    if (!authResult) {
      return createAuthResponse("Unauthorized", 401)
    }

    await connectDB()
    const expense = await Expense.findOne({
      _id: id,
      user: authResult.userId,
    })

    if (!expense) {
      return errorResponse("Expense not found", 404)
    }

    return successResponse(expense)
  } catch (error: any) {
    console.error("Get expense error:", error)
    return errorResponse("Internal server error", 500)
  }
}

// PUT /api/expenses/:id - Update expense
export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const authResult = await authenticateRequest(req)
    if (!authResult) {
      return createAuthResponse("Unauthorized", 401)
    }

    await connectDB()
    const body = await req.json()

    // Validate category if provided
    if (body.category) {
      const validCategories = ["Food", "Transport", "Bills", "Shopping", "Entertainment", "Other"]
      if (!validCategories.includes(body.category)) {
        return errorResponse("Invalid category", 400)
      }
    }

    const expense = await Expense.findOneAndUpdate(
      { _id: id, user: authResult.userId },
      { $set: body },
      { new: true, runValidators: true },
    )

    if (!expense) {
      return errorResponse("Expense not found", 404)
    }

    return successResponse(expense, "Expense updated successfully")
  } catch (error: any) {
    console.error("Update expense error:", error)
    if (error.name === "ValidationError") {
      return errorResponse(error.message, 400)
    }
    return errorResponse("Internal server error", 500)
  }
}

// DELETE /api/expenses/:id - Delete expense
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const authResult = await authenticateRequest(req)
    if (!authResult) {
      return createAuthResponse("Unauthorized", 401)
    }

    await connectDB()
    const expense = await Expense.findOneAndDelete({
      _id: id,
      user: authResult.userId,
    })

    if (!expense) {
      return errorResponse("Expense not found", 404)
    }

    return successResponse(null, "Expense deleted successfully")
  } catch (error: any) {
    console.error("Delete expense error:", error)
    return errorResponse("Internal server error", 500)
  }
}
