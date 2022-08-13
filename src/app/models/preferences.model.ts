
export interface IPreferences {
  isDarkMode: boolean
  isEnableCache: boolean
  libraryFolders: string[]
  torrentSeedRatio: number
  torrentRatio?: any
  autoPlayTrailer: boolean
  playTrailerBeforeShow: boolean
  subtitle: ISubtitlePreferences
  hotKeys: IHotkeys
  playBack: IPlaybackPreferences
  library: ILibraryPreferences,
  streamPreferences?: IStreamPreferences
  autoScan : {
    enable: boolean
    frequencyUnit?: "day"|"minute"|"hour"|"week"
    frequencyValue?: number
  }
}

interface IStreamPreferences {
  downloadSpeed: number // in bps
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
  SD = '720p',
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
  playerHotkeys?: any

}

export interface ISubtitlePreferences {
  synchronization: number;
  fontColor: string;
  fontSize: string;
  fontOpacity?: number;
  textShadow: string;
  fontFamily?: string;
  backgroundColor: string;
  backgroundOpacity: string;
}
