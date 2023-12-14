// Import Prisma Client instance
import prisma from "@/app/libs/prismadb";

import { NextResponse } from "next/server";
import crypto from "crypto";

export const POST = async (request: any) => {
  const { token } = await request.json();

  try {
    // No need to explicitly connect with Prisma, it's auto-connected

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Use Prisma to find the user based on your model
    const user = await prisma.user.findFirst({
      where: {
        resetToken: hashedToken,
      },
    });

    if (!user) {
      return new NextResponse("Invalid token or has expired", { status: 400 });
    }

    // Return the user data as JSON
    return new NextResponse(JSON.stringify(user), { status: 200 });
  } finally {
    // Close Prisma client to release the connection
    await prisma.$disconnect();
  }
};
