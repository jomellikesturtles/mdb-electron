import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  // currentPage: string
  // private root
  // private previousPages: string[]
  // private nextPages: string[]

  constructor() { }
  // constructor(root, location) {
  //   // console.log(typeof root);
  //   // console.log(typeof location);
  // }

  // goToPage(val: string) {
  //   this.previousPages.push(this.currentPage)
  //   this.currentPage = val
  //   this.nextPages = []
  // }

  // nextPage() {
  //   this.previousPages.push(this.currentPage)
  //   // this.currentPage
  // }
  // previousPage() { }
  // getPreviousPagesLength() { return this.previousPages.length }
  // getNextPagesLength() { return this.nextPages.length }
}


// no use yet.

export interface INavigation {
  currentPage: string,
  // previousPages: string[],
  // nextPages: string[]
}

export class Navigation implements INavigation {
  currentPage: string
  private previousPages: string[]
  private nextPages: string[]

  constructor(root, location) {

  }

  goToPage(val: string) {
    this.previousPages.push(this.currentPage)
    this.currentPage = val
    this.nextPages = []
  }
  nextPage() {
    this.previousPages.push(this.currentPage)
    // this.currentPage
  }
  previousPage() { }
  getPreviousPagesLength() { return this.previousPages.length }
  getNextPagesLength() { return this.nextPages.length }
}
