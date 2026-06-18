/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MessageSquare, Plus, Check, Play, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { ReplyRule } from '../types';

interface ReplyRulesProps {
  rules: ReplyRule[];
  onAddRule: (rule: ReplyRule) => void;
  onDeleteRule: (id: string) => void;
  onToggleRuleStatus: (id: string) => void;
}

export default function ReplyRulesView({
  rules,
  onAddRule,
  onDeleteRule,
  onToggleRuleStatus
}: ReplyRulesProps) {
  const [keyword, setKeyword] = useState('');
  const [matchType, setMatchType] = useState<'exact' | 'contains'>('contains');
  const [replyType, setReplyType] = useState<'text' | 'image' | 'link'>('text');
  const [replyContent, setReplyContent] = useState('');

  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword || !replyContent) return;

    const newRule: ReplyRule = {
      id: 'rule-' + Date.now(),
      keyword,
      matchType,
      replyType,
      replyContent,
      status: true
    };

    onAddRule(newRule);
    setKeyword('');
    setReplyContent('');
    setIsOpenModal(false);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">自动回复规则</h2>
          <p className="text-sm text-slate-500 mt-1">
            配置智能营销机器人匹配词，实现潜在客户接入及提词自动回盘。
          </p>
        </div>

        <button
          onClick={() => setIsOpenModal(true)}
          className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md hover:shadow-[#8b5cf6]/10 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          创建回复规则
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-6 executive-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-800">当前机器人规则序列 ({rules.length})</h3>
        </div>

        <div className="space-y-3.5">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/40 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-slate-800">触发词: "{rule.keyword}"</span>
                  <span className="text-[10px] bg-[#8b5cf6]/10 text-[#8b5cf6] px-2 py-0.5 rounded font-semibold">
                    {rule.matchType === 'exact' ? '全字匹配' : '包含即可'}
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">
                    类型: {rule.replyType === 'text' ? '纯文本' : rule.replyType === 'image' ? '配图文件' : '外部引流链接'}
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2">
                  回复构件: <span className="font-mono text-slate-600 bg-slate-100/50 px-1 py-0.5 rounded">{rule.replyContent}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 sm:ml-auto select-none">
                <button
                  onClick={() => onToggleRuleStatus(rule.id)}
                  className="flex items-center gap-1 p-1 px-2 border border-slate-100 rounded bg-white text-xs text-slate-600 hover:bg-slate-50 transition-all"
                >
                  {rule.status ? (
                    <>
                      <ToggleRight className="w-5 h-5 text-green-500" />
                      <span>正在生效</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5 text-slate-400" />
                      <span>已暂停</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onDeleteRule(rule.id)}
                  className="p-2 hover:bg-rose-50 border border-slate-100 hover:text-rose-600 text-slate-400 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {rules.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-xs">
              无活动匹配回复词规则。请点击右上角新增匹配逻辑。
            </div>
          )}
        </div>
      </div>

      {isOpenModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-left shadow-lg border border-slate-100">
            <h3 className="text-base font-bold text-slate-800">新增回复规则</h3>
            <p className="text-xs text-slate-400 mt-1">
              通过拦截关键字，让云端节点自动化完成获客应答。
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">监测拦截触发关键字</label>
                <input
                  type="text"
                  required
                  placeholder="如：价格 / 优惠 / 免费试用"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full border border-slate-100 rounded-lg px-3.5 py-1.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#8b5cf6]/25 focus:border-[#8b5cf6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">匹配机制</label>
                  <select
                    value={matchType}
                    onChange={(e: any) => setMatchType(e.target.value)}
                    className="w-full border border-slate-100 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 bg-white"
                  >
                    <option value="contains">模糊包含</option>
                    <option value="exact">完全相同</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">回码媒介</label>
                  <select
                    value={replyType}
                    onChange={(e: any) => setReplyType(e.target.value)}
                    className="w-full border border-slate-100 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 bg-white"
                  >
                    <option value="text">纯文字回复</option>
                    <option value="image">图床附件URL</option>
                    <option value="link">外链引流跳转</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">自动回复正文内容</label>
                <textarea
                  required
                  placeholder="请配置推送的营销短词、附带附件提取URL或直跳官网链接"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="w-full border border-slate-100 rounded-lg px-3.5 py-1.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#8b5cf6]/25 focus:border-[#8b5cf6] h-16 resize-none"
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
                  保存上线
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
