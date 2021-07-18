import gql from "graphql-tag";

const CURRENCY_PROPS = gql`
    fragment CurrencyProps on Currency {
        id
        name
        address
    }
`;

export const GET_CURRENCIES = gql`
    query GetCurrencies {
        GetCurrencies {
            docs {
                ...CurrencyProps
            }
        }
    }
    ${CURRENCY_PROPS}
`;

export const UPDATE_CURRENCY = gql`
    mutation UpdateCurrency($update: CurrencyInput!, $id: ID!) {
        UpdateCurrency(id: $id, model: $update) {
            message
        }
    }
`;
export const CREATE_CURRENCY = gql`
    mutation NewCurrency($model: CurrencyInput!) {
        NewCurrency(model: $model) {
            message
            doc {
                ...CurrencyProps
            }
        }
    }
    ${CURRENCY_PROPS}
`;

export const DELETE_CURRENCY = gql`
    mutation DeleteCurrency($id: ID!) {
        DeleteCurrency(id: $id) {
            message
        }
    }
`;
