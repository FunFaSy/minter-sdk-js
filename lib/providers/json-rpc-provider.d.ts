import { Provider } from './provider';
import { ConnectionInfo } from '../util';
import { NodeStatusResult } from './types';
/**
 * Client class to interact with the Minter RPC API.
 * @see {@link https://#}
 */
export declare class JsonRpcProvider extends Provider {
    /** @hidden */
    readonly connection: ConnectionInfo;
    /**
     * @param connection
     */
    constructor(connection: string | ConnectionInfo);
    sendRpcCall<T>(url: string, data?: object): Promise<T>;
    status(): Promise<NodeStatusResult>;
}
