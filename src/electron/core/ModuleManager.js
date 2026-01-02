/**
 * Core Module Manager
 * Responsible for bootstrapping and initializing feature modules.
 */
class ModuleManager {
    /**
     * @param {Electron.IpcMain} ipcMain 
     * @param {Electron.BrowserWindow} mainWindow 
     */
    constructor(ipcMain, mainWindow) {
      this.ipcMain = ipcMain;
      this.mainWindow = mainWindow;
      this.modules = [];
    }
  
    /**
     * Registers a feature module class.
     * @param {Class} ModuleClass 
     */
    register(ModuleClass) {
      const moduleInstance = new ModuleClass(this.ipcMain, this.mainWindow);
      this.modules.push(moduleInstance);
      return this;
    }
  
    /**
     * Initializes all registered modules.
     */
    initAll() {
      console.log('[ModuleManager] Initializing modules...');
      this.modules.forEach(module => {
        if (typeof module.init === 'function') {
          module.init();
        }
      });
      console.log(`[ModuleManager] ${this.modules.length} modules initialized.`);
    }
  }
  
  module.exports = ModuleManager;
  