import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

const CheckoutForm = ({ applicationData, closeModal }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState('');
    const [processing, setProcessing] = useState(false); // To show loading state
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    useEffect(() => {
        // 1. Create PaymentIntent as soon as the page loads
        if (applicationData?.loanAmount) { // Ensure data exists
             axiosSecure.post('/create-payment-intent', { price: 10 }) // Fixed $10 Fee
            .then(res => {
                setClientSecret(res.data.clientSecret);
            })
            .catch(err => console.error("Error creating payment intent", err));
        }
    }, [axiosSecure, applicationData]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);
        if (card === null) {
            return;
        }

        setProcessing(true); // Start loading

        // 2. Create Payment Method
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card
        });

        if (error) {
            console.log('Payment error', error);
            toast.error(error.message);
            setProcessing(false);
            return;
        }

        // 3. Confirm Payment
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
            console.log('Confirm error', confirmError);
            toast.error(confirmError.message);
            setProcessing(false);
        } else {
            if (paymentIntent.status === 'succeeded') {
                console.log('transaction id', paymentIntent.id);
                
                // 4. NOW we save the payment info to the database
                const paymentInfo = {
                    applicationId: applicationData._id,
                    transactionId: paymentIntent.id,
                    price: 10,
                    date: new Date(),
                    status: 'paid'
                }

                try {
                    const res = await axiosSecure.patch(`/applications/payment/${applicationData._id}`, paymentInfo);
                    if (res.data.modifiedCount > 0) {
                        toast.success(`Payment Successful! ID: ${paymentIntent.id}`);
                        closeModal(); // Close the modal
                    }
                } catch (err) {
                    toast.error("Payment succeeded but failed to update database. Contact support.");
                }
                setProcessing(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="border p-4 rounded-md mb-4 bg-gray-50">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': { color: '#aab7c4' },
                            },
                            invalid: { color: '#9e2146' },
                        },
                    }}
                />
            </div>
            
            {/* Show error if secret is missing, or disable while processing */}
            <button 
                className="btn btn-sm btn-primary w-full" 
                type="submit" 
                disabled={!stripe || !clientSecret || processing}
            >
                {processing ? <span className="loading loading-spinner loading-xs"></span> : "Pay $10"}
            </button>
        </form>
    );
};

export default CheckoutForm;