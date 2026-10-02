export class AppError extends Error {
    statusCode;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}
export function errorHandler(err, _req, res, _next) {
    console.error('Error:', err);
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message,
        });
    }
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: 'Validation error',
            details: err.message,
        });
    }
    if (err.name === 'MulterError') {
        if (err.message.includes('File too large')) {
            return res.status(400).json({
                success: false,
                error: 'File too large. Maximum size is 10MB.',
            });
        }
        return res.status(400).json({
            success: false,
            error: err.message,
        });
    }
    return res.status(500).json({
        success: false,
        error: 'Internal server error',
    });
}
export function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
//# sourceMappingURL=errorHandler.js.map