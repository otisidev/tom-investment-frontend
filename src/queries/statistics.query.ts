import gql from "graphql-tag";

const GET_COUNTS = gql`
    query CountAll {
        CountActiveInvestment
        CountApprovedInvestment
        CountInvestment
        CountPendingInvestment
        CountUsers
        SumInvestmentMade
        CountReferral
    }
`;
export const GET_COUNT_USER = gql`
    query CountUserAll {
        CountInvestment
        CountReferral
    }
`;

export { GET_COUNTS };
