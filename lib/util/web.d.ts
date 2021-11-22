import { AxiosInstance, AxiosRequestConfig } from 'axios';
export interface ConnectionInfo extends AxiosRequestConfig {
    baseURL?: string;
    url?: string;
    auth?: {
        username: string;
        password: string;
    };
    timeout?: number;
    headers?: Record<string, string>;
}
export declare function newRpcClient(config: AxiosRequestConfig): AxiosInstance;
