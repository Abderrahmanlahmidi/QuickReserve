import Hero from "../../components/mod/Home/Hero";
import Navbar from "../../components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <Hero />
      <section id="about" className="scroll-mt-24 py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-neutral-200 bg-white p-8 md:p-12">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">About</p>
              <h2 className="mt-3 text-3xl font-black text-neutral-900 md:text-4xl">
                Built for modern reservation teams
              </h2>
              <p className="mt-4 text-base text-neutral-600 md:text-lg">
                QuickReserve helps organizations manage bookings, prevent no-shows, and deliver a seamless guest
                experience across channels. Everything stays organized, auditable, and easy to manage.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  title: "Operational clarity",
                  description: "Centralize events, capacity, and guest data with clear status visibility.",
                },
                {
                  title: "Reliable workflows",
                  description: "Automate confirmations and keep teams aligned with consistent processes.",
                },
                {
                  title: "Professional guest experience",
                  description: "Present a polished booking journey that builds trust and reduces friction.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
                  <h3 className="text-lg font-bold text-neutral-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-neutral-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 rounded-[32px] border border-neutral-200 bg-white p-8 md:grid-cols-[1.1fr_0.9fr] md:p-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">Contact</p>
              <h2 className="mt-3 text-3xl font-black text-neutral-900 md:text-4xl">
                Let&apos;s plan your setup
              </h2>
              <p className="mt-4 text-base text-neutral-600 md:text-lg">
                Talk to our team about onboarding, migration, or enterprise requirements. We respond within one
                business day.
              </p>

              <div className="mt-8 space-y-4 text-sm text-neutral-600">
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <div>
                    <p className="font-semibold text-neutral-800">Email</p>
                    <p>support@quickreserve.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <div>
                    <p className="font-semibold text-neutral-800">Phone</p>
                    <p>+1 (555) 267-8901</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <div>
                    <p className="font-semibold text-neutral-800">Office</p>
                    <p>500 Market Street, Suite 1200, San Francisco, CA</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">Support</p>
                <p className="mt-3 text-sm font-semibold text-neutral-800">support@quickreserve.com</p>
                <p className="text-sm text-neutral-600">+1 (555) 267-8901</p>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">Hours</p>
                <p className="mt-3 text-sm font-semibold text-neutral-800">Monday - Friday</p>
                <p className="text-sm text-neutral-600">8:00 AM - 6:00 PM (PT)</p>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">Social</p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
                  <a href="https://www.linkedin.com" className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-neutral-700 hover:text-primary">
                    LinkedIn
                  </a>
                  <a href="https://www.x.com" className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-neutral-700 hover:text-primary">
                    X (Twitter)
                  </a>
                  <a href="https://www.facebook.com" className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-neutral-700 hover:text-primary">
                    Facebook
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-neutral-200 bg-white py-10">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-bold text-neutral-900">QuickReserve</p>
              <p className="text-sm text-neutral-500">Professional event reservation platform.</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm font-semibold text-neutral-600">
              <Link href="#about" className="hover:text-primary">About</Link>
              <Link href="#contact" className="hover:text-primary">Contact</Link>
              <Link href="/events" className="hover:text-primary">Events</Link>
              <Link href="/auth/login" className="hover:text-primary">Login</Link>
            </div>
          </div>
          <div className="mt-6 text-xs text-neutral-400">
            &copy; {new Date().getFullYear()} QuickReserve. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
} 
