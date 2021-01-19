
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
  playBack: IPlayback
  library: ILibraryPreferences
}

interface ILibraryPreferences {
  libraryPathList: string[]
  scanFrenquency: IScanFrequency
}

interface IPlayback {
  preferredQuality: string
  preferredMode: 'torrent' | 'offline'
  repeat: boolean
}

interface IScanFrequency {
  isScanAutomatically: boolean
  frequencyUnit: string
  frequencyValue: number
}

interface IHotkeys {

}

interface ISubtitlePreferences {
  synchronization: number;
  color: string;
  backgroundColor: string;
  fontSize: string;
}
