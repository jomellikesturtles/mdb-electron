/**
 * Type-safe IPC Channel Registry
 * All values MUST match the lowercase kebab-case naming standard
 * used in src/assets/IPCRendererChannel.json and src/assets/IPCMainChannel.json.
 */

export enum RendererToMainChannels {
  SCAN_LIBRARY_START = 'scan-library-start',
  SCAN_LIBRARY_STOP = 'scan-library-stop',
  PLAY_TORRENT = 'play-torrent',
  STOP_STREAM = 'stop-stream',
  PLAY_OFFLINE_VIDEO_STREAM = 'play-offline-video-stream',
  PREFERENCES = 'preferences',
  PREFERENCES_GET = 'preferences-get',
  PREFERENCES_SET = 'preferences-set',
  USER_DATA = 'user-data',
  LIBRARY = 'library',
  PROFILE = 'profile',
  MINIMIZE_APP = 'app-min',
  RESTORE_APP = 'app-restore',
  EXIT_APP = 'exit-program',
  GET_SEARCH_LIST = 'get-search-list',
  GET_IMAGE = 'get-image',
  MOVIE_METADATA = 'movie-metadata',
  GET_SUBTITLE = 'get-subtitle',
  OPEN_FILE_EXPLORER = 'open-file-explorer'
}

export enum MainToRendererChannels {
  ScanLibraryResult = 'scan-library-result',
  ScanLibraryComplete = 'scan-library-complete',
  STREAM_LINK = 'stream-link',
  PREFERENCES_GET_COMPLETE = 'preferences-get-complete',
  PREFERENCES_SET_COMPLETE = 'preferences-set-complete',
  STATS = 'stats',
  SUBTITLE_PATH = 'subtitle-path',
  LIBRARY_FOLDERS = 'library-folders',
  SEARCH_LIST = 'search-list',
  MOVIE_METADATA_RESULT = 'movie-metadata-result',
  IMAGE_DATA_RESULT = 'image-data-result',
  ERROR = 'error'
}

/**
 * Maps channel names to request/response types.
 */
export interface ChannelSchema {
  [RendererToMainChannels.USER_DATA]: { req: any, res: any; };
  [RendererToMainChannels.LIBRARY]: { req: any, res: any; };
  // Add other channel mappings as needed
}
