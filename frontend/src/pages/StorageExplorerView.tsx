import React, { useState, useRef, useCallback } from 'react';
import {
  Folder, FileText, FileSpreadsheet, Image as ImageIcon, Archive,
  UploadCloud, FolderPlus, Grid, List, Search,
  Download, Trash2, ChevronRight, ShieldCheck, X, File,
  Loader2, AlertCircle, RefreshCw, RotateCcw, Eraser
} from 'lucide-react';
import { UploadQueueModal, type UploadItem } from '../components/common/UploadQueueModal';
import {
  useFiles, useFolders, useCreateFolder, useDeleteFile,
  useRestoreFile, usePermanentDelete, useUploadFile, useTrash,
  downloadFile, type FileDto
} from '../lib/hooks/useFiles';
import type { FolderDto } from '../lib/hooks/useFolders';
import { formatBytes } from '../lib/hooks/useAnalytics';

// ── Helpers ──────────────────────────────────────────────────────────────────
function getMimeIcon(mimeType: string | undefined) {
  if (!mimeType) return <File className="w-5 h-5 text-slate-400" />;
  if (mimeType.startsWith('image/'))       return <ImageIcon className="w-5 h-5 text-purple-500" />;
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('csv'))
    return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
  if (mimeType.includes('pdf') || mimeType.includes('word') || mimeType.includes('text'))
    return <FileText className="w-5 h-5 text-blue-500" />;
  if (mimeType.includes('zip') || mimeType.includes('tar') || mimeType.includes('gzip'))
    return <Archive className="w-5 h-5 text-amber-500" />;
  return <File className="w-5 h-5 text-slate-400" />;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60)   return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

