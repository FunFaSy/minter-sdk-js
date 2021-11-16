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

    constructor(data?: string | Buffer | VoteCommissionUpdateActionParams) {
        let _data: any = data;

        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                publicKey              : toBuffer(data.publicKey),
                height                 : new BN(data.height),
                coin                   : new BN(data.coin),
                payloadByte            : new BN(data.payloadByte),
                send                   : new BN(data.send),
                buyBancor              : new BN(data.buyBancor),
                sellBancor             : new BN(data.sellBancor),
                sellAllBancor          : new BN(data.sellAllBancor),
                buyPoolBase            : new BN(data.buyPoolBase),
                buyPoolDelta           : new BN(data.buyPoolDelta),
                sellPoolBase           : new BN(data.sellPoolBase),
                sellPoolDelta          : new BN(data.sellPoolDelta),
                sellAllPoolBase        : new BN(data.sellAllPoolBase),
                sellAllPoolDelta       : new BN(data.sellAllPoolDelta),
                createTicker3          : new BN(data.createTicker3),
                createTicker4          : new BN(data.createTicker4),
                createTicker5          : new BN(data.createTicker5),
                createTicker6          : new BN(data.createTicker6),
                createTicker7to10      : new BN(data.createTicker7to10),
                createCoin             : new BN(data.createCoin),
                createToken            : new BN(data.createToken),
                recreateCoin           : new BN(data.recreateCoin),
                recreateToken          : new BN(data.recreateToken),
                declareCandidacy       : new BN(data.declareCandidacy),
                delegate               : new BN(data.delegate),
                unbond                 : new BN(data.unbond),
                redeemCheck            : new BN(data.redeemCheck),
                setCandidateOn         : new BN(data.setCandidateOn),
                setCandidateOff        : new BN(data.setCandidateOff),
                createMultisig         : new BN(data.createMultisig),
                multisendBase          : new BN(data.multisendBase),
                multisendDelta         : new BN(data.multisendDelta),
                editCandidate          : new BN(data.editCandidate),
                setHaltBlock           : new BN(data.setHaltBlock),
                editTickerOwner        : new BN(data.editTickerOwner),
                editMultisig           : new BN(data.editMultisig),
                editCandidatePublicKey : new BN(data.editCandidatePublicKey),
                createSwapPool         : new BN(data.createSwapPool),
                addLiquidity           : new BN(data.addLiquidity),
                removeLiquidity        : new BN(data.removeLiquidity),
                editCandidateCommission: new BN(data.editCandidateCommission),
                mintToken              : new BN(data.mintToken),
                burnToken              : new BN(data.burnToken),
                voteCommission         : new BN(data.voteCommission),
                voteUpdate             : new BN(data.voteUpdate),
                failedTx               : new BN(data.failedTx),
                addLimitOrder          : new BN(data.addLimitOrder),
                removeLimitOrder       : new BN(data.removeLimitOrder),
                // more:               : Buffer.from([])
            };
        }
        // TODO: Validation

        super(_data);
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
