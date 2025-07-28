"use client"

import { useState } from "react"
import { MessageCircle, Sparkles } from "lucide-react"

const ChatbotButton = ({ onClick, hasNewMessage = false }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative w-14 h-14 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center overflow-hidden"
        aria-label="Open AI Assistant"
      >
        {/* Background animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Icon */}
        <div className="relative z-10 flex items-center justify-center">
          <MessageCircle className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
        </div>

        {/* Sparkle effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Sparkles className="absolute top-2 right-2 w-3 h-3 text-yellow-300 animate-pulse" />
          <Sparkles className="absolute bottom-2 left-2 w-2 h-2 text-yellow-200 animate-pulse delay-150" />
        </div>

        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full bg-pink-400 animate-ping opacity-20"></div>
      </button>

      {/* New message indicator */}
      {hasNewMessage && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center animate-bounce">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      )}

      {/* Tooltip */}
      {isHovered && (
        <div className="absolute bottom-16 right-0 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap animate-fade-in">
          Chat with AI Assistant
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  )
}

export default ChatbotButton
