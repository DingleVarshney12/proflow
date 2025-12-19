import bcrypt from "bcryptjs";
import User from "@/models/user.model";
import connectDB from "@/database/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password,role } = await req.json();
    const userExist = await User.findOne({ email });
    if (userExist) {
      return NextResponse.json(
        { message: "User Already Exist" },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        {
          message: "Password must be atleast 6 Character",
        },
        { status: 400 }
      );
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPass,
      role
    });
    return NextResponse.json(
      {
        message: {
          user: user,
          message: "User created Succesfully",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 501 }
    );
  }
}
