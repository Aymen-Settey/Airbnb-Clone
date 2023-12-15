import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";
import prisma from "@/app/libs/prismadb";
import { randomUUID } from "crypto";
import { toast } from "react-hot-toast";
import { error } from "console";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, name, password } = body;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const Token = crypto.randomBytes(20).toString("hex");
    const activeToken = crypto.createHash("sha256").update(Token).digest("hex");
    const activeTokenExpiry = new Date(Date.now() + 36000);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
        activeToken: activeToken,
        activeTokenExpiry: activeTokenExpiry,
      },
    });

    const resetUrl = `localhost:3000/activate/${activeToken}`;
    const bodyemail = `Verify your account by visiting this URL: ${resetUrl}`;

    sgMail.setApiKey(process.env.SENDGRID_SECOND_API_KEY || "");
    sgMail.send({
      to: email,
      from: "messisettey@gmail.com",
      subject: "Email Verification",
      text: bodyemail,
    });

    return NextResponse.json(user);
  } catch (error: any) {
    return new NextResponse(error, { status: 500 });
  }
}
