const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

TaskSchema.plugin(mongoosePaginate);

mongoose.model("Task", TaskSchema);
