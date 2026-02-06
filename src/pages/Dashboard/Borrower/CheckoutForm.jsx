import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ applicationId }) => {
    const [error, setError] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [processing, setProcessing] = useState(false);

    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const navigate = useNavigate();

    const price = 10; // Fixed Challenge Requirement

    useEffect(() => {
        // Create Payment Intent on mount
        axiosSecure.post('/create-payment-intent', { price })
            .then(res => {
                console.log(res.data.clientSecret);
                setClientSecret(res.data.clientSecret);
            })
            .catch(err => console.error("Payment intent error:", err));
    }, [axiosSecure, price]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (card === null) return;

        // 1. Create Payment Method
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card
        });

        if (error) {
            setError(error.message);
        } else {
            setError('');
        }

        setProcessing(true);

        // 2. Confirm Payment
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
            console.log(confirmError);
            setError(confirmError.message);
            setProcessing(false);
        } else {
            console.log('payment intent', paymentIntent);
            if (paymentIntent.status === 'succeeded') {
                
                // 3. Save to Database
                const paymentInfo = {
                    transactionId: paymentIntent.id,
                    price: price,
                    date: new Date()
                }

                const res = await axiosSecure.patch(`/applications/payment/${applicationId}`, paymentInfo);
                
                setProcessing(false);
                
                if (res.data.modifiedCount > 0) {
                    Swal.fire({
                        title: 'Payment Successful!',
                        text: `Transaction ID: ${paymentIntent.id}`,
                        icon: 'success',
                        confirmButtonText: 'Go to My Loans'
                    }).then((result) => {
                         if(result.isConfirmed){
                             navigate('/dashboard/my-loans');
                         }
                    });
                }
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="border p-4 rounded-md border-gray-300 mb-6">
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
            
            {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

            <button 
                className="btn btn-primary w-full bg-emerald-600 border-none" 
                type="submit" 
                disabled={!stripe || !clientSecret || processing}>
                {processing ? <span className="loading loading-spinner"></span> : `Pay $${price}`}
            </button>
        </form>
    );
};

export default CheckoutForm;