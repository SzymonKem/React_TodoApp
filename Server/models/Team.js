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
        type: mongoose.Schema.Types.ObjectId,
        require: true,
    },
    list: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
    },
});

export default mongoose.model("teams", TeamSchema);
