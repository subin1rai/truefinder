import Chat from "../models/Chat.js";
import axios from "axios";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = process.env.GEMINI_API_URL;

export const history = async (req, res) => {
  try {
    const userId = req.user.id;
    const chats = await Chat.find({ userId }).sort({ createdAt: -1 }).limit(50);

    res.json({
      success: true,
      chats,
    });
  } catch (error) {
    console.error("Get chat history error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch chat history",
    });
  }
};

export const message = async (req, res) => {
  try {
    const { message, conversationHistory = [], userId } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    // System instructions for the AI
    const systemInstruction = {
      parts: [
        {
          text: `You are a helpful AI assistant for BestMate, a matrimonial website. You help users with:
- Finding their perfect life partner
- Profile creation tips and optimization  
- Dating advice and relationship guidance
- Understanding compatibility and matching
- Platform navigation and features
- Cultural sensitivity in matrimonial context
- Communication tips for connecting with matches
- Safety tips for online dating

Be friendly, supportive, culturally sensitive, and professional. Keep responses concise but helpful.
Focus on matrimonial and relationship advice. Avoid inappropriate content.`,
        },
      ],
    };

    // Build conversation contents properly formatted for Gemini
    const contents = [];

    // Add conversation history if exists
    if (conversationHistory && conversationHistory.length > 0) {
      // Take last 10 messages for context (adjust as needed)
      const recentHistory = conversationHistory.slice(-10);

      recentHistory.forEach((msg) => {
        if (msg.role === "user") {
          contents.push({
            role: "user",
            parts: [{ text: msg.content }],
          });
        } else if (msg.role === "assistant") {
          contents.push({
            role: "model",
            parts: [{ text: msg.content }],
          });
        }
      });
    }

    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    // Prepare the request payload
    const requestPayload = {
      systemInstruction,
      contents,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
        candidateCount: 1,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    };

    console.log("Making request to Gemini API...");

    // Call Gemini API
    const response = await axios.post(GEMINI_API_URL, requestPayload, {
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      timeout: 30000, // 30 second timeout
    });

    // Extract AI response
    const aiResponse =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm sorry, I couldn't generate a response. Please try again.";

    // Save conversation to database if userId is provided
    if (userId) {
      try {
        const userMessage = new Chat({
          userId,
          role: "user",
          content: message,
          timestamp: new Date(),
        });
        await userMessage.save();

        const assistantMessage = new Chat({
          userId,
          role: "assistant",
          content: aiResponse,
          timestamp: new Date(),
        });
        await assistantMessage.save();
      } catch (dbError) {
        console.error("Database save error:", dbError);
        // Continue even if DB save fails
      }
    }

    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chatbot API error:", error);

    let errorMessage =
      "I apologize, but I'm having trouble responding right now. Please try again in a moment.";
    let statusCode = 500;

    if (error.response) {
      // API returned an error response
      console.error("API Error Response:", error.response.data);

      switch (error.response.status) {
        case 400:
          errorMessage =
            "There was an issue with the request format. Please try again.";
          statusCode = 400;
          break;
        case 401:
          errorMessage =
            "Authentication failed. Please check API configuration.";
          statusCode = 401;
          break;
        case 403:
          errorMessage =
            "Access forbidden. The API key may be invalid or restricted.";
          statusCode = 403;
          break;
        case 429:
          errorMessage =
            "I'm receiving too many requests right now. Please wait a moment and try again.";
          statusCode = 429;
          break;
        case 500:
          errorMessage =
            "The AI service is temporarily unavailable. Please try again later.";
          break;
        default:
          errorMessage = `API Error: ${error.response.status}. Please try again.`;
      }
    } else if (error.code === "ECONNABORTED") {
      errorMessage = "Request timed out. Please try again.";
    } else if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      errorMessage = "Unable to connect to AI service. Please try again later.";
    }

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
    });
  }
};

export const deletehistory = async (req, res) => {
  try {
    const userId = req.user.id;
    await Chat.deleteMany({ userId });

    res.json({
      success: true,
      message: "Chat history cleared successfully",
    });
  } catch (error) {
    console.error("Clear chat history error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to clear chat history",
    });
  }
};
