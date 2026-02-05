import { Calendar } from "lucide-react";
import LoginForm from "../../../../components/mod/login/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto flex w-full max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[32px] border border-neutral-200 bg-white p-8 md:p-10">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-neutral-600">QuickReserve</span>
            </div>
            <h1 className="mt-6 text-3xl font-black text-neutral-900 md:text-4xl">
              Professional booking management
            </h1>
            <p className="mt-4 text-base text-neutral-600">
              Keep reservations organized, teams aligned, and guests informed with a platform designed for clarity.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                "Unified event dashboard",
                "Automated confirmations",
                "Clear capacity tracking",
                "Audit-ready reports",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-700">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-[32px] border border-neutral-200 bg-white p-8">
            <div className="space-y-2 text-center">
              <div className="mx-auto inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-black text-neutral-900 tracking-tight">Welcome Back</h2>
              <p className="text-neutral-500">Sign in to manage your bookings</p>
            </div>
            <div className="mt-8">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
