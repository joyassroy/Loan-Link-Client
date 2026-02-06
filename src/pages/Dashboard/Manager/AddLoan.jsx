import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const AddLoan = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [imagePreview, setImagePreview] = useState("");

    const handleAddLoan = async (e) => {
        e.preventDefault();
        const form = e.target;

        const title = form.title.value;
        const category = form.category.value;
        const interest = parseFloat(form.interest.value);
        const maxLimit = parseInt(form.maxLimit.value);
        const image = form.image.value;
        const description = form.description.value;
        const addedBy = {
            name: user?.displayName,
            email: user?.email,
            role: 'manager'
        };
        const date = new Date().toISOString();

        const loanData = {
            title,
            category,
            interest,
            maxLimit: maxLimit,
            image,
            description,
            addedBy,
            date
        };

        try {
            const res = await axiosSecure.post('/loans', loanData);
            if (res.data.insertedId) {
                Swal.fire({
                    title: "Success!",
                    text: "Loan Added Successfully",
                    icon: "success",
                    confirmButtonText: "Cool"
                });
                form.reset();
                setImagePreview("");
            }
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: error.message,
                icon: "error",
                confirmButtonText: "Ok"
            });
        }
    };

    const handleImageChange = (e) => {
        setImagePreview(e.target.value);
    };

    // Common Input Class for Consistency
    const inputClass = "input input-bordered w-full h-12 rounded-lg bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 border-gray-200";

    return (
        <div className="w-full min-h-screen bg-base-200 p-6 flex items-center justify-center font-sans">
            <div className="card w-full max-w-5xl shadow-2xl bg-base-100 rounded-2xl overflow-hidden">
                
                {/* Header Section with Gradient */}
                <div className="bg-primary/5 p-8 text-center border-b border-primary/10">
                    <h2 className="text-4xl font-extrabold text-primary mb-2 tracking-tight">
                        Create New Loan Package
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Design a competitive loan offer by filling out the details below. Ensure accuracy for better borrower trust.
                    </p>
                </div>

                <div className="card-body p-8 md:p-10">
                    <form onSubmit={handleAddLoan} className="space-y-8">
                        
                        {/* Row 1: Title & Category */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="form-control">
                                <label className="label pl-1">
                                    <span className="label-text font-bold text-gray-700">Loan Title</span>
                                </label>
                                <input 
                                    type="text" 
                                    name="title" 
                                    placeholder="e.g. Small Business Startup Loan" 
                                    className={inputClass} 
                                    required 
                                />
                            </div>

                            <div className="form-control">
                                <label className="label pl-1">
                                    <span className="label-text font-bold text-gray-700">Category</span>
                                </label>
                                <select 
                                    name="category" 
                                    className={`${inputClass} appearance-none cursor-pointer`} 
                                    required 
                                    defaultValue=""
                                >
                                    <option disabled value="">Select Loan Category</option>
                                    <option value="Personal Loan">Personal Loan</option>
                                    <option value="Business Loan">Business Loan</option>
                                    <option value="Home Loan">Home Loan</option>
                                    <option value="Vehicle Loan">Vehicle Loan</option>
                                    <option value="Education Loan">Education Loan</option>
                                    <option value="Agriculture Loan">Agriculture Loan</option>
                                </select>
                            </div>
                        </div>

                        {/* Row 2: Interest & Max Limit */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="form-control">
                                <label className="label pl-1">
                                    <span className="label-text font-bold text-gray-700">Interest Rate (%)</span>
                                </label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        step="0.1" 
                                        name="interest" 
                                        placeholder="e.g. 5.5" 
                                        className={`${inputClass} pr-10`} 
                                        required 
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">%</span>
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label pl-1">
                                    <span className="label-text font-bold text-gray-700">Max Loan Limit</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
                                    <input 
                                        type="number" 
                                        name="maxLimit" 
                                        placeholder="e.g. 50000" 
                                        className={`${inputClass} pl-10`} 
                                        required 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Row 3: Image URL & Preview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                            <div className="form-control md:col-span-2">
                                <label className="label pl-1">
                                    <span className="label-text font-bold text-gray-700">Loan Image URL</span>
                                </label>
                                <input 
                                    type="url" 
                                    name="image" 
                                    placeholder="https://example.com/image.jpg" 
                                    className={inputClass} 
                                    onChange={handleImageChange}
                                    required 
                                />
                                <label className="label">
                                    <span className="label-text-alt text-gray-400">Provide a direct link to a high-quality image.</span>
                                </label>
                            </div>
                            
                            {/* Stylish Image Preview */}
                            <div className="form-control">
                                <label className="label pl-1 mb-1">
                                    <span className="label-text font-bold text-gray-700">Preview</span>
                                </label>
                                <div className="h-32 w-full border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 overflow-hidden shadow-inner relative group">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    ) : (
                                        <div className="text-center p-4">
                                            <span className="text-gray-300 text-4xl block mb-1">📷</span>
                                            <span className="text-xs text-gray-400 font-medium">Image Preview</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Row 4: Description */}
                        <div className="form-control">
                            <label className="label pl-1">
                                <span className="label-text font-bold text-gray-700">Detailed Description</span>
                            </label>
                            <textarea 
                                name="description" 
                                className="textarea textarea-bordered h-32 w-full rounded-xl bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 border-gray-200 text-base" 
                                placeholder="Describe the loan terms, benefits, and requirements..." 
                                required
                            ></textarea>
                        </div>

                        {/* Submit Button */}
                        <div className="form-control mt-4 pt-4 border-t border-gray-100">
                            <button className="btn btn-primary btn-lg w-full text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-primary/40 transform hover:-translate-y-1 transition-all duration-300">
                                Publish Loan Package
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddLoan;