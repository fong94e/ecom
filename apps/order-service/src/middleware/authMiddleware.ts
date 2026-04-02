import { getAuth } from "@clerk/fastify";
import { FastifyReply, FastifyRequest } from "fastify";
import type { CustomJwtSessionClaims } from "@repo/types";

declare module "fastify" {
    interface FastifyRequest {
        userId?: string;
    }
}

export const ShouldBeUser = async (
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

    request.userId = userId;
};
export const ShouldBeAdmin = async (
    request: FastifyRequest,
    reply: FastifyReply,
) => {
    // Use `getAuth()` to access `isAuthenticated` and the user's ID
    const auth = getAuth(request);

    // If user isn't authenticated, return a 401 error
    if (!auth.userId) {
        return reply
            .code(401)
            .send({ error: "You are not logged in." });
    }

    const claims = auth.sessionClaims as CustomJwtSessionClaims;

    if (claims.metadata?.role !== "admin") {
        return reply.status(403).send({ error: "Unauthorized!" });
    }

    request.userId = auth.userId;
};
