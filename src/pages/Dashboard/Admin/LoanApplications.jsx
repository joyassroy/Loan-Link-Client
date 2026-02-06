import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";

const LoanApplications = () => {
    const axiosSecure = useAxiosSecure();
    const [filter, setFilter] = useState(''); // '' means all

    const { data: applications = [] } = useQuery({
        queryKey: ['admin-applications'],
        queryFn: async () => {
            const res = await axiosSecure.get('/applications'); // We need to create this endpoint
            return res.data;
        }
    });

    // Client-side filtering
    const filteredApps = filter 
        ? applications.filter(app => app.status === filter) 
        : applications;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">All Applications</h2>
                
                {/* Filter Dropdown */}
                <select 
                    onChange={(e) => setFilter(e.target.value)} 
                    className="select select-bordered w-full max-w-xs"
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            <div className="overflow-x-auto bg-base-100 shadow rounded-lg">
                <table className="table">
                    <thead className="bg-gray-200">
                        <tr>
                            <th>#</th>
                            <th>Applicant</th>
                            <th>Loan Category</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Payment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApps.map((app, index) => (
                            <tr key={app._id}>
                                <th>{index + 1}</th>
                                <td>
                                    <div className="font-bold">{app.applicantName}</div>
                                    <div className="text-xs opacity-50">{app.email}</div>
                                </td>
                                <td>{app.loanCategory}</td>
                                <td>${app.loanAmount}</td>
                                <td>
                                    <div className={`badge ${
                                        app.status === 'approved' ? 'badge-success' : 
                                        app.status === 'rejected' ? 'badge-error' : 'badge-warning'
                                    } gap-2`}>
                                        {app.status}
                                    </div>
                                </td>
                                <td>
                                    {app.paymentStatus === 'paid' 
                                        ? <span className="text-green-600 font-bold">Paid</span> 
                                        : <span className="text-red-400">Unpaid</span>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LoanApplications;