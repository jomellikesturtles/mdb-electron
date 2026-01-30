export interface IUserProfile {
  username: string;
  emailAddress: string;
  bio?: string;
  watchedCount?: number;
  bookmarkedCount?: number;
  photoUrl?: string; // Avatar
  name?: string;
}
