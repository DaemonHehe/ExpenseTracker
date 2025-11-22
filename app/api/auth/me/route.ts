import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/User"
import { authenticateRequest, createAuthResponse } from "@/lib/auth-middleware"
import { errorResponse, successResponse } from "@/lib/api-response"

export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req)
    if (!authResult) {
      return createAuthResponse("Unauthorized", 401)
    }

    await connectDB()
    const user = await User.findById(authResult.userId).select("-password")

    if (!user) {
      return errorResponse("User not found", 404)
    }

    return successResponse(user)
  } catch (error: any) {
    console.error("Me endpoint error:", error)
    return errorResponse("Internal server error", 500)
  }
}
