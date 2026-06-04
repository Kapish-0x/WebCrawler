import { Schema, model } from 'mongoose';

const searchIndexLogSchema = new Schema(
    {
        pageId: {
            type: Schema.Types.ObjectId,
            ref: 'CrawlPage',
            required: [true, "Reference to crawled target page is required"],
            unique: true
        },
        esIndexName: {
            type: String,
            required: true,
            default: "crawled_content_index"
        },
        esDocumentId: {
            type: String,
            default: null
        },
        isSynced: {
            type: Boolean,
            default: false,
            index: true
        }
    },
    {
        timestamps: true,
        versionKey: false,
        strict: "throw"
    }
);

const SearchIndexLog = model("SearchIndexLog", searchIndexLogSchema);
export default SearchIndexLog;