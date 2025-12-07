import { Request, Response, NextFunction } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
  const method = req.method;
  const url = req.originalUrl;

  console.log(`[${new Date().toISOString()}] ${method} ${url}`);

  next();
};

export default logger;
