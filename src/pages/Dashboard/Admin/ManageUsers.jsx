import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useState } from "react";
import { FaUserShield, FaUserTie, FaBan, FaUsersCog } from "react-icons/fa";

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();
    const [selectedUser, setSelectedUser] = useState(null); // For Suspend Modal

    // Fetch all users
    const { data: users = [], refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        }
    });

    // Handle Make Admin/Manager
    const handleMakeRole = (user, role) => {
        Swal.fire({
            title: `Make ${user.name} a ${role}?`,
            text: "They will gain higher privileges.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Update Role!",
            background: "inherit",
            color: "inherit",
            customClass: {
                popup: "bg-base-100 text-base-content border border-base-300 rounded-3xl shadow-2xl",
                confirmButton: "btn btn-primary text-white",
                cancelButton: "btn btn-error text-white"
            }
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.patch(`/users/admin/${user._id}`, { role: role })
                    .then(res => {
                        if (res.data.modifiedCount > 0) {
                            refetch();
                            Swal.fire({
                                title: "Success", 
                                text: `${user.name} is now a ${role}!`, 
                                icon: "success",
                                background: "inherit",
                                color: "inherit",
                                customClass: { popup: "bg-base-100 text-base-content border border-base-300 rounded-3xl" }
                            });
                        }
                    });
            }
        });
    };

    // Handle Suspend (Challenge Requirement)
    const handleSuspendUser = async (event) => {
        event.preventDefault();
        const form = event.target;
        const reason = form.reason.value;

        // Send reason to backend
        axiosSecure.patch(`/users/admin/${selectedUser._id}`, { role: 'suspended', reason: reason })
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    refetch();
                    document.getElementById('suspend_modal').close();
                    Swal.fire({
                        title: "Suspended", 
                        text: `${selectedUser.name} has been suspended.`, 
                        icon: "warning",
                        background: "inherit",
                        color: "inherit",
                        customClass: { popup: "bg-base-100 text-base-content border border-base-300 rounded-3xl" }
                    });
                }
            });
    };

    return (
        <div className="p-6 bg-base-200 min-h-screen font-sans transition-colors duration-300 pb-20">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-base-content flex items-center gap-3">
                        <FaUsersCog className="text-primary" /> Manage Users
                    </h2>
                    <p className="text-base-content/60 text-sm mt-1 font-medium">Control roles and access permissions</p>
                </div>
                <div className="bg-base-100 px-6 py-3 rounded-2xl shadow-sm border border-base-300 font-bold text-base-content transition-colors">
                    Total Users: <span className="text-primary text-xl ml-2">{users.length}</span>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-xl border border-base-300 transition-colors">
                <table className="table w-full">
                    {/* head */}
                    <thead className="bg-base-200 text-base-content/70 uppercase text-xs font-bold border-b border-base-300">
                        <tr>
                            <th>#</th>
                            <th>User Info</th>
                            <th>Current Role</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id} className="hover:bg-base-200/50 transition-colors border-b border-base-300/50">
                                <th className="text-base-content/70">{index + 1}</th>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar placeholder">
                                            <div className="bg-primary/20 text-primary rounded-full w-10 font-bold flex items-center justify-center">
                                                <span>{user.name?.slice(0,1).toUpperCase()}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-base-content">{user.name}</div>
                                            <div className="text-xs text-base-content/50">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    {user.role === 'admin' ? <div className="badge badge-primary font-bold shadow-sm border-none gap-1"><FaUserShield/> Admin</div> : 
                                     user.role === 'manager' ? <div className="badge badge-secondary font-bold shadow-sm border-none gap-1"><FaUserTie/> Manager</div> : 
                                     user.role === 'suspended' ? <div className="badge badge-error font-bold text-white shadow-sm border-none gap-1"><FaBan/> Suspended</div> : 
                                     <div className="badge badge-ghost font-bold text-base-content/80 border-base-300">Borrower</div>}
                                </td>
                                <td className="text-center">
                                    <div className="flex justify-center gap-2 flex-wrap">
                                        {/* Make Admin Button */}
                                        {user.role !== 'admin' && user.role !== 'suspended' &&
                                            <button 
                                                onClick={() => handleMakeRole(user, 'admin')} 
                                                className="btn btn-sm btn-ghost text-primary bg-primary/10 hover:bg-primary/20 rounded-lg tooltip"
                                                data-tip="Promote to Admin"
                                            >
                                                Admin
                                            </button>}
                                        
                                        {/* Make Manager Button */}
                                        {user.role !== 'manager' && user.role !== 'suspended' &&
                                            <button 
                                                onClick={() => handleMakeRole(user, 'manager')} 
                                                className="btn btn-sm btn-ghost text-secondary bg-secondary/10 hover:bg-secondary/20 rounded-lg tooltip"
                                                data-tip="Promote to Manager"
                                            >
                                                Manager
                                            </button>}
                                        
                                        {/* Suspend Button (Challenge) */}
                                        {user.role !== 'suspended' && user.role !== 'admin' &&
                                            <button 
                                                onClick={() => { setSelectedUser(user); document.getElementById('suspend_modal').showModal(); }} 
                                                className="btn btn-sm btn-ghost text-error bg-error/10 hover:bg-error/20 rounded-lg tooltip"
                                                data-tip="Suspend User"
                                            >
                                                <FaBan />
                                            </button>}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- SUSPEND MODAL (Challenge Requirement) --- */}
            <dialog id="suspend_modal" className="modal modal-bottom sm:modal-middle backdrop-blur-sm">
                <div className="modal-box bg-base-100 border border-base-300 text-base-content shadow-2xl transition-colors">
                    <h3 className="font-bold text-2xl text-error flex items-center gap-2 border-b border-base-300 pb-3 mb-4">
                        <FaBan /> Suspend User
                    </h3>
                    
                    <div className="bg-base-200 p-4 rounded-xl border border-base-300 mb-4">
                        <p className="font-bold text-base-content">Target: <span className="text-primary">{selectedUser?.name}</span></p>
                        <p className="text-sm text-base-content/60 mt-1">This action will prevent the user from logging in or applying for loans.</p>
                    </div>
                    
                    <form onSubmit={handleSuspendUser}>
                        <div className="form-control w-full my-4">
                            <label className="label">
                                <span className="label-text font-bold text-base-content">Reason for Suspension? <span className="text-error">*</span></span>
                            </label>
                            <textarea 
                                name="reason" 
                                className="textarea textarea-bordered h-24 bg-base-200 focus:bg-base-100 focus:border-error focus:ring-2 ring-error/20 text-base-content rounded-xl transition-all" 
                                placeholder="E.g., Violation of terms, fraudulent activity..." 
                                required
                            ></textarea>
                        </div>
                        <div className="modal-action border-t border-base-300 pt-4 mt-6">
                            <button 
                                type="button" 
                                className="btn btn-ghost text-base-content rounded-xl" 
                                onClick={() => document.getElementById('suspend_modal').close()}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-error text-white rounded-xl shadow-lg shadow-error/30">
                                Confirm Suspend
                            </button>
                        </div>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default ManageUsers;