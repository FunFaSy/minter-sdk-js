import {TransactionType} from '../internal';
import {Action} from './action';
import {RlpSchemaField} from '../../util/define-properties';
import {BN} from '../../util/external';
import {toBuffer} from '../../util';

/**
 *
 */
export interface VoteCommissionUpdateActionParams {
    publicKey: string; // Voter node pub key
    height: number | BN; // Vote for activate new prices sine Block height
    coin: number | BN; // Commission coinID
    payloadByte: string | BN; // Price in PIP units
    send: string | BN; // Price in PIP units
    buyBancor: string | BN; // Price in PIP units
    sellBancor: string | BN; // Price in PIP units
    sellAllBancor: string | BN; // Price in PIP units
    buyPoolBase: string | BN; // Price in PIP units
    sellPoolBase: string | BN; // Price in PIP units
    sellAllPoolBase: string | BN; // Price in PIP units
    buyPoolDelta: string | BN; // Price in PIP units
    sellPoolDelta: string | BN; // Price in PIP units
    sellAllPoolDelta: string | BN; // Price in PIP units
    createTicker3: string | BN; // Price in PIP units
    createTicker4: string | BN; // Price in PIP units
    createTicker5: string | BN; // Price in PIP units
    createTicker6: string | BN; // Price in PIP units
    createTicker7to10: string | BN; // Price in PIP units
    createCoin: string | BN; // Price in PIP units
    createToken: string | BN; // Price in PIP units
    recreateCoin: string | BN; // Price in PIP units
    recreateToken: string | BN; // Price in PIP units
    declareCandidacy: string | BN; // Price in PIP units
    delegate: string | BN; // Price in PIP units
    unbond: string | BN; // Price in PIP units
    redeemCheck: string | BN; // Price in PIP units
    setCandidateOn: string | BN; // Price in PIP units
    setCandidateOff: string | BN; // Price in PIP units
    createMultisig: string | BN; // Price in PIP units
    multisendBase: string | BN; // Price in PIP units
    multisendDelta: string | BN; // Price in PIP units
    editCandidate: string | BN; // Price in PIP units
    setHaltBlock: string | BN; // Price in PIP units
    editTickerOwner: string | BN; // Price in PIP units
    editMultisig: string | BN; // Price in PIP units
    editCandidatePublicKey: string | BN; // Price in PIP units
    createSwapPool: string | BN; // Price in PIP units
    addLiquidity: string | BN; // Price in PIP units
    removeLiquidity: string | BN; // Price in PIP units
    editCandidateCommission: string | BN; // Price in PIP units
    burnToken: string | BN; // Price in PIP units
    mintToken: string | BN; // Price in PIP units
    voteCommission: string | BN; // Price in PIP units
    voteUpdate: string | BN; // Price in PIP units
    failedTx: string | BN; // Price in PIP units
    addLimitOrder: string | BN; // Price in PIP units
    removeLimitOrder: string | BN; // Price in PIP units
}

/**
 *
 */
export class VoteCommissionUpdateAction extends Action {
    public static readonly txType = TransactionType.VOTE_COMMISSION;

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
    createSwapPool: Buffer;
    addLiquidity: Buffer;
    removeLiquidity: Buffer;
    editCandidateCommission: Buffer;
    burnToken: Buffer;
    mintToken: Buffer;
    voteCommission: Buffer;
    voteUpdate: Buffer;
    failedTx: Buffer;
    addLimitOrder: Buffer;
    removeLimitOrder: Buffer;

