import React from 'react';
import { 
  Building2, 
  Award, 
  MapPin, 
  Clock, 
  Calendar, 
  Settings, 
  Filter 
} from 'lucide-react';
import { Card, Button, SearchInput, Badge } from '../../../components/shared';

/**
 * OrganizationQuickActions.jsx
 * Provides one-click administrative workflow triggers and global/scoped search
 * for the EWMP Organization Management module. Consumes standard shared components.
 */

export const OrganizationQuickActions = ({
  onTriggerAction,
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Search departments, locations, designations, or shifts...',
  onOpenFilter,
  filterCount = 0,
}) => {
  const actions = [
    {
      id: 'create-department',
      label: 'Create Department',
      icon: Building2,
      color: 'bg-blue-50 dark:bg-blue-950/40 text-[#2563eb] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 border-blue-200 dark:border-blue-800/40',
    },
    {
      id: 'create-designation',
      label: 'Create Designation',
      icon: Award,
      color: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border-indigo-200 dark:border-indigo-800/40',
    },
    {
      id: 'create-location',
      label: 'Create Location',
      icon: MapPin,
      color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border-emerald-200 dark:border-emerald-800/40',
    },
    {
      id: 'create-shift',
      label: 'Create Shift',
      icon: Clock,
      color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50 border-amber-200 dark:border-amber-800/40',
    },
    {
      id: 'add-holiday',
      label: 'Add Holiday',
      icon: Calendar,
      color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 border-purple-200 dark:border-purple-800/40',
    },
    {
      id: 'update-org',
      label: 'Update Organization',
      icon: Settings,
      color: 'bg-slate-100 dark:bg-slate-800 text-[#434655] dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-[#e2e8f0] dark:border-slate-700',
    },
  ];

  return (
    <Card className="p-5 space-y-4">
      {/* Search and Filter Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1">
          <SearchInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            onClear={() => onSearchChange && onSearchChange('')}
          />
        </div>

        {onOpenFilter && (
          <Button
            variant="secondary"
            size="md"
            onClick={onOpenFilter}
            leftIcon={<Filter size={15} className="text-[#434655]" />}
            className="shrink-0"
          >
            <span>Filters</span>
            {filterCount > 0 && (
              <Badge variant="primary" size="sm" className="ml-1">
                {filterCount}
              </Badge>
            )}
          </Button>
        )}
      </div>

      {/* Quick Actions Grid */}
      <div className="pt-2 border-t border-[#e2e8f0] dark:border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#434655] dark:text-slate-400">
            Administrative Quick Actions
          </span>
          <span className="text-[10px] text-[#434655] dark:text-slate-400 font-mono">RBAC: Super Admin</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {actions.map((act) => {
            const IconComp = act.icon;
            return (
              <button
                key={act.id}
                onClick={() => onTriggerAction && onTriggerAction(act.id)}
                className={`flex items-center gap-2 p-2.5 rounded-md border text-xs font-semibold transition-all shadow-sm ${act.color}`}
              >
                <div className="p-1 rounded-md bg-white/60 dark:bg-black/20 shrink-0">
                  <IconComp size={15} />
                </div>
                <span className="truncate">{act.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default OrganizationQuickActions;

