export interface GreetingCardData {
  from: string;
  to: string;
  message: string;
  theme: 'royal-maroon' | 'dhunuchi-orange' | 'midnight-gold' | 'festive-red';
  music?: boolean;
  imageUrl?: string;
}

export interface CommunityWish {
  id: string;
  sender: string;
  message: string;
  theme: string;
  createdAt: string;
}

export type ActiveTab = 'create' | 'wall' | 'countdown';
