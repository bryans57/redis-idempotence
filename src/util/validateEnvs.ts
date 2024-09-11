import dotenv from 'dotenv';
dotenv.config();
import { ENV_VALIDATION_ERROR, REDIS_CONNECTION_LOCAL_ENV } from '../domain/exceptions';

export const validateEnvs = () => {
    const errors = [];
    if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) errors.push(ENV_VALIDATION_ERROR);
    if (!process.env.REDIS_CONNECTION_LOCAL_ENV) errors.push(REDIS_CONNECTION_LOCAL_ENV);
    if (errors.length) {
        console.log('ERROR: Variables requeridas', errors);
        process.exit(1);
    }
};
