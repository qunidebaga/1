/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  RefreshCw,
  Copy,
  Send,
  FileText,
  Download,
  ShieldCheck,
  Check,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { UserProfile, ActivityLog } from '../types';

interface WorkbenchViewProps {
  profile: UserProfile;
  onRedeemClick: () => void;
  onBroadcastClick: () => void;
  onTemplateClick: () => void;
  onExportClick: () => void;
  onAuditClick: () => void;
  recentLogs: ActivityLog[];
  pointsBalance: number;
  todaySent: number;
  totalSent: number;
}

export default function WorkbenchView({
  profile,
  onRedeemClick,
  onBroadcastClick,
  onTemplateClick,
  onExportClick,
  onAuditClick,
  recentLogs,
  pointsBalance,
  todaySent,
  totalSent
}: WorkbenchViewProps) {
  const [chartRange, setChartRange] = useState<'day' | 'week'>('week');
  const [copied, setCopied] = useState(false);

  // Recharts Data matching Image 2 style
  const chartDataWeekly = [
    { name: '06-11', 发出: todaySent > 0 ? 0.3 : 0.0, 收到: 0.05 },
    { name: '06-12', 发出: todaySent > 0 ? 0.6 : 0.3, 收到: 0.1 },
    { name: '06-13', 发出: todaySent > 0 ? 0.9 : 0.6, 收到: 0.15 },
    { name: '06-14', 发出: todaySent > 0 ? 1.1 : 0.8, 收到: 0.3 },
    { name: '06-15', 发出: todaySent > 0 ? 1.4 : 1.1, 收到: 0.5 },
    { name: '06-16', 发出: todaySent > 0 ? 1.7 : 1.4, 收到: 0.6 },
    { name: '06-17', 发出: todaySent > 0 ? 2.0 + todaySent : 2.0, 收到: 0.8 },
  ];

  const chartDataDaily = [
    { name: '00:00', 发出: 0.1, 收到: 0.02 },
    { name: '04:00', 发出: 0.2, 收到: 0.05 },
    { name: '08:00', 发出: 0.8, 收到: 0.3 },
    { name: '12:00', 发出: 1.2, 收到: 0.5 },
    { name: '16:00', 发出: 1.8, 收到: 0.7 },
    { name: '20:00', 发出: 2.2 + todaySent, 收到: 0.9 },
  ];

  const activeData = chartRange === 'week' ? chartDataWeekly : chartDataDaily;

  // Mini Sparkline datasets
  const sparklineDataToday = [
    { value: 10 }, { value: 20 }, { value: 15 }, { value: 30 }, { value: 12 }, { value: 25 }, { value: todaySent }
  ];

  const sparklineDataTotal = [
    { value: 100 }, { value: 120 }, { value: 150 }, { value: 140 }, { value: 180 }, { value: 190 }, { value: totalSent }
  ];

  const handleCopyUsername = () => {
    navigator.clipboard.writeText(profile.username);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr] gap-6 items-start">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">你好, {profile.username}</h2>
          <p className="text-sm text-slate-500 mt-1">
            欢迎来到辛云企业获客中心。以下是今日实时发送指标与工作台。
          </p>
        </div>

        {/* Quick Link Card - Registration */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 executive-shadow flex items-center gap-4 hover-lift">
          <div className="w-12 h-12 rounded-lg bg-violet-50 flex items-center justify-center text-[#8b5cf6]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">资料进度</p>
            <p className="text-sm font-bold text-slate-800">85% 已完成</p>
          </div>
        </div>

        {/* Quick Link Card - Points */}
        <button
          onClick={onRedeemClick}
          className="bg-white p-4 rounded-xl border border-slate-100 executive-shadow flex items-center justify-left gap-4 hover-lift w-full text-left focus:outline-none"
        >
          <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">可用点数</p>
            <p className="text-sm font-bold text-slate-800">{pointsBalance.toFixed(2)} pts</p>
          </div>
        </button>
      </div>

      {/* Account Info Cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left main gradient card (Image 2 style) */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#8b5cf6] via-[#7c3aed] to-[#6d28d9] rounded-2xl text-white p-6 relative overflow-hidden shadow-lg shadow-[#8b5cf6]/20 min-h-[220px] flex flex-col justify-between">
          {/* Decorative sphere shape graphic inside card */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-40 h-40 opacity-70 flex items-center justify-center pointer-events-none">
            <svg className="w-full h-full animate-pulse" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="sphereGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                  <stop offset="60%" stopColor="#c084fc" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </radialGradient>
              </defs>
              <circle cx="100" cy="100" r="80" fill="url(#sphereGrad)" />
              {/* Core artistic rings */}
              <ellipse cx="100" cy="100" rx="75" ry="32" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="5 5" className="origin-center rotate-45" />
              <ellipse cx="100" cy="100" rx="75" ry="18" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
              <circle cx="100" cy="100" r="30" fill="rgba(255, 255, 255, 0.15)" stroke="white" strokeWidth="1" />
              <circle cx="85" cy="85" r="5" fill="white" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">账号信息</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-emerald-400/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                正常 账号状态
              </span>
            </div>
            <p className="text-xs text-violet-100 mt-1">注册时间: {profile.registrationDate}</p>

            <div className="mt-6 space-y-3.5">
              <p className="text-sm">详细信息</p>
              <div className="flex gap-4">
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                  <span className="text-xl font-bold">1</span>
                  <span className="text-xs text-violet-100">有效账号</span>
                </div>

                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                  <span className="text-xl font-bold">{pointsBalance.toFixed(2)}</span>
                  <span className="text-xs text-violet-100">可用点数</span>
                  <button
                    onClick={onRedeemClick}
                    className="p-1 hover:bg-white/20 rounded text-white/80 hover:text-white transition-colors"
                    title="兑换卡密充值"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom user label */}
          <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-violet-100">{profile.username}</span>
              <span className="text-xs text-violet-200">用户名</span>
            </div>
            <button
              onClick={handleCopyUsername}
              className="bg-white/10 hover:bg-white/20 text-white p-1.5 rounded-lg border border-white/10 transition-all flex items-center gap-1.5 text-xs font-semibold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-300" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? '已复制' : '复制用户名'}
            </button>
          </div>
        </div>

        {/* Middle Send counts - Today */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 p-5 executive-shadow flex flex-col justify-between hover-lift min-h-[220px]">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800">今日发送成功</h4>
              <Send className="w-4 h-4 text-violet-500" />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">今天累计成功条数</p>
          </div>

          <div className="my-3">
            <p className="text-3xl font-bold text-slate-900 tracking-tight">
              {todaySent} <span className="text-sm text-slate-500 font-normal">条</span>
            </p>
          </div>

          {/* Small Sparkline simulation */}
          <div className="h-10 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineDataToday}>
                <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="#f5f3ff" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="border-t border-slate-50 pt-3 flex items-center justify-between text-xs text-slate-500">
            <span>相对于昨日:</span>
            <span className="text-emerald-500 font-semibold">{todaySent > 0 ? '+15.2%' : '0%'}</span>
          </div>
        </div>

        {/* Right Send counts - Total */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 p-5 executive-shadow flex flex-col justify-between hover-lift min-h-[220px]">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800">总共发送成功</h4>
              <RefreshCw className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">历史累计成功条数</p>
          </div>

          <div className="my-3">
            <p className="text-3xl font-bold text-slate-900 tracking-tight">
              {totalSent} <span className="text-sm text-slate-500 font-normal">条</span>
            </p>
          </div>

          {/* Small Sparkline simulation */}
          <div className="h-10 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineDataTotal}>
                <Area type="monotone" dataKey="value" stroke="#64748b" fill="#f1f5f9" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="border-t border-slate-50 pt-3 flex items-center justify-between text-xs text-slate-500">
            <span>统计状态:</span>
            <span className="text-slate-400 font-medium">刚刚更新</span>
          </div>
        </div>
      </div>

      {/* Grid Quick Navigation icons (4 Grid Boxes) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={onBroadcastClick}
          className="bg-white border border-slate-100 rounded-xl p-4 hover-lift executive-shadow text-center flex flex-col items-center justify-center gap-2 select-none group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-violet-50 group-hover:bg-violet-100 flex items-center justify-center text-[#8b5cf6] transition-colors">
            <Send className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-slate-700">消息群发</span>
        </button>

        <button
          onClick={onTemplateClick}
          className="bg-white border border-slate-100 rounded-xl p-4 hover-lift executive-shadow text-center flex flex-col items-center justify-center gap-2 select-none group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-slate-700">模板管理</span>
        </button>

        <button
          onClick={onExportClick}
          className="bg-white border border-slate-100 rounded-xl p-4 hover-lift executive-shadow text-center flex flex-col items-center justify-center gap-2 select-none group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center text-emerald-600 transition-colors">
            <Download className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-slate-700">数据导出</span>
        </button>

        <button
          onClick={onAuditClick}
          className="bg-white border border-slate-100 rounded-xl p-4 hover-lift executive-shadow text-center flex flex-col items-center justify-center gap-2 select-none group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center text-indigo-600 transition-colors">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-slate-700">安全审计</span>
        </button>
      </div>

      {/* Main Chart Card and Recent activity rows */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Line Chart */}
        <div className="xl:col-span-8 bg-white border border-slate-100 rounded-2xl p-6 executive-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">消息趋势</h3>
              <p className="text-xs text-slate-400">目前7天发出 / 收到消息数量</p>
            </div>
            {/* Toggle buttons for Week/Day */}
            <div className="flex bg-slate-50 rounded-lg p-1 border border-slate-100 text-xs">
              <button
                onClick={() => setChartRange('day')}
                className={`px-3 py-1 rounded-md transition-all ${
                  chartRange === 'day'
                    ? 'bg-white text-slate-800 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                日
              </button>
              <button
                onClick={() => setChartRange('week')}
                className={`px-3 py-1 rounded-md transition-all ${
                  chartRange === 'week'
                    ? 'bg-white text-slate-800 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                周
              </button>
            </div>
          </div>

          {/* Real Recharts Line Area Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorRecv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                />
                <Area type="monotone" dataKey="发出" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSent)" name="发出条数 (k)" />
                <Area type="monotone" dataKey="收到" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorRecv)" name="收到条数 (k)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Legends */}
          <div className="flex justify-end gap-6 text-xs text-slate-500 mt-2">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#8b5cf6] rounded"></span>
              发出 (k条)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-slate-300 rounded-full border border-dashed border-slate-500"></span>
              收到 (k条)
            </span>
          </div>
        </div>

        {/* Recent logs */}
        <div className="xl:col-span-4 bg-white border border-slate-100 rounded-2xl p-6 executive-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">最近日志</h3>
            <button
              onClick={onAuditClick}
              className="text-xs font-semibold text-[#8b5cf6] hover:underline flex items-center gap-0.5"
            >
              查看全部 <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-50">
            {recentLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]"></span>
                  <p className="text-xs font-semibold text-slate-700 truncate">{log.action}</p>
                </div>
                <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap ml-2">
                  {log.timestamp.includes('今天') ? log.timestamp.split(' ')[1] : log.timestamp}
                </span>
              </div>
            ))}
            {recentLogs.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-xs">
                暂无最新数据日志
              </div>
            )}
          </div>

          {/* Small Notice Box */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mt-4 flex items-start gap-2.5 text-[11px] text-slate-500 leading-relaxed">
            <Info className="w-4 h-4 text-[#8b5cf6] shrink-0 mt-0.5" />
            <p>
              本系统日志安全记录，任何通过云端协议发送的网络活动将会在系统后台及区块链进行上锁记录。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
