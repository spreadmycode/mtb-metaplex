import { gql } from '@apollo/client'

export const typeDefs = gql`
  type Minter {
    id: ID
    pubkey: String
    royalty: Int
  }

  input PubkeyInput {
    pubKey: String
  }

  input DistributionInput {
    distribution: Int
  }

  type InsertMinterPayload {
    minter: Minter
  }

  type FindMintersPayload {
    minters: [Minter]
  }

  type GetMintersCountPayload {
    count: Int
  }

  type GetMinterRoyaltyPayload {
    royalty: Int
  }

  type Query {
    minter(id: ID!): Minter
    minters: [Minter]
    viewer: Minter
  }

  type Mutation {
    insertMinter(input: PubkeyInput!): InsertMinterPayload
    findMinters(input: PubkeyInput!): FindMintersPayload
    getMintersCount: GetMintersCountPayload
    addRoyaltyAllMinters(input: DistributionInput!): Boolean
    getMinterRoyalty(input: PubkeyInput!): GetMinterRoyaltyPayload
    clearMinterRoyalty(input: PubkeyInput!): Boolean
  }
`
