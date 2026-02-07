import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic"; 
import Swal from "sweetalert2";
import Confetti from "react-confetti"; 
import { FaPaperPlane, FaMoneyBillWave, FaDollarSign, FaUser, FaPhone, FaMapMarkerAlt, FaIdCard, FaBriefcase, FaStickyNote, FaPercentage, FaUserTag, FaPenNib } from "react-icons/fa";

const LoanApplication = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();
    
    // 🎉 Confetti State
    const [showConfetti, setShowConfetti] = useState(false);
    const [windowDimension] = useState({ width: window.innerWidth, height: window.innerHeight });

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
        
        // Data Gathering
        const firstName = form.firstName.value;
        const lastName = form.lastName.value;
        const phone = form.phone.value;
        const nationalID = form.nationalID.value;
        const incomeSource = form.incomeSource.value;
        const monthlyIncome = parseFloat(form.monthlyIncome.value);
        const amount = parseFloat(form.amount.value);
        
        // Bottom Fields
        const reason = form.reason.value;
        const address = form.address.value;
        const notes = form.notes.value;
        
        const maxLimit = parseFloat(loan.maxLoanLimit || loan.maxLimit);

        // Validation
        if (amount > maxLimit) {
            Swal.fire({
                title: "Limit Exceeded!",
                text: `You cannot apply for more than $${maxLimit}`,
                icon: "error"
            });
            return;
        }

        const applicationData = {
            loanId: id,
            loanTitle: loan.title,
            loanCategory: loan.category,
            interestRate: loan.interestRate || loan.interest,
            applicantName: `${firstName} ${lastName}`,
            firstName,
            lastName,
            email: user?.email,
            phone,
            nationalID,
            incomeSource,
            monthlyIncome,
            loanAmount: amount,
            reason,
            address,
            extraNotes: notes,
            status: 'pending',
            paymentStatus: 'unpaid',
            appliedDate: new Date().toISOString()
        };

        try {
            const res = await axiosPublic.post('/applications', applicationData);
            if (res.data.insertedId) {
                setShowConfetti(true);
                setTimeout(() => {
                    Swal.fire({
                        title: "Application Sent!",
                        text: `Your application for $${amount} has been submitted successfully.`,
                        icon: "success",
                        timer: 3000,
                        showConfirmButton: false
                    }).then(() => {
                        setShowConfetti(false);
                        navigate('/dashboard/my-loans');
                    });
                }, 1000);
            }
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    };

    if (isLoading) return <div className="flex justify-center h-screen items-center"><span className="loading loading-bars loading-lg text-primary"></span></div>;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 font-sans relative overflow-hidden">
            
            {/* 🎉 Confetti Component */}
            {showConfetti && (
                <div className="fixed inset-0 z-50 pointer-events-none">
                    <Confetti width={windowDimension.width} height={windowDimension.height} numberOfPieces={300} recycle={false} />
                </div>
            )}

            <div className="card w-full max-w-5xl bg-white shadow-2xl rounded-[2.5rem] overflow-hidden z-10 border border-gray-100">
                
                {/* Header Section */}
                <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-12 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500 rounded-full blur-[80px] opacity-40"></div>
                    
                    <h2 className="text-3xl md:text-5xl font-extrabold flex items-center justify-center gap-4 mb-3 relative z-10 tracking-tight">
                        <FaMoneyBillWave className="text-yellow-400" /> Loan Application
                    </h2>
                    <p className="opacity-90 text-lg relative z-10 font-light">
                        Requesting funds for: <span className="font-bold text-yellow-300 border-b border-yellow-300/50 pb-1">{loan.title}</span>
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 mt-8 relative z-10">
                        <div className="badge bg-white/10 backdrop-blur-md text-white border-white/20 p-4 text-sm font-semibold">
                            Max Limit: ${loan.maxLoanLimit || loan.maxLimit}
                        </div>
                        <div className="badge bg-white/10 backdrop-blur-md text-white border-white/20 p-4 text-sm font-semibold">
                             Interest: {loan.interestRate || loan.interest}%
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <form onSubmit={handleApply} className="card-body p-8 md:p-12 space-y-10">
                    
                    {/* --- 1. VERIFIED INFO --- */}
                    <div className="bg-blue-50/40 p-6 rounded-3xl border border-blue-100/50">
                        <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-5 flex items-center gap-2">
                            <FaUserTag /> Verified Applicant Info
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-4 bg-white rounded-2xl border border-blue-50 shadow-sm flex flex-col justify-center">
                                <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Email Address</label>
                                <div className="flex items-center gap-2 font-bold text-gray-700 mt-1 truncate text-sm">
                                    <FaUser className="text-blue-400" /> {user?.email}
                                </div>
                            </div>
                            <div className="p-4 bg-white rounded-2xl border border-blue-50 shadow-sm flex flex-col justify-center">
                                <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Category</label>
                                <div className="font-bold text-gray-700 mt-1 capitalize text-sm">{loan.category}</div>
                            </div>
                            <div className="p-4 bg-white rounded-2xl border border-blue-50 shadow-sm flex flex-col justify-center">
                                <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Interest Rate</label>
                                <div className="flex items-center gap-2 font-bold text-gray-700 mt-1 text-sm">
                                    <FaPercentage className="text-blue-400" /> {loan.interestRate || loan.interest}%
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- 2. PERSONAL & FINANCIAL (Grid) --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        
                        {/* Left Column: Personal */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">1</div>
                                <h3 className="text-lg font-bold text-gray-800">Personal Details</h3>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label font-bold text-gray-600 text-xs uppercase">First Name</label>
                                    <input type="text" name="firstName" placeholder="John" className="input input-bordered w-full bg-gray-50 focus:bg-white focus:ring-2 ring-indigo-100 rounded-xl transition-all" required />
                                </div>
                                <div className="form-control">
                                    <label className="label font-bold text-gray-600 text-xs uppercase">Last Name</label>
                                    <input type="text" name="lastName" placeholder="Doe" className="input input-bordered w-full bg-gray-50 focus:bg-white focus:ring-2 ring-indigo-100 rounded-xl transition-all" required />
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label font-bold text-gray-600 text-xs uppercase">Contact Number</label>
                                <div className="relative">
                                    <FaPhone className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
                                    <input type="tel" name="phone" placeholder="+880 17..." className="input input-bordered w-full pl-10 bg-gray-50 focus:bg-white focus:ring-2 ring-indigo-100 rounded-xl transition-all" required />
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label font-bold text-gray-600 text-xs uppercase">NID / Passport</label>
                                <div className="relative">
                                    <FaIdCard className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
                                    <input type="text" name="nationalID" placeholder="ID Number" className="input input-bordered w-full pl-10 bg-gray-50 focus:bg-white focus:ring-2 ring-indigo-100 rounded-xl transition-all" required />
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Financial */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm">2</div>
                                <h3 className="text-lg font-bold text-gray-800">Financial Info</h3>
                            </div>

                            <div className="form-control">
                                <label className="label font-bold text-gray-600 text-xs uppercase">Income Source</label>
                                <div className="relative">
                                    <FaBriefcase className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
                                    <select name="incomeSource" className="select select-bordered w-full pl-10 bg-gray-50 focus:bg-white focus:ring-2 ring-green-100 rounded-xl transition-all cursor-pointer" required>
                                        <option value="" disabled selected>Select Source</option>
                                        <option value="Salary">Job / Salary</option>
                                        <option value="Business">Business</option>
                                        <option value="Freelancing">Freelancing</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label font-bold text-gray-600 text-xs uppercase">Monthly Income</label>
                                <div className="relative">
                                    <FaDollarSign className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
                                    <input type="number" name="monthlyIncome" placeholder="5000" className="input input-bordered w-full pl-10 bg-gray-50 focus:bg-white focus:ring-2 ring-green-100 rounded-xl transition-all" required />
                                </div>
                            </div>

                            <div className="form-control pt-2">
                                <label className="label font-bold text-gray-800 text-sm mb-1">Desired Loan Amount (USD) <span className="text-red-500">*</span></label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaDollarSign className="text-green-600 text-xl group-focus-within:scale-125 transition-transform" />
                                    </div>
                                    <input 
                                        type="number" 
                                        name="amount" 
                                        placeholder={`Max: ${loan.maxLoanLimit || loan.maxLimit}`} 
                                        className="input input-bordered w-full pl-10 h-14 text-xl font-bold text-gray-800 bg-white border-2 border-gray-200 focus:border-green-500 rounded-xl focus:ring-4 ring-green-500/10 transition-all shadow-sm" 
                                        max={loan.maxLoanLimit || loan.maxLimit}
                                        required 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- 3. BOTTOM SECTION (Improved Classy Look) --- */}
                    <div className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-200/60 shadow-inner">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">3</div>
                            <h3 className="text-lg font-bold text-gray-800">Final Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            {/* Reason for Loan */}
                            <div className="form-control md:col-span-1">
                                <label className="label font-bold text-gray-600 text-xs uppercase tracking-wider mb-1">Reason for Loan <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <FaPenNib className="absolute top-5 left-5 text-gray-400" />
                                    <textarea 
                                        name="reason" 
                                        className="textarea textarea-bordered w-full h-32 pl-12 pt-4 bg-white focus:bg-white border-gray-300 focus:border-purple-500 focus:ring-4 ring-purple-500/10 rounded-2xl transition-all text-base resize-none shadow-sm" 
                                        placeholder="Please describe why you need this loan in detail..." 
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="form-control md:col-span-1">
                                <label className="label font-bold text-gray-600 text-xs uppercase tracking-wider mb-1">Present Address <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <FaMapMarkerAlt className="absolute top-5 left-5 text-gray-400" />
                                    <textarea 
                                        name="address" 
                                        className="textarea textarea-bordered w-full h-32 pl-12 pt-4 bg-white focus:bg-white border-gray-300 focus:border-purple-500 focus:ring-4 ring-purple-500/10 rounded-2xl transition-all text-base resize-none shadow-sm" 
                                        placeholder="Your full present address (Street, City, Zip Code)..." 
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            {/* Extra Notes (Full Width) */}
                            <div className="form-control md:col-span-2">
                                <label className="label font-bold text-gray-600 text-xs uppercase tracking-wider mb-1">Extra Notes (Optional)</label>
                                <div className="relative">
                                    <FaStickyNote className="absolute top-5 left-5 text-gray-400" />
                                    <textarea 
                                        name="notes" 
                                        className="textarea textarea-bordered w-full h-24 pl-12 pt-4 bg-white focus:bg-white border-gray-300 focus:border-purple-500 focus:ring-4 ring-purple-500/10 rounded-2xl transition-all text-base resize-none shadow-sm" 
                                        placeholder="Any additional information you want to share with the manager..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="form-control pt-4">
                        <button className="btn btn-primary w-full h-16 rounded-2xl text-xl font-bold shadow-2xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 transition-all bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 border-none relative overflow-hidden group">
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                <FaPaperPlane className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                                Submit Application
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-2xl"></div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoanApplication;