/**
 * shared/index.js
 * Precision Enterprise Design System — Shared Component Barrel Export
 * 
 * Central repository for all 50+ standardized enterprise UI components.
 * Every React page in EWMP must consume exclusively from this library.
 */

// 1. Button & IconButton
export { Button, IconButton, default as ButtonDefault } from './Button';

// 2. Badge & Chip
export { Badge, Chip, default as BadgeDefault } from './Badge';

// 3. Card & KPI containers
export { Card, CardHeader, CardBody, CardFooter, StatCard, MetricCard, ChartCard, default as CardDefault } from './Card';

// 4. Form & Input controls
export { Input, PasswordInput, SearchInput, Select, MultiSelect, Textarea, Checkbox, Radio, Switch, default as InputDefault } from './Input';

// 5. Table, DataTable & Pagination
export { Table, DataTable, Pagination, default as TableDefault } from './Table';

// 6. Modals, Drawers, Alerts & Toasts
export { Modal, ModalBody, ModalFooter, Drawer, Alert, ToastBanner as Toast, ToastBanner, default as ModalDefault } from './Modal';

// 7. Avatar
export { Avatar, default as AvatarDefault } from './Avatar';

// 8. Overlays & Menus
export { Tooltip, Popover, Dropdown, ContextMenu, default as OverlaysDefault } from './Overlays';

// 9. Navigation & Progress
export { Tabs, Accordion, Progress, Breadcrumb, default as NavigationDefault } from './Navigation';

// 10. Empty & Error States
export { EmptyState, ErrorState, default as EmptyStateDefault } from './EmptyState';

// 11. Page & Section Headers
export { PageHeader, SectionHeader, default as PageHeaderDefault } from './PageHeader';

// 12. Filter & Search Bars
export { FilterBar, SearchBar, default as FilterBarDefault } from './FilterBar';

// 13. Skeletons & Spinners
export { Skeleton, SkeletonCard, SkeletonTable, SkeletonForm, Spinner, LoadingOverlay, PageLoader, SkeletonLoader, default as SkeletonDefault } from './Skeleton';

// 14. Layout Components
export { ProfileMenu, NotificationMenu, default as LayoutComponentsDefault } from './LayoutComponents';
