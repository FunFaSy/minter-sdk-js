import * as  minterApi from '../src';

const sha256 = minterApi.utils.sha256;

const MNEMONIC = 'solar when satoshi champion about zebra crop solution leopard senior ability vocal';

const SECRET_SECP256K1 = 'oYHhCijezmKqxduKENqWnkMYCuAeYZugduz3WusG1SjBVVQia';
const SECRET_SECP256K1_FULL = `secp256k1:${SECRET_SECP256K1}`;

const PUBKEY_SECP256K1 = 'WWjcQcvUjNi9AC5Y6zQGLYQy64mL1C3dnZgGZ3HfC28B9R22WFuuNpj8d14dUDJ1MsCSUkPbPrpExXh8vMbt5Vo9TtmC9';
const PUBKEY_SECP256K1_FULL = `secp256k1:${PUBKEY_SECP256K1}`;
const ADDRESS = 'Mx0bd4dd45fc7072ce6f1a4b297706174ee2f86910';

const MESSAGE = 'message';
const SIGNATURE_FULL = 'ECDSA:0x36e4508cc3cf7e3a7f54aa5067dfa6559c894819a03210dde1c9f43154eb494a5c7a5499a0da6cec3bfc6dbd478e7d6d9f0c86d6a4dd5e3ed4554dd7324488201c';

//
test('[KeyPair] KeyPair from secret', async () => {
    const keyPair = new minterApi.KeyPairSecp256k1(SECRET_SECP256K1_FULL);
    expect(keyPair.publicKey().toString()).toEqual(PUBKEY_SECP256K1_FULL);

    const keyPair1 = minterApi.KeyPairSecp256k1.fromString(SECRET_SECP256K1_FULL);
    expect(keyPair1.publicKey().toString()).toEqual(PUBKEY_SECP256K1_FULL);

});


//
test('[KeyPair] KeyPair from BIP39 mnemonic', async () => {
    const keyPair = minterApi.KeyPairSecp256k1.fromBip39Mnemonic(MNEMONIC);
    expect(keyPair.publicKey().toString()).toEqual(PUBKEY_SECP256K1_FULL);
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

    const message1 = Buffer.from(MESSAGE + ' new');
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

    const message1 = Buffer.from(MESSAGE + ' new');
    const hash1 = sha256(message1);
    expect(keyPair.verify(hash1, signature.getRaw())).toBeFalsy();

});

//
test('[KeyPair] Restore signer publicKey and verify signer address', async () => {
    const message = Buffer.from(MESSAGE);
    const hash = sha256(message);
    const signature = minterApi.SignatureSecp256k1.fromString(SIGNATURE_FULL);

    const signerPublicKeyBuf = minterApi.KeyPairSecp256k1.publicKeyFromMessageBuf(hash, signature.getRaw());
    const signerPublicKey = minterApi.PublicKey.from(signerPublicKeyBuf);
    const signerAddress = signerPublicKey.address();

    expect(signerAddress.toString()).toEqual(ADDRESS);
});
