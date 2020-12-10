import gql from "graphql-tag";
import { PLAN_PROP } from "./plan.query";

const INVESTMENT_PROP = gql`
    fragment InvestmentProp on Investment {
        id
        approved
        balance
        closed
        created_at
        date
        declined
        investment_made
        last_fund_date
        next_fund_date
        paid
        payout_sum
        payout_weekly
        plan {
            ...PlanProp
        }
        walletAddress
        compounded {
            status
            payout
            payoutDate
        }
    }
    ${PLAN_PROP}
`;

export const GET_YOUR_INVESTMENT = gql`
    query GetInvestmentListing($page: Int, $limit: Int) {
        GetUserInvestments(page: $page, limit: $limit) {
            docs {
                ...InvestmentProp
            }
            page
            limit
            totalDocs
            totalPages
            prevPage
            nextPage
        }
    }
    ${INVESTMENT_PROP}
`;

export const NEW_INVESTMENT = gql`
    mutation NewInvestment($model: InvestmentInput!) {
        NewInvestment(model: $model) {
            message
            doc {
                ...InvestmentProp
            }
        }
    }
    ${INVESTMENT_PROP}
`;

export const MAKE_PAYMENT = gql`
    mutation MakeInvestmentPayment($id: ID!, $wallet: String!) {
        PaidForInvestment(id: $id, wallet: $wallet) {
            message
            doc {
                ...InvestmentProp
            }
        }
    }
    ${INVESTMENT_PROP}
`;
export const CLOSE_INVESTMENT = gql`
    mutation CloseInvestment($id: ID!) {
        CloseInvestment(id: $id) {
            message
            doc {
                id
            }
        }
    }
`;

export const GET_HISTORY = gql`
    query GetInvestmentHistories($id: ID!, $page: Int!, $limit: Int!) {
        GetInvestmentHistory(id: $id, page: $page, limit: $limit) {
            page
            limit
            docs {
                id
                amount
                date
                reason
            }
            totalPages
            totalDocs
            prevPage
            nextPage
        }
    }
`;

export const REINVESTMENT = gql`
    mutation Reinvestment($id: ID!, $payout: Int!, $weeks: Int!) {
        Reinvestment(id: $id, payout: $payout, weeks: $weeks) {
            message
        }
    }
`;
export const COMPOUND_INVESTMENT = gql`
    mutation CompoundInvestment($id: ID!, $payout: String!, $nextDate: String!) {
        CompoundInvestment(id: $id, payout: $payout, nextFund: $nextDate) {
            message
        }
    }
`;
export const LOAD_INVESTMENT = gql`
    mutation LoadInvestment($model: NewInvestmentInput!) {
        NewInvestmentByAdmin(model: $model) {
            message
        }
    }
`;

export const ACCEPT_INVESTMENT = gql`
    mutation ApproveInvestment($id: ID!, $nextFund: String!) {
        ApproveInvestment(id: $id, nextFund: $nextFund) {
            message
            doc {
                id
            }
        }
    }
`;

export const DECLINE_INVESTMENT = gql`
    mutation DeclineInvestment($id: ID!) {
        DeclineInvestment(id: $id) {
            message
            doc {
                id
            }
        }
    }
`;

export const INVESTMENT_APPROVAL = gql`
    query GetInvestmentsForApproval($page: Int, $limit: Int) {
        GetInvestmentsForApproval(page: $page, limit: $limit) {
            message
            docs {
                ...InvestmentProp
                user {
                    firstname
                    lastname
                    email
                    nationality
                    image
                    gender
                }
            }
            page
            limit
            totalDocs
            totalPages
            nextPage
            prevPage
        }
    }
    ${INVESTMENT_PROP}
`;

export const GET_ACTIVE = gql`
    query GetActiveInvestment($page: Int, $limit: Int, $user: String) {
        GetActiveInvestment(page: $page, limit: $limit, user: $user) {
            page
            limit
            docs {
                ...InvestmentProp
                user {
                    id
                    firstname
                    lastname
                    email
                    nationality
                    gender
                    image
                }
            }
            totalPages
            totalDocs
            prevPage
            nextPage
        }
    }
    ${INVESTMENT_PROP}
`;

export const FIX_INVESTMENT = gql`
    mutation FixInvestment {
        FixInvestment
    }
`;
