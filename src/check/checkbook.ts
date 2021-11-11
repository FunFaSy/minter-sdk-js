import {Check, IssueCheckParams} from './check';
import {RedeemCheckAction} from '../transaction/action/check_redeem';

export class Checkbook {
    issue(params: IssueCheckParams): Check {
        return new Check(params);
    }

    redeem(check: Check, password: string): RedeemCheckAction {
        // TODO
        const proof = Buffer.from(password, 'utf8');
        return new RedeemCheckAction({check, proof});
    }
}
