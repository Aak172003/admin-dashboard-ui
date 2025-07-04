import axios from "axios";
import { useAuthStore } from "../store";

export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_URL,
    // This is used to send cookies to the server , 
    // If we dont make this true , so cookies will not be sent to the server and will not be store in cookies
    withCredentials: true,
    // here we provide some common headers , which will be used in all the requests
    headers: {
        // data will be sent in json format
        'Content-Type': 'application/json',
        // data will be accepted in json format
        Accept: "application/json",
    },
});


// const refreshToken = () => api.post(ENDPOINT_REFRESH_TOKEN)

const refreshToken = async () => {
    await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/auth/refresh`, {}, {
        withCredentials: true
    })

}

// Axios provide interceptors , which are used to intercept the request and response

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        console.log("originalRequest :::::::::::: ", originalRequest);

        // This is used to prevent infinite loop of refreshing tokens when any API sends a request and gets a 401 error again
        // To prevent this, we are using this flag
        if (error.response?.status === 401 && !originalRequest._isRetry) {
            try {

                originalRequest._isRetry = true;

                const headers = { ...originalRequest.headers }
                await refreshToken()
                return api.request({ ...originalRequest, headers })

            } catch (error) {
                console.log("Refresh Token Error :::::::::::: ", error);

                // Call as a Hook
                useAuthStore.getState().logout();
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
)