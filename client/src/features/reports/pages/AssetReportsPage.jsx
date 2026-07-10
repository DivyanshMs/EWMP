import React from 'react';
import { Laptop, DollarSign, ShieldAlert, Activity, Download } from 'lucide-react';
import { AnalyticsCard } from '../components/ReportCards';
import { ChartContainer, BarChartMock, DonutChartMock, LineChartMock } from '../components/ChartContainers';
import { ComparisonTable } from '../components/ReportTables';

/**
 * AssetReportsPage.jsx
 * Hardware inventory and IT asset management analytics suite inspired by Looker and Freshservice.
 * Covers asset allocation inventories, maintenance cost tracking, department hardware distribution, utilization rates, and warranty expiry alerts.
 */
export const AssetReportsPage = ({ onExportReport }) => {
  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-2xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-cyan-50 dark:bg-cyan-950 text-cyan-600 border border-cyan-200">
              IT ASSET &amp; CMDB BI
            </span>
            <span className="text-xs font-mono text-[#737686]">Hardware Allocation Telemetry</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#191b23] dark:text-white mt-1">
            Asset Allocation, Utilization Ratios, Maintenance &amp; Warranty Expiry Reports
          </h2>
        </div>

        <button
          onClick={() => onExportReport && onExportReport('Asset Master Suite')}
          className="p-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 text-xs font-bold"
        >
          <Download size={14} /> Export CMDB Inventory
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title="Total Active Assets"
          value="482 Devices"
          subtitle="Laptops, servers & peripherals"
          icon={Laptop}
          change="100% cataloged in CMDB"
          trend="up"
          color="text-cyan-600"
          bg="bg-cyan-50 dark:bg-cyan-950/60"
        />
        <AnalyticsCard
          title="Asset Utilization Rate"
          value="94.2%"
          subtitle="Hardware assigned to staff"
          icon={Activity}
          change="+1.5% operational efficiency"
          trend="up"
          color="text-[#2563eb]"
          bg="bg-blue-50 dark:bg-blue-950/60"
        />
        <AnalyticsCard
          title="Annual Maintenance Cost"
          value="$48,200"
          subtitle="Repairs & software licensing"
          icon={DollarSign}
          change="Within IT OpEx budget"
          trend="up"
          color="text-emerald-600"
          bg="bg-emerald-50 dark:bg-emerald-950/60"
        />
        <AnalyticsCard
          title="Warranty Expiry Alert"
          value="14 Laptops"
          subtitle="Expiring within next 60 days"
          icon={ShieldAlert}
          change="Scheduled for refresh cycle"
          trend="up"
          color="text-amber-600"
          bg="bg-amber-50 dark:bg-amber-950/60"
        />
      </div>

      {/* Visual Asset Breakdown & Warranty Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ChartContainer
            title="Asset Allocation by Category"
            subtitle="Hardware inventory distribution"
            onExport={onExportReport}
            height="h-64"
          >
            <DonutChartMock
              centerValue="482"
              centerLabel="TOTAL ASSETS"
              slices={[
                { label: 'MacBook Pro Laptops', value: 55.0, hex: '#0284c7', color: 'bg-cyan-600' },
                { label: 'Dell Latitude Laptops', value: 25.0, hex: '#2563eb', color: 'bg-[#2563eb]' },
                { label: 'Rack Servers / Net Hardware', value: 12.0, hex: '#059669', color: 'bg-emerald-600' },
                { label: 'Mobile / Tablets', value: 8.0, hex: '#f59e0b', color: 'bg-amber-500' },
              ]}
            />
          </ChartContainer>
        </div>

        <div className="lg:col-span-2">
          <ChartContainer
            title="Hardware Warranty Expiration & Refresh Timeline Forecast"
            subtitle="Projected count of hardware units reaching 3-year depreciation limit across 2026/2027"
            onExport={onExportReport}
            height="h-64"
          >
            <LineChartMock
              points={[10, 14, 22, 35, 28, 45, 60, 52, 40]}
              color="#0284c7"
              gradientFrom="rgba(2, 132, 199, 0.3)"
            />
          </ChartContainer>
        </div>
      </div>

      {/* Department Asset Distribution Bar Chart */}
      <ChartContainer
        title="Departmental Hardware Allocation & Asset Value Ledger"
        subtitle="Distribution of assigned laptops and workstations across business units"
        onExport={onExportReport}
        height="h-64"
      >
        <BarChartMock
          data={[
            { label: 'Engineering R&D', value1: 88, value2: 70, color1: 'bg-cyan-600', color2: 'bg-cyan-300' },
            { label: 'Sales & Growth', value1: 65, value2: 55, color1: 'bg-[#2563eb]', color2: 'bg-blue-300' },
            { label: 'HR & Operations', value1: 45, value2: 40, color1: 'bg-purple-600', color2: 'bg-purple-300' },
            { label: 'Finance & Tax', value1: 38, value2: 35, color1: 'bg-emerald-600', color2: 'bg-emerald-300' },
          ]}
        />
      </ChartContainer>

      {/* CMDB Inventory Table */}
      <div className="space-y-3 pt-2">
        <h3 className="font-extrabold text-base text-[#191b23] dark:text-white">
          Departmental Hardware Inventory &amp; Asset Maintenance Audit Table
        </h3>
        <ComparisonTable />
      </div>
    </div>
  );
};
