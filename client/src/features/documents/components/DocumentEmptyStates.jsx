import React from 'react';
import { FileText, UploadCloud, Search, CheckCircle2, FolderPlus } from 'lucide-react';

/**
 * DocumentEmptyStates.jsx
 * Zero-data illustrated placeholders for documents, uploads, searches, and verification queues.
 */

export const NoDocuments = ({ onUpload, onCreateFolder }) => (
  <div className="bg-white dark:bg-[#111111] border border-dashed border-[#c3c6d7] dark:border-gray-800 rounded-2xl p-12 text-center max-w-xl mx-auto my-6 space-y-4 font-sans">
    <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] flex items-center justify-center mx-auto shadow-xs">
      <FileText size={32} />
    </div>
    <div className="space-y-1">
      <h3 className="text-base font-extrabold text-[#191b23] dark:text-white">No Documents in Library</h3>
      <p className="text-xs text-[#737686] max-w-sm mx-auto leading-relaxed">
        Your enterprise repository is empty. Upload employee records, corporate policies, or create folders to begin organizing workforce files.
      </p>
    </div>
    <div className="flex items-center justify-center gap-3 pt-2">
      {onUpload && (
        <button
          onClick={onUpload}
          className="px-4 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
        >
          <UploadCloud size={16} /> Upload Document
        </button>
      )}
      {onCreateFolder && (
        <button
          onClick={onCreateFolder}
          className="px-4 py-2.5 bg-white dark:bg-[#161616] hover:bg-[#faf8ff] text-[#191b23] dark:text-white text-xs font-semibold rounded-xl border border-[#e1e2ed] dark:border-gray-800 flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <FolderPlus size={16} /> Create Folder
        </button>
      )}
    </div>
  </div>
);

export const NoUploads = ({ onUpload }) => (
  <div className="bg-white dark:bg-[#111111] border border-dashed border-[#c3c6d7] dark:border-gray-800 rounded-2xl p-10 text-center max-w-md mx-auto my-4 space-y-3 font-sans">
    <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mx-auto">
      <UploadCloud size={28} />
    </div>
    <h3 className="text-sm font-extrabold text-[#191b23] dark:text-white">No Recent Upload Activity</h3>
    <p className="text-xs text-[#737686]">You haven't uploaded any documents during this session or billing cycle.</p>
    {onUpload && (
      <button
        onClick={onUpload}
        className="px-4 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold rounded-lg shadow-2xs transition-all inline-flex items-center gap-1.5"
      >
        <UploadCloud size={14} /> Start Uploading
      </button>
    )}
  </div>
);

export const NoSearchResults = ({ onReset }) => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-12 text-center max-w-lg mx-auto my-6 space-y-3 font-sans">
    <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 flex items-center justify-center mx-auto">
      <Search size={26} />
    </div>
    <h3 className="text-base font-extrabold text-[#191b23] dark:text-white">No Matching Documents Found</h3>
    <p className="text-xs text-[#737686] max-w-sm mx-auto">
      We couldn't find any documents matching your current keyword search, category filter, or department selection.
    </p>
    {onReset && (
      <button
        onClick={onReset}
        className="px-4 py-2 bg-[#faf8ff] dark:bg-gray-800 hover:bg-[#ededf9] text-[#191b23] dark:text-white text-xs font-semibold rounded-xl border border-[#e1e2ed] dark:border-gray-700 transition-colors shadow-2xs"
      >
        Reset Search &amp; Filters
      </button>
    )}
  </div>
);

export const NoPendingVerification = () => (
  <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-12 text-center max-w-lg mx-auto my-6 space-y-3 font-sans">
    <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
      <CheckCircle2 size={32} />
    </div>
    <h3 className="text-base font-extrabold text-[#191b23] dark:text-white">Verification Queue is Clear</h3>
    <p className="text-xs text-[#737686] max-w-sm mx-auto">
      Great job! All employee submissions and corporate policies have been reviewed and verified by HR and Compliance teams.
    </p>
  </div>
);
