import type { Producer, Kafka } from "kafkajs";

export const createProducer = (kafka: Kafka) => {
    const producer: Producer = kafka.producer();

    const connect = async () => {
        await producer.connect();
    };
    const send = async (topic: string, message: object) => {
        try {
            await producer.send({
                topic,
                messages: [{ value: JSON.stringify(message) }],
            });
        } catch (error) {
            console.error(`Error sending message to topic ${topic}:`, error);
            throw error;
        }
    };

    const disconnect = async () => {
        await producer.disconnect();
    };

    return { connect, send, disconnect };
};
