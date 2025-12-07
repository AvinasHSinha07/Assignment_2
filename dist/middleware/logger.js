"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = (req, res, next) => {
    const method = req.method;
    const url = req.originalUrl;
    console.log(`[${new Date().toISOString()}] ${method} ${url}`);
    next();
};
exports.default = logger;
