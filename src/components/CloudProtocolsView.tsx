/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Cpu, RefreshCw, Plus, CheckCircle, Smartphone, MoreVertical, Key, Trash2 } from 'lucide-react';
import { CloudProtocol } from '../types';

interface CloudProtocolsProps {
  protocols: CloudProtocol[];
  onAddProtocol: (node: CloudProtocol) => void;
  onDeleteProtocol: (id: string) => void;
  onSync: (id: string) => void;
}

export default function CloudProtocolsView({
  protocols,
  onAddProtocol,
  onDeleteProtocol,
  onSync
}: CloudProtocolsProps) {
  const [name, setName] = useState('');
  const [remark, setRemark] = useState('');
  const [ckToken, setCkToken] = useState('');
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !ckToken) return;

    const newNode: CloudProtocol = {
      id: 'pt-' + Date.now(),
      name,
      status: 'online',
      ckToken: ckToken.slice(0, 10) + '...' + ckToken.slice(-4),
      lastSync: '刚刚',
      remark: remark || '无备注'
    };

    onAddProtocol(newNode);
    setName('');
    setCkToken('');
    setRemark('');
    setIsOpenModal(false);
  };

  const handleTriggerSync = (id: string) => {
    setSyncStatus(id);
    setTimeout(() => {
      onSync(id);
      setSyncStatus(null);
    }, 1000);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">云端协议 (CK登录)</h2>
          <p className="text-sm text-slate-500 mt-1">
            同步、维持或清除与后端云服务器交互的客户端 CK 会话身份。
          </p>
        </div>

        <button
          onClick={() => setIsOpenModal(true)}
          className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md hover:shadow-[#8b5cf6]/10 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          接入新 CK 协议
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-6 executive-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-800">云端会话节点状态</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {protocols.map((node) => (
            <div
              key={node.id}
              className="p-4 border border-slate-100 bg-slate-50/40 hover:bg-slate-50 rounded-xl flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#8b5cf6]" />
                    {node.name}
                  </h4>

                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      node.status === 'online'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {node.status === 'online' ? '运行中' : '已过期'}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 font-mono mt-2 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5" /> CK: {node.ckToken}
                </p>
                <p className="text-xs text-slate-500 mt-1">备注: {node.remark}</p>
              </div>

              <div className="border-t border-slate-100/60 pt-3 mt-4 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">上次检查: {node.lastSync}</span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleTriggerSync(node.id)}
                    disabled={syncStatus === node.id}
                    className="p-1 px-2 text-[10px] font-bold bg-white border border-slate-100 hover:bg-slate-100 rounded text-slate-600 transition-colors flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${syncStatus === node.id ? 'animate-spin' : ''}`} />
                    {syncStatus === node.id ? '同步中' : '心跳同步'}
                  </button>

                  <button
                    onClick={() => onDeleteProtocol(node.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {protocols.length === 0 && (
            <div className="col-span-2 text-center py-10 text-slate-400 text-xs">
              暂无已挂连的 CK 协议节点。请点击右上角接入。
            </div>
          )}
        </div>
      </div>

      {isOpenModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-left shadow-lg border border-slate-100">
            <h3 className="text-base font-bold text-slate-800">接入新 CK 协议</h3>
            <p className="text-xs text-slate-400 mt-1">
              挂接独立的 cookie 会话口令来实现多账户矩阵群发。
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">节点名称</label>
                <input
                  type="text"
                  required
                  placeholder="如：北京专机主账号"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-100 rounded-lg px-3.5 py-1.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#8b5cf6]/25 focus:border-[#8b5cf6]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CK 会话秘钥 (Session Token)</label>
                <textarea
                  required
                  placeholder="请输入以 ck_ 开头或 cookie 拼接序列字串"
                  value={ckToken}
                  onChange={(e) => setCkToken(e.target.value)}
                  className="w-full border border-slate-100 rounded-lg px-3.5 py-1.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#8b5cf6]/25 focus:border-[#8b5cf6] h-16 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">通道备注</label>
                <input
                  type="text"
                  placeholder="节点备注用途说明"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
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
                  挂载接入
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
