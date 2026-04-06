import React from "react";
import {
    useCheckout,
    PaymentElement,
} from "@stripe/react-stripe-js/checkout";
import { ShippingFormInputs } from "@repo/types";
import { ConfirmError } from "@stripe/stripe-js";

const CheckoutForm = ({
    shippingForm,
}: {
    shippingForm: ShippingFormInputs;
}) => {
    const checkoutState = useCheckout();

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<ConfirmError | null>(
        null,
    );

    if (checkoutState.type === "loading") {
        return <div>Loading...</div>;
    }

    if (checkoutState.type === "error") {
        return <div>Error: {checkoutState.error.message}</div>;
    }

    const handleClick = async () => {
        setLoading(true);
        await checkoutState.checkout.updateEmail(shippingForm.email);
        await checkoutState.checkout.updateShippingAddress({
            name: "Shipping Address",
            address: {
                line1: shippingForm.address,
                city: shippingForm.city,
                country: "VN",
            },
        });
        const res = await checkoutState.checkout.confirm();
        if (res.type === "error") {
            setError(res.error);
        }
        setLoading(false);
    };

    return (
        <form>
            <PaymentElement options={{ layout: "accordion" }} />
            <div>
                <button disabled={loading} onClick={handleClick}>
                    {loading ? "Loading..." : "Pay"}
                </button>
                {error && <div>{error.message}</div>}
            </div>
        </form>
    );
};

export default CheckoutForm;
