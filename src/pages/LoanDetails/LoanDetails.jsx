import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic"; // Fetch details publicly
import useAxiosSecure from "../../hooks/useAxiosSecure"; // Submit privately
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

const LoanDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, reset } = useForm();

    // Fetch single loan data
    const { data: loan = {}, isLoading } = useQuery({
        queryKey: ['loan', id],
        queryFn: async () => {
            const res = await axiosPublic.get(`/loans/${id}`);
            return res.data;
        }
    });

    const onSubmitApplication = async (data) => {
        if (!user) {
            Swal.fire("Please Login", "You must be logged in to apply.", "warning");
            navigate('/login');
            return;
        }

        const applicationData = {
            loanId: loan._id,
            loanTitle: loan.title,
            loanCategory: loan.category,
            applicantName: user.displayName,
            email: user.email,
            phone: data.phone,
            address: data.address,
            loanAmount: parseFloat(data.amount),
            status: 'pending', // Default status
            paymentStatus: 'unpaid' // Default payment status
        };

        const res = await axiosSecure.post('/applications', applicationData);
        if (res.data.insertedId) {
            document.getElementById('application_modal').close();
            reset();
            Swal.fire("Success", "Application Submitted! Check your dashboard.", "success");
            navigate('/dashboard/my-loans');
        }
    };

    if(isLoading) return <div className="text-center mt-20">Loading...</div>;

    return (
        <div className="my-10 px-4 max-w-5xl mx-auto">
            {/* Details Section */}
            <div className="card lg:card-side bg-base-100 shadow-xl border">
                <figure className="lg:w-1/2"><img src={loan.image} alt="Album" className="w-full h-full object-cover"/></figure>
                <div className="card-body lg:w-1/2">
                    <h2 className="card-title text-3xl">{loan.title}</h2>
                    <p className="text-gray-500">{loan.description}</p>
                    
                    <div className="stats shadow my-4">
                        <div className="stat">
                            <div className="stat-title">Interest Rate</div>
                            <div className="stat-value text-primary">{loan.interestRate}%</div>
                        </div>
                        <div className="stat">
                            <div className="stat-title">Max Amount</div>
                            <div className="stat-value text-secondary">${loan.maxLimit}</div>
                        </div>
                    </div>

                    <div className="card-actions justify-end mt-4">
                        <button 
                            onClick={() => document.getElementById('application_modal').showModal()} 
                            className="btn btn-primary btn-wide"
                        >
                            Apply Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Application Modal */}
            <dialog id="application_modal" className="modal">
                <div className="modal-box w-11/12 max-w-2xl">
                    <h3 className="font-bold text-lg mb-4">Apply for {loan.title}</h3>
                    <form onSubmit={handleSubmit(onSubmitApplication)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Name</span></label>
                                <input type="text" value={user?.displayName} readOnly className="input input-bordered bg-gray-100" />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Email</span></label>
                                <input type="text" value={user?.email} readOnly className="input input-bordered bg-gray-100" />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Phone Number</span></label>
                                <input type="text" {...register("phone", {required: true})} placeholder="+880..." className="input input-bordered" />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Loan Amount ($)</span></label>
                                <input type="number" {...register("amount", {required: true, max: loan.maxLimit})} placeholder={`Max: ${loan.maxLimit}`} className="input input-bordered" />
                            </div>
                            <div className="form-control col-span-full">
                                <label className="label"><span className="label-text">Address</span></label>
                                <textarea {...register("address", {required: true})} className="textarea textarea-bordered" placeholder="Your full address"></textarea>
                            </div>
                        </div>
                        
                        <div className="modal-action">
                            <button type="submit" className="btn btn-primary">Submit Application</button>
                            <button type="button" className="btn" onClick={()=>document.getElementById('application_modal').close()}>Close</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default LoanDetails;