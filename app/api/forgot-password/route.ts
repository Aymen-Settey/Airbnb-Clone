import crypto from "crypto";
import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import prisma from "@/app/libs/prismadb";

export const POST = async (request: any) => {
  const { email } = await request.json();

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    return new NextResponse("Email does not exist", { status: 400 });
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const passwordResetExpires = new Date(Date.now() + 36000);

  try {
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: passwordResetToken,
        resetTokenExpiry: passwordResetExpires,
      },
    });

    const resetUrl = `localhost:3000/reset-password/${resetToken}`;
    const body = `Reset your password by visiting this URL: ${resetUrl}`;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");
    sgMail.send({
      to: email,
      from: "messisettey@gmail.com",
      subject: "Reset Password",
      text: body,
    }).then;

    return new NextResponse("Reset password email sent", { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
};
