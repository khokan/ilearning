"use client";

import { Timer } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { cn } from "@/utils/utils";
import {
  GeneratedQuizSession,
  QuizHistoryEntry,
  QuizQuestion,
} from "@/types/iquiz.types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { addQuizHistoryEntry } from "@/utils/iquizHistory";

const TIME_PER_QUESTION_SECONDS = 60;

type QuizState = "start" | "in-progress" | "finished";

interface QuizResult {
  score: number;
  percentage: number;
  totalQuestions: number;
}

interface QuizDisplayProps {
  quizData: GeneratedQuizSession;
  onExit?: () => void;
  onRetry?: () => void;
  onFinish?: (entry: QuizHistoryEntry) => void;
}

const normalizeAnswer = (value: string | null | undefined): string =>
  (value ?? "").trim().toLowerCase();

const isQuestionCorrect = (question: QuizQuestion, userAnswer: string | null) =>
  normalizeAnswer(userAnswer) === normalizeAnswer(question.answer);

const calculateResult = (
  quizData: GeneratedQuizSession,
  userAnswers: Array<string | null>
): QuizResult => {
  const totalQuestions = quizData.questions.length;
  const score = quizData.questions.reduce((total, question, index) => {
    return total + (isQuestionCorrect(question, userAnswers[index]) ? 1 : 0);
  }, 0);

  const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

  return {
    score,
    percentage,
    totalQuestions,
  };
};

