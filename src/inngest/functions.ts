import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";

const google = createGoogleGenerativeAI();

export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    await step.sleep("pretend", "5s");
    const { steps:geminiSteps } = await step.ai.wrap("gemini-generate-text", generateText, {
      model: google("gemini-2.5-flash"),
      prompt: "what is 2+2?",
      system: "You are a helpful assistant.",
    });
    const { steps:openaiSteps } = await step.ai.wrap("openai-generate-text", generateText, {
      model: openai("gpt-3.5-turbo"),
      prompt: "what is 2+2?",
      system: "You are a helpful assistant.",
    });
    const { steps:anthropicSteps } = await step.ai.wrap("anthropic-generate-text", generateText, {
      model: anthropic("claude-3-5-sonnet"),
      prompt: "what is 2+2?",
      system: "You are a helpful assistant.",
    });
    return {
      geminiSteps,
      openaiSteps,
      anthropicSteps
    };
  }
);
