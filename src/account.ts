import {BNLike, BufferLike} from './util';

export interface AccountData {
    nonce?: BNLike;
    balance?: BufferLike ;
    delegated?: BufferLike;
    total?: BufferLike;
    transaction_count?: BNLike;
    bip_value?: BNLike;
}

export class Account {

}
