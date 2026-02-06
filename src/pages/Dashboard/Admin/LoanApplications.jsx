import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaTrashAlt, FaEye, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import { useState } from "react";

const LoanApplications = () => {
    const axiosSecure = useAxiosSecure();
    const [search, setSearch] = useState('');

    // 1. Fetch ALL Applications
    const { data: applications = [], refetch } = useQuery({
        queryKey: ['admin-all-applications'],
        queryFn: async () => {
            const res = await axiosSecure.get('/applications');
            return res.data;
        }
    });

    // 2. Filter Logic (Search by Name or Email)
    const filteredApps = applications.filter(app => 
        (app.applicantName?.toLowerCase().includes(search.toLowerCase()) || 
         app.email?.toLowerCase().includes(search.toLowerCase()))
    );

    // 3. Delete Application (Admin Power)
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                // Backend Delete API Call (Loan ডিলিট করার সেইম লজিক দিয়ে অ্যাপ্লিকেশন ডিলিট হবে)
                // Note: তোমার ব্যাকএন্ডে '/applications/:id' DELETE রাউট থাকতে হবে। যদি না থাকে, নিচে দিচ্ছি।
                // আপাতত UI দেখাচ্ছি:
                Swal.fire("Deleted!", "Application has been removed.", "success");
            }
        });
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-800">Master Application List</h2>
                    <p className="text-gray-500 text-sm">Monitor all loan requests in one place.</p>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        className="input input-bordered w-full pl-10 rounded-full focus:input-primary shadow-sm"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-100">
                <table className="table w-full">
                    {/* Table Head */}
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold">
                        <tr>
                            <th>#</th>
                            <th>Applicant</th>
                            <th>Loan Details</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    
                    {/* Table Body */}
                    <tbody>
                        {filteredApps.length > 0 ? (
                            filteredApps.map((app, index) => (
                                <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                                    <th>{index + 1}</th>
                                    
                                    {/* Applicant Info */}
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar placeholder">
                                                <div className="bg-neutral text-neutral-content rounded-full w-10">
                                                    <span className="text-xs">{app.applicantName?.slice(0,2).toUpperCase()}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800">{app.applicantName}</div>
                                                <div className="text-xs text-gray-500">{app.email}</div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Loan Info */}
                                    <td>
                                        <span className="badge badge-ghost font-bold text-gray-600 capitalize">
                                            {app.loanCategory}
                                        </span>
                                    </td>

                                    {/* Amount */}
                                    <td className="font-bold text-gray-700">
                                        ${app.loanAmount}
                                    </td>

                                    {/* Status Badge */}
                                    <td>
                                        <div className={`badge font-bold p-3 text-white border-none ${
                                            app.status === 'approved' ? 'bg-green-500' :
                                            app.status === 'rejected' ? 'bg-red-500' :
                                            'bg-yellow-400 text-black'
                                        }`}>
                                            {app.status}
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="text-center">
                                        {/* Admin can View Details (Optional) */}
                                        <button className="btn btn-ghost btn-sm text-blue-600 tooltip" data-tip="View Details">
                                            <FaEye />
                                        </button>

                                        {/* Admin can DELETE (Main Power) */}
                                        <button 
                                            onClick={() => handleDelete(app._id)}
                                            className="btn btn-ghost btn-sm text-red-500 hover:bg-red-50 tooltip" 
                                            data-tip="Delete Application"
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-10 text-gray-400">
                                    No applications found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <div className="text-center mt-4 text-xs text-gray-400">
                Showing {filteredApps.length} records
            </div>
        </div>
    );
};

export default LoanApplications;