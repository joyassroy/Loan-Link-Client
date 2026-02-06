import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { FcGoogle } from "react-icons/fc";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";

const Login = () => {
    // --- AUTH & HOOKS ---
    const { signIn, googleSignIn } = useAuth();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    // --- UI STATES ---
    const [showPassword, setShowPassword] = useState(false);
    const [mood, setMood] = useState('neutral'); // neutral, shy, angry, happy
    const [shake, setShake] = useState(false); // For shaking animation

    // --- 1. GOOGLE LOGIN (তোমার দেওয়া লজিক - অপরিবর্তিত) ---
    const handleGoogleSignIn = () => {
        googleSignIn()
            .then(result => {
                console.log("Google User:", result.user);
                setMood('happy'); // সফল হলে হ্যাপি মুড

                const userInfo = {
                    email: result.user?.email,
                    name: result.user?.displayName,
                    role: 'borrower'
                };

                axiosPublic.post('/users', userInfo)
                    .then(res => {
                        console.log("Database Response:", res.data);
                        Swal.fire("Welcome!", "Logged in successfully.", "success");
                        navigate(from, { replace: true });
                    })
                    .catch(err => console.error("Database Insert Error:", err));
            })
            .catch(error => {
                console.error("Firebase Error:", error);
                triggerAngry();
            });
    };

    // --- 2. EMAIL/PASSWORD LOGIN ---
    const handleLogin = (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        signIn(email, password)
            .then(result => {
                const user = result.user;
                console.log(user);
                setMood('happy'); // সফল!
                Swal.fire({
                    title: "Success!",
                    text: "Login Successful",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
                navigate(from, { replace: true });
            })
            .catch(error => {
                console.error(error);
                triggerAngry(); // ব্যর্থ হলে রাগ করবে
                Swal.fire("Error", "Invalid Email or Password", "error");
            });
    };

    // --- HELPER: রাগান্বিত এনিমেশন ট্রিগার ---
    const triggerAngry = () => {
        setMood('angry');
        setShake(true);
        setTimeout(() => setShake(false), 500); // 0.5s পর কাঁপা বন্ধ হবে
        setTimeout(() => setMood('neutral'), 2000); // 2s পর আবার স্বাভাবিক হবে
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 flex items-center justify-center p-4 font-sans">
            
            <div className={`card w-full max-w-md bg-white shadow-2xl overflow-hidden transition-transform duration-300 ${shake ? 'animate-shake' : ''}`}>
                
                {/* --- MASCOT ANIMATION HEADER --- */}
                <div className={`h-40 flex items-center justify-center transition-colors duration-500 ${
                    mood === 'angry' ? 'bg-red-500' : 
                    mood === 'happy' ? 'bg-green-500' : 
                    mood === 'shy' ? 'bg-indigo-600' : 'bg-blue-600'
                }`}>
                    <div className="text-8xl transition-all duration-300 transform hover:scale-110 drop-shadow-lg">
                        {mood === 'neutral' && '😐'}
                        {mood === 'shy' && '🫣'}
                        {mood === 'angry' && '🤬'}
                        {mood === 'happy' && '😎'}
                    </div>
                </div>

                <div className="p-8">
                    <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">Welcome Back!</h2>
                    <p className="text-center text-gray-500 mb-6">
                        {mood === 'angry' ? "Wrong password! Try again." : "Please login to your account"}
                    </p>

                    <form onSubmit={handleLogin} className="space-y-5">
                        
                        {/* Email Field */}
                        <div className="form-control">
                            <label className="label font-bold text-gray-600">Email</label>
                            <div className="relative">
                                <FaEnvelope className="absolute top-4 left-4 text-gray-400" />
                                <input 
                                    type="email" 
                                    name="email" 
                                    placeholder="Enter your email" 
                                    className="input input-bordered w-full pl-12 focus:input-primary bg-gray-50" 
                                    onFocus={() => setMood('neutral')}
                                    required 
                                />
                            </div>
                        </div>

                        {/* Password Field (Triggers Shy Mood) */}
                        <div className="form-control">
                            <label className="label font-bold text-gray-600">Password</label>
                            <div className="relative">
                                <FaLock className="absolute top-4 left-4 text-gray-400" />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    name="password" 
                                    placeholder="Enter your password" 
                                    className={`input input-bordered w-full pl-12 pr-12 bg-gray-50 transition-all ${mood === 'angry' ? 'input-error' : 'focus:input-primary'}`} 
                                    
                                    // 🔥 Interaction Logic
                                    onFocus={() => setMood('shy')} // ফোকাস করলে চোখ ঢাকবে
                                    onBlur={() => setMood('neutral')} // ফোকাস সরালে স্বাভাবিক
                                    
                                    required 
                                />
                                <span 
                                    className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-blue-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            <label className="label">
                                <a href="#" className="label-text-alt link link-hover text-blue-500">Forgot password?</a>
                            </label>
                        </div>

                        {/* Login Button */}
                        <div className="form-control mt-4">
                            <button className="btn btn-primary w-full text-lg shadow-lg hover:shadow-blue-500/50 border-none bg-gradient-to-r from-blue-600 to-indigo-600">
                                Login
                            </button>
                        </div>
                    </form>

                    {/* Social Login Section */}
                    <div className="divider text-gray-400 text-sm">OR CONTINUE WITH</div>
                    
                    <button 
                        onClick={handleGoogleSignIn} 
                        className="btn btn-outline w-full flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors border-gray-300 text-gray-700"
                    >
                        <FcGoogle className="text-2xl" />
                        Google
                    </button>

                    <p className="text-center mt-6 text-gray-600">
                        Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Register</Link>
                    </p>
                </div>
            </div>

            {/* --- CSS FOR SHAKE ANIMATION --- */}
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
                    20%, 40%, 60%, 80% { transform: translateX(10px); }
                }
                .animate-shake {
                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                    border: 2px solid #ef4444; /* Red Border on Error */
                }
            `}</style>
        </div>
    );
};

export default Login;