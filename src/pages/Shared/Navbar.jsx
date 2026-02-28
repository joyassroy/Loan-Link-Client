import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { FaSignOutAlt, FaThLarge, FaUserCog, FaBars } from "react-icons/fa";

// --- CUSTOM LL ICON (Matched with Home Page) ---
const LLIcon = ({ size = "w-10 h-10", strokeWidth = "8" }) => (
    <svg viewBox="0 0 100 100" className={`${size} drop-shadow-md`}>
        <defs>
            <linearGradient id="navLLGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22D3EE" />
                <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
        </defs>
        <path d="M 30 15 V 85 H 15 M 15 15 V 85 H 60 Q 65 85 65 80 V 65 H 40 Q 35 65 35 70 V 85" 
              fill="none" stroke="url(#navLLGradient)" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Navbar = () => {
    const { user, logOut } = useAuth();

    // --- THEME STATE MANAGEMENT ---
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    const handleToggle = (e) => {
        const newTheme = e.target.checked ? "dark" : "light";
        setTheme(newTheme);
    };

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const handleLogOut = () => {
        logOut().then(() => {}).catch(console.error);
    };

    const navStyle = ({ isActive }) => 
        `text-sm md:text-base font-bold px-4 py-2 rounded-lg transition-all duration-300 uppercase tracking-tight ${
            isActive ? "text-primary bg-primary/5" : "text-base-content/70 hover:text-primary hover:bg-base-200"
        }`;

    const navOptions = <>
        <li><NavLink to="/" className={navStyle}>Home</NavLink></li>
        <li><NavLink to="/all-loans" className={navStyle}>All Loans</NavLink></li>
        <li><NavLink to="/about" className={navStyle}>About Us</NavLink></li>
    </>;

    return (
        <div className="navbar bg-base-100/80 backdrop-blur-xl sticky top-0 z-[100] border-b border-base-content/5 px-4 md:px-8 h-20 shadow-sm transition-all">
            <div className="navbar-start">
                {/* Mobile Dropdown */}
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden pl-0 text-base-content/80">
                        <FaBars size={22} />
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-2xl bg-base-100 rounded-[2rem] w-64 gap-2 border border-base-content/5">
                        {navOptions}
                    </ul>
                </div>
                
                {/* --- UPDATED PREMIUM LOGO --- */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="transform group-hover:scale-110 group-hover:rotate-[10deg] transition-all duration-500">
                        <LLIcon size="w-10 h-10 md:w-12 md:h-12" strokeWidth="10" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-xl md:text-2xl font-[1000] uppercase tracking-tighter text-base-content group-hover:text-primary transition-colors">
                            Loan<span className="text-primary italic group-hover:text-base-content">Link</span>
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-40 group-hover:opacity-100 transition-opacity">Protocol v3.0</span>
                    </div>
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
                
                {/* THEME TOGGLE */}
                <label className="swap swap-rotate mr-2 text-base-content hover:text-primary transition-all hover:scale-110">
                    <input type="checkbox" onChange={handleToggle} checked={theme === "dark"} />
                    <svg className="swap-off fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
                    <svg className="swap-on fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
                </label>

                {user ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar ring-2 ring-primary ring-offset-2 ring-offset-base-100 hover:scale-105 transition-all duration-300">
                            <div className="w-10 rounded-full">
                                <img src={user?.photoURL || "https://i.ibb.co/hYsm3PL/user.png"} alt="user" />
                            </div>
                        </div>

                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-4 z-[1] p-0 shadow-2xl bg-base-100 rounded-[2rem] w-80 border border-base-content/10 overflow-hidden">
                            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-8 flex flex-col items-center gap-4 text-center">
                                <div className="avatar ring-4 ring-white rounded-full">
                                    <div className="w-20 rounded-full">
                                        <img src={user?.photoURL || "https://i.ibb.co/hYsm3PL/user.png"} alt="user" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-black text-xl uppercase italic tracking-tighter leading-tight">{user?.displayName}</h3>
                                    <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mt-1">{user?.email}</p>
                                </div>
                                <span className="px-3 py-1 bg-primary text-[10px] text-white font-black rounded-full uppercase tracking-widest">Active Link</span>
                            </div>

                            <div className="p-3 grid grid-cols-1 gap-1">
                                <li>
                                    <Link to="/dashboard" className="flex items-center gap-4 p-4 font-black uppercase text-xs hover:bg-primary/10 rounded-2xl transition-all">
                                        <FaThLarge className="text-primary text-lg" /> Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/dashboard/profile" className="flex items-center gap-4 p-4 font-black uppercase text-xs hover:bg-primary/10 rounded-2xl transition-all">
                                        <FaUserCog className="text-primary text-lg" /> Protocol Settings
                                    </Link>
                                </li>
                                <div className="divider my-1 opacity-50 px-4"></div>
                                <li>
                                    <button onClick={handleLogOut} className="flex items-center gap-4 p-4 font-black uppercase text-xs text-error hover:bg-error/10 rounded-2xl transition-all">
                                        <FaSignOutAlt className="text-lg" /> Terminate Link
                                    </button>
                                </li>
                            </div>
                        </ul>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="hidden sm:inline-block text-xs font-black uppercase tracking-widest hover:text-primary transition-colors">Login</Link>
                        <Link to="/register" className="btn btn-primary btn-md rounded-xl px-6 font-black uppercase italic shadow-lg shadow-primary/20 border-none hover:scale-105 transition-all">
                            Get Linked
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;