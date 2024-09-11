export function getId(keyId: string, body: any): string | null {
    if (!body || typeof body !== 'object') return null;

    const keys = keyId.split('.');
    let res = body;

    for (const key of keys) {
        if (res && typeof res === 'object' && key in res) {
            res = res[key];
        } else {
            return null;
        }
    }

    return res ?? null;
}
