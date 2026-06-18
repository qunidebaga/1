/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Ticket, Copy, Check, Sparkles, CheckCircle, HelpCircle } from 'lucide-react';
import { ActivationCode } from '../types';

interface RedemptionProps {
  codes: ActivationCode[];
  onRedeem: (codeStr: string) => { success: boolean; msg: string; points?: number };
}

export default function RedemptionView({ codes, onRedeem }: RedemptionProps) {
  const [inputCode, setInputCode] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [responseMsg, setResponseMsg] = useState({ success: false, text: '' });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleRedeemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    const res = onRedeem(inputCode.trim());
    if (res.success) {
      setResponseMsg({ success: true, text: `恭喜！成功兑换并充值 ${res.points?.toFixed(2)} pts 点数余额！` });
      setInputCode('');
    } else {
      setResponseMsg({ success: false, text: res.msg });
    }

    setTimeout(() => {
      setResponseMsg({ success: false, text: '' });
    }, 4500);
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">卡密兑换 (充值中心)</h2>
        <p className="text-sm text-slate-500 mt-1">使用平台下发或经销商处购买的充值礼券，直接清算获得点数额度。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left column - Card activation panel */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 executive-shadow space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#8b5cf6]" />
            输入充值卡密
          </h3>

          <form onSubmit={handleRedeemSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">验证密钥 / 激活串码 (16位序列)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="如：VIP-PASS-XY77"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="w-full border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-800 uppercase focus:ring-2 focus:ring-[#8b5cf6]/20 focus:border-[#8b5cf6]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow-md hover:shadow-[#8b5cf6]/10 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              立即核销并兑换
            </button>
          </form>

          {responseMsg.text && (
            <div
              className={`p-4 rounded-xl border flex items-start gap-2.5 text-xs font-semibold leading-relaxed animate-fadeIn ${
                responseMsg.success
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {responseMsg.success && <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />}
              <span>{responseMsg.text}</span>
            </div>
          )}

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-[11px] text-slate-500 flex items-start gap-2 mt-4">
            <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              充值卡密属于一次性消费型资产，核销成功后点数将永久累加到您的账户资产表，无法再次核销退回。
            </p>
          </div>
        </div>

        {/* Right column - Test keys to check instantly */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 executive-shadow space-y-4">
          <h3 className="text-base font-bold text-slate-800">可供核销卡密测试池 (点击直接复制)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            为您在系统内存中预置了以下三张可兑换的特权礼券。复制下方串码到左侧框内提交体验：
          </p>

          <div className="space-y-3">
            {codes.map((item) => (
              <div
                key={item.code}
                className={`p-3 border rounded-xl flex items-center justify-between transition-all ${
                  item.redeemed
                    ? 'bg-slate-100/50 border-slate-100 line-through opacity-50'
                    : 'bg-violet-50/20 border-violet-100/55 hover:bg-violet-50/40'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold font-mono text-slate-800 uppercase bg-white border border-slate-100 px-1.5 py-0.5 rounded leading-none">
                      {item.code}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      item.redeemed ? 'bg-slate-200 text-slate-500' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.redeemed ? '已兑换' : `含 ${item.points} pt`}
                    </span>
                  </div>
                  <p className="text-2xs text-slate-400 mt-1.5">用途: {item.notes}</p>
                </div>

                {!item.redeemed && (
                  <button
                    onClick={() => handleCopyCode(item.code)}
                    className="p-1.5 bg-white border border-slate-100 hover:border-[#8b5cf6] text-slate-400 hover:text-[#8b5cf6] transition-colors rounded-lg flex items-center gap-1 text-[10px] font-bold"
                  >
                    {copiedCode === item.code ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    复制卡密
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
