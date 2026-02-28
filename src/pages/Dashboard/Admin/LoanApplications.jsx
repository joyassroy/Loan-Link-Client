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

    // 3. Handle Delete (With Dark Mode SweetAlert)
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            background: "inherit",
            color: "inherit",
            customClass: {
                popup: "bg-base-100 text-base-content border border-base-300 rounded-3xl shadow-2xl",
                confirmButton: "btn btn-error text-white",
                cancelButton: "btn btn-primary"
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Backend Call
                axiosSecure.delete(`/applications/${id}`)
                    .then(res => {
                        if (res.data.deletedCount > 0) {
                            refetch(); // Table refresh without reload
                            Swal.fire({
                                title: "Deleted!", 
                                text: "Application has been removed.", 
                                icon: "success",
                                background: "inherit",
                                color: "inherit",
                                customClass: { popup: "bg-base-100 text-base-content border border-base-300 rounded-3xl" }
                            });
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        Swal.fire({
                            title: "Error!", 
                            text: "Could not delete application.", 
                            icon: "error",
                            background: "inherit",
                            color: "inherit",
                            customClass: { popup: "bg-base-100 text-base-content border border-base-300 rounded-3xl" }
                        });
                    });
            }
        });
    };

    return (
        <div className="p-6 bg-base-200 min-h-screen font-sans transition-colors duration-300 pb-20">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-base-content">Master Application List</h2>
                    <p className="text-base-content/60 text-sm mt-1 font-medium">Total Applications: {filteredApps.length}</p>
                </div>
                
                {/* Search */}
                <div className="relative w-full md:w-72">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
                    <input 
                        type="text" 
                        placeholder="Search applicant..." 
                        className="input input-bordered w-full pl-12 rounded-full focus:ring-2 ring-primary/20 bg-base-100 text-base-content shadow-sm transition-colors"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-xl border border-base-300 transition-colors">
                <table className="table w-full">
                    <thead className="bg-base-200 text-base-content/70 uppercase text-xs font-bold border-b border-base-300">
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
                                <tr key={app._id} className="hover:bg-base-200/50 transition-colors border-b border-base-300/50">
                                    <th className="text-base-content/70">{index + 1}</th>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar placeholder">
                                                <div className="bg-primary/20 text-primary rounded-full w-10 font-bold flex items-center justify-center">
                                                    <span>{app.applicantName?.slice(0,1).toUpperCase()}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold text-base-content">{app.applicantName}</div>
                                                <div className="text-xs text-base-content/50">{app.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-ghost font-bold text-base-content/80 capitalize border-base-300">
                                            {app.loanCategory}
                                        </span>
                                    </td>
                                    <td className="font-bold text-base-content">${app.loanAmount}</td>
                                    <td>
                                        <div className={`badge font-bold p-3 text-white border-none shadow-sm ${
                                            app.status === 'approved' ? 'bg-success' :
                                            app.status === 'rejected' ? 'bg-error' :
                                            'bg-warning text-warning-content'
                                        }`}>
                                            {app.status}
                                        </div>
                                    </td>
                                    <td className="text-center flex justify-center gap-2">
                                        {/* View Button */}
                                        <button 
                                            onClick={() => setSelectedApp(app)}
                                            className="btn btn-ghost btn-sm text-info bg-info/10 hover:bg-info/20 hover:text-info rounded-lg transition-colors"
                                        >
                                            <FaEye />
                                        </button>
                                        {/* Delete Button */}
                                        <button 
                                            onClick={() => handleDelete(app._id)}
                                            className="btn btn-ghost btn-sm text-error bg-error/10 hover:bg-error/20 hover:text-error rounded-lg transition-colors"
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" className="text-center py-10 text-base-content/40 font-medium">No applications found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- DETAILS MODAL --- */}
            {selectedApp && (
                <dialog className="modal modal-bottom sm:modal-middle backdrop-blur-sm" open>
                    <div className="modal-box bg-base-100 border border-base-300 text-base-content shadow-2xl transition-colors">
                        <h3 className="font-bold text-2xl text-base-content border-b border-base-300 pb-3 mb-4">Application Details</h3>
                        
                        <div className="space-y-4">
                            {/* Applicant Info */}
                            <div className="flex items-start gap-4 p-4 bg-base-200 rounded-xl border border-base-300">
                                <FaUser className="mt-1 text-primary" />
                                <div>
                                    <p className="text-xs text-base-content/50 uppercase font-bold tracking-wider">Applicant Name</p>
                                    <p className="font-bold text-base-content mt-1">{selectedApp.applicantName}</p>
                                    <p className="text-sm text-base-content/60">{selectedApp.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 border border-base-300 rounded-xl bg-base-200/50">
                                    <div className="flex items-center gap-2 mb-1">
                                        <FaPhone className="text-base-content/40 text-xs" />
                                        <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider">Phone</span>
                                    </div>
                                    <p className="font-bold text-base-content">{selectedApp.phone || "N/A"}</p>
                                </div>
                                <div className="p-3 border border-base-300 rounded-xl bg-base-200/50">
                                    <div className="flex items-center gap-2 mb-1">
                                        <FaCalendarAlt className="text-base-content/40 text-xs" />
                                        <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider">Date</span>
                                    </div>
                                    <p className="font-bold text-base-content">{new Date(selectedApp.appliedDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="p-4 border border-base-300 rounded-xl bg-base-200/50">
                                <div className="flex items-center gap-2 mb-1">
                                    <FaMapMarkerAlt className="text-base-content/40 text-xs" />
                                    <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider">Address</span>
                                </div>
                                <p className="font-medium text-base-content/80 mt-1">{selectedApp.address || "No address provided"}</p>
                            </div>

                            {/* Loan & Status */}
                            <div className="flex justify-between items-center p-4 bg-primary/10 rounded-xl border border-primary/20 transition-colors">
                                <div>
                                    <p className="text-xs text-primary/70 font-bold uppercase tracking-wider">Requested Amount</p>
                                    <p className="text-2xl font-extrabold text-primary">${selectedApp.loanAmount}</p>
                                </div>
                                <div className={`badge p-3 font-bold text-white border-none shadow-sm ${
                                    selectedApp.status === 'approved' ? 'badge-success' :
                                    selectedApp.status === 'rejected' ? 'badge-error' : 'badge-warning text-warning-content'
                                }`}>
                                    {selectedApp.status.toUpperCase()}
                                </div>
                            </div>
                        </div>

                        <div className="modal-action border-t border-base-300 pt-4 mt-6">
                            <button onClick={() => setSelectedApp(null)} className="btn btn-primary w-full text-white rounded-xl shadow-lg">Close Details</button>
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