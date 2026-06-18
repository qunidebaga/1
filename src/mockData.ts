/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  UserProfile,
  DeviceSession,
  SecurityStatus,
  ActivityLog,
  PointTransaction,
  AttachmentFile,
  Announcement,
  CloudProtocol,
  ReplyRule,
  ExternalLink,
  ActivationCode
} from './types';

export const initialProfile: UserProfile = {
  username: "ceshi",
  userId: "105149989089",
  language: "简体中文",
  email: "ceshi@example.com",
  bio: "",
  wechatId: "",
  githubUrl: "",
  avatarUrl: null,
  pointsBalance: 0.00,
  registrationDate: "2026-06-17 18:30"
};

export const initialSessions: DeviceSession[] = [
  {
    id: "session-1",
    device: "Chrome",
    os: "Windows 11",
    ip: "192.168.1.1",
    location: "北京, 中国",
    lastActive: "当前",
    isCurrent: true
  },
  {
    id: "session-2",
    device: "Safari",
    os: "iPhone 15 Pro",
    ip: "114.242.12.98",
    location: "上海, 中国",
    lastActive: "2 小时前登录",
    isCurrent: false
  }
];

export const initialSecurityStatus: SecurityStatus = {
  securityScore: 75,
  twoFactorEnabled: false,
  backupEmailUpdated: false
};

export const initialActivityLogs: ActivityLog[] = [
  {
    id: "log-1",
    action: "成功登录",
    timestamp: "今天 14:20",
    detail: "Windows Chrome",
    type: "login"
  },
  {
    id: "log-2",
    action: "修改了头像",
    timestamp: "昨天 10:45",
    detail: "上海",
    type: "avatar"
  },
  {
    id: "log-3",
    action: "API 密钥刷新",
    timestamp: "2026-06-18",
    detail: "自动系统",
    type: "api"
  }
];

export const initialTransactions: PointTransaction[] = [
  {
    id: "trx-1",
    type: "redeem",
    amount: 100,
    description: "通过激活码 'VIP-PASS-XY77' 兑换点数",
    timestamp: "2026-06-18 11:24:05"
  },
  {
    id: "trx-2",
    type: "deduct",
    amount: 12.5,
    description: "群发扣除点数 (125条通知)",
    timestamp: "2026-06-17 19:15:30"
  },
  {
    id: "trx-3",
    type: "charge",
    amount: 200,
    description: "在线充值积分",
    timestamp: "2026-06-15 14:10:00"
  }
];

export const initialAttachments: AttachmentFile[] = [
  {
    id: "attach-1",
    name: "微信营销主图_v2.png",
    size: "1.2 MB",
    type: "image/png",
    url: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=300",
    uploadedAt: "2026-06-18 10:45"
  },
  {
    id: "attach-2",
    name: "推广文案大纲_2026.docx",
    size: "420 KB",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    url: "#",
    uploadedAt: "2026-06-17 15:30"
  },
  {
    id: "attach-3",
    name: "客户画像数据.xlsx",
    size: "2.4 MB",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    url: "#",
    uploadedAt: "2026-06-16 11:15"
  }
];

