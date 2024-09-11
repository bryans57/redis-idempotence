export const parse = <T>(data: string, withError = true): T => {
    try {
        return JSON.parse(data);
    } catch ({ message }) {
        throw withError ? new Error(message as string) : data;
    }
};
