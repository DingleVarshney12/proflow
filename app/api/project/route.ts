import connectDB from "@/database/mongodb";
import Project from "@/models/project.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import Task from "@/models/task.model";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session?.user?.role === "Client") {
      return NextResponse.json(
        { message: "Only Freelancer can create a project" },
        { status: 401 }
      );
    }

    await connectDB();

    const { title, freelancerId, clientId } = await req.json();

    if (!title || !freelancerId || !clientId) {
      return NextResponse.json(
        { message: "All fields (title, freelancerId, clientId) are required" },
        { status: 400 }
      );
    }

    const newProject = await Project.create({
      title,
      freelancerId,
      clientId,
    });

    return NextResponse.json(
      {
        message: "Project Created Successfully",
        project: newProject,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;
    await connectDB();
    const totalProjects = await Project.countDocuments({
      $or: [
        { freelancerId: session?.user?.email },
        { clientId: session?.user?.email },
      ],
    });
    const projects = await Project.find({
      $or: [
        { freelancerId: session?.user?.email },
        { clientId: session?.user?.email },
      ],
    })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const projectIds = projects.map((p) => p._id);

    let summaries: any[] = [];

    if (projectIds.length > 0) {
      summaries = await Task.aggregate([
        { $match: { projectId: { $in: projectIds } } },
        {
          $group: {
            _id: "$projectId",
            totalTasks: { $sum: 1 },
            completedTasks: {
              $sum: {
                $cond: [{ $eq: ["$status", "Completed"] }, 1, 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            projectId: "$_id",
            totalTasks: 1,
            completedTasks: 1,
          },
        },
      ]);
    }

    return NextResponse.json({
      projects,
      summary: summaries,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProjects / limit),
        totalCount :totalProjects,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session?.user?.role !== "Freelancer") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await req.json();
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
