class AppError extends Error {
    public readonly message: string;
    public readonly statusCode: number;

    constructor(message: string, statusCode = 400) {
        super(message);

        this.message = message;
        this.statusCode = statusCode;

        // Corrige a cadeia de protótipos
        Object.setPrototypeOf(this, new.target.prototype);

        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404);
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 422);
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409);
    }
}

export class InternalServerError extends AppError {
    constructor(message: string) {
        super(message, 500);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string) {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string) {
        super(message, 403);
    }
}

export class BadRequestError extends AppError {
    constructor(message: string) {
        super(message, 400);
    }
}

export default AppError;
