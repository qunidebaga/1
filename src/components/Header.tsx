/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sun, Moon, RotateCcw, User, LogOut, Check } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  profile: UserProfile;
  completionRate: number;
  onRefresh: () => void;
  onLogout: () => void;
  openProfileTab: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function Header({
  profile,
  completionRate,
  onRefresh,
  onLogout,
  openProfileTab,
  darkMode,
  setDarkMode
}: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex justify-between items-center px-6 sticky top-0 z-40">
      {/* Action buttons (Theme Toggle & Fresh Refresh) */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 hover:bg-slate-50 rounded-full text-slate-500 hover:text-[#8b5cf6] transition-colors"
          title={darkMode ? "切换到亮色模式" : "切换到深色模式"}
        >
          {darkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
        </button>
        <button
          onClick={onRefresh}
          className="p-2 hover:bg-slate-50 rounded-full text-slate-500 hover:text-[#8b5cf6] transition-colors"
          title="重载数据"
        >
          <RotateCcw className="w-[18px] h-[18px]" />
        </button>
      </div>

      {/* Profile Completion Indicator (Changes Dynamically as Fields Are Edited) */}
      <div className="hidden md:flex items-center gap-4 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
        <span className="text-xs font-bold text-slate-600">资料完善度 {completionRate}%</span>
        <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>

      {/* User Session Profile Corner */}
      <div className="flex items-center gap-4 relative">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-slate-800">{profile.username}</p>
          <p className="text-[11px] text-slate-400">ID: {profile.userId}</p>
        </div>

        {/* Profile Interactive Dropdown avatar */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center relative border border-slate-200 cursor-pointer hover:ring-2 hover:ring-[#8b5cf6]/30 transition-all focus:outline-none"
          >
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <User className="w-5 h-5 text-[#8b5cf6]" />
            )}
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
          </button>

          {showDropdown && (
            <>
              {/* Overlay Backdrop to Close Dropdown */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              ></div>

              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-50 py-1.5 animate-fadeIn">
                <div className="px-4 py-2 border-b border-slate-50">
                  <p className="text-xs text-slate-400">登入为</p>
                  <p className="text-sm font-semibold text-slate-800 truncate">{profile.username}</p>
                  <p className="text-[11px] text-slate-400 truncate">{profile.email}</p>
                </div>

                <button
                  onClick={() => {
                    openProfileTab();
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#8b5cf6] transition-colors text-left"
                >
                  <User className="w-4 h-4" />
                  <span>管理个人资料</span>
                </button>

                <button
                  onClick={() => {
                    onLogout();
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left border-t border-slate-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>退出当前账户</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
