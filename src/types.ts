/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  username: string;
  userId: string;
  language: string;
  email: string;
  bio: string;
  wechatId: string;
  githubUrl: string;
  avatarUrl: string | null;
  pointsBalance: number;
  registrationDate: string;
}

export interface DeviceSession {
  id: string;
  device: string;
  os: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface SecurityStatus {
  securityScore: number;
  twoFactorEnabled: boolean;
  backupEmailUpdated: boolean;
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  detail: string;
  type: 'login' | 'avatar' | 'api' | 'system' | 'redeem' | 'other';
}

export interface PointTransaction {
  id: string;
  type: 'charge' | 'deduct' | 'redeem';
  amount: number;
  description: string;
  timestamp: string;
}

export interface AttachmentFile {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'system' | 'update' | 'maintenance';
  date: string;
  isImportant: boolean;
}

export interface CloudProtocol {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'expired';
  ckToken: string;
  lastSync: string;
  remark: string;
}

export interface ReplyRule {
  id: string;
  keyword: string;
  matchType: 'exact' | 'contains';
  replyType: 'text' | 'image' | 'link';
  replyContent: string;
  status: boolean;
}

export interface ExternalLink {
  id: string;
  title: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
}

export interface ActivationCode {
  code: string;
  points: number;
  redeemed: boolean;
  notes: string;
}
