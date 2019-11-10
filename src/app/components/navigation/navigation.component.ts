import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationService, Navigation } from '../../services/navigation.service'
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  constructor(private location: Location,
    // private navigationService: NavigationService
  ) { }

  isOpenNav = true
  sideNavWidth;
  // navigation = new NavigationService(this, this.location)
  ngOnInit() {
    this.openNav()
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
    this.isOpenNav = !this.isOpenNav
    if (this.isOpenNav) {
      this.openNav()
    } else {
      this.closeNav()
    }
  }

  goPreviousPage() {
    console.log('goPreviousPage');
    // this
    this.location.back()
    // this.navigation.previousPage()
  }

  goForwardPage() {
    console.log('goPreviousPage');
    console.log(this.location.path())
    this.location.forward()
    // this.navigation.nextPage()
  }
}
