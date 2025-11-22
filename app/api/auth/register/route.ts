import type { NextRequest } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/User"
import { errorResponse, successResponse } from "@/lib/api-response"

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return errorResponse("Please provide all required fields", 400)
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return errorResponse("Email is already registered", 400)
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    })

    // Return success without password
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    }

    return successResponse(userData, "User registered successfully", 201)
  } catch (error: any) {
    console.error("Registration error:", error)
    return errorResponse(error.message || "Internal server error", 500)
  }
}
