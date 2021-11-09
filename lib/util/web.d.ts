import { AxiosRequestConfig } from 'axios';
export interface ConnectionInfo extends AxiosRequestConfig {
    url: string;
    auth?: {
        username: string;
        password: string;
    };
    timeout?: number;
    headers?: Record<string, string>;
}
/**
 *
 * @param connection
 * @param json
 */
export declare function fetchJson(connection: string | ConnectionInfo, json?: string): Promise<any>;
