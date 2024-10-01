import { ENV } from '../../../util';
import { CONTAINER, TYPES } from '../../../configuration';
import { RedisService } from '../../../infrastructure/db';

export function Cacheable(
    keyPrefix: string,
    unless: (result: any) => boolean = () => false,
    expireTime = ENV.EXPIRE_TME,
) {
    return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            const redisClient = CONTAINER.get(TYPES.RedisAdapter) as RedisService;
            const today = new Date();
            const datePart = today.toISOString().split('T')[0];

            const key = `${keyPrefix}_${datePart}`;
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
