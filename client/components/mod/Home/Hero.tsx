import { ArrowRight, Star, Zap } from "lucide-react";


export default function Hero() {
  return (
    <div className="relative min-h-screen bg-neutral-900 overflow-hidden flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] opacity-20" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] opacity-20" />
      </div>

      <main className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-12">

            {/* Trust Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg shadow-black/20 animate-fade-in-up">
              <div className="p-1 bg-primary/20 rounded-full">
                <Star size={12} className="text-white fill-white" />
              </div>
              <span className="text-sm font-medium text-neutral-200 tracking-wide">Trusted by 10,000+ businesses worldwide</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter leading-[1.1]">
                Smart Booking,
                <br />
                <span className="text-white">
                  Simplified.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed font-light">
                Transform your reservation process with QuickReserve. Streamline bookings,
                manage schedules, and delight your customers with our intuitive platform.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
              <button className="group relative flex items-center space-x-3 px-8 py-4 bg-primary text-white font-semibold rounded-full shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/40 hover:-translate-y-0.5 hover:scale-105 active:scale-95">
                <span>Get Started Free</span>
                <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
                <div className="absolute inset-0 rounded-full ring-1 ring-white/20 group-hover:ring-white/30" />
              </button>

              <button className="group flex items-center space-x-3 px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-full transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 active:scale-95 backdrop-blur-sm">
                <span>Watch Demo</span>
                <Zap size={20} className="text-neutral-400 group-hover:text-white transition-colors" />
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
                <div key={index} className="flex items-center space-x-2.5 text-neutral-400 text-sm font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
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