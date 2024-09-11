import { log } from 'console';
import { ErrorCode, StatusCode } from './ErrorCode';

export abstract class Exception {
    isError: boolean;
    message: string;
    code: ErrorCode;
    statusCode: number;
    cause: string | null;

    // eslint-disable-next-line max-params
    constructor(message: string, code: ErrorCode, statusCode: number, cause?: string) {
        this.isError = true;
        this.message = message;
        this.code = code;
        this.statusCode = statusCode;
        this.cause = cause || null;
        console.error(
            JSON.stringify({
                isError: this.isError ?? null,
                message: message ?? null,
                code: code ?? null,
                statusCode: statusCode ?? null,
                cause: cause ?? null,
            }),
        );
    }
}
export class RedisException extends Exception {
    constructor(message: string, stack: string) {
        super(message, ErrorCode.REDIS_ERROR, StatusCode.INTERNAL_ERROR, stack);
    }
}

export class StopRetryingError extends Error {
    code: string;
    statusCode: number;
    constructor(etiqueta1d: string) {
        super(`Limite de reintentos excedido para la unidad ${etiqueta1d}`);
        this.statusCode = StatusCode.OK;
        this.code = ErrorCode.RETRY_LIMIT_ERROR;
    }
}

export class UnitInProcessError extends Error {
    code: string;
    statusCode: number;
    constructor(etiqueta1d: string) {
        const message = `La unidad ${etiqueta1d} todavía esta en proceso, reintentando...`;
        super(message);
        log(message);
        this.statusCode = StatusCode.INTERNAL_ERROR;
        this.code = ErrorCode.RETRY_ERROR;
    }
}

export class BadMessageException extends Exception {
    constructor(message: string, cause?: unknown) {
        super(message, ErrorCode.BAD_MESSAGE, StatusCode.OK, (cause as string) ?? 'Validation error');
    }
}
