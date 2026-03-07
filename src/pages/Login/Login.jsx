import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { FcGoogle } from "react-icons/fc";
import { FaUserAlt, FaLock, FaShieldAlt, FaCheckCircle, FaExclamationCircle, FaUserSecret, FaUserTie } from "react-icons/fa";
import Swal from "sweetalert2";

const Login = () => {
    const { signIn, googleSignIn } = useAuth();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    // --- UI STATES ---
    const [focusedField, setFocusedField] = useState(null); 
    const [loginStatus, setLoginStatus] = useState('idle'); 

    // Google Login Logic
    const handleGoogleSignIn = () => {
        setLoginStatus('loading');
        googleSignIn()
            .then(result => {
                const userInfo = {
                    email: result.user?.email,
                    name: result.user?.displayName,
                    role: 'borrower'
                };
                axiosPublic.post('/users', userInfo)
                    .then(() => {
                        setLoginStatus('success');
                        Swal.fire({
                            title: "Welcome!",
                            text: "Login Successful",
                            icon: "success",
                            background: '#1f2937',
                            color: '#f9fafb',
                            confirmButtonColor: '#2563eb'
                        });
                        navigate(from, { replace: true });
                    });
            })
            .catch(err => {
                console.error(err);
                triggerError();
            });
    };

    // Standard Email Login Logic
    const handleLogin = (e) => {
        e.preventDefault();
        setLoginStatus('loading');
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        processLogin(email, password);
    };

    // ✅ DEMO LOGIN LOGIC
    const handleDemoLogin = (role) => {
        setLoginStatus('loading');
        
        // (এখানে তোমার ডাটাবেসে থাকা ডেমো অ্যাডমিন ও ইউজারের আসল ইমেইল/পাসওয়ার্ড বসাবে)
        const email = role === 'admin' ? "assdfd@gmail.com" : "test@gmail.com"; 
        const password = role === 'admin' ? "123456":"123456"; 

        // একটু ফেক ডিলে (Delay) দিচ্ছি যাতে ইউজার ফিল করতে পারে যে লগইন হচ্ছে
        setTimeout(() => {
            processLogin(email, password);
        }, 800);
    };

    // Reusable Login Processor
    const processLogin = (email, password) => {
        signIn(email, password)
            .then(() => {
                setLoginStatus('success');
                Swal.fire({
                    title: "Access Granted",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                    background: '#1f2937',
                    color: '#f9fafb'
                });
                navigate(from, { replace: true });
            })
            .catch(() => {
                triggerError();
            });
    };

    // Error Handler
    const triggerError = () => {
        setLoginStatus('error');
        setTimeout(() => setLoginStatus('idle'), 600); 
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>

            <div className={`relative w-full max-w-md bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 shadow-2xl rounded-3xl p-8 transition-all duration-300 ${loginStatus === 'error' ? 'animate-shake border-red-500/50' : ''}`}>
                
                {/* --- 1. DYNAMIC SECURITY HEADER --- */}
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 transition-all duration-500 shadow-lg ${
                        loginStatus === 'success' ? 'bg-green-500/20 text-green-400 ring-2 ring-green-500' :
                        loginStatus === 'error' ? 'bg-red-500/20 text-red-400 ring-2 ring-red-500' :
                        focusedField === 'password' ? 'bg-blue-600 text-white scale-110 ring-4 ring-blue-500/30' : 
                        'bg-gray-700 text-gray-400'
                    }`}>
                        {loginStatus === 'success' ? <FaCheckCircle /> : 
                         loginStatus === 'error' ? <FaExclamationCircle /> :
                         focusedField === 'password' ? <FaLock className="animate-bounce-short" /> : 
                         <FaShieldAlt />}
                    </div>
                    
                    <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
                    <p className="text-gray-400 text-sm mt-1">
                        {focusedField === 'password' ? "Securing connection..." : "Sign in to access your dashboard"}
                    </p>
                </div>

                {/* --- 2. LOGIN FORM --- */}
                <form onSubmit={handleLogin} className="space-y-5">
                    
                    {/* Email Input */}
                    <div className="group">
                        <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Email Address</label>
                        <div className={`flex items-center bg-gray-900/50 border rounded-xl px-4 py-3 transition-all duration-300 ${focusedField === 'email' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-600'}`}>
                            <FaUserAlt className={`mr-3 transition-colors ${focusedField === 'email' ? 'text-blue-500' : 'text-gray-500'}`} />
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="name@example.com" 
                                className="bg-transparent w-full text-white placeholder-gray-500 outline-none"
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                required 
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="group">
                        <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Password</label>
                        <div className={`flex items-center bg-gray-900/50 border rounded-xl px-4 py-3 transition-all duration-300 ${
                            loginStatus === 'error' ? 'border-red-500 ring-2 ring-red-500/20' :
                            focusedField === 'password' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-600'
                        }`}>
                            <FaLock className={`mr-3 transition-colors ${
                                loginStatus === 'error' ? 'text-red-500' :
                                focusedField === 'password' ? 'text-blue-500' : 'text-gray-500'
                            }`} />
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="••••••••" 
                                className="bg-transparent w-full text-white placeholder-gray-500 outline-none"
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField(null)}
                                required 
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={loginStatus === 'loading'}
                        className="btn w-full bg-blue-600 hover:bg-blue-700 text-white border-none rounded-xl text-lg font-bold shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] mt-4"
                    >
                        {loginStatus === 'loading' ? <span className="loading loading-dots"></span> : 'Sign In'}
                    </button>
                </form>

                {/* --- 3. 🚀 DEMO LOGIN BUTTONS --- */}
                <div className="mt-6 flex gap-3">
                    <button 
                        type="button"
                        onClick={() => handleDemoLogin('admin')}
                        disabled={loginStatus === 'loading'}
                        className="btn flex-1 bg-gray-700 hover:bg-gray-600 text-white border-none rounded-xl text-xs sm:text-sm shadow-md"
                    >
                        <FaUserSecret className="text-purple-400" /> Admin Demo
                    </button>
                    <button 
                        type="button"
                        onClick={() => handleDemoLogin('user')}
                        disabled={loginStatus === 'loading'}
                        className="btn flex-1 bg-gray-700 hover:bg-gray-600 text-white border-none rounded-xl text-xs sm:text-sm shadow-md"
                    >
                        <FaUserTie className="text-green-400" /> User Demo
                    </button>
                </div>

                {/* --- 4. SOCIAL & FOOTER --- */}
                <div className="mt-8">
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-600"></div>
                        <span className="flex-shrink mx-4 text-gray-500 text-xs uppercase">Or continue with</span>
                        <div className="flex-grow border-t border-gray-600"></div>
                    </div>

                    <button 
                        type="button"
                        onClick={handleGoogleSignIn} 
                        disabled={loginStatus === 'loading'}
                        className="btn w-full bg-white hover:bg-gray-100 text-gray-800 border-none rounded-xl mt-4 flex items-center justify-center gap-2 font-bold"
                    >
                        <FcGoogle className="text-xl" /> Google
                    </button>

                    <p className="text-center text-gray-400 mt-6 text-sm">
                        Don't have an account? <Link to="/register" className="text-blue-400 hover:text-blue-300 font-bold hover:underline">Register</Link>
                    </p>
                </div>

            </div>

            {/* CSS Animation for Shake & Bounce */}
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-8px); }
                    75% { transform: translateX(8px); }
                }
                .animate-shake {
                    animation: shake 0.4s ease-in-out;
                }
                @keyframes bounceShort {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce-short {
                    animation: bounceShort 0.5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default Login;