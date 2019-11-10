import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  constructor(private location: Location) { }

  isOpenNav = true
  ngOnInit() {
    this.openNav()
  }

  /**
   * Opens side navigation
   */
  openNav() {
    document.getElementById('mySidenav').style.width = '250px';
    document.getElementById('main').style.marginLeft = '250px';
    document.getElementById('topNav').style.marginLeft = '230px';
  }

  /**
   * Closes side navigation
   */
  closeNav() {
    document.getElementById('mySidenav').style.width = '50px';
    document.getElementById('main').style.marginLeft = '50px';
    document.getElementById('topNav').style.marginLeft = '50px';
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
    console.log(this.location.path())
    console.log(window.history)
    console.log(this.location)
    this.location.back()
  }

  goForwardPage() {
    console.log('goPreviousPage');
    console.log(this.location.path())
    this.location.forward()
  }
}
