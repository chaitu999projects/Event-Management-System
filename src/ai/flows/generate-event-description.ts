'use server';

/**
 * @fileOverview A flow for generating engaging and informative event descriptions using AI.
 *
 * - generateEventDescription - A function that handles the event description generation process.
 * - GenerateEventDescriptionInput - The input type for the generateEventDescription function.
 * - GenerateEventDescriptionOutput - The return type for the generateEventDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEventDescriptionInputSchema = z.object({
  eventName: z.string().describe('The name of the event.'),
  eventType: z.string().describe('The type of event (e.g., concert, workshop, conference).'),
  eventDate: z.string().describe('The date of the event.'),
  eventTime: z.string().describe('The time of the event.'),
  eventLocation: z.string().describe('The location of the event.'),
  eventTheme: z.string().describe('The theme of the event (e.g., music, technology, art).'),
  targetAudience: z.string().describe('The target audience for the event.'),
  keySpeakers: z.string().optional().describe('List of key speakers at the event.'),
  eventDetails: z.string().optional().describe('Additional details about the event.'),
});
export type GenerateEventDescriptionInput = z.infer<typeof GenerateEventDescriptionInputSchema>;

const GenerateEventDescriptionOutputSchema = z.object({
  description: z.string().describe('An engaging and informative description of the event.'),
});
export type GenerateEventDescriptionOutput = z.infer<typeof GenerateEventDescriptionOutputSchema>;

export async function generateEventDescription(input: GenerateEventDescriptionInput): Promise<GenerateEventDescriptionOutput> {
  return generateEventDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEventDescriptionPrompt',
  input: {schema: GenerateEventDescriptionInputSchema},
  output: {schema: GenerateEventDescriptionOutputSchema},
  prompt: `You are an expert marketing copywriter specializing in creating event descriptions.

  Based on the event details provided, generate an engaging and informative description to attract attendees.

  Event Name: {{{eventName}}}
  Event Type: {{{eventType}}}
  Event Date: {{{eventDate}}}
  Event Time: {{{eventTime}}}
  Event Location: {{{eventLocation}}}
  Event Theme: {{{eventTheme}}}
  Target Audience: {{{targetAudience}}}
  Key Speakers: {{#if keySpeakers}}{{{keySpeakers}}}{{else}}N/A{{/if}}
  Event Details: {{#if eventDetails}}{{{eventDetails}}}{{else}}N/A{{/if}}

  Description:`, 
});

const generateEventDescriptionFlow = ai.defineFlow(
  {
    name: 'generateEventDescriptionFlow',
    inputSchema: GenerateEventDescriptionInputSchema,
    outputSchema: GenerateEventDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
