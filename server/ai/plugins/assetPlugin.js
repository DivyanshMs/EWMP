/**
 * assetPlugin.js — Phase 15: AI Module Plugin Framework
 * Asset Module AI Plugin exposing standardized AI interface for hardware/software inventory queries,
 * asset maintenance recommendations, inventory utilization insights, and asset allocation actions.
 *
 * Authority: API_SPECIFICATION.md Section 10
 */

const BasePlugin = require('./basePlugin');

class AssetPlugin extends BasePlugin {
  constructor() {
    super({
      moduleName: 'ASSET',
      version: '1.0.0',
      supportedIntents: [
        'ASSET_QUERY',
        'ASSET_RECOMMENDATION',
        'ASSET_INSIGHT',
        'ASSET_ACTION',
        'ALLOCATE_ASSET',
      ],
      availableFeatures: [
        'Hardware & Software Asset Allocation Context',
        'Asset Depreciation & Lifecycle Maintenance Recommendations',
        'Inventory Utilization & Hardware Cost Insights',
        'Employee Hardware/Software Asset Allocation Action Planning',
      ],
    });
  }
}

module.exports = new AssetPlugin();
