import { gql } from '@apollo/client'

export const typeDefs = gql`
  type Metadata {
    id: ID
    pubkey: String
    attributes: String
  }

  input MetadataInput {
    pubKey: String
    attributes: String
  }

  type InsertMetadataPayload {
    metadata: Metadata
  }

  type GetAllPayload {
    metadatas: [Metadata]
  }

  type Query {
    metadata(id: ID!): Metadata
    metadatas: [Metadata]
    viewer: Metadata
  }

  type Mutation {
    insertMetadata(input: MetadataInput!): InsertMetadataPayload
    getAll: GetAllPayload
  }
`
