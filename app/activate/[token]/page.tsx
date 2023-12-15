"use client";
import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Heading from "../../components/Heading";
import { SessionProvider, useSession } from "next-auth/react";
import Loader from "@/app/components/Loader";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";

const Activate = ({ params }: any) => {
  const token = params?.token;
  console.log(token);
  const router = useRouter();

  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [emailverified, setEmailVerified] = useState(false);

  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    const verifyEmailToken = async () => {
      try {
        const res = await fetch("/api/activate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
          }),
        });
        if (res.status === 400) {
          setError("Invalid token or has expired");
          toast.error("Invalid token or has expired");
          setVerified(true);
        }
        if (res.status === 200) {
          setError("");
          setVerified(true);
          setEmailVerified(true);
        }
      } catch (error) {
        toast.error("There is an error");
        setVerified(true);
      }
    };
    verifyEmailToken();
  }, [token]);
  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router]);

  if (sessionStatus === "loading" || !verified) {
    return <Loader />;
  }

  return (
    <>
      {sessionStatus !== "authenticated" && !emailverified ? (
        <ClientOnly>
          <EmptyState
            title="Email is not Valid"
            subtitle="Please try again"
            showReset
            label="HOME"
          />
        </ClientOnly>
      ) : (
        <ClientOnly>
          <EmptyState
            title="Email is  Valid"
            subtitle="Please Log in"
            showReset
            label="HOME"
          />
        </ClientOnly>
      )}
    </>
  );
};
export default Activate;
