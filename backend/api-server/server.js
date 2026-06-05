import exp from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { connect } from "mongoose";
import cors from 'cors';
import { Client } from '@elastic/elasticsearch'; 
import { commonApp } from "./routes/commonAPI.js";
import { startCrawlConsumer } from "./consumers/crawlConsumer.js";
import { initProducer } from "./config/kafkaProducer.js";
import searchRouter from "./routes/search.js";
import jobsRouter from "./routes/jobs.js";
config();

const app = exp();

// 1. GLOBAL MIDDLEWARE FIRST (Must be before mounting routes!)
app.use(cors()); 
app.use(cookieParser());
app.use(exp.json()); // Parses JSON payloads so req.body works

// 2. MOUNT ROUTES SECOND
app.use("/api", commonApp);
app.use("/api" , searchRouter);
app.use('/api', jobsRouter);

export const esClient = new Client({ node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200' });

const connectDB = async () => {
    try {
        await connect(process.env.MONGODB_URI);
        printMessage("MongoDB server connected successfully");

        // Initialize Kafka infra exactly ONCE each
        await initProducer();      // ⚡ Connect Producer
        await startCrawlConsumer();  // 🚀 Connect Consumer
        
        await esClient.ping();
        printMessage("Elasticsearch cluster reachable");

        const port = process.env.PORT || 5000;
        app.listen(port , () => printMessage(`Server running on port ${port}..`));
    } catch (err) {
        console.log("Error during infrastructure initialization:" , err);
    }
};

// Helper function for aesthetic logging layout
function printMessage(msg) {
    printDivider();
    console.log(msg);
    printDivider();
}
if (!global.printDivider) {
    global.printDivider = () => console.log("==================================================");
}

connectDB();

// To handle invalid paths
app.use((req, res, next) => {
    console.log(req.url);
    res.status(404).json({message: `path ${req.url} is invalid`});
});

// Error handling Middleware
app.use((err , req , res , next) => {
    console.log("error is " , err);
    console.log("Full error: ", JSON.stringify(err , null , 2));
    
    if(err.name === "ValidationError") {
        return res.status(400).json({message: "error occurred" , error : err.message});
    }
    if(err.name === "CastError") {
        return res.status(400).json({message: "error occurred" , error: err.message});
    }
    
    const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
    const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

    if(errCode === 11000) {
        const field = Object.keys(keyValue)[0];
        const value = keyValue[field];
        return res.status(409).json({
            message: "error occurred",
            error: `${field} "${value}" already exists`
        });
    }

    res.status(500).json({message: "error occurred" , error: "Server side error"});
});