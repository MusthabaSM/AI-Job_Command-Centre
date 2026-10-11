import { auth } from './client';
import { toast } from 'sonner';

export const chatWithAgent = async (agentName: string, message: string) => {
  // Invokes a specific Lemma agent and starts a conversation
  const conversation = await (await fetch('/api/agents/' + agentName, { method: 'POST', body: JSON.stringify({ message }) })).json();
  return conversation;
};
