import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ application, price }) => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [clientSecret, setClientSecret] = useState('');
    const [error, setError] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [processing, setProcessing] = useState(false);

    // 1. Create Payment Intent (Load Client Secret)
    useEffect(() => {
        if (price > 0) {
            axiosSecure.post('/create-payment-intent', { price: price })
                .then(res => {
                    console.log("Client Secret Recieved");
                    setClientSecret(res.data.clientSecret);
                })
                .catch(err => console.error("Stripe Intent Error:", err));
        }
    }, [axiosSecure, price]);

    // 2. Handle Payment Submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Safety Checks
        if (!stripe || !elements) return;
        
        const card = elements.getElement(CardElement);
        if (card === null) return;

        if (!application?._id) {
            setError("Error: Application ID is missing. Cannot proceed.");
            return;
        }

        setProcessing(true);
        setError('');

        // Step A: Create Payment Method
        const { error: paymentMethodError } = await stripe.createPaymentMethod({
            type: 'card',
            card
        });

        if (paymentMethodError) {
            setError(paymentMethodError.message);
            setProcessing(false);
            return;
        }

        // Step B: Confirm Payment
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    email: user?.email || 'anonymous',
                    name: user?.displayName || 'anonymous'
                }
            }
        });

        if (confirmError) {
            console.log("Confirm Error:", confirmError);
            setError(confirmError.message);
            setProcessing(false);
        } else {
            console.log("Payment Intent Success:", paymentIntent);
            
            if (paymentIntent.status === 'succeeded') {
                setTransactionId(paymentIntent.id);

                // Step C: Update Database
                const paymentInfo = {
                    transactionId: paymentIntent.id,
                    date: new Date(), // Convert to UTC string if needed
                    amount: price,
                    status: 'paid'
                };

                try {
                    // Update the specific application
                    const res = await axiosSecure.patch(`/applications/payment/${application._id}`, paymentInfo);
                    
                    if (res.data.modifiedCount > 0) {
                        // ✅ FIX: SweetAlert background & color fix for Dark Mode
                        Swal.fire({
                            title: "Payment Successful!",
                            text: `Transaction ID: ${paymentIntent.id}`,
                            icon: "success",
                            timer: 2000,
                            showConfirmButton: false,
                            background: "inherit",
                            color: "inherit",
                            customClass: {
                                popup: "bg-base-100 text-base-content border border-base-300 rounded-3xl shadow-2xl"
                            }
                        });
                        // Navigate back to user dashboard
                        navigate('/dashboard/my-loans');
                    }
                } catch (dbError) {
                    console.error("Database Update Failed:", dbError);
                    setError("Payment successful but failed to update database. Please contact support.");
                }
            }
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* ✅ FIX: Dynamic Dark Mode UI for Stripe Card Container */}
            <div className="border border-base-300 p-5 rounded-xl bg-base-200 shadow-sm transition-colors duration-300">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                // ✅ FIX: CSS Variable used so Stripe text adapts to Dark/Light Mode
                                color: 'var(--fallback-bc, oklch(var(--bc)))', 
                                fontFamily: 'sans-serif',
                                '::placeholder': {
                                    color: '#9ca3af', // Gray-400 for placeholder
                                },
                            },
                            invalid: {
                                color: '#ef4444', // Tailwind Red-500
                            },
                        },
                    }}
                />
            </div>
            
            {/* Error Message */}
            {error && <p className="text-error text-sm font-semibold mt-2">{error}</p>}
            
            {/* Transaction Success Message */}
            {transactionId && <p className="text-success text-sm font-bold">Transaction ID: {transactionId}</p>}

            {/* Pay Button */}
            <button 
                className="btn btn-primary w-full text-white text-lg rounded-xl shadow-lg shadow-primary/30 transition-all border-none" 
                type="submit" 
                disabled={!stripe || !clientSecret || processing}
            >
                {processing ? <span className="loading loading-spinner"></span> : `Pay $${price}`}
            </button>
        </form>
    );
};

export default CheckoutForm;