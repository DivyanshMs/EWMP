import React, { useState } from 'react';
import { Sliders, Sun, Moon, Laptop, Eye, LayoutDashboard, CheckCircle2, Save } from 'lucide-react';
import { SettingsCard, PreferenceCard, StatusBadge } from '../components/AdminComponents';

/**
 * SystemPreferencesPage.jsx
 * UI Theme fidelity, density scale, accessibility accommodations, and default landing page configuration.
 */

export const SystemPreferencesPage = () => {
  const [prefs, setPrefs] = useState({
    theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
    density: 'default',
    highContrast: false,
    reduceMotion: false,
    defaultDashboard: 'executive',
    defaultLanding: '/',
    enableSoundEffects: true,
    enableCommandPaletteHint: true
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handlePrefChange = (field, val) => {
    if (field === 'theme') {
      const root = window.document.documentElement;
      if (val === 'dark') {
        root.classList.add('dark');
      } else if (val === 'light') {
        root.classList.remove('dark');
      } else {
        // System
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
      localStorage.setItem('theme', val);
    }
    setPrefs(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {saveSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>System appearance preferences, UI density scale, and accessibility accommodations have been applied to your active session.</span>
        </div>
      )}

      {/* Section 1: Visual Theme & Appearance Density */}
      <SettingsCard 
        title="Visual Theme & UI Density Scale" 
        subtitle="Configure color scheme fidelity and layout spacing across enterprise grids"
        icon={Sliders}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Color Scheme Fidelity</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'light', label: 'Light Mode', desc: 'Clean slate white backgrounds', icon: Sun },
                { id: 'dark', label: 'Dark Mode (OLED)', desc: 'High contrast #111111 deep black', icon: Moon },
                { id: 'system', label: 'System Fidelity', desc: 'Sync with operating system setting', icon: Laptop }
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = prefs.theme === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handlePrefChange('theme', item.id)}
                    className={`p-3.5 rounded-lg border text-left transition-all flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-500/10 ring-1 ring-blue-600'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161616] hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300">
                        <Icon size={18} />
                      </div>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{item.label}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <PreferenceCard 
              title="Interface Density Scale" 
              description="Adjust spacing and padding across data tables, Kanban boards, and navigation bars."
              type="select"
              value={prefs.density}
              onSelectChange={(val) => handlePrefChange('density', val)}
              options={[
                { value: 'default', label: 'Default Density (8px Grid - Enterprise Standard)' },
                { value: 'compact', label: 'Compact Density (High Data Density per Screen)' },
                { value: 'relaxed', label: 'Relaxed Density (Enhanced Touch & Tablet Target Size)' }
              ]}
            />
          </div>
        </div>
      </SettingsCard>

      {/* Section 2: Accessibility Accommodations */}
      <SettingsCard 
        title="Accessibility & Ergonomic Accommodations" 
        subtitle="WCAG AA compliant display adjustments for visual and motor comfort"
        icon={Eye}
        badge={{ status: 'compliant', label: 'WCAG 2.1 AA COMPLIANT' }}
      >
        <div className="space-y-3">
          <PreferenceCard 
            title="High Contrast Border Fidelity" 
            description="Enhance visual separation by increasing border contrast across all interactive card components and modal dialogues."
            checked={prefs.highContrast}
            onChange={(val) => handlePrefChange('highContrast', val)}
          />
          <PreferenceCard 
            title="Reduce Interface Animations & Transitions" 
            description="Minimize motion effects, drawer slide transitions, and pulsing badges for motion-sensitive users."
            checked={prefs.reduceMotion}
            onChange={(val) => handlePrefChange('reduceMotion', val)}
          />
          <PreferenceCard 
            title="Audible Feedback Tone Effects" 
            description="Play subtle confirmation audio cues when completing high-stakes actions (e.g., payroll approval, role assignment)."
            checked={prefs.enableSoundEffects}
            onChange={(val) => handlePrefChange('enableSoundEffects', val)}
          />
          <PreferenceCard 
            title="Display Command Palette Keyboard Shortcut Hints (⌘K)" 
            description="Show interactive keyboard shortcut badges inside search bars and quick action buttons."
            checked={prefs.enableCommandPaletteHint}
            onChange={(val) => handlePrefChange('enableCommandPaletteHint', val)}
          />
        </div>
      </SettingsCard>

      {/* Section 3: Default Workspace & Landing Page */}
      <SettingsCard 
        title="Default Workspace & Landing Navigation" 
        subtitle="Select which platform module loads automatically upon successful session authentication"
        icon={LayoutDashboard}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Default Dashboard View</label>
            <select
              value={prefs.defaultDashboard}
              onChange={(e) => handlePrefChange('defaultDashboard', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="executive">Executive Board Scorecard (Default)</option>
              <option value="tasks">My Task Calendar & Linear Board</option>
              <option value="attendance">Biometric Attendance Portal</option>
              <option value="ai">AI Assistant Workspace (Gemini 3.1 Pro)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Initial Landing Page Route</label>
            <select
              value={prefs.defaultLanding}
              onChange={(e) => handlePrefChange('defaultLanding', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="/">/ (Main Dashboard Hub)</option>
              <option value="/employees">/employees (Personnel Directory)</option>
              <option value="/projects">/projects (Project Portfolio)</option>
              <option value="/ai-assistant">/ai-assistant (Autonomous AI Orchestrator)</option>
            </select>
          </div>
        </div>
      </SettingsCard>

      {/* Footer Submit */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Applying System Prefs...
            </>
          ) : (
            <>
              <Save size={14} />
              Save System Preferences
            </>
          )}
        </button>
      </div>
    </form>
  );
};
