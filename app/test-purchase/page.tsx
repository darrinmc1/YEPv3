'use client'

import { useState, useEffect } from 'react'

export default function TestPurchasePage() {
  const [email, setEmail] = useState('darrinmc1@yahoo.com')
  const [productType, setProductType] = useState('research')
  const [ideaId, setIdeaId] = useState('1')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleTestPurchase = async () => {
    setLoading(true)
    setResult(null)

    try {
      const payload = {
        email,
        productType,
        price: productType === 'research' ? 9 : 29,
        ideaId
      }

      console.log('Sending purchase request:', payload)

      const response = await fetch('/api/process-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, data })
      } else {
        setResult({ success: false, error: data })
      }
    } catch (error: any) {
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
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-purple-200 mb-3">
              Product Type
            </label>
            <div className="grid gap-3">
              
              <button
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
                    <div className="text-sm text-purple-200">Single idea (10 pages)</div>
                  </div>
                  <div className="text-purple-300 font-bold">$9</div>
                </div>
              </button>

              <button
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
                    <div className="text-sm text-purple-200">90-day roadmap (15+ pages)</div>
                  </div>
                  <div className="text-purple-300 font-bold">$29</div>
                </div>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-purple-200 mb-2">
              Idea ID (Column A from Google Sheet)
            </label>
            <input
              type="text"
              value={ideaId}
              onChange={(e) => setIdeaId(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={handleTestPurchase}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : '🚀 Test FREE Delivery'}
          </button>
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
                <div className="bg-black/20 rounded-lg p-4 mb-4">
                  <pre className="text-xs text-green-100 overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
                <p className="text-green-200">📧 Check {email} for your PDFs!</p>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">❌ Error</h3>
                <div className="bg-black/20 rounded-lg p-4">
                  <pre className="text-xs text-red-100 overflow-auto">
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
            <li>✅ PDF generation from your data</li>
            <li>✅ AI validation (Ollama/Gemini)</li>
            <li>✅ Email delivery with PDFs</li>
            <li>✅ Purchase tracking in Sheets</li>
          </ul>
        </div>

      </div>
    </div>
  )
}
