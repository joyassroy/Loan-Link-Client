import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaTrashAlt, FaEye, FaSearch, FaUser, FaPhone, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { useState } from "react";

const LoanApplications = () => {
    const axiosSecure = useAxiosSecure();
    const [search, setSearch] = useState('');
    const [selectedApp, setSelectedApp] = useState(null); // Details Modal এর জন্য State

    // 1. Fetch ALL Applications
    const { data: applications = [], refetch } = useQuery({
        queryKey: ['admin-all-applications'],
        queryFn: async () => {
            const res = await axiosSecure.get('/applications');
            return res.data;
        }
    });

    // 2. Filter Logic
    const filteredApps = applications.filter(app => 
        (app.applicantName?.toLowerCase().includes(search.toLowerCase()) || 
         app.email?.toLowerCase().includes(search.toLowerCase()))
    );

    // 3. Handle Delete (Now Working)
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                // Backend Call
                axiosSecure.delete(`/applications/${id}`)
                    .then(res => {
                        if (res.data.deletedCount > 0) {
                            refetch(); // Table refresh without reload
                            Swal.fire("Deleted!", "Application has been removed.", "success");
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        Swal.fire("Error!", "Could not delete application.", "error");
                    });
            }
        });
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-800">Master Application List</h2>
                    <p className="text-gray-500 text-sm">Total Applications: {filteredApps.length}</p>
                </div>
                
                {/* Search */}
                <div className="relative w-full md:w-72">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search applicant..." 
                        className="input input-bordered w-full pl-10 rounded-full focus:input-primary shadow-sm"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-100">
                <table className="table w-full">
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
                    <tbody>
                        {filteredApps.length > 0 ? (
                            filteredApps.map((app, index) => (
                                <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                                    <th>{index + 1}</th>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar placeholder">
                                                <div className="bg-blue-100 text-blue-600 rounded-full w-10 font-bold">
                                                    <span>{app.applicantName?.slice(0,1).toUpperCase()}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800">{app.applicantName}</div>
                                                <div className="text-xs text-gray-500">{app.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-ghost font-bold text-gray-600 capitalize">
                                            {app.loanCategory}
                                        </span>
                                    </td>
                                    <td className="font-bold text-gray-700">${app.loanAmount}</td>
                                    <td>
                                        <div className={`badge font-bold p-3 text-white border-none ${
                                            app.status === 'approved' ? 'bg-green-500' :
                                            app.status === 'rejected' ? 'bg-red-500' :
                                            'bg-yellow-400 text-black'
                                        }`}>
                                            {app.status}
                                        </div>
                                    </td>
                                    <td className="text-center flex justify-center gap-2">
                                        {/* View Button */}
                                        <button 
                                            onClick={() => setSelectedApp(app)}
                                            className="btn btn-ghost btn-sm text-blue-600 bg-blue-50 hover:bg-blue-100"
                                        >
                                            <FaEye />
                                        </button>
                                        {/* Delete Button */}
                                        <button 
                                            onClick={() => handleDelete(app._id)}
                                            className="btn btn-ghost btn-sm text-red-500 bg-red-50 hover:bg-red-100"
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" className="text-center py-10 text-gray-400">No applications found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- DETAILS MODAL --- */}
            {selectedApp && (
                <dialog className="modal modal-bottom sm:modal-middle backdrop-blur-sm" open>
                    <div className="modal-box bg-white">
                        <h3 className="font-bold text-2xl text-gray-800 border-b pb-3 mb-4">Application Details</h3>
                        
                        <div className="space-y-4">
                            {/* Applicant Info */}
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <FaUser className="mt-1 text-blue-500" />
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Applicant Name</p>
                                    <p className="font-bold text-gray-800">{selectedApp.applicantName}</p>
                                    <p className="text-sm text-gray-500">{selectedApp.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 border rounded-xl">
                                    <div className="flex items-center gap-2 mb-1">
                                        <FaPhone className="text-gray-400 text-xs" />
                                        <span className="text-xs font-bold text-gray-400 uppercase">Phone</span>
                                    </div>
                                    <p className="font-bold text-gray-800">{selectedApp.phone || "N/A"}</p>
                                </div>
                                <div className="p-3 border rounded-xl">
                                    <div className="flex items-center gap-2 mb-1">
                                        <FaCalendarAlt className="text-gray-400 text-xs" />
                                        <span className="text-xs font-bold text-gray-400 uppercase">Date</span>
                                    </div>
                                    <p className="font-bold text-gray-800">{new Date(selectedApp.appliedDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="p-4 border rounded-xl">
                                <div className="flex items-center gap-2 mb-1">
                                    <FaMapMarkerAlt className="text-gray-400 text-xs" />
                                    <span className="text-xs font-bold text-gray-400 uppercase">Address</span>
                                </div>
                                <p className="font-medium text-gray-700">{selectedApp.address || "No address provided"}</p>
                            </div>

                            {/* Loan & Status */}
                            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <div>
                                    <p className="text-xs text-blue-400 font-bold uppercase">Requested Amount</p>
                                    <p className="text-2xl font-extrabold text-blue-600">${selectedApp.loanAmount}</p>
                                </div>
                                <div className={`badge p-3 font-bold text-white border-none ${
                                    selectedApp.status === 'approved' ? 'badge-success' :
                                    selectedApp.status === 'rejected' ? 'badge-error' : 'badge-warning'
                                }`}>
                                    {selectedApp.status.toUpperCase()}
                                </div>
                            </div>
                        </div>

                        <div className="modal-action">
                            <button onClick={() => setSelectedApp(null)} className="btn btn-primary w-full">Close Details</button>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setSelectedApp(null)}>close</button>
                    </form>
                </dialog>
            )}
        </div>
    );
};

export default LoanApplications;