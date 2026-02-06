import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic"; 
import Swal from "sweetalert2";
import { FaPaperPlane, FaMoneyBillWave, FaDollarSign, FaUser, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const LoanApplication = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();

    // 1. Fetch Loan Details
    const { data: loan = {}, isLoading } = useQuery({
        queryKey: ['loan', id],
        queryFn: async () => {
            const res = await axiosPublic.get(`/loans/${id}`);
            return res.data;
        }
    });

    // 2. Handle Form Submit
    const handleApply = async (e) => {
        e.preventDefault();
        const form = e.target;
        const phone = form.phone.value;
        const address = form.address.value;
        const amount = parseFloat(form.amount.value);
        const maxLimit = parseFloat(loan.maxLoanLimit || loan.maxLimit);

        if (amount > maxLimit) {
            Swal.fire({
                title: "Limit Exceeded!",
                text: `You cannot apply for more than $${maxLimit}`,
                icon: "error"
            });
            return;
        }

        // 🔥 ডাটাবেস এন্ট্রি ঠিক করার জন্য এই নামগুলো চেঞ্জ করা হলো
        const applicationData = {
            loanId: id,
            loanTitle: loan.title,
            loanCategory: loan.category,
            
            applicantName: user?.displayName, // আগে ছিল borrowerName
            email: user?.email,               // আগে ছিল borrowerEmail
            
            phone,
            address,
            loanAmount: amount,               // আগে ছিল amount
            
            status: 'pending',
            paymentStatus: 'unpaid',          // ডিফল্ট ভ্যালু
            appliedDate: new Date().toISOString()
        };

        try {
            const res = await axiosPublic.post('/applications', applicationData);
            if (res.data.insertedId) {
                Swal.fire("Success", "Application Submitted!", "success");
                navigate('/dashboard/my-loans');
            }
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    };

        

    if (isLoading) return <div className="flex justify-center h-screen items-center"><span className="loading loading-bars loading-lg text-primary"></span></div>;

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center py-10 px-4 font-sans">
            <div className="card w-full max-w-3xl bg-white shadow-2xl rounded-3xl overflow-hidden">
                
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-8 text-white text-center">
                    <h2 className="text-4xl font-bold flex items-center justify-center gap-3 mb-2">
                        <FaMoneyBillWave /> Apply for Loan
                    </h2>
                    <p className="opacity-90 text-lg">
                        Loan Title: <span className="font-bold text-yellow-300">{loan.title}</span>
                    </p>
                    <div className="mt-4 badge badge-warning text-gray-800 font-bold p-3 text-lg">
                        Maximum Limit: ${loan.maxLoanLimit || loan.maxLimit}
                    </div>
                </div>

                {/* Form Section */}
                <form onSubmit={handleApply} className="card-body p-8 space-y-6">
                    
                    {/* Read-Only Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-3">
                            <FaUser className="text-blue-500" />
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase">Applicant</p>
                                <p className="font-bold text-gray-800">{user?.displayName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-blue-500 font-bold">ID:</div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase">Loan Category</p>
                                <p className="font-bold text-gray-800 capitalize">{loan.category}</p>
                            </div>
                        </div>
                    </div>

                    <div className="divider text-gray-400 text-sm font-semibold">Fill Required Info</div>

                    {/* ✅ LOAN AMOUNT INPUT (Highlighted) */}
                    <div className="form-control">
                        <label className="label font-bold text-gray-700 text-base">
                            Loan Amount (USD) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FaDollarSign className="text-green-600 text-xl" />
                            </div>
                            <input 
                                type="number" 
                                name="amount" 
                                placeholder={`Enter amount (Max: $${loan.maxLoanLimit || loan.maxLimit})`} 
                                className="input input-bordered w-full pl-10 border-2 focus:border-primary text-lg font-semibold text-gray-700 h-14" 
                                max={loan.maxLoanLimit || loan.maxLimit}
                                required 
                            />
                        </div>
                        <label className="label">
                            <span className="label-text-alt text-gray-500">
                                Enter the amount you need. Cannot exceed the max limit.
                            </span>
                        </label>
                    </div>

                    {/* Phone Input */}
                    <div className="form-control">
                        <label className="label font-bold text-gray-700 text-base">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FaPhone className="text-gray-400" />
                            </div>
                            <input 
                                type="tel" 
                                name="phone" 
                                placeholder="+880 17..." 
                                className="input input-bordered w-full pl-10 focus:input-primary" 
                                required 
                            />
                        </div>
                    </div>

                    {/* Address Input */}
                    <div className="form-control">
                        <label className="label font-bold text-gray-700 text-base">
                            Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute top-4 left-4 pointer-events-none">
                                <FaMapMarkerAlt className="text-gray-400" />
                            </div>
                            <textarea 
                                name="address" 
                                placeholder="Your full address..." 
                                className="textarea textarea-bordered focus:textarea-primary w-full h-24 pl-10 pt-3 text-base" 
                                required
                            ></textarea>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="form-control mt-6">
                        <button className="btn btn-primary w-full text-lg shadow-xl hover:scale-[1.02] transition-transform duration-200">
                            <FaPaperPlane /> Submit Application
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoanApplication;