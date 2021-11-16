import * as tx_actions from './action';
import {TransactionType} from './internal';


type Constructor<T extends {} = {}> = new (...args: any[]) => T;

export class ActionRegistry {
    private static instance: ActionRegistry;

    private constructor(private registry: Map<TransactionType, Constructor>) {}

    public static getInstance(): ActionRegistry {
        if (!ActionRegistry.instance) {
            ActionRegistry.instance = new ActionRegistry(new Map());
        }
        return ActionRegistry.instance;
    }

    register(key: TransactionType, action: Constructor): ActionRegistry {
        // add action constructor to registry and return the same object with a narrowed type
        this.registry.set(key, action);

        return this;
    }

    get(key: TransactionType): Constructor {
        if (!this.registry.has(key)) {
            return undefined;
        }
        return this.registry.get(key);
    }
}

const actionsRegistry = ActionRegistry.getInstance().
    register(TransactionType.BUY, tx_actions.BuyAction).
    register(TransactionType.SELL, tx_actions.SellAction).
    register(TransactionType.SELL_ALL, tx_actions.SellAction).
    register(TransactionType.DECLARE_CANDIDACY, tx_actions.DeclareCandidacyAction).
    register(TransactionType.EDIT_CANDIDATE, tx_actions.EditCandidateAction).
    register(TransactionType.EDIT_CANDIDATE_COMMISSION, tx_actions.EditCandidateCommissionAction).
    register(TransactionType.EDIT_CANDIDATE_PUBLIC_KEY, tx_actions.EditCandidatePubKeyAction).
    register(TransactionType.SET_CANDIDATE_OFF, tx_actions.SetCandidateOffAction).
    register(TransactionType.SET_CANDIDATE_ON, tx_actions.SetCandidateOnAction).
    register(TransactionType.REDEEM_CHECK, tx_actions.RedeemCheckAction).
    register(TransactionType.CREATE_COIN, tx_actions.CreateCoinAction).
    register(TransactionType.RECREATE_COIN, tx_actions.ReCreateCoinAction).
    register(TransactionType.CREATE_MULTISIG, tx_actions.CreateMultiSigAction).
    register(TransactionType.EDIT_MULTISIG, tx_actions.EditMultiSigAction).
    register(TransactionType.SEND, tx_actions.SendAction).
    register(TransactionType.MULTISEND, tx_actions.MultiSendAction).
    register(TransactionType.DELEGATE, tx_actions.DelegateAction).
    register(TransactionType.MOVE_STAKE, tx_actions.MoveStakeAction).
    register(TransactionType.UNBOND, tx_actions.UnbondAction).
    register(TransactionType.BUY_SWAP_POOL, tx_actions.BuySwapAction).
    register(TransactionType.CREATE_SWAP_POOL, tx_actions.CreateSwapPoolAction).
    register(TransactionType.ADD_LIMIT_ORDER, tx_actions.AddLimitOrderAction).
    register(TransactionType.REMOVE_LIMIT_ORDER, tx_actions.RemoveLimitOrderAction).
    register(TransactionType.ADD_LIQUIDITY, tx_actions.AddLiquidityAction).
    register(TransactionType.REMOVE_LIQUIDITY, tx_actions.RemoveLiquidityAction).
    register(TransactionType.SELL_SWAP_POOL, tx_actions.SellSwapAction).
    register(TransactionType.SELL_ALL_SWAP_POOL, tx_actions.SellAllSwapAction).
    register(TransactionType.EDIT_TICKER_OWNER, tx_actions.EditTickerOwnerAction).
    register(TransactionType.BURN_TOKEN, tx_actions.BurnTokenAction).
    register(TransactionType.CREATE_TOKEN, tx_actions.CreateTokenAction).
    register(TransactionType.MINT_TOKEN, tx_actions.MintTokenAction).
    register(TransactionType.RECREATE_TOKEN, tx_actions.ReCreateTokenAction).
    register(TransactionType.VOTE_COMMISSION, tx_actions.VoteCommissionUpdateAction).
    register(TransactionType.VOTE_UPDATE, tx_actions.VoteNetUpdateAction).
    register(TransactionType.SET_HALT_BLOCK, tx_actions.VoteHaltBlockAction)
;
export default actionsRegistry;
