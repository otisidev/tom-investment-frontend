import gql from "graphql-tag";

const ReferralProps = gql`
    fragment ReferralProps on Referral {
        id
        amount
        paid
        created_at
        investment {
            id
            investment_made
            balance
        }
        user {
            id
            firstname
            lastname
            email
            phone
            image
            
        }
    }
`;

export const GET_REFERRALS = gql`
    query GetReferrals {
        GetReferrals {
            docs {
                ...ReferralProps
            }
        }
    }
    ${ReferralProps}
`;

export const PAYABLE_REFERRALS = gql`
    query GetPayableReferrals($page: Int, $limit: Int) {
        GetPayableReferrals(page: $page, limit: $limit) {
            docs {
                id
                amount
                investment {
                    id
                    investment_made
                }
                user {
                    id
                    firstname
                    lastname
                    email
                    nationality
                    image
                    gender
                }
                created_at
                referrer {
                    id
                    firstname
                    lastname
                    email
                    nationality
                    wallet_address
                    image
                }
            }
        }
    }
`;

export const PAY_REFERRAL = gql`
    mutation PayReferral($id: ID!) {
        PayReferral(id: $id) {
            message
            doc {
                id
                amount
            }
        }
    }
`;

export const FIX_REFERRAL = gql`
    mutation FixReferral {
        FixReferral
    }
`;