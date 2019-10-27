import { Component, OnInit } from '@angular/core';
// const path = require('path')
// import {} from 'path'

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  constructor() { }

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
  // path.join(__dirname, 'src', 'assets', 'scripts', 'file-explorer.js'
  getHomeIcon() {
    const icon = '/assets/icons/home.svg'
    // console.log(__dirname);
    return icon
  }
  getBrowseIcon() {
    const icon = '\\assets\\icons\\magnifiying-glass.svg'
    return icon
  }
}
