"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnencryptedFileSystemKeyStore = exports.readKeyFile = exports.loadJsonFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const keystore_1 = require("./keystore");
const key_pair_1 = require("../key_pair");
const promisifyFs = (fn) => {
    if (!fn) {
        return () => {
            throw new Error('Trying to use unimplemented function. `fs` module not available in web build?');
        };
    }
    return util_1.promisify(fn);
};
const exists = promisifyFs(fs_1.default.exists);
const readFile = promisifyFs(fs_1.default.readFile);
const writeFile = promisifyFs(fs_1.default.writeFile);
const unlink = promisifyFs(fs_1.default.unlink);
const readdir = promisifyFs(fs_1.default.readdir);
const mkdir = promisifyFs(fs_1.default.mkdir);
/** @hidden */
async function loadJsonFile(filename) {
    const content = await readFile(filename);
    return JSON.parse(content.toString());
}
exports.loadJsonFile = loadJsonFile;
async function ensureDir(dir) {
    try {
        await mkdir(dir, { recursive: true });
    }
    catch (err) {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }
}
/** @hidden */
async function readKeyFile(filename) {
    const accountInfo = await loadJsonFile(filename);
    // The private key might be in private_key or secret_key field.
    let privateKey = accountInfo.private_key;
    if (!privateKey && accountInfo['secret_key']) {
        privateKey = accountInfo['secret_key'];
    }
    return { account_id: accountInfo.account_id, keyPair: key_pair_1.KeyPair.fromString(privateKey) };
}
exports.readKeyFile = readKeyFile;
/**
 * This module contains the {@link UnencryptedFileSystemKeyStore} class which is used to store keys on the file system.
 */
class UnencryptedFileSystemKeyStore extends keystore_1.KeyStore {
    /**
     * @param keyDir base directory for key storage. Keys will be stored in `keyDir/chainId/accountId.json`
     */
    constructor(keyDir) {
        super();
        this.keyDir = path_1.default.resolve(keyDir);
    }
    /**
     * Store a {@link KeyPair} in an unencrypted file
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     * @param keyPair The key pair to store in local storage
     */
    async setKey(chainId, accountId, keyPair) {
        await ensureDir(`${this.keyDir}/${chainId}`);
        const content = {
            account_id: accountId,
            public_key: keyPair.publicKey.toString(),
            private_key: keyPair.toString(),
        };
        await writeFile(this.getKeyFilePath(chainId, accountId), JSON.stringify(content), { mode: 0o600 });
    }
    /**
     * Gets a {@link KeyPair} from an unencrypted file
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    async getKey(chainId, accountId) {
        // Find key / account id.
        if (!await exists(this.getKeyFilePath(chainId, accountId))) {
            return null;
        }
        const accountKeyPair = await readKeyFile(this.getKeyFilePath(chainId, accountId));
        return accountKeyPair.keyPair;
    }
    /**
     * Deletes an unencrypted file holding a {@link KeyPair}
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @param accountId The Minter account tied to the key pair
     */
    async removeKey(chainId, accountId) {
        if (await exists(this.getKeyFilePath(chainId, accountId))) {
            await unlink(this.getKeyFilePath(chainId, accountId));
        }
    }
    /**
     * Deletes all unencrypted files from the `keyDir` path.
     */
    async clear() {
        for (const network of await this.getChains()) {
            for (const account of await this.getAccounts(network)) {
                await this.removeKey(network, account);
            }
        }
    }
    /**
     * Get the network(s) from subdirectory names in `keyDir`
     * @returns {Promise<string[]>}
     */
    async getChains() {
        const files = await readdir(this.keyDir, { withFileTypes: true });
        return files.filter(item => item.isDirectory()).map(item => item.name);
    }
    /**
     * Gets the account(s) files in `keyDir/chainId`
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     * @returns{Promise<string[]>}
     */
    async getAccounts(chainId) {
        if (!await exists(`${this.keyDir}/${chainId}`)) {
            return [];
        }
        const files = await readdir(`${this.keyDir}/${chainId}`);
        return files.filter(file => file.endsWith('.json')).map(file => file.replace(/.json$/, ''));
    }
    /** @hidden */
    toString() {
        return `UnencryptedFileSystemKeyStore(${this.keyDir})`;
    }
    /** @hidden */
    getKeyFilePath(chainId, accountId) {
        return `${this.keyDir}/${chainId}/${accountId}.json`;
    }
    async entries() {
        const result = [];
        for (const network of await this.getChains()) {
            for (const account of await this.getAccounts(network)) {
                const key = this.getKeyFilePath(network, account);
                const val = await this.getKey(network, account);
                result.push([key, val.toString()]);
            }
        }
        function* entries() {
            for (const pair of result) {
                yield pair;
            }
        }
        return entries();
    }
}
exports.UnencryptedFileSystemKeyStore = UnencryptedFileSystemKeyStore;
