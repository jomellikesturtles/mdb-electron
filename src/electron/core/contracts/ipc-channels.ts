/**
 * Type-safe IPC Channel Registry
 */

export enum RendererToMainChannels {
  SCAN_LIBRARY_START = 'SCAN_LIBRARY_START',
  SCAN_LIBRARY_STOP = 'SCAN_LIBRARY_STOP',
  PLAY_TORRENT = 'PLAY_TORRENT',
  STOP_STREAM = 'STOP_STREAM',
  PLAY_OFFLINE_VIDEO_STREAM = 'PLAY_OFFLINE_VIDEO_STREAM',
  PREFERENCES = 'PREFERENCES',
  USER_DATA = 'USER_DATA',
  LIBRARY = 'library',
  PROFILE = 'profile',
}

export enum MainToRendererChannels {
  ScanLibraryResult = 'ScanLibraryResult',
  ScanLibraryComplete = 'ScanLibraryComplete',
  STREAM_LINK = 'stream-link',
  PREFERENCES_GET_COMPLETE = 'PREFERENCES_GET_COMPLETE',
  STATS = 'STATS',
  SUBTITLE_PATH = 'subtitle-path'
}

/**
 * Maps channel names to request/response types.
 */
export interface ChannelSchema {
  [RendererToMainChannels.USER_DATA]: { req: any, res: any };
  [RendererToMainChannels.LIBRARY]: { req: any, res: any };
  // Add other channel mappings as needed
}
