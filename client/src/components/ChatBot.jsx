"use client"

import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, Loader2, Trash2 } from "lucide-react"

const Chatbot = () => {
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

  const API_BASE_URL ="http://localhost:5000/api"

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

  // Load chat history on component mount
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
          conversationHistory: messages.slice(-10), // Send last 10 messages for context
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

        // Show notification if chat is closed
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

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const quickQuestions = [
    "How do I create a good profile?",
    "Tips for finding the right match",
    "How does the matching algorithm work?",
    "What should I write in my bio?",
    "How to start a conversation?",
  ]

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
        setMessages([messages[0]]) // Keep welcome message
        return
      }

      await axios.delete(`${API_BASE_URL}/chat/history`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setMessages([messages[0]]) // Keep welcome message
    } catch (error) {
      console.error("Failed to clear chat history:", error)
    }
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 font-sans">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={openChat}
          className="relative w-14 h-14 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center group"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
          {hasNewMessage && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`w-80 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized ? "h-12" : "h-96"
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="text-sm font-semibold">BestMate Assistant</h3>
                <p className="text-xs opacity-90">Online • Ready to help</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={toggleMinimize}
                className="w-6 h-6 hover:bg-white/20 rounded transition-colors flex items-center justify-center"
                aria-label="Minimize"
              >
                {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
              </button>
              <button
                onClick={closeChat}
                className="w-6 h-6 hover:bg-white/20 rounded transition-colors flex items-center justify-center"
                aria-label="Close"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <div className="flex flex-col h-80">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`flex items-end space-x-2 max-w-[85%]`}>
                      {message.role === "assistant" && (
                        <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-3 h-3 text-pink-600" />
                        </div>
                      )}
                      <div
                        className={`px-3 py-2 rounded-lg ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-br-sm"
                            : "bg-gray-100 text-gray-800 rounded-bl-sm"
                        }`}
                      >
                        <p className="text-sm text-start whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs text-end mt-1 ${message.role === "user" ? "text-pink-100" : "text-gray-500"}`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                      {message.role === "user" && (
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-3 h-3 text-blue-600" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-end space-x-2">
                      <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
                        <Bot className="w-3 h-3 text-pink-600" />
                      </div>
                      <div className="bg-gray-100 rounded-lg px-3 py-2">
                        <div className="flex items-center space-x-1">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span className="text-sm text-gray-600">Typing...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              {messages.length === 1 && (
                <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                  <p className="text-xs text-gray-500 font-medium mb-2">Quick questions:</p>
                  <div className="flex flex-wrap gap-1">
                    {quickQuestions.slice(0, 3).map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickQuestion(question)}
                        className="px-2 py-1 text-xs border border-gray-200 bg-white text-gray-600 rounded-full hover:bg-pink-50 hover:border-pink-200 hover:text-pink-600 transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex space-x-2 items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about finding your perfect match..."
                    disabled={isLoading}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="w-9 h-9 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    aria-label="Send message"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
                {messages.length > 2 && (
                  <button
                    onClick={clearChatHistory}
                    className="w-full mt-2 px-3 py-1 text-xs border border-gray-200 bg-white text-gray-500 rounded-full hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear History</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Chatbot
