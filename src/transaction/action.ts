import {defineProperties, rlp} from '../util';
import {Buffer} from 'buffer';

export abstract class Action {
    public raw!: Buffer;

    constructor(data) {
        /**
         * Returns the rlp encoding of the transaction
         * @method serialize
         * @return {Buffer}
         * @memberof Transaction
         * @name serialize
         */
        // attached serialize
        defineProperties(this, this.rlpSchema(), data);
    }

    abstract rlpSchema(): any[] ;

    encode(): Buffer {
        return rlp.encode(this.raw);
    }
}

/**
 *
 */
export class SendAction extends Action {
    coin: Buffer;
    to: Buffer;
    value: Buffer;

    rlpSchema(): any[] {
        return [
            {
                name     : 'coin',
                length   : 4,
                allowLess: true,
            }
            , {
                name  : 'to',
                length: 20,
            }
            , {
                name     : 'value',
                length   : 32,
                allowLess: true,
            }];
    }
}

// export class MultiSendAction extends Action {list: SendAction[];}
//
// export class BuyAction extends Action {
//     coinToSell: Buffer;
//     coinToBuy: Buffer;
//     valueToBuy: BN;
//     maximumValueToSell?: BN; // optional, 10^15 by default
// }
//
// export class SellAction extends Action {
//     coinToSell: Buffer;
//     coinToBuy: Buffer;
//     valueToSell: BN;
//     minimumValueToBuy?: BN; // optional, 0 by default
// }
//
// export class SellAllAction extends Action {
//     coinToSell: Buffer;
//     coinToBuy: Buffer;
//     minimumValueToBuy?: BN;// optional, 0 by default
// }
//
// export class BuyFromSwapPoolAction extends Action {
//     coins: Buffer[]; // route of coin from spent to received
//     valueToBuy: BN;
//     maximumValueToSell?: BN; // optional, 10^15 by default
// }
//
// export class SellFromSwapPoolAction extends Action {
//     coins: Buffer[]; // route of coin from spent to received
//     coinToSell: BN;
//     minimumValueToBuy?: BN; // optional, 10^15 by default
// }
