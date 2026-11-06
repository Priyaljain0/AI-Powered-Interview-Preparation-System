import Link from "next/link";

const practiceModes = [
  {
    number: "01",
    title: "Role-Based Interviews",
    description:
      "Practice interviews tailored to your target software and AI engineering role.",
    tag: "Career",
  },
  {
    number: "02",
    title: "Technical Practice",
    description:
      "Strengthen Python, APIs, databases, system design, debugging and AI concepts.",
    tag: "Technical",
  },
  {
    number: "03",
    title: "AI-Powered Evaluation",
    description:
      "Get structured feedback on correctness, communication, completeness and reasoning.",
    tag: "AI",
  },
];

const features = [
  "Role & difficulty based questions",
  "AI-powered answer evaluation",
  "RAG-grounded interview feedback",
  "Voice-based interview practice",
  "Performance analytics",
  "Interview history & progress tracking",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8f9fb] text-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
              I
            </div>

            <span className="text-lg font-bold tracking-tight">
              Interview<span className="text-indigo-600">AI</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <Link href="#practice" className="transition hover:text-slate-900">
              Practice
            </Link>

            <Link href="#features" className="transition hover:text-slate-900">
              Features
            </Link>

            <Link href="#how-it-works" className="transition hover:text-slate-900">
              How it works
            </Link>
          </div>

          <Link
            href="/interview"
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Start Practice
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-100/60 blur-3xl" />

        <div className="mx-auto grid max-w-7xl gap-16 px-6 pb-24 pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-28 lg:pt-28">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-sm font-medium text-indigo-700">
              <span className="h-2 w-2 rounded-full bg-indigo-600" />
              AI-powered interview practice
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Practice smarter.
              <br />
              <span className="text-indigo-600">Interview better.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
              Prepare for technical and behavioral interviews with realistic
              questions, AI-powered evaluation, personalized feedback and
              performance analytics.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/interview"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Start an Interview
                <span className="ml-2">→</span>
              </Link>

              <Link
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Explore Features
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
              <span>✓ Structured feedback</span>
              <span>✓ Personalized practice</span>
              <span>✓ Progress tracking</span>
            </div>
          </div>

          {/* Preview Card */}
          <div className="relative flex items-center justify-center">
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/10">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Live Interview
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    Software Engineer
                  </p>
                </div>

                <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Question 3 / 10
                </div>
              </div>

              <div className="py-7">
                <p className="text-sm font-medium text-indigo-600">
                  System Design
                </p>

                <h2 className="mt-3 text-xl font-semibold leading-8 text-slate-900">
                  How would you design a scalable API for millions of users?
                </h2>

                <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">
                      Your answer
                    </span>

                    <span className="text-xs text-slate-400">00:48</span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-slate-200">
                    <div className="h-2 w-3/5 rounded-full bg-indigo-600" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600">
                  🎤 Voice
                </button>

                <button className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white">
                  Submit Answer
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 px-6 sm:grid-cols-3 lg:px-8">
          <div className="border-b border-slate-200 px-6 py-8 text-center sm:border-b-0 sm:border-r">
            <p className="text-3xl font-bold text-slate-950">20K+</p>
            <p className="mt-1 text-sm text-slate-500">
              Interview questions
            </p>
          </div>

          <div className="border-b border-slate-200 px-6 py-8 text-center sm:border-b-0 sm:border-r">
            <p className="text-3xl font-bold text-slate-950">AI</p>
            <p className="mt-1 text-sm text-slate-500">
              Structured answer evaluation
            </p>
          </div>

          <div className="px-6 py-8 text-center">
            <p className="text-3xl font-bold text-slate-950">RAG</p>
            <p className="mt-1 text-sm text-slate-500">
              Context-grounded feedback
            </p>
          </div>
        </div>
      </section>

      {/* Practice Modes */}
      <section id="practice" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
            Practice your way
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
            One platform for your interview preparation.
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            Practice according to your role, skill level and preparation
            goals. Every session contributes to your performance history.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {practiceModes.map((mode) => (
            <div
              key={mode.number}
              className="group rounded-3xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-slate-900/5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400">
                  {mode.number}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {mode.tag}
                </span>
              </div>

              <h3 className="mt-10 text-xl font-bold text-slate-950">
                {mode.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                {mode.description}
              </p>

              <Link
                href="/interview"
                className="mt-7 inline-flex text-sm font-semibold text-indigo-600 transition group-hover:translate-x-1"
              >
                Start practicing →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
                Built for improvement
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                More than just a question bank.
              </h2>

              <p className="mt-6 max-w-xl leading-8 text-slate-400">
                The goal is not simply to answer more questions. The system
                should understand your answers, identify gaps and help you
                improve over time.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                >
                  <div className="flex gap-3">
                    <span className="text-indigo-400">✓</span>
                    <span className="text-sm leading-6 text-slate-200">
                      {feature}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
            How it works
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
            From practice to measurable progress.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-indigo-50 p-8">
            <span className="text-sm font-bold text-indigo-600">01</span>
            <h3 className="mt-5 text-xl font-bold text-slate-950">
              Choose your practice
            </h3>
            <p className="mt-3 leading-7 text-slate-600">
              Select your sector, category and difficulty level.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-100 p-8">
            <span className="text-sm font-bold text-slate-700">02</span>
            <h3 className="mt-5 text-xl font-bold text-slate-950">
              Answer realistic questions
            </h3>
            <p className="mt-3 leading-7 text-slate-600">
              Practice through text and eventually voice-based interviews.
            </p>
          </div>

          <div className="rounded-3xl bg-emerald-50 p-8">
            <span className="text-sm font-bold text-emerald-600">03</span>
            <h3 className="mt-5 text-xl font-bold text-slate-950">
              Understand your performance
            </h3>
            <p className="mt-3 leading-7 text-slate-600">
              Receive AI feedback and track improvement across sessions.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-indigo-600 px-8 py-16 text-center text-white shadow-2xl shadow-indigo-600/20 sm:px-16">
          <h2 className="text-4xl font-bold tracking-tight">
            Ready to practice?
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-indigo-100">
            Start your next interview session and turn every answer into
            measurable progress.
          </p>

          <Link
            href="/interview"
            className="mt-8 inline-flex rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-indigo-700 transition hover:-translate-y-0.5 hover:bg-indigo-50"
          >
            Start Interview →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>
            © 2026 InterviewAI. Built for smarter interview preparation.
          </p>

          <p>AI-powered • FastAPI • Next.js • MongoDB</p>
        </div>
      </footer>
    </main>
  );
}