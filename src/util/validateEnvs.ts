import dotenv from 'dotenv';

dotenv.config();
import { ENV_VALIDATION_ERROR, REDIS_CONNECTION_LOCAL_ENV } from '../domain/exceptions';

export const validateEnvs = (ENV: any) => {
    const errors = [];
    if (!ENV.REDIS_HOST || !ENV.REDIS_PORT) errors.push(ENV_VALIDATION_ERROR);
    if (ENV.REDIS_HOST === 'localhost') errors.push('Redis is pointed to host: localhost');
    if (ENV.REDIS_PORT === '6379') errors.push('Redis is pointed to port: 6379');
    if (ENV.REDIS_CONNECTION_LOCAL_ENV === undefined) errors.push(REDIS_CONNECTION_LOCAL_ENV);
    if (errors.length) {
        console.warn('Warnings Redis-Idempotence:', errors);
    }
};
