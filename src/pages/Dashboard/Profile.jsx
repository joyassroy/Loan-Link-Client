import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { FaUser, FaEnvelope, FaIdBadge, FaFingerprint, FaSignOutAlt, FaEdit, FaCopy } from "react-icons/fa";
import Swal from "sweetalert2";

const Profile = () => {
    const { user, logOut } = useAuth();
    const axiosSecure = useAxiosSecure();

    // 1. Fetch User Role & Info from DB
    const { data: dbUser = {} } = useQuery({
        queryKey: ['user-profile', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/role/${user.email}`);
            // এখানে আমরা ধরে নিচ্ছি সার্ভার রোলের সাথে পুরো ইউজার ইনফোও দিতে পারে, 
            // অথবা আমরা শুধু রোলটা নিচ্ছি।
            return res.data; 
        }
    });

    const role = dbUser?.role || 'borrower';

    // 2. Role Based Color Logic
    const getRoleColor = (role) => {
        switch(role.toLowerCase()) {
            case 'admin': return 'badge-error'; // Red
            case 'manager': return 'badge-primary'; // Blue
            default: return 'badge-accent'; // Green
        }
    };

    const handleCopyId = () => {
        navigator.clipboard.writeText(user?.uid || "N/A");
        Swal.fire({
            icon: 'success',
            title: 'Copied!',
            text: 'User ID copied to clipboard',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500
        });
    };

    const handleLogout = () => {
        logOut()
            .then(() => {
                Swal.fire({
                    title: "Logged Out",
                    text: "See you soon!",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
            });
    };

    return (
        <div className="w-full min-h-[80vh] flex items-center justify-center bg-base-200 p-4">
            
            {/* --- Main Profile Card --- */}
            <div className="card w-full max-w-2xl bg-base-100 shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-primary/20">
                
                {/* 1. Colorful Gradient Header */}
                <div className="h-40 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
                    <div className="absolute top-4 right-4 opacity-30 text-white text-6xl">
                        <FaUser />
                    </div>
                </div>

                {/* 2. Avatar & Info Section */}
                <div className="card-body pt-0 relative">
                    
                    {/* Floating Avatar */}
                    <div className="flex justify-center -mt-20 mb-4">
                        <div className="avatar online placeholder ring ring-white ring-offset-base-100 ring-offset-2 rounded-full shadow-xl">
                            <div className="w-40 rounded-full bg-neutral text-neutral-content">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt="profile" className="object-cover" />
                                ) : (
                                    <span className="text-5xl">{user?.displayName?.charAt(0)}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* User Identity */}
                    <div className="text-center space-y-2 mb-8">
                        <h2 className="text-3xl font-extrabold text-gray-800">
                            {user?.displayName}
                        </h2>
                        
                        <div className={`badge ${getRoleColor(role)} badge-lg uppercase font-bold text-white shadow-md p-4`}>
                            {role}
                        </div>
                        
                        <p className="text-gray-500 flex items-center justify-center gap-2">
                            <FaEnvelope className="text-primary" /> {user?.email}
                        </p>
                    </div>

                    {/* 3. Detailed Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {/* User ID Box */}
                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                    <FaFingerprint size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">User ID</p>
                                    <p className="text-sm font-mono font-bold text-gray-700 truncate w-32">
                                        {user?.uid || "Not Available"}
                                    </p>
                                </div>
                            </div>
                            <button onClick={handleCopyId} className="btn btn-ghost btn-circle btn-sm text-gray-400 group-hover:text-primary" title="Copy ID">
                                <FaCopy />
                            </button>
                        </div>

                        {/* Account Status Box */}
                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                                    <FaIdBadge size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Account Status</p>
                                    <p className="text-sm font-bold text-success">Verified Active ✅</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 border-t pt-6">
                        <button className="btn btn-outline btn-primary gap-2 rounded-full px-8 hover:scale-105 transition-transform">
                            <FaEdit /> Edit Profile
                        </button>
                        
                        <button 
                            onClick={handleLogout} 
                            className="btn btn-error text-white gap-2 rounded-full px-8 shadow-lg shadow-red-200 hover:shadow-red-300 hover:scale-105 transition-transform"
                        >
                            <FaSignOutAlt /> Logout
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;