import { Plan } from "./plan.model";
import { User } from "./user.model";

export class Investment {
    id = "";
    approved = false;
    balance = 0;
    closed = false;
    created_at = "";
    date = "";
    declined = false;
    investment_made = 0;
    last_fund_date = "";
    next_fund_date = "";
    paid = false;
    payout_sum = 0;
    payout_weekly = 0;
    plan = new Plan();
    user = new User();
    compounded? = new InvestmentCompound();
}

class InvestmentCompound {
    status? = false;
    payout? = 0;
    payoutDate? = "";
}
