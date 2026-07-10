import React from 'react';
import { Eye, Edit3, Trash2 } from 'lucide-react';
import { ProjectStatusBadge, ProjectHealthBadge, PriorityBadge } from './ProjectBadges';
import { ProgressBar } from './ProjectCards';

/**
 * ProjectTables.jsx
 * Systematic enterprise project directory table with interactive inspection triggers for EWMP.
 * Follows Stitch MCP Precision Enterprise design tokens.
 */

export const ProjectTable = ({ projects = [], onSelectProject, onEditProject, onDeleteProject }) => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#faf8ff] dark:bg-[#161616] border-b border-[#e1e2ed] dark:border-gray-800 text-[#737686] font-mono uppercase tracking-wider sticky top-0 z-10">
              <th className="py-3 px-4">Project Name & ID</th>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Project Manager</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4 text-right">Budget</th>
              <th className="py-3 px-4">Timeline (Start – End)</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 w-32">Progress</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e1e2ed] dark:divide-gray-800 font-mono">
            {projects.map((proj) => (
              <tr key={proj.id} className="hover:bg-[#faf8ff] dark:hover:bg-gray-900/40 transition-colors group">
                <td className="py-3.5 px-4 font-sans">
                  <span className="font-mono text-[10px] text-[#2563eb] font-bold block">{proj.id}</span>
                  <span
                    onClick={() => onSelectProject && onSelectProject(proj)}
                    className="font-bold text-sm text-[#191b23] dark:text-white group-hover:text-[#2563eb] transition-colors cursor-pointer block line-clamp-1"
                  >
                    {proj.name}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-sans font-semibold text-[#191b23] dark:text-white">
                  {proj.client}
                </td>
                <td className="py-3.5 px-4 font-sans">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#2563eb]/10 text-[#2563eb] font-extrabold text-[10px] flex items-center justify-center font-mono shrink-0">
                      {proj.projectManager.split(' ').map(n=>n[0]).join('').slice(0,2)}
                    </div>
                    <span className="text-[#434655] dark:text-gray-300 font-medium truncate max-w-[130px]">{proj.projectManager}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-sans">
                  <span className="bg-[#ededf9] dark:bg-gray-800 text-[#191b23] dark:text-white px-2 py-0.5 rounded text-[11px] font-semibold">
                    {proj.department}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <PriorityBadge priority={proj.priority} />
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-[#191b23] dark:text-white font-mono">
                  ${proj.budget.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-[11px] text-[#737686]">
                  <span>{proj.startDate}</span>
                  <span className="mx-1 text-gray-400">→</span>
                  <strong className="text-[#191b23] dark:text-white">{proj.endDate}</strong>
                </td>
                <td className="py-3.5 px-4">
                  <ProjectStatusBadge status={proj.status} />
                </td>
                <td className="py-3.5 px-4 w-32">
                  <ProgressBar progress={proj.progress} size="sm" showLabel={true} color={proj.health === 'OFF_TRACK' ? 'bg-rose-600' : 'bg-[#2563eb]'} />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onSelectProject && onSelectProject(proj)}
                      className="p-1.5 bg-[#faf8ff] hover:bg-[#ededf9] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#2563eb] rounded transition-colors"
                      title="Inspect Project Details"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => onEditProject && onEditProject(proj)}
                      className="p-1.5 bg-[#faf8ff] hover:bg-[#ededf9] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#737686] hover:text-[#191b23] dark:hover:text-white rounded transition-colors"
                      title="Edit Project"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteProject && onDeleteProject(proj)}
                      className="p-1.5 bg-[#faf8ff] hover:bg-rose-100 dark:bg-gray-800 dark:hover:bg-rose-950 text-rose-600 rounded transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
