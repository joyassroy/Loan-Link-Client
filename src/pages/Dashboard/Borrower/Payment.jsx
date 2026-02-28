import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useParams } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

// নোট: প্রোডাকশনে অবশ্যই Environment Variable ব্যবহার করবে
const stripePromise = loadStripe("pk_test_51Sxlb3IJk49aKm9CrdfOKZRcrOdTXN1QMzQQL7JTzEiBz5std6nSX771uV6h63EwLTiQxOTvZVVyjhk5xR03clXZ00jCrswNTE");

const Payment = () => {
    // 1. 👇 FIX: নামের মিল রাখা (Routes এ :id থাকলে এখানেও id হতে হবে)
    const { id } = useParams(); 
    const axiosSecure = useAxiosSecure();

    const { data: application = {}, isLoading } = useQuery({
        queryKey: ['application-for-payment', id],
        enabled: !!id, // id না থাকলে কুয়েরি কল হবে না (সেফটি)
        queryFn: async () => {
            const res = await axiosSecure.get(`/applications/${id}`);
            return res.data;
        }
    });

    if (isLoading) {
        return (
            <div className="flex justify-center h-screen items-center bg-base-200 transition-colors duration-300">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    // Safety Check: যদি কোনো কারণে ডাটা না আসে
    if (!application._id) {
        return (
            <div className="flex justify-center h-screen items-center bg-base-200 transition-colors duration-300">
                <div className="text-center text-error font-bold text-xl bg-base-100 p-8 rounded-2xl shadow-lg border border-base-300">
                    Error: Application info not found!
                </div>
            </div>
        );
    }

    // Payment Amount (Fix)
    const paymentAmount = 10; 

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4 py-12 transition-colors duration-300 font-sans">
            <div className="w-full max-w-2xl mx-auto">
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-base-content">
                        Secure <span className="text-primary">Checkout</span>
                    </h2>
                    <p className="text-base-content/60 mt-2 text-sm md:text-base">Complete your application fee payment below</p>
                </div>
                
                <div className="card w-full bg-base-100 shadow-2xl border border-base-300 transition-colors duration-300 rounded-[2rem] overflow-hidden">
                    <div className="card-body p-6 md:p-10">
                        
                        {/* --- Order Summary Box (Dark Mode Supported) --- */}
                        <div className="bg-base-200/50 p-6 rounded-2xl mb-8 border border-base-300 transition-colors">
                            <p className="font-bold text-lg text-base-content flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                                <span className="opacity-70 text-sm md:text-base">Payment for:</span> 
                                <span className="text-primary text-xl">{application.loanTitle}</span>
                            </p>
                            <p className="text-sm text-base-content/70 mt-2 font-medium">
                                Applicant: <span className="text-base-content">{application.applicantName || application.borrowerName}</span>
                            </p>
                            
                            <div className="divider my-4 opacity-30"></div>
                            
                            <p className="font-extrabold text-xl flex justify-between items-center text-base-content">
                                Total Payable: 
                                <span className="text-success text-2xl bg-success/10 px-4 py-1 rounded-lg">
                                    ${paymentAmount}
                                </span>
                            </p>
                        </div>
                        
                        {/* --- Stripe Elements --- */}
                        <div className="mt-4">
                            <Elements stripe={stripePromise}>
                                <CheckoutForm 
                                    application={application} 
                                    price={paymentAmount}
                                />
                            </Elements>
                        </div>

                        <div className="mt-8 text-center flex items-center justify-center gap-2 text-base-content/40 text-xs font-bold uppercase tracking-wider">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                            Payments are secure and encrypted
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Payment;