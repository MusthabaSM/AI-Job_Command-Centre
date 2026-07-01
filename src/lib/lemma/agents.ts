import { lemmaClient } from './client';

export const chatWithAgent = async (agentName: string, message: string) => {
  // Invokes a specific Lemma agent and starts a conversation
  const conversation = await lemmaClient.agents.run(agentName, message);
  return conversation;
};