    constructor(params: VoteCommissionUpdateActionParams) {
        // Convert params to Buffers
        const _params = {
            publicKey              : toBuffer(params.publicKey),
            height                 : new BN(params.height),
            coin                   : new BN(params.coin),
            payloadByte            : new BN(params.payloadByte),
            send                   : new BN(params.send),
            buyBancor              : new BN(params.buyBancor),
            sellBancor             : new BN(params.sellBancor),
            sellAllBancor          : new BN(params.sellAllBancor),
            buyPoolBase            : new BN(params.buyPoolBase),
            buyPoolDelta           : new BN(params.buyPoolDelta),
            sellPoolBase           : new BN(params.sellPoolBase),
            sellPoolDelta          : new BN(params.sellPoolDelta),
            sellAllPoolBase        : new BN(params.sellAllPoolBase),
            sellAllPoolDelta       : new BN(params.sellAllPoolDelta),
            createTicker3          : new BN(params.createTicker3),
            createTicker4          : new BN(params.createTicker4),
            createTicker5          : new BN(params.createTicker5),
            createTicker6          : new BN(params.createTicker6),
            createTicker7to10      : new BN(params.createTicker7to10),
            createCoin             : new BN(params.createCoin),
            createToken            : new BN(params.createToken),
            recreateCoin           : new BN(params.recreateCoin),
            recreateToken          : new BN(params.recreateToken),
            declareCandidacy       : new BN(params.declareCandidacy),
            delegate               : new BN(params.delegate),
            unbond                 : new BN(params.unbond),
            redeemCheck            : new BN(params.redeemCheck),
            setCandidateOn         : new BN(params.setCandidateOn),
            setCandidateOff        : new BN(params.setCandidateOff),
            createMultisig         : new BN(params.createMultisig),
            multisendBase          : new BN(params.multisendBase),
            multisendDelta         : new BN(params.multisendDelta),
            editCandidate          : new BN(params.editCandidate),
            setHaltBlock           : new BN(params.setHaltBlock),
            editTickerOwner        : new BN(params.editTickerOwner),
            editMultisig           : new BN(params.editMultisig),
            editCandidatePublicKey : new BN(params.editCandidatePublicKey),
            createSwapPool         : new BN(params.createSwapPool),
            addLiquidity           : new BN(params.addLiquidity),
            removeLiquidity        : new BN(params.removeLiquidity),
            editCandidateCommission: new BN(params.editCandidateCommission),
            mintToken              : new BN(params.mintToken),
            burnToken              : new BN(params.burnToken),
            voteCommission         : new BN(params.voteCommission),
            voteUpdate             : new BN(params.voteUpdate),
            failedTx               : new BN(params.failedTx),
            addLimitOrder          : new BN(params.addLimitOrder),
            removeLimitOrder       : new BN(params.removeLimitOrder),
            // more:               : Buffer.from([])
        };

        // TODO: Validation

        super(_params);
    }

    rlpSchema(): RlpSchemaField[] {
        return [
            {
                name  : 'publicKey',
                length: 32,
            },
            {
                name     : 'height',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'coin',
                length   : 4,
                allowLess: true,
            },

            {
                name     : 'payloadByte',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'send',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'buyBancor',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'sellBancor',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'sellAllBancor',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'buyPoolBase',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'buyPoolDelta',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'sellPoolBase',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'sellPoolDelta',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'sellAllPoolBase',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'sellAllPoolDelta',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'createTicker3',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'createTicker4',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'createTicker5',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'createTicker6',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'createTicker7to10',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'createCoin',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'createToken',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'recreateCoin',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'recreateToken',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'declareCandidacy',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'delegate',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'unbond',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'redeemCheck',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'setCandidateOn',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'setCandidateOff',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'createMultisig',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'multisendBase',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'multisendDelta',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'editCandidate',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'setHaltBlock',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'editTickerOwner',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'editMultisig',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'editCandidatePublicKey',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'createSwapPool',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'addLiquidity',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'removeLiquidity',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'editCandidateCommission',
                length   : 32,
                allowLess: true,
            },
            /*
            {
                name: 'moveStake',
                length: 32,
                allowLess: true,
            },
            */
            {
                name     : 'mintToken',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'burnToken',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'voteCommission',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'voteUpdate',
                length   : 32,
                allowLess: true,
            },
            {
                name     : 'failedTX',
                length   : 32,
                allowLess: true,
            }, {
                name     : 'addLimitOrder',
                length   : 32,
                allowLess: true,
            }, {
                name     : 'removeLimitOrder',
                length   : 32,
                allowLess: true,
            },
        ];
    }

}
