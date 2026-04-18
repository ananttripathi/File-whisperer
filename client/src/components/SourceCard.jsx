import { useState } from 'react'
import { ChevronDown, ChevronUp, FileText } from 'lucide-react'

export default function SourceCard({ sources }) {
  const [open, setOpen] = useState(false)

  if (!sources?.length) return null

  return (
    <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden text-sm">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          {sources.length} source{sources.length > 1 ? 's' : ''}
        </span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {open && (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {sources.map((s, i) => (
            <div key={i} className="px-3 py-2 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400">
              <span className="text-xs font-medium text-violet-500 block mb-1">Excerpt {i + 1}</span>
              <p className="line-clamp-3">{s.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
