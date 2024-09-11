import Joi from 'joi';

export interface PubSubPayload {
    message: Message;
}

interface Message {
    data: string;
    publishTime: string;
    messageId: string;
}

export const pubSubSchema = Joi.object<PubSubPayload>({
    message: Joi.object({
        data: Joi.string().required(),
        publishTime: Joi.string().required(),
        messageId: Joi.string().required(),
    })
        .unknown(true)
        .required(),
}).unknown(true);
