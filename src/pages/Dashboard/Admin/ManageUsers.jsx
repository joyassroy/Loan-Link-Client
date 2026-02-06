import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useState } from "react";

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
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Update Role!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.patch(`/users/admin/${user._id}`, { role: role })
                    .then(res => {
                        if (res.data.modifiedCount > 0) {
                            refetch();
                            Swal.fire("Success", `${user.name} is now a ${role}!`, "success");
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

        // Send reason to backend (backend code handles saving 'reason' if you updated the schema)
        axiosSecure.patch(`/users/admin/${selectedUser._id}`, { role: 'suspended', reason: reason })
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    refetch();
                    document.getElementById('suspend_modal').close();
                    Swal.fire("Suspended", `${selectedUser.name} has been suspended.`, "warning");
                }
            });
    };

    return (
        <div>
            <div className="flex justify-between items-center my-4 p-4 bg-base-100 rounded-lg shadow">
                <h2 className="text-3xl font-bold">Manage Users</h2>
                <h2 className="text-xl font-semibold">Total Users: {users.length}</h2>
            </div>

            <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
                <table className="table w-full">
                    {/* head */}
                    <thead className="bg-gray-200">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Current Role</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id} className="hover">
                                <th>{index + 1}</th>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.role === 'admin' ? <div className="badge badge-primary font-bold">Admin</div> : 
                                     user.role === 'manager' ? <div className="badge badge-secondary font-bold">Manager</div> : 
                                     user.role === 'suspended' ? <div className="badge badge-error font-bold text-white">Suspended</div> : 
                                     <div className="badge badge-ghost">Borrower</div>}
                                </td>
                                <td className="flex justify-center gap-2">
                                    {/* Make Admin Button */}
                                    {user.role !== 'admin' && user.role !== 'suspended' &&
                                        <button 
                                            onClick={() => handleMakeRole(user, 'admin')} 
                                            className="btn btn-xs btn-primary tooltip"
                                            data-tip="Promote to Admin"
                                        >
                                            Admin
                                        </button>}
                                    
                                    {/* Make Manager Button */}
                                    {user.role !== 'manager' && user.role !== 'suspended' &&
                                        <button 
                                            onClick={() => handleMakeRole(user, 'manager')} 
                                            className="btn btn-xs btn-secondary tooltip"
                                            data-tip="Promote to Manager"
                                        >
                                            Manager
                                        </button>}
                                    
                                    {/* Suspend Button (Challenge) */}
                                    {user.role !== 'suspended' && user.role !== 'admin' &&
                                        <button 
                                            onClick={() => { setSelectedUser(user); document.getElementById('suspend_modal').showModal(); }} 
                                            className="btn btn-xs btn-error text-white tooltip"
                                            data-tip="Suspend User"
                                        >
                                            Suspend
                                        </button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Suspend Modal (Challenge Requirement) */}
            <dialog id="suspend_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-error">Suspend User: {selectedUser?.name}</h3>
                    <p className="py-2 text-sm text-gray-500">This action will prevent the user from logging in or applying for loans.</p>
                    
                    <form onSubmit={handleSuspendUser}>
                        <div className="form-control w-full my-4">
                            <label className="label"><span className="label-text font-semibold">Reason for Suspension?</span></label>
                            <textarea 
                                name="reason" 
                                className="textarea textarea-bordered h-24" 
                                placeholder="E.g., Violation of terms, fraudulent activity..." 
                                required
                            ></textarea>
                        </div>
                        <div className="modal-action">
                            <button type="submit" className="btn btn-error text-white">Confirm Suspend</button>
                            <button 
                                type="button" 
                                className="btn" 
                                onClick={() => document.getElementById('suspend_modal').close()}
                            >
                                Cancel
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