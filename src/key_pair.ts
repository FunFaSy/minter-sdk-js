import {
  assertIsBuffer,
  assertIsString,
  Assignable,
  base_decode,
  base_encode,
  bufferToInt,
  ECDSASignatureBuffer,
  ecrecover,
  ecsign,
  ethIsValidPublic,
  ethPrivateToPublic,
  ethPublicToAddress,
  isBuffer,
  isString,
  MinterPrefix,
  rlp,
  secp256k1,
  sha256,
  toBuffer,
} from './util';
import BN from 'bn.js';
import {List} from 'rlp/src/types';

type Input = Buffer | string | number | bigint | Uint8Array | BN | List | null

export type Arrayish = string | ArrayLike<number>;

/** All supported key types */
export enum KeyType {
  UNKNOWN   = 'UNKNOWN', // Unknown
  SECP256K1 = 'SECP256K1', // ECDSA
  ED25519   = 'ED25519', // EdDSA
}

const keyType2Str = (keyType: KeyType): string => {
  switch (keyType) {
  case KeyType.SECP256K1:
    return 'secp256k1';
  case KeyType.ED25519:
    return 'ed25519';
  default:
    throw new Error(`Unknown key type ${keyType}`);
  }
};

const str2KeyType = (keyType: string): KeyType => {
  switch (keyType.toLowerCase()) {
  case 'ed25519':
    return KeyType.ED25519;
  case 'secp256k1':
    return KeyType.SECP256K1;
  default:
    throw new Error(`Unknown key type ${keyType}`);
  }
};

export abstract class KeyPair {
  readonly _keyType: KeyType;
  readonly _secretKey: Buffer;

  constructor(secretKey: Buffer, type = KeyType.UNKNOWN) {
    this._secretKey = secretKey;
    this._keyType = type;
  }

  abstract get publicKey(): PublicKey ;

  get type(): KeyType {
    return this._keyType;
  }

  get address(): Address {
    return this.publicKey.address;
  }

  /**
   * @param curve Name of elliptical curve, case-insensitive
   * @returns Random KeyPair based on the curve
   */
  static fromRandom(curve: KeyType | string = KeyType.SECP256K1): KeyPair {
    let _curve = KeyType.SECP256K1;
    if (!curve) {
      if (isString(curve)) {
        _curve = str2KeyType(curve.toString());
      } else {
        _curve = curve as KeyType;
      }
    }

    switch (_curve) {
    case KeyType.SECP256K1:
      return KeyPairSecp256k1.fromRandom();
      // case KeyType.ED25519:
      //     return KeyPairEd25519.fromRandom();
    default:
      throw new Error(`Unknown curve ${curve}`);
    }
  }

  /**
   * Construct an instance of key pair given a secret key.
   * It's generally assumed that these are encoded in base58check.
   * @param secretKey
   */
  static fromString(secretKey: string): KeyPair {
    const parts = secretKey.split(':');
    if (parts.length === 1) {
      return new KeyPairSecp256k1(parts[0]);
    }
    //
    else if (parts.length === 2) {
      switch (str2KeyType(parts[0])) {
      case KeyType.SECP256K1:
        return new KeyPairSecp256k1(parts[1]);
        // case KeyType.ED25519:
        //     return new KeyPairEd25519(parts[1]);
      default:
        throw new Error(`Unknown curve: ${parts[0]}`);
      }
    }
    //
    else {
      throw new Error(
        'Invalid encoded key format, must be <curve>:<encoded key>');
    }
  }

  /**
   *
   * @param message Sha256 hash of `message`
   */
  abstract sign(message: Buffer): Signature;

  /**
   *
   * @param message   Buffer Sha256 hash of `message`
   * @param signature Buffer[]
   */
  abstract verify(message: Buffer, signature: Buffer[]): boolean;

  toString(): string {
    return `${keyType2Str(this.publicKey.keyType)}:${base_encode(this._secretKey)}`;
  }
}

/**
 * This class provides key pair functionality for Secp256k1 curve:
 * generating key pairs, encoding key pairs, signing and verifying.
 */
export class KeyPairSecp256k1 extends KeyPair {
  /**
   * Construct an instance of key pair given a secret key.
   * It's generally assumed that these are encoded in base58check.
   * @param {string} secretKey
   */
  constructor(secretKey: string) {
    assertIsString(secretKey);
    let _secretKey: Buffer;

    const parts = secretKey.split(':');
    if (parts.length < 2) {
      _secretKey = base_decode(parts[0]);
    } else {
      _secretKey = base_decode(parts[1]);
    }

    super(_secretKey, KeyType.SECP256K1);

    const publicKey = ethPrivateToPublic(_secretKey);
    this._publicKey = new PublicKey({keyType: KeyType.SECP256K1, raw: publicKey});
  }

  protected _publicKey: PublicKey;

  get publicKey(): PublicKey {
    return this._publicKey;
  }

  /**
   * Generate a new random secp256k1 keypair.
   * @example
   * ```js
   * ```
   */
  static fromRandom(): KeyPair {
    const secretKey = secp256k1.createPrivateKeySync();
    return new KeyPairSecp256k1(base_encode(secretKey));
  }

  /**
   * Sign message and return ECDSASignature
   *
   * @param message Buffer Sha256 hash of `message`
   */
  sign(message: Buffer): Signature {
    assertIsBuffer(message);

    const vrsSig = ecsign(message, this._secretKey);
    return new Signature(toBuffer(vrsSig.v), vrsSig.r, vrsSig.s);
  }

  /**
   * Check if message signed by current key pair
   *
   * @param message Sha256 hash of `message`
   * @param signature Buffer [v,r,s] from Ethereum ECDSASignature
   */
  verify(message: Buffer, signature: Buffer[]): boolean {
    return this._publicKey.verify(message, signature);
  }
}

