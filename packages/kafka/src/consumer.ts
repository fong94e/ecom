import type { Consumer, Kafka } from "kafkajs";

export const createConsumer = (kafka: Kafka, groupId: string) => {
    const consumer: Consumer = kafka.consumer({ groupId });

    const connect = async () => {
        await consumer.connect();
        console.log("Kafka consumer connected" + groupId);
    };

    const subscribe = async (
        topic: string,
        handler: (message: any) => Promise<void>,
    ) => {
        try {
            await consumer.subscribe({
                topic: topic,
                fromBeginning: true,
            });

            await consumer.run({
                eachMessage: async ({
                    topic,
                    partition,
                    message,
                }) => {
                    try {
                        const value = message.value?.toString();

                        if (value) {
                            const parsedMessage = JSON.parse(value);
                            await handler(parsedMessage);
                        }
                    } catch (error) {
                        console.error(
                            "Error processing message",
                            error,
                        );
                    }
                },
            });
        } catch (error) {
            console.error(
                `Error subscribing to topic ${topic}:`,
                error,
            );
            throw error;
        }
    };

    const disconnect = async () => {
        await consumer.disconnect();
    };

    return { connect, subscribe, disconnect };
};
