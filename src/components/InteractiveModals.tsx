/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Send, FileText, X, Sparkles, CheckCircle, Eye, AlertCircle, Copy, Check, Download, ClipboardList } from 'lucide-react';
import { CloudProtocol, ActivityLog } from '../types';

/* ============================================================================
   MODAL 1: MASS BROADCAST (消息群发)
   ============================================================================ */
interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  protocols: CloudProtocol[];
  pointsBalance: number;
  onConfirmSend: (sentCount: number, costPoints: number, targetProtocol: string, customText: string) => void;
}

export function BroadcastModal({
  isOpen,
  onClose,
  protocols,
  pointsBalance,
  onConfirmSend
}: BroadcastModalProps) {
  const [selectedProtocol, setSelectedProtocol] = useState(protocols[0]?.id || '');
  const [sendCount, setSendCount] = useState(50);
  const [messageText, setMessageText] = useState('您好！我是辛云企业获客特使，为您推送2026年最新自动化方案，欢迎点入 https://xy-url.cn 免费核拨额度对账！');
  const [sendingState, setSendingState] = useState<'idle' | 'validating' | 'dispatching' | 'finished'>('idle');
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const cost = sendCount * 0.01; // 0.01 pts per message

  const handleStartSend = () => {
    if (cost > pointsBalance) {
      alert('抱歉！您的当前可用点数不足，请先到 [卡密兑换] 进行核销充值！');
      return;
    }

    setSendingState('validating');
    setProgress(15);

    // Validate CK protocol node path
    setTimeout(() => {
      setSendingState('dispatching');
      setProgress(45);

      // Dispatch packet loop
      let timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(timer);
            setSendingState('finished');
            // Execute parent action
            const protocolName = protocols.find(p => p.id === selectedProtocol)?.name || '默认通道';
            onConfirmSend(sendCount, cost, protocolName, messageText);
            return 100;
          }
          return prev + 15;
        });
      }, 300);
    }, 800);
  };

  const handleReset = () => {
    setSendingState('idle');
    setProgress(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 text-left shadow-xl border border-slate-100 animate-scaleUp">
        <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Send className="w-5 h-5 text-[#8b5cf6]" />
            云端协议消息群发
          </h3>
          <button onClick={handleReset} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {sendingState === 'idle' && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-500 leading-relaxed">
              支持挂载活跃的 CK 会话，往指定并发节点分发推广、客户召回及回聘广播。
            </p>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">选择接入信道协议</label>
              <select
                value={selectedProtocol}
                onChange={(e) => setSelectedProtocol(e.target.value)}
                className="w-full border border-slate-100 rounded-lg px-2.5 py-1.5 text-slate-700 bg-white"
              >
                {protocols.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.ckToken.slice(0, 10)}...)
                  </option>
                ))}
                {protocols.length === 0 && <option value="">暂无节点，将使用本地临时节点</option>}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">单次群发条数 (单条成本 0.01 pts)</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={sendCount}
                  onChange={(e) => setSendCount(Number(e.target.value))}
                  className="w-full accent-[#8b5cf6] cursor-pointer"
                />
                <span className="font-bold text-sm bg-violet-50 text-[#8b5cf6] px-2.5 py-1 rounded-lg w-20 text-center font-mono shrink-0">
                  {sendCount} 条
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">推广文案构件 (支持变量插拔)</label>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full border border-slate-100 rounded-lg px-3 py-2 text-slate-700 outline-none h-20 resize-none focus:ring-2 focus:ring-[#8b5cf6]/20 focus:border-[#8b5cf6]"
              />
            </div>

            {/* Charges estimator */}
            <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 flex items-center justify-between font-medium">
              <div className="text-left">
                <p className="text-[10px] text-slate-400 uppercase">估算消费点数</p>
                <p className="text-sm font-bold text-[#8b5cf6] font-mono">{cost.toFixed(2)} pts</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase">当前余额</p>
                <p className="text-xs font-bold text-slate-700">{pointsBalance.toFixed(2)} pts</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-1.5 border border-slate-100 text-slate-600 rounded-lg font-semibold hover:bg-slate-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleStartSend}
                className="px-6 py-1.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg font-bold flex items-center gap-1.5"
              >
                开始云群发
              </button>
            </div>
          </div>
        )}

        {/* Dynamic sending progress simulator */}
        {(sendingState === 'validating' || sendingState === 'dispatching') && (
          <div className="py-8 text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#8b5cf6] border-t-transparent rounded-full animate-spin"></div>
            </div>

            <p className="text-sm font-bold text-slate-800 animate-pulse">
              {sendingState === 'validating' ? '正在连接安全 CK 信道节点...' : `正在向安全协议节点分发投递 (${progress}%)`}
            </p>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">请勿关闭本页面，系统会向云端协议挂载线程投递高并发并发任务包。</p>

            <div className="w-48 h-2 bg-slate-100 rounded-full mx-auto overflow-hidden border border-slate-50">
              <div
                className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Sending success feedback */}
        {sendingState === 'finished' && (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-2 border border-green-100">
              <CheckCircle className="w-6 h-6" />
            </div>

            <h4 className="text-base font-bold text-slate-800">矩阵群发投递成功！</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              成功向云后台发送 <span className="font-bold text-green-600 font-mono">{sendCount} 条</span> 协议请求包，同步消耗{' '}
              <span className="font-bold text-[#8b5cf6] font-mono">{cost.toFixed(2)} pts</span> 可用额外充值余额。
            </p>

            <button
              onClick={handleReset}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all"
            >
              关闭并重载工作台
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


/* ============================================================================
   MODAL 2: TEMPLATE MANAGER (模板管理)
   ============================================================================ */
interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TemplateManagerModal({ isOpen, onClose }: TemplateModalProps) {
  const [temps, setTemps] = useState([
    { id: '1', name: '首发迎新推介词', body: '您好！由于平台限制，您目前有 85% 资料待充值审核，核销礼金请核查 xy-url.cn 领用对账。' },
    { id: '2', name: '客户二回召引流', body: '尊贵的用户，获客系统已更新至 V2.4 独家代理池！专属 VIP 卡密激活密钥立减 ¥20 优惠！点击 xy-url.cn 查看规则' },
    { id: '3', name: '节点维护致歉礼包', body: '您好，我们将于 2026年6月20日 凌晨割接服务器。对于断网影响赠送您 20 pt 充值卡密以做补偿。' }
  ]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [inputName, setInputName] = useState('');
  const [inputBody, setInputBody] = useState('');

  if (!isOpen) return null;

  const handleAddTemp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName || !inputBody) return;
    setTemps([
      ...temps,
      {
        id: Date.now().toString(),
        name: inputName,
        body: inputBody
      }
    ]);
    setInputName('');
    setInputBody('');
  };

  const handleDelete = (id: string) => {
    setTemps(temps.filter((t) => t.id !== id));
  };

  const handleCopy = (str: string, id: string) => {
    navigator.clipboard.writeText(str);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 text-left shadow-xl border border-slate-100 animate-scaleUp">
        <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#8b5cf6]" />
            模板内容库管理
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 leading-snug">
          {/* Create New template Form */}
          <form onSubmit={handleAddTemp} className="md:col-span-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">设计新模板</h4>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold block">模板别称</label>
              <input
                type="text"
                required
                placeholder="如：年中裂变通知"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="w-full border border-slate-100 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-[#8b5cf6]/20"
              />
            </div>

            <div className="space-y-1 font-sans">
              <label className="text-[10px] text-slate-400 font-bold block">信息体</label>
              <textarea
                required
                placeholder="在此填入具体的推广、激活文字正文"
                value={inputBody}
                onChange={(e) => setInputBody(e.target.value)}
                className="w-full border border-slate-100 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 h-24 resize-none outline-none focus:ring-2 focus:ring-[#8b5cf6]/20"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs font-bold rounded-lg transition-all"
            >
              录入模板库
            </button>
          </form>

          {/* List existing ones */}
          <div className="md:col-span-7 space-y-3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-5 max-h-64 overflow-y-auto custom-scrollbar">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">模板明细</h4>

            <div className="space-y-2">
              {temps.map((t) => (
                <div key={t.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-[11px] relative group leading-relaxed">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-800">{t.name}</span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(t.body, t.id)}
                        className="p-1 hover:bg-white text-slate-400 hover:text-[#8b5cf6] rounded transition-colors"
                        title="复制模板内容"
                      >
                        {copiedId === t.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded transition-colors"
                        title="废除"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-500 line-clamp-2">{t.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ============================================================================
   MODAL 3: SECURITY DIAGNOSTICS & AUDITING (安全审计)
   ============================================================================ */
interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: ActivityLog[];
}

export function SecurityAuditModal({ isOpen, onClose, logs }: AuditModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 text-left shadow-xl border border-slate-100 animate-scaleUp">
        <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-[#8b5cf6]" />
            安全合规性审计分析
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs select-none">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>CK 通道心跳正常</span>
            </div>
            <span className="text-slate-400 font-mono">100% 成功率</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>IP 网络节点无代理劫持</span>
            </div>
            <span className="text-slate-400 font-mono">北京/上海专线</span>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">平台完整历史活动溯源 (最新记录)</h4>

            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1.5 font-medium">
              {logs.map((log) => (
                <div key={log.id} className="p-2 border border-slate-50 rounded-lg flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]"></span>
                    <span className="font-bold text-slate-800 shrink-0">{log.action}</span>
                    <span className="text-slate-400 text-[10px] truncate">({log.detail})</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0 select-text">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed text-center pt-2">
            2026 © 辛云安全审计引擎。使用 256 位 TLS 与加密网络隧道链接，保障企业财产数据无泄露风险。
          </p>
        </div>
      </div>
    </div>
  );
}
