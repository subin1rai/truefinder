"use client"

import { useState, useRef, useEffect } from "react"
import axios from "axios"
import ChatbotButton from "./ChatbotButton"
import ChatMessage from "./ChatMessage"
import TypingIndicator from "./TypingIndicator"
import QuickQuestions from "./QuickQuestions"
import { X, Send, Minimize2, Maximize2, Loader2, Trash2 } from "lucide-react"

const ChatbotEnhanced = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your BestMate AI assistant. I'm here to help you find your perfect life partner and navigate your matrimonial journey. How can I assist you today?",
      timestamp: new Date().toISOString(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const [sessionId] = useState(() => "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9))

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const API_BASE_URL = "http://localhost:5000/api"

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    loadChatHistory()
  }, [])

  const loadChatHistory = async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) return

      const response = await axios.get(`${API_BASE_URL}/chat/history`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success && response.data.chats.length > 0) {
        const chatHistory = response.data.chats.reverse().map((chat) => ({
          id: chat._id,
          role: chat.role,
          content: chat.content,
          timestamp: chat.timestamp,
        }))

        setMessages((prev) => [...prev, ...chatHistory])
      }
    } catch (error) {
      console.error("Failed to load chat history:", error)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const token = localStorage.getItem("authToken")
      const userId = localStorage.getItem("userId")

      const response = await axios.post(
        `${API_BASE_URL}/chat/message`,
        {
          message: userMessage.content,
          conversationHistory: messages.slice(-10),
          userId: userId,
          sessionId: sessionId,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      )

      if (response.data.success) {
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.data.response,
          timestamp: response.data.timestamp,
        }

        setMessages((prev) => [...prev, assistantMessage])

        if (!isOpen) {
          setHasNewMessage(true)
        }
      } else {
        throw new Error(response.data.error || "Failed to get response")
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          error.response?.data?.error ||
          "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const openChat = () => {
    setIsOpen(true)
    setIsMinimized(false)
    setHasNewMessage(false)
  }

  const closeChat = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const handleQuickQuestion = (question) => {
    setInputMessage(question)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const clearChatHistory = async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        setMessages([messages[0]])
        return
      }

      await axios.delete(`${API_BASE_URL}/chat/history`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setMessages([messages[0]])
    } catch (error) {
      console.error("Failed to clear chat history:", error)
    }
  }

  const handleMessageFeedback = (messageId, feedback) => {
    console.log(`Message ${messageId} feedback: ${feedback}`)
    // You can send this feedback to your backend for analytics
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {/* Chat Button */}
      {!isOpen && <ChatbotButton onClick={openChat} hasNewMessage={hasNewMessage} />}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`w-80 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 animate-slide-up ${
            isMinimized ? "h-14" : "h-[32rem]"
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-sm">🤖</span>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-sm font-semibold">BestMate Assistant</h3>
                <p className="text-xs opacity-90">Online • Ready to help</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={toggleMinimize}
                className="w-7 h-7 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center"
                aria-label="Minimize"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={closeChat}
                className="w-7 h-7 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <div className="flex flex-col h-[28rem]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} onFeedback={handleMessageFeedback} />
                ))}

                {/* Loading indicator */}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              {messages.length === 1 && <QuickQuestions onQuestionClick={handleQuickQuestion} />}

              {/* Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex space-x-2 items-end">
                  <div className="flex-1">
                    <textarea
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about finding your perfect match..."
                      disabled={isLoading}
                      rows={1}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 resize-none"
                      style={{ minHeight: "44px", maxHeight: "88px" }}
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="w-11 h-11 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    aria-label="Send message"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </div>

                {/* Action buttons */}
                {messages.length > 2 && (
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={clearChatHistory}
                      className="flex items-center space-x-1 px-3 py-1.5 text-xs border border-gray-200 bg-white text-gray-500 rounded-full hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear History</span>
                    </button>

                    <div className="text-xs text-gray-400">{messages.length - 1} messages</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ChatbotEnhanced
