import { Calendar } from "lucide-react";
import RegisterForm from "../../../../components/mod/register/RegisterForm";

export default function RegisterPage() {
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
              Create your team workspace
            </h1>
            <p className="mt-4 text-base text-neutral-600">
              Launch a clean, professional booking experience with tools built for reliability and scale.
            </p>
            <div className="mt-8 space-y-4">
              {[
                {
                  title: "Launch in minutes",
                  description: "Create categories, publish events, and accept reservations quickly.",
                },
                {
                  title: "Keep teams aligned",
                  description: "Track attendee status and updates in one secure dashboard.",
                },
                {
                  title: "Delight your guests",
                  description: "Send clear confirmation flows and reduce no-shows.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
                  <p className="mt-1 text-sm text-neutral-600">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-[32px] border border-neutral-200 bg-white p-8">
            <div className="space-y-2 text-center">
              <div className="mx-auto inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-black text-neutral-900 tracking-tight">Create an Account</h2>
              <p className="text-neutral-500">Join thousands of successful businesses</p>
            </div>
            <div className="mt-8">
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
