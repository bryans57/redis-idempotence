export const isError = (statusCode: number): boolean =>
    (statusCode >= 500 && statusCode < 600) || (statusCode >= 400 && statusCode < 500);
