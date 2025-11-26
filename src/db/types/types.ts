// ---------- ENUMS ----------

import { z } from "zod";

export enum ProfileRole {
  Client = 'client',
  Seller = 'seller',
  Agent = 'agent',
  Investor = 'investor',
  BusinessOwner = 'business_owner',
  Admin = 'admin',
}

export enum PropertyType {
  Apartment = 'apartment',
  House = 'house',
  Condo = 'condo',
  Land = 'land',
  Commercial = 'commercial',
  Villa = 'villa',
}

export enum InteractionType {
  Like = 'like',
  Dislike = 'dislike',
  Favorite = 'favorite',
  BuyLater = 'buy_later',
  View = 'view',
  Review = 'review',
}

// ---------- USERS ----------

export interface User {
  id: string;
  email: string | null;
  createdAt: string;
}

// ---------- PROFILES ----------

export interface Profile {
  id: number;
  userId: string;
  role: ProfileRole;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------- PROPERTIES ----------

export interface Property {
  id: number;
  profileId: number | null;
  title: string;
  description: string | null;
  location: string | null;
  type: PropertyType;
  price: number;
  size: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyMock {
  id: number;
  title: string;
  price: number;
  type: string;
  bedrooms: number;
  nights?: number;
  images?: string[];
  badge: string | null;
}

// ---------- PROPERTY ENGAGEMENTS ----------

export interface PropertyEngagement {
  id: number;
  propertyId: number | null;
  views: number;
  likes: number;
  dislikes: number;
  favorites: number;
  buyLater: number;
  createdAt: string;
  updatedAt: string;
}

// ---------- INTERACTIONS ----------

export interface Interaction {
  id: number;
  profileId: number | null;
  propertyId: number | null;
  type: InteractionType;
  comment: string | null;
  rating: number | null;
  createdAt: string;
}

// ---------- COMMENTS ----------

export interface Comment {
  id: number;
  profileId: number | null;
  propertyId: number | null;
  content: string;
  createdAt: string;
}

// ---------- RELATIONAL TYPES ----------

export interface UserWithProfile extends User {
  profiles: Profile[];
}

export interface ProfileWithDetails extends Profile {
  user: User;
  properties: Property[];
  interactions: Interaction[];
  comments: Comment[];
}

export interface PropertyWithDetails extends Property {
  profile?: Profile;
  interactions: Interaction[];
  comments: Comment[];
  engagements?: PropertyEngagement[];
}

export interface InteractionWithDetails extends Interaction {
  profile?: Profile;
  property?: Property;
}

export interface CommentWithDetails extends Comment {
  profile?: Profile;
  property?: Property;
}
// Utility to convert Drizzle pgEnum to Zod
export function zodEnumFromPgEnum(pgEnum: { enumValues: readonly string[] }) {
  return z.enum(pgEnum.enumValues as [string, ...string[]]);
}