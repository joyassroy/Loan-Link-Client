import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { FcGoogle } from "react-icons/fc";
import { FaUser, FaEnvelope, FaLock, FaImage, FaUserPlus, FaIdCard, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import Swal from "sweetalert2";

const Register = () => {
    const { createUser, updateUserProfile, googleSignIn } = useAuth();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    // --- UI STATES ---
    const [focusedField, setFocusedField] = useState(null); 
    const [regStatus, setRegStatus] = useState('idle'); // idle, loading, success, error
    const [passwordError, setPasswordError] = useState('');

    // --- 1. GOOGLE REGISTRATION ---
    const handleGoogleSignIn = () => {
        setRegStatus('loading');
        googleSignIn()
            .then(result => {
                const userInfo = {
                    email: result.user?.email,
                    name: result.user?.displayName,
                    role: 'borrower'
                };
                axiosPublic.post('/users', userInfo)
                    .then(() => {
                        setRegStatus('success');
                        Swal.fire("Success", "Account Created via Google!", "success");
                        navigate("/");
                    });
            })
            .catch(err => {
                console.error(err);
                triggerError("Google Sign-in Failed");
            });
    };

    // --- 2. EMAIL/PASSWORD REGISTRATION ---
    const handleRegister = (e) => {
        e.preventDefault();
        setRegStatus('loading');
        setPasswordError('');

        const form = e.target;
        const name = form.name.value;
        const photoURL = form.photoURL.value;
        const email = form.email.value;
        const password = form.password.value;

        // ✅ PASSWORD VALIDATION LOGIC (UPDATED)
        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters long.");
            triggerError();
            return;
        }
        if (!/[A-Z]/.test(password)) {
            setPasswordError("Password must contain at least one uppercase letter (A-Z).");
            triggerError();
            return;
        }
        if (!/[a-z]/.test(password)) {
            setPasswordError("Password must contain at least one lowercase letter (a-z).");
            triggerError();
            return;
        }

        // Firebase Create User
        createUser(email, password)
            .then(() => {
                // Update Profile (Name & Photo)
                updateUserProfile(name, photoURL)
                    .then(() => {
                        // Create User Entry in Database
                        const userInfo = { name, email, role: 'borrower' };
                        axiosPublic.post('/users', userInfo)
                            .then(res => {
                                if (res.data.insertedId) {
                                    setRegStatus('success');
                                    Swal.fire({
                                        title: "Account Created!",
                                        text: "Welcome to LoanLink.",
                                        icon: "success",
                                        timer: 1500,
                                        showConfirmButton: false
                                    });
                                    navigate("/");
                                }
                            });
                    })
                    .catch(err => {
                        console.error(err);
                        triggerError("Profile update failed");
                    });
            })
            .catch(error => {
                console.error(error);
                triggerError("Email already in use.");
            });
    };

    // Error Handler
    const triggerError = (msg) => {
        setRegStatus('error');
        if(msg) Swal.fire("Error", msg, "error");
        setTimeout(() => setRegStatus('idle'), 600);
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            
            {/* Background Effects */}
            <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>

            <div className={`relative w-full max-w-lg bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 shadow-2xl rounded-3xl p-8 transition-all duration-300 ${regStatus === 'error' ? 'animate-shake border-red-500/50' : ''}`}>
                
                {/* --- HEADER ICON --- */}
                <div className="flex flex-col items-center justify-center mb-6">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 transition-all duration-500 shadow-lg ${
                        regStatus === 'success' ? 'bg-green-500/20 text-green-400 ring-2 ring-green-500' :
                        regStatus === 'error' ? 'bg-red-500/20 text-red-400 ring-2 ring-red-500' :
                        focusedField === 'password' ? 'bg-blue-600 text-white scale-110 ring-4 ring-blue-500/30' : 
                        focusedField === 'name' || focusedField === 'photo' ? 'bg-purple-600 text-white ring-4 ring-purple-500/30' :
                        'bg-gray-700 text-gray-400'
                    }`}>
                        {regStatus === 'success' ? <FaCheckCircle /> : 
                         regStatus === 'error' ? <FaExclamationTriangle /> :
                         focusedField === 'password' ? <FaLock className="animate-bounce-short" /> : 
                         focusedField === 'name' || focusedField === 'photo' ? <FaIdCard /> :
                         <FaUserPlus />}
                    </div>
                    
                    <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
                    <p className="text-gray-400 text-sm mt-1">Join our secure financial platform</p>
                </div>

                {/* --- REGISTRATION FORM --- */}
                <form onSubmit={handleRegister} className="space-y-4">
                    
                    {/* Name Field */}
                    <div className="group">
                        <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 ml-1">Full Name</label>
                        <div className={`flex items-center bg-gray-900/50 border rounded-xl px-4 py-3 transition-all ${focusedField === 'name' ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-gray-600'}`}>
                            <FaUser className={`mr-3 ${focusedField === 'name' ? 'text-purple-500' : 'text-gray-500'}`} />
                            <input 
                                type="text" name="name" placeholder="John Doe" 
                                className="bg-transparent w-full text-white placeholder-gray-500 outline-none"
                                onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} required 
                            />
                        </div>
                    </div>

                    {/* Photo URL Field */}
                    <div className="group">
                        <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 ml-1">Photo URL</label>
                        <div className={`flex items-center bg-gray-900/50 border rounded-xl px-4 py-3 transition-all ${focusedField === 'photo' ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-gray-600'}`}>
                            <FaImage className={`mr-3 ${focusedField === 'photo' ? 'text-purple-500' : 'text-gray-500'}`} />
                            <input 
                                type="text" name="photoURL" placeholder="https://example.com/photo.jpg" 
                                className="bg-transparent w-full text-white placeholder-gray-500 outline-none"
                                onFocus={() => setFocusedField('photo')} onBlur={() => setFocusedField(null)} required 
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="group">
                        <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 ml-1">Email Address</label>
                        <div className={`flex items-center bg-gray-900/50 border rounded-xl px-4 py-3 transition-all ${focusedField === 'email' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-600'}`}>
                            <FaEnvelope className={`mr-3 ${focusedField === 'email' ? 'text-blue-500' : 'text-gray-500'}`} />
                            <input 
                                type="email" name="email" placeholder="name@example.com" 
                                className="bg-transparent w-full text-white placeholder-gray-500 outline-none"
                                onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} required 
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="group">
                        <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 ml-1">Password</label>
                        <div className={`flex items-center bg-gray-900/50 border rounded-xl px-4 py-3 transition-all ${
                            passwordError ? 'border-red-500 ring-2 ring-red-500/20' : 
                            focusedField === 'password' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-600'
                        }`}>
                            <FaLock className={`mr-3 ${passwordError ? 'text-red-500' : focusedField === 'password' ? 'text-blue-500' : 'text-gray-500'}`} />
                            <input 
                                type="password" name="password" placeholder="••••••••" 
                                className="bg-transparent w-full text-white placeholder-gray-500 outline-none"
                                onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} required 
                            />
                        </div>
                        {passwordError && <p className="text-red-500 text-xs mt-1 ml-1 font-semibold animate-pulse">{passwordError}</p>}
                    </div>

                    <button 
                        disabled={regStatus === 'loading'}
                        className="btn w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none rounded-xl text-lg font-bold shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] mt-2"
                    >
                        {regStatus === 'loading' ? <span className="loading loading-dots"></span> : 'Register Account'}
                    </button>
                </form>

                {/* --- SOCIAL & FOOTER --- */}
                <div className="mt-6">
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-600"></div>
                        <span className="flex-shrink mx-4 text-gray-500 text-xs uppercase">Or register with</span>
                        <div className="flex-grow border-t border-gray-600"></div>
                    </div>

                    <button 
                        onClick={handleGoogleSignIn} 
                        className="btn w-full bg-white hover:bg-gray-100 text-gray-800 border-none rounded-xl mt-4 flex items-center justify-center gap-2 font-bold"
                    >
                        <FcGoogle className="text-xl" /> Google
                    </button>

                    <p className="text-center text-gray-400 mt-6 text-sm">
                        Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300 font-bold hover:underline">Login</Link>
                    </p>
                </div>

            </div>

            {/* Same CSS Animation as Login */}
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

export default Register;