import { Container } from 'inversify';
import { RedisClient } from 'redis';
import { getRedisConnection, RedisService } from '@infrastructure/db';
import { TYPES } from './Types';

export const CONTAINER = new Container();

export const startDependencies = (): void => {
    //REDIS
    CONTAINER.bind<RedisClient>(TYPES.RedisAdapter).toConstantValue(getRedisConnection());
    //Service
    CONTAINER.bind(RedisService).toSelf().inRequestScope();
};

export const ensureDependenciesStarted = () => {
    if (!CONTAINER.isBound(TYPES.RedisAdapter)) {
        startDependencies();
    }
};
