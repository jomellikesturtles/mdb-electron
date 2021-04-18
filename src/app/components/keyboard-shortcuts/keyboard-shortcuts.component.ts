import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-keyboard-shortcuts',
  templateUrl: './keyboard-shortcuts.component.html',
  styleUrls: ['./keyboard-shortcuts.component.scss']
})
export class KeyboardShortcutsComponent implements OnInit {

  HOTKEYS = HOTKEYS
  constructor() { }

  ngOnInit() {
  }

  resetHotkeys() { }
  saveHotkeys() { }
}

const HOTKEYS = {
  // ToggleFULL
  mute: 'm',
  fullscreen: 'f'
}
