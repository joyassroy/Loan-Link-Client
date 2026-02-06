import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import Swal from "sweetalert2";

const Register = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { createUser, updateUserProfile } = useAuth();
    const navigate = useNavigate();

    const onSubmit = data => {
        createUser(data.email, data.password)
            .then(result => {
                const loggedUser = result.user;
                console.log(loggedUser);
                
                // 1. Update Firebase Profile
                updateUserProfile(data.name, data.photoURL)
                    .then(() => {
                        // 2. Save User to Database
                        const userInfo = {
                            name: data.name,
                            email: data.email,
                            role: 'borrower', // Default role
                            status: 'active'
                        }
                        axios.post('http://localhost:5007/users', userInfo)
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
                    .catch(error => console.log(error))
            })
            .catch(error => {
                Swal.fire({ title: 'Error', text: error.message, icon: 'error' });
            });
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                        <h1 className="text-3xl font-bold text-center mb-4">Register</h1>
                        
                        <div className="form-control">
                            <label className="label"><span className="label-text">Name</span></label>
                            <input {...register("name", { required: true })} type="text" placeholder="Name" className="input input-bordered" />
                        </div>
                        
                        <div className="form-control">
                            <label className="label"><span className="label-text">Photo URL</span></label>
                            <input {...register("photoURL", { required: true })} type="text" placeholder="Photo URL" className="input input-bordered" />
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="label-text">Email</span></label>
                            <input {...register("email", { required: true })} type="email" placeholder="email" className="input input-bordered" />
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="label-text">Password</span></label>
                            <input {...register("password", { 
                                required: true, 
                                minLength: 6, 
                                maxLength: 20,
                                pattern: /(?=.*[A-Z])(?=.*[a-z])/ 
                            })} type="password" placeholder="password" className="input input-bordered" />
                            
                            {/* CHALLENGE REQUIREMENTS ERROR MESSAGES */}
                            {errors.password?.type === 'required' && <span className="text-red-600 text-xs mt-1">Password is required</span>}
                            {errors.password?.type === 'minLength' && <span className="text-red-600 text-xs mt-1">Password must be 6+ characters</span>}
                            {errors.password?.type === 'pattern' && <span className="text-red-600 text-xs mt-1">Must have 1 Uppercase & 1 Lowercase</span>}
                        </div>

                        <div className="form-control mt-6">
                            <button className="btn btn-primary">Register</button>
                        </div>
                        <p className="text-center mt-4">Already have an account? <Link to="/login" className="font-bold">Login</Link></p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;