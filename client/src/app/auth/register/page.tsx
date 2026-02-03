import { Calendar, CheckCircle } from "lucide-react";
import RegisterForm from "../../../../components/mod/register/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Billboard Background */}
      <div className="relative min-h-screen bg-linear-to-br from-neutral-900 via-neutral-900/95 to-neutral-900">
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
                  Join Thousands of <span className="text-white">Successful</span> Businesses
                </h1>
                <p className="text-lg text-neutral-300 mb-8">
                  Start streamlining your booking process today. No credit card required for the 14-day free trial.
                </p>

                <div className="space-y-4">
                  {[
                    "Secure and reliable platform",
                    "24/7 customer support",
                    "Easy-to-use interface",
                    "Scalable for businesses of all sizes",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span className="text-neutral-200">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side - Registration Form */}
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}