export interface IUserProfile {
  username: string;
  emailAddress: string;
  bio?: string;
  watchedCount?: number;
  bookmarkedCount?: number;
  photoUrl?: string; // Avatar
  name?: string;
  avatar: string;
  isMain: boolean;
  bookmarks: UserDataDTO;
  played: UserDataDTO;
  favorites: UserDataDTO;

}
export interface Profile {
  name: null;
  avatar: null;
  isMain: boolean;
  bookmarks: UserDataDTO;
  favorites: UserDataDTO;
}

export interface UserDataDTO {
  content: Content[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
  sortBy: null;
  orderBy: null;
  type: null;
}

export interface Content {
  id: number;
  tmdbId: string;
  mediaId?: string;
}


