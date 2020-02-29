import { BookmarkService } from './services/bookmark.service';

/**
 * Action class that adds movie to selected list.
 */
export class AddMovie {
  static readonly type = '[movie] add movie'
  constructor(public payload: any) { }
}

export class RemoveMovie {
  static readonly type = '[movie] remove movie'
  constructor(public payload: any) { }
}

export class ClearList {
  static readonly type = '[movie] start over';
}

export class AddWatched {
  static readonly type = '[movie] add watched'
  constructor() { }
}

export class AddBookmark {
  static readonly type = '[movie] add bookmark'
  constructor() { }
}
