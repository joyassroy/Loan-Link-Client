import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";

const Profile = () => {
    const { user, logOut } = useAuth();
    const [role] = useRole();

    return (
        <div className="flex justify-center items-center pt-10">
            <div className="card w-96 bg-base-100 shadow-xl border">
                <figure className="px-10 pt-10">
                    <div className="avatar online">
                        <div className="w-24 rounded-full">
                            <img src={user?.photoURL || "https://i.ibb.co/hYsm3PL/user.png"} alt="User" />
                        </div>
                    </div>
                </figure>
                <div className="card-body items-center text-center">
                    <h2 className="card-title text-2xl">{user?.displayName}</h2>
                    <p className="text-gray-500">{user?.email}</p>
                    
                    <div className="badge badge-primary badge-outline mt-2 text-lg p-3 capitalize">
                        Role: {role || 'User'}
                    </div>

                    <div className="card-actions mt-6">
                        <p className="text-xs text-gray-400 mb-2">User ID: {user?.uid}</p>
                        <button onClick={logOut} className="btn btn-error btn-wide text-white">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;