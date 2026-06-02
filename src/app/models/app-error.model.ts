export interface IAppError {
  source: string; // e.g., 'main', 'webtorrent-worker', 'video-service'
  message: string;
  stack?: string;
  timestamp: number;
}
