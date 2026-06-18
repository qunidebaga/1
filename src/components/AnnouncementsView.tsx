/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bell, AlertCircle, Info, Calendar, ChevronRight, Share, CheckCircle } from 'lucide-react';
import { Announcement } from '../types';

interface AnnouncementsViewProps {
  announcements: Announcement[];
}

export default function AnnouncementsView({ announcements }: AnnouncementsViewProps) {
  const [selectedAnn, setSelectedAnn] = useState<Announcement | null>(null);

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">系统公告</h2>
        <p className="text-sm text-slate-500 mt-1">获取最新产品迭代、升级要点、维护声明与网络链路应急通知。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left Column list */}
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              onClick={() => setSelectedAnn(ann)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                selectedAnn?.id === ann.id
                  ? 'border-[#8b5cf6] bg-violet-50/20'
                  : 'bg-white border-slate-100 hover:border-violet-100 hover:shadow-md hover:shadow-violet-100/10'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {ann.category === 'maintenance' && (
                  <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    链路割接
                  </span>
                )}
                {ann.category === 'update' && (
                  <span className="bg-[#8b5cf6]/10 text-[#8b5cf6] text-[10px] px-2 py-0.5 rounded-full font-bold">
                    版本升级
                  </span>
                )}
                {ann.category === 'system' && (
                  <span className="bg-rose-100 text-rose-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    严打合规
                  </span>
                )}

                {ann.isImportant && (
                  <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase animate-pulse">
                    重要
                  </span>
                )}

                <span className="text-[11px] font-mono text-slate-400 ml-auto flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {ann.date}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{ann.title}</h3>
              <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">{ann.excerpt}</p>

              <div className="flex justify-end mt-4">
                <button className="text-xs font-semibold text-[#8b5cf6] flex items-center gap-0.5 hover:underline decoration-violet-500">
                  点击查看全文 <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column Detail screen */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 executive-shadow min-h-[400px] flex flex-col justify-between">
          {selectedAnn ? (
            <div className="space-y-4">
              <div className="border-b border-slate-50 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase">
                    {selectedAnn.category.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {selectedAnn.date}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 leading-snug">{selectedAnn.title}</h3>
              </div>

              <div className="text-xs text-slate-600 space-y-4 whitespace-pre-wrap leading-relaxed">
                {selectedAnn.content}
              </div>

              <div className="bg-slate-50 rounded-xl p-3.5 text-[11px] text-slate-500 border border-slate-100 mt-6 leading-relaxed flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <span>
                  本公告同步由辛云安全事务委员会认证，属于系统合规必要提示，不构成特定推广契约指标。
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center my-auto p-6">
              <div className="w-12 h-12 rounded-full bg-violet-50 text-[#8b5cf6] flex items-center justify-center mb-3">
                <Bell className="w-6 h-6 animate-bounce" />
              </div>
              <p className="text-sm font-bold text-slate-700">请选择左侧的通知公告</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">点击任意公告，即可在右侧查看完整的正文解析与业务升级细则。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
