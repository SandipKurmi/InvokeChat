const input = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const chatContainer = document.getElementById("chat-container");

input.addEventListener("keyup", handleEnter);
sendButton.addEventListener("click", handleSend);

// add loading indicator with text indicator Thinking...
const loadingIndicator = document.createElement("div");
loadingIndicator.classList.add(
  "my-6",
  "p-3",
  "rounded-xl",
  "mr-auto",
  "max-w-fit",
  "bg-neutral-800"
);
loadingIndicator.textContent = "Thinking...";

async function generate(text) {
  // 1. append user message to UI
  const userMessage = document.createElement("div");
  userMessage.classList.add(
    "my-6",
    "bg-neutral-800",
    "p-3",
    "rounded-xl",
    "ml-auto",
    "max-w-fit"
  );
  userMessage.textContent = text;
  chatContainer.appendChild(userMessage);

  // append loading indicator
  chatContainer.appendChild(loadingIndicator);

  // 2. Send message to backend and get response
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: text }),
    });

    const data = await response.json();

    // 3. Append AI response to UI
    const aiMessage = document.createElement("div");
    aiMessage.classList.add(
      "my-6",
      "p-3",
      "rounded-xl",
      "mr-auto",
      "max-w-fit"
    );
    aiMessage.textContent = data.response;
    // remove loading indicator
    loadingIndicator.remove();
    chatContainer.appendChild(aiMessage);
  } catch (error) {
    console.error("Error:", error);
    // Show error message
    const errorMessage = document.createElement("div");
    errorMessage.classList.add(
      "my-6",
      "p-3",
      "rounded-xl",
      "mr-auto",
      "max-w-fit",
      "bg-red-800"
    );
    errorMessage.textContent = "Sorry, something went wrong. Please try again.";
    chatContainer.appendChild(errorMessage);
    // remove loading indicator
    loadingIndicator.remove();
  }
}

function handleEnter(e) {
  if (e.key === "Enter") {
    const message = input.value.trim();
    console.log(message);
    input.value = "";

    if (!message) {
      return;
    }

    generate(message);
  }
}

function handleSend() {
  const message = input.value.trim();
  console.log(message);
  input.value = "";

  if (!message) {
    return;
  }

  generate(message);
}
