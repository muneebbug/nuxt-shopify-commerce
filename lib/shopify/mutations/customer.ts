import customerFragment from '../fragments/customer';
export const signInWithEmailAndPasswordMutation = /* GraphQL */ `
  mutation SignInWithEmailAndPassword(
      $email: String!,
      $password: String!,
  ) {
      customerAccessTokenCreate(input: {
          email: $email,
          password: $password,
      }) {
          customerAccessToken {
              accessToken
              expiresAt
          }
          customerUserErrors {
              code
              message
          }
      }
  }
`
export const signInWithAccessTokenMutation = /* GraphQL */ `
  mutation SignInWithAccessToken($accessToken: String!) {
    customerAccessTokenCreate(input: { accessToken: $accessToken }) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      userErrors {
        field
        message
      }
    }
  }
`

export const registerAccountMutation = /* GraphQL */ `
  mutation RegisterAccount(
      $email: String!,
      $password: String!,
      $firstName: String!,
      $lastName: String!,
      $acceptsMarketing: Boolean = false,
  ) {
      customerCreate(input: {
          email: $email,
          password: $password,
          firstName: $firstName,
          lastName: $lastName,
          acceptsMarketing: $acceptsMarketing,
      }) {
        customerUserErrors {
            code
            message
        }
        customer {
          ...customer
        }
      }
  }
  ${customerFragment}
`

export const customerRecoverMutation = /* GraphQL */ `
  mutation CustomerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        message
      }
    }
  }
`