import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ListsService } from '@services/media/list.service';
import { LoggerService } from '@core/logger.service';
import { MediaUserDataService } from '@services/media/media-user-data.service';
import GeneralUtil from '@utils/general.util';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  // Sidebar State
  isExpanded = false; // Default to collapsed (mini) mode
  isMobile = false;   // Track mobile view
  isMobileOpen = false; // Track mobile drawer state

  constructor(
    private location: Location,
    private listsService: ListsService,
    private loggerService: LoggerService,
    private mediaUserDataService: MediaUserDataService
  ) { }

  ngOnInit() {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());

    // Existing data initialization (kept as is)
    this.mediaUserDataService.getMediaUserData('122').subscribe(e => {
      GeneralUtil.DEBUG.log(`mediaUserDataService.getMediaUserData ${JSON.stringify(e)}`);
    });

    // Test code for lists (kept as is)
    // this.listsService.createList({...}).subscribe(...)
  }

  // Handle Screen Resize
  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768; // Mobile breakpoint
    if (!this.isMobile) {
      this.isMobileOpen = false; // Reset mobile drawer if resizing to desktop
    }
  }

  // Toggle Sidebar (called from Top Nav)
  toggleSideNav() {
    // this.isExpanded = true;
    // this.isMobileOpen = false;
    if (this.isMobile) {
      this.isMobileOpen = !this.isMobileOpen;
    } else {
      this.isExpanded = !this.isExpanded;
    }
  }

  // Navigation Helpers
  goPreviousPage() {
    this.location.back();
  }

  goForwardPage() {
    this.location.forward();
  }
}
