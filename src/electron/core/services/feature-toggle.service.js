/**
 * Feature Toggle Service
 * Manages the state of feature flags to enable safe parallel development.
 */
class FeatureToggleService {
    constructor() {
      // In a real app, these might come from a remote config or env variables
      this.toggles = {
        'NEW_TORRENT_ENGINE': true, // Enable new refactored torrent engine
        'MODULAR_LIBRARY': false     // Placeholder for next refactor
      };
    }
  
    /**
     * Checks if a feature is enabled.
     * @param {string} featureName 
     * @returns {boolean}
     */
    isEnabled(featureName) {
      return this.toggles[featureName] === true;
    }
  
    /**
     * Sets a feature toggle state (useful for runtime updates or testing).
     * @param {string} featureName 
     * @param {boolean} isEnabled 
     */
    set(featureName, isEnabled) {
      this.toggles[featureName] = isEnabled;
    }
  }
  
  module.exports = new FeatureToggleService();
  