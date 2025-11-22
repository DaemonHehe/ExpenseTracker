import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/User"
import { signToken } from "@/lib/jwt"
import { errorResponse, successResponse } from "@/lib/api-response"

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { email, password } = await req.json()

    if (!email || !password) {
      return errorResponse("Please provide email and password", 400)
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email })
    if (!user) {
      return errorResponse("Invalid credentials", 401)
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return errorResponse("Invalid credentials", 401)
    }

    // Generate token
    const token = signToken({ userId: user._id as string, email: user.email })

    // Return user data and token
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
    }

    return successResponse({ user: userData, token }, "Login successful")
  } catch (error: any) {
    console.error("Login error:", error)
    return errorResponse(error.message || "Internal server error", 500)
  }
}
