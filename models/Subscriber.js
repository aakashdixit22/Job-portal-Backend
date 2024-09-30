import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address']
    }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

const Subscriber = mongoose.model('Subscriber', subscriberSchema);
export default Subscriber;