import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, RotateCcw, FileText } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useChat } from '../hooks/useChat'
import SourceCard from './SourceCard'

export default function ChatWindow({ document, apiKey, onReset }) {
  const [input, setInput] = useState('')
  const { messages, loading, error, ask, reset } = useChat(document.document_id, apiKey)
  const bottomRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function handleSend() {
    if (!input.trim() || loading) return
    ask(input.trim())
    setInput('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-5 h-5 text-violet-500 shrink-0" />
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
            {document.filename}
          </span>
          <span className="text-xs text-gray-400 shrink-0">{document.chunks} chunks</span>
        </div>
        <button
          onClick={() => { reset(); onReset() }}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors ml-4 shrink-0"
        >
          <RotateCcw className="w-4 h-4" /> New file
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50 dark:bg-gray-950">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 dark:text-gray-600 gap-2">
            <p className="text-lg">Ask anything about your document</p>
            <p className="text-sm">Your answers will be grounded in the file you uploaded</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-2' : ''}`}>
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed
                  ${msg.role === 'user'
                    ? 'bg-violet-600 text-white rounded-br-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm shadow-sm'
                  }`}
              >
                {msg.role === 'model' ? (
                  <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
              {msg.role === 'model' && <SourceCard sources={msg.sources} />}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <Loader2 className="w-4 h-4 text-violet-500 animate-spin" />
            </div>
          </div>
        )}

        {error && (
          <p className="text-center text-sm text-red-500">{error}</p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about your document…"
            rows={1}
            className="flex-1 resize-none border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 max-h-32"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="p-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1 text-center">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}
