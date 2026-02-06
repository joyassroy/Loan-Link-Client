import { Link, NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
    const { user, logOut } = useAuth();

    const handleLogOut = () => {
        logOut()
            .then(() => {})
            .catch(error => console.log(error));
    }

    const navOptions = <>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/all-loans">All Loans</NavLink></li>
        <li><NavLink to="/about">About Us</NavLink></li>
        <li><NavLink to="/contact">Contact</NavLink></li>
    </>

    return ( 
        <div className="navbar bg-base-100 shadow-md px-4">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        {navOptions}
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost normal-case text-xl text-primary font-bold">LoanLink</Link>
            </div>
            
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {navOptions}
                </ul>
            </div>
            
            <div className="navbar-end">
                {
                    user ? <>
                        <Link to="/dashboard/profile" className="btn btn-ghost btn-circle avatar tooltip tooltip-bottom" data-tip={user.displayName}>
                            <div className="w-10 rounded-full border border-primary">
                                <img src={user?.photoURL || "https://i.ibb.co/hYsm3PL/user.png"} alt="User" />
                            </div>
                        </Link>
                        <Link to="/dashboard/profile" className="btn btn-sm btn-ghost mr-2 hidden md:flex">Dashboard</Link>
                        <button onClick={handleLogOut} className="btn btn-sm btn-outline btn-error">Logout</button>
                    </> : <>
                        <Link to="/login" className="btn btn-sm btn-ghost">Login</Link>
                        <Link to="/register" className="btn btn-sm btn-primary ml-2">Register</Link>
                    </>
                }
            </div>
        </div>
    );
};

export default Navbar;