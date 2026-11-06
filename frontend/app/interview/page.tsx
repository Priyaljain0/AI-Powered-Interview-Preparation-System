"use client";

import { useState } from "react";

const API_BASE_URL = "http://127.0.0.1:8000";

const sectors = [
  "FoodTech",
  "Drones & Aerial Platforms",
  "Cybersecurity",
  "Logistics & Supply Chain",
  "SaaS & Cloud Platforms",
  "AdTech",
  "AI & Data Platforms",
  "Gaming",
  "FinTech",
  "E-Commerce & Global Trade",
  "HealthTech & BioTech",
  "DefenseTech",
];

const categories = [
  "Communication & Soft Skills",
  "Innovation & Emerging Tech",
  "Tools & Frameworks",
  "Debugging & Troubleshooting",
  "Technical Roadmap & Strategy",
  "Prioritization Under Pressure",
  "Coding & Problem Solving",
  "Collaboration & Cross-Team Work",
  "Conflict Resolution",
  "Business Impact & Metrics",
  "Salary & Expectations",
  "Motivation & Career Goals",
  "Incident Response & Ownership",
  "Scalability & Growth Planning",
  "System Design & Architecture",
  "Culture Fit & Values",
];

const levels = [
  "Level 1: Foundational",
  "Level 2: Practical",
  "Level 3: Edge Case & Conflict",
];

type Question = {
  _id: string;
  question: string;
  sector: string;
  category: string;
  level: string;
};

type CriterionEvaluation = {
  criterion: string;
  status: "addressed" | "partial" | "missing";
  score: number;
  explanation: string;
};

type Evaluation = {
  score: number;
  criteria_evaluation: CriterionEvaluation[];
  strengths: string[];
  missing_concepts: string[];
  feedback: string;
  learning_recommendations: string[];
  improved_answer: string;
};

