import api from './api';

export const getMyAcceptedLoads = async () => {
    const response = await api.get('/loads/my-accepted-loads/');
    return response.data;
}


export const matchLoads = async (locationData) => {
    const response = await api.post("/loads/match/", locationData);
    return response.data;
};