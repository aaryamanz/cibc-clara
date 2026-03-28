export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, spendingContext } = req.body;

  const systemPrompt = `You are Clara, CIBC's Proactive Financial Intelligence Co-Pilot. You are friendly, knowledgeable, and concise.

You have access to the user's spending profile:
${spendingContext ? JSON.stringify(spendingContext, null, 2) : 'No spending data provided yet.'}

You help CIBC clients understand their spending, optimize their credit card rewards, and make smarter financial decisions. 

Key facts you know:
- CIBC Dividend Visa Classic: 2% groceries, 1% dining/gas/transit/travel, 0.5% everything else. No annual fee.
- CIBC Dividend Platinum Visa: 3% groceries+gas, 2% dining+transit, 1% everything else. $99/yr fee.
- CIBC Dividend Visa Infinite: 4% groceries+gas, 2% dining+transit+travel, 1% everything else. $120/yr fee. Requires $60K individual or $100K household income.
- CIBC Costco Mastercard: 3% restaurants, 3% Costco gas, 2% other gas, 1% everything else. No fee (requires Costco membership).

Always be specific with dollar amounts when you can calculate them. Keep responses under 120 words. Never recommend non-CIBC products. Always be warm and helpful.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: systemPrompt,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }

    const data = await response.json();
    return res.status(200).json({ content: data.content[0].text });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
