import { createHash } from 'crypto';

// Function to hash any type of data using SHA-256
export function hashData(data: any): string {
    const jsonString = JSON.stringify(data);
    const hash = createHash('sha256');
    hash.update(jsonString);
    return hash.digest('hex');
}
