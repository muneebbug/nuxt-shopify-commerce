export const getCustomerQuery = /* GraphQL */ `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      displayName
      tags
      acceptsMarketing
      createdAt
      defaultAddress {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        province
        country
        zip
        phone
      }
      addresses(first: 10) {
        edges {
          node {
            id
            firstName
            lastName
            company
            address1
            address2
            city
            province
            country
            zip
            phone
          }
        }
      }
    }
  }
`;

export const customerRecoverMutation = /* GraphQL */ `
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        message
        field
      }
    }
  }
`;

export const customerAddressCreateMutation = /* GraphQL */ `
  mutation customerAddressCreate(
    $customerAccessToken: String!,
    $address: MailingAddressInput!
  ) {
    customerAddressCreate(
      customerAccessToken: $customerAccessToken,
      address: $address
    ) {
      customerAddress {
        id
      }
      customerUserErrors {
        code
        message
        field
      }
    }
  }
`;

export const customerAddressUpdateMutation = /* GraphQL */ `
  mutation customerAddressUpdate(
    $customerAccessToken: String!,
    $id: ID!,
    $address: MailingAddressInput!
  ) {
    customerAddressUpdate(
      customerAccessToken: $customerAccessToken,
      id: $id,
      address: $address
    ) {
      customerAddress {
        id
      }
      customerUserErrors {
        code
        message
        field
      }
    }
  }
`;

export const customerAddressDeleteMutation = /* GraphQL */ `
  mutation customerAddressDelete(
    $customerAccessToken: String!,
    $id: ID!
  ) {
    customerAddressDelete(
      customerAccessToken: $customerAccessToken,
      id: $id
    ) {
      deletedCustomerAddressId
      customerUserErrors {
        code
        message
        field
      }
    }
  }
`;

export const customerDefaultAddressUpdateMutation = /* GraphQL */ `
  mutation customerDefaultAddressUpdate(
    $customerAccessToken: String!,
    $addressId: ID!
  ) {
    customerDefaultAddressUpdate(
      customerAccessToken: $customerAccessToken,
      addressId: $addressId
    ) {
      customer {
        id
      }
      customerUserErrors {
        code
        message
        field
      }
    }
  }
`;

export const customerUpdateMutation = /* GraphQL */ `
  mutation customerUpdate(
    $customerAccessToken: String!,
    $customer: CustomerUpdateInput!
  ) {
    customerUpdate(
      customerAccessToken: $customerAccessToken,
      customer: $customer
    ) {
      customer {
        id
        firstName
        lastName
        email
        phone
        acceptsMarketing
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        message
        field
      }
    }
  }
`;
