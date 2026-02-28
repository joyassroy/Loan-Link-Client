import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaUserEdit, FaLock, FaEnvelope, FaSave } from "react-icons/fa";

const Settings = () => {
    const { user, updateUserProfile } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [name, setName] = useState(user?.displayName || '');
    const [loading, setLoading] = useState(false);

    // --- Profile Update Handler ---
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Update Firebase Profile
            await updateUserProfile(name, user?.photoURL);

            // 2. Update Database (Optional, but good practice)
            await axiosSecure.patch(`/users/update/${user?.email}`, {
                name: name,
                photoURL: user?.photoURL
            });

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Profile updated successfully.',
                background: 'var(--fallback-b1,oklch(var(--b1)))',
                color: 'var(--fallback-bc,oklch(var(--bc)))',
                confirmButtonColor: '#4f46e5'
            });
        } catch (error) {
            console.error("Profile Update Error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to update profile.',
                background: 'var(--fallback-b1,oklch(var(--b1)))',
                color: 'var(--fallback-bc,oklch(var(--bc)))'
            });
        } finally {
            setLoading(false);
        }
    };

    // --- Password Reset Handler (Firebase) ---
    // Note: If you are using Firebase, password reset is usually done via email link.
    const handlePasswordReset = () => {
        Swal.fire({
            title: 'Reset Password',
            text: `A password reset link will be sent to ${user?.email}. Do you want to proceed?`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Send Email',
            background: 'var(--fallback-b1,oklch(var(--b1)))',
            color: 'var(--fallback-bc,oklch(var(--bc)))'
        }).then((result) => {
            if (result.isConfirmed) {
                // Here you would call your Firebase reset password function
                // e.g., sendPasswordResetEmail(auth, user.email)
                Swal.fire({
                     title: 'Sent!',
                     text: 'Check your email for the password reset link. (Demo Action)',
                     icon: 'success',
                     background: 'var(--fallback-b1,oklch(var(--b1)))',
                     color: 'var(--fallback-bc,oklch(var(--bc)))'
                });
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto text-base-content transition-colors duration-300">
            
            {/* --- HEADER --- */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-base-content flex items-center gap-3">
                    <FaUserEdit className="text-primary" /> Account Settings
                </h1>
                <p className="text-base-content/70 mt-2">
                    Manage your personal information and security preferences.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* --- LEFT COLUMN: Profile Update Form --- */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-base-100 p-8 rounded-3xl shadow-sm border border-base-300">
                        <h3 className="text-xl font-bold mb-6 border-b border-base-300 pb-4">Personal Information</h3>
                        
                        <form onSubmit={handleUpdateProfile} className="space-y-5">
                            {/* Name Input */}
                            <div className="form-control">
                                <label className="label font-bold text-base-content/80">
                                    <span className="label-text">Full Name</span>
                                </label>
                                <div className="relative">
                                    <FaUserEdit className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="input input-bordered w-full pl-12 rounded-xl focus:ring-2 ring-primary/20 bg-base-200 focus:bg-base-100 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email Input (Read Only) */}
                            <div className="form-control">
                                <label className="label font-bold text-base-content/80">
                                    <span className="label-text">Email Address</span>
                                </label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
                                    <input 
                                        type="email" 
                                        value={user?.email || ''}
                                        className="input input-bordered w-full pl-12 rounded-xl bg-base-200 text-base-content/60 cursor-not-allowed"
                                        readOnly
                                    />
                                </div>
                                <label className="label">
                                    <span className="label-text-alt text-error font-medium">Email cannot be changed.</span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button 
                                    type="submit" 
                                    disabled={loading || name === user?.displayName}
                                    className="btn btn-primary rounded-xl px-8 shadow-lg shadow-primary/30 flex items-center gap-2"
                                >
                                    {loading ? <span className="loading loading-spinner loading-sm"></span> : <FaSave />}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: Security & Actions --- */}
                <div className="space-y-6">
                    {/* Security Card */}
                    <div className="bg-base-100 p-8 rounded-3xl shadow-sm border border-base-300">
                        <h3 className="text-xl font-bold mb-6 border-b border-base-300 pb-4">Security</h3>
                        
                        <div className="space-y-4">
                            <p className="text-sm text-base-content/70">
                                To protect your account, ensure your password is secure and not used for other accounts.
                            </p>
                            <button 
                                onClick={handlePasswordReset}
                                className="btn btn-outline btn-error w-full rounded-xl gap-2"
                            >
                                <FaLock /> Request Password Reset
                            </button>
                        </div>
                    </div>

                    {/* Account Info Card */}
                    <div className="bg-base-200 p-8 rounded-3xl border border-base-300 text-center">
                         <div className="avatar mb-4">
                            <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img src={user?.photoURL || "https://i.ibb.co/hYsm3PL/user.png"} alt="User" />
                            </div>
                        </div>
                        <h4 className="font-bold text-lg text-base-content">{user?.displayName}</h4>
                        <p className="text-xs text-base-content/60 mt-1 uppercase tracking-widest font-bold">Verified User</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Settings;