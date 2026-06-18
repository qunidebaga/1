/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { initialProfile, initialSessions, initialSecurityStatus, initialActivityLogs, initialTransactions, initialAttachments, initialAnnouncements, initialProtocols, initialReplyRules, initialExternalLinks, initialActivationCodes } from './mockData';
import { UserProfile, DeviceSession, SecurityStatus, ActivityLog, AttachmentFile, CloudProtocol, ReplyRule, ExternalLink, ActivationCode, PointTransaction } from './types';

// Component Imports
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PersonalInfoView from './components/PersonalInfoView';
import WorkbenchView from './components/WorkbenchView';
import AttachmentsView from './components/AttachmentsView';
import AnnouncementsView from './components/AnnouncementsView';
import CloudProtocolsView from './components/CloudProtocolsView';
import ReplyRulesView from './components/ReplyRulesView';
import ExternalLinksView from './components/ExternalLinksView';
import RedemptionView from './components/RedemptionView';
import { PointsLogView, AgentCenterView } from './components/PointsAndAgentViews';

// Modal Imports
import { BroadcastModal, TemplateManagerModal, SecurityAuditModal } from './components/InteractiveModals';

export default function App() {
  // Reactive App States
  const [activeView, setActiveView] = useState<string>('profile'); // matches default visual of profile first, can switch
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [sessions, setSessions] = useState<DeviceSession[]>(initialSessions);
  const [security, setSecurity] = useState<SecurityStatus>(initialSecurityStatus);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialActivityLogs);
  const [transactions, setTransactions] = useState<PointTransaction[]>(initialTransactions);
  const [attachments, setAttachments] = useState<AttachmentFile[]>(initialAttachments);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [protocols, setProtocols] = useState<CloudProtocol[]>(initialProtocols);
  const [replyRules, setReplyRules] = useState<ReplyRule[]>(initialReplyRules);
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>(initialExternalLinks);
  const [activationCodes, setActivationCodes] = useState<ActivationCode[]>(initialActivationCodes);

  // Dynamic Sending metrics
  const [todaySent, setTodaySent] = useState<number>(0);
  const [totalSent, setTotalSent] = useState<number>(0);

  // Theme support
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Modal Open/Close statuses
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  // Sync complete animation statuses
  const [refreshing, setRefreshing] = useState(false);

  // Dynamic Completion Rate helper
  const [completionRate, setCompletionRate] = useState<number>(85);

  // Compute profile completion dynamically based on form fields
  useEffect(() => {
    let base = 60;
    if (profile.username && profile.username !== 'ceshi') base += 5;
    if (profile.email && profile.email !== 'ceshi@example.com') base += 5;
    if (profile.bio) base += 10;
    if (profile.wechatId) base += 10;
    if (profile.githubUrl) base += 5;
    if (profile.avatarUrl) base += 5;
    setCompletionRate(Math.min(base, 100));
  }, [profile]);

  // Handle Dynamic Keycard Card redemption
  const handleRedeemCode = (codeStr: string) => {
    const uppercaseCode = codeStr.trim().toUpperCase();
    const index = activationCodes.findIndex(c => c.code === uppercaseCode);

    if (index === -1) {
      return { success: false, msg: '对不起，您输入的卡密序列码无效或不存在！请核对大小写。' };
    }

    const matched = activationCodes[index];
    if (matched.redeemed) {
      return { success: false, msg: '对不起，该卡密先前已被在其他安全信道核销兑换，无法二次充积分！' };
    }

    // Process redemption:
    // 1. Mark card as redeemed
    const updatedCodes = [...activationCodes];
    updatedCodes[index] = { ...matched, redeemed: true };
    setActivationCodes(updatedCodes);

    // 2. Increase balance
    const pointsAdded = matched.points;
    const newBal = profile.pointsBalance + pointsAdded;
    setProfile(prev => ({
      ...prev,
      pointsBalance: newBal
    }));

    // 3. Log into transactions ledger
    const newTrx: PointTransaction = {
      id: 'trx-' + Date.now().toString().slice(-6),
      type: 'redeem',
      amount: pointsAdded,
      description: `卡密核销充值: ${matched.code} (${matched.notes})`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    setTransactions(prev => [newTrx, ...prev]);

    // 4. Log to security timeline
    const newLog: ActivityLog = {
      id: 'log-' + Date.now(),
      action: '卡密积分核销成功',
      timestamp: '今天 ' + new Date().toTimeString().slice(0, 5),
      detail: `核销 ${uppercaseCode}, 获得 +${pointsAdded} pt`,
      type: 'redeem'
    };
    setActivityLogs(prev => [newLog, ...prev]);

    return { success: true, msg: '核销成功', points: pointsAdded };
  };

  // Confirm and deduct points inside App on mock successful Broad Cast message dispatch
  const handleConfirmSend = (sentCount: number, costPoints: number, targetProtocol: string, customText: string) => {
    // 1. Deduct pts balance
    setProfile(prev => ({
      ...prev,
      pointsBalance: Math.max(0, prev.pointsBalance - costPoints)
    }));

    // 2. Increase statistics count
    setTodaySent(prev => prev + sentCount);
    setTotalSent(prev => prev + sentCount);

    // 3. Register transaction
    const newTrx: PointTransaction = {
      id: 'trx-' + Date.now().toString().slice(-6),
      type: 'deduct',
      amount: costPoints,
      description: `群发扣除点数 (并发条数: ${sentCount}条 | 通道: ${targetProtocol})`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    setTransactions(prev => [newTrx, ...prev]);

    // 4. Register activity audit trace log
    const newLog: ActivityLog = {
      id: 'log-' + Date.now(),
      action: '完成矩阵并发群发',
      timestamp: '今天 ' + new Date().toTimeString().slice(0, 5),
      detail: `已向 ${sentCount} 个目标投递 | 通道: ${targetProtocol}`,
      type: 'api'
    };
    setActivityLogs(prev => [newLog, ...prev]);

    setIsBroadcastOpen(false);
  };

  // Helper Actions
  const handleAddActivityLog = (action: string, detail: string, type: 'login' | 'avatar' | 'api' | 'system' | 'redeem' | 'other') => {
    const newLog: ActivityLog = {
      id: 'log-' + Date.now(),
      action,
      timestamp: '今天 ' + new Date().toTimeString().slice(0, 5),
      detail,
      type
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const handleRefreshApp = () => {
    setRefreshing(true);
    handleAddActivityLog("刷新工作台状态", "同步各安全节点心跳", "system");
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const handleLogout = () => {
    if (confirm('是否安全退出并清除当前会话状态？')) {
      alert('已成功清空本地安全密钥会话！若需重新载入，请刷新页面。');
      handleAddActivityLog("退出登录会话", "Chrome Windows 11", "system");
    }
  };

  // Dynamic Session and Subviews lists actions
  const handleRemoveSession = (id: string) => {
    const sessionName = sessions.find(s => s.id === id)?.device || '设备';
    setSessions(sessions.filter((s) => s.id !== id));
    handleAddActivityLog("强制登出设备连接", sessionName, "system");
  };

  return (
    <div className={`min-h-screen text-slate-800 font-sans transition-colors duration-350 ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50'}`}>
      {/* Sidebar Nav */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        pointsBalance={profile.pointsBalance}
      />

      {/* Main Content Pane */}
      <div className="ml-60 min-h-screen flex flex-col relative">
        <Header
          profile={profile}
          completionRate={completionRate}
          onRefresh={handleRefreshApp}
          onLogout={handleLogout}
          openProfileTab={() => setActiveView('profile')}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* Content canvas viewport */}
        <main className="p-6 md:p-8 flex-grow custom-scrollbar overflow-y-auto">
          <div className="w-full max-w-7xl mx-auto">
            {refreshing ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-[#8b5cf6] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-semibold text-slate-500">正在核销信道状态，重获心跳...</p>
              </div>
            ) : (
              <>
                {activeView === 'workbench' && (
                  <WorkbenchView
                    profile={profile}
                    onRedeemClick={() => setActiveView('redeem')}
                    onBroadcastClick={() => setIsBroadcastOpen(true)}
                    onTemplateClick={() => setIsTemplatesOpen(true)}
                    onExportClick={() => {
                      // Trigger real download!
                      const csvContent = "data:text/csv;charset=utf-8,"
                        + "Log ID,Log Action,Logged Timestamp,Associated Info,Type\n"
                        + activityLogs.map(e => `"${e.id}","${e.action}","${e.timestamp}","${e.detail}","${e.type}"`).join("\n");
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", `xy_marketing_export_${new Date().toISOString().slice(0, 10)}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      handleAddActivityLog("导出数据成功", "已下载 CSV 报表", "system");
                    }}
                    onAuditClick={() => setIsAuditOpen(true)}
                    recentLogs={activityLogs}
                    pointsBalance={profile.pointsBalance}
                    todaySent={todaySent}
                    totalSent={totalSent}
                  />
                )}

                {activeView === 'profile' && (
                  <PersonalInfoView
                    profile={profile}
                    onChangeProfile={setProfile}
                    sessions={sessions}
                    onRemoveSession={handleRemoveSession}
                    security={security}
                    onChangeSecurity={setSecurity}
                    activityLogs={activityLogs}
                    onAddActivityLog={handleAddActivityLog}
                  />
                )}

                {activeView === 'attachments' && (
                  <AttachmentsView
                    attachments={attachments}
                    onAddAttachment={(newF) => {
                      setAttachments(prev => [newF, ...prev]);
                      handleAddActivityLog("添加了营销附件", newF.name, "other");
                    }}
                    onDeleteAttachment={(id) => {
                      setAttachments(attachments.filter(a => a.id !== id));
                      handleAddActivityLog("删除了营销附件", `id: ${id}`, "system");
                    }}
                  />
                )}

                {activeView === 'notifications' && (
                  <AnnouncementsView announcements={announcements} />
                )}

                {activeView === 'protocols' && (
                  <CloudProtocolsView
                    protocols={protocols}
                    onAddProtocol={(newP) => {
                      setProtocols(prev => [...prev, newP]);
                      handleAddActivityLog("接入新CK协议节点", newP.name, "system");
                    }}
                    onDeleteProtocol={(id) => {
                      setProtocols(protocols.filter(p => p.id !== id));
                      handleAddActivityLog("清空协议节点", `id: ${id}`, "system");
                    }}
                    onSync={(id) => {
                      const name = protocols.find(p => p.id === id)?.name || '节点';
                      const updated = protocols.map(p => p.id === id ? { ...p, lastSync: '刚刚', status: 'online' as const } : p);
                      setProtocols(updated);
                      handleAddActivityLog("信道同步成功", `${name} 心跳刷新`, "system");
                    }}
                  />
                )}

                {activeView === 'replyRules' && (
                  <ReplyRulesView
                    rules={replyRules}
                    onAddRule={(newR) => {
                      setReplyRules(prev => [...prev, newR]);
                      handleAddActivityLog("创建自动应答规则", `触发词: ${newR.keyword}`, "system");
                    }}
                    onDeleteRule={(id) => {
                      setReplyRules(replyRules.filter(r => r.id !== id));
                      handleAddActivityLog("取消自动回复规则", `id: ${id}`, "system");
                    }}
                    onToggleRuleStatus={(id) => {
                      const updated = replyRules.map(r => r.id === id ? { ...r, status: !r.status } : r);
                      setReplyRules(updated);
                      const ruleObj = replyRules.find(r => r.id === id);
                      handleAddActivityLog(
                        ruleObj?.status ? "暂停应答词" : "激活应答词",
                        `词: ${ruleObj?.keyword}`,
                        "system"
                      );
                    }}
                  />
                )}

                {activeView === 'externalLinks' && (
                  <ExternalLinksView
                    links={externalLinks}
                    onAddLink={(newL) => {
                      setExternalLinks(prev => [newL, ...prev]);
                      handleAddActivityLog("确立渠道短网址", newL.title, "system");
                    }}
                    onDeleteLink={(id) => {
                      setExternalLinks(externalLinks.filter(l => l.id !== id));
                      handleAddActivityLog("停用渠道短网址", `id: ${id}`, "system");
                    }}
                  />
                )}

                {activeView === 'redeem' && (
                  <RedemptionView
                    codes={activationCodes}
                    onRedeem={handleRedeemCode}
                  />
                )}

                {activeView === 'pointsLog' && (
                  <PointsLogView transactions={transactions} />
                )}

                {activeView === 'agentCenter' && (
                  <AgentCenterView />
                )}

                {activeView === 'dashboard' && (
                  <div className="bg-white border border-slate-100 rounded-2xl p-8 executive-shadow text-center max-w-xl mx-auto space-y-4">
                    <h3 className="text-lg font-bold text-slate-800">矩阵营销核心控制台</h3>
                    <p className="text-xs text-slate-400">
                      控制台目前作为全局视图归置了核心协议心跳。若需操作，请通过左侧侧边栏跳转：
                    </p>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => setActiveView('workbench')}
                        className="py-2.5 bg-violet-50 hover:bg-violet-100 text-[#8b5cf6] font-bold text-xs rounded-xl"
                      >
                        进入核心工作台
                      </button>
                      <button
                        onClick={() => setActiveView('profile')}
                        className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                      >
                        设置管理员安全项
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Real Active Simulation Modals */}
      <BroadcastModal
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
        protocols={protocols}
        pointsBalance={profile.pointsBalance}
        onConfirmSend={handleConfirmSend}
      />

      <TemplateManagerModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
      />

      <SecurityAuditModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        logs={activityLogs}
      />
    </div>
  );
}
