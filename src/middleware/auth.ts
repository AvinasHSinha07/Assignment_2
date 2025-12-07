import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: "Missing authorization header",
        });
      }

      if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "Invalid authorization format",
        });
      }

      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(
        token as any,
        config.jwtSecret as string
      ) as unknown as JwtPayload & {
        id: number;
        email: string;
        role: string;
      };

      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You do not have access to this resource",
        });
      }

      next();
    } catch (err: any) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: " + (err.message || "Invalid token"),
      });
    }
  };
};

export default auth;
