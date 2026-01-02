const cp = require('child_process');
const path = require('path');
const { EventEmitter } = require('events');
const WorkerMessage = require('../contracts/worker-message.contract');

/**
 * Wrapper around a Child Process to provide typed communication.
 */
class WorkerClient extends EventEmitter {
  constructor(name, scriptPath, options = {}) {
    super();
    this.name = name;
    this.scriptPath = scriptPath;
    this.process = null;
    this.options = {
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
      ...options
    };
  }

  /**
   * Spawns the child process.
   */
  start() {
    console.log(`[WorkerManager] Starting worker: ${this.name} (${this.scriptPath})`);
    
    try {
      this.process = cp.fork(this.scriptPath, [], this.options);

      this.process.on('message', (rawMessage) => {
        const message = WorkerMessage.fromRaw(rawMessage);
        this.emit('message', message);
        this.emit(message.type, message.payload); // specific event
      });

      this.process.on('error', (err) => {
        console.error(`[WorkerManager] Error in ${this.name}:`, err);
        this.emit('error', err);
      });

      this.process.on('exit', (code, signal) => {
        console.log(`[WorkerManager] Worker ${this.name} exited with code ${code}`);
        this.emit('exit', { code, signal });
        this.process = null;
      });

    } catch (error) {
      console.error(`[WorkerManager] Failed to start worker ${this.name}:`, error);
      throw error;
    }
  }

  /**
   * Sends a typed message to the worker.
   * @param {string} type 
   * @param {any} payload 
   */
  send(type, payload = {}) {
    if (!this.process) {
      throw new Error(`Worker ${this.name} is not running.`);
    }
    const message = new WorkerMessage(type, payload);
    this.process.send(message);
    return message.id;
  }

  /**
   * Gracefully stops the worker.
   */
  stop() {
    if (this.process) {
      this.process.kill();
      this.process = null;
    }
  }
}

/**
 * Singleton Service to manage all application workers.
 */
class WorkerManagerService {
  constructor() {
    this.workers = new Map();
  }

  /**
   * Creates or retrieves a worker client.
   * @param {string} name - Unique name for the worker
   * @param {string} scriptPath - Absolute path to the worker script
   * @returns {WorkerClient}
   */
  create(name, scriptPath) {
    if (this.workers.has(name)) {
      return this.workers.get(name);
    }

    const worker = new WorkerClient(name, scriptPath);
    this.workers.set(name, worker);
    return worker;
  }

  get(name) {
    return this.workers.get(name);
  }

  terminateAll() {
    this.workers.forEach(worker => worker.stop());
    this.workers.clear();
  }
}

module.exports = new WorkerManagerService();
