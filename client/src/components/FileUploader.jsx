import { useState, useRef } from 'react'
import { Upload, FileText, Loader2 } from 'lucide-react'
import { uploadFile } from '../services/api'

const ACCEPTED = '.pdf,.docx,.txt'

export default function FileUploader({ apiKey, onUploaded }) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef()

  async function handleFile(file) {
    if (!file) return
    setError(null)
    setUploading(true)
    try {
      const result = await uploadFile(file, apiKey)
      onUploaded(result)
    } catch (e) {
      setError(e.message)
    } finally {
      setUploading(false)
    }
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-2">
          File Whisperer
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
          Upload a document and ask anything about it
        </p>

        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center gap-4 cursor-pointer transition-colors
            ${dragging
              ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
              : 'border-gray-300 dark:border-gray-700 hover:border-violet-400 dark:hover:border-violet-600 bg-white dark:bg-gray-900'
            }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            className="hidden"
            onChange={e => handleFile(e.target.files[0])}
          />

          {uploading ? (
            <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
          ) : (
            <Upload className="w-10 h-10 text-violet-400" />
          )}

          <div className="text-center">
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              {uploading ? 'Processing document…' : 'Drop your file here or click to browse'}
            </p>
            <p className="text-sm text-gray-400 mt-1">PDF, DOCX, TXT — max 20MB</p>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
        )}
      </div>
    </div>
  )
}
