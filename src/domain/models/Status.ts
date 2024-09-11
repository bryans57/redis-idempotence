export interface StatusModel {
    status: 'procesando' | 'terminado' | 'error';
    retry: number;
}
