import gql from "graphql-tag";

export const PLAN_PROP = gql`
    fragment PlanProp on Plan {
        id
        amount
        can_reinvestment
        percent
        created_at
        days_to_payout
        title
        weekly_payout_interval
        max_amount
    }
`;
export const GET_PLANS = gql`
    query GetPlans {
        GetPlans {
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
            message
        }
    }
`;

export const UPDATE_PLAN = gql`
    mutation UpdatePlan($id: ID!, $update: PlanInput!) {
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
