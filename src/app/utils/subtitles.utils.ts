
import { Subtitle } from '@models/subtitle.model';

export default class SubtitlesUtil {

  private static subtitlePattern = /(\d+)\n([\d:.,]+)\s+-{2}\>\s+([\d:.,]+)\n([\s\S]*?(?=\n{2}|$))\n([\s\S]*?(?=\n{2}|$))/gm
  /**
   * !TODO: handle/ignore formatting like 00:00:00.000 --> 00:00:04.000 `position:10%`
   * !TODO: handle dynamic number of captions
   * @param resultFile
   */
  static mapSubtitle(resultFile: string): Map<number, Subtitle> {
    let subtitleMap = new Map<number, Subtitle>();
    let matches
    while ((matches = SubtitlesUtil.subtitlePattern.exec(resultFile)) != null) {
      const sub = this.toSubtitleObj(matches);
      subtitleMap.set(sub.sequenceNo, sub)
    }
    console.log(subtitleMap)
    return subtitleMap
  }

  static toSubtitleObj(group: any[]): Subtitle {
    return {
      sequenceNo: group[1],
      startTime: group[2],
      endTime: group[3],
      captionText1: group[4],
      captionText2: group[5]
    };
  }

}
