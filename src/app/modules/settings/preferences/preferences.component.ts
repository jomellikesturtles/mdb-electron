import {
  Component, OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { IpcService } from '@services/ipc.service';
import { COLOR_LIST, DEFAULT_PREFERENCES, FONT_SIZE_LIST, FREQUENCY_LIST, LANGUAGE_LIST, MODE_LIST, QUALITY_LIST, STRING_REGEX_PREFIX } from '@shared/constants';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IPreferences } from '@models/preferences.model';
import { PreferencesService } from '@services/preferences.service';
import { FeatureToggleService } from '@core/services/feature-toggle.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreferencesComponent implements OnInit, OnDestroy {

  initialFolder = 'C:\\';
  testFoldersList = ['folder1', 'folder2'];
  testLibraryFolders = ['C:\\Users\\', 'D:\\Movies'];
  testCurrentFolder = 'D:\'';
  title = 'angular 4 with jquery';
  libraryMovies = [];
  libraryFolders = this.testLibraryFolders;
  foldersList = this.testFoldersList;
  currentFolder = this.initialFolder;
  previousFolder = '';
  isDirty;
  preferencesObject: IPreferences;

  // Sidecar Map Animation Properties
  isScanning = false;
  hasScanned = false;
  lastScannedFile = '';
  private canvasElement!: HTMLCanvasElement;
  private animationFrameId: any;
  private particles: any[] = [];
  private ripples: any[] = [];
  private scanSubscription: Subscription | null = null;
  private hubPulse = 0;

  @ViewChild('sidecarCanvas') set sidecarCanvas(content: ElementRef<HTMLCanvasElement>) {
    if (content) {
      this.canvasElement = content.nativeElement;
      this.startAnimationLoop();
    } else {
      this.stopAnimationLoop();
    }
  }

  DEFAULT_LANGUAGE = 'en';
  languagesOptions = LANGUAGE_LIST;
  frequencyOptions = FREQUENCY_LIST;
  fontSizeOptions = FONT_SIZE_LIST;
  colorOptions = COLOR_LIST;
  qualityOptions = QUALITY_LIST;
  modeOptions = MODE_LIST;
  preferencesForm: FormGroup;
  private ngUnsubscribe = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private ipcService: IpcService,
    private preferencesService: PreferencesService,
    private featureToggleService: FeatureToggleService
    // private cdr: ChangeDetectorRef
  ) {
    console.log('preferences constructor');
  }

  get isSidecarMapEnabled(): boolean {
    return this.featureToggleService.isEnabled('sidecarMap');
  }

  ngOnInit() {
    console.log('preferences oninit');
    this.preferencesForm = this.formBuilder.group({
      autoScan: [true, []],
      darkMode: [true, []],
      enableCache: [false, []],
      language: ['en', []],
      username: [true, []],
      scanFreqValue: [1, []],
      scanFreqUnit: ['min', []],

      fontColor: ['min', []],
      fontSize: ['min', []],
      fontOpacity: ['min', []],
      fontFamily: ['min', []],
      backgroundColor: ['min', []],


    }, {});

    this.preferencesForm.valueChanges.subscribe(e => {
      console.log(e);
    });
    // this.preferencesForm.controls[''].
    // this.onGetLibraryFolders()
    // this.onGetLibraryMovies()

    // this.ipcService.libraryMovies.subscribe((value) => {
    //   this.libraryMovies = value
    //   this.cdr.detectChanges()
    // })
    this.ipcService.getFiles().then(value => {
      console.log('getFiles', value);
    }).catch(e => {
      console.log(e);
    });
    this.ipcService.getSystemDrives().then(value => {
      console.log('gotsystemdrives', value);
    }).catch(e => {
      console.log(e);
    });

    this.preferencesObject = this.preferencesService.getPreferences();
    this.ipcService.getPreferences().pipe(takeUntil(this.ngUnsubscribe)).subscribe((e: IPreferences) => {
      console.log('this.ipcService.preferences ', e);
      this.preferencesObject = e;
    });

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.complete();
    this.stopAnimationLoop();
    if (this.scanSubscription) {
      this.scanSubscription.unsubscribe();
    }
  }

  toggleTitle() {
  }

  setFoldersList() {

  }

  /**
   * Get list of library folders
   */
  onGetLibraryFolders() {
  }

  /**
   * Opens file explorer modal
   */
  onOpenModal() {
    this.onGoToFolder(this.initialFolder);
    this.ipcService.getSystemDrives();
  }

  /**
   * Closes file explorer modal
   */
  onCloseModal() {
    this.previousFolder = '';
  }

  /**
   * Scans library folders for new movies
   */
  onScanLibrary() {
    this.isScanning = true;
    this.hasScanned = true;
    this.ipcService.startScanLibrary();

    if (this.scanSubscription) {
      this.scanSubscription.unsubscribe();
    }

    this.scanSubscription = this.ipcService.scannedFile$.subscribe((filePath) => {
      this.lastScannedFile = filePath;
      const filename = filePath.split(/[\\/]/).pop() || filePath;

      if (this.canvasElement) {
        const width = this.canvasElement.width;
        const height = this.canvasElement.height;
        const isTopNode = Math.random() > 0.5;
        const startX = 60;
        const startY = isTopNode ? height * 0.3 : height * 0.7;

        this.particles.push({
          startX: startX,
          startY: startY,
          x: startX,
          y: startY,
          targetX: width / 2,
          targetY: height / 2,
          progress: 0,
          speed: 0.015 + Math.random() * 0.02,
          size: 4,
          color: '#e50914', // Glowing red packet
          label: filename.substring(0, 25) + (filename.length > 25 ? '...' : '')
        });
      }
    });
  }

  onStopScanLibrary() {
    console.log('onStopScanLibrary');
    this.isScanning = false;
    this.ipcService.stopScanLibrary();
    if (this.scanSubscription) {
      this.scanSubscription.unsubscribe();
      this.scanSubscription = null;
    }
  }

  private startAnimationLoop() {
    this.stopAnimationLoop();
    const run = () => {
      this.drawSidecarMap();
      this.animationFrameId = requestAnimationFrame(run);
    };
    this.animationFrameId = requestAnimationFrame(run);
  }

  private stopAnimationLoop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private drawSidecarMap() {
    if (!this.canvasElement) return;
    const canvas = this.canvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const x = width / 2;
    const y = height / 2;

    // Beautiful motion-blur trail clear
    ctx.fillStyle = 'rgba(13, 13, 13, 0.25)';
    ctx.fillRect(0, 0, width, height);

    // 1. Draw source nodes (Disk Scan Roots) on the left
    const leftX = 60;
    const leftY1 = height * 0.3;
    const leftY2 = height * 0.7;

    // Glowing disk nodes
    ctx.fillStyle = '#00ffcc'; // neon green/cyan
    ctx.beginPath();
    ctx.arc(leftX, leftY1, 6, 0, Math.PI * 2);
    ctx.arc(leftX, leftY2, 6, 0, Math.PI * 2);
    ctx.fill();

    // Source labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '9px monospace';
    ctx.fillText('DISK_ROOT_A', leftX - 55, leftY1 + 3);
    ctx.fillText('DISK_ROOT_B', leftX - 55, leftY2 + 3);

    // Connection lines to center hub
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(leftX, leftY1);
    ctx.lineTo(x, y);
    ctx.moveTo(leftX, leftY2);
    ctx.lineTo(x, y);
    ctx.stroke();

    // 2. Spawn ambient low-level scan packets
    if (this.isScanning && Math.random() < 0.08) {
      const isTopNode = Math.random() > 0.5;
      const startY = isTopNode ? leftY1 : leftY2;
      this.particles.push({
        startX: leftX,
        startY: startY,
        x: leftX,
        y: startY,
        targetX: x,
        targetY: y,
        progress: 0,
        speed: 0.008 + Math.random() * 0.015,
        size: 2,
        color: 'rgba(0, 255, 200, 0.6)',
        label: 'scanning...'
      });
    }

    // 3. Update and draw ripples
    this.ripples.forEach((r, idx) => {
      r.radius += 1.8;
      r.opacity -= 0.04;
      if (r.opacity <= 0) {
        this.ripples.splice(idx, 1);
        return;
      }
      ctx.strokeStyle = `rgba(229, 9, 20, ${r.opacity})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, r.radius, 0, Math.PI * 2);
      ctx.stroke();
    });

    // 4. Update and draw flying data packets
    this.particles.forEach((p, idx) => {
      p.progress += p.speed;
      if (p.progress >= 1.0) {
        // Arrived at hub! Trigger ripple and clean up
        this.ripples.push({ radius: 18, opacity: 1.0 });
        this.particles.splice(idx, 1);
        return;
      }

      p.x = p.startX + (p.targetX - p.startX) * p.progress;
      p.y = p.startY + (p.targetY - p.startY) * p.progress;

      // Add slight organic wobble to path
      const wobble = Math.sin(p.progress * Math.PI * 2.5) * 8;
      const drawX = p.x + (p.startY > p.targetY ? -wobble : wobble) * 0.3;
      const drawY = p.y + wobble;

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Tiny labels next to actual files
      if (p.size > 2) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.font = '8px monospace';
        ctx.fillText(p.label, drawX + 8, drawY + 3);
      }
    });

    // 5. Draw central database/Go sidecar hub cell
    this.hubPulse = Math.sin(Date.now() / 150) * 3;
    const baseRadius = 18;
    const radius = baseRadius + this.hubPulse;

    // Glowing envelope
    const glow = ctx.createRadialGradient(x, y, radius - 4, x, y, radius + 20);
    glow.addColorStop(0, 'rgba(229, 9, 20, 0.45)');
    glow.addColorStop(1, 'rgba(229, 9, 20, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, radius + 20, 0, Math.PI * 2);
    ctx.fill();

    // Central cell core
    ctx.fillStyle = '#e50914';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Central text label
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 9px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('SIDECAR', x, y - 2);
    ctx.font = '7px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText(this.isScanning ? 'INDEXING' : 'IDLE', x, y + 7);
  }

  /**
   * Updates thepiratebay torrent dump
   */
  onUpdateTorrentDump() {
  }

  /**
   * Updates imdb files
   */
  onUpdateOfflineMetadata() {
  }

  onSyncUserData() {

  }

  /**
   * saves config file
   */
  onSave() {
    this.preferencesService.savePreferences(this.preferencesObject);
    // this.preferencesObject.isDirty = false;
  }

  /**
   * Resets preferences.
   */
  onReset() {
    this.preferencesObject = DEFAULT_PREFERENCES;
    this.isDirty = false;
  }

  onAddFolder(folderName: string) {
    this.ipcService.openFolder('');
    // this.ipcService.openFolder(__dirname)
    // this.unsavedPreferences.libraryFolders.push(folderName)
  }
  onEditFolder(folder) {
  }

  /**
   * Deletes folder from library
   * @param folder folder directory to delete
   */
  onDeleteFolder(folder) {
    this.libraryFolders = this.libraryFolders.filter(h => h !== folder);
    // this.cdr.detectChanges()
  }

  /**
   * Opens folder with system file explorer.
   * @param folder folder directory to open
   */
  onOpenFolder(folder: string) {
    let folderToOpen = '';
    const REGEX_PREFIX = new RegExp(STRING_REGEX_PREFIX, `gi`);
    if (folder.match(REGEX_PREFIX) == null) { // not match
      folderToOpen = this.currentFolder + folder;
    } else {
      folderToOpen = folder;
    }
    // this.ipcService.call(this.ipcService.IPCCommand.OpenInFileExplorer, folderToOpen)
  }

  // modal file explorer
  // goes back to the previous folder
  onGoToPreviousFolder(folder: string) {
    if (this.previousFolder) {
      this.ipcService.openFolder(folder);
      this.currentFolder = this.previousFolder;
    }
  }

  // goes back to the parent folder
  onGoToParentFolder() {
    if ((this.currentFolder.lastIndexOf('\\')) <= 2) {
    } else {
      this.previousFolder = this.currentFolder;
    }
    // this.ipcService.call(this.ipcService.IPCCommand.GoToFolder, [this.ipcService.IPCCommand.Up, this.currentFolder])
  }

  onGoToFolder(folder: string) {
    this.previousFolder = this.currentFolder;
    this.currentFolder = folder;
    this.ipcService.openFolder(folder);
  }

  onValChange(e) {
    console.log('pref e ', e);
  }
}
