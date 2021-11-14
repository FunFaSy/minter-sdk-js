import {Check, IssueCheckParams} from './check';
import {RedeemCheckAction} from '../transaction/action/check_redeem';


export class Checkbook {
    static issue(params: IssueCheckParams): Check {
        return new Check(params);
    }

    static redeem(check: Check, password: string, address: string): RedeemCheckAction {
        const proof = Checkbook.getProof(password, address);
        return new RedeemCheckAction({check, proof});
    }

    static getProof(password: string, address: string): Buffer {
        return Check.getProof(password, address);
    }
}
