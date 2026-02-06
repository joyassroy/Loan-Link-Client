import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { FaCheckCircle, FaDollarSign, FaPercent, FaArrowLeft } from "react-icons/fa";

const LoanDetails = () => {
    const { id } = useParams(); // URL থেকে ID নেওয়া
    const axiosPublic = useAxiosPublic();

    // Fetch Single Loan Data
    const { data: loan = {}, isLoading } = useQuery({
        queryKey: ['loan', id],
        queryFn: async () => {
            const res = await axiosPublic.get(`/loans/${id}`);
            return res.data;
        }
    });

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><span className="loading loading-bars loading-lg text-primary"></span></div>;
    }

    return (
        <div className="min-h-screen bg-base-200 py-10 px-4 font-sans">
            <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
                
                {/* 1. Header Image Section */}
                <div className="relative h-64 md:h-80 w-full">
                    <img src={loan.image} alt={loan.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center px-4 shadow-black drop-shadow-lg">
                            {loan.title}
                        </h1>
                    </div>
                    <Link to="/all-loans" className="absolute top-4 left-4 btn btn-circle btn-white bg-white/20 backdrop-blur-md border-none text-white hover:bg-white hover:text-black">
                        <FaArrowLeft />
                    </Link>
                </div>

                <div className="p-8 md:p-12">
                    <div className="flex flex-col md:flex-row gap-10">
                        
                        {/* 2. Left Side: Details */}
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="badge badge-secondary badge-lg text-lg py-4 px-6 font-bold uppercase tracking-wider">{loan.category}</div>
                                <span className="text-gray-500 font-semibold">Posted on: {new Date(loan.date).toLocaleDateString()}</span>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-gray-800 border-b pb-2">Description</h3>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {loan.description}
                            </p>

                            <h3 className="text-2xl font-bold text-gray-800 border-b pb-2 mt-4">Terms & Conditions</h3>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-gray-600"><FaCheckCircle className="text-green-500" /> Must be a citizen of the country.</li>
                                <li className="flex items-center gap-2 text-gray-600"><FaCheckCircle className="text-green-500" /> Valid bank account required.</li>
                                <li className="flex items-center gap-2 text-gray-600"><FaCheckCircle className="text-green-500" /> Age must be 18+.</li>
                            </ul>
                        </div>

                        {/* 3. Right Side: Pricing Card */}
                        <div className="w-full md:w-80 shrink-0">
                            <div className="card bg-base-100 shadow-xl border border-gray-100 p-6 sticky top-24">
                                <h3 className="text-xl font-bold text-center mb-6 text-gray-700">Loan Overview</h3>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                                        <div className="flex items-center gap-2 text-blue-600 font-bold">
                                            <FaDollarSign /> Max Limit
                                        </div>
                                        <span className="font-bold text-xl">${loan.maxLoanLimit || loan.maxLimit}</span>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                                        <div className="flex items-center gap-2 text-purple-600 font-bold">
                                            <FaPercent /> Interest
                                        </div>
                                        <span className="font-bold text-xl">{loan.interest || loan.interestRate}%</span>
                                    </div>
                                </div>

                                <div className="divider"></div>

                                {/* Apply Button (Modal Trigger) */}
                                <Link to={`/application/${loan._id}`} className="w-full">
    <button className="btn btn-primary w-full rounded-xl text-lg shadow-lg shadow-primary/30 animate-pulse hover:animate-none">
        Apply Now
    </button>
</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Application Modal Placeholder --- */}
            <dialog id="application_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Apply for {loan.title}</h3>
                    <p className="py-4">Application form will go here...</p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>

        </div>
    );
};

export default LoanDetails;