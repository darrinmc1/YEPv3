'use client'

import { useState, useEffect } from 'react'

export default function DebugIdeasPage() {
  const [ideas, setIdeas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/debug-ideas')
      .then(r => r.json())
      .then(data => {
        if (data.ideas) {
          setIdeas(data.ideas)
        } else {
          setError(JSON.stringify(data))
        }
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">🔍 Debug: Ideas in Google Sheet</h1>
        
        {loading && <p className="text-white">Loading ideas from Google Sheets...</p>}
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded p-4 mb-4">
            <p className="text-red-200">{error}</p>
          </div>
        )}
        
        {!loading && !error && (
          <>
            <p className="text-green-400 mb-4">✅ Found {ideas.length} ideas in your sheet</p>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-700">
                    <th className="p-2 text-purple-400">ID (Column A)</th>
                    <th className="p-2 text-purple-400">Title (Column B)</th>
                    <th className="p-2 text-purple-400">Industry</th>
                  </tr>
                </thead>
                <tbody>
                  {ideas.slice(0, 20).map((idea, i) => (
                    <tr key={i} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="p-2 text-white font-mono">{idea.id || 'MISSING'}</td>
                      <td className="p-2 text-gray-300">{idea.title || 'MISSING'}</td>
                      <td className="p-2 text-gray-400">{idea.industry || 'MISSING'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {ideas.length > 20 && (
                <p className="text-gray-400 mt-4 text-center">
                  Showing first 20 of {ideas.length} ideas
                </p>
              )}
            </div>
            
            <div className="mt-6 bg-blue-500/20 border border-blue-500 rounded p-4">
              <p className="text-blue-200 font-bold mb-2">💡 Copy one of these IDs to test:</p>
              <div className="grid grid-cols-5 gap-2">
                {ideas.slice(0, 10).map((idea, i) => (
                  <button
                    key={i}
                    onClick={() => navigator.clipboard.writeText(idea.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-mono"
                  >
                    {idea.id}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
