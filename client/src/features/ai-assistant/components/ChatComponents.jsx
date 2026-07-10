import React, { useState } from 'react';
import { Sparkles, Copy, Check, RefreshCw, ThumbsUp, ThumbsDown, User, Terminal, ShieldCheck, Code } from 'lucide-react';

/**
 * ChatComponents.jsx
 * Conversational UI components for EWMP AI Assistant Workspace.
 * Includes ChatBubble with rich Markdown rendering (Tables, Code Blocks, Lists), TypingIndicator, StreamingPlaceholder, and PromptSuggestionPill.
 */

// Clickable Prompt Suggestion Pill
export const PromptSuggestionPill = ({ label, onClick }) => (
  <button
    onClick={() => onClick && onClick(label)}
    className="px-3.5 py-1.5 bg-white dark:bg-[#161616] hover:bg-[#faf8ff] dark:hover:bg-gray-800 border border-[#e1e2ed] dark:border-gray-800 hover:border-[#2563eb] rounded-full text-xs font-mono text-[#191b23] dark:text-gray-200 hover:text-[#2563eb] transition-all shadow-2xs flex items-center gap-1.5 shrink-0"
  >
    <Sparkles size={13} className="text-[#2563eb]" />
    <span>{label}</span>
  </button>
);

// Animated Typing & Streaming Token Indicator
export const TypingIndicator = () => (
  <div className="flex items-start gap-3 max-w-3xl animate-fade-in my-3">
    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1e3a8a] to-[#2563eb] text-white flex items-center justify-center shrink-0 shadow-xs">
      <Sparkles size={16} className="animate-spin" />
    </div>
    <div className="bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl rounded-tl-none p-4 shadow-xs flex items-center gap-2">
      <span className="text-xs font-mono font-bold text-[#737686]">GEMINI 3.1 PRO IS SYNTHESIZING TELEMETRY</span>
      <div className="flex gap-1">
        <span className="w-2 h-2 rounded-full bg-[#2563eb] animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 rounded-full bg-[#2563eb] animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 rounded-full bg-[#2563eb] animate-bounce" />
      </div>
    </div>
  </div>
);

// Streaming Placeholder Shimmer
export const StreamingPlaceholder = () => (
  <div className="space-y-2.5 max-w-2xl animate-pulse py-2">
    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-3/4" />
    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-full" />
    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-5/6" />
  </div>
);

// Code Block Renderer with Copy Button
export const CodeBlock = ({ language = 'sql', code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-gray-700 bg-[#0f1117] text-gray-200 font-mono text-xs shadow-md">
      <div className="bg-[#191b23] px-4 py-2 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-[#2563eb]" />
          <span className="text-gray-400 font-bold uppercase">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 text-[11px] transition-colors"
        >
          {copied ? (
            <>
              <Check size={13} className="text-emerald-400" /> <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={13} /> <span>Copy Code</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// Rich Table Renderer
export const MarkdownTable = ({ headers = [], rows = [] }) => (
  <div className="my-3 overflow-x-auto rounded-xl border border-[#e1e2ed] dark:border-gray-800 shadow-2xs">
    <table className="w-full text-left text-xs font-sans">
      <thead className="bg-[#faf8ff] dark:bg-[#161616] font-mono font-bold text-[#737686] border-b border-[#e1e2ed] dark:border-gray-800 uppercase">
        <tr>
          {headers.map((h, i) => (
            <th key={i} className="py-2.5 px-4">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-[#f0f1f6] dark:divide-gray-800 bg-white dark:bg-[#111111]">
        {rows.map((row, rIdx) => (
          <tr key={rIdx} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
            {row.map((cell, cIdx) => (
              <td key={cIdx} className="py-2.5 px-4 text-[#191b23] dark:text-gray-200">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Main Chat Bubble Component
export const ChatBubble = ({
  sender = 'AI', // 'AI' | 'USER'
  content,
  timestamp = 'Just now',
  codeSnippet,
  tableData,
  listItems,
  onCopy,
  onRegenerate
}) => {
  const isAI = sender === 'AI';
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'like' | 'dislike'

  const handleCopyText = () => {
    if (onCopy) onCopy(content);
    else navigator.clipboard.writeText(content);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  return (
    <div className={`flex items-start gap-3 w-full animate-fade-in my-4 ${isAI ? 'justify-start' : 'justify-end'}`}>
      {/* AI Avatar */}
      {isAI && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1e3a8a] to-[#2563eb] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
          <Sparkles size={16} />
        </div>
      )}

      {/* Message Container */}
      <div
        className={`max-w-3xl rounded-2xl p-4 sm:p-5 shadow-xs space-y-3 font-sans ${
          isAI
            ? 'bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-tl-none text-[#191b23] dark:text-gray-100'
            : 'bg-[#2563eb] text-white rounded-tr-none shadow-sm'
        }`}
      >
        {/* Header Tag for AI */}
        {isAI && (
          <div className="flex items-center justify-between pb-2 border-b border-[#f0f1f6] dark:border-gray-800">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950 text-[#2563eb] px-2 py-0.5 rounded border border-blue-200">
                EWMP GEMINI 3.1 PRO
              </span>
              <span className="text-[10px] font-mono text-[#737686] flex items-center gap-1 font-bold">
                <ShieldCheck size={12} className="text-emerald-500" /> Prompt Guard Verified
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#737686]">{timestamp}</span>
          </div>
        )}

        {/* Text Body */}
        <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
          {content}
        </div>

        {/* Optional Bulleted List Rendering */}
        {listItems && listItems.length > 0 && (
          <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm pl-2 pt-1 font-medium">
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        )}

        {/* Optional Code Block Rendering */}
        {codeSnippet && (
          <CodeBlock language={codeSnippet.language || 'sql'} code={codeSnippet.code} />
        )}

        {/* Optional Table Rendering */}
        {tableData && (
          <MarkdownTable headers={tableData.headers} rows={tableData.rows} />
        )}

        {/* AI Footer Controls */}
        {isAI && (
          <div className="flex items-center justify-between pt-3 border-t border-[#f0f1f6] dark:border-gray-800 text-xs font-mono text-[#737686]">
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyText}
                className="hover:text-[#191b23] dark:hover:text-white flex items-center gap-1 transition-colors"
              >
                {copiedResponse ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                <span>{copiedResponse ? 'Copied' : 'Copy'}</span>
              </button>

              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="hover:text-[#2563eb] flex items-center gap-1 transition-colors"
                >
                  <RefreshCw size={14} />
                  <span>Regenerate</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[10px] mr-1">Feedback:</span>
              <button
                onClick={() => setFeedback('like')}
                className={`p-1.5 rounded-lg transition-colors ${
                  feedback === 'like' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <ThumbsUp size={13} />
              </button>
              <button
                onClick={() => setFeedback('dislike')}
                className={`p-1.5 rounded-lg transition-colors ${
                  feedback === 'dislike' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <ThumbsDown size={13} />
              </button>
            </div>
          </div>
        )}

        {/* User Footer Timestamp */}
        {!isAI && (
          <div className="text-[10px] font-mono text-blue-200 text-right pt-1">
            {timestamp}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {!isAI && (
        <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center shrink-0 shadow-xs mt-0.5 font-bold text-xs">
          YOU
        </div>
      )}
    </div>
  );
};
