import API from './axios';

export const itemAPI = {
    getItems: () => API.get('/items'),
    getItem: (id) => API.get(`/items/${id}`),
    createItem: (itemData) => API.post('/items', itemData),
    updateItem: (id, itemData) => API.put(`/items/${id}`, itemData),
    deleteItem: (id) => API.delete(`/items/${id}`),
    getStats: () => API.get('/stats')
};
