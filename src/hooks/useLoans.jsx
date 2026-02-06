import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic"; // Create a standard axios instance for public routes

const useLoans = () => {
    const axiosPublic = useAxiosPublic();
    
    const { data: loans = [], isPending: loading, refetch } = useQuery({
        queryKey: ['loans'],
        queryFn: async () => {
            const res = await axiosPublic.get('/loans');
            return res.data;
        }
    });

    return [loans, loading, refetch];
};

export default useLoans;