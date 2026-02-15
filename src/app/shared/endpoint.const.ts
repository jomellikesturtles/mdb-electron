export const REPLACE_PARAMETER = "mdb_parameter";
export const MDB_API_URL = 'mdb';
export const ENDPOINT = {
  MEDIA: `${MDB_API_URL}/media/`,
  MEDIA_ID: `${MDB_API_URL}/media/${REPLACE_PARAMETER}_1`,
  MEDIA_BOOKMARK: `${MDB_API_URL}/media/${REPLACE_PARAMETER}_1/bookmark`,
  MEDIA_REVIEW: `${MDB_API_URL}/media/${REPLACE_PARAMETER}_1/reviews`,
  MEDIA_FAVORITE: `${MDB_API_URL}/media/${REPLACE_PARAMETER}_1/favorite`,
  MEDIA_PROGRESS: `${MDB_API_URL}/media/${REPLACE_PARAMETER}_1/progress`,
  MEDIA_REVIEWS: `${MDB_API_URL}/media/${REPLACE_PARAMETER}_1/reviews`,

  STREAMS: `${MDB_API_URL}/media/${REPLACE_PARAMETER}_1/streams`,

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
  BOOKMARKS: `${MDB_API_URL}/bookmarks`,

  PROFILE: `${MDB_API_URL}/profile`,
  LOGIN: `${MDB_API_URL}/v1/auth/login`,
  ENCRYPT: `${MDB_API_URL}/v1/auth/encrypt`,
  DECRYPT: `${MDB_API_URL}/v1/auth/decrypt`,
  // LOGIN: `${MDB_API_URL}/basicAuthenticate`,
  LOGOUT: `${MDB_API_URL}/v1/auth/logout`,
  RESET: `${MDB_API_URL}/v1/auth/reset`,
  REGISTER: `${MDB_API_URL}/v1/auth/register`,

  ACTUATOR_HEALTH: `${MDB_API_URL}/actuator/health`,
  ACTUATOR_METRICS: `${MDB_API_URL}/actuator/metrics`,
  ACTUATOR_INFO: `${MDB_API_URL}/actuator/info`,
  ACTUATOR_AUTOCONFIG: `${MDB_API_URL}/actuator/autoconfig`,
  ACTUATOR_ENV: `${MDB_API_URL}/actuator/env`,
};

