"use client";
import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { SessionProvider, useSession } from "next-auth/react";
import { IoMdClose } from "react-icons/io";
import Loader from "@/app/components/Loader";

interface User {
  email: string;
}

const ResetPassword = ({ params }: any) => {
  //console.log(params.token);
  const router = useRouter();

  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch("/api/verify-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: params.token,
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
          const userData = await res.json();
          console.log(userData);
          setUser(userData);
        }
      } catch (error) {
        toast.error("Invalid token or has expired");
      }
    };
    verifyToken();
  }, [params.token]);
  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router]);
  const { handleSubmit: handleSubmitHookForm, register } = useForm();
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const { password } = data;

    console.log(password);

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          email: user?.email,
        }),
      });
      if (res.status === 400) {
        setError("oops");
      }
      if (res.status === 200) {
        setError("");
        toast.success("Your password has been reset");
        router.push("/");
      }
    } catch (error) {
      setError("Error, try again");
      toast.error("Unable to reset password");
      console.log(error);
    }
  };

  if (sessionStatus === "loading" || !verified) {
    return <Loader />;
  }

  return (
    sessionStatus !== "authenticated" && (
      <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70">
          <div className="relative w-full md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 mx-auto h-full lg:h-auto md:h-auto">
            {/* Content */}
            <div
              className={
                "translate duration-300 h-full translate-y-0 opacity-100"
              }
            >
              <div className="tra,slate h-full lg:h-auto md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/* Header */}
                <div className="flex items-center p-6 rounded-t justify-center relative border-b-[1px]">
                  <button
                    onClick={() => {
                      router.push("/");
                    }}
                    className="p-1 border-0 hover:opacity-70 transition absolute left-9"
                  >
                    <IoMdClose size={18} />
                  </button>
                  <div className="text-lg font-semibold">
                    Enter your New Password
                  </div>
                </div>
                {/* Body */}
                <div className="relative p-6 flex-auto">
                  <form onSubmit={handleSubmitHookForm(onSubmit)}>
                    <input
                      type="password"
                      {...register("password", { required: true })}
                      className="w-full border border-rose-500 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-rose-400 focus:text-black"
                      placeholder="New Password"
                    />

                    <button
                      type="submit"
                      className="w-full bg-rose-500 text-white py-2 rounded hover:bg-rose-600"
                    >
                      Reset Password
                    </button>
                    <p className="text-red-600 text-[16px] mb-4">
                      {error && error}
                    </p>
                  </form>
                </div>
                {/* Footer */}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
};
export default ResetPassword;
