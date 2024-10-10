import { CONTAINER, IdempotenceConfig } from '@configuration';
import { StatusModel } from '@domain/models';
import { reqAlreadyDone, reqInPorcess } from '@domain/response/Response';
import { RedisService } from '@infrastructure/db';
import { getId } from '@infrastructure/util';
import { getPubsubBody } from '@infrastructure/validations';
import { createStatus } from '@util';
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import { MESSAGES } from '@domain/response/Messages';

export const beforeRequest = async (
    req: FastifyRequest,
    reply: FastifyReply,
    _done: HookHandlerDoneFunction,
    config: IdempotenceConfig,
): Promise<FastifyReply | HookHandlerDoneFunction | void> => {
    const { keyId, serviceName, expireTime } = config;
    const body = getPubsubBody(req.body) ?? req.body;
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
    const status = await db.get<StatusModel>(`${serviceName}-${id}`);
    if (!status) {
        await createStatus(serviceName, id, db, expireTime);
    } else {
        if (status.status === 'terminado') {
            return reply.code(200).send(reqAlreadyDone(id, req));
        }
        if (status.status === 'error') {
            await db.set<StatusModel>(
                `${serviceName}-${id}`,
                {
                    retry: status.retry + 1,
                    status: 'procesando',
                },
                expireTime,
            );
        }
        if (status.status === 'procesando') {
            await db.set<StatusModel>(
                `${serviceName}-${id}`,
                {
                    retry: status.retry + 1,
                    status: 'procesando',
                },
                expireTime,
            );

            reply.code(500).send(reqInPorcess(id, req));
        }
    }
};