export default function InterviewPage() {
  const [sector, setSector] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");

  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");

  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [evaluating, setEvaluating] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Temporary user ID.
  // Login ke baad iski jagah authenticated user ID aayegi.
  const userId = "demo-user";

  const startInterview = async () => {
    if (!sector || !category || !level) {
      setError("Please select sector, category and difficulty level.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setQuestion(null);
    setAnswer("");
    setEvaluation(null);

    try {
      const params = new URLSearchParams({
        user_id: userId,
        sector,
        category,
        level,
      });

      const response = await fetch(
        `${API_BASE_URL}/random-question?${params.toString()}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch question.");
      }

      setQuestion(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while fetching the question."
      );
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!question) {
      setError("Please start an interview first.");
      return;
    }

    if (!answer.trim()) {
      setError("Please write an answer before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      setEvaluating(true);

      setError("");
      setSuccess("");
      setEvaluation(null);

      // 1. Save the answer
      const response = await fetch(
        `${API_BASE_URL}/answers?user_id=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question_id: question._id,
            answer: answer,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit answer");
      }

      // 2. Evaluate the answer using the LLM
      const evaluationResponse = await fetch(
        `${API_BASE_URL}/evaluate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question.question,
            answer: answer,
            category: question.category,
          }),
        }
      );
      if (!evaluationResponse.ok) {
        const errorData = await evaluationResponse.json();

        console.log("Evaluation error:", errorData);

        throw new Error(
          `Evaluation failed: ${JSON.stringify(errorData)}`
        );
      }

      // 3. Get evaluation result
      const evaluationData = await evaluationResponse.json();

      // 4. Store evaluation in frontend state
      setEvaluation(evaluationData);

      setSuccess("Answer submitted and evaluated successfully.");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
      setEvaluating(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f9fb] text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
              InterviewAI
            </p>

            <h1 className="mt-1 text-xl font-bold text-slate-950">
              Interview Practice
            </h1>
          </div>

          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
            Practice Session
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">

          {/* Setup Panel */}
          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm font-semibold text-indigo-600">
                STEP 01
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-950">
                Set up your interview
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Choose what you want to practice and we'll generate a relevant
                interview question.
              </p>
            </div>

            {/* Sector */}
            <div className="mt-7">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Sector
              </label>

              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Select sector</option>

                {sectors.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Select category</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Level */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Difficulty
              </label>

              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Select difficulty</option>

                {levels.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Start */}
            <button
              onClick={startInterview}
              disabled={loading}
              className="mt-7 w-full rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Getting Question..." : "Start Interview →"}
            </button>

            {/* Info */}
            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-700">
                How it works
              </p>

              <ul className="mt-2 space-y-2 text-xs leading-5 text-slate-500">
                <li>• Select your practice preferences</li>
                <li>• Get a random question</li>
                <li>• Submit your answer</li>
                <li>• AI evaluates your answer</li>
                <li>• Review detailed feedback</li>
              </ul>
            </div>
          </aside>

          {/* Interview Area */}
          <section className="min-h-[600px] rounded-3xl border border-slate-200 bg-white p-7 shadow-sm lg:p-10">
            {!question ? (
              <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
                  🎯
                </div>

                <h2 className="mt-6 text-2xl font-bold text-slate-950">
                  Your interview starts here
                </h2>

                <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
                  Select your sector, category and difficulty level from the
                  setup panel to receive your first question.
                </p>
              </div>
            ) : (
              <>
                {/* Question Header */}
                <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
                      Interview Question
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                        {question.sector}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {question.category}
                      </span>

                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        {question.level}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-500">
                    Question 1
                  </div>
                </div>

                {/* Question */}
                <div className="py-10">
                  <h2 className="max-w-4xl text-2xl font-bold leading-9 text-slate-950 sm:text-3xl">
                    {question.question}
                  </h2>
                </div>

                {/* Answer */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700">
                      Your answer
                    </label>

                    <span className="text-xs text-slate-400">
                      {answer.length} characters
                    </span>
                  </div>

                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Explain your answer clearly. You can discuss your approach, reasoning and examples..."
                    rows={10}
                    className="w-full resize-none rounded-2xl border border-slate-300 bg-slate-50 px-5 py-4 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                {/* Actions */}
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    onClick={startInterview}
                    disabled={loading || submitting}
                    className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Loading..." : "Next Question"}
                  </button>

                  <button
                    onClick={submitAnswer}
                    disabled={submitting}
                    className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {evaluating
                      ? "AI Evaluating..."
                      : submitting
                      ? "Submitting..."
                      : "Submit Answer →"}
                  </button>
                </div>

                {/* AI Evaluation Loading */}
                {evaluating && (
                  <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />

                      <div>
                        <p className="font-semibold text-indigo-900">
                          AI is evaluating your answer...
                        </p>

                        <p className="mt-1 text-sm text-indigo-700">
                          Your answer is being checked against the interview
                          criteria.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Evaluation Result */}
                {evaluation && !evaluating && (
                  <div className="mt-8 space-y-6">

                    {/* Score */}
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
                            AI Evaluation
                          </p>

                          <h3 className="mt-2 text-2xl font-bold text-slate-950">
                            Your Interview Score
                          </h3>
                        </div>

                        <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white shadow-sm">
                          <span className="text-3xl font-bold text-indigo-600">
                            {evaluation.score}
                          </span>

                          <span className="text-xs font-medium text-slate-400">
                            / 10
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Criteria Evaluation */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6">
                      <h3 className="text-xl font-bold text-slate-950">
                        Criteria Evaluation
                      </h3>

                      <div className="mt-5 space-y-4">
                        {evaluation.criteria_evaluation.map(
                          (item, index) => (
                            <div
                              key={`${item.criterion}-${index}`}
                              className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
                            >
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                  <p className="font-semibold text-slate-800">
                                    {item.criterion}
                                  </p>

                                  <p className="mt-2 text-sm leading-6 text-slate-600">
                                    {item.explanation}
                                  </p>
                                </div>

                                <span
                                  className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                                    item.status === "addressed"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : item.status === "partial"
                                      ? "bg-amber-100 text-amber-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Strengths */}
                    {evaluation.strengths.length > 0 && (
                      <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6">
                        <h3 className="text-xl font-bold text-emerald-900">
                          Strengths
                        </h3>

                        <ul className="mt-4 space-y-3">
                          {evaluation.strengths.map((item, index) => (
                            <li
                              key={index}
                              className="flex gap-3 text-sm leading-6 text-emerald-800"
                            >
                              <span className="font-bold">✓</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Missing Concepts */}
                    {evaluation.missing_concepts.length > 0 && (
                      <div className="rounded-3xl border border-amber-100 bg-amber-50 p-6">
                        <h3 className="text-xl font-bold text-amber-900">
                          Concepts to Improve
                        </h3>

                        <ul className="mt-4 space-y-3">
                          {evaluation.missing_concepts.map(
                            (item, index) => (
                              <li
                                key={index}
                                className="flex gap-3 text-sm leading-6 text-amber-800"
                              >
                                <span className="font-bold">•</span>
                                <span>{item}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Feedback */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6">
                      <h3 className="text-xl font-bold text-slate-950">
                        Feedback
                      </h3>

                      <p className="mt-4 text-sm leading-7 text-slate-600">
                        {evaluation.feedback}
                      </p>
                    </div>

                    {/* Learning Recommendations */}
                    {evaluation.learning_recommendations.length > 0 && (
                      <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-6">
                        <h3 className="text-xl font-bold text-indigo-900">
                          Learning Recommendations
                        </h3>

                        <ul className="mt-4 space-y-3">
                          {evaluation.learning_recommendations.map(
                            (item, index) => (
                              <li
                                key={index}
                                className="flex gap-3 text-sm leading-6 text-indigo-800"
                              >
                                <span className="font-bold">
                                  {index + 1}.
                                </span>

                                <span>{item}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Improved Answer */}
                    <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6">
                      <p className="text-sm font-semibold uppercase tracking-widest text-indigo-300">
                        Practice Again
                      </p>

                      <h3 className="mt-2 text-xl font-bold text-white">
                        Improved Answer
                      </h3>

                      <p className="mt-4 text-sm leading-7 text-slate-300">
                        {evaluation.improved_answer}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}