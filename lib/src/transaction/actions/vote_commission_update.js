"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteCommissionUpdateAction = void 0;
const internal_1 = require("../internal");
const action_1 = require("./action");
const external_1 = require("../../util/external");
const util_1 = require("../../util");
/**
 *
 */
class VoteCommissionUpdateAction extends action_1.Action {
    constructor(data) {
        let _data = data;
        if (typeof data == 'object' && !Buffer.isBuffer(data)) {
            _data = {
                publicKey: util_1.toBuffer(data.publicKey),
                height: new external_1.BN(data.height),
                coin: new external_1.BN(data.coin),
                payloadByte: new external_1.BN(data.payloadByte),
                send: new external_1.BN(data.send),
                buyBancor: new external_1.BN(data.buyBancor),
                sellBancor: new external_1.BN(data.sellBancor),
                sellAllBancor: new external_1.BN(data.sellAllBancor),
                buyPoolBase: new external_1.BN(data.buyPoolBase),
                buyPoolDelta: new external_1.BN(data.buyPoolDelta),
                sellPoolBase: new external_1.BN(data.sellPoolBase),
                sellPoolDelta: new external_1.BN(data.sellPoolDelta),
                sellAllPoolBase: new external_1.BN(data.sellAllPoolBase),
                sellAllPoolDelta: new external_1.BN(data.sellAllPoolDelta),
                createTicker3: new external_1.BN(data.createTicker3),
                createTicker4: new external_1.BN(data.createTicker4),
                createTicker5: new external_1.BN(data.createTicker5),
                createTicker6: new external_1.BN(data.createTicker6),
                createTicker7to10: new external_1.BN(data.createTicker7to10),
                createCoin: new external_1.BN(data.createCoin),
                createToken: new external_1.BN(data.createToken),
                recreateCoin: new external_1.BN(data.recreateCoin),
                recreateToken: new external_1.BN(data.recreateToken),
                declareCandidacy: new external_1.BN(data.declareCandidacy),
                delegate: new external_1.BN(data.delegate),
                unbond: new external_1.BN(data.unbond),
                redeemCheck: new external_1.BN(data.redeemCheck),
                setCandidateOn: new external_1.BN(data.setCandidateOn),
                setCandidateOff: new external_1.BN(data.setCandidateOff),
                createMultisig: new external_1.BN(data.createMultisig),
                multisendBase: new external_1.BN(data.multisendBase),
                multisendDelta: new external_1.BN(data.multisendDelta),
                editCandidate: new external_1.BN(data.editCandidate),
                setHaltBlock: new external_1.BN(data.setHaltBlock),
                editTickerOwner: new external_1.BN(data.editTickerOwner),
                editMultisig: new external_1.BN(data.editMultisig),
                editCandidatePublicKey: new external_1.BN(data.editCandidatePublicKey),
                createSwapPool: new external_1.BN(data.createSwapPool),
                addLiquidity: new external_1.BN(data.addLiquidity),
                removeLiquidity: new external_1.BN(data.removeLiquidity),
                editCandidateCommission: new external_1.BN(data.editCandidateCommission),
                mintToken: new external_1.BN(data.mintToken),
                burnToken: new external_1.BN(data.burnToken),
                voteCommission: new external_1.BN(data.voteCommission),
                voteUpdate: new external_1.BN(data.voteUpdate),
                failedTx: new external_1.BN(data.failedTx),
                addLimitOrder: new external_1.BN(data.addLimitOrder),
                removeLimitOrder: new external_1.BN(data.removeLimitOrder),
                // more:               : Buffer.from([])
            };
        }
        // TODO: Validation
        super(_data);
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
VoteCommissionUpdateAction.txType = internal_1.TransactionType.VOTE_COMMISSION;
