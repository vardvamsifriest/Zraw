import { NextFunction, Request, Response } from "express"
import { JWT_SECRET } from "@repo/backend-common"
import jwt from "jsonwebtoken"

export interface AuthRequest extends Request {
  userId?: string
}

export function middleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.headers["authorization"] ?? ""
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    if (decoded) {
      req.userId = decoded.userId
      next()
    } else {
      res.status(401).json({ message: "Unauthorized" })
    }
  } catch (e) {
    res.status(401).json({ message: "Unauthorized" })
  }
}