import { Schema, model } from 'mongoose';

const crawlPageSchema = new Schema(
    {
        jobId: {
            type: Schema.Types.ObjectId,
            ref: 'CrawlJob',
            required: [true, "Page must be associated with a Crawl Job"]
        },
        url: {
            type: String,
            required: [true, "Page URL is required"],
            trim: true
        },
        domain: {
            type: String,
            required: [true, "Domain field is required for performance indexing"],
            index: true
        },
        title: {
            type: String,
            trim: true,
            default: "Untitled Page"
        },
        crawlStatus: {
            type: String,
            enum: ["discovered", "processing", "indexed", "failed"],
            default: "discovered",
            index: true
        },
        depthLevel: {
            type: Number,
            required: [true, "Tracking the structural depth layer is required"]
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

// Compound index to guarantee a unique URL is only processed once per individual background job
crawlPageSchema.index({ jobId: 1, url: 1 }, { unique: true });

const CrawlPage = model("CrawlPage", crawlPageSchema);
export default CrawlPage;