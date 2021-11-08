import * as  minterApi from '../src';
import {secp256k1PublicKeyFromMessage, Signature} from '../src/key_pair';
import {PublicKey} from '../src';

const sha256 = minterApi.utils.sha256;

const SECRET_SECP256K1 = '2bWofE5FJW7owdxijxBBwDQbgJkMBCxSGWeEdGcNgKxeTJcA5P';
const SECRET_SECP256K1_FULL = `secp256k1:${SECRET_SECP256K1}`;

const PUBKEY_SECP256K1 = 'GB59SoJNZJW8jzWiXjyPAu83K1gYdjtGC6YXsJ3M3gQKkWw3mkQyptFPM75S2VtuNNhC7N4VmisUDpXGmi7qGwmzyWEiG';
const PUBKEY_SECP256K1_FULL = `secp256k1:${PUBKEY_SECP256K1}`;
const ADDRESS = 'Mxf63e99f6e41ff87d7db603db4702a553c709f3d9';

const MESSAGE ='message';
const SIGNATURE_FULL = 'ECDSA:0x0281140e76248641800d6bf303fe7c0f883fa7b614e1a8ef3cff1efc09afbc0539dfdf59012d2df0259d246e6947445507043777de33424819aaf7d5e64771961c';

//
test('[KeyPair] KeyPair from secret', async () => {
    const keyPair = new minterApi.KeyPairSecp256k1(SECRET_SECP256K1_FULL);
    expect(keyPair.publicKey().toString()).toEqual(PUBKEY_SECP256K1_FULL);

    const keyPair1 = minterApi.KeyPairSecp256k1.fromString(SECRET_SECP256K1_FULL);
    expect(keyPair1.publicKey().toString()).toEqual(PUBKEY_SECP256K1_FULL);

});

//
test('[KeyPair] KeyPair convert to string', async () => {
    const keyPair = minterApi.KeyPairSecp256k1.fromRandom();
    const newKeyPair = minterApi.KeyPairSecp256k1.fromString(keyPair.toString());
    expect(newKeyPair.toString()).toEqual(keyPair.toString());

    const keyPair1 = minterApi.KeyPairSecp256k1.fromString(SECRET_SECP256K1_FULL);
    expect(keyPair1.toString()).toEqual(SECRET_SECP256K1_FULL);
});

//
test('[KeyPair] Sign and verify signature', async () => {
    const keyPair = minterApi.KeyPairSecp256k1.fromString(SECRET_SECP256K1_FULL);

    const message = Buffer.from(MESSAGE);
    const hash = sha256(message);
    const signature = keyPair.sign(hash);
    expect(signature.toString()).toEqual(SIGNATURE_FULL);
});


//
test('[KeyPair] Sign and verify signature with random', async () => {
    const keyPair = minterApi.KeyPairSecp256k1.fromRandom();

    const message = Buffer.from(MESSAGE);
    const hash = sha256(message);
    const signature = keyPair.sign(hash);
    expect(keyPair.verify(hash, signature.getRaw())).toBeTruthy();

    const message1 = Buffer.from(MESSAGE+' new');
    const hash1 = sha256(message1);
    expect(keyPair.verify(hash1, signature.getRaw())).toBeFalsy();
});


//
test('[KeyPair] Sign and verify with public key', async () => {
    const keyPair = minterApi.KeyPairSecp256k1.fromString(SECRET_SECP256K1_FULL);
    const message = Buffer.from(MESSAGE);
    const hash = sha256(message);
    const signature = keyPair.sign(hash);

    const publicKey = minterApi.PublicKey.from(PUBKEY_SECP256K1_FULL);
    expect(publicKey.verify(hash, signature.getRaw())).toBeTruthy();

    const message1 = Buffer.from(MESSAGE+' new');
    const hash1 = sha256(message1);
    expect(keyPair.verify(hash1, signature.getRaw())).toBeFalsy();

});

//
test('[KeyPair] Restore and verify signer address', async () => {
    const message = Buffer.from(MESSAGE);
    const hash = sha256(message);
    const signature = Signature.fromString(SIGNATURE_FULL);

    const signerPublicKeyBuf = secp256k1PublicKeyFromMessage(hash, signature.getRaw());
    const signerPublicKey = PublicKey.from(signerPublicKeyBuf);
    const signerAddress = signerPublicKey.address();

    expect(signerAddress.toString()).toEqual(ADDRESS);
});
