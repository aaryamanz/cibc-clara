# CIBC Clara — Proactive Financial Intelligence Co-Pilot

MVP demo built for CIBC TGRP Case Study Interview · Aaryaman Singh

## What it does
1. **Spending Input** — Enter monthly spending by category with sliders
2. **Reward Optimizer** — Clara compares all CIBC cards using real published rates and shows your exact reward gap
3. **Ask Clara** — Conversational AI (Claude) answers questions about your spending and recommendations

## Local Development

```bash
npm install
npm run dev
```

Then open http://localhost:5173

> For local dev, the /api/chat serverless function won't run via `npm run dev`.
> Create a `.env.local` file with `ANTHROPIC_API_KEY=your_key` and run via `vercel dev` instead.

## Deploy to Vercel (5 minutes)

1. Push this repo to GitHub
2. Go to vercel.com → New Project → Import your repo
3. Add environment variable: `ANTHROPIC_API_KEY` = your Anthropic API key
4. Deploy — Vercel auto-detects Vite + serverless functions

That's it. Your live URL will be something like `cibc-clara.vercel.app`

## Tech Stack
- React 18 + Vite
- Vercel serverless functions (API proxy)
- Claude Sonnet via Anthropic API
- Zero external UI libraries — pure CSS

## Data Sources
- CIBC Dividend Visa Classic rates: cibc.com/en/personal-banking/credit-cards/all-credit-cards/dividend-visa-card.html
- CIBC Dividend Visa Infinite rates: cibc.com/en/personal-banking/credit-cards/all-credit-cards/dividend-visa-infinite-card.html
- CIBC Costco Mastercard rates: costco.ca/CIBC-Costco-Mastercard.html
