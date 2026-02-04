"use client";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import Alert from "../atoms/Alert";
import { LoginFormData, LoginResponse } from "../../../types/auth";
import { loginUser } from "../../../lib/auth/auth";

export default function LoginForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [loginSuccess, setLoginSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });



    const mutation = useMutation<LoginResponse, Error, LoginFormData>({
        mutationFn: loginUser,
        onSuccess: (data) => {
            if (data.access_token && data.user) {
                Cookies.set("access_token", data.access_token, { expires: 7, path: '/' });
                Cookies.set("user", JSON.stringify(data.user), { expires: 7, path: '/' });

                setLoginSuccess(true);
                setServerError(null);

                window.dispatchEvent(new Event("storage"));

                setTimeout(() => {
                    router.push("/");
                }, 2000);
            } else {
                setServerError("Invalid response from server");
                setLoginSuccess(false);
            }
        },
        onError: (error) => {
            setServerError(error.message || "Login failed. Please check your credentials.");
            setLoginSuccess(false);
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setServerError(null);
        setLoginSuccess(false);
        mutation.mutate(data);
    };

    useEffect(() => {
        if (loginSuccess) {
            const timer = setTimeout(() => {
                setLoginSuccess(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [loginSuccess]);

    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 sm:p-10">
            {/* Success Alert */}
            {loginSuccess && (
                <Alert
                    type="success"
                    title="Login Successful!"
                    message={
                        <div>
                            <p>You have successfully logged in.</p>
                        </div>
                    }
                    className="mb-6"
                />
            )}

            {/* Error Alert */}
            {serverError && (
                <Alert
                    type="error"
                    title="Login Failed"
                    message={serverError}
                    className="mb-6"
                    onClose={() => setServerError(null)}
                />
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
                            <Mail size={18} />
                        </div>
                        <input
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address",
                                },
                            })}
                            className={`w-full pl-11 pr-4 py-3 bg-neutral-800/50 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors placeholder:text-neutral-500 ${errors.email
                                ? "border-danger focus:ring-danger focus:border-danger"
                                : "border-neutral-700"
                                }`}
                            placeholder="john@example.com"
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-sm text-danger">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
                            <Lock size={18} />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters",
                                },
                            })}
                            className={`w-full pl-11 pr-12 py-3 bg-neutral-800/50 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors placeholder:text-neutral-500 ${errors.password
                                ? "border-danger focus:ring-danger focus:border-danger"
                                : "border-neutral-700"
                                }`}
                            placeholder="Enter your password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-sm text-danger">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3.5 bg-primary text-white font-semibold rounded-lg transition-colors duration-200 hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {mutation.isPending ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Signing In...</span>
                        </>
                    ) : (
                        <>
                            <span>Sign In</span>
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-neutral-400 text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/register" className="text-primary font-semibold hover:text-primary-hover transition-colors">
                        Create one now
                    </Link>
                </p>
            </div>
        </div>
    );
}
