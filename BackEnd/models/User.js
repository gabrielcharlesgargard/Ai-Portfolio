import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const STARTING_CREDITS = 20;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 32,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
    },
    credits: {
        default: STARTING_CREDITS,
        type: Number,
        min: 0,
    },
    emailVerified: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });


userSchema.methods.toClient = function () {
    return {
        id: this._id.toString(),
        name: this.name,
        email: this.email,
        credits: this.credits,
        emailVerified: Boolean(this.emailVerified),
        createdAt: this.createdAt
    }
}


// to hash the password before saving to DB
userSchema.statics.hashPassword = function(plain) {
    return bcrypt.hash(plain, 10)
}


// to verify the hash password with the user password before loggin

userSchema.methods.verifyPassword = function (plain) {
    return bcrypt.compare(plain, this.password)
}


userSchema.statics.STARTING_CREDITS = STARTING_CREDITS;

export const User = mongoose.model("User", userSchema)