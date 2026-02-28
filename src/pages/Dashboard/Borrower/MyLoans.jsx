import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FaBriefcase, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaCreditCard, FaReceipt, FaPrint } from "react-icons/fa";

const MyLoans = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    
    // ✅ রিসিপ্ট দেখানোর জন্য স্টেট
    const [selectedReceipt, setSelectedReceipt] = useState(null);

    // 1. Fetch Data
    const { data: loans = [], isLoading } = useQuery({
        queryKey: ['my-loans', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/applications?email=${user.email}`);
            return res.data;
        }
    });

    return (
        <div className="w-full p-5 min-h-screen bg-base-200 text-base-content transition-colors duration-300 pb-20">
            
            {/* --- HEADER (Always Visible) --- */}
            <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-base-content">My Applications</h2>
                <p className="text-base-content/70 mt-2">Manage your applications & receipts</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {isLoading ? (
                    // --- 🚀 PREMIUM SKELETON LOADER ---
                    [...Array(6)].map((_, index) => (
                        <div key={index} className="card bg-base-100 shadow-xl border border-base-300 animate-pulse h-[360px]">
                            <div className="card-body p-6">
                                {/* Skeleton Header */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 bg-base-300/50 rounded-2xl shrink-0"></div>
                                    <div className="space-y-2 w-full">
                                        <div className="h-6 w-3/4 bg-base-300/50 rounded-lg"></div>
                                        <div className="h-4 w-1/2 bg-base-300/50 rounded"></div>
                                    </div>
                                </div>

                                <div className="divider my-0 opacity-0"></div>

                                {/* Skeleton Details */}
                                <div className="space-y-4 mb-6 mt-4">
                                    <div className="flex justify-between items-center">
                                        <div className="h-4 w-1/3 bg-base-300/50 rounded"></div>
                                        <div className="h-5 w-1/4 bg-base-300/50 rounded"></div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="h-4 w-1/3 bg-base-300/50 rounded"></div>
                                        <div className="h-5 w-1/4 bg-base-300/50 rounded"></div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="h-4 w-1/3 bg-base-300/50 rounded"></div>
                                        <div className="h-6 w-16 bg-base-300/50 rounded-full"></div>
                                    </div>
                                </div>

                                {/* Skeleton Action Button */}
                                <div className="mt-auto">
                                    <div className="h-12 w-full bg-base-300/50 rounded-xl"></div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : loans.length > 0 ? (
                    // --- REAL DATA UI ---
                    loans.map((loan) => (
                        <div key={loan._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-300 flex flex-col">
                            <div className="card-body p-6 flex-grow">
                                
                                {/* Header */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-4 bg-primary/10 text-primary rounded-2xl shrink-0">
                                        <FaBriefcase size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-base-content capitalize line-clamp-1">{loan.loanCategory}</h3>
                                        <p className="text-xs text-base-content/50 font-mono mt-1">ID: {loan._id.slice(-6)}</p>
                                    </div>
                                </div>

                                <div className="divider my-2 opacity-30"></div>

                                {/* Details */}
                                <div className="space-y-3 mb-6 flex-grow">
                                    <div className="flex justify-between items-center">
                                        <span className="text-base-content/70 font-medium text-sm">Requested Amount</span>
                                        <span className="font-extrabold text-base-content text-lg">${loan.loanAmount}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-base-content/70 font-medium text-sm">Application Date</span>
                                        <span className="font-bold text-base-content/80 text-sm">{new Date(loan.appliedDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-base-content/70 font-medium text-sm">Application Fee</span>
                                        <span className="badge badge-warning font-bold text-xs border-none">$10.00</span>
                                    </div>
                                </div>

                                {/* Actions Logic */}
                                <div className="card-actions justify-end mt-auto pt-4 border-t border-base-300/50">
                                    
                                    {loan.paymentStatus !== 'paid' ? (
                                        // Unpaid State
                                        <div className="w-full text-center">
                                            <p className="text-xs text-error mb-2 font-bold flex justify-center items-center gap-1">⚠️ Action required</p>
                                            <Link to={`/dashboard/payment/${loan._id}`} className="w-full block">
                                                <button className="btn btn-primary w-full text-white shadow-lg shadow-primary/30 animate-pulse hover:animate-none border-none rounded-xl">
                                                    <FaCreditCard /> Pay $10 Fee
                                                </button>
                                            </Link>
                                        </div>
                                    ) : (
                                        // Paid State
                                        <div className="w-full space-y-3">
                                            {/* Status Badge */}
                                            <div className="flex justify-between items-center bg-base-200/50 p-3 rounded-xl border border-base-300 transition-colors">
                                                <span className="text-sm font-bold text-base-content/70">Status:</span>
                                                {loan.status === 'approved' && <div className="badge badge-success text-white border-none gap-1 font-bold shadow-sm"><FaCheckCircle /> Approved</div>}
                                                {loan.status === 'rejected' && <div className="badge badge-error text-white border-none gap-1 font-bold shadow-sm"><FaTimesCircle /> Rejected</div>}
                                                {loan.status === 'pending' && <div className="badge badge-warning text-white border-none gap-1 font-bold shadow-sm"><FaHourglassHalf /> Pending</div>}
                                            </div>

                                            {/* View Receipt Button */}
                                            <button 
                                                onClick={() => setSelectedReceipt(loan)}
                                                className="btn btn-outline btn-success w-full font-bold gap-2 rounded-xl hover:shadow-lg hover:shadow-success/20 transition-all"
                                            >
                                                <FaReceipt /> View Receipt
                                            </button>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    // --- NO DATA FOUND UI ---
                    <div className="col-span-full text-center py-20 bg-base-100 rounded-3xl shadow-sm border border-base-300 max-w-lg mx-auto mt-10">
                        <div className="bg-base-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 text-base-content/30 text-4xl">
                            <FaBriefcase />
                        </div>
                        <p className="text-2xl font-bold text-base-content">No applications yet!</p>
                        <p className="text-base-content/60 mt-2 mb-6">You haven't applied for any loans.</p>
                        <Link to="/all-loans">
                            <button className="btn btn-primary rounded-xl px-8 shadow-lg shadow-primary/30">
                                Apply for a Loan
                            </button>
                        </Link>
                    </div>
                )}
            </div>

            {/* ✅ RECEIPT MODAL (Fully Themed) */}
            {selectedReceipt && (
                <dialog className="modal modal-bottom sm:modal-middle backdrop-blur-sm" open>
                    <div className="modal-box bg-base-100 text-base-content p-0 rounded-none w-11/12 max-w-md border-t-8 border-success transition-colors duration-300 shadow-2xl">
                        
                        {/* Receipt Header */}
                        <div className="bg-base-200 p-6 text-center border-b border-dashed border-base-300">
                            <h3 className="font-bold text-2xl uppercase tracking-widest text-base-content">Payment Receipt</h3>
                            <p className="text-sm text-base-content/70 mt-1">LoanLink Financial Services</p>
                            <div className="mt-4 badge badge-success text-white font-bold px-4 py-3 border-none shadow-sm">PAID SUCCESSFUL</div>
                        </div>
                        
                        {/* Receipt Body */}
                        <div className="p-6 space-y-3 font-mono text-sm">
                            <div className="flex justify-between border-b border-dashed border-base-300 pb-3">
                                <span className="text-base-content/70">Transaction ID:</span>
                                <span className="font-bold break-all text-right max-w-[60%]">{selectedReceipt.transactionId || "N/A"}</span>
                            </div>
                            <div className="flex justify-between border-b border-dashed border-base-300 pb-3 pt-1">
                                <span className="text-base-content/70">Date:</span>
                                <span className="font-bold">{new Date(selectedReceipt.appliedDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between border-b border-dashed border-base-300 pb-3 pt-1">
                                <span className="text-base-content/70">Applicant:</span>
                                <span className="font-bold text-right max-w-[60%]">{selectedReceipt.applicantName}</span>
                            </div>
                            <div className="flex justify-between border-b border-dashed border-base-300 pb-3 pt-1">
                                <span className="text-base-content/70">Loan Type:</span>
                                <span className="font-bold capitalize">{selectedReceipt.loanCategory} Loan</span>
                            </div>
                            <div className="flex justify-between pt-3 items-center">
                                <span className="font-bold text-lg text-base-content">Total Paid:</span>
                                <span className="text-success font-extrabold text-2xl bg-success/10 px-3 py-1 rounded-lg">$10.00</span>
                            </div>
                        </div>

                        {/* Modal Action */}
                        <div className="p-5 bg-base-200 flex gap-4 border-t border-base-300">
                            <button 
                                onClick={() => window.print()} 
                                className="btn btn-neutral flex-1 rounded-xl shadow-md"
                            >
                                <FaPrint /> Print
                            </button>
                            <button 
                                onClick={() => setSelectedReceipt(null)} 
                                className="btn btn-primary flex-1 rounded-xl shadow-md text-white border-none"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setSelectedReceipt(null)}>close</button>
                    </form>
                </dialog>
            )}
        </div>
    );
};

export default MyLoans;