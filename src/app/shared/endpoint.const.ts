export const REPLACE_PARAMETER = "mdb_parameter";
export const MDB_API_URL = 'mdb';
export const ENDPOINT = {
  MEDIA: `${MDB_API_URL}/media/`,
  MEDIA_ID: `${MDB_API_URL}/media/${REPLACE_PARAMETER}_1`,
  MEDIA_BOOKMARK: `${MDB_API_URL}/media/${REPLACE_PARAMETER}_1/bookmark`,
  MEDIA_REVIEW: `${MDB_API_URL}/media/${REPLACE_PARAMETER}_1/review`,
  MEDIA_FAVORITE: `${MDB_API_URL}/media/${REPLACE_PARAMETER}_1/favorite`,
  MEDIA_PROGRESS: `${MDB_API_URL}/media/${REPLACE_PARAMETER}_1/progress`,
  MEDIA_REVIEWS: `${MDB_API_URL}/media/${REPLACE_PARAMETER}_1/reviews`,

  // MEDIA_LISTS: `/media/${REPLACE_PARAMETER}_1/lists`,
  USER_ID: `${MDB_API_URL}/user/${REPLACE_PARAMETER}_1`,
  USER_FAVORITES: `${MDB_API_URL}/user/${REPLACE_PARAMETER}_1/favorites`,
  USER_BOOKMARKS: `${MDB_API_URL}/user/${REPLACE_PARAMETER}_1/bookmarks`,
  USER_LISTS: `${MDB_API_URL}/user/${REPLACE_PARAMETER}_1/lists`,
  USER_PLAYS: `${MDB_API_URL}/user/${REPLACE_PARAMETER}_1/played`,
  USER_PROGRESS: `${MDB_API_URL}/user/${REPLACE_PARAMETER}_1/progress`,
  LIST: `${MDB_API_URL}/list`,
  LIST_ID: `${MDB_API_URL}/list/${REPLACE_PARAMETER}_1`,


  PLAYED: `${MDB_API_URL}/played`,
  PROGRESS: `${MDB_API_URL}/progress`,
  FAVORITES: `${MDB_API_URL}/favorites`,
  BOOKMARKS: `${MDB_API_URL}/bookmarks`
};

