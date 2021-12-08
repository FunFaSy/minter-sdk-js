"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serializer_1 = __importDefault(require("./serializer"));
const util_1 = require("../util");
/**
 *
 */
class JsonSerializer extends serializer_1.default {
    /**
     * Serializes an object to either binary or a string.
     * @param object - Object to be serialized.
     */
    serialize(object) {
        return JSON.stringify(object);
    }
    /**
     * Deserializes an existing object to a message.
     * This method verifies that the object conforms to the JSON-RPC 2.0 specification
     *
     * @param message - The message to deserialize.
     * @param batch - Indicates if the message may be a batch request (array of messages).
     */
    deserialize(message, batch = false) {
        if (util_1.isString(message)) {
            try {
                message = JSON.parse(message);
            }
            catch (e) {
                throw new util_1.TypedError(`Invalid json data format. ${e}`, 'BadResponse', message);
            }
        }
        return message;
    }
}
exports.default = JsonSerializer;
