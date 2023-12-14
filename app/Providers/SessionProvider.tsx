"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { Session } from "inspector";

export default function Provider({ children, session }: any) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
