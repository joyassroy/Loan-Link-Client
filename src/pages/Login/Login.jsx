import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { useState } from "react";

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signIn, googleSignIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";
    const [error, setError] = useState("");

    const handleLogin = data => {
        signIn(data.email, data.password)
            .then(result => {
                const user = result.user;
                console.log(user);
                Swal.fire({
                    title: 'User Login Successful.',
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp'
                    }
                });
                navigate(from, { replace: true });
            })
            .catch(error => {
                setError(error.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: error.message,
                })
            })
    }

    const handleGoogleSignIn = () =>{
        googleSignIn()
        .then(result =>{
            console.log(result.user);
            navigate(from, { replace: true });
        })
    }

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col md:flex-row-reverse">
                <div className="text-center md:text-left">
                    <h1 className="text-5xl font-bold">Login now!</h1>
                    <p className="py-6">Access your loan dashboard securely.</p>
                </div>
                <div className="card md:w-1/2 max-w-sm shadow-2xl bg-base-100">
                    <form onSubmit={handleSubmit(handleLogin)} className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input type="email" {...register("email", { required: true })} name="email" placeholder="email" className="input input-bordered" />
                            {errors.email && <span className="text-red-600">Email is required</span>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input type="password" {...register("password", { required: true })} name="password" placeholder="password" className="input input-bordered" />
                            {errors.password && <span className="text-red-600">Password is required</span>}
                            <label className="label">
                                <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                            </label>
                        </div>
                        
                        {error && <p className="text-red-600 text-center">{error}</p>}
                        
                        <div className="form-control mt-6">
                            <input className="btn btn-primary" type="submit" value="Login" />
                        </div>
                    </form>
                    <div className="p-4 text-center">
                        <div className="divider">OR</div>
                        <button onClick={handleGoogleSignIn} className="btn btn-outline w-full uppercase">
                           Google Sign In
                        </button>
                        <p className="mt-4"><small>New Here? <Link to="/register" className="text-primary font-bold">Create an account</Link></small></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;