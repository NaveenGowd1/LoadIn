import api from "./api";

export const registerCustomer = async (data) => {
    const response = await api.post(
        "/accounts/customer/register/",
        data
    );

    return response.data;
};

export const registerDriver = async (data) => {
    const response = await api.post(
        "/accounts/driver/register/",
        data
    );

    return response.data;
};

// NEW

export const loginUser = async (data, role) => {

    const response = await api.post(
        "/accounts/login/",
        {
            ...data,
            role,
        }
    );

    return response.data;
};