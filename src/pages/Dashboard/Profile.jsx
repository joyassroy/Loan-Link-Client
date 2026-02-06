import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { 
    FaUser, FaEnvelope, FaIdBadge, FaFingerprint, FaSignOutAlt, 
    FaEdit, FaCopy, FaCamera, FaLink, FaUserEdit, FaSave, FaTimes 
} from "react-icons/fa";
import Swal from "sweetalert2";

const Profile = () => {
    const { user, logOut, updateUserProfile } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    // Live Preview State
    const [nameInput, setNameInput] = useState(user?.displayName || "");
    const [photoInput, setPhotoInput] = useState(user?.photoURL || "");

    // 1. Fetch User Role & Info
    const { data: dbUser = {}, refetch } = useQuery({
        queryKey: ['user-profile', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/role/${user.email}`);
            return res.data;
        }
    });

    const role = dbUser?.role || 'borrower';

    // Update state when modal opens
    useEffect(() => {
        if(isEditModalOpen) {
            setNameInput(user?.displayName);
            setPhotoInput(user?.photoURL);
        }
    }, [isEditModalOpen, user]);

    // Role Colors
    const getRoleColor = (role) => {
        switch(role.toLowerCase()) {
            case 'admin': return 'badge-error'; 
            case 'manager': return 'badge-primary'; 
            default: return 'badge-accent'; 
        }
    };

    const handleCopyId = () => {
        navigator.clipboard.writeText(user?.uid || "N/A");
        Swal.fire({
            icon: 'success', title: 'Copied!', toast: true,
            position: 'top-end', showConfirmButton: false, timer: 1500
        });
    };

    const handleLogout = () => {
        logOut().then(() => {});
    };

    // --- HANDLE UPDATE PROFILE ---
    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        try {
            // 1. Update in Firebase
            await updateUserProfile(nameInput, photoInput);

            // 2. Update in Database
            const res = await axiosSecure.patch(`/users/update/${user.email}`, {
                name: nameInput,
                photoURL: photoInput
            });

            if (res.data.modifiedCount > 0 || res.data.matchedCount > 0) {
                refetch();
                setIsEditModalOpen(false);
                Swal.fire({
                    title: "Updated!",
                    text: "Profile updated successfully.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => window.location.reload());
            }
        } catch (error) {
            Swal.fire("Error", "Could not update profile", "error");
        }
    };

    return (
        <div className="w-full min-h-[85vh] flex items-center justify-center bg-base-200 p-4 font-sans">
            
            {/* --- Main Profile Card --- */}
            <div className="card w-full max-w-3xl bg-base-100 shadow-2xl overflow-hidden rounded-3xl border border-white/50">
                
                {/* Header Gradient */}
                <div className="h-48 bg-gradient-to-br from-primary via-purple-600 to-secondary relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="absolute top-6 right-6 text-white/20 text-8xl transform rotate-12">
                        <FaUser />
                    </div>
                </div>

                <div className="card-body pt-0 relative px-6 md:px-10">
                    
                    {/* Floating Avatar */}
                    <div className="flex justify-center -mt-24 mb-6">
                        <div className="relative">
                            <div className="avatar online placeholder ring-4 ring-white ring-offset-2 ring-offset-base-100 rounded-full shadow-2xl">
                                <div className="w-44 rounded-full bg-neutral text-neutral-content overflow-hidden">
                                    {user?.photoURL ? (
                                        <img src={user.photoURL} alt="profile" className="object-cover w-full h-full hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <span className="text-6xl font-bold">{user?.displayName?.charAt(0)}</span>
                                    )}
                                </div>
                            </div>
                            {/* Edit Button on Avatar */}
                            <button 
                                onClick={() => setIsEditModalOpen(true)}
                                className="absolute bottom-2 right-2 btn btn-circle btn-primary btn-sm border-2 border-white shadow-lg hover:scale-110 transition-transform"
                                title="Edit Photo"
                            >
                                <FaCamera />
                            </button>
                        </div>
                    </div>

                    {/* User Info Section */}
                    <div className="text-center space-y-3 mb-8">
                        <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">
                            {user?.displayName}
                        </h2>
                        
                        <div className="flex justify-center items-center gap-3">
                            <span className={`badge ${getRoleColor(role)} badge-lg uppercase font-bold text-white px-4 py-3 border-none shadow-sm`}>
                                {role}
                            </span>
                            <span className="badge badge-ghost badge-lg gap-2 px-4 py-3">
                                <FaEnvelope className="text-gray-400" /> {user?.email}
                            </span>
                        </div>
                    </div>

                    {/* Stats/Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                        {/* User ID Card */}
                        <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                    <FaFingerprint size={22} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">User ID</p>
                                    <p className="text-sm font-mono font-bold text-gray-700 truncate w-32">{user?.uid}</p>
                                </div>
                            </div>
                            <button onClick={handleCopyId} className="btn btn-ghost btn-circle btn-sm text-gray-400 group-hover:text-primary tooltip tooltip-left" data-tip="Copy ID">
                                <FaCopy />
                            </button>
                        </div>

                        {/* Status Card */}
                        <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                                    <FaIdBadge size={22} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Account Status</p>
                                    <p className="text-sm font-bold text-success flex items-center gap-1">Verified <span className="text-xs">✅</span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 border-t border-gray-100 pt-8">
                        <button 
                            onClick={() => setIsEditModalOpen(true)}
                            className="btn btn-primary btn-wide rounded-full shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
                        >
                            <FaEdit /> Edit Profile
                        </button>
                        
                        <button 
                            onClick={handleLogout} 
                            className="btn btn-outline btn-error btn-wide rounded-full hover:shadow-lg hover:shadow-red-200 hover:scale-105 transition-transform"
                        >
                            <FaSignOutAlt /> Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* --- PREMIUM EDIT MODAL --- */}
            {isEditModalOpen && (
                <dialog className="modal modal-bottom sm:modal-middle backdrop-blur-sm" open>
                    <div className="modal-box p-0 rounded-3xl overflow-hidden max-w-md shadow-2xl">
                        
                        {/* Modal Header */}
                        <div className="bg-primary p-6 text-white text-center relative">
                            <button onClick={() => setIsEditModalOpen(false)} className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 text-white/80 hover:bg-white/20">
                                <FaTimes />
                            </button>
                            <h3 className="font-bold text-2xl">Edit Profile</h3>
                            <p className="text-white/80 text-sm mt-1">Update your personal details</p>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleUpdateProfile} className="p-8 space-y-6 bg-white">
                            
                            {/* Live Preview Circle */}
                            <div className="flex justify-center">
                                <div className="avatar">
                                    <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                        <img src={photoInput || "https://i.ibb.co/hYsm3PL/user.png"} alt="Preview" className="object-cover" />
                                    </div>
                                </div>
                            </div>

                            {/* Name Input */}
                            <div className="form-control">
                                <label className="label font-bold text-gray-700">Full Name</label>
                                <label className="input input-bordered flex items-center gap-2 rounded-xl focus-within:ring-2 ring-primary/50 bg-gray-50">
                                    <FaUserEdit className="text-gray-400" />
                                    <input 
                                        type="text" 
                                        className="grow bg-transparent" 
                                        placeholder="Your Name" 
                                        value={nameInput}
                                        onChange={(e) => setNameInput(e.target.value)}
                                        required
                                    />
                                </label>
                            </div>

                            {/* Photo URL Input */}
                            <div className="form-control">
                                <label className="label font-bold text-gray-700">Photo URL</label>
                                <label className="input input-bordered flex items-center gap-2 rounded-xl focus-within:ring-2 ring-primary/50 bg-gray-50">
                                    <FaLink className="text-gray-400" />
                                    <input 
                                        type="url" 
                                        className="grow bg-transparent" 
                                        placeholder="https://image-url.com" 
                                        value={photoInput}
                                        onChange={(e) => setPhotoInput(e.target.value)}
                                        required
                                    />
                                </label>
                                <label className="label">
                                    <span className="label-text-alt text-gray-400">Paste a direct image link to update avatar</span>
                                </label>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setIsEditModalOpen(false)} 
                                    className="btn btn-ghost flex-1 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary flex-1 rounded-xl shadow-md">
                                    <FaSave /> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    {/* Backdrop Click Close */}
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setIsEditModalOpen(false)}>close</button>
                    </form>
                </dialog>
            )}

        </div>
    );
};

export default Profile;