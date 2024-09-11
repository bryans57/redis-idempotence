export function getId(keyId: string[], body: any): string | null {
    if (!body || typeof body !== 'object') return null;

    let finalKey = '';

    for (const key of keyId) {
        const keys = key.split('.');
        let res = body;

        for (const key of keys) {
            if (res && typeof res === 'object' && key in res) {
                res = res[key] + '-';
            } else {
                return null;
            }
        }
        finalKey += res;
    }
    finalKey = finalKey.substring(0, finalKey.length - 1);
    return finalKey ?? null;
}
