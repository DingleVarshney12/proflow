import mongoose from "mongoose";
interface Task {
  _id?: mongoose.Types.ObjectId;
  title: string;
  status: "Pending" | "Ongoing" | "Completed";
  projectId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
const taskSchema = new mongoose.Schema<Task>(
  {
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Ongoing", "Completed"],
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  { timestamps: true }
);

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);
export default Task;
