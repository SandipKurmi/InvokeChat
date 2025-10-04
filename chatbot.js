import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import NodeCache from "node-cache";
import dotenv from "dotenv";
dotenv.config();

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const cache = new NodeCache({ stdTTL: 60 * 60 }); // Cache for 1 hour

export async function generate(text, threadId) {
  const baseMessages = [
    {
      role: "system",
      content: `You are a smart personal assistant.
- Answer questions directly in plain English whenever you know the answer.
- If the question requires current, local, or real-time information—or if you’re unsure—find the information using available tools.
- Use your judgment to decide whether to rely on your existing knowledge or to search for updated details.
- Avoid mentioning or referencing any tools used in your response unless absolutely necessary.

Examples:
Q: What is the capital of France?
A: The capital of France is Paris.

Q: What is the weather in Mumbai right now?
A: (Search for and provide the latest weather information)

Q: Who is the Prime Minister of India?
A: The current Prime Minister of India is Narendra Modi.

Q: Tell me the latest IT news.
A: (Search for and share the most recent news in IT)
          `,
    },
  ];

  const messages = cache.get(threadId) || baseMessages;

  messages.push({ role: "user", content: text });

  const MAX_RETRIES = 10;
  let retries = 0;

  while (true) {
    if (retries >= MAX_RETRIES) {
      throw new Error("Max retries reached");
    }
    retries++;

    const completion = await groq.chat.completions.create({
      messages: messages,
      tools: [
        {
          type: "function",
          function: {
            name: "webSearch",
            description: "Search the web for the given query",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "The query to search for",
                },
              },
              required: ["query"],
            },
          },
        },
      ],
      tool_choice: "auto",
      model: "openai/gpt-oss-20b",
    });

    //push assistent massage
    messages.push(completion.choices[0].message);

    const toolCalls = completion.choices[0].message.tool_calls;

    if (!toolCalls) {
      cache.set(threadId, messages);
      return completion.choices[0].message.content;
    } else {
      for (const toolCall of toolCalls) {
        console.log("toolCall...");
        const functionName = toolCall.function.name;
        const functionArguments = JSON.parse(toolCall.function.arguments);

        if (functionName === "webSearch") {
          const searchResult = await webSearch(functionArguments);
          console.log(searchResult);
          messages.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name: functionName,
            content: searchResult,
          });
        }
      }
    }
  }
}

async function webSearch({ query }) {
  // Fix the search method call to match the working example
  const searchResult = await tvly.search(query);

  const finalResult = searchResult.results
    .map((result) => result.content)
    .join("\n\n");

  return finalResult;
}
