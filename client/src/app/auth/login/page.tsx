import { Calendar } from "lucide-react";
import LoginForm from "../../../../components/mod/login/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4 relative overflow-hidden">

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] opacity-20" />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl mb-4">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-neutral-400">Sign in to manage your bookings</p>
        </div>

        <LoginForm />

      </div>
    </div>
  );
}