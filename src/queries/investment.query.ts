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
            category {
                id
                title
            }
        }
        walletAddress
        compounded {
            status
            payout
            payoutDate
        }
        currency {
            id
            name
            address
        }
        localCurrency
        expiration
        duration
        expired
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
    mutation Reinvestment($id: ID!) {
        Reinvestment(id: $id) {
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

export const GET_INVESTMENT = gql`
    query GetInvestment($id: ID!) {
        GetInvestment(Id: $id) {
            doc {
                ...InvestmentProp
            }
        }
    }
    ${INVESTMENT_PROP}
`;

export const GET_TOP_LIST = gql`
    query GetInvestmentTopUp($investment: ID!) {
        GetInvestmentTopUp(investment: $investment) {
            docs {
                id
                amount
                created_at
                approved
                investment {
                    id
                    localCurrency
                }
            }
        }
    }
`;

export const NEW_TOP_UP = gql`
    mutation NewTopUp($amount: Int!, $investment: ID!) {
        NewInvestmentTopUp(amount: $amount, investment: $investment) {
            message
        }
    }
`;

export const GET_TOP_UP_REQUEST = gql`
    query GetTopUpList($page: Int, $limit: Int) {
        GetTopUpForApproval(page: $page, limit: $limit) {
            docs {
                id
                amount
                created_at
                approved
                investment {
                    id
                    investment_made
                    user {
                        id
                        name
                        email
                        image
                    }
                }
            }
            page
            limit
            totalPages
            totalDocs
            nextPage
            prevPage
        }
    }
`;

export const APPROVE_TOP_UP = gql`
    mutation ApproveInvestmentTopUp($id: ID!) {
        ApproveTopUp(id: $id) {
            message
            doc {
                id
            }
        }
    }
`;

export const CANCEL_TOP_UP = gql`
    mutation CancelInvestmentTopUp($id: ID!) {
        CancelTopUp(id: $id) {
            message
            doc {
                id
            }
        }
    }
`;

export const CREDIT_INVESTMENT = gql`
    mutation CreditInvestment($model: InvestmentLogInput!) {
        CreditInvestment(model: $model) {
            message
        }
    }
`;

export const ADMIN_TOP_UP_INVESTMENT = gql`
    mutation AdminInvestmentTopUp($id: ID!, $amount: Int!, $currency: String!) {
        AdminInvestmentTopUp(id: $id, amount: $amount, currency: $currency) {
            message
        }
    }
`;

export const GET_INVESTMENT_STATUS = gql`
    query GetInvestmentInformation($email: String!) {
        GetInvestmentInformation(email: $email) {
            message
            docs {
                id
                investment_made
                balance
                created_at
                logs {
                    amount
                    id
                    reason
                    date
                }
                topups {
                    id
                    amount
                    approved
                    created_at
                }
            }
        }
    }
`;

export const UPDATE_INVESTMENT_DURATION = gql`
    mutation UpdateInvestmentDuration($id: ID!, $duration: Int!) {
        UpdateInvestmentDuration(id: $id, duration: $duration) {
            message
        }
    }
`;
