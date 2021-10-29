import gql from "graphql-tag";

export const GET_CURRENCY = gql`
    query {
        GetUserCurrency {
            doc {
                id
                currency
            }
        }
    }
`;

export const UPDATE_CURRENCY = gql`
    mutation UPDATE_CURRENCY($currency: String!) {
        SetUserCurrency(currency: $currency) {
            message
            doc {
                currency
            }
        }
    }
`;
