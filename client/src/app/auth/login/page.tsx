import { Calendar } from "lucide-react";
import LoginForm from "../../../../components/mod/login/LoginForm";

export default function LoginPage() {
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
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}