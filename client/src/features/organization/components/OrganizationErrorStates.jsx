import React from 'react';
import { ShieldAlert, SearchX, ArrowLeft } from 'lucide-react';
import { ErrorState, EmptyState, Button } from '../../../components/shared';

/**
 * OrganizationErrorStates.jsx
 * Enterprise error cards for Network Failures, RBAC Permission Violations, and Empty Search Results
 * across the EWMP Organization Management module. Consumes standard shared error/empty states.
 */

export const OrganizationNetworkError = ({ error, onRetry }) => {
  return (
    <ErrorState
      title="Network Synchronization Failure"
      subtitle="Unable to communicate with the EWMP backend gateway. Please check your network connection or verify that the organization database cluster is accessible."
      error={error}
      onRetry={onRetry}
      className="my-4 min-h-[440px]"
    />
  );
};

export const OrganizationPermissionError = ({ onBack }) => {
  return (
    <EmptyState
      icon={ShieldAlert}
      title="Administrative Privileges Required"
      subtitle="You do not possess the required Role-Based Access Control (RBAC) permissions to modify organization settings or structural hierarchies. Only Organization Administrators and Super Admins can access this workspace."
      action={
        <Button
          variant="secondary"
          size="md"
          onClick={onBack || (() => window.history.back())}
          leftIcon={<ArrowLeft size={16} />}
        >
          Return to Overview
        </Button>
      }
      className="my-4 min-h-[440px] border-amber-200 dark:border-amber-900/40"
    />
  );
};

export const OrganizationEmptySearch = ({ query, onClear }) => {
  return (
    <EmptyState
      icon={SearchX}
      title="No Matching Records Found"
      subtitle={`We couldn't find any structural entities matching "${query}". Try adjusting your filters or search keywords.`}
      action={
        onClear ? (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear Search &amp; Filters
          </Button>
        ) : undefined
      }
      compact
      className="bg-[#f8fafc]/50 dark:bg-[#151515]/50 border-dashed"
    />
  );
};

export default {
  OrganizationNetworkError,
  OrganizationPermissionError,
  OrganizationEmptySearch,
};

