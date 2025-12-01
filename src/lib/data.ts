import { FoundItem, LostItem, Claim } from './types';
import { PlaceHolderImages } from './placeholder-images';

const generateCaseId = () => `FNM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

export const foundItems: FoundItem[] = PlaceHolderImages.map((p, index) => ({
  id: `${index + 1}`,
  caseId: generateCaseId(),
  name: p.description.split(',')[0],
  category: p.imageHint.includes('phone') || p.imageHint.includes('laptop') || p.imageHint.includes('headphones') ? 'Electronics' : 
            p.imageHint.includes('wallet') || p.imageHint.includes('backpack') ? 'Accessories' : 
            p.imageHint.includes('keys') ? 'Keys' : 'Other',
  description: p.description,
  color: p.imageHint.split(' ')[0],
  location: ['Library', 'Student Center', 'Cafeteria', 'Gymnasium', 'Lecture Hall A'][index % 5],
  date: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString(),
  imageUrl: p.imageUrl,
  imageHint: p.imageHint,
  status: 'Approved',
}));

export const lostItems: LostItem[] = [
  {
    id: 'l1',
    caseId: generateCaseId(),
    userId: 'user1',
    name: 'iPhone 13 Pro',
    category: 'Electronics',
    description: 'My black iPhone 13 Pro, has a small crack on the top right corner. It was in a clear case.',
    color: 'Black',
    location: 'Library, 2nd Floor',
    date: new Date(Date.now() - (2 * 24 * 60 * 60 * 1000)).toISOString(),
    imageUrl: 'https://picsum.photos/seed/11/400/300',
    imageHint: 'black iphone',
    status: 'Approved',
  },
  {
    id: 'l2',
    caseId: generateCaseId(),
    userId: 'user1',
    name: 'Brown Leather Wallet',
    category: 'Accessories',
    description: 'My wallet with my ID and credit cards. It is a bit old and has a scratch on the front.',
    color: 'Brown',
    location: 'Cafeteria',
    date: new Date(Date.now() - (5 * 24 * 60 * 60 * 1000)).toISOString(),
    imageUrl: 'https://picsum.photos/seed/12/400/300',
    imageHint: 'leather wallet',
    status: 'Approved',
  },
];

export const claims: Claim[] = [
  {
    id: 'c1',
    lostItemId: 'l2',
    foundItemId: '2',
    userId: 'user1',
    userName: 'Alex Doe',
    claimDate: new Date(Date.now() - (1 * 24 * 60 * 60 * 1000)).toISOString(),
    status: 'Approved',
    proof: 'Has my initials A.D. inside.',
  },
  {
    id: 'c2',
    lostItemId: 'l1',
    foundItemId: '1',
    userId: 'user1',
    userName: 'Alex Doe',
    claimDate: new Date().toISOString(),
    status: 'Pending',
    proof: 'I can unlock it with my Face ID.',
  },
];

export const users = [
    { id: 'u1', name: 'Alex Doe', email: 'alex.doe@example.com', role: 'Student', joined: '2023-09-01' },
    { id: 'u2', name: 'Brenda Smith', email: 'brenda.smith@example.com', role: 'Staff', joined: '2022-08-15' },
    { id: 'u3', name: 'Charlie Brown', email: 'charlie.brown@example.com', role: 'Student', joined: '2024-01-20' },
    { id: 'u4', name: 'Diana Prince', email: 'diana.prince@example.com', role: 'Admin', joined: '2021-05-10' },
];
