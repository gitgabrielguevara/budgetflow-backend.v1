import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface AuthRequest extends Request {
  user?: { id: number };
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied ☠️ No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
    };
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token 🪙" });
  }
};
