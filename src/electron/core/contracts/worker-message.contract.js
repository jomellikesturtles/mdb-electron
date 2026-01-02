/**
 * Standardized Contract for Main <-> Worker Communication.
 * Replaces the fragile array-based `[type, payload]` pattern.
 */

class WorkerMessage {
  /**
   * @param {string} type - The action type (e.g., 'PLAY', 'PROGRESS')
   * @param {any} payload - The data associated with the action
   * @param {string} [id] - Optional correlation ID for request/response patterns
   */
  constructor(type, payload, id = null) {
    this.type = type;
    this.payload = payload;
    this.id = id || this.generateId();
    this.timestamp = Date.now();
  }

  generateId() {
    return Math.random().toString(36).substring(2, 15);
  }

  static fromRaw(raw) {
    if (raw && raw.type) {
      return new WorkerMessage(raw.type, raw.payload, raw.id);
    }
    // Backward compatibility for legacy array format [type, payload]
    if (Array.isArray(raw) && raw.length >= 1) {
      return new WorkerMessage(raw[0], raw[1] || null);
    }
    return new WorkerMessage('UNKNOWN', raw);
  }
}

module.exports = WorkerMessage;
