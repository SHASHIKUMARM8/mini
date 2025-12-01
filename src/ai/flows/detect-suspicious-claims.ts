'use server';

/**
 * @fileOverview AI-powered fraud detection system to detect suspicious claims or unusual user behavior.
 *
 * - detectSuspiciousClaims - A function that handles the detection of suspicious claims.
 * - DetectSuspiciousClaimsInput - The input type for the detectSuspiciousClaims function.
 * - DetectSuspiciousClaimsOutput - The return type for the detectSuspiciousClaims function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectSuspiciousClaimsInputSchema = z.object({
  claimDetails: z
    .string()
    .describe('Details of the claim, including user information, item description, and claim history.'),
  userBehavior: z
    .string()
    .describe('Information about the user behavior, such as login frequency, reported items, and claim patterns.'),
});
export type DetectSuspiciousClaimsInput = z.infer<typeof DetectSuspiciousClaimsInputSchema>;

const DetectSuspiciousClaimsOutputSchema = z.object({
  isSuspicious: z
    .boolean()
    .describe('Whether the claim is considered suspicious based on the analysis.'),
  fraudScore: z
    .number()
    .describe('A score indicating the likelihood of fraud, ranging from 0 to 1.'),
  reason: z
    .string()
    .describe('The reason for the suspicious classification, including factors such as inconsistent details or unusual behavior.'),
});
export type DetectSuspiciousClaimsOutput = z.infer<typeof DetectSuspiciousClaimsOutputSchema>;

export async function detectSuspiciousClaims(
  input: DetectSuspiciousClaimsInput
): Promise<DetectSuspiciousClaimsOutput> {
  return detectSuspiciousClaimsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectSuspiciousClaimsPrompt',
  input: {schema: DetectSuspiciousClaimsInputSchema},
  output: {schema: DetectSuspiciousClaimsOutputSchema},
  prompt: `You are an AI fraud detection expert specializing in detecting suspicious claims.

You will analyze the claim details and user behavior to determine if a claim is suspicious. You will output a fraud score between 0 and 1 indicating likelihood of fraud, a boolean isSuspicious field, and the reasoning behind your analysis.

Claim Details: {{{claimDetails}}}
User Behavior: {{{userBehavior}}}`,
});

const detectSuspiciousClaimsFlow = ai.defineFlow(
  {
    name: 'detectSuspiciousClaimsFlow',
    inputSchema: DetectSuspiciousClaimsInputSchema,
    outputSchema: DetectSuspiciousClaimsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
