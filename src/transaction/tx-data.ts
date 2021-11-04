import TxDataSend from 'minterjs-tx/src/send.js';

import {TX_TYPE, normalizeTxType} from '../tx-types.js';

const TX_DATA_CONSTRUCTOR = {
    [TX_TYPE.SEND]: TxDataSend,};

/**
 *
 * @param data
 * @param {TX_TYPE|number|string|Buffer|Uint8Array} txType
 * @constructor
 * @return {TxDataSend|TxDataMultisend|TxDataSell|TxDataSellAll|TxDataBuy|TxDataCreateCoin|TxDataDeclareCandidacy|TxDataEditCandidate|TxDataSetCandidateOn|TxDataSetCandidateOff|TxDataDelegate|TxDataUnbond|TxDataRedeemCheck|TxDataCreateMultisig|TxDataSetHaltBlock|TxDataRecreateCoin|TxDataEditTickerOwner|TxDataEditMultisig|TxDataPriceVote|TxDataEditCandidatePublicKey|TxDataAddLiquidity|TxDataRemoveLiquidity|TxDataBuySwapPool|TxDataSellSwapPool|TxDataSellAllSwapPool|TxDataVoteCommission|TxDataVoteUpdate|TxDataCreateSwapPool}
 */
export default function TxData(data, txType) {
    txType = normalizeTxType(txType);
    const TxDataConstructor = TX_DATA_CONSTRUCTOR[txType];

    return new TxDataConstructor(data);
}
