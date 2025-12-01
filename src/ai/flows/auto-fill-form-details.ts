'use server';

/**
 * @fileOverview An AI chatbot to help users report lost or found items by automatically filling in form details.
 *
 * - autoFillFormDetails - A function that handles the form auto-filling process.
 * - AutoFillFormDetailsInput - The input type for the autoFillFormDetails function.
 * - AutoFillFormDetailsOutput - The return type for the autoFillFormDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoFillFormDetailsInputSchema = z.object({
  description: z.string().describe('The description of the lost or found item.'),
  photoDataUri: z
    .string()
    .describe(
      "A photo of the item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )
    .optional(),
});
export type AutoFillFormDetailsInput = z.infer<typeof AutoFillFormDetailsInputSchema>;

const AutoFillFormDetailsOutputSchema = z.object({
  itemCategory: z.string().describe('The category of the item (e.g., electronics, clothing, documents).'),
  itemColor: z.string().describe('The color of the item.'),
  itemLocation: z.string().describe('The last known location of the item.'),
  additionalDetails: z.string().describe('Any other relevant details about the item.'),
});
export type AutoFillFormDetailsOutput = z.infer<typeof AutoFillFormDetailsOutputSchema>;

export async function autoFillFormDetails(input: AutoFillFormDetailsInput): Promise<AutoFillFormDetailsOutput> {
  return autoFillFormDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoFillFormDetailsPrompt',
  input: {schema: AutoFillFormDetailsInputSchema},
  output: {schema: AutoFillFormDetailsOutputSchema},
  prompt: `You are an AI chatbot designed to help users report lost or found items. Based on the user's description and, if provided, a photo of the item, you will attempt to auto-fill the following form details:

  - itemCategory: The category of the item (e.g., electronics, clothing, documents).
  - itemColor: The color of the item.
  - itemLocation: The last known location of the item.
  - additionalDetails: Any other relevant details about the item.

Description: {{{description}}}
{{~#if photoDataUri}}
Photo: {{media url=photoDataUri}}
{{/if}}

Please provide the output in JSON format.
`,
});

const autoFillFormDetailsFlow = ai.defineFlow(
  {
    name: 'autoFillFormDetailsFlow',
    inputSchema: AutoFillFormDetailsInputSchema,
    outputSchema: AutoFillFormDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
