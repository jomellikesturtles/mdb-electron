import { Component, OnInit } from '@angular/core';
import { MediaGridComponent } from '@components/media-grid/media-grid.component';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent extends MediaGridComponent implements OnInit {


  browseLists = [];
  mediaList: any[] = [];
  listId: string;

  ngOnInit() {

    // this.currentPage = 1;
    this.activatedRoute.params.subscribe(val => {

      // this.showVideo = false;
      // this.getMovieOnline(val['id']);
      console.log('val: ', val);
      this.listId = val.id;
      this.currentPage = 1;
      this.isProccessing = true;
      this.gridTitle = this.listId.charAt(0).toUpperCase() + this.listId.slice(1);;
      this.mediaUserDataService.getMediaDataPaginatedByType(this.listId, '0', '20').subscribe(
        (e: any) => {
          this.mediaList = e?.content || e || [];
          this.isProccessing = false;
          const items = this.mediaList;
          const totalPages = e?.totalPages || Math.ceil((e?.total || 0) / (e?.size || 20)) || (items.length >= 20 ? this.currentPage + 1 : this.currentPage);
          this.hasMoreResults = items.length >= 20 && this.currentPage < totalPages;
        },
        error => {
          this.isProccessing = false;
        }
      );
    });
    const academyWinnersList = {
      name: 'Academy Winners',
      contents: []
    };
    this.browseLists.push(academyWinnersList);
  }

  getAcademyWinnersList() {

  }

  loadMore() {
    this.currentPage++;
    const offset = ((this.currentPage - 1) * 20).toString();
    this.procLoadMoreResults = true;
    this.mediaUserDataService.getMediaDataPaginatedByType(this.listId, offset, '20').subscribe(
      (e: any) => {
        const nextContent = e?.content || e || [];
        this.mediaList = [...this.mediaList, ...nextContent];
        const totalPages = e?.totalPages || Math.ceil((e?.total || 0) / (e?.size || 20)) || (nextContent.length >= 20 ? this.currentPage + 1 : this.currentPage);
        this.hasMoreResults = nextContent.length >= 20 && this.currentPage < totalPages;
        this.procLoadMoreResults = false;
      },
      error => {
        this.procLoadMoreResults = false;
      }
    );
  }

}

export enum BROWSE_TITLES {
  COMPLETED_WATCHED,
  INCOMPLETE_WATCHED,
  BOOKMARKED,
  FAVORITES,
}
