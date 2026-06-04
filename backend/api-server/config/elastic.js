import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv";
dotenv.config();

const esClient = new Client({
  // Points directly to your .env variable layout cleanly
  node: process.env.ELASTICSEARCH_NODE || "http://localhost:9200"
});

export default esClient;