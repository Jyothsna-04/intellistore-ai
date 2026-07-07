import React, { useState } from 'react';
import { 
  Folder, 
  FileText, 
  FileSpreadsheet, 
  Image as ImageIcon, 
  Archive, 
  MoreVertical, 
  UploadCloud, 
  FolderPlus, 
  Grid, 
  List, 
  Search, 
  Star, 
  Share2, 
  Download, 
  Trash2, 
  Eye, 
  Tag, 
  ChevronRight, 
  ShieldCheck,
  X,
  File
} from 'lucide-react';
import { UploadQueueModal, type UploadItem } from '../components/common/UploadQueueModal';

export const StorageExplorerView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<any | null>(null);

  const breadcrumbs = [
    { id: 'root', name: 'My Files' },
    { id: 'dept', name: 'Finance & Accounts' },
    { id: 'sub', name: '2026 Q3 Audit Reports' }
  ];

  const files = [
    {
      id: 'f-101',
      name: 'Q3_Financial_Balance_Sheet_Final.xlsx',
      type: 'spreadsheet',
      size: '14.2 MB',
      tier: 'Hot NVMe',
      tierColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      owner: 'Jyothis Admin',
      modified: '2 hours ago',
      isFavorite: true,
      tags: ['Confidential', 'Audit 2026', 'Finance'],
      clamAv: 'Clean (SHA-256 Verified)'
    },
    {
      id: 'f-102',
      name: 'Executive_AI_Strategy_Presentation.pdf',
      type: 'document',
      size: '8.4 MB',
      tier: 'Cool Pool',
      tierColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      owner: 'Sarah Jenkins (VP)',
      modified: 'Yesterday',
      isFavorite: true,
      tags: ['Board Deck', 'AI Strategy'],
      clamAv: 'Clean (SHA-256 Verified)'
    },
    {
      id: 'f-103',
      name: 'Enterprise_Architecture_Topology_Diagram.png',
      type: 'image',
      size: '4.1 MB',
      tier: 'Hot NVMe',
      tierColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      owner: 'DevOps Lead',
      modified: '3 days ago',
      isFavorite: false,
      tags: ['Infrastructure', 'AWS Qdrant'],
      clamAv: 'Clean (SHA-256 Verified)'
    },
    {
      id: 'f-104',
      name: 'Historical_Server_Access_Logs_2025.zip',
      type: 'archive',
      size: '1.42 GB',
      tier: 'Deep Archive',
      tierColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      owner: 'System Security',
      modified: '1 week ago',
      isFavorite: false,
      tags: ['Cold Storage', 'Compliance 7-Yr'],
      clamAv: 'Clean (SHA-256 Verified)'
    },
    {
      id: 'f-105',
      name: 'Employee_Payroll_Tax_Filing_Q2.docx',
      type: 'document',
      size: '2.8 MB',
      tier: 'Cool Pool',
      tierColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      owner: 'HR Operations',
      modified: '2 weeks ago',
      isFavorite: false,
      tags: ['HR', 'Tax Records'],
      clamAv: 'Clean (SHA-256 Verified)'
    }
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'spreadsheet': return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
      case 'document': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'image': return <ImageIcon className="w-5 h-5 text-purple-500" />;
      case 'archive': return <Archive className="w-5 h-5 text-amber-500" />;
      default: return <File className="w-5 h-5 text-slate-400" />;
    }
  };

  const filteredFiles = files.filter(f => {
    if (selectedCategory !== 'all' && f.type !== selectedCategory) return false;
    if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: `up-${Date.now()}-${Math.random()}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        progress: 10,
        status: 'uploading' as const
      }));

      setUploadQueue(prev => [...prev, ...newFiles]);

      // Simulate upload progress
      newFiles.forEach(item => {
        let currentProgress = 10;
        const interval = setInterval(() => {
          currentProgress += 25;
          if (currentProgress >= 100) {
            clearInterval(interval);
            setUploadQueue(prev => 
              prev.map(i => i.id === item.id ? { ...i, progress: 100, status: 'completed' } : i)
            );
          } else {
            setUploadQueue(prev => 
              prev.map(i => i.id === item.id ? { ...i, progress: currentProgress } : i)
            );
          }
        }, 600);
      });
    }
  };

  const toggleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map(f => f.id));
    }
  };

  const toggleSelectFile = (id: string) => {
    if (selectedFiles.includes(id)) {
      setSelectedFiles(selectedFiles.filter(i => i !== id));
    } else {
      setSelectedFiles([...selectedFiles, id]);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Action Bar & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Breadcrumb Navigation - Google Drive style */}
        <div className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 flex-wrap">
          <Folder className="w-4 h-4 text-blue-500 shrink-0" />
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.id}>
              <span 
                className={`hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors ${idx === breadcrumbs.length - 1 ? 'text-slate-900 dark:text-white font-extrabold' : ''}`}
              >
                {crumb.name}
              </span>
              {idx < breadcrumbs.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
            </React.Fragment>
          ))}
        </div>

        {/* Action Buttons: New Folder & Upload */}
        <div className="flex items-center gap-3 shrink-0">
          <button className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center gap-2 border border-slate-200 dark:border-slate-700">
            <FolderPlus className="w-4 h-4 text-blue-500" />
            New Folder
          </button>
          
          <label className="btn-primary text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer">
            <UploadCloud className="w-4 h-4" />
            <span>Upload Files</span>
            <input 
              type="file" 
              multiple 
              className="hidden" 
              onChange={handleFileUpload} 
            />
          </label>
        </div>
      </div>

      {/* Drag & Drop Upload Zone / Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filters & Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Files' },
            { id: 'document', label: 'Documents' },
            { id: 'spreadsheet', label: 'Spreadsheets' },
            { id: 'image', label: 'Images' },
            { id: 'archive', label: 'Archives' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === cat.id ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* View mode toggle & search */}
        <div className="flex items-center gap-3 justify-end">
          <div className="relative w-48 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter current folder..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs' : 'text-slate-400 hover:text-slate-600'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs' : 'text-slate-400 hover:text-slate-600'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk actions banner if files selected */}
      {selectedFiles.length > 0 && (
        <div className="p-3 rounded-xl bg-blue-600 text-white flex items-center justify-between text-xs font-semibold shadow-md animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 px-2 py-0.5 rounded-md font-bold">{selectedFiles.length} selected</span>
            <span>Choose bulk enterprise action:</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1">
              <Download className="w-3.5 h-3.5" /> Download
            </button>
            <button className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1">
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
            <button className="px-2.5 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 transition-colors flex items-center gap-1">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
            <button 
              onClick={() => setSelectedFiles([])}
              className="p-1 hover:bg-white/20 rounded ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* File Explorer Content */}
      {viewMode === 'list' ? (
        /* LIST VIEW */
        <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/60 dark:bg-slate-900/40">
                <th className="py-3 px-4 w-10">
                  <input 
                    type="checkbox" 
                    checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4 hidden md:table-cell">Storage Tier</th>
                <th className="py-3 px-4 hidden lg:table-cell">Tags</th>
                <th className="py-3 px-4 hidden sm:table-cell">Size</th>
                <th className="py-3 px-4 hidden xl:table-cell">Security & ClamAV</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredFiles.map((file) => {
                const isSelected = selectedFiles.includes(file.id);
                return (
                  <tr 
                    key={file.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group ${isSelected ? 'bg-blue-50/60 dark:bg-blue-900/10' : ''}`}
                  >
                    <td className="py-3.5 px-4">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => toggleSelectFile(file.id)}
                        className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {getIcon(file.type)}
                        <div>
                          <p 
                            onClick={() => setPreviewFile(file)}
                            className="font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                          >
                            {file.name}
                          </p>
                          <p className="text-[10px] text-slate-400 sm:hidden">{file.size} • {file.modified}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${file.tierColor}`}>
                        {file.tier}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {file.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-[10px] flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5 text-slate-400" /> {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 hidden sm:table-cell font-semibold text-slate-700 dark:text-slate-300">
                      {file.size}
                    </td>
                    <td className="py-3.5 px-4 hidden xl:table-cell">
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {file.clamAv}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => setPreviewFile(file)}
                          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors"
                          title="Preview file"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors" title="Favorite">
                          <Star className={`w-4 h-4 ${file.isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors" title="Download">
                          <Download className="w-4 h-4" />
                        </button>
                        <div className="relative">
                          <button 
                            onClick={() => setActiveMenuId(activeMenuId === file.id ? null : file.id)}
                            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {activeMenuId === file.id && (
                            <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1.5 z-50 text-left animate-in fade-in duration-100">
                              <button onClick={() => setPreviewFile(file)} className="w-full px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Eye className="w-3.5 h-3.5 text-slate-400" /> Preview
                              </button>
                              <button className="w-full px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Share2 className="w-3.5 h-3.5 text-slate-400" /> Share Link
                              </button>
                              <button className="w-full px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Download className="w-3.5 h-3.5 text-slate-400" /> Download
                              </button>
                              <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                              <button className="w-full px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center gap-2">
                                <Trash2 className="w-3.5 h-3.5 text-rose-500" /> Move to Trash
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFiles.map((file) => (
            <div 
              key={file.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between space-y-4 relative"
            >
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  {getIcon(file.type)}
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${file.tierColor}`}>
                  {file.tier}
                </span>
              </div>

              <div>
                <p 
                  onClick={() => setPreviewFile(file)}
                  className="font-bold text-xs text-slate-900 dark:text-white truncate hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                  title={file.name}
                >
                  {file.name}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{file.size} • {file.modified}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" /> ClamAV Clean
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPreviewFile(file)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                {getIcon(previewFile.type)}
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{previewFile.name}</h3>
                  <p className="text-xs text-slate-400">{previewFile.size} • {previewFile.tier}</p>
                </div>
              </div>
              <button onClick={() => setPreviewFile(null)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 text-center space-y-3">
              {getIcon(previewFile.type)}
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Previewing Blob Payload</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                This file is securely encrypted with AES-256-GCM and indexed in Qdrant Vector Database for semantic search.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                {previewFile.clamAv}
              </span>
              <div className="flex items-center gap-3">
                <button onClick={() => setPreviewFile(null)} className="btn-secondary text-xs">Close</button>
                <button className="btn-primary text-xs flex items-center gap-2">
                  <Download className="w-3.5 h-3.5" /> Download File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Queue Modal Component */}
      <UploadQueueModal 
        items={uploadQueue}
        onClose={() => setUploadQueue([])}
        onRetry={() => {}}
        onCancel={(id) => setUploadQueue(prev => prev.filter(i => i.id !== id))}
      />
    </div>
  );
};
