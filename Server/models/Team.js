import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        require: true,
    },
    users: {
        type: Array,
        require: true,
    },
    owner: {
        type: mongoose.Types.ObjectId,
        require: true,
    },
    tags: {
        type: Array,
    },
});

export default mongoose.model("teams", TeamSchema);
