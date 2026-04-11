import { Order } from "@repo/order-db";
import { OrderType } from "@repo/types";

export const createOrder = async (order: OrderType) => {
    try {
        const newOrder = new Order(order);
        await newOrder.save();
        console.log("Order created:", newOrder);
    } catch (error) {
        console.log("CREATE ORDER ERROR:", error);
        throw error;
    }
};
