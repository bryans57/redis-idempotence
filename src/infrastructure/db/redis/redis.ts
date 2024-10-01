import { injectable } from 'inversify';
import { RedisClient } from 'redis';
import { CONTAINER, TYPES } from '../../../configuration';
import { promisify } from 'util';
import { RedisException } from '../../../domain/exceptions';
import { getRedisConnection } from './adapter';
import { ENV } from '../../../util/Env';

@injectable()
export class RedisService {
    private redis = CONTAINER.get<RedisClient>(TYPES.RedisAdapter);
    private EXPIRE_TIME = ENV.EXPIRE_TME;

    private reconnect = (): void => {
        if (!this.redis.connected) {
            this.redis.quit();
            CONTAINER.rebind<RedisClient>(TYPES.RedisAdapter).toConstantValue(getRedisConnection());
        }
        console.info(this.redis.connected ? 'REDIS IDP: Reconectado' : 'REDIS IDP: No se pudo reconectar');
    };

    async hgetall<T>(key: string): Promise<T[] | undefined> {
        try {
            const getAsync = promisify(this.redis.hgetall).bind(this.redis);
            const getValues = await getAsync(key);
            if (getValues) {
                const values = Object.values(getValues);
                return values.map((element: any) => JSON.parse(element));
            }
            return undefined;
        } catch (e) {
            this.reconnect();
            throw new RedisException(e.message as string, e.stack as string);
        }
    }

    async hget<T>(key: string, field: string): Promise<T | undefined> {
        try {
            const getAsync = promisify(this.redis.hget).bind(this.redis);
            const value = await getAsync(key, field);
            if (value) return JSON.parse(value);
        } catch ({ stack, message }) {
            this.reconnect();
            throw new RedisException(message as string, stack as string);
        }
        return undefined;
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const getAsync = promisify(this.redis.get).bind(this.redis);
            const value = await getAsync(key);
            return value ? JSON.parse(value) : null;
        } catch ({ message, stack }) {
            this.reconnect();
            throw new RedisException(message as string, stack as string);
        }
    }

    async hset<T>(collection: string, field: string, value: T): Promise<boolean> {
        try {
            const save = this.redis.set(collection, field, JSON.stringify(value));
            this.redis.expire(collection, 691200);
            return save;
        } catch ({ message, stack }) {
            this.reconnect();
            throw new RedisException(message as string, stack as string);
        }
    }

    async set<T>(key: string, value: T, expireTime = this.EXPIRE_TIME): Promise<boolean> {
        try {
            const data = typeof value === 'object' ? JSON.stringify(value) : String(value);
            const save = this.redis.set(key, data);
            this.redis.expire(key, expireTime);
            return save;
        } catch ({ message, stack }) {
            this.reconnect();
            throw new RedisException(message as string, stack as string);
        }
    }

    async hdel(collection: string, element: string): Promise<boolean> {
        try {
            return this.redis.hdel(collection, element);
        } catch ({ message, stack }) {
            this.reconnect();
            throw new RedisException(message as string, stack as string);
        }
    }

    async del(key: string): Promise<string> {
        return this.redis.del(key) ? 'REDIS_MESSAGE: Eliminado con exito' : 'REDIS_MESSAGE: No se pudo eliminar';
    }

    async deleteAll(): Promise<void> {
        try {
            const getAsync = promisify(this.redis.flushall).bind(this.redis);
            await getAsync();
        } catch ({ stack, message }) {
            this.reconnect();
            throw new RedisException(message as string, stack as string);
        }
    }
}
