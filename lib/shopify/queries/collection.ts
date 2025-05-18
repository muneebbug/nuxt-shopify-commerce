import productFragment from '../fragments/product';
import seoFragment from '../fragments/seo';

const collectionFragment = /* GraphQL */ `
  fragment collection on Collection {
    id
    handle
    title
    description
    seo {
      ...seo
    }
    updatedAt
  }
  ${seoFragment}
`;

export const getCollectionQuery = /* GraphQL */ `
  query getCollection($handle: String!) {
    collection(handle: $handle) {
      ...collection
    }
  }
  ${collectionFragment}
`;

export const getCollectionsQuery = /* GraphQL */ `
  query getCollections {
    collections(first: 100, sortKey: TITLE) {
      edges {
        node {
          ...collection
        }
      }
    }
  }
  ${collectionFragment}
`;

export const getCollectionProductsQuery = /* GraphQL */ `
  query getCollectionProducts(
    $handle: String!
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $first: Int
    $after: String
  ) {
    collection(handle: $handle) {
      products(sortKey: $sortKey, reverse: $reverse, first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            ...product
          }
          cursor
        }
      }
    }
  }
  ${productFragment}
`;
