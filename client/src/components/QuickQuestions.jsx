"use client"

import { Lightbulb, Heart, User, MessageSquare, Settings } from "lucide-react"

const QuickQuestions = ({ onQuestionClick }) => {
  const questions = [
    {
      icon: <User className="w-4 h-4" />,
      text: "How do I create a good profile?",
      category: "Profile",
    },
    {
      icon: <Heart className="w-4 h-4" />,
      text: "Tips for finding the right match",
      category: "Matching",
    },
    {
      icon: <Settings className="w-4 h-4" />,
      text: "How does the matching algorithm work?",
      category: "Algorithm",
    },
    {
      icon: <MessageSquare className="w-4 h-4" />,
      text: "How to start a conversation?",
      category: "Communication",
    },
    {
      icon: <Lightbulb className="w-4 h-4" />,
      text: "What should I write in my bio?",
      category: "Tips",
    },
  ]

  return (
    <div className="px-4 py-3 border-t border-gray-200 bg-gradient-to-r from-pink-50 to-purple-50">
      <div className="flex items-center space-x-2 mb-3">
        <Lightbulb className="w-4 h-4 text-pink-500" />
        <p className="text-sm font-medium text-gray-700">Quick questions to get started:</p>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {questions.slice(0, 3).map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question.text)}
            className="flex items-center space-x-2 p-2 text-left border border-gray-200 bg-white text-gray-600 rounded-lg hover:bg-pink-50 hover:border-pink-200 hover:text-pink-600 transition-all duration-200 hover:shadow-sm group"
          >
            <div className="text-gray-400 group-hover:text-pink-500 transition-colors">{question.icon}</div>
            <div className="flex-1">
              <span className="text-sm">{question.text}</span>
              <div className="text-xs text-gray-400 group-hover:text-pink-400">{question.category}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickQuestions
