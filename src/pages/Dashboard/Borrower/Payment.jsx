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
        enabled: !!id, // id না থাকলে কুয়েরি কল হবে না (সেফটি)
        queryFn: async () => {
            const res = await axiosSecure.get(`/applications/${id}`);
            return res.data;
        }
    });

    if (isLoading) {
        return <div className="text-center mt-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    }

    // Safety Check: যদি কোনো কারণে ডাটা না আসে
    if (!application._id) {
        return <div className="text-center mt-20 text-red-500 font-bold">Error: Application info not found!</div>;
    }

    // Payment Amount (Fix)
    const paymentAmount = 10; 

    return (
        <div className="w-full max-w-3xl mx-auto p-10 min-h-screen">
            <h2 className="text-3xl font-bold text-center text-primary mb-10">Complete Your Payment</h2>
            
            <div className="card w-full bg-base-100 shadow-2xl border border-primary/20">
                <div className="card-body">
                    <div className="bg-gray-50 p-4 rounded-xl mb-6">
                        <p className="font-bold text-lg text-gray-700">
                            Payment for: <span className="text-primary">{application.loanTitle}</span> <br/>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Applicant: {application.borrowerName}</p>
                        <div className="divider my-2"></div>
                        <p className="font-bold text-xl flex justify-between">
                            Total Payable: <span className="text-emerald-600">${paymentAmount}</span>
                        </p>
                    </div>
                    
                    {/* 2. Pass application AND price explicitly */}
                    <Elements stripe={stripePromise}>
                        <CheckoutForm 
                            application={application} 
                            price={paymentAmount}
                        />
                    </Elements>
                </div>
            </div>
        </div>
    );
};

export default Payment;