import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { LibraryService } from "@services/library.service";
import { BookmarkService } from "@services/media/bookmark.service";
import { FavoriteService } from "@services/media/favorite.service";
import { ListsService } from "@services/media/list.service";
import { MediaUserDataService } from "@services/media/media-user-data.service";
import { PlayedService } from "@services/media/played.service";
import { MovieService } from "@services/movie/movie.service";
import { ProgressService } from "@services/progress.service";
import { MockBookmarkService } from "./services/mock-bookmark.service";
import { MockFavoriteService } from "./services/mock-favorite.service";
import { MockLibraryService } from "./services/mock-library.service";
import { MockListService } from "./services/mock-list.service";
import { MockMovieService } from "./services/mock-movie.service";
import { MockPlayedService } from "./services/mock-played.service";
import { MockProgressService } from "./services/mock-progress.service";
import { MockUserDataService } from "./services/mock-user-data.service";
import { ProfileService } from "@services/profile/profile.service";
import { MockProfileService } from "./services/mock-profile.service";
import { MockTorrentService } from "./services/mock-torrent.service";
import { TorrentService } from "@services/torrent/torrent.service";

@NgModule({
  imports: [HttpClientModule],
  providers: [
    { provide: MediaUserDataService, useExisting: MockUserDataService },
    // { provide: BookmarkService, useExisting: MockBookmarkService },
    // { provide: FavoriteService, useExisting: MockFavoriteService },
    // { provide: ListsService, useExisting: MockListService },
    // { provide: PlayedService, useExisting: MockPlayedService },
    // { provide: ProgressService, useExisting: MockProgressService },
    { provide: MovieService, useExisting: MockMovieService },
    { provide: ProfileService, useExisting: MockProfileService },
    { provide: TorrentService, useExisting: MockTorrentService },
    // { provide: LibraryService, useExisting: MockLibraryService },

    // { provide: HTTP_INTERCEPTORS, useClass: MockInterceptorService, multi: true },
  ]
})

export class MockCoreServicesModule { }
