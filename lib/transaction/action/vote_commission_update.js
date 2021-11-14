"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteCommissionUpdateAction = void 0;
const transaction_1 = require("../transaction");
const action_1 = require("./action");
const external_1 = require("../../util/external");
const util_1 = require("../../util");
/**
 *
 */
class VoteCommissionUpdateAction extends action_1.Action {
    constructor(params) {
        // Convert params to Buffers
        const _params = {
            publicKey: util_1.toBuffer(params.publicKey),
            height: new external_1.BN(params.height),
            coin: new external_1.BN(params.coin),
            payloadByte: new external_1.BN(params.payloadByte),
            send: new external_1.BN(params.send),
            buyBancor: new external_1.BN(params.buyBancor),
            sellBancor: new external_1.BN(params.sellBancor),
            sellAllBancor: new external_1.BN(params.sellAllBancor),
            buyPoolBase: new external_1.BN(params.buyPoolBase),
            buyPoolDelta: new external_1.BN(params.buyPoolDelta),
            sellPoolBase: new external_1.BN(params.sellPoolBase),
            sellPoolDelta: new external_1.BN(params.sellPoolDelta),
            sellAllPoolBase: new external_1.BN(params.sellAllPoolBase),
            sellAllPoolDelta: new external_1.BN(params.sellAllPoolDelta),
            createTicker3: new external_1.BN(params.createTicker3),
            createTicker4: new external_1.BN(params.createTicker4),
            createTicker5: new external_1.BN(params.createTicker5),
            createTicker6: new external_1.BN(params.createTicker6),
            createTicker7to10: new external_1.BN(params.createTicker7to10),
            createCoin: new external_1.BN(params.createCoin),
            createToken: new external_1.BN(params.createToken),
            recreateCoin: new external_1.BN(params.recreateCoin),
            recreateToken: new external_1.BN(params.recreateToken),
            declareCandidacy: new external_1.BN(params.declareCandidacy),
            delegate: new external_1.BN(params.delegate),
            unbond: new external_1.BN(params.unbond),
            redeemCheck: new external_1.BN(params.redeemCheck),
            setCandidateOn: new external_1.BN(params.setCandidateOn),
            setCandidateOff: new external_1.BN(params.setCandidateOff),
            createMultisig: new external_1.BN(params.createMultisig),
            multisendBase: new external_1.BN(params.multisendBase),
            multisendDelta: new external_1.BN(params.multisendDelta),
            editCandidate: new external_1.BN(params.editCandidate),
            setHaltBlock: new external_1.BN(params.setHaltBlock),
            editTickerOwner: new external_1.BN(params.editTickerOwner),
            editMultisig: new external_1.BN(params.editMultisig),
            editCandidatePublicKey: new external_1.BN(params.editCandidatePublicKey),
            createSwapPool: new external_1.BN(params.createSwapPool),
            addLiquidity: new external_1.BN(params.addLiquidity),
            removeLiquidity: new external_1.BN(params.removeLiquidity),
            editCandidateCommission: new external_1.BN(params.editCandidateCommission),
            mintToken: new external_1.BN(params.mintToken),
            burnToken: new external_1.BN(params.burnToken),
            voteCommission: new external_1.BN(params.voteCommission),
            voteUpdate: new external_1.BN(params.voteUpdate),
            failedTx: new external_1.BN(params.failedTx),
            addLimitOrder: new external_1.BN(params.addLimitOrder),
            removeLimitOrder: new external_1.BN(params.removeLimitOrder),
            // more:               : Buffer.from([])
        };
        // TODO: Validation
        super(_params);
        this.txType = transaction_1.TransactionType.VOTE_COMMISSION;
    }
    rlpSchema() {
        return [
            {
                name: 'publicKey',
                length: 32,
            },
            {
                name: 'height',
                length: 32,
                allowLess: true,
            },
            {
                name: 'coin',
                length: 4,
                allowLess: true,
            },
            {
                name: 'payloadByte',
                length: 32,
                allowLess: true,
            },
            {
                name: 'send',
                length: 32,
                allowLess: true,
            },
            {
                name: 'buyBancor',
                length: 32,
                allowLess: true,
            },
            {
                name: 'sellBancor',
                length: 32,
                allowLess: true,
            },
            {
                name: 'sellAllBancor',
                length: 32,
                allowLess: true,
            },
            {
                name: 'buyPoolBase',
                length: 32,
                allowLess: true,
            },
            {
                name: 'buyPoolDelta',
                length: 32,
                allowLess: true,
            },
            {
                name: 'sellPoolBase',
                length: 32,
                allowLess: true,
            },
            {
                name: 'sellPoolDelta',
                length: 32,
                allowLess: true,
            },
            {
                name: 'sellAllPoolBase',
                length: 32,
                allowLess: true,
            },
            {
                name: 'sellAllPoolDelta',
                length: 32,
                allowLess: true,
            },
            {
                name: 'createTicker3',
                length: 32,
                allowLess: true,
            },
            {
                name: 'createTicker4',
                length: 32,
                allowLess: true,
            },
            {
                name: 'createTicker5',
                length: 32,
                allowLess: true,
            },
            {
                name: 'createTicker6',
                length: 32,
                allowLess: true,
            },
            {
                name: 'createTicker7to10',
                length: 32,
                allowLess: true,
            },
            {
                name: 'createCoin',
                length: 32,
                allowLess: true,
            },
            {
                name: 'createToken',
                length: 32,
                allowLess: true,
            },
            {
                name: 'recreateCoin',
                length: 32,
                allowLess: true,
            },
            {
                name: 'recreateToken',
                length: 32,
                allowLess: true,
            },
            {
                name: 'declareCandidacy',
                length: 32,
                allowLess: true,
            },
            {
                name: 'delegate',
                length: 32,
                allowLess: true,
            },
            {
                name: 'unbond',
                length: 32,
                allowLess: true,
            },
            {
                name: 'redeemCheck',
                length: 32,
                allowLess: true,
            },
            {
                name: 'setCandidateOn',
                length: 32,
                allowLess: true,
            },
            {
                name: 'setCandidateOff',
                length: 32,
                allowLess: true,
            },
            {
                name: 'createMultisig',
                length: 32,
                allowLess: true,
            },
            {
                name: 'multisendBase',
                length: 32,
                allowLess: true,
            },
            {
                name: 'multisendDelta',
                length: 32,
                allowLess: true,
            },
            {
                name: 'editCandidate',
                length: 32,
                allowLess: true,
            },
            {
                name: 'setHaltBlock',
                length: 32,
                allowLess: true,
            },
            {
                name: 'editTickerOwner',
                length: 32,
                allowLess: true,
            },
            {
                name: 'editMultisig',
                length: 32,
                allowLess: true,
            },
            {
                name: 'editCandidatePublicKey',
                length: 32,
                allowLess: true,
            },
            {
                name: 'createSwapPool',
                length: 32,
                allowLess: true,
            },
            {
                name: 'addLiquidity',
                length: 32,
                allowLess: true,
            },
            {
                name: 'removeLiquidity',
                length: 32,
                allowLess: true,
            },
            {
                name: 'editCandidateCommission',
                length: 32,
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
                name: 'mintToken',
                length: 32,
                allowLess: true,
            },
            {
                name: 'burnToken',
                length: 32,
                allowLess: true,
            },
            {
                name: 'voteCommission',
                length: 32,
                allowLess: true,
            },
            {
                name: 'voteUpdate',
                length: 32,
                allowLess: true,
            },
            {
                name: 'failedTX',
                length: 32,
                allowLess: true,
            }, {
                name: 'addLimitOrder',
                length: 32,
                allowLess: true,
            }, {
                name: 'removeLimitOrder',
                length: 32,
                allowLess: true,
            },
        ];
    }
}
exports.VoteCommissionUpdateAction = VoteCommissionUpdateAction;
