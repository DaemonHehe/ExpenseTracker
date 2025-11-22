import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./jwt"

export interface AuthRequest extends NextRequest {
  userId?: string
}

export async function authenticateRequest(request: NextRequest): Promise<{ userId: string } | null> {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    return { userId: decoded.userId }
  } catch (error) {
    return null
  }
}

export function createAuthResponse(message: string, status: number) {
  return NextResponse.json({ success: false, message }, { status })
}
