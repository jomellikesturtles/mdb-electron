import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationService, Navigation } from '@services/navigation.service';
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

  constructor(private location: Location,
    // private navigationService: NavigationService
    private listsService: ListsService,
    private loggerService: LoggerService,
    private mediaUserDataService: MediaUserDataService
  ) { }

  isOpenNav = false;
  sideNavWidth;
  // navigation = new NavigationService(this, this.location)
  ngOnInit() {
    this.mediaUserDataService.getMediaUserData(122).subscribe(e => {
      GeneralUtil.DEBUG.log(`mediaUserDataService.getMediaUserData ${JSON.stringify(e)}`);
      // this.loggerService.log(`mediaUserDataService.getMediaUserData ${JSON.stringify(e)}`);
    });
    this.listsService.createList({
      title: "paborito kong pelikula 2",
      description: "deskriptsyon"
    }).subscribe(e => {

      GeneralUtil.DEBUG.log(`listsService.createList ${e}`);
      // this.loggerService.log(`listsService.createList ${JSON.stringify(e)}`);
      this.listsService.getList(e['_id']).subscribe(e1 => {

        GeneralUtil.DEBUG.log(`listsService.getList ${e1}`);
        // this.loggerService.log(`listsService.getList ${JSON.stringify(e1)}`);

      });
    });
    if (this.isOpenNav) {
      this.openNav();
    } else {
      this.closeNav();
    }
  }

  /**
   * Opens side navigation
   */
  openNav() {
    this.sideNavWidth = '250px';
    document.getElementById('mySidenav').style.width = this.sideNavWidth;
  }

  /**
   * Closes side navigation
   */
  closeNav() {
    this.sideNavWidth = '50px';
    document.getElementById('mySidenav').style.width = this.sideNavWidth;
  }

  switchNav() {
    this.isOpenNav = !this.isOpenNav;
    if (this.isOpenNav) {
      this.openNav();
    } else {
      this.closeNav();
    }
  }

  goPreviousPage() {
    GeneralUtil.DEBUG.log('goPreviousPage');
    // this
    this.location.back();
    // this.navigation.previousPage()
  }

  goForwardPage() {
    GeneralUtil.DEBUG.log('goPreviousPage');
    GeneralUtil.DEBUG.log(this.location.path());
    this.location.forward();
    // this.navigation.nextPage()
  }
}
