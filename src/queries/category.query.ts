import gql from "graphql-tag";

const CATEGORY_PROP = gql`
    fragment CategoryProp on Category {
        id
        title
        desc
    }
`;
export const GET_CATEGORIES = gql`
    query GetCategories {
        GetCategories {
            docs {
                ...CategoryProp
            }
        }
    }
    ${CATEGORY_PROP}
`;

export const UPDATE_CATEGORY = gql`
    mutation UpdateCategory($update: CategoryInput!, $id: ID!) {
        UpdateCategory(id: $id, model: $update) {
            message
        }
    }
`;
export const CREATE_CATEGORY = gql`
    mutation NewCategory($model: CategoryInput!) {
        NewCategory(model: $model) {
            message
            doc {
                ...CategoryProp
            }
        }
    }
    ${CATEGORY_PROP}
`;

export const DELETE_CATEGORY = gql`
    mutation DeleteCategory($id: ID!) {
        DeleteCategory(id: $id) {
            message
        }
    }
`;
