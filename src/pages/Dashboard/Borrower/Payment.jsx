import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useParams } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure"; // Path adjust koro
import { useQuery } from "@tanstack/react-query";

// Key Hardcoded ache, eta thik ache checking er jonno
const stripePromise = loadStripe("pk_test_51Sxlb3IJk49aKm9CrdfOKZRcrOdTXN1QMzQQL7JTzEiBz5std6nSX771uV6h63EwLTiQxOTvZVVyjhk5xR03clXZ00jCrswNTE");

const Payment = () => {
    const { applicationId } = useParams();
    const axiosSecure = useAxiosSecure();

    // 1. Fetch Application Data using the ID
    const { data: application = {}, isLoading } = useQuery({
        queryKey: ['application-for-payment', applicationId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/applications/${applicationId}`);
            return res.data;
        }
    });

    if (isLoading) {
        return <div className="text-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    return (
        <div className="w-full max-w-3xl mx-auto p-10">
            <h2 className="text-3xl font-bold text-center text-emerald-600 mb-10">Complete Your Payment</h2>
            
            <div className="card w-full bg-base-100 shadow-2xl border border-emerald-100">
                <div className="card-body">
                    <p className="font-bold text-lg mb-4">
                        Payment for: <span className="text-gray-600">{application.loanCategory} Loan</span> <br/>
                        Application Fee: <span className="text-emerald-600">$10.00</span>
                    </p>
                    
                    {/* 2. Pass the FULL application object to the form */}
                    <Elements stripe={stripePromise}>
                        <CheckoutForm 
                            applicationData={application} 
                        />
                    </Elements>
                </div>
            </div>
        </div>
    );
};

export default Payment;