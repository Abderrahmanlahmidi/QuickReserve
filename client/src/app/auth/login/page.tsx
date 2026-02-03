"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Calendar, Eye, EyeOff } from "lucide-react";
import Alert from "../../../../components/mod/atoms/Alert";
import { LoginFormData, LoginResponse } from "../../../../types/auth";
import { loginUser } from "../../../../lib/auth/auth";

export default function LoginPage() {
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
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Show success alert
        setLoginSuccess(true);
        setServerError(null);

        // Redirect to home after 2 seconds
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

  // Auto-close success alert after redirect timeout
  useEffect(() => {
    if (loginSuccess) {
      const timer = setTimeout(() => {
        setLoginSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loginSuccess]);

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Billboard Background */}
      <div className="relative min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-900/95 to-neutral-900">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Branding */}
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-3 p-3 bg-neutral-800/50 backdrop-blur-sm rounded-lg border border-neutral-700">
                <div className="p-2 bg-primary rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">QuickReserve</h2>
                  <p className="text-sm text-neutral-400">Smart Booking Platform</p>
                </div>
              </div>

              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Welcome Back to <span className="text-primary">QuickReserve</span>
                </h1>
                <p className="text-lg text-neutral-300 mb-8">
                  Access your booking dashboard and manage all your reservations in one place.
                </p>

                <div className="space-y-4">
                  {[
                    "Manage all your bookings",
                    "Access real-time updates",
                    "Team collaboration tools",
                    "24/7 customer support",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-neutral-200">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side - Login Form */}
            <div className="bg-neutral-800/30 backdrop-blur-sm rounded-2xl border border-neutral-700 p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Sign In to Your Account
                </h2>
                <p className="text-neutral-400">
                  Don't have an account?{" "}
                  <Link href="/auth/register" className="text-primary font-semibold hover:underline">
                    Create one
                  </Link>
                </p>
              </div>

              {/* Success Alert */}
              {loginSuccess && (
                <Alert
                  type="success"
                  title="Login Successful!"
                  message={
                    <div>
                      <p>You have successfully logged in.</p>
                      <p className="mt-1">Redirecting to dashboard...</p>
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
                      className={`w-full pl-11 pr-4 py-3 bg-neutral-800/50 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors placeholder:text-neutral-500 ${
                        errors.email
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
                      className={`w-full pl-11 pr-12 py-3 bg-neutral-800/50 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors placeholder:text-neutral-500 ${
                        errors.password
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}