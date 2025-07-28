import { Bot } from "lucide-react"

const TypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="flex items-end space-x-2">
        <div className="w-7 h-7 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center border border-pink-200">
          <Bot className="w-4 h-4 text-pink-600" />
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
            <span className="text-sm text-gray-500 ml-2">AI is typing...</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TypingIndicator
