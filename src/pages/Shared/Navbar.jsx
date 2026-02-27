import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { FaSignOutAlt, FaThLarge, FaUserCog, FaBars } from "react-icons/fa";

const Navbar = () => {
    const { user, logOut } = useAuth();

    // --- THEME STATE MANAGEMENT ---
    const [theme, setTheme] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "light");

    const handleToggle = (e) => {
        if (e.target.checked) {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    };

    useEffect(() => {
        localStorage.setItem("theme", theme);
        const localTheme = localStorage.getItem("theme");
        document.querySelector("html").setAttribute("data-theme", localTheme);
    }, [theme]);
    // ------------------------------

    const handleLogOut = () => {
        logOut().then(() => {}).catch(console.error);
    };

    // Active Link Style (Updated for Dark Mode support)
    const navStyle = ({ isActive }) => 
        `text-base font-semibold px-4 py-2 rounded-lg transition-all duration-300 ${
            isActive ? "text-primary bg-primary/10" : "text-base-content/80 hover:text-primary hover:bg-base-200"
        }`;

    const navOptions = <>
        <li><NavLink to="/" className={navStyle}>Home</NavLink></li>
        <li><NavLink to="/all-loans" className={navStyle}>All Loans</NavLink></li>
        <li><NavLink to="/about" className={navStyle}>About Us</NavLink></li>
    </>;

    return (
        <div className="navbar bg-base-100/90 backdrop-blur-lg sticky top-0 z-50 border-b border-base-300 px-4 md:px-8 py-3 h-20 shadow-sm transition-all duration-300">
            <div className="navbar-start">
                {/* Mobile Dropdown */}
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden pl-0 text-base-content/80">
                        <FaBars size={24} />
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-52 gap-2 border border-base-300">
                        {navOptions}
                    </ul>
                </div>
                
                {/* --- PREMIUM LOGO --- */}
                <Link to="/" className="text-2xl font-extrabold tracking-wide text-base-content flex items-center gap-2 group">
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

            {/* Navbar End */}
            <div className="navbar-end gap-3 flex items-center">
                
                {/* 🌙 THEME TOGGLE BUTTON --- */}
                <label className="swap swap-rotate mr-2 text-base-content hover:text-primary transition-colors">
                    <input 
                        type="checkbox" 
                        onChange={handleToggle} 
                        checked={theme === "light" ? false : true} 
                    />
                    
                    {/* Sun icon */}
                    <svg className="swap-off fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
                    
                    {/* Moon icon */}
                    <svg className="swap-on fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
                </label>
                {/* --------------------------- */}

                {user ? (
                    <div className="dropdown dropdown-end">
                        {/* Avatar Trigger */}
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar ring ring-primary ring-offset-base-100 ring-offset-2 hover:ring-offset-4 transition-all duration-300">
                            <div className="w-10 rounded-full">
                                <img src={user?.photoURL || "https://i.ibb.co/hYsm3PL/user.png"} alt="user" />
                            </div>
                        </div>

                        {/* --- MODERN DROPDOWN CONTENT --- */}
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-0 shadow-2xl bg-base-100 rounded-2xl w-72 border border-base-300 overflow-hidden">
                            
                            {/* Header Section (User Info) */}
                            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 flex flex-col items-center gap-3 border-b border-base-300">
                                <div className="avatar">
                                    <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 shadow-md">
                                        <img src={user?.photoURL || "https://i.ibb.co/hYsm3PL/user.png"} alt="user" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <h3 className="font-bold text-base-content text-lg">{user?.displayName}</h3>
                                    <p className="text-xs text-base-content/70 font-medium">{user?.email}</p>
                                </div>
                                <span className="badge badge-primary badge-sm uppercase font-bold tracking-wider">Online</span>
                            </div>

                            {/* Menu Links */}
                            <div className="p-2 flex flex-col gap-1">
                                <li>
                                    <Link to="/dashboard/profile" className="flex items-center gap-3 py-3 px-4 font-semibold text-base-content/80 hover:bg-base-200 hover:text-primary rounded-xl transition-all">
                                        <div className="p-2 bg-blue-50 text-blue-500 rounded-lg"><FaThLarge /></div>
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/dashboard/profile" className="flex items-center gap-3 py-3 px-4 font-semibold text-base-content/80 hover:bg-base-200 hover:text-primary rounded-xl transition-all">
                                        <div className="p-2 bg-purple-50 text-purple-500 rounded-lg"><FaUserCog /></div>
                                        Edit Profile
                                    </Link>
                                </li>
                            </div>

                            <div className="divider my-0 opacity-50"></div>

                            {/* Logout Button */}
                            <div className="p-2">
                                <button 
                                    onClick={handleLogOut} 
                                    className="flex items-center w-full gap-3 py-3 px-4 font-bold text-red-500 hover:bg-red-50 hover:dark:bg-red-500/10 rounded-xl transition-all"
                                >
                                    <div className="p-2 bg-red-100 dark:bg-red-500/20 text-red-500 rounded-lg"><FaSignOutAlt /></div>
                                    Logout
                                </button>
                            </div>
                        </ul>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="hidden sm:flex text-base-content/80 font-bold hover:text-primary transition-colors px-4">Login</Link>
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