/**
 * PublicKey representation that has type and bytes of the key.
 */
export class PublicKey extends Assignable {
  keyType: KeyType;
  protected raw: Buffer;

  constructor(properties: Record<string, any>) {
    super(properties);

    if (0 < this.raw.length) {
      this._address = Address.fromPublicKey(this);
    }
  }

  protected _address: Address;

  /**
   *
   */
  get address(): Address {
    if (this._address instanceof Address) {
      return this._address;
    }

    if (0 < this.raw.length) {
      this._address = Address.fromPublicKey(this);
    }

    return this._address;
  }

  static from(value: string | Buffer | PublicKey): PublicKey {

    if (typeof value === 'string') {
      return PublicKey.fromString(value);
    }
    //
    else if (isBuffer(value)) {
      return PublicKey.fromBuffer(value);
    }

    return value;
  }

  /**
   * It's generally assumed that these are encoded in base58check.
   * @param {string} encodedKey
   */
  static fromString(encodedKey: string): PublicKey {
    assertIsString(encodedKey);

    const parts = encodedKey.split(':');
    if (parts.length === 1) {
      return new PublicKey({keyType: KeyType.SECP256K1, raw: base_decode(parts[0])});
    }
    //
    else if (parts.length === 2) {
      return new PublicKey({keyType: str2KeyType(parts[0]), raw: base_decode(parts[1])});
    }
    //
    else {
      throw new Error('Invalid encoded key format, must be <curve>:<encoded key>');
    }
  }

  static fromBuffer(buf: Buffer): PublicKey {
    assertIsBuffer(buf);
    return new PublicKey({keyType: KeyType.SECP256K1, raw: buf});
  }

  /**
   *
   * @param message
   * @param signature
   */
  static fromMessageBuf(message: Buffer, signature: Buffer[]): PublicKey {
    assertIsBuffer(signature[0]);
    assertIsBuffer(signature[1]);
    assertIsBuffer(signature[2]);

    const bufV: Buffer = signature[0];
    const bufR: Buffer = signature[1];
    const bufS: Buffer = signature[2];

    const v = bufferToInt(bufV);

    return PublicKey.fromBuffer(ecrecover(message, v, bufR, bufS));

  }

  /**
   *
   */
  toString(): string {
    // native Minter encoding `0x${this.raw.toString('hex')}`
    return `${keyType2Str(this.keyType)}:${base_encode(this.raw)}`;
  }

  /**
   * Check if message signed by current public key owner
   *
   * @param message Sha256 hash of `message`
   * @param signature Buffer [v,r,s] from Ethereum ECDSASignature
   */
  verify(message: Buffer, signature: Buffer[]): boolean {
    switch (this.keyType) {
    // case KeyType.ED25519:
    //     return nacl.sign.detached.verify(message, signature, this.data);
    case KeyType.SECP256K1: {
      const msgPublicKey = PublicKey.fromMessageBuf(message, signature);
      return msgPublicKey && this.raw.equals(msgPublicKey.getRaw());
    }
    //
    default:
      throw new Error(`Unknown key type ${this.keyType}`);
    }
  }

  /**
   *
   */
  getRaw(): Buffer {return Buffer.from(this.raw);}// Copy of pub key
}

/**
 *
 */
export class Address extends Assignable {
  protected publicKey: PublicKey;
  protected raw: Buffer;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static fromPublicKey(publicKey: PublicKey): Address {
    return new Address({
      publicKey: publicKey,
      raw      : ethPublicToAddress(publicKey.getRaw()),
    });
  }

  getRaw(): Buffer {
    return this.raw;
  }

  toString(): string {
    return `${MinterPrefix.ADDRESS}${this.raw.toString('hex')}`;
  }
}

/**
 *
 */
export class Signature implements ECDSASignatureBuffer {
  type: string;

  constructor(public v: Buffer, public r: Buffer, public s: Buffer) {
    this.type = 'ECDSA';
  }

  /**
   *
   * @param signature string
   */
  static fromString(signature: string): Signature {
    assertIsString(signature);

    const parts = signature.split(':');
    if (parts.length === 1) {
      const encodedSig = parts[0];// Buffer encoded 0x Prefixed Hex
      // const vrsSig = fromRpcSig(encodedSig.toString());
      const vrsSig = rlp.decode(toBuffer(encodedSig) as Input);
      return new Signature(toBuffer(vrsSig[0]), vrsSig[1], vrsSig[2]);
    }
    //
    else if (parts.length === 2) {
      const type = parts[0];

      switch (type) {
      case 'ECDSA': {
        return Signature.fromString(parts[1]);
      }
      default:
        throw new Error(`Unknown signature type: ${type}`);
      }
    }
    //
    else {
      throw new Error('Invalid encoded signature format, must be <curve>:<encoded sig>');
    }
  }

  getRaw(): Buffer[] {
    return [this.v, this.r, this.s];
  }

  /**
   *
   */
  toString(): string {

    if (this.valid()) {
      // ETH serialization/
      // const sigEncoded = toRpcSig(this.v, this.r, this.s); // 0x prefixed Hex string
      // Minter serialization
      const sigEncoded = rlp.encode([this.v, this.r, this.s]).toString('hex');
      return `${this.type}:0x${sigEncoded}`;
    }
    throw new Error('Invalid signature');

  }

  /**
   * Determines if the signature is valid ECDSA signature
   */
  valid(): boolean {
    const message = sha256(Buffer.from([]));
    const pubKey = PublicKey.fromMessageBuf(message, [this.v, this.r, this.s]);
    return ethIsValidPublic(pubKey.getRaw());
  }

}
