import React, { useState, useMemo } from 'react';
import { MapPin, Plus, Search, Globe, Building, Clock, Edit, Trash2, Navigation, Map } from 'lucide-react';
import { OrganizationCardGridSkeleton } from '../components/OrganizationLoadingStates';
import { OrganizationEmptyState } from '../components/OrganizationEmptyStates';
import { OrganizationEmptySearch } from '../components/OrganizationErrorStates';
import { EntityFormModal } from '../components/OrganizationModals';
import { Card, SearchInput, Button, Badge } from '../../../components/shared';

/**
 * LocationManagementPage.jsx
 * Enterprise Office & Branch Location management.
 * Features an interactive Maps Placeholder banner, capacity metrics, site manager contacts, and working hours.
 * Consumes standard shared components.
 */

export const LocationManagementPage = ({ isLoading = false }) => {
  const [locations, setLocations] = useState([
    { id: '1', name: 'Silicon Valley Global HQ', code: 'US-SV-01', address: '1000 Innovation Parkway, Suite 500, Mountain View, CA 94043', city: 'Silicon Valley', country: 'United States', capacity: 1200, currentOccupancy: 840, manager: 'David Vance', email: 'sv-hq@acme.corp', phone: '+1 (415) 890-2311', workingHours: '08:00 AM - 06:00 PM (PST)', status: 'Active', coords: '37.3861° N, 122.0839° W' },
    { id: '2', name: 'London Innovation Hub', code: 'UK-LON-02', address: '42 Finsbury Square, London EC2A 1AE, United Kingdom', city: 'London', country: 'United Kingdom', capacity: 350, currentOccupancy: 210, manager: 'Elena Rostova', email: 'lon-hub@acme.corp', phone: '+44 20 7946 0921', workingHours: '08:30 AM - 05:30 PM (GMT)', status: 'Active', coords: '51.5225° N, 0.0884° W' },
    { id: '3', name: 'Singapore APAC Regional Tower', code: 'SG-SIN-03', address: '1 Marina Boulevard, #28-00, Marina Bay Financial Centre, Singapore 018989', city: 'Singapore', country: 'Singapore', capacity: 500, currentOccupancy: 390, manager: 'Alex Chen', email: 'sin-regional@acme.corp', phone: '+65 6832 9100', workingHours: '09:00 AM - 06:00 PM (SGT)', status: 'Active', coords: '1.2838° N, 103.8530° E' },
    { id: '4', name: 'Austin Engineering Annex', code: 'US-AUS-04', address: '500 Congress Ave, Suite 1200, Austin, TX 78701', city: 'Austin', country: 'United States', capacity: 250, currentOccupancy: 180, manager: 'Marcus Brody', email: 'aus-annex@acme.corp', phone: '+1 (512) 480-9900', workingHours: '08:00 AM - 05:00 PM (CST)', status: 'Active', coords: '30.2672° N, 97.7431° W' },
    { id: '5', name: 'Tokyo R&D Satellite Office', code: 'JP-TYO-05', address: 'Roppingi Hills Mori Tower 15F, Minato-ku, Tokyo 106-6108, Japan', city: 'Tokyo', country: 'Japan', capacity: 150, currentOccupancy: 60, manager: 'Kenji Sato', email: 'tyo-rd@acme.corp', phone: '+81 3 6406 6000', workingHours: '09:00 AM - 06:00 PM (JST)', status: 'Restructuring', coords: '35.6604° N, 139.7292° E' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMapLoc, setSelectedMapLoc] = useState(locations[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingItem, setEditingItem] = useState(null);

  const filteredData = useMemo(() => {
    return locations.filter(
      (loc) =>
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.manager.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [locations, searchQuery]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingItem({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (loc, e) => {
    e?.stopPropagation();
    setModalMode('edit');
    setEditingItem(loc);
    setIsModalOpen(true);
  };

  const handleDelete = (id, name, e) => {
    e?.stopPropagation();
    if (window.confirm(`Are you sure you want to delete office location "${name}"?`)) {
      setLocations((prev) => prev.filter((l) => l.id !== id));
      if (selectedMapLoc?.id === id && locations.length > 1) {
        setSelectedMapLoc(locations[0]);
      }
    }
  };

  const handleFormSubmit = (formData) => {
    if (modalMode === 'create') {
      const newLoc = {
        id: String(Date.now()),
        name: formData.name,
        code: formData.code || `LOC-${locations.length + 1}`,
        address: formData.address || '100 Corporate Way, Business Park',
        city: formData.city || 'Global City',
        country: formData.country || 'United States',
        capacity: Number(formData.capacity) || 200,
        currentOccupancy: 0,
        manager: formData.manager || 'Site Manager',
        email: formData.email || 'site@acme.corp',
        phone: formData.phone || '+1 (555) 000-0000',
        workingHours: formData.workingHours || '08:00 AM - 05:00 PM',
        status: formData.status || 'Active',
        coords: formData.coords || '0.0000° N, 0.0000° W',
      };
      setLocations((prev) => [newLoc, ...prev]);
    } else {
      setLocations((prev) =>
        prev.map((l) => (l.id === editingItem.id ? { ...l, ...formData } : l))
      );
    }
  };

  const formFields = [
    { name: 'name', label: 'Office / Facility Name', required: true, placeholder: 'e.g. London Innovation Hub' },
    { name: 'code', label: 'Location Code', required: true, placeholder: 'e.g. UK-LON-02' },
    { name: 'city', label: 'City / Metro Area', required: true, placeholder: 'e.g. London' },
    { name: 'country', label: 'Country', required: true, placeholder: 'e.g. United Kingdom' },
    { name: 'address', label: 'Street Address', required: true, placeholder: 'e.g. 42 Finsbury Square, London' },
    { name: 'capacity', label: 'Maximum Seat Capacity', type: 'number', required: true, placeholder: 'e.g. 350' },
    { name: 'manager', label: 'Site Manager / VP', required: true, placeholder: 'e.g. Elena Rostova' },
    { name: 'workingHours', label: 'Standard Working Hours', required: true, placeholder: 'e.g. 08:30 AM - 05:30 PM (GMT)' },
    {
      name: 'status',
      label: 'Operational Status',
      type: 'select',
      required: true,
      defaultValue: 'Active',
      options: [
        { label: 'Active & Open', value: 'Active' },
        { label: 'Restructuring / Renovation', value: 'Restructuring' },
      ],
    },
  ];

  if (isLoading) return <OrganizationCardGridSkeleton count={6} />;
  if (locations.length === 0) {
    return <OrganizationEmptyState type="location" onAction={handleOpenCreate} />;
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* ---------------------------------------------------- */}
      {/* INTERACTIVE MAPS PLACEHOLDER BANNER                  */}
      {/* ---------------------------------------------------- */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 border border-slate-700 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-mono text-xs font-bold flex items-center gap-1.5">
                <Map size={13} className="animate-pulse" /> Enterprise GIS Telemetry
              </span>
              <span className="text-xs font-mono text-slate-400">Geofence Compliance: Active</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white">Global Corporate Real Estate Network</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Real-time site capacity monitoring and attendance geofencing across {locations.length} corporate offices. Currently inspecting <strong className="text-white underline decoration-blue-400">{selectedMapLoc?.name || 'Global HQ'}</strong>.
            </p>
          </div>

          {/* Selected Location Map Details Card */}
          {selectedMapLoc && (
            <div className="bg-white/10 dark:bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/15 min-w-[280px] sm:min-w-[340px] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation size={16} className="text-blue-400" />
                  <span className="text-xs font-bold text-white truncate">{selectedMapLoc.name}</span>
                </div>
                <Badge variant="success" size="sm" className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 font-mono">
                  {selectedMapLoc.code}
                </Badge>
              </div>

              <div className="text-xs text-slate-300 space-y-1 font-mono">
                <div className="flex justify-between"><span>GPS Coordinates:</span> <strong className="text-white">{selectedMapLoc.coords}</strong></div>
                <div className="flex justify-between"><span>Site Capacity:</span> <strong className="text-white">{selectedMapLoc.currentOccupancy} / {selectedMapLoc.capacity} Seats ({Math.round((selectedMapLoc.currentOccupancy / selectedMapLoc.capacity) * 100)}%)</strong></div>
                <div className="flex justify-between"><span>Site Manager:</span> <strong className="text-white">{selectedMapLoc.manager}</strong></div>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => alert(`Launching 3D GIS interactive satellite map for facility: ${selectedMapLoc.name}`)}
                leftIcon={<Globe size={14} />}
                className="w-full justify-center bg-blue-600 hover:bg-blue-500"
              >
                Open Satellite Map View
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Top Search and Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-[#111111] p-4 rounded-xl border border-[#e2e8f0] dark:border-slate-800 shadow-sm">
        <div className="flex-1 max-w-md">
          <SearchInput
            placeholder="Search offices by facility name, city, code, or manager..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
          />
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreate}
          leftIcon={<Plus size={16} />}
          className="shrink-0"
        >
          Add Office Location
        </Button>
      </div>

      {/* Location Cards Grid */}
      {filteredData.length === 0 ? (
        <OrganizationEmptySearch query={searchQuery} onClear={() => setSearchQuery('')} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((loc) => {
            const occPct = Math.round((loc.currentOccupancy / loc.capacity) * 100);
            const isSelected = selectedMapLoc?.id === loc.id;
            return (
              <Card
                key={loc.id}
                onClick={() => setSelectedMapLoc(loc)}
                elevation={isSelected ? 'level2' : 'level1'}
                className={`transition-all cursor-pointer group space-y-0 ${
                  isSelected ? 'border-[#2563eb] ring-2 ring-[#2563eb]/20 dark:border-blue-500' : ''
                }`}
              >
                <Card.Body className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base shrink-0 ${
                        isSelected ? 'bg-[#2563eb] text-white shadow-md' : 'bg-blue-50 dark:bg-blue-950/40 text-[#2563eb] dark:text-blue-400'
                      }`}>
                        <Building size={22} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-[#191b23] dark:text-white text-sm sm:text-base truncate group-hover:text-[#2563eb] dark:group-hover:text-blue-400 transition-colors">
                          {loc.name}
                        </h4>
                        <span className="text-xs font-mono text-[#434655] dark:text-slate-400">{loc.code} • {loc.city}, {loc.country}</span>
                      </div>
                    </div>

                    <Badge
                      variant={loc.status === 'Active' ? 'success' : 'warning'}
                      size="sm"
                      dot
                    >
                      {loc.status}
                    </Badge>
                  </div>

                  {/* Address & Working Hours */}
                  <div className="p-3.5 bg-[#f8fafc] dark:bg-[#161616] rounded-md border border-[#e2e8f0] dark:border-slate-800 space-y-2 text-xs text-[#434655] dark:text-slate-300">
                    <div className="flex items-start gap-2">
                      <MapPin size={15} className="text-slate-400 shrink-0 mt-0.5" />
                      <p className="line-clamp-2 leading-relaxed">{loc.address}</p>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <Clock size={15} className="text-slate-400 shrink-0" />
                      <span>{loc.workingHours}</span>
                    </div>
                  </div>

                  {/* Capacity Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#434655] dark:text-slate-400">Facility Capacity Utilization</span>
                      <span className="font-bold text-[#191b23] dark:text-white">{loc.currentOccupancy} / {loc.capacity} ({occPct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        style={{ width: `${Math.min(occPct, 100)}%` }}
                        className={`h-full rounded-full transition-all ${
                          occPct > 85 ? 'bg-rose-500' : occPct > 70 ? 'bg-amber-500' : 'bg-[#2563eb]'
                        }`}
                      ></div>
                    </div>
                  </div>

                  {/* Site Manager Info */}
                  <div className="pt-3 border-t border-[#e2e8f0] dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold font-mono text-[11px]">
                        {loc.manager.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-[#191b23] dark:text-slate-200 block">{loc.manager}</span>
                        <span className="text-[10px] text-[#434655] dark:text-slate-400 block font-mono">Site Manager</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleOpenEdit(loc, e)}
                        title="Edit Location"
                        className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-amber-600 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(loc.id, loc.name, e)}
                        title="Delete Location"
                        className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </Card.Body>

                <Card.Footer className="text-[11px] font-mono text-[#2563eb] dark:text-blue-400 font-bold">
                  <span>{isSelected ? 'Currently Selected in GIS Map' : 'Click to preview on Satellite Map'}</span>
                  <Navigation size={14} className={isSelected ? 'animate-bounce' : ''} />
                </Card.Footer>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal Form */}
      <EntityFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Register New Office Location' : 'Edit Office Location'}
        icon={MapPin}
        fields={formFields}
        initialData={editingItem}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default LocationManagementPage;
