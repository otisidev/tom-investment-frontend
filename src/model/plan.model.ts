import { Category } from "./category.model";
export class Plan {
    id = "";
    title = "";
    can_reinvestment = false;
    amount = 0;
    percent = 0;
    weekly_payout_interval = 0;
    days_to_payout = 0;
    max_amount = 0;
    category = {
        id: "",
        title: ""
    };
}
export interface PlanModel {
    id: string;
    title: string;
    can_reinvestment: boolean;
    amount: number;
    percent: number;
    weekly_payout_interval: number;
    days_to_payout: number;
    max_amount: number;
    category: Category;
}
