import { AxiosInstance, AxiosRequestConfig } from 'axios';
export interface TransportConfig extends AxiosRequestConfig {
    baseURL?: string;
    url?: string;
    auth?: {
        username: string;
        password: string;
    };
    timeout?: number;
    headers?: Record<string, string>;
}
export declare function newRpcClient(config: TransportConfig): AxiosInstance;
