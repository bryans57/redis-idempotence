import dotenv from 'dotenv';
dotenv.config();
import { validateEnvs } from './validateEnvs';

export const ENV = {
    REDIS_HOST: process.env.REDIS_HOST ?? '',
    REDIS_PORT: process.env.REDIS_PORT ?? '',
    REDIS_CONNECTION_LOCAL_ENV: process.env.REDIS_CONNECTION_LOCAL_ENV
        ? process.env.REDIS_CONNECTION_LOCAL_ENV === 'true'
        : false,
};

validateEnvs();
