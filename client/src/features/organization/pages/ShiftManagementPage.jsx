import React, { useState, useMemo } from 'react';
import { Clock, Plus, Search, Users, Edit, Trash2, Sun, Moon, Sunset, RefreshCw } from 'lucide-react';
import { OrganizationTableSkeleton, OrganizationCalendarSkeleton } from '../components/OrganizationLoadingStates';
import { OrganizationEmptyState } from '../components/OrganizationEmptyStates';
import { OrganizationEmptySearch } from '../components/OrganizationErrorStates';
import { EntityFormModal } from '../components/OrganizationModals';
import { Table, SearchInput, Select, Card, Button, Badge } from '../../../components/shared';

/**
 * ShiftManagementPage.jsx
 * Enterprise working shift and schedule roster administration.
 * Supports Morning, Evening, Night, and Flexible schedules with Grace Periods, Break Durations,
 * and an interactive Weekly/Monthly Calendar Roster Preview.
 * Consumes standard shared components.
 */

export const ShiftManagementPage = ({ isLoading = false }) => {
  const [shifts, setShifts] = useState([
    { id: '1', name: 'Standard Morning Roster (US-HQ)', code: 'SH-MORN-01', type: 'Morning', workingHours: '08:00 AM - 05:00 PM (9.0h)', breakTime: '60 Mins (Unpaid)', gracePeriod: '15 Mins Grace', weeklyOff: 'Saturday, Sunday', assignedWorkforce: 1840, status: 'Active', color: 'bg-blue-500' },
    { id: '2', name: 'APAC Evening Support Roster', code: 'SH-EVE-02', type: 'Evening', workingHours: '02:00 PM - 11:00 PM (9.0h)', breakTime: '45 Mins (Paid)', gracePeriod: '10 Mins Grace', weeklyOff: 'Saturday, Sunday', assignedWorkforce: 420, status: 'Active', color: 'bg-amber-500' },
    { id: '3', name: 'Global Night SRE Roster', code: 'SH-NGT-03', type: 'Night', workingHours: '10:00 PM - 07:00 AM (9.0h)', breakTime: '45 Mins (Paid)', gracePeriod: '20 Mins Grace', weeklyOff: 'Sunday, Monday', assignedWorkforce: 180, status: 'Active', color: 'bg-indigo-600' },
    { id: '4', name: 'Executive Flexible Core Hours', code: 'SH-FLX-04', type: 'Flexible', workingHours: 'Core: 10:00 AM - 04:00 PM (8.0h Total)', breakTime: 'Flexible (60 Mins)', gracePeriod: '30 Mins Grace', weeklyOff: 'Saturday, Sunday', assignedWorkforce: 320, status: 'Active', color: 'bg-emerald-500' },
    { id: '5', name: 'Weekend Emergency Maintenance Roster', code: 'SH-WKD-05', type: 'Morning', workingHours: '09:00 AM - 03:00 PM (6.0h)', breakTime: '30 Mins (Paid)', gracePeriod: '10 Mins Grace', weeklyOff: 'Monday through Friday', assignedWorkforce: 45, status: 'Inactive', color: 'bg-rose-500' },
  ]);

  const [viewMode, setViewMode] = useState('table'); // 'table' | 'calendar'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCalendarShift, setSelectedCalendarShift] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingItem, setEditingItem] = useState(null);

  const filteredData = useMemo(() => {
    return shifts.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.workingHours.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [shifts, searchQuery]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingItem({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setModalMode('edit');
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete shift roster "${name}"?`)) {
      setShifts((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleFormSubmit = (formData) => {
    if (modalMode === 'create') {
      const newShift = {
        id: String(Date.now()),
        name: formData.name,
        code: formData.code || `SH-${shifts.length + 1}`,
        type: formData.type || 'Morning',
        workingHours: formData.workingHours || '09:00 AM - 05:00 PM (8.0h)',
        breakTime: formData.breakTime || '60 Mins',
        gracePeriod: formData.gracePeriod || '15 Mins Grace',
        weeklyOff: formData.weeklyOff || 'Saturday, Sunday',
        assignedWorkforce: 0,
        status: formData.status || 'Active',
        color: formData.type === 'Night' ? 'bg-indigo-600' : formData.type === 'Evening' ? 'bg-amber-500' : 'bg-blue-500',
      };
      setShifts((prev) => [newShift, ...prev]);
    } else {
      setShifts((prev) =>
        prev.map((s) => (s.id === editingItem.id ? { ...s, ...formData } : s))
      );
    }
  };

  const formFields = [
    { name: 'name', label: 'Shift Roster Name', required: true, placeholder: 'e.g. Standard Morning Roster' },
    { name: 'code', label: 'Shift Code', required: true, placeholder: 'e.g. SH-MORN-01' },
    {
      name: 'type',
      label: 'Shift Classification',
      type: 'select',
      required: true,
      defaultValue: 'Morning',
      options: [
        { label: 'Morning Shift (Day Roster)', value: 'Morning' },
        { label: 'Evening Shift (Sunset Roster)', value: 'Evening' },
        { label: 'Night Shift (Graveyard SRE)', value: 'Night' },
        { label: 'Flexible / Core Hours Roster', value: 'Flexible' },
      ],
    },
    { name: 'workingHours', label: 'Working Hours Window', required: true, placeholder: 'e.g. 08:00 AM - 05:00 PM (9.0h)' },
    { name: 'breakTime', label: 'Break Duration & Terms', required: true, placeholder: 'e.g. 60 Mins (Unpaid)' },
    { name: 'gracePeriod', label: 'Late Arrival Grace Period', required: true, placeholder: 'e.g. 15 Mins Grace' },
    { name: 'weeklyOff', label: 'Weekly Off Days', required: true, placeholder: 'e.g. Saturday, Sunday' },
    {
      name: 'status',
      label: 'Operational Status',
      type: 'select',
      required: true,
      defaultValue: 'Active',
      options: [
        { label: 'Active Roster', value: 'Active' },
        { label: 'Inactive / Suspended', value: 'Inactive' },
      ],
    },
  ];

  const getShiftIcon = (type) => {
    switch (type) {
      case 'Night': return <Moon size={16} className="text-indigo-500" />;
      case 'Evening': return <Sunset size={16} className="text-amber-500" />;
      case 'Flexible': return <RefreshCw size={16} className="text-emerald-500" />;
      default: return <Sun size={16} className="text-[#2563eb]" />;
    }
  };

  const columns = [
    { key: 'name', header: 'Shift Name & Code', render: (shift) => (
      <div className="flex items-center gap-2.5 font-bold text-[#191b23] dark:text-white">
        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
          {getShiftIcon(shift.type)}
        </div>
        <div>
          <span>{shift.name}</span>
          <span className="block text-[11px] font-mono text-[#2563eb] dark:text-blue-400 font-normal">{shift.code}</span>
        </div>
      </div>
    )},
    { key: 'type', header: 'Type', render: (shift) => (
      <span className="font-mono font-semibold text-[#434655] dark:text-slate-300">
        {shift.type}
      </span>
    )},
    { key: 'workingHours', header: 'Working Hours Window', render: (shift) => (
      <span className="font-mono font-bold text-[#191b23] dark:text-white">
        {shift.workingHours}
      </span>
    )},
    { key: 'breakTime', header: 'Break & Grace', render: (shift) => (
      <div className="text-xs">
        <span className="font-semibold text-[#191b23] dark:text-slate-200 block">{shift.breakTime}</span>
        <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400">{shift.gracePeriod}</span>
      </div>
    )},
    { key: 'weeklyOff', header: 'Weekly Off', render: (shift) => (
      <span className="text-xs font-mono text-[#434655] dark:text-slate-400">
        {shift.weeklyOff}
      </span>
    )},
    { key: 'assignedWorkforce', header: 'Workforce', render: (shift) => (
      <Badge variant="secondary" size="md" className="font-mono">
        <Users size={13} className="text-[#2563eb] mr-1 inline" />
        {shift.assignedWorkforce}
      </Badge>
    )},
    { key: 'status', header: 'Status', render: (shift) => (
      <Badge
        variant={shift.status === 'Active' ? 'success' : 'neutral'}
        size="sm"
        dot
      >
        {shift.status}
      </Badge>
    )},
    { key: 'actions', header: 'Actions', className: 'text-right', cellClassName: 'text-right', render: (shift) => (
      <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => handleOpenEdit(shift)}
          title="Edit Shift"
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-amber-600 transition-colors"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={() => handleDelete(shift.id, shift.name)}
          title="Delete Shift"
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-600 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    )}
  ];

  const calendarFilterOptions = [
    { label: `All Active Rosters (${shifts.length})`, value: 'All' },
    ...shifts.map((s) => ({ label: `${s.name} (${s.type})`, value: s.id }))
  ];

  if (isLoading) return <OrganizationTableSkeleton rows={6} columns={7} />;
  if (shifts.length === 0) {
    return <OrganizationEmptyState type="shift" onAction={handleOpenCreate} />;
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-[#111111] p-4 rounded-xl border border-[#e2e8f0] dark:border-slate-800 shadow-sm">
        <div className="flex-1 max-w-md">
          <SearchInput
            placeholder="Search shifts by roster name, code, type, or hours..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#f8fafc] dark:bg-[#161616] p-1 rounded-xl border border-[#e2e8f0] dark:border-slate-800">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-[#222] text-[#2563eb] dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-[#191b23] dark:hover:text-white'
              }`}
            >
              <TableIcon size={14} />
              <span>Roster Table</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-[#222] text-[#2563eb] dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-[#191b23] dark:hover:text-white'
              }`}
            >
              <CalendarIcon size={14} />
              <span>Calendar Preview</span>
            </button>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleOpenCreate}
            leftIcon={<Plus size={16} />}
            className="shrink-0"
          >
            Create Shift Roster
          </Button>
        </div>
      </div>

      {/* Content Area */}
      {filteredData.length === 0 ? (
        <OrganizationEmptySearch query={searchQuery} onClear={() => setSearchQuery('')} />
      ) : viewMode === 'table' ? (
        /* TABLE VIEW MODE */
        <Table columns={columns} rows={filteredData} />
      ) : (
        /* CALENDAR PREVIEW VIEW MODE */
        <Card className="space-y-0">
          <Card.Header
            title={
              <span className="flex items-center gap-2">
                <CalendarIcon size={18} className="text-[#2563eb] dark:text-blue-400" />
                Shift Roster Calendar Roster Preview (July 2026)
              </span>
            }
            subtitle="Visual weekly coverage grid across all department schedules"
            action={
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#434655] dark:text-slate-400">Filter Calendar:</span>
                <div className="w-64">
                  <Select
                    value={selectedCalendarShift}
                    onChange={(val) => setSelectedCalendarShift(val)}
                    options={calendarFilterOptions}
                    size="sm"
                  />
                </div>
              </div>
            }
          />

          {/* Weekly Calendar Grid */}
          <Card.Body className="py-6">
            <div className="grid grid-cols-7 gap-3">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, dIdx) => {
                const isWeekend = dIdx >= 5;
                return (
                  <div key={day} className="space-y-2">
                    <div className={`p-2.5 rounded-md text-center font-mono text-xs font-bold ${
                      isWeekend ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400' : 'bg-slate-100 dark:bg-slate-800 text-[#191b23] dark:text-slate-200'
                    }`}>
                      {day}
                    </div>
                    <div className="space-y-2 min-h-[220px] p-2 rounded-xl bg-[#f8fafc]/60 dark:bg-[#151515] border border-[#e2e8f0] dark:border-slate-800/80">
                      {shifts
                        .filter((s) => selectedCalendarShift === 'All' || s.id === selectedCalendarShift)
                        .map((shift) => {
                          const isOff = shift.weeklyOff.toLowerCase().includes(day.toLowerCase().slice(0, 3));
                          if (isOff) return null;
                          return (
                            <div
                              key={shift.id}
                              className={`p-2 rounded-md text-[11px] font-mono border text-white shadow-xs ${
                                shift.type === 'Night' ? 'bg-indigo-600 border-indigo-500' : shift.type === 'Evening' ? 'bg-amber-600 border-amber-500' : 'bg-[#2563eb] border-blue-500'
                              }`}
                            >
                              <div className="font-bold truncate">{shift.name}</div>
                              <div className="text-[10px] opacity-90 mt-0.5">{shift.workingHours.split(' ')[0]} - {shift.workingHours.split(' ')[3]}</div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Modal */}
      <EntityFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Create New Shift Roster' : 'Edit Shift Roster'}
        icon={Clock}
        fields={formFields}
        initialData={editingItem}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default ShiftManagementPage;
