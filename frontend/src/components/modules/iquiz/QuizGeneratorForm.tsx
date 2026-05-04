"use client";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import {
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { iQuizGeneratorSchema } from "@/zod/iquiz.validation";
import { iquizService } from "@/services/iquiz.service";
import { GeneratedQuizSession } from "@/types/iquiz.types";
import { getErrorMessage } from "@/lib/getErrorMessage";

interface FormState {
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  gradeLevel: string;
  numberOfQuestions: number;
}

interface FormErrors {
  topic?: string;
  difficulty?: string;
  gradeLevel?: string;
  numberOfQuestions?: string;
}

interface QuizGeneratorFormProps {
  onLoadingStart?: () => void;
  onLoadingEnd?: () => void;
  onError?: (error: string) => void;
  onSuccess?: (quizSession: GeneratedQuizSession) => void;
}

export function QuizGeneratorForm({
  onLoadingStart,
  onLoadingEnd,
  onError,
  onSuccess,
}: QuizGeneratorFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormState>({
    topic: "",
    difficulty: "medium",
    gradeLevel: "High School",
    numberOfQuestions: 5,
  });

  const handleInputChange = (
    field: keyof FormState,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "numberOfQuestions" ? Number(value) : value,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const validateForm = (): boolean => {
    const result = iQuizGeneratorSchema.safeParse(formData);
    if (!result.success) {
      const errors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        errors[path as keyof FormErrors] = issue.message;
      });
      setFormErrors(errors);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setError(null);
    setIsPending(true);
    onLoadingStart?.();

    try {
      const session = await iquizService.generate(formData);

      if (!session?.questions || session.questions.length === 0) {
        throw new Error(
          "The AI failed to generate questions. Please try a different topic."
        );
      }

      onSuccess?.(session);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsPending(false);
      onLoadingEnd?.();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Generating Quiz</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div>
          <label
            htmlFor="topic"
            className="flex flex-col gap-1 text-sm font-medium"
          >
            Topic
            <Input
              id="topic"
              placeholder="e.g., Photosynthesis, The Cold War"
              value={formData.topic}
              onChange={(e) => handleInputChange("topic", e.target.value)}
              disabled={isPending}
            />
          </label>
          {formErrors.topic && (
            <p className="text-xs text-destructive mt-1">
              {formErrors.topic}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="gradeLevel"
            className="flex flex-col gap-1 text-sm font-medium"
          >
            Grade Level
            <Input
              id="gradeLevel"
              placeholder="e.g., 8th Grade, University"
              value={formData.gradeLevel}
              onChange={(e) =>
                handleInputChange("gradeLevel", e.target.value)
              }
              disabled={isPending}
            />
          </label>
          {formErrors.gradeLevel && (
            <p className="text-xs text-destructive mt-1">
              {formErrors.gradeLevel}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="difficulty"
              className="flex flex-col gap-1 text-sm font-medium"
            >
              Difficulty
              <Select
                value={formData.difficulty}
                onValueChange={(value) =>
                  handleInputChange(
                    "difficulty",
                    value as "easy" | "medium" | "hard"
                  )
                }
                disabled={isPending}
              >
                <SelectTrigger id="difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </label>
            {formErrors.difficulty && (
              <p className="text-xs text-destructive mt-1">
                {formErrors.difficulty}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="numberOfQuestions"
              className="flex flex-col gap-1 text-sm font-medium"
            >
              Number of Questions
              <Input
                id="numberOfQuestions"
                type="number"
                min="1"
                max="10"
                value={formData.numberOfQuestions}
                onChange={(e) =>
                  handleInputChange("numberOfQuestions", e.target.value)
                }
                disabled={isPending}
              />
            </label>
            {formErrors.numberOfQuestions && (
              <p className="text-xs text-destructive mt-1">
                {formErrors.numberOfQuestions}
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-6">
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
            </>
          ) : (
            "Generate Quiz"
          )}
        </Button>
      </CardFooter>
    </form>
  );
}
