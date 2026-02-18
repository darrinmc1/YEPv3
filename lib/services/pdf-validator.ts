/**
 * AI-Powered PDF Quality Validation
 * Uses Ollama (local, free) with Gemini fallback
 */

interface PDFValidationResult {
  isValid: boolean;
  issues: string[];
  warnings: string[];
  score: number; // 0-100
  recommendations: string[];
  aiProvider: 'ollama' | 'gemini' | 'rules-only';
  analysis: string;
}

/**
 * Extract text from PDF buffer for AI analysis
 */
async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  try {
    // Using pdf-parse to extract text
    const pdfParse = require('pdf-parse');
    const data = await pdfParse(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error('PDF text extraction failed:', error);
    return '';
  }
}

/**
 * Analyze PDF content using Ollama (local AI)
 */
async function analyzeWithOllama(pdfText: string, metadata: any): Promise<any> {
  try {
    const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    const model = process.env.OLLAMA_MODEL || 'llama3.1:8b';

    const prompt = `You are a PDF quality inspector for business reports. Analyze this PDF content and provide a detailed quality assessment.

EXPECTED CONTENT FOR ${metadata.productType.toUpperCase()}:
- Business Overview section
- Market Analysis
- Key Insights
- Cost Breakdown
${metadata.productType === 'implementation' ? '- 90-Day Roadmap\n- Tech Stack\n- Marketing Channels\n- Launch Checklist' : ''}

PDF TEXT CONTENT:
${pdfText.substring(0, 4000)}

ANALYZE AND RESPOND IN THIS EXACT JSON FORMAT:
{
  "score": [0-100 number],
  "issues": ["list of critical problems"],
  "warnings": ["list of minor concerns"],
  "recommendations": ["list of improvement suggestions"],
  "analysis": "brief summary of quality"
}

Focus on:
1. Is all expected content present?
2. Is text properly formatted (no truncation, no overlaps)?
3. Are sections complete and professional?
4. Any obvious errors or missing data?

Respond ONLY with valid JSON, no markdown, no explanation.`;

    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: {
          temperature: 0.3,
          top_p: 0.9,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.response || '';

    // Parse JSON from AI response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Could not parse AI response');
  } catch (error) {
    console.warn('Ollama analysis failed:', error);
    throw error;
  }
}

/**
 * Analyze PDF content using Google Gemini (fallback)
 */
async function analyzeWithGemini(pdfText: string, metadata: any): Promise<any> {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest';

    const prompt = `You are a PDF quality inspector for business reports. Analyze this PDF content and provide a detailed quality assessment.

EXPECTED CONTENT FOR ${metadata.productType.toUpperCase()}:
- Business Overview section
- Market Analysis
- Key Insights
- Cost Breakdown
${metadata.productType === 'implementation' ? '- 90-Day Roadmap\n- Tech Stack\n- Marketing Channels\n- Launch Checklist' : ''}

PDF TEXT CONTENT:
${pdfText.substring(0, 4000)}

ANALYZE AND RESPOND IN THIS EXACT JSON FORMAT:
{
  "score": [0-100 number],
  "issues": ["list of critical problems"],
  "warnings": ["list of minor concerns"],
  "recommendations": ["list of improvement suggestions"],
  "analysis": "brief summary of quality"
}

Focus on:
1. Is all expected content present?
2. Is text properly formatted (no truncation, no overlaps)?
3. Are sections complete and professional?
4. Any obvious errors or missing data?

Respond ONLY with valid JSON.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.3,
          topP: 0.9,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse JSON from AI response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Could not parse AI response');
  } catch (error) {
    console.warn('Gemini analysis failed:', error);
    throw error;
  }
}

/**
 * Rules-based validation (fallback if both AIs fail)
 */
function rulesBasedValidation(pdfBuffer: Buffer, pdfText: string, metadata: any): any {
  const issues: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // File size checks
  const fileSizeKB = pdfBuffer.length / 1024;
  if (fileSizeKB < 10) {
    issues.push('PDF file size too small - likely generation error');
    score -= 50;
  } else if (fileSizeKB < 30) {
    warnings.push('PDF smaller than expected - may be missing content');
    score -= 10;
  }

  // Text content checks
  if (!pdfText || pdfText.length < 500) {
    issues.push('PDF has very little text content');
    score -= 40;
  }

  // Check for expected sections
  const expectedSections = ['Business Overview', 'Market', 'Insights', 'Cost'];
  const missingSections = expectedSections.filter(section => 
    !pdfText.toLowerCase().includes(section.toLowerCase())
  );
  
  if (missingSections.length > 0) {
    warnings.push(`Missing sections: ${missingSections.join(', ')}`);
    score -= (missingSections.length * 10);
  }

  // Check for errors/truncation
  if (pdfText.includes('undefined') || pdfText.includes('null')) {
    warnings.push('PDF contains undefined/null values');
    score -= 15;
  }

  if (score < 70) {
    recommendations.push('Regenerate PDF with complete data');
  }

  return {
    score: Math.max(0, score),
    issues,
    warnings,
    recommendations,
    analysis: `Rules-based validation. File size: ${fileSizeKB.toFixed(1)}KB, Text length: ${pdfText.length} chars`
  };
}

/**
 * Main validation function with AI analysis
 */
export async function validatePDFQuality(
  pdfBuffer: Buffer,
  metadata: {
    productType: string;
    ideaTitle: string;
    expectedPages: number;
  }
): Promise<PDFValidationResult> {
  console.log('🤖 Starting AI-powered PDF validation...');

  // Extract text from PDF
  const pdfText = await extractTextFromPDF(pdfBuffer);
  console.log(`📄 Extracted ${pdfText.length} characters from PDF`);

  let aiResult: any;
  let aiProvider: 'ollama' | 'gemini' | 'rules-only' = 'rules-only';

  // Try Ollama first (local, free)
  try {
    console.log('🦙 Attempting validation with Ollama (local)...');
    aiResult = await analyzeWithOllama(pdfText, metadata);
    aiProvider = 'ollama';
    console.log('✅ Ollama validation successful');
  } catch (ollamaError) {
    console.log('⚠️ Ollama unavailable, trying Gemini fallback...');
    
    // Fallback to Gemini
    try {
      aiResult = await analyzeWithGemini(pdfText, metadata);
      aiProvider = 'gemini';
      console.log('✅ Gemini validation successful');
    } catch (geminiError) {
      console.log('⚠️ Gemini unavailable, using rules-based validation');
      
      // Final fallback to rules-based
      aiResult = rulesBasedValidation(pdfBuffer, pdfText, metadata);
      aiProvider = 'rules-only';
    }
  }

  // Ensure arrays
  const issues = Array.isArray(aiResult.issues) ? aiResult.issues : [];
  const warnings = Array.isArray(aiResult.warnings) ? aiResult.warnings : [];
  const recommendations = Array.isArray(aiResult.recommendations) ? aiResult.recommendations : [];
  const score = typeof aiResult.score === 'number' ? aiResult.score : 50;
  const analysis = aiResult.analysis || 'No analysis available';

  return {
    isValid: issues.length === 0 && score >= 70,
    issues,
    warnings,
    score,
    recommendations,
    aiProvider,
    analysis
  };
}

/**
 * Send validation alert email
 */
export async function sendValidationAlert(
  validation: PDFValidationResult,
  context: {
    productType: string;
    ideaTitle: string;
    customerEmail: string;
  }
) {
  if (!process.env.RESEND_API_KEY) {
    console.log('⚠️ Resend API key not configured, skipping validation alert');
    return;
  }

  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const statusColor = validation.isValid ? '#10b981' : '#ef4444';
  const statusText = validation.isValid ? 'PASSED' : 'FAILED';
  const aiProviderName = {
    'ollama': '🦙 Ollama (Local)',
    'gemini': '🤖 Gemini (Cloud)',
    'rules-only': '📏 Rules-Based'
  }[validation.aiProvider];

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>AI PDF Validation Report</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden;">
    
    <div style="background-color: ${statusColor}; color: white; padding: 20px;">
      <h1 style="margin: 0; font-size: 24px;">AI Validation: ${statusText}</h1>
      <p style="margin: 5px 0 0; opacity: 0.9;">Score: ${validation.score}/100 • ${aiProviderName}</p>
    </div>
    
    <div style="padding: 30px;">
      
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
        <p style="margin: 0 0 8px; font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold;">Purchase Details</p>
        <p style="margin: 5px 0;"><strong>Product:</strong> ${context.productType}</p>
        <p style="margin: 5px 0;"><strong>Idea:</strong> ${context.ideaTitle}</p>
        <p style="margin: 5px 0;"><strong>Customer:</strong> ${context.customerEmail}</p>
      </div>
      
      <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 15px;">
        <p style="margin: 0 0 10px; font-weight: bold; color: #1e40af;">🤖 AI Analysis</p>
        <p style="margin: 0; color: #1e3a8a;">${validation.analysis}</p>
      </div>
      
      ${validation.issues.length > 0 ? `
      <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin-bottom: 15px;">
        <p style="margin: 0 0 10px; font-weight: bold; color: #991b1b;">❌ Critical Issues</p>
        <ul style="margin: 0; padding-left: 20px;">
          ${validation.issues.map(issue => `<li style="color: #7f1d1d; margin-bottom: 5px;">${issue}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
      
      ${validation.warnings.length > 0 ? `
      <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 15px;">
        <p style="margin: 0 0 10px; font-weight: bold; color: #92400e;">⚠️ Warnings</p>
        <ul style="margin: 0; padding-left: 20px;">
          ${validation.warnings.map(warning => `<li style="color: #78350f; margin-bottom: 5px;">${warning}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
      
      ${validation.recommendations.length > 0 ? `
      <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 15px;">
        <p style="margin: 0 0 10px; font-weight: bold; color: #1e40af;">💡 AI Recommendations</p>
        <ul style="margin: 0; padding-left: 20px;">
          ${validation.recommendations.map(rec => `<li style="color: #1e3a8a; margin-bottom: 5px;">${rec}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
      
    </div>
    
    <div style="background-color: #f9fafb; padding: 15px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; font-size: 12px; color: #6b7280;">
        YourExitPlans AI Quality Assurance • Powered by ${aiProviderName}
      </p>
    </div>
    
  </div>
</body>
</html>
  `;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'YourExitPlans <onboarding@resend.dev>',
      to: process.env.RESEND_REPLY_TO || 'support@yourexitplans.com',
      subject: `AI Validation ${statusText}: ${context.productType} - Score ${validation.score}/100`,
      html: emailHtml,
    });
    console.log('📧 Validation alert email sent');
  } catch (error) {
    console.error('❌ Failed to send validation alert:', error);
  }
}
