import { Container } from 'inversify';
import { RedisClient } from 'redis';
import { getRedisConnection, RedisService } from '../infrastructure';
import { TYPES } from './Types';

export const CONTAINER = new Container();

export const startDependencies = (): void => {
    //REDIS
    CONTAINER.bind<RedisClient>(TYPES.RedisAdapter).toConstantValue(getRedisConnection());
    //Service
    CONTAINER.bind(RedisService).toSelf().inRequestScope();
};
