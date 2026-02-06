import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ApplicationModal = ({ loan }) => {
    const { register, handleSubmit, reset } = useForm();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const applicationData = {
            loanId: loan._id,
            loanTitle: loan.title,
            loanCategory: loan.category,
            loanImage: loan.image,
            applicantName: user?.displayName,
            applicantEmail: user?.email,
            applicantPhone: data.phone,
            address: data.address,
            loanAmount: parseFloat(data.amount),
            status: 'pending',     // Default status
            feeStatus: 'unpaid',   // Default fee status
            appliedDate: new Date()
        };

        // Validate Max Limit
        if (applicationData.loanAmount > loan.maxLoanLimit) {
            Swal.fire('Error', `Amount cannot exceed limit: $${loan.maxLoanLimit}`, 'error');
            return;
        }

        const res = await axiosSecure.post('/applications', applicationData);
        if (res.data.insertedId) {
            reset();
            document.getElementById('application_modal').close();
            Swal.fire({
                title: 'Application Submitted!',
                text: 'Your loan application is pending approval.',
                icon: 'success',
                confirmButtonText: 'Go to Dashboard'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/dashboard/my-loans');
                }
            });
        }
    };

    return (
        <dialog id="application_modal" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-lg text-center mb-4">Apply for: {loan.title}</h3>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Read Only Fields */}
                    <div className="form-control">
                        <label className="label"><span className="label-text">Email</span></label>
                        <input type="email" value={user?.email || ''} readOnly className="input input-bordered bg-gray-100" />
                    </div>
                    <div className="form-control">
                        <label className="label"><span className="label-text">Name</span></label>
                        <input type="text" value={user?.displayName || ''} readOnly className="input input-bordered bg-gray-100" />
                    </div>

                    {/* User Inputs */}
                    <div className="form-control">
                        <label className="label"><span className="label-text">Phone Number</span></label>
                        <input {...register("phone", {required: true})} type="tel" placeholder="+880..." className="input input-bordered" />
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text">Address</span></label>
                        <input {...register("address", {required: true})} type="text" placeholder="Your location" className="input input-bordered" />
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text">Loan Amount (Max: ${loan.maxLoanLimit})</span></label>
                        <input {...register("amount", {required: true})} type="number" placeholder="Enter amount" className="input input-bordered" />
                    </div>

                    <div className="modal-action">
                        {/* Closes the modal without submitting */}
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            <button className="btn">Close</button>
                        </form>
                        <button type="submit" className="btn btn-primary">Submit Application</button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default ApplicationModal;