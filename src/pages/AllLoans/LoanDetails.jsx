import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { FaCheckCircle, FaDollarSign, FaPercent, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const LoanDetails = () => {
    const { id } = useParams(); 
    const axiosPublic = useAxiosPublic();

    // 1. Fetch Single Loan Data
    const { data: loan = {}, isLoading } = useQuery({
        queryKey: ['loan', id],
        queryFn: async () => {
            const res = await axiosPublic.get(`/loans/${id}`);
            return res.data;
        }
    });

    // 2. Fetch Related Loans (Based on Category)
    const { data: relatedLoans = [], isLoading: relatedLoading } = useQuery({
        queryKey: ['related-loans', loan?.category],
        enabled: !!loan?.category, 
        queryFn: async () => {
            const res = await axiosPublic.get(`/loans?category=${loan.category}`);
            const filtered = res.data.filter(item => item._id !== id);
            return filtered.slice(0, 3);
        }
    });

    // --- 🚀 PREMIUM SKELETON LOADER ---
    if (isLoading) {
        return (
            <div className="min-h-screen bg-base-200 py-10 px-4 font-sans transition-colors duration-300">
                <div className="max-w-5xl mx-auto bg-base-100 shadow-2xl rounded-3xl overflow-hidden border border-base-300 animate-pulse">
                    
                    {/* Header Image Skeleton */}
                    <div className="h-64 md:h-[400px] w-full bg-base-300/50"></div>

                    {/* Content Skeleton */}
                    <div className="p-8 md:p-12">
                        <div className="flex flex-col lg:flex-row gap-12">
                            
                            {/* Left Side Skeleton */}
                            <div className="flex-1 space-y-8">
                                <div className="h-10 w-48 bg-base-300/50 rounded-lg"></div>
                                
                                <div>
                                    <div className="h-8 w-40 bg-base-300/50 rounded-lg mb-4"></div>
                                    <div className="space-y-3">
                                        <div className="h-4 w-full bg-base-300/50 rounded"></div>
                                        <div className="h-4 w-full bg-base-300/50 rounded"></div>
                                        <div className="h-4 w-3/4 bg-base-300/50 rounded"></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="h-8 w-48 bg-base-300/50 rounded-lg mb-4 mt-8"></div>
                                    <div className="space-y-3">
                                        <div className="h-12 w-full bg-base-300/50 rounded-xl"></div>
                                        <div className="h-12 w-full bg-base-300/50 rounded-xl"></div>
                                        <div className="h-12 w-full bg-base-300/50 rounded-xl"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side Pricing Card Skeleton */}
                            <div className="w-full lg:w-96 shrink-0">
                                <div className="bg-base-200 border border-base-300 p-8 rounded-3xl space-y-6">
                                    <div className="h-6 w-32 bg-base-300/50 rounded mx-auto mb-8"></div>
                                    <div className="h-16 bg-base-100 rounded-2xl"></div>
                                    <div className="h-16 bg-base-100 rounded-2xl"></div>
                                    <div className="h-14 bg-base-300/50 rounded-2xl w-full mt-6"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 py-10 px-4 font-sans transition-colors duration-300">
            
            {/* --- 1. MAIN DETAILS SECTION --- */}
            <div className="max-w-5xl mx-auto bg-base-100 shadow-2xl rounded-3xl overflow-hidden border border-base-300 transition-colors duration-300">
                
                {/* Header Image Section */}
                <div className="relative h-64 md:h-[400px] w-full group">
                    <img 
                        src={loan.image} 
                        alt={loan.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    {/* Premium Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center pb-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center px-4 drop-shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            {loan.title}
                        </h1>
                    </div>
                    {/* Back Button */}
                    <Link to="/all-loans" className="absolute top-6 left-6 btn btn-circle btn-sm md:btn-md bg-black/30 backdrop-blur-md border border-white/20 text-white hover:bg-primary hover:border-primary transition-all">
                        <FaArrowLeft />
                    </Link>
                    {/* Category Badge */}
                    <div className="absolute top-6 right-6 badge badge-secondary badge-lg py-4 px-6 font-bold uppercase tracking-wider shadow-lg border-none">
                        {loan.category}
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8 md:p-12">
                    <div className="flex flex-col lg:flex-row gap-12">
                        
                        {/* Left Side: Details */}
                        <div className="flex-1 space-y-8">
                            <div className="flex items-center gap-2 text-base-content/60 font-medium bg-base-200 w-max px-4 py-2 rounded-lg">
                                <span>📅 Posted on:</span>
                                <span className="font-bold text-base-content">{new Date(loan.date || Date.now()).toLocaleDateString()}</span>
                            </div>
                            
                            <div>
                                <h3 className="text-2xl font-bold text-base-content border-b border-base-300 pb-3 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-1 bg-primary rounded-full"></span> Description
                                </h3>
                                <p className="text-base-content/80 leading-relaxed text-lg">
                                    {loan.description || "No description provided for this loan package."}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-base-content border-b border-base-300 pb-3 mb-4 mt-8 flex items-center gap-2">
                                    <span className="w-8 h-1 bg-secondary rounded-full"></span> Terms & Conditions
                                </h3>
                                <ul className="space-y-3 mt-4">
                                    <li className="flex items-start gap-3 text-base-content/80 p-3 bg-base-200/50 rounded-xl hover:bg-base-200 transition-colors">
                                        <FaCheckCircle className="text-success mt-1 shrink-0" /> 
                                        <span>Must be a verified citizen with valid identification.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-base-content/80 p-3 bg-base-200/50 rounded-xl hover:bg-base-200 transition-colors">
                                        <FaCheckCircle className="text-success mt-1 shrink-0" /> 
                                        <span>Valid and active bank account required for disbursement.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-base-content/80 p-3 bg-base-200/50 rounded-xl hover:bg-base-200 transition-colors">
                                        <FaCheckCircle className="text-success mt-1 shrink-0" /> 
                                        <span>Minimum age requirement is 18 years at the time of application.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Right Side: Pricing Card */}
                        <div className="w-full lg:w-96 shrink-0">
                            <div className="bg-base-200 shadow-xl border border-base-300 p-8 rounded-3xl sticky top-24 transition-colors">
                                <h3 className="text-xl font-bold text-center mb-8 text-base-content uppercase tracking-widest border-b border-base-300 pb-4">Loan Overview</h3>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-4 bg-base-100 rounded-2xl shadow-sm border border-base-300 transition-colors">
                                        <div className="flex items-center gap-3 text-primary font-bold">
                                            <div className="p-2 bg-primary/10 rounded-lg"><FaDollarSign /></div>
                                            Max Limit
                                        </div>
                                        <span className="font-extrabold text-2xl text-base-content">${loan.maxLoanLimit || loan.maxLimit || '0'}</span>
                                    </div>

                                    <div className="flex justify-between items-center p-4 bg-base-100 rounded-2xl shadow-sm border border-base-300 transition-colors">
                                        <div className="flex items-center gap-3 text-secondary font-bold">
                                            <div className="p-2 bg-secondary/10 rounded-lg"><FaPercent /></div>
                                            Interest
                                        </div>
                                        <span className="font-extrabold text-2xl text-base-content">{loan.interest || loan.interestRate || '0'}%</span>
                                    </div>
                                </div>

                                <div className="divider opacity-30 my-6"></div>

                                {/* Apply Button */}
                                <Link to={`/application/${loan._id}`} className="block w-full">
                                    <button className="btn btn-primary w-full rounded-2xl text-lg h-14 shadow-[0_8px_30px_rgb(79,70,229,0.3)] animate-pulse hover:animate-none border-none hover:scale-[1.02] transition-transform">
                                        Apply Now <FaArrowRight className="ml-2" />
                                    </button>
                                </Link>
                                <p className="text-center text-xs text-base-content/50 mt-4 font-medium">
                                    Fast & Secure Process. No hidden fees.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 2. RELATED LOANS SECTION --- */}
            {!relatedLoading && relatedLoans.length > 0 && (
                <div className="max-w-5xl mx-auto mt-20 mb-10">
                    <div className="flex items-center justify-between mb-8 px-2">
                        <h2 className="text-3xl font-extrabold text-base-content flex items-center gap-3">
                            Related <span className="text-primary">Packages</span>
                        </h2>
                        <Link to="/all-loans" className="btn btn-ghost text-primary hover:bg-primary/10 rounded-xl hidden md:flex">
                            View All <FaArrowRight />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedLoans.map(related => (
                            <div key={related._id} className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden group border border-base-300">
                                <figure className="h-48 relative overflow-hidden">
                                    <img src={related.image} alt={related.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                                </figure>
                                <div className="card-body p-6">
                                    <h3 className="card-title text-xl font-bold text-base-content line-clamp-1">{related.title}</h3>
                                    <div className="flex justify-between items-center mt-4">
                                        <div className="text-sm">
                                            <p className="text-base-content/50 font-bold uppercase text-[10px]">Limit</p>
                                            <p className="font-extrabold text-base-content">${related.maxLoanLimit || related.maxLimit}</p>
                                        </div>
                                        <div className="text-sm text-right">
                                            <p className="text-base-content/50 font-bold uppercase text-[10px]">Interest</p>
                                            <p className="font-extrabold text-primary">{related.interest || related.interestRate}%</p>
                                        </div>
                                    </div>
                                    <div className="card-actions justify-end mt-6">
                                        <Link to={`/loans/${related._id}`} className="btn btn-outline btn-primary btn-sm w-full rounded-xl">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default LoanDetails;