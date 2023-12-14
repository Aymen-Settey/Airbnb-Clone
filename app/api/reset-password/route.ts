import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export const POST = async (request: any) => {
  const { password, email } = await request.json();

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    return new NextResponse("User does not exist", { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    await prisma.user.update({
      where: { email },
      data: {
        hashedPassword: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return new NextResponse("User's password is updated", { status: 200 });
  } catch (error: any) {
    console.error("Prisma Update Error:", error);
    return new NextResponse(error, { status: 500 });
  }
};
