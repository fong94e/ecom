import type { Consumer, Kafka } from "kafkajs";

export const createConsumer = (kafka: Kafka, groupId: string) => {
    const consumer: Consumer = kafka.consumer({ groupId });

    const connect = async () => {
        await consumer.connect();
        console.log("Kafka consumer connected" + groupId);
    };

    const subscribe = async (
        topics: {
            topicName: string;
            topicHandler: (message: any) => Promise<void>;
        }[],
    ) => {
        try {
            await consumer.subscribe({
                topics: topics.map((topic) => topic.topicName),
                fromBeginning: true,
            });

            await consumer.run({
                eachMessage: async ({
                    topic,
                    partition,
                    message,
                }) => {
                    try {
                        const topicConfig = topics.find(
                            (t) => t.topicName === topic,
                        );
                        if (topicConfig) {
                            const value = message.value?.toString();

                            if (value) {
                                const parsedMessage =
                                    JSON.parse(value);
                                await topicConfig.topicHandler(
                                    parsedMessage,
                                );
                            }
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
            console.error(error);
            throw error;
        }
    };

    const disconnect = async () => {
        await consumer.disconnect();
    };

    return { connect, subscribe, disconnect };
};
