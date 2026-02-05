import { ArrowRight, Star, Zap } from "lucide-react";


export default function Hero() {
  return (
    <div className="relative min-h-screen bg-neutral-50 overflow-hidden flex items-center justify-center">
      <main className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative max-w-6xl mx-auto">
          <div aria-hidden="true" className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 lg:block">
            <svg
              className="h-[520px] w-[520px] text-neutral-200"
              viewBox="0 0 640 640"
              fill="none"
            >
              <rect x="90" y="80" width="400" height="320" rx="32" className="fill-white stroke-neutral-300" strokeWidth="2" />
              <line x1="90" y1="150" x2="490" y2="150" className="stroke-neutral-300" strokeWidth="2" />
              <circle cx="150" cy="120" r="8" className="fill-neutral-300" />
              <circle cx="210" cy="120" r="8" className="fill-neutral-300" />
              <rect x="130" y="200" width="150" height="120" rx="18" className="fill-neutral-100 stroke-neutral-300" strokeWidth="2" />
              <path d="M160 260 L178 278 L214 242" className="stroke-primary" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="310" y="200" width="150" height="120" rx="18" className="fill-neutral-100 stroke-neutral-300" strokeWidth="2" />
              <rect x="130" y="340" width="330" height="36" rx="18" className="fill-neutral-100" />
              <rect x="70" y="430" width="280" height="160" rx="28" className="fill-white stroke-neutral-300" strokeWidth="2" />
              <path d="M110 510 L128 528 L164 492" className="stroke-primary" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-12 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white border border-neutral-200 animate-fade-in-up mx-auto lg:mx-0">
                <div className="p-1 bg-primary/10 rounded-full">
                  <Star size={12} className="text-primary fill-primary" />
                </div>
                <span className="text-sm font-medium text-neutral-600 tracking-wide">
                  Trusted by 10,000+ businesses worldwide
                </span>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-neutral-900 tracking-tighter leading-[1.1]">
                  Smart Booking,
                  <br />
                  <span className="text-primary">
                    Simplified.
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Transform your reservation process with QuickReserve. Streamline bookings,
                  manage schedules, and delight your customers with our intuitive platform.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 pt-4">
                <button className="group relative flex items-center space-x-3 px-8 py-4 bg-primary text-white font-semibold rounded-full transition-colors hover:bg-primary-hover">
                  <span>Get Started Free</span>
                  <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                <button className="group flex items-center space-x-3 px-8 py-4 bg-white border border-neutral-200 text-neutral-700 font-semibold rounded-full transition-colors hover:bg-neutral-50 hover:border-neutral-300">
                  <span>Watch Demo</span>
                  <Zap size={20} className="text-neutral-400 group-hover:text-primary transition-colors" />
                </button>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4 pt-8">
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

            <div className="hidden lg:flex justify-end">
              <div className="w-full max-w-sm rounded-[28px] border border-neutral-200 bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
                  Live overview
                </p>
                <div className="mt-5 space-y-4">
                  {[
                    { label: "Upcoming events", value: "128" },
                    { label: "Reservations today", value: "1,284" },
                    { label: "Avg. confirmation time", value: "12 min" },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                      <span className="text-sm font-semibold text-neutral-700">{stat.label}</span>
                      <span className="text-sm font-bold text-neutral-900">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
