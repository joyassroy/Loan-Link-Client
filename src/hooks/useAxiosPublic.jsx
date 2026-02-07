import axios from "axios";

const axiosPublic = axios.create({
    baseURL: 'https://loan-link-server-teal.vercel.app', // Make sure this matches your server port
    withCredentials: true
});

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;