import { config } from 'dotenv';
config();

import '@/ai/flows/verify-item-match.ts';
import '@/ai/flows/detect-suspicious-claims.ts';
import '@/ai/flows/smart-search-suggestions.ts';
import '@/ai/flows/auto-fill-form-details.ts';