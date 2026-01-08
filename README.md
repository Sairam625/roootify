# Rootify

**Rootify** is a comprehensive agricultural platform built on the MERN stack (MongoDB, Express, React, Node.js) designed to empower Indian farmers by bridging the gap between traditional farming and modern technology. Its core mission is to eliminate middlemen through a direct **Farmer-to-Buyer Marketplace**, allowing farmers to list crops and receive competitive bids directly from buyers. This ensures transparent pricing and maximizes profits for the producers while providing buyers with verified, quality produce.

The platform integrates critical financial and informational tools to support farming decisions. Features include a **Real-Time Mandi Price** tracker covering over 900+ markets across India and a **Smart Loan & Subsidy Matching** engine. This AI-driven system aggregates data from central and state government schemes (like PM-KISAN) to provide personalized financial aid recommendations based on the farmer's specific crop and location, simplifying the often complex process of finding financial support.

To ensure inclusivity, Rootify features a **Multilingual AI Chatbot** capable of voice-to-voice interaction in regional Indian languages. This allows farmers to easily access weather forecasts, market trends, and scheme details regardless of their literacy level or language. With a secure, dual-panel dashboard for farmers and buyers and a roadmap including AI crop grading and logistics, Rootify aims to be a complete digital ecosystem for the future of Indian agriculture.

For a detailed visual walkthrough, check out our **[Project Brochure](./brochure.html)**.

## Prerequisites
- Node.js installed
- MongoDB installed and running locally

## How to Start

You need to run the **Backend** and **Frontend** in separate terminals.

### 1. Start the Backend (Server)
```bash
cd rootify/server
npm start
```
*Runs on http://localhost:5000*

### 2. Start the Frontend (Client)
```bash
cd rootify/client
npm run dev
```
*Runs on http://localhost:5173*

## Features
- **Home**: Landing page with agricultural themes.
- **Auth**: Login and Signup.
- **Live Prices**: Real-time mandi prices.
- **Smart Loans**: Loan schemes and subsidies.
- **Chatbot**: AI assistant.
