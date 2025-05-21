const customerFragment = /* GraphQL */ `
  fragment customer on Customer {
    id
    firstName
    lastName
    email
    phone
    displayName
    acceptsMarketing
    createdAt
    numberOfOrders
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
`;

export default customerFragment;
