import { CONTAINER, IdempotenceConfig } from '../../configuration';
import { StatusModel } from '../../domain/models';
import { MESSAGES } from '../../domain/response/Messages';
import { RedisService } from '../../infrastructure/db';
import { getId } from '../../infrastructure/util';
import { getPubsubBody } from '../../infrastructure/validations';
import { isError } from '../../util';
import { FastifyReply, FastifyRequest } from 'fastify';

export const afterRequest = async (
    req: FastifyRequest,
    reply: FastifyReply,
    config: IdempotenceConfig,
): Promise<FastifyReply | void> => {
    const { keyId, serviceName } = config;
    const body = config.isPubsub ? getPubsubBody(req.body) : req.body;
    const db = CONTAINER.get(RedisService);
    const id = getId(keyId, body);
    if (!id) {
        return reply.code(201).send({
            statusCode: 201,
            message: `No existe la clave ${keyId}`,
            origin: 'ON_SEND_EVENT',
            cause: config.isPubsub ? MESSAGES.KEY_NOT_FOUND : MESSAGES.KEY_NOT_FOUD_PUBSUB,
        });
    }

    const { statusCode } = reply;
    const status = await db.get<StatusModel>(`${serviceName}-${id}`);
    if (statusCode === 200 || statusCode === 201) {
        await db.set<StatusModel>(`${serviceName}-${id}`, {
            status: 'terminado',
            retry: status?.retry ?? 0,
        });
    }
    if (isError(statusCode)) {
        await db.set<StatusModel>(`${serviceName}-${id}`, {
            status: 'error',
            retry: status?.retry ?? 0,
        });
    }
};
