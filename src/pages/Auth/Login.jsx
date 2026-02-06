import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPublic from "../hooks/useAxiosPublic"; // Public Axios ব্যবহার করো
import { FcGoogle } from "react-icons/fc";

const Login = () => {
    const { googleSignIn } = useAuth();
    const axiosPublic = useAxiosPublic(); // Secure না, Public টা লাগবে
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleGoogleSignIn = () => {
        googleSignIn()
            .then(result => {
                console.log("Google User:", result.user);

                const userInfo = {
                    email: result.user?.email,
                    name: result.user?.displayName,
                    role: 'borrower' // ডিফল্ট রোল সেট করে দিচ্ছি
                };

                // ডাটাবেসে পাঠানোর জন্য API কল
                axiosPublic.post('/users', userInfo)
                    .then(res => {
                        console.log("Database Response:", res.data);
                        navigate(from, { replace: true });
                    })
                    .catch(err => console.error("Database Insert Error:", err));
            })
            .catch(error => console.error("Firebase Error:", error));
    };

    return (
        <div className="p-4 text-center">
            <div className="divider">OR</div>
            <button 
                onClick={handleGoogleSignIn} 
                className="btn btn-outline w-full flex items-center justify-center gap-2"
            >
                <FcGoogle className="text-2xl" />
                Continue with Google
            </button>
        </div>
    );
};

export default Login;