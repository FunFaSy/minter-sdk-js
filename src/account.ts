import {base_encode, BNLike, BufferLike} from './util';
import * as bip39 from 'bip39';
import {HDKey as hdKey} from 'ethereum-cryptography/hdkey';
import {MINTER_DERIVATION_PATH} from './constants';
import {KeyPairSecp256k1} from './key_pair';
import {assert} from './util/external';

export interface AccountData {
    nonce?: BNLike;
    balance?: BufferLike;
    delegated?: BufferLike;
    total?: BufferLike;
    transaction_count?: BNLike;
    bip_value?: BNLike;
}

const isValidMnemonic = (mnemonic) => {
    return typeof mnemonic === 'string' && mnemonic.trim().split(/\s+/g).length >= 12 &&
        bip39.validateMnemonic(mnemonic);
};

export class Account {

    static create() {
        const mnemonic = bip39.generateMnemonic();
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        const privateKey = hdKey.fromMasterSeed(seed).derive(MINTER_DERIVATION_PATH).deriveChild(0).privateKey;

        return {mnemonic, keyPair: new KeyPairSecp256k1(base_encode(privateKey))};
    }

    static fromMnemonic(mnemonic) {
        assert(isValidMnemonic(mnemonic), 'Invalid mnemonic phrase');

        const seed = bip39.mnemonicToSeedSync(mnemonic);
        const privateKey = hdKey.fromMasterSeed(seed).derive(MINTER_DERIVATION_PATH).deriveChild(0).privateKey;

        return {mnemonic, keyPair: new KeyPairSecp256k1(base_encode(privateKey))};
    }

}
