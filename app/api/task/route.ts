import connectDB from "@/database/mongodb";
import Task from "@/models/task.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import Project from "@/models/project.model";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session?.user?.role !== "Freelancer") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const { title, projectId, status } = await req.json();
    if (!title || !projectId || !status) {
      return NextResponse.json(
        { message: "All fields (title, projectId, status) are required" },
        { status: 400 }
      );
    }
    const task = await Task.create({
      title,
      projectId,
      status,
    });
    return NextResponse.json(
      {
        message: "Task Created Successfully",
        task,
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

    await connectDB();
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { freelancerId: session.user.email },
        { clientId: session.user.email },
      ],
    });

    if (!project) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;
    const totalTasks = await Task.countDocuments({ projectId });
    const tasks = await Task.find({ projectId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 1 });
    if (!tasks || tasks.length === 0) {
      return NextResponse.json(
        { message: "No tasks found for this project" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        message: "Tasks fetched successfully",
        tasks,
        pagination: {
          totalCount: totalTasks,
          currentPage: page,
          totalPages: Math.ceil(totalTasks / limit),
        },
      },
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
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session?.user?.role !== "Freelancer") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id, status, title } = await req.json();
    const task = await Task.findByIdAndUpdate(
      id,
      { title, status },
      { new: true }
    );
    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        message: "Task updated successfully",
        task,
      },
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
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session?.user?.role !== "Freelancer") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const { id } = await req.json();
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        message: "Task deleted successfully",
        task,
      },
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
