import dotenv from 'dotenv';

dotenv.config();
import { validateEnvs } from './validateEnvs';

export const ENV = {
    REDIS_HOST: process.env.REDIS_HOST ?? 'localhost',
    REDIS_PORT: process.env.REDIS_PORT ?? '6379',
    REDIS_CONNECTION_LOCAL_ENV: process.env.REDIS_CONNECTION_LOCAL_ENV
        ? process.env.REDIS_CONNECTION_LOCAL_ENV === 'true'
        : false,
    EXPIRE_TME: 21600,
};

validateEnvs(ENV);
