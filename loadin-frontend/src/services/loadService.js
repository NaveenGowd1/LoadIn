import api from './api';

export const getMyAcceptedLoads = async () => {
    const response = await api.get('/loads/my-accepted-loads/');
    return response.data;
}


export const matchLoads = async (locationData) => {
    const response = await api.post("/loads/match/", locationData);
    return response.data;
};

export const acceptLoad = async (loadId) => {
    const response = await api.post(`/loads/${loadId}/accept/`);
    return response.data;
};

export const startLoad = async (loadId) => {
    const response = await api.post(`/loads/${loadId}/start/`);
    return response.data;
};

export const deliverLoad = async (loadId) => {
    const response = await api.post(`/loads/${loadId}/deliver/`);
    return response.data;
};

export const getDriverLoadHistory = async () => {
    const response = await api.get("/loads/driver-history/");
    return response.data;
};