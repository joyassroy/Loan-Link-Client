import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic"; // অথবা useAxiosSecure যদি সিকিউর চাও
import Swal from "sweetalert2";
import { FaPaperPlane, FaMoneyBillWave } from "react-icons/fa";

const LoanApplication = () => {
    const { id } = useParams(); // Loan ID
    const { user } = useAuth();
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();

    // 1. Fetch Loan Details (To show Loan Name)
    const { data: loan = {}, isLoading } = useQuery({
        queryKey: ['loan', id],
        queryFn: async () => {
            const res = await axiosPublic.get(`/loans/${id}`);
            return res.data;
        }
    });

    // 2. Handle Form Submit
    const handleApply = async (e) => {
        e.preventDefault();
        const form = e.target;
        const phone = form.phone.value;
        const address = form.address.value;

        const applicationData = {
            loanId: id,
            loanTitle: loan.title,
            loanCategory: loan.category,
            borrowerName: user?.displayName,
            borrowerEmail: user?.email,
            phone,
            address,
            status: 'pending', // Default status
            appliedDate: new Date().toISOString()
        };

        try {
            const res = await axiosPublic.post('/applications', applicationData);
            if (res.data.insertedId) {
                Swal.fire({
                    title: "Application Sent!",
                    text: "Your loan application has been submitted successfully.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
                navigate('/dashboard/my-loans'); // সাবমিট শেষে ড্যাশবোর্ডে নিয়ে যাবে
            }
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    };

    if (isLoading) return <div className="flex justify-center h-screen items-center"><span className="loading loading-bars loading-lg text-primary"></span></div>;

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center py-10 px-4">
            <div className="card w-full max-w-2xl bg-white shadow-2xl rounded-3xl overflow-hidden">
                
                {/* Header */}
                <div className="bg-primary p-6 text-white text-center">
                    <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
                        <FaMoneyBillWave /> Apply for Loan
                    </h2>
                    <p className="opacity-90 mt-1">You are applying for: <span className="font-bold text-yellow-300">{loan.title}</span></p>
                </div>

                {/* Form */}
                <form onSubmit={handleApply} className="card-body space-y-4">
                    
                    {/* Read-Only Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-control">
                            <label className="label font-bold text-gray-600">Borrower Name</label>
                            <input type="text" value={user?.displayName} readOnly className="input input-bordered bg-gray-100 cursor-not-allowed font-bold" />
                        </div>
                        <div className="form-control">
                            <label className="label font-bold text-gray-600">Borrower Email</label>
                            <input type="email" value={user?.email} readOnly className="input input-bordered bg-gray-100 cursor-not-allowed font-bold" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="form-control">
                            <label className="label font-bold text-gray-600">Loan ID</label>
                            <input type="text" value={id} readOnly className="input input-bordered bg-gray-100 cursor-not-allowed font-mono" />
                        </div>
                        <div className="form-control">
                            <label className="label font-bold text-gray-600">Category</label>
                            <input type="text" value={loan.category} readOnly className="input input-bordered bg-gray-100 cursor-not-allowed" />
                        </div>
                    </div>

                    <div className="divider">Required Information</div>

                    {/* Input Fields */}
                    <div className="form-control">
                        <label className="label font-bold text-gray-700">Phone Number</label>
                        <input type="tel" name="phone" placeholder="+880 17..." className="input input-bordered focus:input-primary w-full" required />
                    </div>

                    <div className="form-control">
                        <label className="label font-bold text-gray-700">Address</label>
                        <textarea name="address" placeholder="Your current address..." className="textarea textarea-bordered focus:textarea-primary w-full h-24" required></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="form-control mt-6">
                        <button className="btn btn-primary w-full text-lg shadow-lg hover:shadow-primary/40 rounded-xl">
                            <FaPaperPlane /> Submit Application
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoanApplication;