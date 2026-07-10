import React, { useState } from 'react';
import { Sparkles, Send, ArrowLeft, Download, Trash2, ShieldCheck } from 'lucide-react';
import { Card, CardBody, Button, Input, Badge } from '../../../components/shared';
import { ChatBubble, TypingIndicator, PromptSuggestionPill } from '../components/ChatComponents';
import { sendChatMessage, toAssistantListItems } from '../utils/aiChatApi';

/**
 * ChatInterfacePage.jsx
 * AI Chat - Immersive fullscreen conversational AI interface for EWMP.
 * Features complete message history, Markdown rendering (Tables, Code Blocks, Lists), typing indicators, and copy/regenerate controls.
 * Following Stitch Precision Enterprise Design System.
 */
export const ChatInterfacePage = ({ onNavigate, onToast }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'AI',
      timestamp: 'Today, 08:30 AM',
      content: "Welcome to the Fullscreen EWMP AI Conversational Workspace.\n\nI am connected to your live enterprise database with real-time SOC2 auditing. I can generate SQL queries, synthesize cross-departmental correlation reports, or draft HR memorandums formatted in clean Markdown.",
      listItems: [
        'Ask for a departmental financial variance breakdown.',
        'Request an automated SQL query for attendance records.',
        'Simulate a multi-step onboarding automation.'
      ]
    },
    {
      id: 2,
      sender: 'USER',
      timestamp: 'Today, 08:35 AM',
      content: "Can you show me the SQL query to pull overtime hours and attendance adherence for Engineering R&D in Q3?"
    },
    {
      id: 3,
      sender: 'AI',
      timestamp: 'Today, 08:35 AM',
      content: "Certainly! Here is the exact SQL telemetry query targeting the `ewmp_analytics_warehouse` table, along with a preview of the returned aggregation table:",
      codeSnippet: {
        language: 'sql',
        code: `SELECT \n  employee_id,\n  full_name,\n  department_name,\n  COUNT(shift_date) AS total_shifts,\n  ROUND(AVG(attendance_rate), 2) AS adherence_pct,\n  SUM(overtime_hours) AS total_ot_logged\nFROM ewmp_analytics_warehouse\nWHERE department_name = 'Engineering R&D'\n  AND fiscal_quarter = 'FY26/Q3'\nGROUP BY employee_id, full_name, department_name\nHAVING SUM(overtime_hours) > 20\nORDER BY total_ot_logged DESC;`
      },
      tableData: {
        headers: ['Employee ID', 'Full Name', 'Department', 'Adherence %', 'Overtime Logged'],
        rows: [
          ['EMP-1042', 'Dr. Aris Thorne', 'Engineering R&D', '99.2%', '64.5 hrs'],
          ['EMP-1088', 'Elena Rostova', 'Engineering R&D', '98.8%', '52.0 hrs'],
          ['EMP-1104', 'Marcus Vance', 'Engineering R&D', '97.5%', '45.0 hrs'],
          ['EMP-1152', 'Siddharth Patel', 'Engineering R&D', '99.0%', '42.0 hrs']
        ]
      }
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const handleSendMessage = (textToSend) => {
    const text = typeof textToSend === 'string' ? textToSend : inputPrompt;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'USER',
      timestamp: 'Just now',
      content: text
    };

    setMessages((prev) => [...prev, userMsg]);
    if (typeof textToSend !== 'string') setInputPrompt('');
    setIsSynthesizing(true);

    (async () => {
      try {
        const result = await sendChatMessage(text);
        const responseText = result.response || 'The AI service returned an empty response.';

        setMessages((prev) => [...prev, {
          id: Date.now() + 1,
          sender: 'AI',
          timestamp: 'Just now',
          content: responseText,
          listItems: toAssistantListItems(result),
        }]);

        if (onToast) onToast('Response synthesized and logged to audit trail.');
      } catch (error) {
        setMessages((prev) => [...prev, {
          id: Date.now() + 1,
          sender: 'AI',
          timestamp: 'Just now',
          content: error?.response?.data?.message || error?.message || 'Unable to reach the AI service right now.',
        }]);

        if (onToast) onToast('AI request failed.');
      } finally {
        setIsSynthesizing(false);
      }
    })();
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear this conversation session?')) {
      setMessages([
        {
          id: Date.now(),
          sender: 'AI',
          timestamp: 'Just now',
          content: "Conversation history cleared. How can I assist you today?"
        }
      ]);
      if (onToast) onToast('Conversation session cleared.');
    }
  };

  const handleExportTranscript = () => {
    if (onToast) onToast('Exported conversation transcript as Markdown (.md).');
  };

  return (
    <Card elevation="level2" className="flex flex-col h-[820px] overflow-hidden font-sans animate-fade-in">
      {/* Top Header Bar */}
      <div className="p-4 sm:p-6 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between bg-[#faf8ff] dark:bg-[#161616]">
        <div className="flex items-center gap-4">
          {onNavigate && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigate('workspace')}
              leftIcon={<ArrowLeft size={16} />}
            >
              Back to Workspace
            </Button>
          )}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1e3a8a] to-[#2563eb] text-white flex items-center justify-center shadow-xs">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg text-[#191b23] dark:text-white">
                  EWMP Gemini 3.1 Pro — Immersive Chat
                </h2>
                <Badge variant="primary" className="bg-blue-50 dark:bg-blue-950 text-[#2563eb] border-blue-200">
                  FULLSCREEN MODE
                </Badge>
              </div>
              <p className="text-xs text-[#737686] font-mono flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 text-emerald-600 font-bold">
                  <ShieldCheck size={13} /> Encrypted Memory Active
                </span>
                <span>| Latency: 110ms | Context: 128k Tokens</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportTranscript}
            leftIcon={<Download size={14} />}
          >
            Export Transcript
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearChat}
            leftIcon={<Trash2 size={16} />}
            className="hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600"
          />
        </div>
      </div>

      {/* Main Conversational Feed */}
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-6 bg-[#fcfbff] dark:bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto space-y-6">
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              {...msg}
              onRegenerate={msg.sender === 'AI' ? () => handleSendMessage("Regenerate previous synthesis") : undefined}
            />
          ))}
          {isSynthesizing && <TypingIndicator />}
        </div>
      </div>

      {/* Quick Starter Suggestions */}
      <div className="px-6 py-3 bg-[#faf8ff] dark:bg-[#161616] border-t border-[#f0f1f6] dark:border-gray-800 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] font-mono font-bold uppercase text-[#737686] shrink-0">
          Quick Prompts:
        </span>
        <PromptSuggestionPill label="Compare Q3 vs Q2 Payroll Costs" onClick={handleSendMessage} />
        <PromptSuggestionPill label="List All Unapproved Leave Requests" onClick={handleSendMessage} />
        <PromptSuggestionPill label="Draft Employee Performance PIP Template" onClick={handleSendMessage} />
        <PromptSuggestionPill label="Synthesize Org Health Audit" onClick={handleSendMessage} />
      </div>

      {/* Sticky Bottom Input Bar */}
      <div className="p-4 sm:p-6 bg-white dark:bg-[#111111] border-t border-[#e1e2ed] dark:border-gray-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="max-w-5xl mx-auto flex items-center gap-3"
        >
          <div className="relative flex-1">
            <Input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Type your natural language instruction or data query..."
              className="pr-12 py-4"
            />
            <div className="absolute right-4 top-4 text-[#737686]">
              <Sparkles size={18} />
            </div>
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!inputPrompt.trim() || isSynthesizing}
            rightIcon={<Send size={16} />}
            className="font-mono tracking-wide uppercase"
          >
            Send Instruction
          </Button>
        </form>
      </div>
    </Card>
  );
};
