import { Kafka , logLevel } from "kafkajs";

const kafka = new Kafka({
    clientId: "webcrawler-api-server",
    brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
    logLevel: logLevel.ERROR,
});

export default kafka;