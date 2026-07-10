import React from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  Award, 
  PlusCircle 
} from 'lucide-react';
import { EmptyState, Button } from '../../../components/shared';

/**
 * OrganizationEmptyStates.jsx
 * Reusable enterprise empty state illustrations and actionable cards for Departments,
 * Locations, Holidays, Shifts, and Designations. Consumes standard shared components.
 */

export const OrganizationEmptyState = ({
  type = 'department',
  title,
  description,
  actionLabel,
  onAction,
}) => {
  const configMap = {
    department: {
      icon: Building2,
      defaultTitle: 'No Departments Configured',
      defaultDesc:
        'Your organizational hierarchy is currently empty. Create your first operating division or business unit to assign managers, cost centers, and employee teams.',
      defaultAction: 'Create First Department',
    },
    location: {
      icon: MapPin,
      defaultTitle: 'No Office Locations Registered',
      defaultDesc:
        'Register your corporate headquarters, regional branch offices, or remote coworking hubs to configure attendance geofencing and site capacity limits.',
      defaultAction: 'Add Office Location',
    },
    holiday: {
      icon: Calendar,
      defaultTitle: 'No Holiday Schedules Defined',
      defaultDesc:
        'Define national observed holidays, regional branch closures, or company-wide wellness days to automatically adjust attendance regularizations and PTO calculations.',
      defaultAction: 'Add Holiday Schedule',
    },
    shift: {
      icon: Clock,
      defaultTitle: 'No Working Shifts Configured',
      defaultDesc:
        'Set up standard morning, evening, night, or flexible work rosters with defined break durations, grace periods, and weekly off policies.',
      defaultAction: 'Create Shift Roster',
    },
    designation: {
      icon: Award,
      defaultTitle: 'No Job Designations Established',
      defaultDesc:
        'Establish standardized corporate titles, reporting hierarchy ladders, and compensation salary grades for transparent talent mapping.',
      defaultAction: 'Create Designation',
    },
  };

  const current = configMap[type] || configMap.department;

  const actionButton = onAction ? (
    <Button
      variant="primary"
      size="md"
      onClick={onAction}
      leftIcon={<PlusCircle size={18} />}
    >
      {actionLabel || current.defaultAction}
    </Button>
  ) : undefined;

  return (
    <EmptyState
      icon={current.icon}
      title={title || current.defaultTitle}
      subtitle={description || current.defaultDesc}
      action={actionButton}
      className="my-4 min-h-[480px]"
    />
  );
};

export default OrganizationEmptyState;

