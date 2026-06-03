import { Schema , model } from 'mongoose';

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true , "Name is required"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\s*[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,4}\s*$/, 'Please provide a valid email address']
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, 'Password must be at least 6 characters long']
        },
        role: {
            type: String,
            enum: ["user" , "admin"],
            default: "user"
        },
        isActive: {
            type: Boolean,
            default: true
        }
    }, {
        timestamps: true,
        versionKey: false,
        strict: "throw",
    },
);

//create model
const User = model("User", userSchema); 
export default User;