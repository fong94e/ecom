import { getAuth } from "@hono/clerk-auth";
import { createMiddleware } from "hono/factory";
import { Variables } from "hono/types";

export const ShouldBeUser = createMiddleware<{
    Variables: {
        userId: string;
    };
}>(async (c, next) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
        return c.json({
            message: "You are not logged in.",
        });
    }
    c.set("userId", auth?.userId || "No user ID found");


    await next();
});
