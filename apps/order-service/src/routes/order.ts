import fastify, { FastifyInstance } from "fastify";
import { request } from "http";
import { ShouldBeAdmin, ShouldBeUser } from "../middleware/authMiddleware";
import { Order } from "@repo/order-db";

export const orderRoute = async (fastify: FastifyInstance) => {
    fastify.get(
        "/user-order",
        { preHandler: ShouldBeUser },
        async (request, reply) => {
            const order = await Order.find();
            return reply.send(order);
        },
    );
    fastify.get("/orders",{preHandler:ShouldBeAdmin}, async (request, reply) => {
        const order = await Order.find();
        return reply.send(order);
    });
};
