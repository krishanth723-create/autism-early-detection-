import React, { useMemo, useState } from "react";

type Question = {
  id: number;
  text: string;
  detail: string;
};

const questions: Question[] = [
  {
    id: 1,
    text: "Does your child make eye contact during social interactions?",
    detail: "This can include looking at faces during play, conversation, or shared attention.",
  },
  {
    id: 2,
    text: "Does your child respond to their name when called?",
    detail: "A reliable response to name is an important early social milestone.",
  },
  {
    id: 3,
    text: "Do they enjoy pretend play or imaginative activities?",
    detail: "This may include pretending a toy is a person, animal, or object.",
  },
  {
    id: 4,
    text: "Do they use gestures such as waving, pointing, or showing?",
    detail: "These gestures often support early communication and social connection.",
  },
  {
    id: 5,
    text: "Do they have difficulty understanding other people's feelings or intentions?",
    detail: "This can appear as trouble reading facial expressions or social cues.",
  },
  {
    id: 6,
    text: "Do they repeat certain phrases or sounds in a rigid way?",
    detail: "Repetition of phrases or specific routines can be a common observation.",
  },
  {
    id: 7,
    text: "Do they become upset by small changes in routine?",
    detail: "Strong preference for predictability can be meaningful in assessment.",
  },
  {
    id: 8,
    text: "Do they show intense interests in a narrow topic or object?",
    detail: "Highly focused interests can sometimes be part of the picture.",
  },
  {
    id: 9,
    text: "Do they struggle to start or maintain back-and-forth conversation?",
    detail: "This may include difficulty taking turns in dialogue or play.",
  },
  {
    id: 10,
    text: "Do they need extra support in everyday social or learning settings?",
    detail: "Support needs can reflect broader developmental differences.",
  },
];

type ApiResult = {
  probability?: number;
  risk_level?: string;
  message?: string;
  total_score?: number;
  answers?: number[];
  record_id?: string;
  user_id?: string;
  child_age_months?: number;
  gender?: string;
  ai_risk_probability?: number;
  created_at?: string;
} | null;

const ScreenPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(0));
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState<ApiResult>(null);
  const [ageMonths, setAgeMonths] = useState(24);
  const [gender, setGender] = useState("male");
  const [jaundiceHistory, setJaundiceHistory] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const currentQuestion = questions[currentStep];
  const progressPercent = useMemo(() => ((currentStep + 1) / questions.length) * 100, [currentStep]);
  const riskPercentage = apiResult
    ? Math.round(
        typeof apiResult.probability === "number"
          ? apiResult.probability
          : typeof apiResult.ai_risk_probability === "number"
            ? apiResult.ai_risk_probability * 100
            : 0,
      )
    : 0;

  const handleAnswer = async (value: 0 | 1) => {
    const nextAnswers = [...answers];
    nextAnswers[currentStep] = value;
    setAnswers(nextAnswers);

    if (currentStep === questions.length - 1) {
      await handleSubmit(nextAnswers);
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handleSubmit = async (finalAnswers: number[]) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:8000/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: finalAnswers }),
      });

      if (!response.ok) {
        console.error("Prediction request failed", response.status, response.statusText);
        throw new Error("The screening service could not process your responses right now.");
      }

      const data = (await response.json()) as ApiResult;
      console.log("Prediction response received", data);
      setApiResult(data);
    } catch (error) {
      console.error("Prediction request error", error);
      const message = error instanceof Error ? error.message : "An unexpected error occurred.";
      setErrorMessage(message);
      setApiResult(null);
    } finally {
      setLoading(false);
    }
  };

  const resetScreening = () => {
    setCurrentStep(0);
    setAnswers(Array(questions.length).fill(0));
    setApiResult(null);
    setErrorMessage("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-center rounded-[28px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center">
            <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
            <h2 className="text-2xl font-semibold">Analyzing your screening responses</h2>
            <p className="mt-2 text-sm text-slate-300">Please wait while we connect to the assessment service.</p>
          </div>
        </div>
      </div>
    );
  }

  if (apiResult) {
    const isHighRisk = riskPercentage >= 70;
    const isLowRisk = riskPercentage < 40;

    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.24),_transparent_55%),linear-gradient(135deg,_#f8fbff_0%,_#eef6ff_100%)] px-4 py-10 text-slate-800 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <div className="rounded-[28px] border border-white/80 bg-white/85 p-6 shadow-[0_20px_80px_-20px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:p-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-700">Screening complete</p>
                <h1 className="mt-1 text-3xl font-semibold text-slate-900">Assessment summary</h1>
              </div>
              <button
                type="button"
                onClick={resetScreening}
                className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Start again
              </button>
            </div>

            <div className={`rounded-[24px] border p-6 ${isHighRisk ? "border-rose-200 bg-rose-50" : isLowRisk ? "border-cyan-200 bg-cyan-50" : "border-amber-200 bg-amber-50"}`}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Estimated risk</p>
                  <div className="mt-2 text-5xl font-semibold text-slate-900">{riskPercentage}%</div>
                  <p className="mt-2 text-sm text-slate-600">
                    This estimate is based on the responses provided and the screening model.
                  </p>
                </div>
                <div className={`rounded-2xl px-4 py-4 text-sm font-medium ${isHighRisk ? "bg-rose-600 text-white" : isLowRisk ? "bg-cyan-600 text-white" : "bg-amber-500 text-white"}`}>
                  {isHighRisk ? "High Risk" : isLowRisk ? "Low Risk" : "Moderate Risk"}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-lg font-semibold text-slate-900">Clinical guidance</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  This tool is designed for early awareness and does not replace a professional evaluation. A pediatrician or qualified developmental specialist should review the outcome and discuss next steps if needed.
                </p>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                <h2 className="text-lg font-semibold text-slate-900">Submission details</h2>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>Record ID: {apiResult.record_id ?? "—"}</li>
                  <li>Total score: {apiResult.total_score ?? "—"}</li>
                  <li>Age: {apiResult.child_age_months ?? ageMonths} months</li>
                  <li>Gender: {apiResult.gender ?? gender}</li>
                </ul>
              </div>
            </div>

            {errorMessage ? (
              <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.20),_transparent_50%),linear-gradient(135deg,_#f8fbff_0%,_#eef6ff_100%)] px-4 py-10 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="rounded-[28px] border border-white/80 bg-white/85 p-4 shadow-[0_20px_80px_-20px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-700">Autism early screening</p>
              <h1 className="mt-1 text-3xl font-semibold text-slate-900">Child development questionnaire</h1>
            </div>
            <div className="text-sm font-medium text-slate-500">Question {currentStep + 1} of {questions.length}</div>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-fuchsia-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6 shadow-inner">
              <div className="mb-4 inline-flex rounded-full bg-cyan-100 px-3 py-1 text-sm font-semibold text-cyan-700">
                Step {currentStep + 1}
              </div>
              <h2 className="text-2xl font-semibold leading-tight text-slate-900">{currentQuestion.text}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{currentQuestion.detail}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => void handleAnswer(1)}
                  className="flex-1 rounded-2xl bg-emerald-600 px-5 py-4 text-left text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => void handleAnswer(0)}
                  className="flex-1 rounded-2xl border border-slate-300 bg-white px-5 py-4 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  No
                </button>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-5">
              <h3 className="text-lg font-semibold text-slate-900">Optional context</h3>
              <div className="mt-4 space-y-4">
                <label className="block text-sm text-slate-600">
                  <span className="mb-1 block font-medium text-slate-700">Child age (months)</span>
                  <input
                    type="number"
                    min="6"
                    max="72"
                    value={ageMonths}
                    onChange={(event) => setAgeMonths(Number(event.target.value))}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-0 focus:border-cyan-500"
                  />
                </label>

                <label className="block text-sm text-slate-600">
                  <span className="mb-1 block font-medium text-slate-700">Gender</span>
                  <select
                    value={gender}
                    onChange={(event) => setGender(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-cyan-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </label>

                <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={jaundiceHistory}
                    onChange={(event) => setJaundiceHistory(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-cyan-600"
                  />
                  Jaundice history
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenPage;
