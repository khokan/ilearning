/* eslint-disable @typescript-eslint/no-explicit-any */
export class LLMService {
  private apiKey: string;
  private apiUrl: string = "https://openrouter.ai/api/v1";
  private model: string;

  constructor() {
    this.apiKey = process.env.RAG_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY || "";
    this.model = process.env.RAG_OPENROUTER_LLM_MODEL || "nvidia/nemotron-3-super-120b-a12b:free";

    if (!this.apiKey) {
      throw new Error("OpenRouter api key is missing...");
    }
  }

  async generateResponse(
    prompt: string,
    context: string[] = [],
    asJson: boolean = false,
  ) {
    try {
      let fullPrompt =
        context.length > 0
          ? `Context information:\n${context.join("\n\n")}\n\nQuestion: ${prompt}\n\nAnswer based on the context above in clear natural language. Do not return JSON or object notation unless explicitly requested.`
          : `${prompt}\n\nAnswer in clear natural language. Do not return JSON or object notation unless explicitly requested.`;

      if (asJson) {
        fullPrompt += `\n\nReturn ONLY a valid JSON object.`;
      }

      const systemMessage = asJson
        ? "You are a helpful assistant. Respond ONLY with valid JSON when requested."
        : "You are a helpful assistant. Answer questions based on the provided context in clear natural language. Do not return JSON or object notation unless explicitly requested.";

      const bodyPayload: any = {
        model: this.model,
        messages: [
          {
            role: "system",
            content: systemMessage,
          },
          {
            role: "user",
            content: fullPrompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 1500,
      };

      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `OpenRouter API error: ${response.status} - ${errorData.error?.message} || \"unknown error\"`,
        );
      }

      const data = await response.json();

      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error generating LLM response:", error);
      throw error;
    }
  }
}
