import Transport from './transport';
import Serializer from './serializer';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
export interface TransportConfig {
}
export interface HttpTransportConfig extends TransportConfig, AxiosRequestConfig {
    baseURL?: string;
    url?: string;
    auth?: {
        username: string;
        password: string;
    };
    timeout?: number;
    headers?: Record<string, string>;
}
/**
 *
 */
export default class HttpTransport extends Transport {
    protected readonly config?: HttpTransportConfig;
    protected readonly axios: AxiosInstance;
    protected maxRetry: number;
    constructor(config?: HttpTransportConfig, serializer?: Serializer);
    /**
     * This method will be used to send a Message to the server, using the serializer, via the underlying protocol.
     * @param data - The message to send to the server.
     * @returns - A Promise that will resolve when the message has been sent.
     * @async
     */
    send(data: any): Promise<AxiosResponse>;
    defaultConfig(): HttpTransportConfig;
    protected newClient(config: HttpTransportConfig): AxiosInstance;
}
