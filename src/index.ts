import 'module-alias/register';
import 'reflect-metadata';
import { RouteShorthandOptions } from 'fastify';
import { afterRequest } from '@application/services';
import { beforeRequest } from '@application/services';
import { IdempotenceConfig, ensureDependenciesStarted } from '@configuration';
import { configSchema, validateData } from './infrastructure';
import { Cacheable as Caching } from './infrastructure';

/**
 *
 * @param config: Valores de configuración para que la idempotencia funcione
 * @returns RouteShorthandOptions
 */
export const handler = (config: IdempotenceConfig): RouteShorthandOptions => {
    ensureDependenciesStarted();
    const data = validateData<IdempotenceConfig>(configSchema, config);
    const handler: RouteShorthandOptions = {
        preHandler: async (r, rp, dn) => beforeRequest(r, rp, dn, data),
        onSend: async (r, rp) => afterRequest(r, rp, data),
    };
    return handler;
};

export const Cacheable = Caching;
