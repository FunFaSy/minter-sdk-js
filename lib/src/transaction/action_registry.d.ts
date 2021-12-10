import { TransactionType } from './internal';
declare type Constructor<T extends {} = {}> = new (...args: any[]) => T;
export declare class ActionRegistry {
    private registry;
    private static instance;
    private constructor();
    static getInstance(): ActionRegistry;
    register(key: TransactionType, action: Constructor): ActionRegistry;
    get(key: TransactionType): Constructor;
}
declare const actionsRegistry: ActionRegistry;
export default actionsRegistry;
