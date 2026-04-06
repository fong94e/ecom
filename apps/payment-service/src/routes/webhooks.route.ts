import { Hono } from "hono";
import Stripe from "stripe";
import stripe from "../utils/stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
const webhooksRoute = new Hono();

webhooksRoute.post("/stripe", async (c) => {
    const body = await c.req.text();
    const sig = c.req.header("stripe-signature");

    if (!sig) {
        return c.json(
            { error: "Missing stripe-signature header" },
            400,
        );
    }
    let event: Stripe.Event;
    if (webhookSecret) {
        // Get the signature sent by Stripe
        try {
            event = stripe.webhooks.constructEvent(
                body,
                sig!,
                webhookSecret,
            );
        } catch (err) {
            console.log(`⚠️ Webhook signature verification failed.`);
            return c.json(
                { error: "Webhook signature verification failed." },
                400,
            );
        }

        switch (event.type) {
            case "checkout.session.completed":
                const session = event.data
                    .object as Stripe.Checkout.Session;

                const lineItems =
                    await stripe.checkout.sessions.listLineItems(
                        session.id,
                    );
                // TODO: Create Order
                console.log("WEBHOOK RECEIVED ", session);

                break;

            default:
                break;
        }
    } else {
        throw new Error("Missing STRIPE_WEBHOOK_SECRET");
    }
    return c.json({ received: true });
});

export default webhooksRoute;