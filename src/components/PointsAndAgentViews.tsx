/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileText, Coins, ArrowUpRight, ArrowDownLeft, ShieldCheck, Calendar, Users, Briefcase, Percent, Award, Plus, Copy, Check } from 'lucide-react';
import { PointTransaction } from '../types';

/* ============================================================================
   VIEW 1: POINTS LOGS (点数流水)
   ============================================================================ */
interface PointsLogProps {
  transactions: PointTransaction[];
}

export function PointsLogView({ transactions }: PointsLogProps) {
  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">点数流水</h2>
        <p className="text-sm text-slate-500 mt-1">
          账目明细账，查看各协议挂靠通道发送扣减点数以及卡密兑换核销的历史对账单。
        </p>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-6 executive-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-800">消费明细对账单</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-xs">
            <thead>
              <tr className="bg-slate-50/60 rounded">
                <th className="px-3 py-2 text-slate-500 font-bold uppercase tracking-wider text-left">流水单号 (TXID)</th>
                <th className="px-3 py-2 text-slate-500 font-bold uppercase tracking-wider text-left">对账日期</th>
                <th className="px-3 py-2 text-slate-500 font-bold uppercase tracking-wider text-left">项目名称 (摘要描述)</th>
                <th className="px-3 py-2 text-slate-500 font-bold uppercase tracking-wider text-left">账目类型</th>
                <th className="px-4 py-2 text-slate-500 font-bold uppercase tracking-wider text-right">变动额 (PTS)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-3 py-3 whitespace-nowrap text-slate-400 font-mono font-medium">{trx.id}</td>
                  <td className="px-3 py-3 text-slate-400 font-mono">{trx.timestamp}</td>
                  <td className="px-3 py-3 font-bold text-slate-700">{trx.description}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                      trx.type === 'charge'
                        ? 'bg-emerald-100 text-emerald-800'
                        : trx.type === 'redeem'
                        ? 'bg-violet-100 text-violet-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {trx.type === 'charge' ? '通道充值' : trx.type === 'redeem' ? '卡密兑换' : '群发扣减'}
                    </span>
                  </td>
                  <td className={`px-4 py-3 font-mono font-bold text-right text-sm ${
                    trx.type === 'charge' || trx.type === 'redeem' ? 'text-emerald-500' : 'text-slate-700'
                  }`}>
                    {trx.type === 'charge' || trx.type === 'redeem' ? '+' : '-'}{trx.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


/* ============================================================================
   VIEW 2: AGENT CENTER (代理中心)
   ============================================================================ */
export function AgentCenterView() {
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Generate a mock keycard for agents
  const handleGenerateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'AGENT-MOCK-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCreatedCode(code);
  };

  const handleCopyCode = () => {
    if (createdCode) {
      navigator.clipboard.writeText(createdCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">代理中心</h2>
        <p className="text-sm text-slate-500 mt-1">
          分级经销面板。二级代理商可通过折扣批发充值卡密、创建下辖下线从而抽取额度抽成。
        </p>
      </div>

      {/* Top executive stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-3.5 executive-shadow hover-lift">
          <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center text-[#8b5cf6]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">下辖下线用户</p>
            <p className="text-lg font-bold text-slate-800">12 位</p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-3.5 executive-shadow hover-lift">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">代理抽成比例</p>
            <p className="text-lg font-bold text-slate-800">15.0%</p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-3.5 executive-shadow hover-lift">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">本月售卡汇总</p>
            <p className="text-lg font-bold text-slate-800">4,200.00 pts</p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-3.5 executive-shadow hover-lift">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">本月提取利润</p>
            <p className="text-lg font-bold text-emerald-500">+¥ 630.00</p>
          </div>
        </div>
      </div>

      {/* Main columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Create Code as an agent */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 executive-shadow space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            代理自主开辟礼包卡密
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            代理商可以随时开辟指定金额的核销礼券转售给下辖客户，礼券成本将从代理自身的可用点数余额直接等价清算扣除。
          </p>

          <button
            onClick={handleGenerateCode}
            className="w-full py-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs font-bold rounded-xl transition-all shadow-sm max-w-xs block mx-auto text-center"
          >
            随机定制卡密 (10 pts 规格)
          </button>

          {createdCode && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between text-xs animate-fadeIn">
              <div>
                <p className="text-[10px] text-emerald-700 font-bold">成功开通 10 pt 充值券！</p>
                <p className="text-sm font-semibold font-mono text-emerald-800 mt-1 uppercase">{createdCode}</p>
              </div>

              <button
                onClick={handleCopyCode}
                className="p-1.5 bg-white border border-emerald-100 hover:border-[#8b5cf6] text-emerald-600 hover:text-[#8b5cf6] font-bold rounded-lg transition-colors flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? '已复制' : '复制密码'}
              </button>
            </div>
          )}
        </div>

        {/* Agency list mock */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 executive-shadow space-y-4">
          <h3 className="text-base font-bold text-slate-800">关联子级分销网络</h3>
          <p className="text-xs text-slate-400">目前隶属您分销渠道的下线近期充值对账单：</p>

          <div className="space-y-3 font-medium">
            <div className="flex justify-between items-center text-xs p-2 border-b border-slate-50">
              <div>
                <p className="text-slate-800 font-bold">李华企业推广部 (uid_9982)</p>
                <p className="text-[10px] text-slate-400 mt-0.5">2026-06-18 10:24</p>
              </div>
              <span className="text-emerald-500 font-bold font-mono">核销 100 pt (+¥15佣金)</span>
            </div>

            <div className="flex justify-between items-center text-xs p-2 border-b border-slate-50">
              <div>
                <p className="text-slate-800 font-bold">广州极速引流团队 (uid_1143)</p>
                <p className="text-[10px] text-slate-400 mt-0.5">2026-06-17 14:15</p>
              </div>
              <span className="text-emerald-500 font-bold font-mono">核销 500 pt (+¥75佣金)</span>
            </div>

            <div className="flex justify-between items-center text-xs p-2 border-b border-slate-50">
              <div>
                <p className="text-slate-800 font-bold">张强自媒体工作站 (uid_4761)</p>
                <p className="text-[10px] text-slate-400 mt-0.5">2026-06-15 09:22</p>
              </div>
              <span className="text-emerald-500 font-bold font-mono">核销 200 pt (+¥30佣金)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
