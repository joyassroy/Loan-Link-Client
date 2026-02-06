import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";
import { useState } from "react"; // 1. useState import korlam

const MyLoans = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [selectedPayment, setSelectedPayment] = useState(null); // 2. Modal data rakhar jonne state

    const { data: loans = [], isLoading } = useQuery({
        queryKey: ['my-loans', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/applications/my-application?email=${user.email}`);
            return res.data;
        }
    });

    if (isLoading) {
        return <div className="text-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    return (
        <div className="w-full p-5">
            <h2 className="text-3xl font-bold mb-6 text-center text-primary">My Loan History</h2>
            
            <div className="overflow-x-auto bg-base-100 shadow-xl rounded-xl border">
                <table className="table w-full">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                        <tr>
                            <th>#</th>
                            <th>Loan Category</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Payment</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map((loan, index) => (
                            <tr key={loan._id} className="hover">
                                <th>{index + 1}</th>
                                <td className="font-bold">{loan.loanCategory}</td>
                                <td>${loan.loanAmount}</td>
                                
                                <td>
                                    <div className={`badge ${
                                        loan.status === 'approved' ? 'badge-success text-white' : 
                                        loan.status === 'rejected' ? 'badge-error text-white' : 'badge-warning text-white'
                                    }`}>
                                        {loan.status}
                                    </div>
                                </td>

                                {/* --- 3. Payment Status & Challenge Logic --- */}
                                <td>
                                    {loan.paymentStatus === 'paid' ? (
                                        // Paid hole Modal open korbe
                                        <button 
                                            onClick={() => setSelectedPayment(loan)}
                                            className="btn btn-sm btn-outline btn-success font-bold"
                                        >
                                            Paid ✅
                                        </button>
                                    ) : (
                                        <span className="text-red-400 font-bold">Unpaid</span>
                                    )}
                                </td>

                                <td>
                                    {loan.paymentStatus === 'paid' ? (
                                        <button className="btn btn-sm btn-disabled">Paid</button>
                                    ) : loan.status === 'rejected' ? (
                                        <button className="btn btn-sm btn-disabled">Rejected</button>
                                    ) : (
                                        <Link to={`/dashboard/payment/${loan._id}`}>
                                            <button className="btn btn-sm btn-primary text-white">
                                                Pay Now
                                            </button>
                                        </Link>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {loans.length === 0 && (
                <div className="text-center mt-10 text-gray-500">
                    <p>No loan applications found.</p>
                </div>
            )}

            {/* --- 4. Payment Details Modal (Challenge Part) --- */}
            {selectedPayment && (
                <dialog className="modal modal-bottom sm:modal-middle" open>
                    <div className="modal-box">
                        <h3 className="font-bold text-lg text-success mb-4">Payment Successful! 🎉</h3>
                        
                        <div className="space-y-2">
                            <p><strong>Transaction ID:</strong> <span className="text-gray-600">{selectedPayment.transactionId}</span></p>
                            <p><strong>Loan ID:</strong> <span className="text-gray-600">{selectedPayment._id}</span></p>
                            <p><strong>Amount Paid:</strong> <span className="text-gray-600">${selectedPayment.price || 10}</span></p>
                            <p><strong>Email:</strong> <span className="text-gray-600">{selectedPayment.email}</span></p>
                            <p><strong>Date:</strong> <span className="text-gray-600">{new Date(selectedPayment.date).toLocaleDateString()}</span></p>
                        </div>

                        <div className="modal-action">
                            <button 
                                onClick={() => setSelectedPayment(null)} 
                                className="btn btn-primary"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                    {/* Backdrop click to close */}
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setSelectedPayment(null)}>close</button>
                    </form>
                </dialog>
            )}
        </div>
    );
};

export default MyLoans;