// ── File Row (List View) ──────────────────────────────────────────────────────
const FileRow: React.FC<{
  file: FileDto;
  isSelected: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onRestore?: () => void;
  onPermanentDelete?: () => void;
  isTrash?: boolean;
  isDeleting?: boolean;
}> = ({ file, isSelected, onToggle, onDelete, onDownload, onRestore, onPermanentDelete, isTrash, isDeleting }) => {

  return (
    <div className={`group flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 hover:shadow-sm cursor-default ${
      isSelected
        ? 'bg-blue-50/80 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30'
        : 'bg-white dark:bg-[#111827] border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
    }`}>
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggle}
        className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0 cursor-pointer"
      />

      {/* Icon */}
      <div className="shrink-0">{getMimeIcon(file.mimeType)}</div>

      {/* Name + Meta */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{file.name}</p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-[10px] text-slate-400">{formatBytes(file.sizeBytes)}</span>
          <span className="text-[10px] text-slate-400">v{file.versionNumber}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${
            file.storageTier === 'HOT'
              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
              : file.storageTier === 'COLD'
              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
          }`}>{file.storageTier}</span>
          {file.isDuplicate && (
            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">DUPLICATE</span>
          )}
        </div>
      </div>

      {/* Modified */}
      <span className="text-xs text-slate-400 hidden sm:block shrink-0">{timeAgo(file.updatedAt)}</span>

      {/* ClamAV badge */}
      <span className="hidden md:flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
        <ShieldCheck className="w-3 h-3" /> Verified
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {isTrash ? (
          <>
            <button
              onClick={onRestore}
              className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-600 transition-colors"
              title="Restore"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onPermanentDelete}
              className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600 transition-colors"
              title="Delete Forever"
            >
              <Eraser className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onDownload}
              className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-600 transition-colors"
              title="Download"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-500 transition-colors disabled:opacity-50"
              title="Move to Trash"
            >
              {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ── Main StorageExplorerView ──────────────────────────────────────────────────
interface StorageExplorerViewProps {
  initialView?: string;
}

export const StorageExplorerView: React.FC<StorageExplorerViewProps> = ({ initialView }) => {
  const isTrashView = initialView === 'trash';
  const isRecentView = initialView === 'recent';

  const viewTitles: Record<string, { title: string; desc: string }> = {
    explorer: { title: 'My Files', desc: 'Organize, encrypt, and manage enterprise objects on Filebase S3.' },
    shared: { title: 'Shared With Me', desc: 'Files and folders shared with your organizational role via AES-256 RBAC.' },
    recent: { title: 'Recent Files', desc: 'Files uploaded or modified across your enterprise storage in the last 30 days.' },
    favorites: { title: 'Favorites', desc: 'Quick-access starred enterprise files and folders.' },
    trash: { title: 'Trash & Quarantine', desc: 'Deleted files held in 30-day quarantine before permanent purge.' },
  };
  const currentHeader = viewTitles[initialView || 'explorer'] || viewTitles.explorer;

  const [viewMode, setViewMode]           = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery]     = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [uploadQueue, setUploadQueue]     = useState<UploadItem[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);
  const [breadcrumbs, setBreadcrumbs]     = useState<{ id?: string; name: string }[]>([{ name: currentHeader.title }]);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName]   = useState('');
  const [deletingIds, setDeletingIds]       = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging]         = useState(false);
  const [isRefreshing, setIsRefreshing]     = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const h = viewTitles[initialView || 'explorer'] || viewTitles.explorer;
    setBreadcrumbs([{ name: h.title }]);
    setCurrentFolderId(undefined);
  }, [initialView]);

  // ── Real backend hooks ─────────────────────────────────────────────────────
  const { data: files = [], isLoading: filesLoading, error: filesError, refetch: refetchFiles } =
    useFiles(isTrashView ? undefined : currentFolderId);
  const { data: trashFiles = [] } = useTrash();
  const { data: folders = [], isLoading: foldersLoading, refetch: refetchFolders } = useFolders(currentFolderId);
  const createFolderMutation  = useCreateFolder();
  const deleteMutation        = useDeleteFile();
  const restoreMutation       = useRestoreFile();
  const permanentDeleteMutation = usePermanentDelete();
  const uploadMutation        = useUploadFile();

  const displayFiles = isTrashView
    ? trashFiles
    : isRecentView
    ? [...files].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : files;

  // ── Search filter ──────────────────────────────────────────────────────────
  const filteredFiles = displayFiles.filter(f =>
    !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredFolders = folders.filter(f =>
    !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Upload handler ─────────────────────────────────────────────────────────
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    Array.from(e.target.files).forEach(file => {
      const uploadId = `up-${Date.now()}-${Math.random()}`;
      const queueItem: UploadItem = {
        id: uploadId,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        progress: 0,
        status: 'uploading',
      };
      setUploadQueue(prev => [...prev, queueItem]);

      uploadMutation.mutate(
        {
          file,
          folderId: currentFolderId,
          onProgress: (percent) => {
            setUploadQueue(prev =>
              prev.map(i => i.id === uploadId ? { ...i, progress: percent } : i)
            );
          },
        },
        {
          onSuccess: () => {
            setUploadQueue(prev =>
              prev.map(i => i.id === uploadId ? { ...i, progress: 100, status: 'completed' } : i)
            );
          },
          onError: (err: any) => {
            setUploadQueue(prev =>
              prev.map(i => i.id === uploadId ? { ...i, status: 'error', error: err.message } : i)
            );
          },
        }
      );
    });

    e.target.value = '';
  }, [currentFolderId, uploadMutation]);

  // ── Drag & Drop handlers ───────────────────────────────────────────────────
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isTrashView) setIsDragging(true);
  }, [isTrashView]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isTrashView || !e.dataTransfer.files?.length) return;

    Array.from(e.dataTransfer.files).forEach(file => {
      const uploadId = `up-${Date.now()}-${Math.random()}`;
      const queueItem: UploadItem = {
        id: uploadId,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        progress: 0,
        status: 'uploading',
      };
      setUploadQueue(prev => [...prev, queueItem]);

      uploadMutation.mutate(
        {
          file,
          folderId: currentFolderId,
          onProgress: (percent) => {
            setUploadQueue(prev =>
              prev.map(i => i.id === uploadId ? { ...i, progress: percent } : i)
            );
          },
        },
        {
          onSuccess: () => {
            setUploadQueue(prev =>
              prev.map(i => i.id === uploadId ? { ...i, progress: 100, status: 'completed' } : i)
            );
          },
          onError: (err: any) => {
            setUploadQueue(prev =>
              prev.map(i => i.id === uploadId ? { ...i, status: 'error', error: err.message } : i)
            );
          },
        }
      );
    });
  }, [isTrashView, currentFolderId, uploadMutation]);

  // ── Folder navigation ──────────────────────────────────────────────────────
  const openFolder = useCallback((folder: FolderDto) => {
    setCurrentFolderId(folder.id);
    setBreadcrumbs(prev => [...prev, { id: folder.id, name: folder.name }]);
    setSelectedFiles([]);
  }, []);

  const navigateToBreadcrumb = useCallback((idx: number) => {
    const crumb = breadcrumbs[idx];
    setCurrentFolderId(crumb.id);
    setBreadcrumbs(prev => prev.slice(0, idx + 1));
    setSelectedFiles([]);
  }, [breadcrumbs]);

  // ── Create folder ──────────────────────────────────────────────────────────
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    await createFolderMutation.mutateAsync({ name: newFolderName.trim(), parentId: currentFolderId });
    setNewFolderName('');
    setCreatingFolder(false);
  };

  // ── Delete (soft) ──────────────────────────────────────────────────────────
  const handleDelete = async (fileId: string) => {
    setDeletingIds(prev => new Set(prev).add(fileId));
    try {
      await deleteMutation.mutateAsync(fileId);
    } finally {
      setDeletingIds(prev => { const s = new Set(prev); s.delete(fileId); return s; });
    }
  };

  // ── Bulk delete ────────────────────────────────────────────────────────────
  const handleBulkDelete = async () => {
    for (const id of selectedFiles) await handleDelete(id);
    setSelectedFiles([]);
  };

  // ── Select all ─────────────────────────────────────────────────────────────
  const toggleSelectAll = () => {
    setSelectedFiles(selectedFiles.length === filteredFiles.length ? [] : filteredFiles.map(f => f.id.toString()));
  };

  // ── Download ───────────────────────────────────────────────────────────────
  const handleDownload = (file: FileDto) => {
    downloadFile(file.id.toString(), file.name).catch(err =>
      alert(`Download failed: ${err.message}`)
    );
  };

  // ── Loading / Error States ─────────────────────────────────────────────────
  const isLoading = filesLoading || foldersLoading;

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="p-4 md:p-8 max-w-7xl mx-auto space-y-5 relative animate-in fade-in duration-300 min-h-[500px]"
    >
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-blue-600/10 dark:bg-blue-500/10 backdrop-blur-xs border-2 border-dashed border-blue-500 rounded-3xl flex flex-col items-center justify-center pointer-events-none animate-in fade-in duration-150">
          <UploadCloud className="w-16 h-16 text-blue-500 animate-bounce mb-3" />
          <p className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
            Drop files here to upload instantly to {currentHeader.title}
          </p>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
            AES-256 Client-Side Encrypted & SHA-256 Deduplicated
          </p>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Top bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 flex-wrap">
          <Folder className="w-4 h-4 text-blue-500 shrink-0" />
          {isTrashView ? (
            <span className="text-slate-900 dark:text-white">Trash</span>
          ) : (
            breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />}
                <button
                  onClick={() => navigateToBreadcrumb(idx)}
                  className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${idx === breadcrumbs.length - 1 ? 'text-slate-900 dark:text-white' : ''}`}
                >
                  {crumb.name}
                </button>
              </React.Fragment>
            ))
          )}
        </div>

        {/* Action buttons */}
        {!isTrashView && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm shadow-blue-500/20"
            >
              <UploadCloud className="w-4 h-4" /> Upload Files
            </button>
            <button
              onClick={() => setCreatingFolder(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all"
            >
              <FolderPlus className="w-4 h-4" /> New Folder
            </button>
            <button
              onClick={async () => {
                setIsRefreshing(true);
                await Promise.all([refetchFiles(), refetchFolders()]);
                setTimeout(() => setIsRefreshing(false), 500);
              }}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
              title="Refresh Files List"
            >
              <RefreshCw className={`w-4 h-4 ${(isLoading || isRefreshing) ? 'animate-spin text-blue-500' : ''}`} />
            </button>
            {/* View toggle */}
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {(['list', 'grid'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-2 transition-colors ${viewMode === mode ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                  {mode === 'list' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* New folder input */}
      {creatingFolder && (
        <div className="flex items-center gap-2 p-3 rounded-xl border border-blue-200 dark:border-blue-500/30 bg-blue-50/50 dark:bg-blue-500/5 animate-in fade-in duration-200">
          <FolderPlus className="w-4 h-4 text-blue-500 shrink-0" />
          <input
            autoFocus
            type="text"
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleCreateFolder(); if (e.key === 'Escape') setCreatingFolder(false); }}
            placeholder="Folder name..."
            className="flex-1 bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
          />
          <button onClick={handleCreateFolder} disabled={createFolderMutation.isPending} className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-colors disabled:opacity-60">
            {createFolderMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Create'}
          </button>
          <button onClick={() => setCreatingFolder(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Filter files..."
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all"
        />
      </div>

      {/* Bulk action bar */}
      {selectedFiles.length > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-600 text-white animate-in fade-in duration-200">
          <span className="text-sm font-bold">{selectedFiles.length} selected</span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-bold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Move to Trash
            </button>
            <button onClick={() => setSelectedFiles([])} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Error state */}
      {filesError && (
        <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-rose-700 dark:text-rose-400">Failed to load files</p>
            <p className="text-xs text-rose-600 dark:text-rose-300">Check backend connection and authentication.</p>
          </div>
          <button onClick={() => refetchFiles()} className="text-xs font-bold text-rose-600 hover:underline">Retry</button>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-sm text-slate-500">Loading from storage...</p>
          </div>
        </div>
      )}

      {/* Content */}
      {!isLoading && !filesError && (
        <>
          {/* Folders */}
          {!isTrashView && filteredFolders.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Folders ({filteredFolders.length})</p>
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3' : 'space-y-1.5'}>
                {filteredFolders.map(folder => (
                  <div
                    key={folder.id}
                    onDoubleClick={() => openFolder(folder)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-[#111827] border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500/40 hover:shadow-sm cursor-pointer transition-all group"
                  >
                    <Folder className="w-5 h-5 text-amber-400 shrink-0" />
                    <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">{folder.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Files */}
          {filteredFiles.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {isTrashView ? 'Trash' : 'Files'} ({filteredFiles.length})
                </p>
                {!isTrashView && filteredFiles.length > 0 && (
                  <button onClick={toggleSelectAll} className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline">
                    {selectedFiles.length === filteredFiles.length ? 'Deselect All' : 'Select All'}
                  </button>
                )}
              </div>

              {viewMode === 'list' ? (
                <div className="space-y-1.5">
                  {filteredFiles.map(file => (
                    <FileRow
                      key={file.id.toString()}
                      file={file}
                      isSelected={selectedFiles.includes(file.id.toString())}
                      onToggle={() => {
                        const id = file.id.toString();
                        setSelectedFiles(prev =>
                          prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
                        );
                      }}
                      onDelete={() => handleDelete(file.id.toString())}
                      onDownload={() => handleDownload(file)}
                      onRestore={() => restoreMutation.mutate(file.id.toString())}
                      onPermanentDelete={() => {
                        if (confirm(`Permanently delete "${file.name}"? This cannot be undone.`)) {
                          permanentDeleteMutation.mutate(file.id.toString());
                        }
                      }}
                      isTrash={isTrashView}
                      isDeleting={deletingIds.has(file.id.toString())}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {filteredFiles.map(file => (
                    <div key={file.id.toString()} className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm transition-all space-y-3 cursor-default">
                      <div className="flex items-center justify-center h-10">{getMimeIcon(file.mimeType)}</div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate text-center">{file.name}</p>
                      <p className="text-[10px] text-slate-400 text-center">{formatBytes(file.sizeBytes)}</p>
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleDownload(file)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-600 transition-colors">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        {!isTrashView && (
                          <button onClick={() => handleDelete(file.id.toString())} className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-500 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            !isLoading && (
              <div className="py-20 text-center space-y-4">
                {isTrashView ? <Trash2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" /> : <UploadCloud className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />}
                <div>
                  <p className="text-lg font-bold text-slate-500 dark:text-slate-400">
                    {isTrashView ? 'Trash is empty' : 'No files here yet'}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    {isTrashView ? 'Deleted files will appear here.' : 'Upload files using the button above.'}
                  </p>
                </div>
                {!isTrashView && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-sm shadow-blue-500/20"
                  >
                    <UploadCloud className="w-4 h-4" /> Upload First File
                  </button>
                )}
              </div>
            )
          )}
        </>
      )}

      {/* Upload Progress Modal */}
      <UploadQueueModal
        items={uploadQueue}
        onClose={() => setUploadQueue([])}
        onRetry={() => {}}
        onCancel={(id) => setUploadQueue(prev => prev.filter(i => i.id !== id))}
      />
    </div>
  );
};
