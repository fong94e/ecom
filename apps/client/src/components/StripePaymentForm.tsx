"use client";

import { useAuth } from "@clerk/nextjs";
import { CartItemsType, ShippingFormInputs } from "@repo/types";
import { CheckoutElementsProvider } from "@stripe/react-stripe-js/checkout";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import CheckoutForm from "./checkoutForm";
import useCartStore from "@/stores/cartStore";
const stripe = loadStripe(
    "pk_test_51TEUdWL9jXRsgFdfFjHBUbFLPJKdRZjf2jjgbI9pHsLUsr3PN4d0z9e4aW520HnxXrO61XEz9dyUtyjaJvqkNt1N00InAiuHJB",
);

const clientSecret = async (cart: CartItemsType, token: string) => {
    return fetch(
        `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/create-checkout-session`,
        {
            method: "POST",
            body: JSON.stringify({ cart }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        },
    )
        .then((response) => response.json())
        .then((json) => json.client_secret);
};

const StripePaymentForm = ({
    shippingForm,
}: {
    shippingForm: ShippingFormInputs;
}) => {
    const { cart } = useCartStore();
    const [token, setToken] = useState<string | null>(null);
    const { getToken } = useAuth();

    useEffect(() => {
        getToken().then((token) => setToken(token));
    }, []);

    if (!token) {
        return <div>Loading...</div>;
    }

    return (
        <CheckoutElementsProvider
            stripe={stripe}
            options={{ clientSecret: clientSecret(cart, token) }}
        >
            <CheckoutForm shippingForm={shippingForm} />
        </CheckoutElementsProvider>
    );
};

export default StripePaymentForm;
