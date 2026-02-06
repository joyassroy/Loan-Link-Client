import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

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
            confirmButtonText: `Yes, ${newStatus} it!`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.patch(`/applications/status/${id}`, { status: newStatus });
                    if (res.data.modifiedCount > 0) {
                        refetch();
                        Swal.fire("Success", `Application has been ${newStatus}.`, "success");
                    }
                } catch (error) {
                    Swal.fire("Error", "Something went wrong!", "error");
                }
            }
        });
    };

    return (
        <div className="w-full p-4">
            <h2 className="text-3xl font-bold mb-6 text-center">Pending Loan Applications</h2>
            
            <div className="overflow-x-auto shadow-lg rounded-lg border">
                <table className="table w-full">
                    {/* Head */}
                    <thead className="bg-gray-100">
                        <tr>
                            <th>#</th>
                            <th>Applicant Info</th>
                            <th>Loan Details</th>
                            <th>Amount</th>
                            <th>Fee Status</th> {/* New Column */}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {/* Body */}
                    <tbody>
                        {applications.map((app, index) => (
                            <tr key={app._id} className="hover:bg-base-50">
                                <th>{index + 1}</th>
                                <td>
                                    <div className="font-bold">{app.applicantName}</div>
                                    <div className="text-sm opacity-50">{app.email}</div>
                                </td>
                                <td>
                                    {app.loanTitle} <br/>
                                    <span className="badge badge-ghost badge-sm">{app.loanCategory}</span>
                                </td>
                                <td className="font-semibold">${app.loanAmount}</td>
                                
                                {/* Payment Status Badge */}
                                <td>
                                    {app.paymentStatus === 'paid' ? (
                                        <span className="badge badge-success text-white">Paid ✅</span>
                                    ) : (
                                        <span className="badge badge-error text-white">Unpaid ❌</span>
                                    )}
                                </td>

                                {/* Actions with Logic */}
                                <td className="flex gap-2 items-center">
                                    {/* Approve Button Logic */}
                                    {app.paymentStatus === 'paid' ? (
                                        <button 
                                            onClick={() => handleStatus(app._id, 'approved')} 
                                            className="btn btn-success btn-sm text-white"
                                            title="Approve Loan"
                                        >
                                            Approve
                                        </button>
                                    ) : (
                                        <div className="tooltip" data-tip="Fee not paid yet">
                                            <button 
                                                disabled 
                                                className="btn btn-success btn-sm text-white opacity-50 cursor-not-allowed"
                                            >
                                                Approve
                                            </button>
                                        </div>
                                    )}

                                    {/* Reject Button (Always Enabled) */}
                                    <button 
                                        onClick={() => handleStatus(app._id, 'rejected')} 
                                        className="btn btn-error btn-sm text-white"
                                        title="Reject Loan"
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {applications.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-10 text-gray-500">
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