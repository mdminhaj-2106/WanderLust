import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// This plugin will automatically add username and password fields
// and provide authentication methods
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
export default User;