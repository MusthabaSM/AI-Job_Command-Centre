# AI Alchemist Architecture

## Overview
AI Alchemist is built on a modern decoupled architecture featuring a **Next.js Frontend** (React, TailwindCSS, Framer Motion) communicating with a **Lemma Backend Pod**.

## Architecture Diagram

```mermaid
graph TD
    Client[Next.js Frontend Client]
    
    subgap API Communication
        API[Axios Interceptor & Query Hooks]
    end
    
    subgap Lemma Pod Backend
        Gateway[Lemma API Gateway]
        Agents[AI Specialists]
        Functions[Python SDK Functions]
        Tables[Lemma Data Tables]
    end

    Client --> API
    API -- "HTTP POST/GET" --> Gateway
    Gateway --> Functions
    Gateway --> Agents
    Functions --> Tables
    Agents --> Tables
    Agents --> Functions
```

## Production vs. Judge Mode

The architecture dynamically bifurcates based on the `demo_mode` state.

1. **Production Mode:** The API client validates `NEXT_PUBLIC_LEMMA_API_URL` and `NEXT_PUBLIC_LEMMA_API_TOKEN` and routes all GraphQL/REST requests to the live Lemma pod.
2. **Judge Mode:** Instantly short-circuits API calls, loading mock JSON state to provide a flawless demonstration of the UI layout without requiring the backend to spin up.
