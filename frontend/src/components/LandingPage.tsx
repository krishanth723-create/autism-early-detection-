import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.24),_transparent_55%),linear-gradient(135deg,_#f8fbff_0%,_#eef6ff_100%)] px-4 py-16 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-[32px] border border-white/80 bg-white/80 p-8 shadow-[0_24px_80px_-20px_rgba(15,23,42,0.3)] backdrop-blur-xl lg:p-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex max-w-2xl flex-col gap-6">
            <div className="inline-flex w-fit rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700">
              Medical screening support
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Early developmental screening, made clear and supportive.
              </h1>
              <p className="text-lg leading-8 text-slate-600">
                This guided assessment helps caregivers reflect on early developmental signs in a calm, structured way. It is designed to support awareness and encourage timely professional consultation.
              </p>
            </div>

            <div className="mt-2 flex flex-row items-center gap-4">
              <Link
                to="/screening"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Start Assessment
              </Link>
              <a
                href="#"
                className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Learn more
              </a>
            </div>
          </div>

          <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
                Guided flow
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-300">
                10 questions
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              {[
                'Simple, calm question prompts',
                'Secure step-by-step progression',
                'Professional, accessible results guidance',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-400" />
                  <p className="text-sm leading-6 text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
