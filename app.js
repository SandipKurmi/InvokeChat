import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import readline from "node:readline/promises";

// Fix the tavily client initialization to match the working example
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const messages = [
    {
      role: "system",
      content: `You are a helpful and detailed personal assistant who provides comprehensive answers to questions.
          
          When responding to questions:
          - Provide thorough explanations with relevant details
          - Structure your responses with paragraphs when appropriate
          - Include examples or analogies to clarify complex concepts
          - Cite sources or references when possible
          - Avoid overly brief or one-line responses unless specifically requested
          
          You can use the webSearch tool to search the web for the given query when you need current information.
          Always format your responses in a clear, readable way with proper spacing between paragraphs.
          `,
    },
  ];

  while (true) {
    const userInput = await rl.question("User: ");

    if (userInput === "exit") {
      rl.close();
      break;
    }

    messages.push({ role: "user", content: userInput });
    while (true) {
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
        console.log(completion.choices[0].message.content);
        break;
      } else {
        for (const toolCall of toolCalls) {
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
}

main();

async function webSearch({ query }) {
  // Fix the search method call to match the working example
  const searchResult = await tvly.search(query);

  const finalResult = searchResult.results
    .map((result) => result.content)
    .join("\n\n");

  return finalResult;
}
