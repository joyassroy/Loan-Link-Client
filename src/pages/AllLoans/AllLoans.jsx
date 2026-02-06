import { useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FaSearch, FaFilter, FaDollarSign, FaPercent, FaArrowRight, FaLayerGroup, FaRedo } from "react-icons/fa";

const AllLoans = () => {
    const axiosPublic = useAxiosPublic();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    // --- 1. DATA FETCHING ---
    const { data: loans = [], isLoading } = useQuery({
        queryKey: ['all-loans'], 
        queryFn: async () => {
            const res = await axiosPublic.get('/loans');
            return res.data;
        }
    });

    // --- 2. SMART FILTERING LOGIC (Fixed) ---
    const filteredLoans = loans.filter(loan => {
        // Search Logic (Safe check)
        const title = loan.title ? loan.title.toLowerCase() : "";
        const matchTitle = title.includes(search.toLowerCase());

        // Category Logic (Safe & Flexible check)
        // ডাটাবেসে 'Business' থাকুক বা 'Business Loan', ড্রপডাউনের 'Business' এর সাথে ম্যাচ করবে।
        const dbCategory = loan.category ? loan.category.toLowerCase() : "";
        const filterCategory = category.toLowerCase();

        const matchCategory = category 
            ? dbCategory.includes(filterCategory) // Partial match allowed
            : true;
        
        return matchTitle && matchCategory;
    });

    // Reset Function
    const handleReset = () => {
        setSearch('');
        setCategory('');
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <span className="loading loading-bars loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            
            {/* --- HERO HEADER --- */}
            <div className="relative bg-gradient-to-r from-primary to-secondary py-16 px-4 text-center text-white">
                <div className="relative z-10 max-w-3xl mx-auto space-y-3">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                        Explore Loan Packages
                    </h2>
                    <p className="text-white/90 text-lg font-light">
                        Find the perfect financial solution tailored to your needs.
                    </p>
                </div>
            </div>

            {/* --- SEARCH & FILTER BAR --- */}
            <div className="container mx-auto px-4 -mt-8 relative z-20">
                <div className="bg-white p-4 md:p-6 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between border border-gray-100">
                    
                    {/* Search Input */}
                    <div className="relative w-full md:w-1/2">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by loan title..." 
                            className="input input-bordered w-full pl-12 rounded-xl focus:ring-2 ring-primary/20 bg-gray-50 focus:bg-white transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Category Filter (Simplified Values) */}
                    <div className="relative w-full md:w-1/4">
                        <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select 
                            className="select select-bordered w-full pl-12 rounded-xl focus:ring-2 ring-primary/20 bg-gray-50 focus:bg-white cursor-pointer"
                            onChange={(e) => setCategory(e.target.value)}
                            value={category}
                        >
                            <option value="">All Categories</option>
                            {/* Value তে ছোট শব্দ রাখো যাতে ম্যাচ করতে সুবিধা হয় */}
                            <option value="Personal">Personal Loan</option>
                            <option value="Business">Business Loan</option>
                            <option value="Home">Home Loan</option>
                            <option value="Vehicle">Vehicle Loan</option>
                            <option value="Education">Education Loan</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* --- LOANS GRID --- */}
            <div className="container mx-auto px-4 mt-12">
                {filteredLoans.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredLoans.map((loan) => (
                            <div 
                                key={loan._id} 
                                className="card bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden group border border-gray-100 flex flex-col h-full"
                            >
                                {/* Image Section */}
                                <figure className="relative h-56 overflow-hidden">
                                    <img 
                                        src={loan.image} 
                                        alt={loan.title} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 badge badge-secondary badge-lg shadow-md font-bold uppercase tracking-wider text-xs">
                                        {loan.category}
                                    </div>
                                </figure>

                                {/* Content Section */}
                                <div className="card-body p-6 flex-grow">
                                    <h3 className="card-title text-2xl font-bold text-gray-800 group-hover:text-primary transition-colors">
                                        {loan.title}
                                    </h3>
                                    
                                    <div className="divider my-2"></div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                                            <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                                                <FaDollarSign />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-bold uppercase">Max Limit</p>
                                                <p className="font-bold text-gray-800">${loan.maxLoanLimit || loan.maxLimit}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                                            <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
                                                <FaPercent />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-bold uppercase">Interest</p>
                                                <p className="font-bold text-gray-800">{loan.interest || loan.interestRate}%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="p-6 pt-0 mt-auto">
                                    <Link to={`/loans/${loan._id}`}>
                                        <button className="btn btn-primary w-full rounded-xl text-lg text-white shadow-lg shadow-primary/30 flex items-center justify-center gap-2 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-all border-none">
                                            View & Apply <FaArrowRight />
                                        </button>
                                    </Link>
                                    <p className="text-xs text-center text-gray-400 mt-2">
                                        Simple & Fast Process
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // --- NO DATA FOUND UI (Smart Reset) ---
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-lg mx-auto">
                        <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-4xl">
                            <FaLayerGroup />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-600">No Loans Found</h3>
                        <p className="text-gray-500 px-6">
                            We couldn't find any loans matching "{search}" in the "{category}" category.
                        </p>
                        
                        {/* Reset Button */}
                        <button 
                            onClick={handleReset} 
                            className="btn btn-outline btn-primary mt-6 rounded-full px-8 gap-2"
                        >
                            <FaRedo /> Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllLoans;