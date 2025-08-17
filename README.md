# InvokeChat

A modern, intelligent conversational AI assistant powered by Groq and Tavily API integration.

## Overview

InvokeChat is a chat application that leverages advanced language models to provide comprehensive, detailed responses to user queries. The application combines the power of Groq's LLM capabilities with Tavily's web search functionality to deliver accurate and up-to-date information.

## Features

- **AI-Powered Conversations**: Utilizes Groq's language models for natural, detailed responses
- **Web Search Integration**: Incorporates Tavily API to search the web for current information
- **Structured Output**: Capable of providing formatted, well-organized responses
- **Tool Calling**: Interacts with external resources such as APIs, databases, and web services
- **Clean User Interface**: Simple, intuitive chat interface built with HTML, JavaScript, and Tailwind CSS

## Technical Stack

- **Backend**: Node.js with Groq SDK
- **Frontend**: HTML, JavaScript, and Tailwind CSS
- **APIs**:
  - Groq API for language model capabilities
  - Tavily API for web search functionality

## Getting Started

### Prerequisites

- Node.js installed on your system
- Groq API key
- Tavily API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file:
   ```
   GROQ_API_KEY=your_groq_api_key
   TAVILY_API_KEY=your_tavily_api_key
   ```
4. Run the application:
   ```bash
   node app.js
   ```

## Usage

Open the frontend interface in your browser and start chatting with the AI assistant. The system is designed to provide detailed, multi-paragraph responses and can search the web for information when needed.

## License

ISC

---

© 2025 InvokeChat
