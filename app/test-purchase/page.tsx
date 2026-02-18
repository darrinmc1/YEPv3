'use client'

import { useState } from 'react'

export default function TestPurchasePage() {
  const [email, setEmail] = useState('darrinmc1@yahoo.com')
  const [productType, setProductType] = useState('research')
  const [ideaId, setIdeaId] = useState('') // Let user enter ID
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleTestPurchase = async () => {
    if (!ideaId.trim()) {
      alert('Please enter an Idea ID from your Google Sheet (Column A)')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const payload = {
        email,
        productType,
        price: productType === 'research' ? 9 : 29,
        ideaId: ideaId.trim()
      }

      console.log('🚀 Sending purchase request:', payload)

      const response = await fetch('/api/process-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      console.log('📡 Response status:', response.status)

      const data = await response.json()
      console.log('📦 Response data:', data)

      if (response.ok) {
        setResult({ success: true, data })
      } else {
        setResult({ success: false, error: data })
      }
    } catch (error: any) {
      console.error('❌ Error:', error)
      setResult({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-2">🧪 Test Purchase System</h1>
          <p className="text-purple-200">Test the entire purchase flow with FREE delivery</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-purple-200 mb-2">
              Your Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="you@email.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-purple-200 mb-3">
              Product Type
            </label>
            <div className="grid gap-3">
              
              <button
                type="button"
                onClick={() => setProductType('research')}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  productType === 'research'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-white/20 bg-white/5 hover:border-purple-400'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-white">Research Report</div>
                    <div className="text-sm text-purple-200">10 comprehensive pages</div>
                  </div>
                  <div className="text-purple-300 font-bold">$9</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setProductType('implementation')}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  productType === 'implementation'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-white/20 bg-white/5 hover:border-purple-400'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-white">Implementation Plan</div>
                    <div className="text-sm text-purple-200">15+ page roadmap</div>
                  </div>
                  <div className="text-purple-300 font-bold">$29</div>
                </div>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-purple-200 mb-2">
              Idea ID from Google Sheet (Column A)
            </label>
            <input
              type="text"
              value={ideaId}
              onChange={(e) => setIdeaId(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter the ID from Column A"
            />
            <p className="text-xs text-purple-300 mt-2">
              💡 Open your <a href="https://docs.google.com/spreadsheets/d/1aKxrwa9pAL6qhltvqd1eJERFZsxqWlHWQg2e9Gj3QZ8" target="_blank" className="underline">Ideas Library Sheet</a> and copy an ID from Column A
            </p>
          </div>

          <button
            type="button"
            onClick={handleTestPurchase}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              '🚀 Test FREE Delivery'
            )}
          </button>

          <p className="text-xs text-purple-300 mt-3 text-center">
            Opens browser console (F12) for detailed logs
          </p>
        </div>

        {result && (
          <div className={`mt-6 p-6 rounded-2xl border-2 ${
            result.success 
              ? 'bg-green-500/10 border-green-500' 
              : 'bg-red-500/10 border-red-500'
          }`}>
            {result.success ? (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">✅ Success!</h3>
                <div className="space-y-2 text-sm mb-4">
                  <div className="text-white">✅ PDFs generated (10 pages!)</div>
                  <div className="text-white">✅ AI validation completed</div>
                  <div className="text-white">✅ Email sent to {email}</div>
                  <div className="text-white">✅ Purchase saved to Sheets</div>
                </div>
                <p className="text-green-200 text-lg font-bold">📧 Check {email} for your PDF!</p>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">❌ Error</h3>
                <p className="text-red-200 mb-4">{result.error?.error || 'Something went wrong'}</p>
                <div className="bg-black/20 rounded-lg p-4">
                  <pre className="text-xs text-red-100 overflow-auto max-h-40">
                    {JSON.stringify(result.error, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 bg-blue-500/10 rounded-2xl p-6 border border-blue-500/30">
          <h3 className="text-lg font-bold text-white mb-3">📋 What This Tests:</h3>
          <ul className="space-y-2 text-sm text-blue-100">
            <li>✅ PDF generation (10 pages!)</li>
            <li>✅ AI validation (Ollama/Gemini)</li>
            <li>✅ Email delivery with new keys</li>
            <li>✅ Purchase tracking in Sheets</li>
          </ul>
        </div>

      </div>
    </div>
  )
}
