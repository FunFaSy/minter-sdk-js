"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
/**
 * Transports facilitate the exchange of messages between Server and Client.
 * The transport can be used either as a server (listening for connections) or as a client (maintaining a single connection to a server).
 */
class Transport {
    /**
       * Creates a Transport object.
       * @param serializer - The serializer that will be used to serialize and deserialize requests.
       */
    constructor(serializer) {
        this.serializer = serializer;
    }
    /**
       * Generates a unique id that can be used to distinguish between connected clients.
       * The unique id will be a UUID v4 returned as a Uint8Array.
       */
    static uniqueId() {
        return util_1.uuid();
    }
}
exports.default = Transport;
