import { 
    insertMinter, 
    findMinters, 
    getMintersCount,
    addRoyaltyAllMinters,
    getMinterRoyalty,
    clearMinterRoyalty,
} from '../lib/minters';

export const resolvers = {
    Query: {
        async viewer(_parent, args, context, _info) {
            const minters = await findMinters(args.input.pubKey);
            return { minters };
        },
    },
    Mutation: {
        async insertMinter(_parent, args, _context, _info) {
            const minter = await insertMinter(args.input.pubKey);
            return { minter };
        },
        async findMinters(_parent, args, context, _info) {
            const minters = await findMinters(args.input.pubKey);
            return { minters };
        },
        async getMintersCount(_parent, args, context, _info) {
            const count = await getMintersCount();
            return { count };
        },
        async addRoyaltyAllMinters(_parent, args, context, _info) {
            const flag = await addRoyaltyAllMinters(args.input.distribution);
            return flag;
        },
        async getMinterRoyalty(_parent, args, context, _info) {
            const royalty = await getMinterRoyalty(args.input.pubKey);
            return { royalty };
        },
        async clearMinterRoyalty(_parent, args, context, _info) {
            const flag = await clearMinterRoyalty(args.input.pubKey);
            return flag;
        },
    },
};
