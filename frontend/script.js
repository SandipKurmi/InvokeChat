const input = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const chatContainer = document.getElementById("chat-container");

input.addEventListener("keyup", handleEnter);
sendButton.addEventListener("click", handleSend);

function generate(text) {
  // 1. append message to ui
  // 2. send it to the llm
  // 3. append response to the ui
  // 4.

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

  input.value = "";
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
