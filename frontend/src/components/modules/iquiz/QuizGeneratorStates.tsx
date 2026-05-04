"use client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizGeneratorLoadingProps {
  onCancel?: () => void;
}

export function QuizGeneratorLoading({ onCancel }: QuizGeneratorLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg text-muted-foreground p-12 space-y-4 min-h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="font-semibold">Generating your quiz questions...</p>
      <p className="text-sm text-center">
        This may take a moment. Please wait.
      </p>
      {onCancel && (
        <Button onClick={onCancel} variant="outline" className="mt-4">
          Cancel
        </Button>
      )}
    </div>
  );
}
