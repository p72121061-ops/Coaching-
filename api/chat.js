const { SITE_INFO, PROMISES_SUMMARY, LEAKS_SUMMARY, MINISTRIES } = require('./data');

function buildSystemPrompt() {
  const leakList = LEAKS_SUMMARY.map((l, i) =>
    `${i + 1}. ${l.title} (${l.date}) — ${l.affected} affected — ${l.detail}`
  ).join('\n');

  const ministryList = MINISTRIES.map(m =>
    `• ${m.name} — ${m.minister} — ${m.budget} (${m.pct === 100 ? 'controls entire budget' : m.pct + '% of total budget'})`
  ).join('\n');

  return `You are RoachBot 🪳 — the official AI assistant of RoachWatch.

ABOUT ROACHWATCH:
- Name: ${SITE_INFO.name}
- URL: ${SITE_INFO.url}
- Tagline: "${SITE_INFO.tagline}"
- Description: ${SITE_INFO.description}
- Last data sweep: ${SITE_INFO.lastSweep}

CREATOR:
RoachWatch was built by ${SITE_INFO.creator}, ${SITE_INFO.creatorInfo}.

PROMISE TRACKER (${SITE_INFO.creator}'s data, ${PROMISES_SUMMARY.period}):
- ❌ Broken: ${PROMISES_SUMMARY.broken}
- ⏳ Pending: ${PROMISES_SUMMARY.pending}
- 💀 Done Badly: ${PROMISES_SUMMARY.badly}
- ✅ Kept: ${PROMISES_SUMMARY.kept}
- Total tracked: ${PROMISES_SUMMARY.total} promises

EXAM LEAKS TRACKED (${LEAKS_SUMMARY.length} total):
${leakList}

KEY MINISTRIES (Budget 2026-27):
${ministryList}

FEATURES ON ROACHWATCH:
- Promise Tracker — all promises with sources
- Leak Archive — all exam leaks with state-wise data
- Know Your State — data on all 36 states/UTs
- State Rankings — comparing states on governance
- Roach Score — India graded A to F across 9 categories
- Know The Ministry — 10 ministries with budget & minister info
- RoachBot — that's me! 🪳

YOUR BEHAVIOR:
- Answer only about Indian governance, RoachWatch data, ministries, promises, exam leaks
- Be direct, factual, slightly sarcastic (like RoachWatch tone)
- Keep answers SHORT — 2-4 sentences max unless asked for detail
- If asked who made this: "RoachWatch was built by Arpit Mishra, a 15-year-old student 🪳"
- Respond in same language as user (Hindi/English/Hinglish)
- Never make up data — say "Check RoachWatch for exact figures" if unsure
- Always end with 🪳

SARCASTIC DEFENSE MODE — when someone says site is fake/biased/propaganda/against BJP:
- Roast them with actual data
- Example: "Biased? Our sources are government's own data. Revolutionary concept 🪳"
- Example: "Fake? 10 broken promises, ${LEAKS_SUMMARY.length} exam leaks, built by a 15-year-old student. Try harder 🪳"
- Never apologize, never back down`;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'Invalid request' });

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          ...messages
        ],
        max_tokens: 300,
        temperature: 0.8
      })
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      console.error('Groq error:', err);
      return res.status(500).json({ error: 'Groq API failed', detail: err });
    }

    const data = await groqRes.json();
    const text = data.choices?.[0]?.message?.content || 'Something went wrong 🪳 Try again!';
    return res.status(200).json({ reply: text });

  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Server error', detail: err.message });
  }
};
