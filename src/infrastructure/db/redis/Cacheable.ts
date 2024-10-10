import 'reflect-metadata';
import { hashData, ENV } from '@util';
import { CONTAINER, ensureDependenciesStarted } from '@configuration';
import { RedisService } from '@infrastructure/db';

export function Cacheable(
    keyPrefix: string,
    options?: {
        expireTime?: number;
        unless?: (result: any) => boolean;
    },
) {
    ensureDependenciesStarted();
    const expireTime = options?.expireTime || ENV.EXPIRE_TME;
    const unless = options?.unless || (() => false);
    return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            const redisClient = CONTAINER.get(RedisService);
            const encodeData = hashData(args);
            const key = `${keyPrefix}_${encodeData}`;
            const cached = await redisClient.get(key);
            if (cached) {
                try {
                    return typeof cached === 'string' ? JSON.parse(cached) : cached;
                } catch (error) {
                    return cached;
                }
            }
            const result = await originalMethod.apply(this, args);
            if (!unless(result)) {
                await redisClient.set(key, result, expireTime);
            }
            return result;
        };
        return descriptor;
    };
}
