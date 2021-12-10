import Serializer from './serializer';
/**
 *
 */
export default class JsonSerializer extends Serializer {
    /**
     * Serializes an object to either binary or a string.
     * @param object - Object to be serialized.
     */
    serialize(object: any): Uint8Array | string;
    /**
     * Deserializes an existing object to a message.
     * This method verifies that the object conforms to the JSON-RPC 2.0 specification
     *
     * @param message - The message to deserialize.
     * @param batch - Indicates if the message may be a batch request (array of messages).
     */
    deserialize(message: any, batch?: boolean): any | Promise<any>;
}
