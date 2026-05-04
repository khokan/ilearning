"use client";

import { useState } from "react";
import { QuizGeneratorForm } from "@/components/modules/iquiz/QuizGeneratorForm";
import { QuizGeneratorLoading } from "@/components/modules/iquiz/QuizGeneratorStates";

import { QuizDisplay } from "./QuizDisplay";
import { GeneratedQuizSession } from "@/types/iquiz.types";

type ViewState = "form" | "loading" | "quiz";

export function QuizGeneratorClient() {
  const [view, setView] = useState<ViewState>("form");
  const [quizSession, setQuizSession] = useState<GeneratedQuizSession | null>(
    null
  );

  const handleLoadingStart = () => {
    setView("loading");
  };

  const handleSuccess = (session: GeneratedQuizSession) => {
    setQuizSession(session);
    setView("quiz");
  };

  const handleError = () => {
    setView("form");
  };

  const handleExit = () => {
    setQuizSession(null);
    setView("form");
  };

  if (view === "loading") {
    return <QuizGeneratorLoading onCancel={handleExit} />;
  }

  if (view === "quiz" && quizSession) {
    return <QuizDisplay quizData={quizSession} onExit={handleExit} />;
  }

  return (
    <QuizGeneratorForm
      onLoadingStart={handleLoadingStart}
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}
