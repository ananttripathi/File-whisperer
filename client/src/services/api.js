const BASE_URL = import.meta.env.VITE_API_URL || '/api'

export async function uploadFile(file, apiKey) {
  const form = new FormData()
  form.append('file', file)

  const res = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    headers: { 'x-api-key': apiKey },
    body: form,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Upload failed')
  return data
}

export async function sendMessage(documentId, question, history, apiKey) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({ document_id: documentId, question, history }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Chat request failed')
  return data
}
