import type Anthropic from "@anthropic-ai/sdk";
import type { ZodType } from "zod";

/**
 * Get structured JSON out of Claude via **forced tool use**: we declare one tool
 * whose input schema is the shape we want, force the model to call it, then pull
 * the tool-call arguments out and validate them with Zod. This is GA (works on
 * every recent model + SDK) and gives us a hard schema guarantee on the output.
 */
export interface StructuredCall {
  client: Anthropic;
  model: string;
  maxTokens: number;
  system: string;
  userContent: Anthropic.MessageParam["content"];
  toolName: string;
  toolDescription: string;
  /** JSON Schema for the tool input (must be `{ type: "object", ... }`). */
  inputSchema: Record<string, unknown>;
}

export interface StructuredResult<T> {
  value: T;
  usage: { inputTokens: number; outputTokens: number };
}

export async function runStructuredTool<T>(
  schema: ZodType<T>,
  call: StructuredCall,
): Promise<StructuredResult<T>> {
  const response = await call.client.messages.create({
    model: call.model,
    max_tokens: call.maxTokens,
    system: call.system,
    messages: [{ role: "user", content: call.userContent }],
    tools: [
      {
        name: call.toolName,
        description: call.toolDescription,
        input_schema: call.inputSchema as Anthropic.Tool.InputSchema,
      },
    ],
    tool_choice: { type: "tool", name: call.toolName },
  });

  const block = response.content.find((b) => b.type === "tool_use");
  if (!block || block.type !== "tool_use") {
    const reason =
      response.stop_reason === "refusal"
        ? "model refused"
        : response.stop_reason === "max_tokens"
          ? "hit max_tokens (increase maxTokens)"
          : `stop_reason=${response.stop_reason}`;
    throw new Error(`Claude did not return a ${call.toolName} tool call (${reason}).`);
  }

  // The tool schema is advisory; Zod is the real guarantee.
  const value = schema.parse(block.input);
  return {
    value,
    usage: {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    },
  };
}
