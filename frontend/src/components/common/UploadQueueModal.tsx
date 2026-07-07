import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, RefreshCw, UploadCloud, File, Minimize2, Maximize2 } from 'lucide-react';

export interface UploadItem {
  id: string;
  name: string;
  size: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  errorMessage?: string;
}

interface UploadQueueModalProps {
  items: UploadItem[];
  onClose: () => void;
  onRetry: (id: string) => void;
  onCancel: (id: string) => void;
}

export const UploadQueueModal: React.FC<UploadQueueModalProps> = ({
  items,
  onClose,
  onRetry,
  onCancel,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  if (items.length === 0) return null;

  const completedCount = items.filter((i) => i.status === 'completed').length;
  const uploadingCount = items.filter((i) => i.status === 'uploading').length;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 md:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-blue-400 animate-bounce" />
          <span>
            {uploadingCount > 0
              ? `Uploading ${uploadingCount} file${uploadingCount > 1 ? 's' : ''}...`
              : `${completedCount} upload${completedCount > 1 ? 's' : ''} complete`}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-300"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-300"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      {!isMinimized && (
        <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
          {items.map((item) => (
            <div key={item.id} className="p-3 flex items-center justify-between gap-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <File className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-700 dark:text-slate-200 truncate" title={item.name}>
                    {item.name}
                  </p>
                  <p className="text-[10px] text-slate-400">{item.size}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.status === 'uploading' && (
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                    <button
                      onClick={() => onCancel(item.id)}
                      className="text-slate-400 hover:text-rose-500 p-0.5"
                      title="Cancel upload"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {item.status === 'completed' && (
                  <span className="flex items-center gap-1 text-emerald-500 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                )}

                {item.status === 'error' && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-rose-500 flex items-center" title={item.errorMessage || 'Upload failed'}>
                      <AlertCircle className="w-4 h-4" />
                    </span>
                    <button
                      onClick={() => onRetry(item.id)}
                      className="text-slate-400 hover:text-blue-500 p-0.5"
                      title="Retry upload"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
