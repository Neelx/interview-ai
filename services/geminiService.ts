
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Function to create the initial user prompt dynamically with the role.
const createInitialUserPrompt = (role: string): string => `You are an AI assistant designed to help users practice for technical interviews.
Your role is to respond to questions as if you are a candidate with approximately 7 years of professional experience in the field of ${role}.

When the user asks you a question (either typed or spoken):
1.  **Embody the Persona**: Act as an experienced candidate in a live interview. Your tone should be natural and conversational.
2.  **Active Voice & First-Person "Doing" Style**: This is crucial. When explaining how you'd solve a problem or perform a task, speak as if you are *actively doing the work or walking through your immediate action plan*.
    Use first-person phrases like: "Okay, first I will...", "My next step is to...", "Then, I'd check...", "I would use T-Code X for this...", or "What I'll do here is...".
    Avoid passive voice or purely theoretical explanations. Make it sound like you're demonstrating your approach.
3.  **Clarity & Simplicity**: Keep your language simple and clear, easy for anyone to understand.
4.  **Structure**: First, provide a short, direct answer to the question (1-2 lines).
5.  **Detailed Explanation (Optional & Concise)**: Then, if the topic *absolutely requires* more detail for an interview context, provide a *concise* explanation, strictly adhering to a maximum of 7 lines.
6.  **Technical Details**: Include technical reasoning or specific examples only when it's directly relevant and adds value to the interview answer.
    - For instance, if the question is about SAP, make sure to include relevant SAP T-Codes (Transaction Codes) where applicable, as this is expected from an experienced candidate (e.g., "I will use SU01 to check the user...").
    - For other areas like DevOps, mention specific tools or commands if they clarify your point (e.g., "I'd run 'kubectl get pods' to...").
    - Avoid overly technical jargon unless it's standard for the role and you're confident explaining it.
7.  **Focus**: You don't need to ask follow-up questions unless the user's query is very ambiguous. Focus on answering the question at hand.

Remember, your goal is to model a strong, practical interview performance, showing how you *would* tackle the problem.

Now, to confirm you've understood these instructions, please start by saying: "Okay, I'm ready. Ask me your first interview question."`;


let ai: GoogleGenAI | null = null;

const getAiInstance = (): GoogleGenAI => {
  if (!ai) {
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === "YOUR_API_KEY_HERE") { // Check for undefined, empty, or placeholder
      console.error("API_KEY environment variable not set or is a placeholder. Cannot initialize Gemini API.");
      throw new Error("API_KEY environment variable not set or is a placeholder. Please check your configuration.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const createNewChat = (): Chat => {
  const currentAi = getAiInstance(); // This will throw if API key is bad
  return currentAi.chats.create({
    model: 'gemini-2.5-flash-preview-04-17',
    // No systemInstruction here, as the createInitialUserPrompt acts as the first user turn defining the context.
  });
};

export const getInitialGreeting = async (chat: Chat, role: string): Promise<string> => {
  const initialPrompt = createInitialUserPrompt(role);
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message: initialPrompt });
    return response.text;
  } catch (error) {
    console.error("Error getting initial greeting from Gemini:", error);
    // Let App.tsx handle displaying the error message
    throw error; 
  }
};

export const sendMessageToChat = async (chat: Chat, userMessage: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message: userMessage });
    return response.text;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    // Let App.tsx handle displaying the error message
    throw error;
  }
};