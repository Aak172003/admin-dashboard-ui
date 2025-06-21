import axios from "axios";

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
        Accept: 'application/json',



    }


})