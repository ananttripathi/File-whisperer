import { useState } from 'react'
import { Key, ExternalLink } from 'lucide-react'

export default function ApiKeyModal({ onSave }) {
  const [key, setKey] = useState('')

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-violet-100 dark:bg-violet-900 rounded-xl">
            <Key className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Enter your Cohere API Key</h2>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Your key is stored only in your browser and never sent to our servers.
          Get a free key from{' '}
          <a
            href="https://dashboard.cohere.com/api-keys"
            target="_blank"
            rel="noreferrer"
            className="text-violet-600 dark:text-violet-400 underline inline-flex items-center gap-1"
          >
            Cohere Dashboard <ExternalLink className="w-3 h-3" />
          </a>
        </p>

        <input
          type="password"
          value={key}
          onChange={e => setKey(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && key.trim() && onSave(key.trim())}
          placeholder="your-cohere-api-key..."
          className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 mb-4"
          autoFocus
        />

        <button
          onClick={() => key.trim() && onSave(key.trim())}
          disabled={!key.trim()}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
