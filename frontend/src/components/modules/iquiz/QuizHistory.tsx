"use client";

import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { getQuizHistory } from "@/utils/iquizHistory";
import { QuizHistoryEntry } from "@/types/iquiz.types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function QuizHistory() {
  const [practiceSessions] = useState<QuizHistoryEntry[]>(() => getQuizHistory());

  const sortedSessions = useMemo(() => {
    return [...practiceSessions].sort((a, b) => {
      return (
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );
    });
  }, [practiceSessions]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle>Quiz History</CardTitle>
            <CardDescription>A record of your completed practice quizzes.</CardDescription>
          </div>

          <Button asChild variant="outline">
            <Link href="/dashboard/premium-feature">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Quiz Generator
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Topic</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Score</TableHead>
              <TableHead className="w-50">Percentage</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedSessions.length > 0 ? (
              sortedSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.topic}</TableCell>
                  <TableCell>
                    {format(new Date(session.completedAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="capitalize">{session.difficulty}</TableCell>
                  <TableCell>
                    {session.score} / {session.numberOfQuestions}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <progress
                        max={100}
                        value={Math.max(0, Math.min(session.percentage, 100))}
                        className="h-2 w-full"
                        aria-label={`Score percentage for ${session.topic}`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {Math.round(session.percentage)}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  You haven&apos;t taken any quizzes yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
