"use client";
import React from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { BiDollar } from "react-icons/bi";
import toast from "react-hot-toast"; // Import toast from react-hot-toast

interface InputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  alphabetic?: boolean;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type,
  disabled,
  formatPrice,
  required,
  alphabetic,
  register,
  errors,
}) => {
  let pattern: RegExp | undefined;

  if (alphabetic) {
    // Alphabetic pattern
    pattern = /^[A-Za-z\s']+$/;
  } else if (type === "email") {
    // Email pattern
    pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  }

  const showErrorToast = () => {
    toast.error(`${label} is not in the correct format.`, {
      duration: 2000, // Adjust as needed
      position: "top-center",
    });
  };

  return (
    <div className="w-full relative">
      {formatPrice && (
        <BiDollar
          size={24}
          className="text-neutral-700 absolute top-5 left-2"
        />
      )}
      <input
        id={id}
        disabled={disabled}
        {...register(id, {
          required,
          pattern: pattern
            ? {
                value: pattern,
                message: `${label} is not in the correct format.`,
              }
            : undefined,
        })}
        placeholder=" "
        type={type}
        className={`peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-md transition disabled:opacity-70 disabled:cursor-not-allowed 
        ${formatPrice ? "pl-9" : "pl-4"}
        ${errors[id] ? "border-rose-500" : "border-neutral-300"}
        ${errors[id] ? "focus:border-rose-500" : "focus:border-black"}
        `}
        onBlur={() => {
          // Show error toast on blur if the input is invalid
          if (errors[id]) {
            showErrorToast();
          }
        }}
      />
      <label
        className={`absolute text-md duration-150 transform -translate-y-3 top-5 z-10 origine-[0]
        ${formatPrice ? "left-9" : "left-4"}
        peer-placeholder-shown:scale-100
        peer-placeholder-shown:translate-y-0
        peer-focus:scale-75
        peer-focus:-translate-y-4
        ${errors[id] ? "text-rose-500" : "text-zinc-400"}
        `}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
