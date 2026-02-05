import { ArrowRight, Star, Zap } from "lucide-react";


export default function Hero() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden flex items-center justify-center">
      {/* Background Effects - Clean white, maybe subtle pattern if needed, but keeping clean for now */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-100/50 via-white to-white pointer-events-none" />

      <main className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-12">

            {/* Trust Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white border border-neutral-200 animate-fade-in-up">
              <div className="p-1 bg-primary/10 rounded-full">
                <Star size={12} className="text-primary fill-primary" />
              </div>
              <span className="text-sm font-medium text-neutral-600 tracking-wide">Trusted by 10,000+ businesses worldwide</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-neutral-900 tracking-tighter leading-[1.1]">
                Smart Booking,
                <br />
                <span className="text-primary">
                  Simplified.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed font-normal">
                Transform your reservation process with QuickReserve. Streamline bookings,
                manage schedules, and delight your customers with our intuitive platform.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
              <button className="group relative flex items-center space-x-3 px-8 py-4 bg-primary text-white font-semibold rounded-full transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:scale-105 active:scale-95">
                <span>Get Started Free</span>
                <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button className="group flex items-center space-x-3 px-8 py-4 bg-white border border-neutral-200 text-neutral-700 font-semibold rounded-full transition-all duration-300 hover:bg-neutral-50 hover:border-neutral-300 hover:-translate-y-0.5 active:scale-95">
                <span>Watch Demo</span>
                <Zap size={20} className="text-neutral-400 group-hover:text-primary transition-colors" />
              </button>
            </div>

            {/* Key Benefits */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 pt-8">
              {[
                "No credit card required",
                "14-day free trial",
                "Cancel anytime",
                "24/7 support",
                "99.9% uptime"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2.5 text-neutral-500 text-sm font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
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