export function QuizDisplay({
  quizData,
  onExit,
  onRetry,
  onFinish,
}: QuizDisplayProps) {
  const totalTime = quizData.questions.length * TIME_PER_QUESTION_SECONDS;
  const [quizState, setQuizState] = useState<QuizState>("start");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Array<string | null>>([]);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [result, setResult] = useState<QuizResult | null>(null);

  const finishQuiz = useCallback(() => {
    const calculatedResult = calculateResult(quizData, userAnswers);
    setResult(calculatedResult);
    setQuizState("finished");

    const historyEntry: QuizHistoryEntry = {
      id: `${quizData.quizSessionId}-${Date.now()}`,
      quizSessionId: quizData.quizSessionId,
      topic: quizData.topic,
      difficulty: quizData.difficulty,
      gradeLevel: quizData.gradeLevel,
      numberOfQuestions: calculatedResult.totalQuestions,
      score: calculatedResult.score,
      percentage: Number(calculatedResult.percentage.toFixed(2)),
      timeTakenSeconds: totalTime - timeLeft,
      completedAt: new Date().toISOString(),
    };

    addQuizHistoryEntry(historyEntry);
    onFinish?.(historyEntry);
  }, [onFinish, quizData, timeLeft, totalTime, userAnswers]);

  useEffect(() => {
    if (quizState !== "in-progress" || timeLeft === 0) {
      return;
    }

    const timerId = window.setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          window.clearInterval(timerId);
          window.setTimeout(() => {
            finishQuiz();
          }, 0);
          return 0;
        }

        return prevTime - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [finishQuiz, quizState, timeLeft]);

  const currentQuestion = quizData.questions[currentQuestionIndex];

  const progress =
    quizData.questions.length > 0
      ? ((currentQuestionIndex + 1) / quizData.questions.length) * 100
      : 0;

  const hasAnswerForCurrentQuestion = Boolean(userAnswers[currentQuestionIndex]);

  const resultByQuestion = useMemo(() => {
    return quizData.questions.map((question, index) => {
      const selected = userAnswers[index];
      const isCorrect = isQuestionCorrect(question, selected);

      return {
        question,
        selected,
        isCorrect,
      };
    });
  }, [quizData.questions, userAnswers]);

  function startQuiz() {
    setQuizState("in-progress");
    setCurrentQuestionIndex(0);
    setResult(null);
    setTimeLeft(totalTime);
    setUserAnswers(new Array(quizData.questions.length).fill(null));
  }

  function handleAnswerSelect(answer: string) {
    setUserAnswers((prev) => {
      const next = [...prev];
      next[currentQuestionIndex] = answer;
      return next;
    });
  }

  function resetQuiz() {
    setQuizState("start");
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setResult(null);
    setTimeLeft(totalTime);
  }

  function handleRetry() {
    resetQuiz();
    onRetry?.();
  }

  function handleNextQuestion() {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      return;
    }

    finishQuiz();
  }

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  if (quizState === "start") {
    return (
      <Card className="mx-6 mb-6 bg-card text-foreground dark:bg-slate-950 dark:text-slate-50">
        <CardHeader>
          <CardTitle>You are about to start a quiz</CardTitle>
          <CardDescription>
            Topic: <strong>{quizData.topic}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p>Number of Questions: {quizData.questions.length}</p>
          <p>Difficulty: {quizData.difficulty}</p>
          <p>Time Limit: {formatTime(timeLeft)}</p>
          <div className="flex justify-center gap-3 pt-4">
            <Button onClick={onExit} variant="outline">
              Exit
            </Button>
            <Button onClick={startQuiz}>Start Quiz</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (quizState === "finished" && result) {
    return (
      <Card className="mx-6 mb-6">
        <CardHeader>
          <CardTitle>Quiz Completed</CardTitle>
          <CardDescription>
            You scored {result.score}/{result.totalQuestions} ({Math.round(result.percentage)}%)
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-3 rounded-lg border border-border bg-slate-50 p-4 text-slate-950 shadow-sm dark:bg-slate-950/80 dark:text-slate-50">
            <div>
              <p className="text-xs text-muted-foreground">Score</p>
              <p className="text-xl font-semibold">
                {result.score}/{result.totalQuestions}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Percentage</p>
              <p className="text-xl font-semibold">{Math.round(result.percentage)}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Topic</p>
              <p className="text-xl font-semibold">{quizData.topic}</p>
            </div>
          </div>

          <div className="space-y-3">
            {resultByQuestion.map((item, index) => (
              <div
                key={`${item.question.question}-${index}`}
                className={cn(
                  "rounded-lg border p-3",
                  item.isCorrect
                    ? "border-emerald-300 bg-emerald-50 text-slate-950 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-slate-50"
                    : "border-rose-300 bg-rose-50 text-slate-950 dark:border-rose-500 dark:bg-rose-950/40 dark:text-slate-50"
                )}
              >
                <p className="font-medium">
                  {index + 1}. {item.question.question}
                </p>
                <p className="mt-1 text-sm">Your answer: {item.selected ?? "No answer"}</p>
                <p className="text-sm">Correct answer: {item.question.answer}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <Button asChild variant="outline">
              <Link href="/dashboard/quiz-history">View History</Link>
            </Button>
            <Button onClick={handleRetry} variant="outline">
              Retry
            </Button>
            <Button onClick={onExit}>Generate New Quiz</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-6 mb-6 bg-card text-foreground dark:bg-slate-950 dark:text-slate-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            Question {currentQuestionIndex + 1} / {quizData.questions.length}
          </CardTitle>
          <div className="flex items-center gap-2 text-lg font-semibold text-destructive">
            <Timer className="h-5 w-5" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <progress
          max={100}
          value={Math.max(0, Math.min(progress, 100))}
          className="mt-2 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800"
          aria-label="Quiz progress"
        />
      </CardHeader>

      <CardContent className="space-y-6">
        <p className="text-lg font-medium text-slate-950 dark:text-slate-50">{currentQuestion.question}</p>

        <div className="space-y-3">
          {(currentQuestion.type === "mcq"
            ? currentQuestion.options ?? []
            : ["True", "False"]
          ).map((option, index) => {
            const inputId = `q${currentQuestionIndex}-option${index}`;

            return (
              <Label
                key={`${option}-${index}`}
                htmlFor={inputId}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg border p-4 text-slate-950 dark:text-slate-50",
                  userAnswers[currentQuestionIndex] === option
                    ? "border-primary bg-primary/10 dark:border-primary/70 dark:bg-primary/10"
                    : "border-border bg-transparent dark:border-slate-800"
                )}
              >
                <input
                  id={inputId}
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value={option}
                  checked={userAnswers[currentQuestionIndex] === option}
                  onChange={() => handleAnswerSelect(option)}
                  aria-label={option}
                  className="h-4 w-4 accent-primary"
                />
                {option}
              </Label>
            );
          })}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleNextQuestion} disabled={!hasAnswerForCurrentQuestion}>
            {currentQuestionIndex < quizData.questions.length - 1
              ? "Next Question"
              : "Finish Quiz"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
