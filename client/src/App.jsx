import { useState, useEffect } from 'react'
import { Moon, Sun, Key } from 'lucide-react'
import ApiKeyModal from './components/ApiKeyModal'
import FileUploader from './components/FileUploader'
import ChatWindow from './components/ChatWindow'

const STORAGE_KEY = 'fw_gemini_key'

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(STORAGE_KEY) || '')
  const [showKeyModal, setShowKeyModal] = useState(false)
  const [document, setDocument] = useState(null)
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)

  useEffect(() => {
    document?.documentElement?.classList?.toggle('dark', dark)
    window.document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  function saveKey(key) {
    localStorage.setItem(STORAGE_KEY, key)
    setApiKey(key)
    setShowKeyModal(false)
  }

  if (!apiKey) {
    return <ApiKeyModal onSave={saveKey} />
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shrink-0">
        <span className="font-bold text-violet-600 dark:text-violet-400 text-lg">File Whisperer</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowKeyModal(true)}
            title="Change API key"
            className="p-2 text-gray-500 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors"
          >
            <Key className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDark(d => !d)}
            className="p-2 text-gray-500 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 overflow-hidden">
        {document ? (
          <ChatWindow
            document={document}
            apiKey={apiKey}
            onReset={() => setDocument(null)}
          />
        ) : (
          <FileUploader apiKey={apiKey} onUploaded={setDocument} />
        )}
      </main>

      {showKeyModal && <ApiKeyModal onSave={saveKey} />}
    </div>
  )
}
