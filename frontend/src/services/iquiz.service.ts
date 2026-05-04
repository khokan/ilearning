

import { GeneratedQuizSession } from "@/types/iquiz.types";
import { IQuizGeneratorPayload } from "@/zod/iquiz.validation";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export const iquizService = {
  // async generateQuestions(payload: IQuizGeneratorPayload) {
  //   const res = await clientHttpClient.post<GeneratedQuizSession>(
  //     "/ai/questions/generate",
  //     payload
  //   );

  //   return res.data;
  // },

  generate: async function (
    payload: IQuizGeneratorPayload
  ): Promise<GeneratedQuizSession> {
    try {
      const res = await fetch(`${API_URL}/ai/questions/generate`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseBody = await res.json();
      if (!res.ok) {
        throw new Error(responseBody?.message ?? "Failed to generate quiz");
      }

      // Support both direct payload responses and wrapped { data } responses.
      return (responseBody?.data ?? responseBody) as GeneratedQuizSession;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Something went wrong");
    }
  },
};