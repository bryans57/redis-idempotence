export interface StatusRepository {
    hgetall<T>(key: string): Promise<T[] | undefined>;
    hget<T>(key: string, field: string): Promise<T | undefined>;
    hset<T>(collection: string, field: string, value: T): Promise<boolean>;
    set<T>(key: string, value: T): Promise<boolean>;
    hdel(collection: string, element: string): Promise<boolean>;
    del(key: string): Promise<string>;
    get(key: string): Promise<string | null>;
    deleteAll(): Promise<void>;
}
