import { IReview } from "./review.model";

export class IProfileData {

  tmdbId?: number;
  bookmark?: Bookmark;
  favorite?: Favorite;
  watched?: Watched;
  listLinkMovie?: ListLinkMovie;
  review?: IReview;
  isBookmark?: boolean;
  isFavorite?: boolean;
  library?: any;
  isPlayed?: boolean;
  // isBookmark?: boolean;
}

interface Bookmark {
  id: string;
}
interface Favorite {
  id: string;
}
interface Watched {
  id?: string;
  percentage: number;
}
export interface ListLinkMovie {
  id: number;
  listId: number;
}
