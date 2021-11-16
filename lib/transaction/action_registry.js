"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionRegistry = void 0;
const tx_actions = __importStar(require("./action"));
const internal_1 = require("./internal");
class ActionRegistry {
    constructor(registry) {
        this.registry = registry;
    }
    static getInstance() {
        if (!ActionRegistry.instance) {
            ActionRegistry.instance = new ActionRegistry(new Map());
        }
        return ActionRegistry.instance;
    }
    register(key, action) {
        // add action constructor to registry and return the same object with a narrowed type
        this.registry.set(key, action);
        return this;
    }
    get(key) {
        if (!this.registry.has(key)) {
            return undefined;
        }
        return this.registry.get(key);
    }
}
exports.ActionRegistry = ActionRegistry;
const actionsRegistry = ActionRegistry.getInstance().
    register(internal_1.TransactionType.BUY, tx_actions.BuyAction).
    register(internal_1.TransactionType.SELL, tx_actions.SellAction).
    register(internal_1.TransactionType.SELL_ALL, tx_actions.SellAllAction).
    register(internal_1.TransactionType.DECLARE_CANDIDACY, tx_actions.DeclareCandidacyAction).
    register(internal_1.TransactionType.EDIT_CANDIDATE, tx_actions.EditCandidateAction).
    register(internal_1.TransactionType.EDIT_CANDIDATE_COMMISSION, tx_actions.EditCandidateCommissionAction).
    register(internal_1.TransactionType.EDIT_CANDIDATE_PUBLIC_KEY, tx_actions.EditCandidatePubKeyAction).
    register(internal_1.TransactionType.SET_CANDIDATE_OFF, tx_actions.SetCandidateOffAction).
    register(internal_1.TransactionType.SET_CANDIDATE_ON, tx_actions.SetCandidateOnAction).
    register(internal_1.TransactionType.REDEEM_CHECK, tx_actions.RedeemCheckAction).
    register(internal_1.TransactionType.CREATE_COIN, tx_actions.CreateCoinAction).
    register(internal_1.TransactionType.RECREATE_COIN, tx_actions.ReCreateCoinAction).
    register(internal_1.TransactionType.CREATE_MULTISIG, tx_actions.CreateMultiSigAction).
    register(internal_1.TransactionType.EDIT_MULTISIG, tx_actions.EditMultiSigAction).
    register(internal_1.TransactionType.SEND, tx_actions.SendAction).
    register(internal_1.TransactionType.MULTISEND, tx_actions.MultiSendAction).
    register(internal_1.TransactionType.DELEGATE, tx_actions.DelegateAction).
    register(internal_1.TransactionType.MOVE_STAKE, tx_actions.MoveStakeAction).
    register(internal_1.TransactionType.UNBOND, tx_actions.UnbondAction).
    register(internal_1.TransactionType.BUY_SWAP_POOL, tx_actions.BuySwapAction).
    register(internal_1.TransactionType.CREATE_SWAP_POOL, tx_actions.CreateSwapPoolAction).
    register(internal_1.TransactionType.ADD_LIMIT_ORDER, tx_actions.AddLimitOrderAction).
    register(internal_1.TransactionType.REMOVE_LIMIT_ORDER, tx_actions.RemoveLimitOrderAction).
    register(internal_1.TransactionType.ADD_LIQUIDITY, tx_actions.AddLiquidityAction).
    register(internal_1.TransactionType.REMOVE_LIQUIDITY, tx_actions.RemoveLiquidityAction).
    register(internal_1.TransactionType.SELL_SWAP_POOL, tx_actions.SellSwapAction).
    register(internal_1.TransactionType.SELL_ALL_SWAP_POOL, tx_actions.SellAllSwapAction).
    register(internal_1.TransactionType.EDIT_TICKER_OWNER, tx_actions.EditTickerOwnerAction).
    register(internal_1.TransactionType.BURN_TOKEN, tx_actions.BurnTokenAction).
    register(internal_1.TransactionType.CREATE_TOKEN, tx_actions.CreateTokenAction).
    register(internal_1.TransactionType.MINT_TOKEN, tx_actions.MintTokenAction).
    register(internal_1.TransactionType.RECREATE_TOKEN, tx_actions.ReCreateTokenAction).
    register(internal_1.TransactionType.VOTE_COMMISSION, tx_actions.VoteCommissionUpdateAction).
    register(internal_1.TransactionType.VOTE_UPDATE, tx_actions.VoteNetUpdateAction).
    register(internal_1.TransactionType.SET_HALT_BLOCK, tx_actions.VoteHaltBlockAction);
exports.default = actionsRegistry;
