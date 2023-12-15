import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { use } from "react";

export async function POST(request: any) {
  const { token } = await request.json();
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await prisma.user.findFirst({
      where: {
        activeToken: token,
      },
    });

    if (!user) {
      return new NextResponse("Token is invalid or expired", { status: 400 });
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        activatedAt: new Date(),
        active: true,
      },
    });
    return new NextResponse("Email is verified", { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
}
