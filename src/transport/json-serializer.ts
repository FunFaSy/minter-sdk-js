import Serializer from './serializer';
import {isString, TypedError} from '../util';

/**
 *
 */
export default class JsonSerializer extends Serializer {
  /**
     * Serializes an object to either binary or a string.
     * @param object - Object to be serialized.
     */
  serialize(object: any): Uint8Array | string {
    return JSON.stringify(object);
  }

  /**
     * Deserializes an existing object to a message.
     * This method verifies that the object conforms to the JSON-RPC 2.0 specification
     *
     * @param message - The message to deserialize.
     * @param batch - Indicates if the message may be a batch request (array of messages).
     */
  deserialize(message: any, batch = false): any | Promise<any> {

    if (isString(message)) {
      try {
        message = JSON.parse(message);
      }
      catch (e) {
        throw new TypedError(`Invalid json data format. ${e}`, 'BadResponse', message);
      }
    }
    return message;

  }
}
