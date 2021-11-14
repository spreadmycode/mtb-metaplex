import axios from "axios";

export async function insertMetadata(pubKey, attributes) {
    const response = await axios.post('http://209.182.217.118/insert_metadata', { data: {pubKey, attributes}});
    return response.data;
}

export async function getAll() {
    const response = await axios.post('http://209.182.217.118/get_all', {});
    return response.data;
}
