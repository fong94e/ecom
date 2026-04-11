import { serve } from "@hono/node-server";
import { clerkMiddleware } from "@hono/clerk-auth";
import { Hono } from "hono";
import sessionRoute from "./routes/session.route.js";
import { cors } from "hono/cors";
import webhooksRoute from "./routes/webhooks.route.js";
import { consumer, producer } from "./utils/kafka.js";
import { runKafkaSubscriptions } from "./utils/subscriptions.js";

const app = new Hono();

app.use("*", clerkMiddleware());
app.use(
    "*",
    cors({
        origin: "http://localhost:3002",
        allowMethods: ["GET", "POST", "OPTIONS"],
    }),
);

app.get("/health", (c) => {
    return c.json({
        status: "ok",
        uptime: process.uptime(),
        timeStamp: Date.now(),
    });
});

app.route("/sessions", sessionRoute);
app.route("/webhooks", webhooksRoute);

// app.post("/create-stripe-product", async (c) => {
//     const res = await stripe.products.create({
//         id: "1231",
//         name: "Test Product",
//         default_price_data: {
//             currency: "vnd",
//             unit_amount: 10 * 100,
//         },
//     });

//     return c.json(res);
// });
// app.get("/stripe-product-price", async (c) => {
//     const res = await stripe.prices.list({
//         product: "123",
//     });

//     return c.json(res);
// });

const start = async () => {
    try {
        await Promise.all([await producer.connect(),await consumer.connect()]);
        await runKafkaSubscriptions();
        serve(
            {
                fetch: app.fetch,
                port: 8002,
            },
            (info) => {
                console.log(
                    `Payment service is running on http://localhost:${info.port}`,
                );
            },
        );
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

start();
