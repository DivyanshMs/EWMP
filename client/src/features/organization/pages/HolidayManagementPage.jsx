import React, { useState, useMemo } from 'react';
import { Plus, Search, Upload, Download, Filter, Edit, Trash2, Globe, Building, MapPin } from 'lucide-react';
import { OrganizationTableSkeleton, OrganizationCalendarSkeleton } from '../components/OrganizationLoadingStates';
import { OrganizationEmptyState } from '../components/OrganizationEmptyStates';
import { OrganizationEmptySearch } from '../components/OrganizationErrorStates';
import { EntityFormModal } from '../components/OrganizationModals';
import { Table, SearchInput, Select, Card, Button, Badge } from '../../../components/shared';

/**
 * HolidayManagementPage.jsx
 * Enterprise observed holiday schedule and calendar administration.
 * Supports National, Company-wide, and Regional holidays, CSV import/export, and Month/Year visual calendar toggles.
 * Consumes standard shared components.
 */

export const HolidayManagementPage = ({ isLoading = false }) => {
  const [holidays, setHolidays] = useState([
    { id: '1', name: "New Year's Day", date: '2026-01-01', day: 'Thursday', type: 'National Holiday', region: 'Global (All Branches)', status: 'Observed', color: 'bg-purple-600' },
    { id: '2', name: 'Martin Luther King Jr. Day', date: '2026-01-19', day: 'Monday', type: 'National Holiday', region: 'US - Silicon Valley HQ & Austin', status: 'Observed', color: 'bg-blue-600' },
    { id: '3', name: 'Lunar New Year (Spring Festival)', date: '2026-02-17', day: 'Tuesday', type: 'Regional Holiday', region: 'Singapore APAC Hub & Tokyo', status: 'Observed', color: 'bg-rose-500' },
    { id: '4', name: 'Good Friday', date: '2026-04-03', day: 'Friday', type: 'National Holiday', region: 'London Innovation Hub & US', status: 'Observed', color: 'bg-indigo-600' },
    { id: '5', name: 'Acme Founder & Innovation Day', date: '2026-06-15', day: 'Monday', type: 'Company Holiday', region: 'Global (All Branches)', status: 'Observed', color: 'bg-emerald-600' },
    { id: '6', name: 'Independence Day (US)', date: '2026-07-03', day: 'Friday', type: 'National Holiday', region: 'US - Silicon Valley HQ & Austin', status: 'Observed', color: 'bg-blue-600' },
    { id: '7', name: 'Labor Day', date: '2026-09-07', day: 'Monday', type: 'National Holiday', region: 'US & Canada', status: 'Observed', color: 'bg-blue-600' },
    { id: '8', name: 'Mid-Autumn Festival', date: '2026-09-25', day: 'Friday', type: 'Regional Holiday', region: 'Singapore APAC Hub', status: 'Observed', color: 'bg-amber-500' },
    { id: '9', name: 'Thanksgiving Day', date: '2026-11-26', day: 'Thursday', type: 'National Holiday', region: 'US - Silicon Valley HQ & Austin', status: 'Observed', color: 'bg-amber-600' },
    { id: '10', name: 'Christmas Day', date: '2026-12-25', day: 'Friday', type: 'National Holiday', region: 'Global (All Branches)', status: 'Observed', color: 'bg-purple-600' },
  ]);

  const [viewMode, setViewMode] = useState('table'); // 'table' | 'month' | 'year'
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingItem, setEditingItem] = useState(null);

  const filteredData = useMemo(() => {
    return holidays.filter((h) => {
      const matchesSearch =
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.date.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'All' || h.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [holidays, searchQuery, typeFilter]);

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
    if (window.confirm(`Are you sure you want to remove holiday "${name}" from the calendar?`)) {
      setHolidays((prev) => prev.filter((h) => h.id !== id));
    }
  };

  const handleImport = () => {
    alert('Simulating CSV / iCal Holiday Schedule Import... Successfully imported 4 regional observed holidays into MongoDB Atlas.');
  };

  const handleExport = () => {
    alert('Exporting 2026 Organization Holiday Calendar to standardized iCal (.ics) and CSV format...');
  };

  const handleFormSubmit = (formData) => {
    if (modalMode === 'create') {
      const dateObj = new Date(formData.date || '2026-07-04');
      const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(dateObj);
      const newHol = {
        id: String(Date.now()),
        name: formData.name,
        date: formData.date || '2026-07-04',
        day: dayName,
        type: formData.type || 'Company Holiday',
        region: formData.region || 'Global (All Branches)',
        status: formData.status || 'Observed',
        color: formData.type === 'National Holiday' ? 'bg-blue-600' : formData.type === 'Regional Holiday' ? 'bg-rose-500' : 'bg-emerald-600',
      };
      setHolidays((prev) => [...prev, newHol].sort((a, b) => a.date.localeCompare(b.date)));
    } else {
      setHolidays((prev) =>
        prev.map((h) => (h.id === editingItem.id ? { ...h, ...formData } : h))
      );
    }
  };

  const formFields = [
    { name: 'name', label: 'Holiday Title / Event Name', required: true, placeholder: 'e.g. Acme Founder & Innovation Day' },
    { name: 'date', label: 'Observed Date (YYYY-MM-DD)', type: 'date', required: true, defaultValue: '2026-07-15' },
    {
      name: 'type',
      label: 'Holiday Classification',
      type: 'select',
      required: true,
      defaultValue: 'Company Holiday',
      options: [
        { label: 'National Holiday (Government Observed)', value: 'National Holiday' },
        { label: 'Company Holiday (Global Organization)', value: 'Company Holiday' },
        { label: 'Regional Holiday (Branch Specific)', value: 'Regional Holiday' },
      ],
    },
    { name: 'region', label: 'Applicable Offices / Regions', required: true, placeholder: 'e.g. Global (All Branches)' },
    {
      name: 'status',
      label: 'Attendance Status',
      type: 'select',
      required: true,
      defaultValue: 'Observed',
      options: [
        { label: 'Observed (Paid Time Off)', value: 'Observed' },
        { label: 'Optional / Floating Holiday', value: 'Floating' },
      ],
    },
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'National Holiday': return <Globe size={15} className="text-[#2563eb]" />;
      case 'Regional Holiday': return <MapPin size={15} className="text-rose-500" />;
      default: return <Building size={15} className="text-emerald-500" />;
    }
  };

  const columns = [
    { key: 'date', header: 'Date & Day', render: (h) => (
      <div className="font-mono font-bold text-[#191b23] dark:text-white">
        <span>{h.date}</span>
        <span className="block text-[11px] text-[#434655] dark:text-slate-400 font-normal">{h.day}</span>
      </div>
    )},
    { key: 'name', header: 'Holiday Name', render: (h) => (
      <div className="font-bold text-[#191b23] dark:text-white flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${h.color}`}></span>
        <span>{h.name}</span>
      </div>
    )},
    { key: 'type', header: 'Classification', render: (h) => (
      <Badge variant="neutral" size="sm" className="font-mono">
        {getTypeIcon(h.type)}
        <span className="ml-1">{h.type}</span>
      </Badge>
    )},
    { key: 'region', header: 'Applicable Regions / Offices', render: (h) => (
      <span className="text-xs font-medium text-[#434655] dark:text-slate-300">{h.region}</span>
    )},
    { key: 'status', header: 'Attendance Status', render: (h) => (
      <Badge variant="success" size="sm" dot>
        {h.status}
      </Badge>
    )},
    { key: 'actions', header: 'Actions', className: 'text-right', cellClassName: 'text-right', render: (h) => (
      <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => handleOpenEdit(h)}
          title="Edit Holiday"
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-amber-600 transition-colors"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={() => handleDelete(h.id, h.name)}
          title="Remove Holiday"
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-600 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    )}
  ];

  const typeFilterOptions = [
    { label: 'All Holiday Types', value: 'All' },
    { label: 'National Holidays Only', value: 'National Holiday' },
    { label: 'Company Holidays Only', value: 'Company Holiday' },
    { label: 'Regional Branch Only', value: 'Regional Holiday' }
  ];

  if (isLoading) return <OrganizationTableSkeleton rows={7} columns={6} />;
  if (holidays.length === 0) {
    return <OrganizationEmptyState type="holiday" onAction={handleOpenCreate} />;
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Top Action & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-[#111111] p-4 rounded-xl border border-[#e2e8f0] dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="flex-1 max-w-md">
            <SearchInput
              placeholder="Search holidays by event name, region, or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
            />
          </div>

          <div className="flex items-center gap-2 w-56">
            <Filter size={15} className="text-slate-400 ml-1 shrink-0" />
            <Select
              value={typeFilter}
              onChange={(val) => setTypeFilter(val)}
              options={typeFilterOptions}
              size="sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5">
          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-[#f8fafc] dark:bg-[#161616] p-1 rounded-xl border border-[#e2e8f0] dark:border-slate-800">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table' ? 'bg-white dark:bg-[#222] text-[#2563eb] dark:text-blue-400 shadow-xs' : 'text-slate-500'
              }`}
            >
              <TableIcon size={14} />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'month' ? 'bg-white dark:bg-[#222] text-[#2563eb] dark:text-blue-400 shadow-xs' : 'text-slate-500'
              }`}
            >
              <CalendarIcon size={14} />
              <span className="hidden sm:inline">Month View</span>
            </button>
            <button
              onClick={() => setViewMode('year')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'year' ? 'bg-white dark:bg-[#222] text-[#2563eb] dark:text-blue-400 shadow-xs' : 'text-slate-500'
              }`}
            >
              <span>Year View</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleImport}
              title="Import Holidays (CSV)"
            >
              <Upload size={15} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              title="Export iCal / CSV"
            >
              <Download size={15} />
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleOpenCreate}
              leftIcon={<Plus size={16} />}
            >
              Add Holiday
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {filteredData.length === 0 ? (
        <OrganizationEmptySearch query={searchQuery} onClear={() => { setSearchQuery(''); setTypeFilter('All'); }} />
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <Table columns={columns} rows={filteredData} />
      ) : viewMode === 'month' ? (
        /* MONTH CALENDAR VIEW (July 2026 Focus) */
        <Card className="space-y-0">
          <Card.Header
            title={
              <span className="flex items-center gap-2">
                <CalendarIcon size={18} className="text-[#2563eb] dark:text-blue-400" />
                July 2026 Organization Holiday Calendar
              </span>
            }
            subtitle="Interactive monthly holiday schedule and attendance regularization preview"
            action={
              <Badge variant="primary" size="sm" className="font-mono">
                Q3 2026 Cycle
              </Badge>
            }
          />

          <Card.Body className="py-6">
            <div className="grid grid-cols-7 gap-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <div key={d} className="p-2 text-center font-mono text-xs font-bold bg-slate-100 dark:bg-slate-800 text-[#191b23] dark:text-slate-300 rounded-md">
                  {d}
                </div>
              ))}
              {Array.from({ length: 31 }).map((_, i) => {
                const dayNum = i + 1;
                const dateStr = `2026-07-${dayNum < 10 ? '0' + dayNum : dayNum}`;
                const hol = holidays.find((h) => h.date === dateStr);
                return (
                  <div
                    key={dayNum}
                    className={`min-h-[90px] p-2 rounded-xl border flex flex-col justify-between transition-all ${
                      hol
                        ? 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-400 shadow-xs'
                        : 'bg-[#f8fafc]/50 dark:bg-[#161616] border-[#e2e8f0] dark:border-slate-800/80 hover:border-slate-300'
                    }`}
                  >
                    <span className={`text-xs font-mono font-bold self-end ${hol ? 'text-[#2563eb] dark:text-blue-400' : 'text-slate-400'}`}>
                      {dayNum}
                    </span>
                    {hol && (
                      <div className="p-1.5 rounded-md bg-[#2563eb] text-white text-[11px] font-bold shadow-xs leading-tight">
                        <div className="truncate">{hol.name}</div>
                        <div className="text-[9px] font-mono opacity-80 mt-0.5">{hol.type.split(' ')[0]}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card.Body>
        </Card>
      ) : (
        /* YEAR VIEW (12 Months Overview) */
        <Card className="space-y-0">
          <Card.Header
            title={
              <span className="flex items-center gap-2">
                <Globe size={18} className="text-purple-600 dark:text-purple-400" />
                2026 Global Observed Holidays Overview (Year-at-a-Glance)
              </span>
            }
            subtitle={`Showing all ${holidays.length} scheduled company, national, and regional holidays`}
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExport}
                leftIcon={<Download size={14} />}
              >
                Export 2026 iCal
              </Button>
            }
          />

          <Card.Body className="py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {holidays.map((h) => (
                <div
                  key={h.id}
                  className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#161616] border border-[#e2e8f0] dark:border-slate-800 flex items-start gap-3.5 hover:border-[#2563eb]/50 transition-all"
                >
                  <div className={`p-3 rounded-md text-white font-mono font-bold text-center shrink-0 ${h.color}`}>
                    <div className="text-[10px] uppercase opacity-90">{new Date(h.date).toLocaleString('default', { month: 'short' })}</div>
                    <div className="text-lg leading-none mt-0.5">{h.date.split('-')[2]}</div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-[#191b23] dark:text-white truncate">{h.name}</h4>
                    <p className="text-xs text-[#434655] dark:text-slate-400 font-mono mt-0.5">{h.day} • {h.type}</p>
                    <span className="text-[10px] text-slate-400 block mt-1.5 truncate bg-white dark:bg-[#111] px-2 py-0.5 rounded border border-[#e2e8f0] dark:border-slate-800">
                      Region: {h.region}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Modal */}
      <EntityFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Add New Organization Holiday' : 'Edit Holiday Schedule'}
        icon={CalendarIcon}
        fields={formFields}
        initialData={editingItem}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default HolidayManagementPage;

