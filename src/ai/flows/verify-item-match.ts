'use server';

/**
 * @fileOverview An AI auto-verification scoring system to verify if a claimed item matches the found item.
 *
 * - verifyItemMatch - A function that handles the item match verification process.
 * - VerifyItemMatchInput - The input type for the verifyItemMatch function.
 * - VerifyItemMatchOutput - The return type for the verifyItemMatch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyItemMatchInputSchema = z.object({
  lostItemDescription: z
    .string()
    .describe('The description of the lost item.'),
  foundItemDescription: z
    .string()
    .describe('The description of the found item.'),
  lostItemPhotoDataUri: z
    .string()
    .describe(
      "A photo of the lost item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  foundItemPhotoDataUri: z
    .string()
    .describe(
      "A photo of the found item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VerifyItemMatchInput = z.infer<typeof VerifyItemMatchInputSchema>;

const VerifyItemMatchOutputSchema = z.object({
  matchScore: z
    .number()
    .describe(
      'A score between 0 and 1 indicating how well the lost and found items match.  Higher score indicates a stronger match.'
    ),
  reason: z
    .string()
    .describe(
      'A brief explanation of why the items were determined to be a good or bad match.'
    ),
});
export type VerifyItemMatchOutput = z.infer<typeof VerifyItemMatchOutputSchema>;

export async function verifyItemMatch(
  input: VerifyItemMatchInput
): Promise<VerifyItemMatchOutput> {
  return verifyItemMatchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyItemMatchPrompt',
  input: {schema: VerifyItemMatchInputSchema},
  output: {schema: VerifyItemMatchOutputSchema},
  prompt: `You are an AI assistant that determines how well a found item matches a lost item, based on their descriptions and images.

You will receive descriptions of the lost and found items, as well as photos of each item.
Based on this information, determine how well the two items match.

Output a score between 0 and 1 in the matchScore field. A score of 1 indicates a perfect match, while a score of 0 indicates that the items are definitely not the same.
In the reason field, briefly explain the score you gave and why you think the items match or do not match.

Lost item description: {{{lostItemDescription}}}
Found item description: {{{foundItemDescription}}}

Lost item photo: {{media url=lostItemPhotoDataUri}}
Found item photo: {{media url=foundItemPhotoDataUri}}`,
});

const verifyItemMatchFlow = ai.defineFlow(
  {
    name: 'verifyItemMatchFlow',
    inputSchema: VerifyItemMatchInputSchema,
    outputSchema: VerifyItemMatchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
