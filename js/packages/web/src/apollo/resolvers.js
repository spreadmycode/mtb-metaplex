import { 
    insertMetadata,
    getAll
} from '../lib/metadata';

export const resolvers = {
    Query: {
        async viewer(_parent, args, context, _info) {
            const metadata = await getAll();
            return { metadata };
        },
    },
    Mutation: {
        async insertMetadata(_parent, args, _context, _info) {
            const metadata = await insertMetadata(args.input.pubKey, args.input.attributes);
            return { metadata };
        },
        async getAll(_parent, args, _context, _info) {
            const metadatas = await getAll();
            return { metadatas };
        },
    },
};
