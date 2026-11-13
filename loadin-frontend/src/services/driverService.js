import api from "./api";

export const getDriverProfile = async () => {
    const response = await api.get("/drivers/profile/");
    return response.data;
};

export const createDriverProfile = async (profileData) => {
    const response = await api.post("/drivers/profile/create/", profileData);
    return response.data;
};

export const updateDriverProfile = async (profileData) => {
    const response = await api.patch("/drivers/profile/update/", profileData);
    return response.data;
};

export const getDriverDashboard = async () => {
    const response = await api.get("/drivers/dashboard/");
    return response.data;
};