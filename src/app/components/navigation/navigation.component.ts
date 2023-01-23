import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationService, Navigation } from '@services/navigation.service';
import { ListsService } from '@services/lists.service';
import { LoggerService } from '@core/logger.service';
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  constructor(private location: Location,
    // private navigationService: NavigationService
    private listsService: ListsService,
    private loggerService: LoggerService
  ) { }

  isOpenNav = false;
  sideNavWidth;
  // navigation = new NavigationService(this, this.location)
  ngOnInit() {
    this.listsService.createList({
      title: "paborito kong pelikula 2",
      description: "deskriptsyon"
    }).subscribe(e => {
      this.loggerService.log(`listsService.createList ${JSON.stringify(e)}`);
      this.listsService.getList(e['_id']).subscribe(e1 => {
        this.loggerService.log(`listsService.getList ${JSON.stringify(e1)}`);

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
    console.log('goPreviousPage');
    // this
    this.location.back();
    // this.navigation.previousPage()
  }

  goForwardPage() {
    console.log('goPreviousPage');
    console.log(this.location.path());
    this.location.forward();
    // this.navigation.nextPage()
  }
}
