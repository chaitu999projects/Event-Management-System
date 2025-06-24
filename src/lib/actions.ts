'use server';

import { generateEventDescription as generateEventDescriptionFlow, type GenerateEventDescriptionInput } from '@/ai/flows/generate-event-description';

export async function generateDescriptionAction(input: GenerateEventDescriptionInput): Promise<{ description?: string; error?: string }> {
  try {
    const result = await generateEventDescriptionFlow(input);
    return { description: result.description };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate description. Please try again.' };
  }
}
