import React, { useMemo, useState } from "react";

type Question = {
  id: number;
  prompt: string;
  description: string;
  category: string;
};

type Choice = {
  value: string;
  label: string;
  tone: string;
};

const questions: Question[] = [
  {
    id: 1,
    prompt: "Does the child often avoid eye contact during conversations or play?",
    description: "Notice how often they engage visually with others.",
    category: "Social engagement",
  },
  {
    id: 2,
    prompt: "Do they repeat the same words or phrases frequently?",
    description: "This can show up as echoing or repeating familiar sounds.",
    category: "Communication",
  },
  {
    id: 3,
    prompt: "Do they prefer routines and become upset by small changes?",
    description: "A strong preference for predictability can be an important sign.",
    category: "Behavioral patterns",
  },
  {
    id: 4,
    prompt: "Do they show strong interests in specific topics or objects?",
    description: "Focused interests that are unusually intense may be relevant.",
    category: "Interests",
  },
  {
    id: 5,
    prompt: "Do they struggle to understand or respond to social cues?",
    description: "This may include facial expressions, tone, or gestures.",
    category: "Social understanding",
  },
  {
    id: 6,
    prompt: "Do they have difficulty with imaginative or pretend play?",
    description: "Play patterns can reveal how they connect with others.",
    category: "Play behavior",
  },
  {
    id: 7,
    prompt: "Do they seem unusually sensitive to sounds, textures, or lights?",
    description: "Sensory sensitivities can affect comfort and daily routines.",
    category: "Sensory response",
  },
  {
    id: 8,
    prompt: "Do they often have trouble expressing needs or feelings clearly?",
    description: "Communication can be verbal, non-verbal, or mixed.",
    category: "Expressive communication",
  },
  {
    id: 9,
    prompt: "Do they find it hard to start or maintain conversations?",
    description: "This can be seen in back-and-forth interaction patterns.",
    category: "Conversation skills",
  },
  {
    id: 10,
    prompt: "Do they seem to benefit from extra support in everyday social settings?",
    description: "Support needs may reflect underlying developmental differences.",
    category: "Support needs",
  },
];

const choices: Choice[] = [
  { value: "Never", label: "Never", tone: "from-slate-500 to-slate-600" },
  { value: "Sometimes", label: "Sometimes", tone: "from-amber-500 to-orange-500" },
  { value: "Often", label: "Often", tone: "from-sky-500 to-cyan-600" },
  { value: "Always", label: "Always", tone: "from-fuchsia-500 to-purple-600" },
];

const ScreeningForm: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = useMemo(() => ((currentIndex + 1) / questions.length) * 100, [currentIndex]);
  const selectedAnswer = answers[currentQuestion.id];

  const handleSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (!selectedAnswer) return;
    if (currentIndex === questions.length - 1) {
      setIsComplete(true);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((prev) => prev - 1);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setAnswers({});
    setIsComplete(false);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_50%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_100%)] px-4 py-10 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <div className="rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-[0_20px_80px_-20px_rgba(15,23,42,0.25)] backdrop-blur-xl sm:p-6">
          <div className="mb-5 flex items-center justify-between text-sm font-medium text-slate-500">
            <span>Childhood Screening Wizard</span>
            <span>{currentIndex + 1}/{questions.length}</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-fuchsia-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {!isComplete ? (
            <div key={currentQuestion.id} className="mt-8 transition-all duration-500 ease-out">
              <div className="mb-4 inline-flex rounded-full bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700">
                {currentQuestion.category}
              </div>

              <h2 className="text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl">
                {currentQuestion.prompt}
              </h2>
              <p className="mt-3 text-base text-slate-600">{currentQuestion.description}</p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {choices.map((choice) => {
                  const isActive = selectedAnswer === choice.value;
                  return (
                    <button
                      key={choice.value}
                      type="button"
                      onClick={() => handleSelect(choice.value)}
                      className={`rounded-2xl border px-4 py-4 text-left text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? `border-transparent bg-gradient-to-r ${choice.tone} text-white shadow-lg shadow-slate-300/50`
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-cyan-300 hover:bg-white"
                      }`}
                    >
                      <span className="block text-base font-semibold">{choice.label}</span>
                      <span className={`mt-1 block text-xs ${isActive ? "text-cyan-50" : "text-slate-500"}`}>
                        Choose how often this happens
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentIndex === 0}
                  className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!selectedAnswer}
                  className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {currentIndex === questions.length - 1 ? "Complete" : "Next"}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-8 rounded-[24px] border border-emerald-200 bg-emerald-50 p-6 shadow-inner">
              <div className="mb-4 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                Screening completed
              </div>
              <h3 className="text-2xl font-semibold text-slate-900">Thank you for completing the questionnaire.</h3>
              <p className="mt-2 text-slate-600">
                Your responses have been captured and are ready to be reviewed or passed to your analysis workflow.
              </p>

              <div className="mt-6 space-y-3 rounded-2xl bg-white p-4">
                {questions.map((question) => (
                  <div key={question.id} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2 text-sm">
                    <span className="text-slate-600">{question.prompt}</span>
                    <span className="font-semibold text-slate-900">{answers[question.id] ?? "—"}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleRestart}
                className="mt-6 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Start again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScreeningForm;
