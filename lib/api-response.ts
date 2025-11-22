import { NextResponse } from "next/server"

export interface ApiSuccessResponse<T = any> {
  success: true
  data: T
  message?: string
}

export interface ApiErrorResponse {
  success: false
  message: string
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse

export function successResponse<T>(data: T, message?: string, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    } as ApiSuccessResponse<T>,
    { status },
  )
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      message,
    } as ApiErrorResponse,
    { status },
  )
}
