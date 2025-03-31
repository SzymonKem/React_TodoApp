import mongoose from "mongoose";

const ListSchema = new mongoose.Schema({
    owner: {
        type: {
            type: String,
            require: true,
        },
        id: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
        },
    },
    tags: {
        type: Array,
    },
    tasks: {
        type: Array,
    },
});

export default mongoose.model("lists", ListSchema);
