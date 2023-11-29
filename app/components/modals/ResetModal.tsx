"use client";
import React, { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import Button from "../Button";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Modal from "../modals/Modal";
import useResetPasswordModal from "../../hooks/useResetPasswordModal";

export default function ForgotPassword() {
  const resetPasswordModal = useResetPasswordModal();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
    },
  });
  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Forgot your Password no Problem !"
        subtitle="Enter your email"
      />
      <Input
        id="email"
        label="Email"
        type="email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      onClose={resetPasswordModal.onClose}
      isOpen={resetPasswordModal.isOpen}
      title="Reset Password"
      actionlabel="Submit"
      onSubmit={() => {}}
      body={bodyContent}
    />
  );
}
