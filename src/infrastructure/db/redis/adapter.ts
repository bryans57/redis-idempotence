import redis, { RedisClient } from 'redis';
import { ENV } from '@util';

export const getRedisConnection = (): RedisClient => {
    const adapter = ENV.REDIS_CONNECTION_LOCAL_ENV
        ? redis.createClient({ host: 'redis', connect_timeout: 10000 })
        : redis.createClient(+ENV.REDIS_PORT, ENV.REDIS_HOST, { connect_timeout: 10000 });
    adapter.on('error', (e) => {
        console.error('REDIS ERROR ==> ', e?.message ?? e);
    });
    adapter.on('connect', () => {
        const date = new Date().toLocaleString();
        adapter.rpush('CONEXIONES', `Conectado ${date}`);
        console.info('CONEXIÓN DE REDIS ESTABLECIDA');
    });

    return adapter;
};
