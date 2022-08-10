import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  logLevel = new LogLevel()
  constructor(
  ) { }

  // reference
  // https://www.codemag.com/article/1711021/Logging-in-Angular-Applications
  log(msg: string): void {
    this.logWith(this.logLevel.None, msg);
  }

  info(msg: string): void {
    this.logWith(this.logLevel.Info, msg);
  }

  warn(msg: string): void {
    this.logWith(this.logLevel.Warn, msg);
  }

  error(msg: string): void {
    this.logWith(this.logLevel.Error, msg);
  }

  private logWith(level: any, msg: string): void {
    const timestamp = "[DEBUG " + new Date().toLocaleString() + "]"
    if (level <= this.logLevel.Error) {
      switch (level) {
        case this.logLevel.None:
          return console.log(timestamp + msg);
        case this.logLevel.Info:
          return console.info(timestamp + '%c' + msg, 'color: #6495ED');
        case this.logLevel.Warn:
          return console.warn(timestamp + '%c' + msg, 'color: #FF8C00');
        case this.logLevel.Error:
          return console.error(timestamp + '%c' + msg, 'color: #DC143C');
        default:
          console.debug(timestamp + msg);
      }
    }
  }
}

class LogLevel {
  None = 0;
  Info = 1;
  Verbose = 2;
  Warn = 3;
  Error = 4;
  Fatal = 5;
  Off = 6
}