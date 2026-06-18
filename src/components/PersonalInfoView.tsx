/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  User,
  Camera,
  Upload,
  Globe,
  Mail,
  Linkedin,
  Github,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Shield,
  Smartphone,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Terminal,
  Activity,
  LogOut,
  AppWindow,
  Link
} from 'lucide-react';
import { UserProfile, DeviceSession, SecurityStatus, ActivityLog } from '../types';

interface PersonalInfoViewProps {
  profile: UserProfile;
  onChangeProfile: (updated: UserProfile) => void;
  sessions: DeviceSession[];
  onRemoveSession: (id: string) => void;
  security: SecurityStatus;
  onChangeSecurity: (updated: SecurityStatus) => void;
  activityLogs: ActivityLog[];
  onAddActivityLog: (action: string, detail: string, type: 'login' | 'avatar' | 'api' | 'system' | 'redeem' | 'other') => void;
}

export default function PersonalInfoView({
  profile,
  onChangeProfile,
  sessions,
  onRemoveSession,
  security,
  onChangeSecurity,
  activityLogs,
  onAddActivityLog
}: PersonalInfoViewProps) {
  // Tabs within Personal Info: 'details' (个人资料), 'safety' (安全设置), 'logs' (登录日志)
  const [activeTab, setActiveTab] = useState<'details' | 'safety' | 'logs'>('details');

  // Input states for 个人资料 (Profile Details)
  const [username, setUsername] = useState(profile.username);
  const [language, setLanguage] = useState(profile.language);
  const [email, setEmail] = useState(profile.email);
  const [bio, setBio] = useState(profile.bio);
  const [wechatId, setWechatId] = useState(profile.wechatId);
  const [githubUrl, setGithubUrl] = useState(profile.githubUrl);

  // Password fields for Safety Tab
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStatusText, setPasswordStatusText] = useState('');

  // Backup email setup modal status
  const [isBackupEmailModalOpen, setIsBackupEmailModalOpen] = useState(false);
  const [backupEmailInput, setBackupEmailInput] = useState('');

  // Form Save Toast animation status
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate percentage dynamically based on completed fields in form
  const getDynamicCompletionRate = () => {
    let fields = [profile.username, profile.email, profile.language, profile.bio, profile.wechatId, profile.githubUrl, profile.avatarUrl];
    let filled = fields.filter(f => f && f !== '').length;
    // Base 60% completion if basic account exists
    return Math.min(60 + (filled * 6), 100);
  };

  // Safe Save modification
  const handleSaveProfile = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      onChangeProfile({
        ...profile,
        username,
        language,
        email,
        bio,
        wechatId,
        githubUrl
      });
      setSaveStatus('saved');
      onAddActivityLog("更新了个人资料", "修改了基本资料设置", "system");
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 800000 / 1000000); // quick animation
  };

  // Reset/Cancel Form to current state
  const handleCancel = () => {
    setUsername(profile.username);
    setLanguage(profile.language);
    setEmail(profile.email);
    setBio(profile.bio);
    setWechatId(profile.wechatId);
    setGithubUrl(profile.githubUrl);
    setSaveStatus('idle');
  };

  // Avatar conversion to Base64 to save inside state reactive context
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("头像文件大小不能超过 5MB！");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        onChangeProfile({
          ...profile,
          avatarUrl: reader.result as string
        });
        onAddActivityLog("修改了头像", "上海", "avatar");
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  // Change security status score dynamically on setting toggle
  const handleToggle2FA = () => {
    const isEnabling = !security.twoFactorEnabled;
    const scoreDiff = isEnabling ? 15 : -15;
    onChangeSecurity({
      ...security,
      twoFactorEnabled: isEnabling,
      securityScore: Math.min(100, Math.max(0, security.securityScore + scoreDiff))
    });
    onAddActivityLog(
      isEnabling ? "启用了双重身份验证" : "禁用了双重身份验证",
      "安全策略更新",
      "system"
    );
  };

  // Handle Backup email save
  const handleSaveBackupEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (backupEmailInput.trim() === '') return;
    const scoreDiff = security.backupEmailUpdated ? 0 : 10;
    onChangeSecurity({
      ...security,
      backupEmailUpdated: true,
      securityScore: Math.min(100, security.securityScore + scoreDiff)
    });
    onAddActivityLog("更新了安全备用邮箱", backupEmailInput, "system");
    setIsBackupEmailModalOpen(false);
    setBackupEmailInput('');
  };

  // Handle fake Password submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordStatusText('请填写所有必填密码字段！');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatusText('第二次输入的新密码不一致！');
      return;
    }
    setPasswordStatusText('密码修改成功且安全节点已重置！');
    onAddActivityLog("密码重置成功", "已通过安全控制面板修改", "system");
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordStatusText(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">个人信息中心</h2>
        <p className="text-sm text-slate-500 mt-1">管理您的账户设置、安全偏好和个人资料详情。</p>
      </div>

      {/* Main Column Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side (Subpages / Forms) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Card with Tabs selection */}
          <div className="bg-white rounded-2xl border border-slate-100 executive-shadow overflow-hidden">
            <div className="flex border-b border-slate-100 bg-slate-50/50">
              <button
                onClick={() => setActiveTab('details')}
                className={`flex items-center gap-2 py-4 px-6 font-semibold text-sm transition-all focus:outline-none ${
                  activeTab === 'details'
                    ? 'text-[#8b5cf6] border-b-2 border-[#8b5cf6] bg-white'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <User className="w-4 h-4" />
                个人资料
              </button>
              <button
                onClick={() => setActiveTab('safety')}
                className={`flex items-center gap-2 py-4 px-6 font-semibold text-sm transition-all focus:outline-none ${
                  activeTab === 'safety'
                    ? 'text-[#8b5cf6] border-b-2 border-[#8b5cf6] bg-white'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Shield className="w-4 h-4" />
                安全设置
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`flex items-center gap-2 py-4 px-6 font-semibold text-sm transition-all focus:outline-none ${
                  activeTab === 'logs'
                    ? 'text-[#8b5cf6] border-b-2 border-[#8b5cf6] bg-white'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Activity className="w-4 h-4" />
                登录日志
              </button>
            </div>

            <div className="p-6">
              {/* TAB 1: PROFILE DETAILS FORM */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  {/* Upload Avatar Area */}
                  <div className="grid grid-cols-1 sm:grid-cols-[120px,1fr] gap-6 items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">个人头像</span>
                    <div className="flex items-center gap-5">
                      <div className="relative group cursor-pointer w-20 h-20 rounded-full border border-slate-200 shadow-sm bg-slate-50 flex items-center justify-center overflow-hidden">
                        {profile.avatarUrl ? (
                          <img
                            src={profile.avatarUrl}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <User className="w-8 h-8 text-[#8b5cf6]" />
                        )}
                        <button
                          onClick={triggerUpload}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          title="修改头像"
                        >
                          <Camera className="w-5 h-5 text-white" />
                        </button>
                      </div>

                      <div className="space-y-1.5 text-left">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleAvatarChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          onClick={triggerUpload}
                          className="px-4 py-1.5 bg-[#8b5cf6] text-white hover:bg-[#7c3aed] text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          上传新头像
                        </button>
                        <p className="text-[11px] text-slate-400">支持 JPG, PNG, WEBP. 最大不超过 5MB.</p>
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Input Fields Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">账户名</label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full border border-slate-100 rounded-lg px-3.5 py-2 text-sm text-slate-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#8b5cf6]/20 focus:border-[#8b5cf6] transition-all outline-none"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">用户ID (不可更改)</label>
                      <input
                        type="text"
                        value={profile.userId}
                        disabled
                        className="w-full border border-slate-100 rounded-lg px-3.5 py-2 text-sm text-slate-400 bg-slate-100/60 cursor-not-allowed outline-none"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">首选语言</label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full border border-slate-100 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:ring-2 focus:ring-[#8b5cf6]/20 focus:border-[#8b5cf6] transition-all outline-none"
                      >
                        <option value="简体中文">简体中文</option>
                        <option value="English">English</option>
                        <option value="日本語">日本語</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">电子邮箱</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-slate-100 rounded-lg px-3.5 py-2 text-sm text-slate-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#8b5cf6]/20 focus:border-[#8b5cf6] transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Biography (Bio text area) */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">个人简介</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="描述一下你自己..."
                      maxLength={200}
                      className="w-full border border-slate-100 rounded-lg px-3.5 py-2 text-sm text-slate-700 h-24 resize-none bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#8b5cf6]/20 focus:border-[#8b5cf6] transition-all outline-none"
                    ></textarea>
                    <div className="text-right text-[10px] text-slate-400">{bio.length}/200 字</div>
                  </div>

                  {/* Social links integration (Wechat ID / Github URL) */}
                  <div className="space-y-3.5 text-left">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">社交链接</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                          <Link className="w-4 h-4 text-[#8b5cf6]" />
                        </div>
                        <input
                          type="text"
                          placeholder="WeChat ID"
                          value={wechatId}
                          onChange={(e) => setWechatId(e.target.value)}
                          className="w-full border border-slate-100 rounded-lg px-3.5 py-2 text-sm text-slate-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#8b5cf6]/20 focus:border-[#8b5cf6] transition-all outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                          <Github className="w-4 h-4 text-slate-700" />
                        </div>
                        <input
                          type="text"
                          placeholder="GitHub / Blog URL"
                          value={githubUrl}
                          onChange={(e) => setGithubUrl(e.target.value)}
                          className="w-full border border-slate-100 rounded-lg px-3.5 py-2 text-sm text-slate-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#8b5cf6]/20 focus:border-[#8b5cf6] transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Cancellations buttons with message updates */}
                  <div className="flex justify-end items-center gap-3 border-t border-slate-50 pt-4">
                    {saveStatus === 'saved' && (
                      <span className="text-xs text-green-500 font-bold flex items-center gap-1.5 mr-auto">
                        <CheckCircle className="w-4 h-4" /> 资料更改成功，系统已自动重载更新。
                      </span>
                    )}

                    <button
                      onClick={handleCancel}
                      className="px-5 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-lg transition-all"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saveStatus === 'saving'}
                      className="px-7 py-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold text-xs rounded-lg shadow-sm hover:shadow-md hover:shadow-[#8b5cf6]/20 transition-all flex items-center gap-1.5"
                    >
                      {saveStatus === 'saving' ? '保存中...' : '保存更改'}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: SECURITY SETTINGS */}
              {activeTab === 'safety' && (
                <div className="space-y-6 text-left">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-800 text-xs leading-relaxed max-w-full">
                    <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />
                    <div>
                      <span className="font-bold">提醒：</span> 为了您的企业获客节点不被非法拦截攻击，我们建议开启双重验证（2FA）并定期更换复杂的长密码。
                    </div>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
                    <h3 className="text-sm font-bold text-slate-800">修改登录密码</h3>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">当前旧密码</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="请输入旧密码"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full border border-slate-100 rounded-lg pl-3.5 pr-10 py-2 text-sm text-slate-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#8b5cf6]/20 focus:border-[#8b5cf6] outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">设置新密码</label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="最少6位，需字母+数字"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full border border-slate-100 rounded-lg px-3.5 py-2 text-sm text-slate-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#8b5cf6]/20 focus:border-[#8b5cf6] outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">验证新密码</label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="重复确认新密码"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full border border-slate-100 rounded-lg px-3.5 py-2 text-sm text-slate-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#8b5cf6]/20 focus:border-[#8b5cf6] outline-none transition-all"
                        />
                      </div>
                    </div>

                    {passwordStatusText && (
                      <div className={`text-xs font-bold leading-relaxed ${passwordStatusText.includes('成功') ? 'text-green-600' : 'text-rose-500'}`}>
                        {passwordStatusText}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="px-5 py-2 bg-slate-800 text-white font-bold text-xs rounded-lg hover:bg-slate-900 transition-all shadow-sm"
                    >
                      提交修改密码
                    </button>
                  </form>

                  <hr className="border-slate-100" />

                  {/* Two factor toggle */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">启用双重身份验证 (2FA / Google Auth)</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        启用后，在每次登录时需要额外的动态6位令牌验证，大幅防范撞库攻击。
                      </p>
                    </div>

                    <button
                      onClick={handleToggle2FA}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        security.twoFactorEnabled ? 'bg-[#8b5cf6]' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          security.twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: LOGIN LOG SERVICES */}
              {activeTab === 'logs' && (
                <div className="overflow-x-auto text-left">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-800">详细历史连接登录日志</h3>
                    <span className="text-xs text-slate-400">仅显示最近 15 天的数据</span>
                  </div>

                  <table className="min-w-full divide-y divide-slate-100 text-xs">
                    <thead>
                      <tr className="bg-slate-50/60 rounded">
                        <th className="px-3 py-2 text-slate-500 font-bold uppercase tracking-wider text-left">时间</th>
                        <th className="px-3 py-2 text-slate-500 font-bold uppercase tracking-wider text-left">动作</th>
                        <th className="px-3 py-2 text-slate-500 font-bold uppercase tracking-wider text-left">终端系统</th>
                        <th className="px-3 py-2 text-slate-500 font-bold uppercase tracking-wider text-left">IP 地址</th>
                        <th className="px-3 py-2 text-slate-500 font-bold uppercase tracking-wider text-left">状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {activityLogs.filter(l => l.type === 'login' || l.type === 'system').map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-3 py-2.5 whitespace-nowrap text-slate-500 font-mono font-medium">{log.timestamp}</td>
                          <td className="px-3 py-2.5 font-bold text-slate-700">{log.action}</td>
                          <td className="px-3 py-2.5 text-slate-500 font-medium">{log.detail}</td>
                          <td className="px-3 py-2.5 text-slate-400 font-mono">
                            {log.type === 'login' ? '192.168.1.1' : '127.0.0.1'}
                          </td>
                          <td className="px-3 py-2.5">
                            <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                              安全在线
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Active Devices segment exactly matching bottom of screenshot 1 */}
          <div className="bg-white rounded-2xl border border-slate-100 executive-shadow p-6 text-left">
            <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#8b5cf6]" />
              活跃设备会话
            </h3>

            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border transition-all ${
                    session.isCurrent
                      ? 'bg-violet-50/40 border-violet-100'
                      : 'bg-white border-slate-100 hover:bg-slate-50/40'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 ${
                      session.isCurrent ? 'bg-white border-violet-100 text-[#8b5cf6]' : 'bg-slate-50 border-slate-100 text-slate-500'
                    }`}>
                      {session.device === 'Chrome' ? <AppWindow className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-800">
                          {session.device} / {session.os}
                        </p>
                        {session.isCurrent && (
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                            当前
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        IP: {session.ip} — {session.location}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-0 sm:ml-auto">
                    {session.isCurrent ? (
                      <span className="text-xs text-slate-400 font-bold">本设备</span>
                    ) : (
                      <button
                        onClick={() => onRemoveSession(session.id)}
                        className="text-xs text-rose-500 hover:text-rose-700 font-bold hover:underline py-1 px-2.5 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        登出
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Column (Security Progress & Timeline logs) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Security Center Radial Arc circular Dial */}
          <section className="bg-white border border-slate-100 rounded-2xl p-6 executive-shadow text-center relative group overflow-hidden">
            <h3 className="text-base font-bold text-slate-800 mb-4 text-left">安全中心</h3>

            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    fill="transparent"
                    r="54"
                    stroke="#f1f5f9"
                    strokeWidth="8"
                  ></circle>
                  <circle
                    cx="64"
                    cy="64"
                    fill="transparent"
                    r="54"
                    stroke="#8b5cf6"
                    strokeDasharray="339.29"
                    strokeDashoffset={339.29 - (339.29 * security.securityScore) / 100}
                    strokeLinecap="round"
                    strokeWidth="8"
                    className="transition-all duration-700"
                  ></circle>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-display font-extrabold text-slate-800">{security.securityScore}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">安全分</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                您的账户安全处于{' '}
                <span className={`font-bold ${security.securityScore >= 90 ? 'text-emerald-500' : 'text-[#8b5cf6]'}`}>
                  {security.securityScore >= 90 ? '卓越水平' : '中等水平'}
                </span>
              </p>

              <div className="space-y-2 text-left">
                <button
                  onClick={handleToggle2FA}
                  className={`w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs flex items-center justify-between px-4 transition-all border border-slate-100 focus:outline-none ${
                    security.twoFactorEnabled ? 'border-emerald-100 bg-emerald-50/20 text-emerald-800 font-bold' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle className={`w-4 h-4 ${security.twoFactorEnabled ? 'text-emerald-500' : 'text-slate-300'}`} />
                    启用双重身份验证
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => setIsBackupEmailModalOpen(true)}
                  className={`w-full py-2 text-xs flex items-center justify-between px-4 transition-all rounded-xl focus:outline-none ${
                    security.backupEmailUpdated
                      ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-100'
                      : 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100/50 font-bold'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {security.backupEmailUpdated ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                    )}
                    {security.backupEmailUpdated ? '备用邮箱已绑定' : '更新备用邮箱'}
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 ${security.backupEmailUpdated ? 'text-slate-400' : 'text-rose-400'}`} />
                </button>
              </div>
            </div>
          </section>

          {/* Activity Timeline section matching upper-right of screenshot 1 */}
          <section className="bg-white border border-slate-100 rounded-2xl p-6 executive-shadow text-left">
            <h3 className="text-base font-bold text-slate-800 mb-6">近期活动</h3>

            <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              {activityLogs.slice(0, 3).map((log, index) => (
                <div key={log.id} className="relative pl-8">
                  <div className="absolute left-0 top-1 w-6 h-6 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center z-10">
                    <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-[#8b5cf6]' : 'bg-slate-300'}`}></div>
                  </div>
                  <p className="text-xs font-bold text-slate-800">{log.action}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {log.timestamp} • {log.detail}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('logs')}
              className="w-full mt-6 py-2 bg-slate-50 hover:bg-slate-100 hover:text-[#7c3aed] text-[#8b5cf6] font-bold text-xs rounded-xl shadow-sm transition-all text-center block focus:outline-none"
            >
              查看完整日志
            </button>
          </section>

          {/* Credits footer matching right column of Image 1 */}
          <footer className="text-center py-4">
            <p className="text-slate-400 text-xs">2026 © 辛云-企业获客 | v2.4.0</p>
            <div className="flex justify-center gap-4 mt-2">
              <a href="#" className="text-[11px] text-slate-400 hover:text-[#8b5cf6] transition-colors">
                服务条款
              </a>
              <a href="#" className="text-[11px] text-slate-400 hover:text-[#8b5cf6] transition-colors">
                隐私政策
              </a>
            </div>
          </footer>
        </div>
      </div>

      {/* Backup Email Setup Modal */}
      {isBackupEmailModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 max-w-sm w-full p-6 text-left shadow-lg">
            <h3 className="text-base font-bold text-slate-800">绑定或更新备用邮箱</h3>
            <p className="text-xs text-slate-500 mt-1">
              当您的主邮箱锁定时，此备用邮箱将接收二次解冻验证秘钥。
            </p>

            <form onSubmit={handleSaveBackupEmail} className="mt-4 space-y-4">
              <input
                type="email"
                required
                placeholder="请输入备用电子邮箱"
                value={backupEmailInput}
                onChange={(e) => setBackupEmailInput(e.target.value)}
                className="w-full border border-slate-100 rounded-lg px-3.5 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#8b5cf6]/25 focus:border-[#8b5cf6]"
              />

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBackupEmailModalOpen(false)}
                  className="px-4 py-1.5 border border-slate-100 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg text-xs font-bold"
                >
                  绑定备用邮箱
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
