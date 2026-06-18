/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { FolderOpen, FileText, Download, Trash2, Plus, Copy, Check, UploadCloud } from 'lucide-react';
import { AttachmentFile } from '../types';

interface AttachmentsViewProps {
  attachments: AttachmentFile[];
  onAddAttachment: (file: AttachmentFile) => void;
  onDeleteAttachment: (id: string) => void;
}

export default function AttachmentsView({
  attachments,
  onAddAttachment,
  onDeleteAttachment
}: AttachmentsViewProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url === '#' ? 'https://xy-attachments.cn/download/' + id : url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const processFile = (file: File) => {
    const sizeStr = file.size > 1024 * 1024
      ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
      : (file.size / 1024).toFixed(0) + ' KB';

    const newAttach: AttachmentFile = {
      id: 'attach-' + Date.now(),
      name: file.name,
      size: sizeStr,
      type: file.type,
      url: 'https://xy-attachments.cn/download/f_' + Date.now().toString().slice(-4),
      uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    onAddAttachment(newAttach);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const triggerInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">附件管理</h2>
        <p className="text-sm text-slate-500 mt-1">上传、分发和保存营销图片、音频或群发文件，可快速生成云路径链接。</p>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerInput}
        className={`border-2 border-dashed rounded-2xl p-8 hover:bg-violet-50/20 text-center cursor-pointer transition-all ${
          dragging ? 'border-[#8b5cf6] bg-violet-50/30' : 'border-slate-200 bg-white'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center text-[#8b5cf6] mb-2 shadow-sm">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-800">
            拖拽文件到此处，或 <span className="text-[#8b5cf6] hover:underline">点击上传</span>
          </p>
          <p className="text-xs text-slate-400">支持多类型营销文档、图片或电子表格（最大不超过 20MB）</p>
        </div>
      </div>

      {/* Files List Display */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 executive-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-800">云存储空间附件 ({attachments.length})</h3>
        </div>

        <div className="space-y-3.5">
          {attachments.map((file) => (
            <div
              key={file.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/40 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-[#8b5cf6] shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    大小: {file.size} — 上传于: {file.uploadedAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:ml-auto">
                <button
                  onClick={() => handleCopyLink(file.url, file.id)}
                  className="p-2 hover:bg-white border border-slate-100 hover:text-[#8b5cf6] text-slate-500 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  title="复制直链"
                >
                  {copiedId === file.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === file.id ? '已复制' : '复制云直链'}
                </button>

                <button
                  onClick={() => onDeleteAttachment(file.id)}
                  className="p-2 hover:bg-rose-50 border border-slate-100 hover:text-rose-600 text-slate-400 rounded-lg transition-colors"
                  title="物理删除"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {attachments.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-xs">
              暂无附件。请在上方上传需要使用的推广、获客物料。
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
