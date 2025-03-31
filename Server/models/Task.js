import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    id: {
        type: Number,
    },
    list: {
        type: mongoose.Schema.Types.ObjectId,
    },
    isDone: {
        type: Boolean,
    },
    name: {
        type: String,
    },
    desc: {
        type: String,
    },
    editable: {
        type: Boolean,
    },
    tags: {
        type: [String],
    },
});

export default mongoose.model("tasks", TaskSchema);
