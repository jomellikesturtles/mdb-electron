/**
 * Mock data and Defaults. For pre-defined lists and offline data
 */

import { ILibraryMovie, MDBTorrent, IOmdbMovieDetail } from '@models/interfaces';
import { Injectable } from '@angular/core';

export const TEST_LIBRARY_MOVIES: ILibraryMovie[] = [
  {
    tmdbId: 0,
    imdbId: 'tt0095956',
    title: 'Titanic',
    year: 0,
    directory: ['D:\\media server\\movies\\titanic.mp4']
  },
  {
    tmdbId: 0,
    imdbId: 'tt0133093',
    title: 'Guardians of the Galaxy',
    year: 0,
    directory: ['D:\\media server\\movies\\guardians of the galaxy.mp4']
  },
  {
    tmdbId: 680,
    imdbId: 'tt0110912',
    title: 'Pulp Fiction',
    year: 1994,
    directory: ['D:\\media server\\movies\\pulp fiction.mp4']
  }
];

export const TEST_OMDB_MOVIE_DETAIL = {
  Title: 'WALL·E',
  Year: '2008',
  Rated: 'G',
  Released: '27 Jun 2008',
  Runtime: '98 min',
  Genre: 'Animation, Adventure, Family, Sci-Fi',
  Director: 'Andrew Stanton',
  Writer:
    'Andrew Stantoyzn (original story by), Pete Docter (original story by), Andrew Stanton (screenplay by), Jim Reardon (screenplay by)',
  Actors: 'Ben Burtt, Elissa Knight, Jeff Garlin, Fred Willard',
  Plot:
    'In the distant future, a small waste-collecting robot inadvertently embarks on a space journey that will ultimately decide the fate of mankind.',
  Language: 'English',
  Country: 'USA',
  Awards: 'Won 1 Oscar. Another 89 wins & 90 nominations.',
  Poster:
    'https://m.media-amazon.com/images/M/MV5BMjExMTg5OTU0NF5BMl5BanBnXkFtZTcwMjMxMzMzMw@@._V1_SX300.jpg',
  Ratings: [
    {
      Source: 'Internet Movie Database',
      Value: '8.4/10'
    },
    {
      Source: 'Rotten Tomatoes',
      Value: '95%'
    },
    {
      Source: 'Metacritic',
      Value: '95/100'
    }
  ],
  Metascore: '95',
  imdbRating: '8.4',
  imdbVotes: '919,942',
  imdbID: 'tt0910970',
  Type: 'movie',
  DVD: '18 Nov 2008',
  BoxOffice: '$223,749,872',
  Production: 'Walt Disney Pictures',
  Website: 'http://www.wall-e.com/',
  Response: 'True'
};

export const MOCK_MOVIE_DETAIL = {
  id: 1,
  Title: 'Reservoir Dogs',
  Year: 1992,
  Plot:
    `Eight men eat breakfast at a Los Angeles diner before carrying out a diamond heist. Mob boss Joe Cabot and his son and underboss 'Nice Guy' Eddie Cabot are responsible for planning the job. The rest of the men use aliases issued by Joe Cabot: Mr. Brown, Mr. White, Mr. Blonde, Mr. Blue, Mr. Orange and Mr. Pink.`,
  genre: '',
  isAvailable: true,
  imageDirectory: '',
  Runtime: '99',
  Genre: 'Adventure',
  Director: 'Quentin Tarantino',
  Writer: 'Quentin Tarantino',
  Poster: '',
  torrents: '',
  backgroundImageDirectory: ''
};

