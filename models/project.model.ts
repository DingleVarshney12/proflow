import mongoose from "mongoose";
interface Project {
  _id?: mongoose.Types.ObjectId;
  title: string;
  clientId: string;
  freelancerId: string;
  createdAt: Date;
}
const projectSchema = new mongoose.Schema<Project>(
  {
    title: {
      type: String,
      required: true,
    },
    clientId: {
      type: String,
      required: true,
    },
    freelancerId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
