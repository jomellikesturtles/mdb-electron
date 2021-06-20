
export interface IPreferences {
  isDarkMode: boolean
  isEnableCache: boolean
  libraryFolders: string[]
  torrentSeedRatio: number
  torrentRatio?: any
  subtitle: ISubtitlePreferences
  hotKeys: IHotkeys
  autoPlayTrailer: boolean
  playTrailerBeforeShow: boolean
  playBack: IPlaybackPreferences
  library: ILibraryPreferences,
  isAutoScan: boolean
  autoScanFrequencyUnit: string
  autoScanFrequencyValue: number
}

interface ILibraryPreferences {
  libraryPathList: string[]
  scanFrenquency: IScanFrequency
}

export interface IPlaybackPreferences {
  preferredQuality: Quality
  preferredMode: 'torrent' | 'offline'
  repeat: boolean
  volume: number
}

export enum Quality {
  SD = '4k',
  HD = '1080p',
  FHD = '1440p',
  FourK = '4k'
}
interface IScanFrequency {
  isScanAutomatically: boolean
  frequencyUnit: string
  frequencyValue: number
}

interface IHotkeys {

}

export interface ISubtitlePreferences {
  synchronization: number;
  fontColor: string;
  fontSize: string;
  fontOpacity?: number;
  textShadow: string;
  fontFamily?: string;
  backgroundColor: string;
  backgroundOpacity: number
}
