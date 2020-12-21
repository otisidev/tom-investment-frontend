import gql from "graphql-tag";

const CONTACT_PERSON_PROP = gql`
    fragment ContactPersonProp on ContactPerson {
        id
        name
        email
        phone
        position
        image
    }
`;

export const GET_CONTACT_PERSONS = gql`
    query GetContactPersons($category: ID!) {
        GetContactPersons(category: $category) {
            docs {
                ...ContactPersonProp
            }
        }
    }
    ${CONTACT_PERSON_PROP}
`;

export const CREATE_CONTACT_PERSON = gql`
    mutation CreateContactPerson($model: ContactPersonInput!) {
        CreateContactPerson(model: $model) {
            message
            doc {
                ...ContactPersonProp
            }
        }
    }
    ${CONTACT_PERSON_PROP}
`;

export const DELETE_CONTACT_PERSON = gql`
    mutation DeleteContactPerson($id: ID!) {
        RemoveContactPerson(id: $id) {
            message
            doc {
                id
            }
        }
    }
`;

export const UPDATE_CONTACT_PERSON = gql`
    mutation UpdateContactPerson($id: ID!, $model: ContactPersonInput!) {
        UpdateContactPerson(id: $id, update: $model) {
            message
            doc {
                ...ContactPersonProp
            }
        }
    }
    ${CONTACT_PERSON_PROP}
`;
