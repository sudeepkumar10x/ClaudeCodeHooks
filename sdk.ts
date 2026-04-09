// Note: the "@anthropic-ai/claude-code" package has been renamed
// to "@anthropic-ai/claude-agent-sdk"
import { query } from "@anthropic-ai/claude-agent-sdk";

const prompt = "Look for duplicate in ./src/queries path";

for await (const message of query({
  prompt,
})) {
  console.log(JSON.stringify(message, null, 2));
}
