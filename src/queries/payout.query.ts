import gql from "graphql-tag";
export const GET_PAYOUT_LIST = gql`
    query GetPayableInvestment($page: Int, $limit: Int, $user: String) {
        GetPayableInvestments(page: $page, limit: $limit, user: $user) {
            docs {
                id
                investment_made
                balance
                date
                last_fund_date
                next_fund_date
                weeks_to_next
                payout_sum
                payout_weekly
                plan {
                    id
                    title
                }
                user {
                    id
                    firstname
                    lastname
                    email
                    phone
                    wallet_address
                    nationality
                    image
                    gender
                }
            }
            page
            limit
            totalDocs
            totalPages
            prevPage
            nextPage
        }
    }
`;

export const PAYOUT = gql`
    mutation PayoutDone($id: ID!, $btc: String!, $to: String!) {
        Payout(id: $id, btc: $btc, to: $to) {
            message
            doc {
                id
                investment_made
            }
        }
    }
`;
export const PREPARE_TRANSACTION = gql`
    query PrepareWalletTransaction($amount: Int!, $wallet: String!) {
        PrepareWalletTransaction(amount: $amount, wallet: $wallet) {
            amount
            balance
            bitcoin
            sender
            receiver
        }
    }
`;