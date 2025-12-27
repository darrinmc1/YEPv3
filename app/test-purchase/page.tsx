'use client';

import { useState } from 'react';

export default function TestPurchasePage() {
  const [email, setEmail] = useState('darrinmc1@yahoo.com');
  const [productType, setProductType] = useState('research');
  const [ideaId, setIdeaId] = useState('1');
  const [ideaIds, setIdeaIds] = useState('1,2,3,4,5,6,7');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTestPurchase = async () => {
    setLoading(true);
    setResult(null);

    try {
      const payload: any = {
        email,
        productType,
        price: productType === 'research' ? 9 : productType === 'implementation' ? 29 : productType === 'idea-bundle' ? 49 : 99
      };

      // Add idea IDs based on product type
      if (productType === 'research' || productType === 'implementation') {
        payload.ideaId = ideaId;
      } else {
        payload.ideaIds = ideaIds.split(',').map(id => id.trim());
      }

      console.log('Sending purchase request:', payload);

      const response = await fetch('/api/process-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, data });
      } else {
        setResult({ success: false, error: data });
      }
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const isBundlePurchase = productType === 'idea-bundle' || productType === 'premium-bundle';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-2">🧪 Test Purchase System</h1>
          <p className="text-purple-200">Test the entire purchase flow with FREE delivery (no payment required)</p>
        </div>

        {/* Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          
          {/* Email Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-purple-200 mb-2">
              Your Email (where PDFs will be sent)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="you@email.com"
            />
          </div>

          {/* Product Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-purple-200 mb-3">
              Select Product Type
            </label>
            <div className="grid grid-cols-1 gap-3">
              
              {/* Research Report */}
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
                    <div className="text-sm text-purple-200">Single idea deep dive (2 pages)</div>
                  </div>
                  <div className="text-purple-300 font-bold">$9</div>
                </div>
              </button>

              {/* Implementation Plan */}
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
                    <div className="font-bold text-white">Research + Implementation</div>
                    <div className="text-sm text-purple-200">90-day roadmap included (3 pages)</div>
                  </div>
                  <div className="text-purple-300 font-bold">$29</div>
                </div>
              </button>

              {/* 7 Ideas Bundle */}
              <button
                onClick={() => setProductType('idea-bundle')}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  productType === 'idea-bundle'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-white/20 bg-white/5 hover:border-purple-400'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-white">7 Ideas Bundle</div>
                    <div className="text-sm text-purple-200">7 research reports</div>
                  </div>
                  <div className="text-purple-300 font-bold">$49</div>
                </div>
              </button>

              {/* 10 Ideas Bundle */}
              <button
                onClick={() => setProductType('premium-bundle')}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  productType === 'premium-bundle'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-white/20 bg-white/5 hover:border-purple-400'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-white">10 Ideas + Implementation</div>
                    <div className="text-sm text-purple-200">10 reports + generic roadmap</div>
                  </div>
                  <div className="text-purple-300 font-bold">$99</div>
                </div>
              </button>
            </div>
          </div>

          {/* Idea ID Input */}
          {!isBundlePurchase ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Idea ID (from your Google Sheet, Column A)
              </label>
              <input
                type="text"
                value={ideaId}
                onChange={(e) => setIdeaId(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="1"
              />
              <p className="text-xs text-purple-300 mt-2">
                💡 Check Column A of your Ideas Library sheet
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Idea IDs (comma-separated, {productType === 'idea-bundle' ? '7' : '10'} required)
              </label>
              <input
                type="text"
                value={ideaIds}
                onChange={(e) => setIdeaIds(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="1,2,3,4,5,6,7"
              />
              <p className="text-xs text-purple-300 mt-2">
                💡 Enter {productType === 'idea-bundle' ? '7' : '10'} idea IDs separated by commas
              </p>
            </div>
          )}

          {/* Test Button */}
          <button
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
              '🚀 Test FREE Delivery (No Payment)'
            )}
          </button>

          <p className="text-xs text-purple-300 mt-3 text-center">
            This will generate PDFs, run AI validation, and send them to your email
          </p>
        </div>

        {/* Results */}
        {result && (
          <div className={`mt-6 p-6 rounded-2xl border-2 ${
            result.success 
              ? 'bg-green-500/10 border-green-500' 
              : 'bg-red-500/10 border-red-500'
          }`}>
            {result.success ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">✅</div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Success!</h3>
                    <p className="text-green-200">Purchase processed and PDFs delivered</p>
                  </div>
                </div>
                <div className="bg-black/20 rounded-lg p-4 mb-4">
                  <pre className="text-xs text-green-100 overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="text-white">✅ PDFs generated</div>
                  <div className="text-white">✅ AI validation completed</div>
                  <div className="text-white">✅ Email sent to {email}</div>
                  <div className="text-white">✅ Purchase saved to Google Sheets</div>
                  <div className="text-purple-200 mt-4">
                    📧 Check your email for the PDFs!
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">❌</div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Error</h3>
                    <p className="text-red-200">Something went wrong</p>
                  </div>
                </div>
                <div className="bg-black/20 rounded-lg p-4">
                  <pre className="text-xs text-red-100 overflow-auto">
                    {JSON.stringify(result.error, null, 2)}
                  </pre>
                </div>
              </>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-blue-500/10 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30">
          <h3 className="text-lg font-bold text-white mb-3">📋 What This Tests:</h3>
          <ul className="space-y-2 text-sm text-blue-100">
            <li>✅ PDF generation with your real idea data</li>
            <li>✅ AI validation (Ollama → Gemini → Rules fallback)</li>
            <li>✅ Email delivery with PDF attachments</li>
            <li>✅ Purchase tracking in Google Sheets</li>
            <li>✅ Console logging and error handling</li>
          </ul>
          <div className="mt-4 p-3 bg-blue-500/20 rounded-lg">
            <p className="text-xs text-blue-200">
              💡 <strong>Tip:</strong> Open your browser console (F12) to see detailed logs of the entire process!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
