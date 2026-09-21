import { Router, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { requireAuth, AuthenticatedRequest } from '../middleware/authMiddleware';

export const aiTriageRouter = Router();

let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.error('[AI] Failed to initialize GoogleGenAI client:', err);
    }
  }
  return aiClient;
}

/**
 * POST /api/triage/assist
 * Clinical pre-triage guidance proxy
 */
aiTriageRouter.post('/assist', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { symptomQuery, language } = req.body;

  if (!symptomQuery || typeof symptomQuery !== 'string') {
    res.status(400).json({
      success: false,
      error: { code: 'MISSING_QUERY', message: 'symptomQuery is required' },
    });
    return;
  }

  const queryLower = symptomQuery.toLowerCase();
  const isRedFlag =
    queryLower.includes('chest') ||
    queryLower.includes('heart') ||
    queryLower.includes('breath') ||
    queryLower.includes('unconscious') ||
    queryLower.includes('stroke') ||
    queryLower.includes('bleeding') ||
    queryLower.includes('pain') ||
    queryLower.includes('fall');

  const ai = getAi();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an emergency pre-triage decision-support assistant for AegisCare in Hyderabad, India.
The user is describing these symptoms: "${symptomQuery}".
Language preference: ${language || 'English'}.
CRITICAL SAFETY RULES:
1. You MUST explicitly provide emergency triage advice (e.g. recommend 112/108 if acute red flag).
2. Clearly state: "MANDATORY NOTICE: This is an automated pre-triage guidance protocol, not a clinical medical diagnosis."
3. Provide concise immediate first-aid guidance and recommend the appropriate department (Emergency, Cardiology, Neurology, General Physician).
Keep the response under 150 words.`,
      });

      res.json({
        success: true,
        data: {
          guidance: response.text || '',
          isEmergency: isRedFlag,
          disclaimer: 'Pre-triage guidance only — not a clinical medical diagnosis. In a medical emergency, call 112 or 108.',
        },
      });
      return;
    } catch (err) {
      console.error('[AI] Gemini generation error, using rule-based pre-triage fallback:', err);
    }
  }

  // Rule-based fallback
  const fallbackAdvice = isRedFlag
    ? `🚨 CRITICAL EMERGENCY PRE-TRIAGE ADVICE:
Your reported symptoms ("${symptomQuery}") indicate potential acute cardiovascular or trauma indicators.
Recommended Next Steps:
1. Tap the 1-Touch 112 SOS Dispatch immediately or dial 108 from your telephone.
2. Rest in a comfortable seated position; do not exert yourself.
3. If prescribed, keep sublingual nitroglycerin or emergency cardiac medications accessible.
⚠️ MANDATORY NOTICE: This is an automated pre-triage guidance protocol, not a clinical medical diagnosis.`
    : `ℹ️ PRE-TRIAGE CLINICAL ADVICE:
Your query ("${symptomQuery}") has been categorized under non-acute outpatient evaluation.
Recommended Next Steps:
1. Schedule a consultation with a registered physician at Apollo Health City or Continental Hospitals.
2. Monitor vital signs (temperature, pulse, blood pressure).
3. If symptoms acutely worsen or severe chest/respiratory pain develops, activate the 112 SOS button.
⚠️ MANDATORY NOTICE: This is an automated pre-triage guidance protocol, not a clinical medical diagnosis.`;

  res.json({
    success: true,
    data: {
      guidance: fallbackAdvice,
      isEmergency: isRedFlag,
      disclaimer: 'Pre-triage guidance only — not a clinical medical diagnosis. In a medical emergency, call 112 or 108.',
    },
  });
});
