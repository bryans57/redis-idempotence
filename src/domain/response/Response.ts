import { FastifyRequest } from 'fastify';
import { ResponseModel } from './ResponseModel';

export function reqAlreadyDone(id: string, req: FastifyRequest): ResponseModel {
    const res: ResponseModel = {
        statusCode: 200,
        message: `Petición con id ${id} ya fue procesada`,
        method: req.method,
        url: req.url,
    };
    return res;
}

export function reqInPorcess(id: string, req: FastifyRequest): ResponseModel {
    const res: ResponseModel = {
        statusCode: 500,
        message: `Petición con id ${id} se esta procesando`,
        method: req.method,
        url: req.url,
    };
    return res;
}
