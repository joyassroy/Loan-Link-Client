import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";
import { useState } from "react"; // ✅ useState আনা হয়েছে মডালের জন্য
import { FaBriefcase, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaCreditCard, FaFileInvoiceDollar, FaReceipt, FaPrint } from "react-icons/fa";

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

    if (isLoading) {
        return <div className="flex justify-center mt-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    }

    return (
        <div className="w-full p-5 min-h-screen bg-gray-50/50">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-gray-800">My Applications</h2>
                <p className="text-gray-500 mt-2">Manage your applications & receipts</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loans.length > 0 ? (
                    loans.map((loan) => (
                        <div key={loan._id} className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                            <div className="card-body p-6">
                                
                                {/* Header */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                                        <FaBriefcase size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-700 capitalize">{loan.loanCategory}</h3>
                                        <p className="text-xs text-gray-400 font-mono">ID: {loan._id.slice(-6)}</p>
                                    </div>
                                </div>

                                <div className="divider my-2"></div>

                                {/* Details */}
                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium text-sm">Requested Amount</span>
                                        <span className="font-bold text-gray-800 text-lg">${loan.loanAmount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium text-sm">Application Date</span>
                                        <span className="font-bold text-gray-600">{new Date(loan.appliedDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 font-medium text-sm">Application Fee</span>
                                        <span className="badge badge-warning font-bold text-xs">$10.00</span>
                                    </div>
                                </div>

                                {/* Actions Logic */}
                                <div className="card-actions justify-end mt-auto">
                                    
                                    {loan.paymentStatus !== 'paid' ? (
                                        // Unpaid State
                                        <div className="w-full text-center">
                                            <p className="text-xs text-red-400 mb-2 font-bold">⚠️ Fee required</p>
                                            <Link to={`/dashboard/payment/${loan._id}`} className="w-full">
                                                <button className="btn btn-primary w-full text-white shadow-lg animate-pulse hover:animate-none">
                                                    <FaCreditCard /> Pay $10 Fee
                                                </button>
                                            </Link>
                                        </div>
                                    ) : (
                                        // Paid State
                                        <div className="w-full space-y-3">
                                            
                                            {/* ✅ View Receipt Button */}
                                            <button 
                                                onClick={() => setSelectedReceipt(loan)}
                                                className="btn btn-outline btn-success w-full font-bold gap-2"
                                            >
                                                <FaReceipt /> View Receipt
                                            </button>

                                            {/* Status Badge */}
                                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border">
                                                <span className="text-sm font-bold text-gray-500">Status:</span>
                                                {loan.status === 'approved' && <div className="badge badge-success text-white gap-1"><FaCheckCircle /> Approved</div>}
                                                {loan.status === 'rejected' && <div className="badge badge-error text-white gap-1"><FaTimesCircle /> Rejected</div>}
                                                {loan.status === 'pending' && <div className="badge badge-warning text-white gap-1"><FaHourglassHalf /> Pending</div>}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 bg-white rounded-2xl shadow-sm">
                        <p className="text-2xl font-bold text-gray-400">No applications found.</p>
                        <Link to="/all-loans" className="btn btn-link mt-2">Apply for a Loan</Link>
                    </div>
                )}
            </div>

            {/* ✅ RECEIPT MODAL (এটি রিসিপ্ট দেখাবে) */}
            {selectedReceipt && (
                <dialog className="modal modal-bottom sm:modal-middle backdrop-blur-sm" open>
                    <div className="modal-box bg-white p-0 rounded-none w-11/12 max-w-md border-t-8 border-success">
                        
                        {/* Receipt Header */}
                        <div className="bg-gray-100 p-6 text-center border-b border-dashed border-gray-300">
                            <h3 className="font-bold text-2xl text-gray-800 uppercase tracking-widest">Payment Receipt</h3>
                            <p className="text-sm text-gray-500 mt-1">LoanLink Financial Services</p>
                            <div className="mt-4 badge badge-success text-white font-bold px-4 py-3">PAID SUCCESSFUL</div>
                        </div>
                        
                        {/* Receipt Body */}
                        <div className="p-6 space-y-3 font-mono text-sm">
                            <div className="flex justify-between border-b border-dashed pb-2">
                                <span className="text-gray-500">Transaction ID:</span>
                                <span className="font-bold text-gray-800 break-all">{selectedReceipt.transactionId || "N/A"}</span>
                            </div>
                            <div className="flex justify-between border-b border-dashed pb-2">
                                <span className="text-gray-500">Date:</span>
                                <span className="font-bold text-gray-800">{new Date(selectedReceipt.appliedDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between border-b border-dashed pb-2">
                                <span className="text-gray-500">Applicant:</span>
                                <span className="font-bold text-gray-800">{selectedReceipt.applicantName}</span>
                            </div>
                            <div className="flex justify-between border-b border-dashed pb-2">
                                <span className="text-gray-500">Loan Type:</span>
                                <span className="font-bold text-gray-800 capitalize">{selectedReceipt.loanCategory} Loan</span>
                            </div>
                            <div className="flex justify-between pt-2">
                                <span className="text-gray-800 font-bold text-lg">Total Paid:</span>
                                <span className="text-success font-bold text-xl">$10.00</span>
                            </div>
                        </div>

                        {/* Modal Action */}
                        <div className="p-4 bg-gray-50 flex gap-3">
                            <button 
                                onClick={() => window.print()} 
                                className="btn btn-neutral flex-1"
                            >
                                <FaPrint /> Print
                            </button>
                            <button 
                                onClick={() => setSelectedReceipt(null)} 
                                className="btn btn-primary flex-1"
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