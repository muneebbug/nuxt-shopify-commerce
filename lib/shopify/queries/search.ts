// lib/shopify/queries/search.ts
export const predictiveSearchQuery = /* GraphQL */ `
  query predictiveSearch($query: String!) {
    predictiveSearch(query: $query) {
        products {
            id
            handle
            title
            featuredImage {
              url
            }
        }
        collections {
          id
          title
          handle
        }
        pages {
          id
          title
          handle
        }
        queries {
          text
          styledText
        }
    }
  }
`;