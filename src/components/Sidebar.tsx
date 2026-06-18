/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Cloud,
  LayoutDashboard,
  Tv,
  User,
  FolderOpen,
  Bell,
  Cpu,
  MessageSquare,
  Link2,
  FileText,
  Users,
  Ticket,
  Key,
  ChevronDown,
  X
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  pointsBalance: number;
}

export default function Sidebar({ activeView, setActiveView, pointsBalance }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: '控制台', icon: LayoutDashboard },
    { id: 'workbench', label: '工作台', icon: Tv },
    { id: 'profile', label: '个人信息', icon: User },
    { id: 'attachments', label: '附件管理', icon: FolderOpen },
    { id: 'notifications', label: '系统公告', icon: Bell, badge: 'NEW' },
    { id: 'protocols', label: '云端协议', icon: Cpu },
    { id: 'replyRules', label: '回复规则', icon: MessageSquare },
    { id: 'externalLinks', label: '外链配置', icon: Link2 },
    { id: 'redeem', label: '卡密兑换', icon: Ticket },
    { id: 'pointsLog', label: '点数流水', icon: FileText },
    { id: 'agentCenter', label: '代理中心', icon: Users },
  ];

  return (
    <aside className="h-screen w-60 fixed left-0 top-0 bg-white border-r border-slate-100 flex flex-col py-6 px-4 z-50">
      {/* Brand Logo Header */}
      <div className="mb-6 px-2 flex items-center gap-3">
        <div className="w-8 h-8 bg-[#8b5cf6] rounded-lg flex items-center justify-center text-white">
          <Cloud className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-base font-bold text-slate-800 tracking-tight leading-tight">辛云-企业获客</h1>
          <span className="text-[9px] text-[#8b5cf6] tracking-wider font-semibold">ENTERPRISE PORTAL</span>
        </div>
        <button
          className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-md transition-colors xl:hidden ml-auto"
          title="关闭"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow flex flex-col gap-1 overflow-y-auto custom-scrollbar pr-1">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 text-left ${
                isActive
                  ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] text-white font-medium shadow-md shadow-[#8b5cf6]/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <IconComponent className={`w-[18px] h-[18px] ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="flex-grow">{item.label}</span>
              {item.badge && !isActive && (
                <span className="bg-[#ef4444] text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold scale-90">
                  {item.badge}
                </span>
              )}
              {item.id === 'dashboard' && (
                <ChevronDown className={`w-3.5 h-3.5 ml-auto text-slate-400 ${isActive ? 'text-white' : ''}`} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info inside Sidebar */}
      <div className="mt-auto pt-4 border-t border-slate-50 text-center">
        <div className="bg-slate-50 rounded-lg p-2.5 text-left mb-2">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">当前点数</p>
          <p className="text-base font-bold text-slate-800">{pointsBalance.toFixed(2)} pts</p>
        </div>
        <p className="text-[10px] text-slate-400">系统已部署在安全容器</p>
      </div>
    </aside>
  );
}
