export type ItemStatus = 'Pending' | 'Approved' | 'Rejected' | 'Claimed';

export type Item = {
  id: string;
  caseId: string;
  category: string;
  name: string;
  description: string;
  color: string;
  location: string;
  date: string; // ISO string
  imageUrl: string;
  imageHint: string;
  status: ItemStatus;
};

export type FoundItem = Item;

export type LostItem = Item & {
  userId: string;
};

export type ClaimStatus = 'Pending' | 'Approved' | 'Rejected';

export type Claim = {
  id: string;
  lostItemId: string;
  foundItemId: string;
  userId: string;
  userName: string;
  claimDate: string; // ISO string
  status: ClaimStatus;
  proof?: string;
};
