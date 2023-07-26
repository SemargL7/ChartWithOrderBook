import axios from "axios";

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}`
})

axiosClient.interceptors.response.use((response) => {
    return response
}, (error) => {
    const {response} = error;
    if (response.status === 401) {
        // window.location.reload();
    } else if (response.status === 404) {
        //Show not found
        console.log(`${import.meta.env.VITE_API_BASE_URL}`)
    }

    throw error;
})

export default axiosClient
