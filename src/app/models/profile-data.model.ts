import { Review } from "./review.model";

export class IProfileData {

  tmdbId?: number;
  bookmark?: Bookmark;
  favorite?: Favorite;
  watched?: Watched;
  listLinkMovie?: ListLinkMovie;
  review?: Review;
  isBookmark?: boolean;
  isFavorite?: boolean;
  library?: any
  // isBookmark?: boolean;
}

interface Bookmark {
  id: string
}
interface Favorite {
  id: string
}
interface Watched {
  id?: string
  percentage: number
}
export interface ListLinkMovie {
  id: number
  listId: number
}
