import { Schema , model } from "mongoose";

const crawlJobSchema = new Schema(
    {
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true , "Job must belong to a user"]
        },
        seedUrl: {
            type: String,
            required: [true, "Seed url is required for starting a crawl"],
            trim: true
        }, 
        maxDepth: {
            type: Number,
            default: 3,
            min: [1, "Depth must be at least 1"],
            max: [10, "Depth cannot exceed 10 for performance safety"]
        },
        status: {
            type: String,
            enum: ["pending", "active", "completed", "failed", "stopped"],
            default: "pending"
        },
        pagesDiscovered: {
            type: Number,
            default: 0
        },
        pagesCrawled: {
            type: Number,
            default: 0
        },
        errorMessage: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true,
        versionKey: false,
        strict: "throw"
    }
);

const CrawlJob = model("CrawlJob" , crawlJobSchema);
export default CrawlJob;