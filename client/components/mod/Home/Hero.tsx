import { ArrowRight, Star, Check, Zap } from "lucide-react";


export default function Hero() {
  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Hero Section */}
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-10">
            {/* Trust Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2.5 border border-neutral-700 rounded-full text-neutral-300 text-sm font-medium">
              <Star size={16} className="text-white" />
              <span>Trusted by 10,000+ businesses worldwide</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
                Smart Booking,
                <br />
                <span className="text-white">
                  Simplified
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
                Transform your reservation process with QuickReserve. Streamline bookings,
                manage schedules, and delight your customers with our intuitive platform.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <button className="group flex items-center space-x-3 px-8 py-3.5 bg-primary text-white font-semibold rounded-lg transition-colors duration-200 hover:bg-primary-hover">
                <span>Get Started Free</span>
                <ArrowRight size={20} className="transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <button className="group flex items-center space-x-3 px-8 py-3.5 border border-neutral-700 text-neutral-300 font-semibold rounded-lg transition-colors duration-200 hover:border-neutral-500 hover:text-white">
                <span>Watch Demo</span>
                <Zap size={20} />
              </button>
            </div>

            {/* Key Benefits */}
            <div className="flex flex-wrap justify-center gap-6 pt-12">
              {[
                "No credit card required",
                "14-day free trial",
                "Cancel anytime",
                "24/7 support",
                "99.9% uptime"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2 text-neutral-400 text-sm font-medium">
                  <Check size={16} className="text-primary" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}