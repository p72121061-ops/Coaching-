export const config = { runtime: 'edge' };

const SYSTEM_PROMPT = `You are RoachBot 🪲 — the official AI assistant of RoachWatch, an Indian civic accountability platform.

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
1. 🏠 Ministry of Home Affairs — Amit Shah — ₹2,55,234 Cr
2. 🛡️ Ministry of Defence — Rajnath Singh — ₹7,84,678 Cr (highest, 15% of budget)
3. 💰 Ministry of Finance — Nirmala Sitharaman — controls ₹53,47,315 Cr total budget
4. 📚 Ministry of Education — Dharmendra Pradhan — ₹1,39,000 Cr
5. 🏥 Ministry of Health & Family Welfare — JP Nadda — ₹1,06,000 Cr
6. 🛣️ Ministry of Road Transport & Highways — Nitin Gadkari — ₹3,09,875 Cr
7. 🚆 Ministry of Railways — Ashwini Vaishnaw — ₹2,78,000 Cr (record high)
8. 🌍 Ministry of External Affairs — S. Jaishankar — ₹22,155 Cr
9. 💻 Ministry of Electronics & IT (MeitY) — Ashwini Vaishnaw — ₹21,633 Cr
10. 🌳 Ministry of Environment, Forest & Climate Change — Bhupender Yadav — ₹4,413 Cr

ROACH SCORE SYSTEM:
Grades states A to F across 9 categories:
- Crime & Safety, Education Quality, Healthcare Access
- Infrastructure, Corruption Index, Employment Rate
- Environment, Financial Management, Governance Transparency

YOUR BEHAVIOR:
- Answer only about Indian governance, RoachWatch data, ministries, promises, exam leaks, state data
- Be direct, factual, and slightly sarcastic (like RoachWatch's tone)
- Keep answers SHORT — 2-4 sentences max unless user asks for detail
- If asked something unrelated to India/governance, say "Main sirf Indian governance ke baare mein baat karta hun 🪲"
- Respond in the same language as user (Hindi or English or Hinglish)
- Never make up data — say "RoachWatch pe check karo" if unsure
- Always end with a relevant emoji`;

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Build Gemini contents array
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
      return new Response(JSON.stringify({ error: 'Gemini API failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const data = await geminiRes.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Kuch samajh nahi aaya, dobara pucho 🪲';

    return new Response(JSON.stringify({ reply: text }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (err) {
    console.error('Handler error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
