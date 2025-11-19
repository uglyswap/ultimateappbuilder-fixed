"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.errorHandler = errorHandler;
const logger_1 = require("../../utils/logger");
class AppError extends Error {
    statusCode;
    message;
    isOperational;
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
function errorHandler(err, req, res, _next) {
    if (err instanceof AppError) {
        logger_1.logger.error('Application error', {
            error: err.message,
            stack: err.stack,
            path: req.path,
        });
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }
    logger_1.logger.error('Unexpected error', {
        error: err.message,
        stack: err.stack,
        path: req.path,
    });
    return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
}
//# sourceMappingURL=error-handler.js.map