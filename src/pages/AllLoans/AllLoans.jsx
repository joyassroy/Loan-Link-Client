import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { Link } from "react-router-dom";
import { useState } from "react";

const AllLoans = () => {
    const axiosPublic = useAxiosPublic();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    const { data: loans = [], isLoading } = useQuery({
        queryKey: ['all-loans', search, category],
        queryFn: async () => {
            // In a real app, send search/category as query params to server
            // const res = await axiosPublic.get(`/loans?search=${search}&category=${category}`);
            const res = await axiosPublic.get('/loans');
            return res.data;
        }
    });

    // Client-side filtering (if server filtering isn't implemented yet)
    const filteredLoans = loans.filter(loan => {
        const matchTitle = loan.title.toLowerCase().includes(search.toLowerCase());
        const matchCategory = category ? loan.category === category : true;
        return matchTitle && matchCategory;
    });

    if(isLoading) return <span className="loading loading-spinner loading-lg block mx-auto mt-20"></span>;

    return (
        <div className="my-10 px-4">
            <h2 className="text-3xl font-bold text-center mb-8">All Available Loans</h2>
            
            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
                <input 
                    type="text" 
                    placeholder="Search by loan title..." 
                    className="input input-bordered w-full md:w-1/3"
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select 
                    className="select select-bordered w-full md:w-1/4"
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    <option value="business">Business Loan</option>
                    <option value="personal">Personal Loan</option>
                    <option value="home">Home Loan</option>
                </select>
            </div>

            {/* Loans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLoans.map(loan => (
                    <div key={loan._id} className="card bg-base-100 shadow-xl">
                        <figure><img src={loan.image} alt={loan.title} className="h-56 w-full object-cover" /></figure>
                        <div className="card-body">
                            <h2 className="card-title">
                                {loan.title}
                                <div className="badge badge-secondary">{loan.category}</div>
                            </h2>
                            <p>Max Limit: <span className="font-bold">${loan.maxLimit}</span></p>
                            <p>Interest: <span className="font-bold">{loan.interestRate}%</span></p>
                            <div className="card-actions justify-end">
                                <Link to={`/loan/${loan._id}`} className="btn btn-primary">View Details</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllLoans;