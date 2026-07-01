# AI Alchemist
**An AI-Native Career Operating System.**

## Problem Statement
Job hunting is fragmented. Candidates manage resumes in Word, track applications in Excel, prepare for interviews blindly, and guess at their ATS compatibility.

## Solution
AI Alchemist is an all-in-one AI orchestration platform. Powered by the Lemma SDK, it provides specialized AI agents that act as your personal career board: matching jobs, optimizing resumes, tracking pipelines, and coaching you through live interview simulations.

## Key Features
- **Judge Mode:** Instantly boot the app with 1-click rich mock data.
- **Mission Control:** Chat directly with multiple AI Specialists.
- **Resume Studio:** Live ATS optimization scoring.
- **Interview Lab:** Streaming, interactive technical interview simulator.
- **Career Pipeline:** Kanban board for tracking applications.

## Tech Stack
- **Frontend:** React 19, Vite, TanStack Router, TailwindCSS, Framer Motion, shadcn/ui.
- **Backend:** Lemma SDK Pod (Agents, Functions, Tables).
- **Data Fetching:** React Query, Axios.

## Installation & Running Locally
1. Clone the repository.
2. `npm install`
3. `npm run dev`
4. Deploy your Lemma backend: `cd backend && lemma deploy`

## Architecture
See [docs/architecture.md](docs/architecture.md) for the Mermaid diagram.

## Acknowledgements
Built for the AI SaaS Hackathon 2026.
