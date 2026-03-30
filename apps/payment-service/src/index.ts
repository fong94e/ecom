import { serve } from "@hono/node-server";
import { timeStamp } from "console";
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { Hono } from "hono";
import { uptime } from "process";
import { ShouldBeUser } from "./middleware/authMiddleware.js";

const app = new Hono();

app.use('*', clerkMiddleware())

app.get("/health", (c) => {
    return c.json({
        status: "ok",
        uptime: process.uptime(),
        timeStamp: Date.now(),
    });
});

app.get("/test",ShouldBeUser , (c) => {

  return c.json({
    message: 'Payment service authenticated',
    userId:c.get('userId')
  })
});

const start = async () => {
    try {
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