export const MOCK_BULK_DOWNLOAD_TORRENTS = [
  {
    id: 1,
    name: 'Guardians of the Galaxy (2014) 1080p BrRip x264 - YIFY',
    size: 1988939229,
    hash: '11A2AC68A11634E980F265CB1433C599D017A759',
    checked: false
  },
  {
    id: 1,
    name: 'Guardians of the Galaxy Vol. 2 (2017) 720p BrRip x264 - VPPV',
    size: 1215947108,
    hash: '68132C479348C1AA2618D55C8BBEC6EB2597A5BA',
    checked: false
  },
  {
    id: 1,
    name: 'The.Wailing.2016.1080p.BluRay.10bit.HEVC-MkvCage [aka Gokseong]',
    size: 3976321027,
    hash: '2F157306E5114EA8044302586A89FDC4E0FAC2A1',
    checked: false
  },
  {
    id: 1,
    name: 'First.Man.2018.HC.HDRip.XviD.AC3-EVO',
    size: 1474599225,
    hash: '885CCCAD7F1942A515DA564FCF62933A105931DB',
    checked: false
  },
  {
    id: 2,
    name: 'First.Man.2018.720p.BRRip.x264.MkvCage',
    size: 1375985558,
    hash: '712837DCAA3F4275B89E640EB21DAE72D2E0C38B',
    checked: false
  },
  {
    id: 1,
    name: 'Home Alone (1990) 1080p BrRip x264 - YIFY',
    size: 1767740507,
    hash: '5FEFAC61C0F42FFC43946B3379A540D1A38F6480',
    checked: false
  }
];

export const MOVIEGENRES = [
  { id: 1, code: 'ACT', description: 'Action', isChecked: true },
  { id: 2, code: 'ADV', description: 'Adventure', isChecked: false },
  { id: 3, code: 'DOC', description: 'Documentary', isChecked: false },
  { id: 4, code: 'DRA', description: 'Drama', isChecked: false },
  { id: 5, code: 'HOR', description: 'Horror', isChecked: false },
  { id: 6, code: 'SCI', description: 'Sci-Fi', isChecked: true },
  { id: 7, code: 'THR', description: 'Thriller', isChecked: false }
];

