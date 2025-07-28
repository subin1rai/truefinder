"use client"

import { Bot, User, Copy, ThumbsUp, ThumbsDown } from "lucide-react"
import { useState } from "react"

const ChatMessage = ({ message, onFeedback }) => {
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const handleFeedback = (type) => {
    setFeedback(type)
    onFeedback?.(message.id, type)
  }

  return (
    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} group`}>
      <div className={`flex items-end space-x-2 max-w-[85%]`}>
        {message.role === "assistant" && (
          <div className="w-7 h-7 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0 border border-pink-200">
            <Bot className="w-4 h-4 text-pink-600" />
          </div>
        )}

        <div className="relative">
          <div
            className={`px-4 py-3 rounded-2xl shadow-sm ${
              message.role === "user"
                ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-br-md"
                : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            <div className="flex items-center justify-between mt-2">
              <p className={`text-xs ${message.role === "user" ? "text-pink-100" : "text-gray-500"}`}>
                {formatTime(message.timestamp)}
              </p>

              {/* Message actions for assistant messages */}
              {message.role === "assistant" && (
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={copyToClipboard}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Copy message"
                  >
                    <Copy className="w-3 h-3 text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleFeedback("like")}
                    className={`p-1 hover:bg-gray-100 rounded transition-colors ${
                      feedback === "like" ? "text-green-500" : "text-gray-400"
                    }`}
                    title="Helpful"
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleFeedback("dislike")}
                    className={`p-1 hover:bg-gray-100 rounded transition-colors ${
                      feedback === "dislike" ? "text-red-500" : "text-gray-400"
                    }`}
                    title="Not helpful"
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Copy confirmation */}
          {copied && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded animate-fade-in">
              Copied!
            </div>
          )}
        </div>

        {message.role === "user" && (
          <div className="w-7 h-7 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 border border-blue-200">
            <User className="w-4 h-4 text-blue-600" />
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessage
