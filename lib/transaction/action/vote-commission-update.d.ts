/// <reference types="bn.js" />
/// <reference types="node" />
import { Action } from './base_action';
import { RlpSchemaField } from '../../util/define-properties';
import { BN } from '../../util/external';
/**
 *
 */
export interface VoteCommissionUpdateActionParams {
    publicKey: string;
    height: number | BN;
    coin: number | BN;
    payloadByte: string | BN;
    send: string | BN;
    buyBancor: string | BN;
    sellBancor: string | BN;
    sellAllBancor: string | BN;
    buyPoolBase: string | BN;
    sellPoolBase: string | BN;
    sellAllPoolBase: string | BN;
    buyPoolDelta: string | BN;
    sellPoolDelta: string | BN;
    sellAllPoolDelta: string | BN;
    createTicker3: string | BN;
    createTicker4: string | BN;
    createTicker5: string | BN;
    createTicker6: string | BN;
    createTicker7to10: string | BN;
    createCoin: string | BN;
    createToken: string | BN;
    recreateCoin: string | BN;
    recreateToken: string | BN;
    declareCandidacy: string | BN;
    delegate: string | BN;
    unbond: string | BN;
    redeemCheck: string | BN;
    setCandidateOn: string | BN;
    setCandidateOff: string | BN;
    createMultisig: string | BN;
    multisendBase: string | BN;
    multisendDelta: string | BN;
    editCandidate: string | BN;
    setHaltBlock: string | BN;
    editTickerOwner: string | BN;
    editMultisig: string | BN;
    editCandidatePublicKey: string | BN;
    createSwapPool: string | BN;
    addLiquidity: string | BN;
    removeLiquidity: string | BN;
    editCandidateCommission: string | BN;
    burnToken: string | BN;
    mintToken: string | BN;
    voteCommission: string | BN;
    voteUpdate: string | BN;
}
/**
 *
 */
export declare class VoteCommissionUpdateAction extends Action {
    publicKey: Buffer;
    height: Buffer;
    coin: Buffer;
    payloadByte: Buffer;
    send: Buffer;
    buyBancor: Buffer;
    sellBancor: Buffer;
    sellAllBancor: Buffer;
    buyPoolBase: Buffer;
    sellPoolBase: Buffer;
    sellAllPoolBase: Buffer;
    buyPoolDelta: Buffer;
    sellPoolDelta: Buffer;
    sellAllPoolDelta: Buffer;
    createTicker3: Buffer;
    createTicker4: Buffer;
    createTicker5: Buffer;
    createTicker6: Buffer;
    createTicker7to10: Buffer;
    createCoin: Buffer;
    createToken: Buffer;
    recreateCoin: Buffer;
    recreateToken: Buffer;
    declareCandidacy: Buffer;
    delegate: Buffer;
    unbond: Buffer;
    redeemCheck: Buffer;
    setCandidateOn: Buffer;
    setCandidateOff: Buffer;
    createMultisig: Buffer;
    multisendBase: Buffer;
    multisendDelta: Buffer;
    editCandidate: Buffer;
    setHaltBlock: Buffer;
    editTickerOwner: Buffer;
    editMultisig: Buffer;
    editCandidatePublicKey: Buffer;
    addLiquidity: Buffer;
    removeLiquidity: Buffer;
    editCandidateCommission: Buffer;
    burnToken: Buffer;
    mintToken: Buffer;
    voteCommission: Buffer;
    voteUpdate: Buffer;
    createSwapPool: Buffer;
    constructor(params: VoteCommissionUpdateActionParams);
    rlpSchema(): RlpSchemaField[];
}
