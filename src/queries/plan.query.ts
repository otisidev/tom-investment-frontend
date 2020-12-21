import gql from "graphql-tag";

export const PLAN_PROP = gql`
    fragment PlanProp on Plan {
        id
        amount
        percent
        created_at
        title
        max_amount
        
    }
`;
export const GET_PLANS = gql`
    query GetPlans($category: ID!) {
        GetPlans(category: $category) {
            docs {
                ...PlanProp
            }
        }
    }
    ${PLAN_PROP}
`;

export const CREATE_PLAN = gql`
    mutation NewPlan($model: PlanInput!) {
        NewPlan(model: $model) {
            doc {
                ...PlanProp
            }
        }
    }
    ${PLAN_PROP}
`;

export const UPDATE_PLAN = gql`
    mutation UpdatePlan($id: ID!, $update: PlanUpdateInput!) {
        UpdatePlan(id: $id, update: $update) {
            message
        }
    }
`;
export const DELETE_PLAN = gql`
    mutation DeletePlan($id: ID!) {
        DeletePlan(id: $id) {
            message
        }
    }
`;
