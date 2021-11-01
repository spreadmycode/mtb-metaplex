import excuteQuery from './db';

export async function insertMetadata(pubKey, attributes) {
    try {
        const result = await excuteQuery({
            query: 'INSERT INTO metadata (pubkey, attributes) VALUES(?, ?)',
            values: [pubKey, attributes],
        });
        console.log(result);
    } catch (error) {
        console.log(error);
    }
    return {pubKey, attributes};
}

export async function getAll() {
    try {
        const result = await excuteQuery({
            query: 'SELECT * FROM metadata',
            values: [],
        });
        console.log(result);
        return result;
    } catch (error) {
        console.log(error);
    }
    return [];
}
