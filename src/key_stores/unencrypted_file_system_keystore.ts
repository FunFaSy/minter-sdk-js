import fs from 'fs';
import path from 'path';
import {promisify as _promisify} from 'util';

import {KeyStore} from './keystore';
import {KeyPair} from '../key_pair';
import {ChainId} from '../chain/types';
import {fArgReturn} from '../util';

const promisifyFs = (fn: fArgReturn): fArgReturn => {
  if (!fn) {
    return () => {
      throw new Error('Trying to use unimplemented function. `fs` module not available in web build?');
    };
  }
  return _promisify(fn);
};

const exists = promisifyFs(fs.exists);
const readFile = promisifyFs(fs.readFile);
const writeFile = promisifyFs(fs.writeFile);
const unlink = promisifyFs(fs.unlink);
const readdir = promisifyFs(fs.readdir);
const mkdir = promisifyFs(fs.mkdir);

/**
 * Format of the account stored on disk.
 */
interface AccountInfo {
  account_id: string;
  public_key: string;
  private_key: string;
}

/** @hidden */
export async function loadJsonFile(filename: string): Promise<any> {
  const content = await readFile(filename);
  return JSON.parse(content.toString());
}

async function ensureDir(dir: string): Promise<void> {
  try {
    await mkdir(dir, {recursive: true});
  }
  catch (err) {
    if (err.code !== 'EEXIST') { throw err; }
  }
}

/** @hidden */
export async function readKeyFile(filename: string): Promise<{ account_id: string; keyPair: KeyPair }> {
  const accountInfo: AccountInfo = await loadJsonFile(filename);
  // The private key might be in private_key or secret_key field.
  let privateKey = accountInfo.private_key;
  if (!privateKey && accountInfo['secret_key']) {
    privateKey = accountInfo['secret_key'];
  }
  return {account_id: accountInfo.account_id, keyPair: KeyPair.fromString(privateKey)};

}

/**
 * This module contains the {@link UnencryptedFileSystemKeyStore} class which is used to store keys on the file system.
 */
export class UnencryptedFileSystemKeyStore extends KeyStore {
  /** @hidden */
  readonly keyDir: string;

  /**
   * @param keyDir base directory for key storage. Keys will be stored in `keyDir/chainId/accountId.json`
   */
  constructor(keyDir: string) {
    super();
    this.keyDir = path.resolve(keyDir);
  }

  /**
   * Store a {@link KeyPair} in an unencrypted file
   * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
   * @param accountId The Minter account tied to the key pair
   * @param keyPair The key pair to store in local storage
   */
  async setKey(chainId: ChainId, accountId: string, keyPair: KeyPair): Promise<void> {
    await ensureDir(`${this.keyDir}/${chainId}`);

    const content: AccountInfo = {
      account_id : accountId,
      public_key : keyPair.publicKey.toString(),
      private_key: keyPair.toString(),
    };

    await writeFile(this.getKeyFilePath(chainId, accountId), JSON.stringify(content), {mode: 0o600});
  }

  /**
   * Gets a {@link KeyPair} from an unencrypted file
   * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
   * @param accountId The Minter account tied to the key pair
   * @returns {Promise<KeyPair>}
   */
  async getKey(chainId: ChainId, accountId: string): Promise<KeyPair> {
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
  async removeKey(chainId: ChainId, accountId: string): Promise<void> {
    if (await exists(this.getKeyFilePath(chainId, accountId))) {
      await unlink(this.getKeyFilePath(chainId, accountId));
    }
  }

  /**
   * Deletes all unencrypted files from the `keyDir` path.
   */
  async clear(): Promise<void> {
    for (const network of await this.getChains()) {
      for (const account of await this.getAccounts(network as ChainId)) {
        await this.removeKey(network as ChainId, account);
      }
    }
  }

  /**
   * Get the network(s) from subdirectory names in `keyDir`
   * @returns {Promise<string[]>}
   */
  async getChains(): Promise<string[]> {
    const files: fs.Dirent[] = await readdir(this.keyDir, {withFileTypes: true});
    return files.filter(item => item.isDirectory()).map(item => item.name);
  }

  /**
   * Gets the account(s) files in `keyDir/chainId`
   * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
   * @returns{Promise<string[]>}
   */
  async getAccounts(chainId: ChainId): Promise<string[]> {
    if (!await exists(`${this.keyDir}/${chainId}`)) {
      return [];
    }

    const files: string[] = await readdir(`${this.keyDir}/${chainId}`);

    return files.filter(file => file.endsWith('.json')).map(file => file.replace(/.json$/, ''));
  }

  /** @hidden */
  toString(): string {
    return `UnencryptedFileSystemKeyStore(${this.keyDir})`;
  }

  async entries(): Promise<IterableIterator<[string, string]>> {
    const result: [string, string][] = [];
    for (const network of await this.getChains()) {
      for (const account of await this.getAccounts(network as ChainId)) {
        const key = this.getKeyFilePath(network as ChainId, account);
        const val = await this.getKey(network as ChainId, account);
        result.push([key, val.toString()]);
      }
    }

    function* entries(): IterableIterator<[string, string]> {
      for (const pair of result) {
        yield pair;
      }
    }

    return entries();
  }

  /** @hidden */
  private getKeyFilePath(chainId: ChainId, accountId: string): string {
    return `${this.keyDir}/${chainId}/${accountId}.json`;
  }
}
