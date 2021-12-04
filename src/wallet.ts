import * as bip39 from 'bip39';
import {HDKey} from 'ethereum-cryptography/hdkey';
import {HDKeyT} from 'ethereum-cryptography/pure/hdkey';
import {assert, stripHexPrefix} from './util/external';
import {assertIsHexString, assertIsMnemonic, assertIsPositiveInt, base_encode} from './util';
import { KeyPairSecp256k1} from './key_pair';
import {MINTER_BIP44_DERIVATION_COIN_ID} from './constants';

/**
 *
 */
export abstract class HdWallet {
    /**
     * @see https://github.com/satoshilabs/slips/blob/ef6d7700cc/slip-0044.md
     *
     * @param coinId
     * @param accountId
     * @param pub
     */
    static makeDerivationBasePath(coinId = 491, accountId = 0, pub = true) {
        return `m/44'/${coinId}'/${accountId}'/${pub ? 0 : 1}`;
    }
}

/**
 *
 */
export class Wallet extends HdWallet {
    private readonly hdKey: HDKeyT;
    readonly coinId: number;
    readonly accountId: number;

    constructor(hdKey: HDKeyT, accountId = 0) {
        super();
        assert(hdKey);

        this.hdKey = hdKey;

        this.coinId = MINTER_BIP44_DERIVATION_COIN_ID; // 491 Bip Minter // 60 Eth
        this.accountId = accountId;
    }

    /**
     *
     * @param seed 0x prefixed Hex String
     * @param accountId Number
     */
    static fromSeed(seed: string, accountId = 0): Wallet {
        assertIsHexString(seed);

        const hdKey = HDKey.fromMasterSeed(Buffer.from(stripHexPrefix(seed), 'hex'));

        return new Wallet(hdKey, accountId);
    }

    /**
     *
     * @param mnemonic
     * @param accountId
     */
    static fromMnemonic(mnemonic: string, accountId = 0): Wallet {
        assertIsMnemonic(mnemonic);

        const seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
        return Wallet.fromSeed(`0x${seed}`, accountId);
    }

    /**
     * KeyPair for public or private usage.
     * Public means for receive operations in general.
     * Private means for exchange operations or accounting;
     *
     * @param index
     * @param pub
     */
    getKeyPair(index = 0, pub = true): KeyPairSecp256k1 {
        assertIsPositiveInt(index);
        const deriveBasePath = Wallet.makeDerivationBasePath(this.coinId, this.accountId, pub);
        const address = this.hdKey.derive(deriveBasePath).deriveChild(index);

        return new KeyPairSecp256k1(base_encode(address.privateKey));
    }
}

