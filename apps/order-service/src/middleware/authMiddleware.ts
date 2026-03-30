import { getAuth } from "@clerk/fastify";
import { FastifyReply, FastifyRequest } from "fastify";

declare module "fastify" {
    interface FastifyRequest {
        userId?: string;
    }
}

export const ShouldBeUser = async(
    request: FastifyRequest,
    reply: FastifyReply,
) => {
    // Use `getAuth()` to access `isAuthenticated` and the user's ID
    const { isAuthenticated, userId } = getAuth(request);

    // If user isn't authenticated, return a 401 error
    if (!isAuthenticated) {
        return reply
            .code(401)
            .send({ error: "User not authenticated" });
    }

    request.userId =userId;
};
