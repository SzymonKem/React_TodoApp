import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    id: {
        type: Number,
    },
    owner: {
        type: {
            type: String,
            required: true,
        },
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
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
        type: Array,
    },
});

export default mongoose.model("tasks", TaskSchema);
