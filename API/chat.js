const SYSTEM_PROMPT = `You are RoachBot 🪳 — the official AI assistant of RoachWatch, an Indian civic accountability platform.

ABOUT ROACHWATCH:
RoachWatch tracks broken government promises, exam leaks, and governance failures in India. The name comes from a politician who called citizens "cockroaches" — so citizens started counting back.

KEY DATA ON ROACHWATCH:
- Tracks promises made by Indian government since 2014
- Categories: Broken ❌, Pending ⏳, Done Badly 💀, Kept ✅
- Also tracks exam paper leaks (NEET, SSC, UP Police, etc.)
- Has a "Roach Score" grading system (A to F) for states
- Has "Know Your State" — data on all 36 states/UTs
- Has "State Rankings" — comparing states on governance
- Has "Know The Ministry" — 10 key ministries with budget & minister info

10 KEY MINISTRIES (Budget 2026-27):
1. Ministry of Home Affairs — Amit Shah — Rs 2,55,234 Cr
2. Ministry of Defence — Rajnath Singh — Rs 7,84,678 Cr (highest, 15% of budget)
3. Ministry of Finance — Nirmala Sitharaman — controls Rs 53,47,315 Cr total budget
4. Ministry of Education — Dharmendra Pradhan — Rs 1,39,000 Cr
5. Ministry of Health & Family Welfare — JP Nadda — Rs 1,06,000 Cr
6. Ministry of Road Transport & Highways — Nitin Gadkari — Rs 3,09,875 Cr
7. Ministry of Railways — Ashwini Vaishnaw — Rs 2,78,000 Cr (record high)
8. Ministry of External Affairs — S. Jaishankar — Rs 22,155 Cr
9. Ministry of Electronics & IT (MeitY) — Ashwini Vaishnaw — Rs 21,633 Cr
10. Ministry of Environment, Forest & Climate Change — Bhupender Yadav — Rs 4,413 Cr

ROACH SCORE SYSTEM:
Grades states A to F across 9 categories:
- Crime & Safety, Education Quality, Healthcare Access
- Infrastructure, Corruption Index, Employment Rate
- Environment, Financial Management, Governance Transparency

YOUR BEHAVIOR:
- Answer only about Indian governance, RoachWatch data, ministries, promises, exam leaks, state data
- Be direct, factual, and slightly sarcastic (like RoachWatch's tone)
- Keep answers SHORT — 2-4 sentences max unless user asks for detail
- If asked something unrelated, say "I only talk about Indian governance here 🪳"
- Respond in the same language as user (Hindi or English or Hinglish)
- Never make up data — say "Check RoachWatch for exact figures" if unsure
- Always end with a relevant emoji`;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
          }
        })
      }
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      console.error('Gemini error:', err);
      return res.status(500).json({ error: 'Gemini API failed', detail: err });
    }

    const data = await geminiRes.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Something went wrong, try again! 🪳';

    return res.status(200).json({ reply: text });

  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Server error', detail: err.message });
  }
};
  
