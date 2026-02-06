import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Swal from "sweetalert2";

const Register = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { createUser, updateUserProfile } = useAuth();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    const onSubmit = data => {
        // Password Validation
        if (data.password.length < 6) {
            return Swal.fire("Error", "Password must be 6 characters", "error");
        }
        if (!/[A-Z]/.test(data.password)) {
            return Swal.fire("Error", "Password must have an uppercase letter", "error");
        }
        if (!/[a-z]/.test(data.password)) {
            return Swal.fire("Error", "Password must have a lowercase letter", "error");
        }

        createUser(data.email, data.password)
            .then(result => {
                updateUserProfile(data.name, data.photoURL)
                    .then(() => {
                        // Create User entry in Database
                        const userInfo = {
                            name: data.name,
                            email: data.email,
                            role: 'borrower' // Default role
                        }
                        axiosPublic.post('/users', userInfo)
                            .then(res => {
                                if (res.data.insertedId) {
                                    reset();
                                    Swal.fire({
                                        position: 'top-end',
                                        icon: 'success',
                                        title: 'User created successfully.',
                                        showConfirmButton: false,
                                        timer: 1500
                                    });
                                    navigate('/');
                                }
                            })
                    })
            })
            .catch(error => Swal.fire("Error", error.message, "error"));
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Name</span></label>
                            <input type="text" {...register("name", { required: true })} placeholder="name" className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Email</span></label>
                            <input type="email" {...register("email", { required: true })} placeholder="email" className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Password</span></label>
                            <input type="password" {...register("password", { required: true })} placeholder="password" className="input input-bordered" />
                        </div>
                        <div className="form-control mt-6">
                            <input className="btn btn-primary" type="submit" value="Sign Up" />
                        </div>
                    </form>
                    <p className="p-4"><small>Already have an account? <Link to="/login">Login</Link></small></p>
                </div>
            </div>
        </div>
    );
};

export default Register;