export const initialAnnouncements: Announcement[] = [
  {
    id: "ann-1",
    title: "服务器网络链路升级通知",
    excerpt: "为提升对港澳台及极速连接延迟优化，我们将于 2026-06-20 进行网络演练割接，届时可能会有短瞬闪断，请确保配置妥当。",
    content: "尊敬的用户：\n\n为了给您提供更稳定、更快捷的服务，我们计划于 2026年6月20日 凌晨 02:00 - 05:00 对华北及华东骨干网络进行万兆扩容与链路升级。\n\n升级期间可能出现 5-10 分钟的断续重连情况，请合理安排业务发送计划。感谢您的支持与配合！",
    category: "maintenance",
    date: "2026-06-18",
    isImportant: true
  },
  {
    id: "ann-2",
    title: "辛云-获客系统 v2.4.0 升级指南",
    excerpt: "全新上线安全状态评级、独立卡密生成与兑换系统、活跃设备查看并一键强制下线、微信/Github社交账号快速绑定。",
    content: "辛云企业获客系统 v2.4.0 正式发布！\n\n主要功能更新：\n1. 【个人中心】全新改版！新增安全健康指数评分，支持密码状态和双重验证管理。\n2. 【多账户活跃会话】实时监控当前在线多点会话状态，提供异地下线安全退场功能。\n3. 【全新卡密系统】支持多级卡密生成与兑换，让企业代理发卡流程效率翻倍。\n4. 【通知中心与安全审计】更加透明的信息公告与日志流水，操作不留漏洞。",
    category: "update",
    date: "2026-06-17",
    isImportant: false
  },
  {
    id: "ann-3",
    title: "关于严禁发送违规、敏感获客信息的公告",
    excerpt: "严厉打击黑灰产、网络欺诈等违规用途，配合安全部门加大审计与违规冻结封号机制。",
    content: "敬告全体辛云用户：\n\n我们严厉禁止利用本获客系统发送虚假引流、欺诈、高利放贷等任何危害互联网健康的敏感信息。\n\n一经后台安全审计发现，我们将立即无限期封停该账号，并依法扣除所有余点，配合相关执法部门提交证据。请大家文明合规获客，维护良好的行业生态。",
    category: "system",
    date: "2026-06-15",
    isImportant: true
  }
];

export const initialProtocols: CloudProtocol[] = [
  {
    id: "pt-1",
    name: "辛云节点A_北京专线",
    status: "online",
    ckToken: "ck_bj_82d73f8...f02a",
    lastSync: "今天 16:30",
    remark: "高并发高速通道"
  },
  {
    id: "pt-2",
    name: "备用节点B_腾讯海外",
    status: "online",
    ckToken: "ck_sh_19c832c...7d11",
    lastSync: "昨天 18:24",
    remark: "备用出海链路"
  },
  {
    id: "pt-3",
    name: "测速节点C_中转中继",
    status: "expired",
    ckToken: "ck_gz_99d12a3...128e",
    lastSync: "3天前",
    remark: "主供测试使用"
  }
];

export const initialReplyRules: ReplyRule[] = [
  {
    id: "rule-1",
    keyword: "价格",
    matchType: "contains",
    replyType: "text",
    replyContent: "您好，我们企业获客服务分为基础版、专业版和至尊版，请联系客服经理详谈报价细则或查询右上角点数余额进行购买。",
    status: true
  },
  {
    id: "rule-2",
    keyword: "你好 / 怎么用",
    matchType: "contains",
    replyType: "text",
    replyContent: "欢迎配合辛云系统！您可以到 [工作台] 中下载新版推广模板，批量群发给匹配的潜在客户！",
    status: true
  },
  {
    id: "rule-3",
    keyword: "官网",
    matchType: "exact",
    replyType: "link",
    replyContent: "https://ai.studio/build",
    status: false
  }
];

export const initialExternalLinks: ExternalLink[] = [
  {
    id: "link-1",
    title: "2026企业年中获客营销简报",
    originalUrl: "https://example.com/reports/mid-year-2026",
    shortUrl: "https://xy-url.cn/s/m2026",
    clicks: 1420,
    createdAt: "2026-06-15"
  },
  {
    id: "link-2",
    title: "华南代理商入驻专属优惠通道",
    originalUrl: "https://example.com/partners/huanan-discount",
    shortUrl: "https://xy-url.cn/s/hn99",
    clicks: 450,
    createdAt: "2026-06-17"
  }
];

export const initialActivationCodes: ActivationCode[] = [
  { code: "VIP-PASS-XY77", points: 100.00, redeemed: false, notes: "迎新豪华充值礼包" },
  { code: "AGENT-CREDIT-99", points: 50.00, redeemed: false, notes: "二级代理专属点卡" },
  { code: "BUG-FIX-COMPENSATION", points: 20.00, redeemed: false, notes: "系统维护闪退补偿" }
];
