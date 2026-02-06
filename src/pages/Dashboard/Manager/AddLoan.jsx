import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AddLoan = () => {
    const { register, handleSubmit, reset } = useForm();
    const axiosSecure = useAxiosSecure();

    const onSubmit = async (data) => {
        // Prepare data
        const loanItem = {
            title: data.title,
            category: data.category,
            interestRate: parseFloat(data.interestRate),
            maxLimit: parseFloat(data.maxLimit),
            description: data.description,
            image: data.image,
            createdAt: new Date(),
            // Add user info if needed
        }

        const menuRes = await axiosSecure.post('/loans', loanItem);
        if(menuRes.data.insertedId){
            reset();
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `${data.title} is added to the loans.`,
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    return (
        <div>
            <h2 className="text-3xl mb-10">Add a New Loan</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-control w-full my-6">
                    <label className="label"><span className="label-text">Loan Title</span></label>
                    <input type="text" placeholder="Loan Title" {...register("title", {required: true})} className="input input-bordered w-full" />
                </div>
                <div className="flex gap-6">
                    <div className="form-control w-full my-6">
                        <label className="label"><span className="label-text">Category</span></label>
                        <select defaultValue="default" {...register("category", {required: true})} className="select select-bordered w-full">
                            <option disabled value="default">Select a category</option>
                            <option value="business">Business Loan</option>
                            <option value="personal">Personal Loan</option>
                            <option value="home">Home Loan</option>
                        </select>
                    </div>
                    <div className="form-control w-full my-6">
                        <label className="label"><span className="label-text">Interest Rate (%)</span></label>
                        <input type="number" step="0.1" placeholder="Interest Rate" {...register("interestRate", {required: true})} className="input input-bordered w-full" />
                    </div>
                </div>
                <div className="form-control w-full my-6">
                    <label className="label"><span className="label-text">Description</span></label>
                    <textarea {...register("description")} className="textarea textarea-bordered h-24" placeholder="Loan details..."></textarea>
                </div>
                
                <button className="btn btn-primary">Add Loan</button>
            </form>
        </div>
    );
};

export default AddLoan;