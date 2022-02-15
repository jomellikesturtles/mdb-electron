import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {

  constructor() { }

  browseLists = []

  ngOnInit() {
    let academyWinnersList = {
      name: 'Academy Winners',
      contents: []
    }
    this.browseLists.push(academyWinnersList)
  }

  getAcademyWinnersList() {

  }
}

export enum BROWSE_TITLES {
  COMPLETED_WATCHED,
  INCOMPLETE_WATCHED,
  BOOKMARKED,
  FAVORITES,
}
