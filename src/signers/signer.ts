import {PublicKey, Signature} from '../key_pair';
import {SignedTransaction, Transaction} from '../transaction';
import {ChainId} from '../chain/types';

/**
 * General signing interface, can be used for in memory signing, RPC singing, external wallet, HSM, etc.
 */
export abstract class Signer {

    /**
     * Signs given message, by first hashing with sha256.
     * @param message message to sign.
     * @param accountId accountId to use for signing.
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     */
    abstract sign(message: Buffer, accountId: string, chainId: ChainId): Promise<Signature>;

    /**
     *
     * @param tx
     * @param accountId
     * @param chainId
     */
    abstract signTransaction(tx: Transaction, accountId: string, chainId: ChainId): Promise<SignedTransaction>;

    /**
     * Returns public key for given account / network.
     * @param accountId accountId to retrieve from.
     * @param chainId The targeted network. (ex. mainnet, testnet, etc…)
     */
    abstract publicKey(accountId: string, chainId: ChainId): Promise<PublicKey>;
}
