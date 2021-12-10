import Serializer from './serializer';
/**
 * Transports facilitate the exchange of messages between Server and Client.
 * The transport can be used either as a server (listening for connections) or as a client (maintaining a single connection to a server).
 */
export default abstract class Transport {
    protected serializer: Serializer;
    /**
     * Creates a Transport object.
     * @param serializer - The serializer that will be used to serialize and deserialize requests.
     */
    constructor(serializer: Serializer);
    /**
     * Generates a unique id that can be used to distinguish between connected clients.
     * The unique id will be a UUID v4 returned as a Uint8Array.
     */
    static uniqueId(): Uint8Array;
    /**
     * This method will be used to send a Message to the server, using the serializer, via the underlying protocol.
     * @param message - The message to send to the server.
     * @returns - A Promise that will resolve when the message has been sent.
     * @async
     */
    abstract send(message: any): Promise<any>;
}
