import 'reflect-metadata';
import 'module-alias/register';
import { RouteShorthandOptions } from 'fastify';
import { afterRequest } from './application/services';
import { beforeRequest } from './application/services';
import { IdempotenceConfig, startDependencies } from './configuration';
import { configSchema, validateData } from './infrastructure';

/**
 *
 * @param config: Valores de configuración para que la idempotencia funcione
 * @returns RouteShorthandOptions
 */
export const handler = (config: IdempotenceConfig): RouteShorthandOptions => {
    const data = validateData<IdempotenceConfig>(configSchema, config);
    const handler: RouteShorthandOptions = {
        preHandler: async (r, rp, dn) => beforeRequest(r, rp, dn, data),
        onSend: async (r, rp) => afterRequest(r, rp, data),
    };
    return handler;
};

export const dependenciasIdempotencia = startDependencies;
