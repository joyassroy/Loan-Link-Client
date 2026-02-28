import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaMoneyCheckAlt, FaUserClock } from "react-icons/fa";

const PendingLoans = () => {
    const axiosSecure = useAxiosSecure();

    const { data: applications = [], refetch } = useQuery({
        queryKey: ['pending-applications'],
        queryFn: async () => {
            const res = await axiosSecure.get('/applications/pending');
            return res.data;
        }
    });

    const handleStatus = (id, newStatus) => {
        Swal.fire({
            title: `Are you sure you want to ${newStatus}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Yes, ${newStatus} it!`,
            background: "inherit",
            color: "inherit",
            customClass: {
                popup: "bg-base-100 text-base-content border border-base-300 rounded-3xl shadow-2xl",
                confirmButton: "btn btn-primary text-white",
                cancelButton: "btn btn-error text-white"
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.patch(`/applications/status/${id}`, { status: newStatus });
                    if (res.data.modifiedCount > 0) {
                        refetch();
                        Swal.fire({
                            title: "Success", 
                            text: `Application has been ${newStatus}.`, 
                            icon: "success",
                            background: "inherit",
                            color: "inherit",
                            customClass: { popup: "bg-base-100 text-base-content border border-base-300 rounded-3xl" }
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        title: "Error", 
                        text: "Something went wrong!", 
                        icon: "error",
                        background: "inherit",
                        color: "inherit",
                        customClass: { popup: "bg-base-100 text-base-content border border-base-300 rounded-3xl" }
                    });
                }
            }
        });
    };

    return (
        <div className="w-full p-6 bg-base-200 min-h-screen transition-colors duration-300 pb-20">
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-base-content flex items-center gap-3">
                    <FaUserClock className="text-primary" /> Pending Loan Applications
                </h2>
                <p className="text-base-content/60 mt-2 font-medium">Review and process new loan requests</p>
            </div>
            
            <div className="overflow-x-auto shadow-xl rounded-2xl border border-base-300 bg-base-100">
                <table className="table w-full">
                    <thead className="bg-base-200 text-base-content/70 uppercase text-xs font-bold border-b border-base-300">
                        <tr>
                            <th>#</th>
                            <th>Applicant Info</th>
                            <th>Loan Details</th>
                            <th>Amount</th>
                            <th>Fee Status</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app, index) => (
                            <tr key={app._id} className="hover:bg-base-200/50 transition-colors border-b border-base-300/50">
                                <th className="text-base-content/70">{index + 1}</th>
                                <td>
                                    <div className="font-bold text-base-content">{app.applicantName}</div>
                                    <div className="text-sm text-base-content/50">{app.email}</div>
                                </td>
                                <td>
                                    <div className="font-bold text-base-content">{app.loanTitle}</div>
                                    <span className="badge badge-ghost badge-sm border-base-300 text-base-content/70 mt-1">{app.loanCategory}</span>
                                </td>
                                <td className="font-bold text-base-content">${app.loanAmount}</td>
                                
                                {/* Payment Status Badge */}
                                <td>
                                    {app.paymentStatus === 'paid' ? (
                                        <span className="badge badge-success text-white border-none gap-1 font-bold shadow-sm"><FaCheckCircle /> Paid</span>
                                    ) : (
                                        <span className="badge badge-error text-white border-none gap-1 font-bold shadow-sm"><FaTimesCircle /> Unpaid</span>
                                    )}
                                </td>

                                {/* Actions */}
                                <td className="flex gap-2 items-center justify-center">
                                    {app.paymentStatus === 'paid' ? (
                                        <button 
                                            onClick={() => handleStatus(app._id, 'approved')} 
                                            className="btn btn-success btn-sm text-white border-none shadow-sm"
                                            title="Approve Loan"
                                        >
                                            Approve
                                        </button>
                                    ) : (
                                        <div className="tooltip" data-tip="Fee not paid yet">
                                            <button 
                                                disabled 
                                                className="btn btn-success btn-sm text-white opacity-50 cursor-not-allowed border-none"
                                            >
                                                Approve
                                            </button>
                                        </div>
                                    )}

                                    <button 
                                        onClick={() => handleStatus(app._id, 'rejected')} 
                                        className="btn btn-error btn-sm text-white border-none shadow-sm"
                                        title="Reject Loan"
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {applications.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-10 text-base-content/40 font-bold">
                                    No pending applications found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PendingLoans;