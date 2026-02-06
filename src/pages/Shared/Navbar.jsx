import { Link, NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { FaSignOutAlt, FaThLarge, FaUserCog, FaBars } from "react-icons/fa";

const Navbar = () => {
    const { user, logOut } = useAuth();

    const handleLogOut = () => {
        logOut().then(() => {}).catch(console.error);
    };

    // Active Link Style
    const navStyle = ({ isActive }) => 
        `text-base font-semibold px-4 py-2 rounded-lg transition-all duration-300 ${
            isActive ? "text-primary bg-primary/10" : "text-gray-600 hover:text-primary hover:bg-gray-50"
        }`;

    const navOptions = <>
        <li><NavLink to="/" className={navStyle}>Home</NavLink></li>
        <li><NavLink to="/all-loans" className={navStyle}>All Loans</NavLink></li>
        <li><NavLink to="/about" className={navStyle}>About Us</NavLink></li>
    </>;

    return (
        <div className="navbar bg-white/90 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-100 px-4 md:px-8 py-3 h-20 shadow-sm transition-all duration-300">
            <div className="navbar-start">
                {/* Mobile Dropdown */}
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden pl-0 text-gray-600">
                        <FaBars size={24} />
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-white rounded-box w-52 gap-2 border border-gray-100">
                        {navOptions}
                    </ul>
                </div>
                
                {/* --- PREMIUM LOGO --- */}
                <Link to="/" className="text-2xl font-extrabold tracking-wide text-gray-800 flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center text-white text-sm shadow-md shadow-primary/30 transform group-hover:rotate-12 transition-transform duration-300">
                        LL
                    </div>
                    <span className="hidden sm:inline group-hover:text-primary transition-colors">Loan<span className="text-primary group-hover:text-secondary">Link</span></span>
                </Link>
            </div>

            {/* Desktop Menu */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-2">
                    {navOptions}
                </ul>
            </div>

            {/* Navbar End (Modern Profile Dropdown) */}
            <div className="navbar-end gap-3">
                {user ? (
                    <div className="dropdown dropdown-end">
                        {/* Avatar Trigger */}
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar ring ring-primary ring-offset-base-100 ring-offset-2 hover:ring-offset-4 transition-all duration-300">
                            <div className="w-10 rounded-full">
                                <img src={user?.photoURL || "https://i.ibb.co/hYsm3PL/user.png"} alt="user" />
                            </div>
                        </div>

                        {/* --- MODERN DROPDOWN CONTENT --- */}
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-0 shadow-2xl bg-white rounded-2xl w-72 border border-gray-100 overflow-hidden">
                            
                            {/* Header Section (User Info) */}
                            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 flex flex-col items-center gap-3 border-b border-gray-100">
                                <div className="avatar">
                                    <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 shadow-md">
                                        <img src={user?.photoURL || "https://i.ibb.co/hYsm3PL/user.png"} alt="user" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <h3 className="font-bold text-gray-800 text-lg">{user?.displayName}</h3>
                                    <p className="text-xs text-gray-500 font-medium">{user?.email}</p>
                                </div>
                                <span className="badge badge-primary badge-sm uppercase font-bold tracking-wider">Online</span>
                            </div>

                            {/* Menu Links */}
                            <div className="p-2 flex flex-col gap-1">
                                <li>
                                    <Link to="/dashboard/profile" className="flex items-center gap-3 py-3 px-4 font-semibold text-gray-600 hover:bg-gray-50 hover:text-primary rounded-xl transition-all">
                                        <div className="p-2 bg-blue-50 text-blue-500 rounded-lg"><FaThLarge /></div>
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/dashboard/profile" className="flex items-center gap-3 py-3 px-4 font-semibold text-gray-600 hover:bg-gray-50 hover:text-primary rounded-xl transition-all">
                                        <div className="p-2 bg-purple-50 text-purple-500 rounded-lg"><FaUserCog /></div>
                                        Edit Profile
                                    </Link>
                                </li>
                            </div>

                            <div className="divider my-0"></div>

                            {/* Logout Button */}
                            <div className="p-2">
                                <button 
                                    onClick={handleLogOut} 
                                    className="flex items-center w-full gap-3 py-3 px-4 font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <div className="p-2 bg-red-100 text-red-500 rounded-lg"><FaSignOutAlt /></div>
                                    Logout
                                </button>
                            </div>
                        </ul>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="hidden sm:flex text-gray-600 font-bold hover:text-primary transition-colors px-4">Login</Link>
                        <Link to="/register" className="btn btn-primary text-white rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all bg-gradient-to-r from-primary to-secondary border-none px-6">
                            Get Started
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;