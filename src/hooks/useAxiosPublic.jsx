import axios from "axios";

const axiosPublic = axios.create({
    baseURL: 'http://localhost:5013', // Make sure this matches your server port
    withCredentials: true
});

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;