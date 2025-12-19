import connectDB from "@/database/mongodb";
import Project from "@/models/project.model";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Task from "@/models/task.model";
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || session?.user?.role !== "Freelancer") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const projects = await Project.find({
      $or: [
        { freelancerId: session?.user?.email },
        { clientId: session?.user?.email },
      ],
    });

    const projectSummaries = await Promise.all(
      projects.map(async (project) => {
        const totalTasks = await Task.countDocuments({
          projectId: project._id,
        });

        const completedTasks = await Task.countDocuments({
          projectId: project._id,
          status: "Completed",
        });

        return {
          projectId: project._id,
          title: project.title,
          totalTasks,
          completedTasks,
        };
      })
    );

    return NextResponse.json(projectSummaries, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
