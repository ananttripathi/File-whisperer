import { useState, useCallback } from 'react'
import { sendMessage } from '../services/api'

export function useChat(documentId, apiKey) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const ask = useCallback(async (question) => {
    if (!question.trim() || loading) return

    const userMsg = { role: 'user', content: question }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)
    setError(null)

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const { answer, sources } = await sendMessage(documentId, question, history, apiKey)
      setMessages(prev => [...prev, { role: 'model', content: answer, sources }])
    } catch (e) {
      setError(e.message)
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }, [documentId, apiKey, messages, loading])

  const reset = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return { messages, loading, error, ask, reset }
}