export let DISPLAYEDMOVIES = [
  {
    title: 'Guardians of the Galaxy',
    year: 2014,
    plot:
      'A group of intergalactic criminals must pull together to stop a fanatical warrior with plans to purge the universe.',
    imdbId: 'tt2015381',
    torrents: [],
    id: 118340
  },
  {
    title: 'The Wailing',
    year: 2016,
    plot:
      'Soon after a stranger arrives in a little village, a mysterious sickness starts spreading. A policeman, drawn into the incident, is forced to solve the mystery in order to save his daughter.',
    imdbId: 'tt5215952',
    torrents: [],
    id: 293670
  },
  {
    title: 'First Man',
    year: 2018,
    plot:
      'A look at the life of the astronaut, Neil Armstrong, and the legendary space mission that led him to become the first man to walk on the Moon on July 20, 1969.',
    imdbId: 'tt1213641',
    torrents: [],
    id: 369972
  },
  {
    title: 'The Karate Kid',
    year: 1984,
    plot:
      'A Japanese martial arts instructor agrees to teach karate to a bullied teenager.',
    imdbId: 'tt0087538',
    torrents: [],
    id: 1885
  },
  {
    title: 'Top Gun',
    year: 1986,
    plot: `As students at the United States Navys elite fighter weapons school compete to be best in the class, one daring young pilot learns a few things from a civilian instructor that are not taught in the classroom.
    `,
    imdbId: 'tt0092099',
    torrents: [],
    id: 744
  },
  {
    title: 'Reservoir Dogs',
    year: 1992,
    plot:
      'When a simple jewelry heist goes horribly wrong, the surviving criminals begin to suspect that one of them is a police informant.',
    imdbId: 'tt0105236',
    torrents: [],
    id: 500
  },
  {
    title: 'Spider-Man',
    year: 2002,
    plot:
      'When bitten by a genetically modified spider, a nerdy, shy, and awkward high school student gains spider-like abilities that he eventually must use to fight evil as a superhero after tragedy befalls his family.',
    imdbId: 'tt0145487',
    torrents: [],
    id: 557
  },
  {
    title: 'Superman Returns',
    year: 2006,
    plot:
      'Superman returns to Earth after spending five years in space examining his homeworld Krypton. But he finds things have changed while he was gone, and he must once again prove himself important to the world.',
    imdbId: 'tt0348150',
    torrents: [],
    id: 1452
  },
  {
    title: 'Home Alone',
    year: 1990,
    plot:
      'An eight-year-old troublemaker must protect his house from a pair of burglars when he is accidentally left home alone by his family during Christmas vacation.',
    imdbId: 'tt0099785',
    torrents: [],
    id: 771
  }
];
// used in top-nav for search
export const MOVIES: IOmdbMovieDetail[] = [
  // { id: 1, Title: 'Face Off', Year: 1997, Plot: '', genre: 'Action', isAvailable: false, imageDirectory: './assets/images/1997-face-off-poster1.jpg', Runtime: '156', Genre: '', Director: '', Writer: '', Poster: '', imdbID: '' },
  // { id: 2, Title: 'Nacho Libre', Year: 2006, Plot: '', genre: 'Comedy', isAvailable: true, imageDirectory: './assets/images/2006-nacho_libre-1.jpg', Runtime: '120', Genre: '', Director: '', Writer: '', Poster: '', imdbID: '' },
  // { id: 3, Title: 'Salt', Year: 2006, Plot: '', genre: 'Action', isAvailable: false, imageDirectory: './assets/images/2006-salt-1.jpg', Runtime: '110', Genre: '', Director: '', Writer: '', Poster: '', imdbID: '' },
  // { id: 4, Title: 'Valkyrie', Year: 2008, Plot: '', genre: 'Action', isAvailable: true, imageDirectory: './assets/images/2008-valkyrie-1.jpg', Runtime: '124', Genre: '', Director: '', Writer: '', Poster: '', imdbID: '' },
  // { id: 5, Title: 'Jaws 2', Year: 1978, Plot: '', genre: 'Thriller', isAvailable: false, imageDirectory: './assets/images/1978-jaws_2.jpg', Runtime: '120', Genre: '', Director: '', Writer: '', Poster: '', imdbID: '' },
  // { id: 6, Title: 'Paper Towns', Year: 2015, Plot: '', genre: 'Drama', isAvailable: true, imageDirectory: './assets/images/2015-paper_towns.jpg', Runtime: '120', Genre: '', Director: '', Writer: '', Poster: '', imdbID: '' },
  // { id: 7, Title: 'Good Morning Vietnam', Year: 1987, Plot: '', genre: 'Action', isAvailable: false, imageDirectory: './assets/images/1987-good_morning_vietnam.jpg', Runtime: '120', Genre: '', Director: '', Writer: '', Poster: '', imdbID: '' },
  // { id: 8, Title: 'Three Musketeers', Year: 2011, Plot: '', genre: 'Action', isAvailable: true, imageDirectory: './assets/images/2011-three_musketeers.jpg', Runtime: '180', Genre: '', Director: '', Writer: '', Poster: '', imdbID: '' }
];

export const TORRENTS: MDBTorrent[] = [
  //   {
  //   id: 1,
  //   name: 'Valkyrie.DVD-R.NTSC.2008',
  //   size: 4681064562,
  //   hash: 'hh9rPLQdJPYDq/dmDuTMogqQYDk='
  // },
  // {
  //   id: 1,
  //   name: 'Valkyrie.2008.Bluray.1080p.DTS-HD.x264-Grym',
  //   size: 21702179889,
  //   hash: '8KBwA9eFjEJgN6/RZSSJP80t91s='
  // },
  // {
  //   id: 1,
  //   name: 'Valkyrie.2008.BluRay.1080p.x264.AAC.5.1.-.Hon3y',
  //   size: 2996573771,
  //   hash: 'HHn7J1vN1Y8nGXJqVz0ZrgwWeJE='
  // }, {
  //   id: 1,
  //   name: 'Valkyrie (2008) 1080p BrRip x264 - 1.70GB - YIFY',
  //   size: 1827526513,
  //   hash: 'lop06WdSY2yjNig+yeQrj1wm6jY='
  // },
];

