import { Component, OnInit } from '@angular/core';
import { NavigationService } from '@core/services/navigation.service';
import { ListsService } from '@services/media/list.service';
import { LoggerService } from '@core/logger.service';
import { MediaUserDataService } from '@services/media/media-user-data.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
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
  isAuthRoute = false;

  constructor(
    private navigationService: NavigationService,
    private listsService: ListsService,
    private loggerService: LoggerService,
    private mediaUserDataService: MediaUserDataService,
    private router: Router
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkAuthRoute(event.url);
    });
  }

  ngOnInit() {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
    this.checkAuthRoute(this.router.url);

    // Existing data initialization (kept as is)
    // this.mediaUserDataService.getMediaUserData('122').subscribe(e => {
    //   GeneralUtil.DEBUG.log(`mediaUserDataService.getMediaUserData ${JSON.stringify(e)}`);
    // });

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

  get canGoBack(): boolean {
    return this.navigationService.canGoBack;
  }

  // Navigation Helpers
  goPreviousPage() {
    this.navigationService.back();
  }

  goForwardPage() {
    window.history.forward();
  }

  checkAuthRoute(url: string) {
    this.isAuthRoute = url.includes('/user/signin') || 
                       url.includes('/user/register') || 
                       url.includes('/user/reset-password');
  }
}
