export default abstract class Serializer {
    /**
     * Serializes an object to either binary or a string.
     * @param object - Object to be serialized.
     */
    abstract serialize(object: any): Uint8Array|string;
    /**
     * Deserializes an existing object to a message.
     * This method verifies that the object conforms to the JSON-RPC 2.0 specification
     *
     * @param object - The object.
     * @param batch - Indicates if the message may be a batch request (array of messages).
     */
    abstract deserialize(object: any, batch?: boolean): any;
}
