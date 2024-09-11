import { IdempotenceConfig } from '../../configuration';
import Joi from 'joi';

export const configSchema = Joi.object<IdempotenceConfig>({
    keyId: Joi.string().required(),
    serviceName: Joi.string().required(),
    isPubsub: Joi.boolean().required(),
});
