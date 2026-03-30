import Fastify from "fastify";
import { clerkClient, clerkPlugin, getAuth } from "@clerk/fastify";
import { ShouldBeUser } from "./middleware/authMiddleware.js";

const fastify = Fastify();

fastify.register(clerkPlugin);

fastify.get(
    "/test",
    { preHandler: ShouldBeUser },(request, reply) => {
        try {
            return reply.send({
                message: "Order service authenticated",
                userId: request.userId,
            });
        } catch (error) {
            fastify.log.error(error);
            return reply
                .code(500)
                .send({ error: "Failed to retrieve user" });
        }
    },
);

/**
 * Run the server!
 */
const start = async () => {
    try {
        await fastify.listen({ port: 8001 });
        console.log("Order service is running on port 8001");
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
