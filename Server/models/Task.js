import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    id: {
        type: Number,
    },
    userId: {
        type: mongoose.Types.ObjectId,
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
});

export default mongoose.model("tasks", TaskSchema);