@Injectable()
export class StartTimeStamp {
  private startTimeStamp: number;
  setStartTimeStamp(val: number): void {
    this.startTimeStamp = val;
  }
  getStartTimeStamp(): number {
    return this.startTimeStamp;
  }
}

@Injectable()
export class DisplayedTorrents {
  private myDisplayedTorrents: DisplayedTorrent[];
  // add(val: DisplayedTorrent) {
  //   val = new DisplayedTorrent()
  //   this.myDisplayedTorrents.push(val)
  // }
  getDisplayedTorrents() {
    return this.myDisplayedTorrents;
  }
}

// @Injectable()
export class DisplayedTorrent {
  private added?: string;
  private hash: string;
  private name: string;
  private size: number;
  constructor(added: string, hash: string, name?: string, size?: number) {
    this.added = added;
    this.hash = hash;
    this.name = name;
    this.size = size;
  }
  getAdded(): string {
    return this.added;
  }
  getHash(): string {
    return this.hash;
  }
  getName(): string {
    return this.name;
  }
  getSize(): number {
    return this.size;
  }
}

const TEST_TMDB_MOVIE_DETAIL2 = {
  adult: false,
  backdrop_path: '/mMZRKb3NVo5ZeSPEIaNW9buLWQ0.jpg',
  belongs_to_collection: null,
  budget: 63000000,
  genres: [
    {
      id: 18,
      name: 'Drama'
    }
  ],
  homepage: 'http://www.foxmovies.com/movies/fight-club',
  id: 550,
  imdb_id: 'tt0137523',
  original_language: 'en',
  original_title: 'Fight Club',
  overview: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground \'fight clubs\' forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.',
  popularity: 36.556,
  poster_path: '/adw6Lq9FiC9zjYEpOqfq03ituwp.jpg',
  production_companies: [
    {
      id: 508,
      logo_path: '/7PzJdsLGlR7oW4J0J5Xcd0pHGRg.png',
      name: 'Regency Enterprises',
      origin_country: 'US'
    },
    {
      id: 711,
      logo_path: '/tEiIH5QesdheJmDAqQwvtN60727.png',
      name: 'Fox 2000 Pictures',
      origin_country: 'US'
    },
    {
      id: 20555,
      logo_path: '/hD8yEGUBlHOcfHYbujp71vD8gZp.png',
      name: 'Taurus Film',
      origin_country: 'DE'
    },
    {
      id: 54051,
      logo_path: null,
      name: 'Atman Entertainment',
      origin_country: ''
    },
    {
      id: 54052,
      logo_path: null,
      name: 'Knickerbocker Films',
      origin_country: 'US'
    },
    {
      id: 25,
      logo_path: '/qZCc1lty5FzX30aOCVRBLzaVmcp.png',
      name: '20th Century Fox',
      origin_country: 'US'
    },
    {
      id: 4700,
      logo_path: '/A32wmjrs9Psf4zw0uaixF0GXfxq.png',
      name: 'The Linson Company',
      origin_country: ''
    }
  ],
  production_countries: [
    {
      iso_3166_1: 'DE',
      name: 'Germany'
    },
    {
      iso_3166_1: 'US',
      name: 'United States of America'
    }],
  release_date: '1999-10-15',
  revenue: 100853753,
  runtime: 139,
  spoken_languages: [
    {
      iso_639_1: 'en',
      name: 'English'
    }
  ],
  status: 'Released',
  tagline: 'Mischief. Mayhem. Soap.',
  title: 'Fight Club',
  video: false,
  vote_average: 8.4,
  vote_count: 17355
};
