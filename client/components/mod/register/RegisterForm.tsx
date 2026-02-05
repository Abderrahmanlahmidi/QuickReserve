"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    User,
    Mail,
    Lock,
    ArrowRight,
    Shield,
} from "lucide-react";
import FormInput from "../../ui/FormInput";
import Alert from "../atoms/Alert";
import { RegisterFormData, ApiResponse } from "../../../types/auth";
import { registerUser } from "../../../lib/auth/auth";

export default function RegisterForm() {
    const router = useRouter();
    const [showSuccess, setShowSuccess] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>({
        mode: "onBlur",
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const mutation = useMutation<ApiResponse, Error, RegisterFormData>({
        mutationFn: registerUser,
        onSuccess: () => {
            setShowSuccess(true);
            setServerError(null);

            setTimeout(() => {
                router.push("/auth/login");
            }, 3000);
        },
        onError: (error) => {
            setServerError(error.message);
            setShowSuccess(false);
        },
    });

    const password = watch("password");

    const onSubmit = async (data: RegisterFormData) => {
        setServerError(null);
        mutation.mutate(data);
    };

    return (
        <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-10">
            {/* Header removed */}

            {/* Success Alert */}
            {showSuccess && (
                <Alert
                    type="success"
                    title="Registration Successful!"
                    message={
                        <div>
                            <p>Your account has been created successfully.</p>
                            <p className="mt-1">Redirecting to login page...</p>
                        </div>
                    }
                    className="mb-6"
                />
            )}

            {/* Error Alert */}
            {serverError && (
                <Alert
                    type="error"
                    title="Registration Failed"
                    message={serverError}
                    className="mb-6"
                    onClose={() => setServerError(null)}
                />
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* First Name */}
                    <FormInput
                        label="First Name"
                        icon={User}
                        {...register("firstName", {
                            required: "First name is required",
                            minLength: {
                                value: 2,
                                message: "First name must be at least 2 characters",
                            },
                        })}
                        error={errors.firstName?.message}
                        placeholder="John"
                    />

                    {/* Last Name */}
                    <FormInput
                        label="Last Name"
                        icon={User}
                        {...register("lastName", {
                            required: "Last name is required",
                            minLength: {
                                value: 2,
                                message: "Last name must be at least 2 characters",
                            },
                        })}
                        error={errors.lastName?.message}
                        placeholder="Doe"
                    />
                </div>

                {/* Email */}
                <FormInput
                    label="Email Address"
                    type="email"
                    icon={Mail}
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                        },
                    })}
                    error={errors.email?.message}
                    placeholder="john@example.com"
                />

                {/* Password */}
                <FormInput
                    label="Password"
                    type="password"
                    icon={Lock}
                    {...register("password", {
                        required: "Password is required",
                        minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                        },
                        pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                            message: "Password must contain uppercase, lowercase, and numbers",
                        },
                    })}
                    error={errors.password?.message}
                    placeholder="Enter your password"
                />

                {/* Confirm Password */}
                <FormInput
                    label="Confirm Password"
                    type="password"
                    icon={Lock}
                    {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                            value === password || "Passwords do not match",
                    })}
                    error={errors.confirmPassword?.message}
                    placeholder="Confirm your password"
                />

                {/* Password Strength Indicator */}
                {password && (
                    <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-neutral-700">
                                Password Strength
                            </span>
                            <Shield size={16} className="text-primary" />
                        </div>
                        <div className="flex space-x-1 mb-2">
                            {[1, 2, 3, 4].map((level) => (
                                <div
                                    key={level}
                                    className={`h-1 flex-1 rounded-full ${password.length >= level * 2
                                        ? "bg-success"
                                        : "bg-neutral-200"
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-neutral-400">
                            Use at least 8 characters with uppercase, lowercase, and numbers
                        </p>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3.5 bg-primary text-white font-semibold rounded-lg transition-colors duration-200 hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {mutation.isPending ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Creating Account...</span>
                        </>
                    ) : (
                        <>
                            <span>Create Account</span>
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>

                <div className="text-center text-xs text-neutral-500 mt-6">
                    By creating an account, you agree to our terms and acknowledge our privacy policy.
                </div>
            </form>

            <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
                <p className="text-neutral-500 text-sm">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-primary font-semibold hover:text-primary-hover transition-colors">
                        Sign in instead
                    </Link>
                </p>
            </div>
        </div>
    );
}
