import axios from 'axios';

const API_URL = 'http://localhost:3030/items'

export const APIgetItemById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/status/${id}`);

        // console.log("ITEM:", response.data)
        return response.data;

    } catch (error) {
        console.error('Error fetching item data:', error);
        throw error;
    }
};   