export interface IdempotenceConfig {
    keyId: string[];
    serviceName: string;
    isPubsub?: boolean;
    expireTime?: number;
}
