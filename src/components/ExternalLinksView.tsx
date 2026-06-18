/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link2, Plus, Copy, Check, ExternalLink, BarChart3, Trash2 } from 'lucide-react';
import { ExternalLink as ExtLink } from '../types';

interface ExternalLinksProps {
  links: ExtLink[];
  onAddLink: (link: ExtLink) => void;
  onDeleteLink: (id: string) => void;
}

export default function ExternalLinksView({
  links,
  onAddLink,
  onDeleteLink
}: ExternalLinksProps) {
  const [title, setTitle] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !originalUrl) return;

    const shortId = Math.random().toString(36).substring(2, 6);
    const newLink: ExtLink = {
      id: 'link-' + Date.now(),
      title,
      originalUrl,
      shortUrl: 'https://xy-url.cn/s/' + shortId,
      clicks: 0,
      createdAt: new Date().toISOString().slice(0, 10)
    };

    onAddLink(newLink);
    setTitle('');
    setOriginalUrl('');
    setIsOpenModal(false);
  };

  const handleCopy = (str: string, id: string) => {
    navigator.clipboard.writeText(str);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">外链配置</h2>
          <p className="text-sm text-slate-500 mt-1">
            将推广长链接缩短为带防封、检测与统计的短链，精准把握潜在客户点击轨迹。
          </p>
        </div>

        <button
          onClick={() => setIsOpenModal(true)}
          className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md hover:shadow-[#8b5cf6]/10 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          生成轻量短网址
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-6 executive-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-800">活动外链转化池列表</h3>
        </div>

        <div className="space-y-4">
          {links.map((link) => (
            <div
              key={link.id}
              className="p-4 border border-slate-100 bg-slate-50/40 rounded-xl hover:bg-slate-50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1 my-auto">
                <span className="font-bold text-sm text-slate-800 focus:outline-none">{link.title}</span>
                <p className="text-xs text-slate-400 font-mono truncate max-w-sm md:max-w-md">
                  原链: {link.originalUrl}
                </p>
                <div className="flex items-center gap-2 mt-1.5 bg-white border border-slate-100 px-3 py-1 rounded-lg w-fit">
                  <span className="text-xs font-bold text-[#8b5cf6] font-mono">{link.shortUrl}</span>
                  <button
                    onClick={() => handleCopy(link.shortUrl, link.id)}
                    className="p-1 text-slate-400 hover:text-[#8b5cf6] rounded hover:bg-slate-50 transition-colors"
                    title="复制短网址"
                  >
                    {copiedId === link.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:ml-auto select-none border-t border-slate-100/60 md:border-none pt-2 md:pt-0">
                <div className="flex items-center gap-1.5 text-slate-500 bg-slate-100/60 px-3 py-1 rounded-lg">
                  <BarChart3 className="w-4 h-4 text-slate-400 animate-pulse" />
                  <span className="text-xs font-bold font-mono text-slate-700">{link.clicks} 访问PV</span>
                </div>

                <button
                  onClick={() => onDeleteLink(link.id)}
                  className="p-2 hover:bg-rose-50 border border-slate-100 hover:text-rose-600 text-slate-400 rounded-lg transition-colors ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {links.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-xs">
              无分发行销转化外链。
            </div>
          )}
        </div>
      </div>

      {isOpenModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-left shadow-lg border border-slate-100">
            <h3 className="text-base font-bold text-slate-800">生成统计防封短链</h3>
            <p className="text-xs text-slate-400 mt-1">
              缩短长链接，在微信、QQ、短信及海外节点分发出海实现流量拦截。
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">渠道/外链名称</label>
                <input
                  type="text"
                  required
                  placeholder="如：华南区推广手册 v2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-slate-100 rounded-lg px-3.5 py-1.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#8b5cf6]/25 focus:border-[#8b5cf6]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">渠道原目标网址 (Destination URL)</label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/xxxx..."
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  className="w-full border border-slate-100 rounded-lg px-3.5 py-1.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#8b5cf6]/25 focus:border-[#8b5cf6]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="px-4 py-1.5 border border-slate-100 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg text-xs font-bold"
                >
                  确立缩短
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
