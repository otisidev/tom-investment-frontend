import gql from "graphql-tag";

export const GET_CURRENCY = gql`
    query GetUserCurrency($id: ID) {
        GetUserCurrency(id: $id) {
            doc {
                id
                currency
            }
        }
    }
`;

export const UPDATE_CURRENCY = gql`
    mutation UPDATE_CURRENCY($currency: String!, $id: ID) {
        SetUserCurrency(currency: $currency, id: $id) {
            message
            doc {
                currency
            }
        }
    }
`;
