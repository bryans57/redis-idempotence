export const toBuffer = <T>(data: T): Buffer => {
    return Buffer.from(JSON.stringify(data));
};

export const decode = (buffer: string): string => {
    return Buffer.from(buffer, 'base64').toString();
};
