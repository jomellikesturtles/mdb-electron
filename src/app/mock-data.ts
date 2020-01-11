/**
 * Mock data and Defaults. For pre-defined lists and offline data
 */

import { ITmdbResultObject, ILibraryMovie, IPreferences, IGenre, ITorrent, IOmdbMovieDetail } from './interfaces'
import { Injectable } from '@angular/core'

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
]

export const TEST_MOVIE_DETAIL = {
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
}

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
}

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
]

export const MOVIEGENRES = [
  { id: 1, code: 'ACT', description: 'Action', isChecked: true },
  { id: 2, code: 'ADV', description: 'Adventure', isChecked: false },
  { id: 3, code: 'DOC', description: 'Documentary', isChecked: false },
  { id: 4, code: 'DRA', description: 'Drama', isChecked: false },
  { id: 5, code: 'HOR', description: 'Horror', isChecked: false },
  { id: 6, code: 'SCI', description: 'Sci-Fi', isChecked: true },
  { id: 7, code: 'THR', description: 'Thriller', isChecked: false }
]

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
]
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
]

export const TORRENTS: ITorrent[] = [
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
]

@Injectable()
export class StartTimeStamp {
  private startTimeStamp: number
  setStartTimeStamp(val: number): void {
    this.startTimeStamp = val
  }
  getStartTimeStamp(): number {
    return this.startTimeStamp
  }
}

@Injectable()
export class DisplayedTorrents {
  private myDisplayedTorrents: DisplayedTorrent[]
  add(val: DisplayedTorrent) {
    val = new DisplayedTorrent()
    this.myDisplayedTorrents.push(val)
  }
  getDisplayedTorrents() {
    return this.myDisplayedTorrents
  }
}

@Injectable()
export class DisplayedTorrent {
  private added?: string
  private hash: string
  private name: string
  private size: number
  constructor(added?: string, hash?: string, name?: string, size?: number) {
    this.added = added
    this.hash = hash
    this.name = name
    this.size = size
  }
  getAdded(): string {
    return this.added
  }
  getHash(): string {
    return this.hash
  }
  getName(): string {
    return this.name
  }
  getSize(): number {
    return this.size
  }
}


export let TMDB_SEARCH_RESULTS: ITmdbResultObject = {
  page: 1,
  total_results: 3810,
  total_pages: 191,
  results: [
    {
      popularity: 47.572,
      vote_count: 13899,
      video: false,
      poster_path: '/9O7gLzmreU0nGkIB6K3BsJbzvNv.jpg',
      id: 278,
      adult: false,
      backdrop_path: '/j9XKiZrVeViAixVRzCta7h1VU9W.jpg',
      original_language: 'en',
      original_title: 'The Shawshank Redemption',
      genre_ids: [80, 18],
      title: 'The Shawshank Redemption',
      vote_average: 8.7,
      overview:
        'Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates -- including an older prisoner named Red -- for his integrity and unquenchable sense of hope.',
      release_date: '1994-09-23'
    },
    {
      popularity: 30.437,
      vote_count: 16212,
      video: false,
      poster_path: '/dM2w364MScsjFf8pfMbaWUcWrR.jpg',
      id: 680,
      adult: false,
      backdrop_path: '/4cDFJr4HnXN5AdPw4AKrmLlMWdO.jpg',
      original_language: 'en',
      original_title: 'Pulp Fiction',
      genre_ids: [80, 53],
      title: 'Pulp Fiction',
      vote_average: 8.4,
      overview:
        `A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.`,
      release_date: '1994-10-14'
    },
    {
      popularity: 30.008,
      vote_count: 10939,
      video: false,
      poster_path: '/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg',
      id: 8587,
      adult: false,
      backdrop_path: '/kZ9CKeZeKMUtrjZ7RuArjVMTDF4.jpg',
      original_language: 'en',
      original_title: 'The Lion King',
      genre_ids: [16, 18, 10751],
      title: 'The Lion King',
      vote_average: 8.2,
      overview:
        "A young lion cub named Simba can't wait to be king. But his uncle craves the title for himself and will stop at nothing to get it.",
      release_date: '1994-06-23'
    },
    {
      popularity: 34.399,
      id: 101,
      video: false,
      vote_count: 8176,
      vote_average: 8.3,
      title: 'Léon: The Professional',
      release_date: '1994-11-18',
      original_language: 'fr',
      original_title: 'Léon',
      genre_ids: [53, 80, 18],
      backdrop_path: '/dXQ7HILRK1Tg33RT64JwbQI7Osh.jpg',
      adult: false,
      overview:
        'Léon, the top hit man in New York, has earned a rep as an effective "cleaner". But when his next-door neighbors are wiped out by a loose-cannon DEA agent, he becomes the unwilling custodian of 12-year-old Mathilda. Before long, Mathilda\'s thoughts turn to revenge, and she considers following in Léon\'s footsteps.',
      poster_path: '/gE8S02QUOhVnAmYu4tcrBlMTujz.jpg',
      isAvailable: true
    },
    {
      popularity: 31.962,
      vote_count: 15752,
      video: false,
      poster_path: '/yE5d3BUhE8hCnkMUJOo1QDoOGNz.jpg',
      id: 13,
      adult: false,
      backdrop_path: '/wMgbnUVS9wbRGAdki8fqxKU1O0N.jpg',
      original_language: 'en',
      original_title: 'Forrest Gump',
      genre_ids: [35, 18, 10749],
      title: 'Forrest Gump',
      vote_average: 8.4,
      overview:
        'A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do. But despite all he has achieved, his one true love eludes him.',
      release_date: '1994-07-06'
    },
    {
      popularity: 24.394,
      vote_count: 5628,
      video: false,
      poster_path: '/v8x8p441l1Bep8p82pAG6rduBoK.jpg',
      id: 854,
      adult: false,
      backdrop_path: '/oYVf9gqxZduttG6HW2Qo4ZUxLWW.jpg',
      original_language: 'en',
      original_title: 'The Mask',
      genre_ids: [35, 80, 14, 10749],
      title: 'The Mask',
      vote_average: 6.8,
      overview:
        "When timid bank clerk Stanley Ipkiss discovers a magical mask containing the spirit of the Norse god Loki, his entire life changes. While wearing the mask, Ipkiss becomes a supernatural playboy exuding charm and confidence which allows him to catch the eye of local nightclub singer Tina Carlyle. Unfortunately, under the mask's influence, Ipkiss also robs a bank, which angers junior crime lord Dorian Tyrell, whose goons get blamed for the heist.",
      release_date: '1994-07-29'
    },
    {
      popularity: 26.233,
      vote_count: 4409,
      video: false,
      poster_path: '/bOtgcOIFBCUFdY2a737Na6gWQ0X.jpg',
      id: 408,
      adult: false,
      backdrop_path: '/c66otZnSdri67kR7ps92kRX849o.jpg',
      original_language: 'en',
      original_title: 'Snow White and the Seven Dwarfs',
      genre_ids: [16, 14, 10751],
      title: 'Snow White and the Seven Dwarfs',
      vote_average: 7,
      overview:
        'A beautiful girl, Snow White, takes refuge in the forest in the house of seven dwarfs to hide from her stepmother, the wicked Queen. The Queen is jealous because she wants to be known as "the fairest in the land," and Snow White\'s beauty surpasses her own.',
      release_date: '1937-12-21'
    },
    {
      popularity: 25.24,
      vote_count: 8547,
      video: false,
      poster_path: '/yPisjyLweCl1tbgwgtzBCNCBle.jpg',
      id: 424,
      adult: false,
      backdrop_path: '/cTNYRUTXkBgPH3wP3kmPUB5U6dA.jpg',
      original_language: 'en',
      original_title: "Schindler's List",
      genre_ids: [18, 36, 10752],
      title: "Schindler's List",
      vote_average: 8.6,
      overview:
        'The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis while they worked as slaves in his factory during World War II.',
      release_date: '1993-12-15'
    },
    {
      popularity: 20.34,
      vote_count: 7817,
      video: false,
      poster_path: '/jX94vnfcuJ8rTnFbsoriY6dlHrC.jpg',
      id: 500,
      adult: false,
      backdrop_path: '/fupyzBwFAn1PoeCXhp54bYVM2ER.jpg',
      original_language: 'en',
      original_title: 'Reservoir Dogs',
      genre_ids: [80, 53],
      title: 'Reservoir Dogs',
      vote_average: 8.2,
      overview:
        'A botched robbery indicates a police informant, and the pressure mounts in the aftermath at a warehouse. Crime begets violence as the survivors -- veteran Mr. White, newcomer Mr. Orange, psychopathic parolee Mr. Blonde, bickering weasel Mr. Pink and Nice Guy Eddie -- unravel.',
      release_date: '1992-10-23'
    },
    {
      popularity: 11.398,
      vote_count: 1295,
      video: false,
      poster_path: '/dnYXJZgstixBsOjF4JJrPCDRd2n.jpg',
      id: 888,
      adult: false,
      backdrop_path: '/vbWvWqZJiEiffj8xag0owDExRVg.jpg',
      original_language: 'en',
      original_title: 'The Flintstones',
      genre_ids: [35, 14, 10751],
      title: 'The Flintstones',
      vote_average: 5.2,
      overview:
        'Modern Stone Age family the Flintstones hit the big screen in this live-action version of the classic cartoon. Fred helps Barney adopt a child. Barney sees an opportunity to repay him when Slate Mining tests its employees to find a new executive. But no good deed goes unpunished.',
      release_date: '1994-05-26'
    },
    {
      popularity: 13.378,
      id: 9739,
      video: false,
      vote_count: 1801,
      vote_average: 6.5,
      title: 'Demolition Man',
      release_date: '1993-10-08',
      original_language: 'en',
      original_title: 'Demolition Man',
      genre_ids: [80, 28, 878],
      backdrop_path: '/2p5rA1NRoyyAFfzdHl1Ab1RN3qr.jpg',
      adult: false,
      overview:
        'Simon Phoenix, a violent criminal cryogenically frozen in 1996, escapes during a parole hearing in 2032 in the utopia of San Angeles. Police are incapable of dealing with his violent ways and turn to his captor, who had also been cryogenically frozen after being wrongfully accused of killing 30 innocent people while apprehending Phoenix.',
      poster_path: '/k0PN3Ho12cGGIVJW7SCS7apLYaP.jpg'
    },
    {
      popularity: 13.039,
      vote_count: 2070,
      video: false,
      poster_path: '/mTAHr5h5i64hTLqo0cW2X2083Cx.jpg',
      id: 36955,
      adult: false,
      backdrop_path: '/o2agns0LEqyEUCByMT8ViIOio7r.jpg',
      original_language: 'en',
      original_title: 'True Lies',
      genre_ids: [28, 53],
      title: 'True Lies',
      vote_average: 6.9,
      overview:
        'Harry Tasker is a secret agent for the United States Government. For years, he has kept his job from his wife, but is forced to reveal his identity and try to stop nuclear terrorists when he and his wife are kidnapped by them.',
      release_date: '1994-07-15'
    },
    {
      popularity: 16.688,
      vote_count: 2909,
      video: false,
      poster_path: '/3LudCahifOrueMklYBxAXY2wpBg.jpg',
      id: 10112,
      adult: false,
      backdrop_path: '/fojdVtSsZa7fXyJQ6w1Exw7GWum.jpg',
      original_language: 'en',
      original_title: 'The Aristocats',
      genre_ids: [12, 16, 35, 10751],
      title: 'The Aristocats',
      vote_average: 7.3,
      overview:
        'When Madame Adelaide Bonfamille leaves her fortune to Duchess and her children—Bonfamille’s beloved family of cats—the butler plots to steal the money and kidnaps the legatees, leaving them out on a country road. All seems lost until the wily Thomas O’Malley Cat and his jazz-playing alley cats come to the aristocats’ rescue.',
      release_date: '1970-12-24'
    },
    {
      popularity: 20.126,
      vote_count: 4866,
      video: false,
      poster_path: '/3FS3oBdorgczgfCkFi2u8ZTFfpS.jpg',
      id: 620,
      adult: false,
      backdrop_path: '/qmDy6Rdom8d8UFj9GeAAtVIjTRT.jpg',
      original_language: 'en',
      original_title: 'Ghostbusters',
      genre_ids: [35, 14],
      title: 'Ghostbusters',
      vote_average: 7.4,
      overview:
        'After losing their academic posts at a prestigious university, a team of parapsychologists goes into business as proton-pack-toting "ghostbusters" who exterminate ghouls, hobgoblins and supernatural pests of all stripes. An ad campaign pays off when a knockout cellist hires the squad to purge her swanky digs of demons that appear to be living in her refrigerator.',
      release_date: '1984-06-08'
    },
    {
      popularity: 15.25,
      id: 2758,
      video: false,
      vote_count: 1312,
      vote_average: 6.7,
      title: 'Addams Family Values',
      release_date: '1993-11-19',
      original_language: 'en',
      original_title: 'Addams Family Values',
      genre_ids: [35, 10751, 14],
      backdrop_path: '/i84FfYcljpH9FOO26PdvBWzLGRl.jpg',
      adult: false,
      overview:
        'Siblings Wednesday and Pugsley Addams will stop at nothing to get rid of Pubert, the new baby boy adored by parents Gomez and Morticia. Things go from bad to worse when the new "black widow" nanny, Debbie Jellinsky, launches her plan to add Fester to her collection of dead husbands.',
      poster_path: '/fM10xl2GqeCfrSJhqhbYGaAeRUP.jpg'
    },
    {
      popularity: 18.017,
      vote_count: 3184,
      video: false,
      poster_path: '/wV9e2y4myJ4KMFsyFfWYcUOawyK.jpg',
      id: 3170,
      adult: false,
      backdrop_path: '/zM2Rdsh4kiTEXPkkO9lWBzZpwAH.jpg',
      original_language: 'en',
      original_title: 'Bambi',
      genre_ids: [16, 18, 10751],
      title: 'Bambi',
      vote_average: 6.9,
      overview:
        `Bambi's tale unfolds from season to season as the young prince of the forest learns about life, love, and friends.`,
      release_date: '1942-08-21'
    },
    {
      popularity: 13.155,
      vote_count: 461,
      video: false,
      poster_path: '/biH5hW1BRfEr13oCizuAzpdBf2l.jpg',
      id: 10438,
      adult: false,
      backdrop_path: '/1MaJH9m8TfmwLgS98kcjU4faiMg.jpg',
      original_language: 'en',
      original_title: "Beethoven's 2nd",
      genre_ids: [35, 10751],
      title: "Beethoven's 2nd",
      vote_average: 5.2,
      overview:
        `Beethoven is back -- and this time, he has a whole brood with him now that he's met his canine match, Missy, and fathered a family. The only problem is that Missy's owner, Regina, wants to sell the puppies and tear the clan apart. It's up to Beethoven and the Newton kids to save the day and keep everyone together.`,
      release_date: '1993-12-16'
    },
    {
      popularity: 13.779,
      id: 44251,
      video: false,
      vote_count: 281,
      vote_average: 6.5,
      title: 'Dragon Ball Z: Broly – Second Coming',
      release_date: '1994-03-12',
      original_language: 'ja',
      original_title: 'ドラゴンボールＺ 危険なふたり！超戦士はねむれない',
      genre_ids: [28, 16, 878],
      backdrop_path: '/d0A7xd5Qnm6CCH25HXKHmcBDmmm.jpg',
      adult: false,
      overview:
        'A Saiyan Space pod crash-lands on Earth out of which a wounded Saiyan crawls: Broly, the Legendary Super Saiyan. The wounded Broly shouts out in frustration and turns into normal form. The place soon freezes, trapping him in it and he falls into a coma.',
      poster_path: '/4CkArpSqySpBQH95Oqr94ktU6rU.jpg'
    },
    {
      popularity: 14.604,
      vote_count: 3268,
      video: false,
      poster_path: '/u5ZqizbcZ0RZhVqmu8lSU4SARBT.jpg',
      id: 1637,
      adult: false,
      backdrop_path: '/pGVpDc6MgLRtOYdxsA5fhj1SZki.jpg',
      original_language: 'en',
      original_title: 'Speed',
      genre_ids: [28, 12, 80],
      title: 'Speed',
      vote_average: 6.9,
      overview:
        `Los Angeles SWAT cop Jack Traven is up against bomb expert Howard Payne, who's after major ransom money. First it's a rigged elevator in a very tall building. Then it's a rigged bus--if it slows, it will blow, bad enough any day, but a nightmare in LA traffic. And that's still not the end.`,
      release_date: '1994-06-09'
    },
    {
      popularity: 21.341,
      vote_count: 4964,
      video: false,
      poster_path: '/6oxkO1VgKCq74fNILKAg6t2dVEt.jpg',
      id: 9479,
      adult: false,
      backdrop_path: '/16lk65YfrDFIr6evkWRjSeOOSws.jpg',
      original_language: 'en',
      original_title: 'The Nightmare Before Christmas',
      genre_ids: [16, 14, 10751],
      title: 'The Nightmare Before Christmas',
      vote_average: 7.8,
      overview:
        `Tired of scaring humans every October 31 with the same old bag of tricks, Jack Skellington, the spindly king of Halloween Town, kidnaps Santa Claus and plans to deliver shrunken heads and other ghoulish gifts to children on Christmas morning. But as Christmas approaches, Jack's rag-doll girlfriend, Sally, tries to foil his misguided plans.`,
      release_date: '1993-10-09'
    }
  ]
}

export const TEST_TMDB_MOVIE_DETAILS = {
  adult: false,
  backdrop_path: '/wMgbnUVS9wbRGAdki8fqxKU1O0N.jpg',
  belongs_to_collection: null,
  budget: 55000000,
  genres: [{
    id: 35,
    name: 'Comedy'
  }, {
    id: 18,
    name: 'Drama'
  }, {
    id: 10749,
    name: 'Romance'
  }],
  homepage: null,
  id: 13,
  imdb_id: 'tt0109830',
  original_language: 'en',
  original_title: 'Forrest Gump',
  overview: 'A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do. But despite all he has achieved, his one true love eludes him.',
  popularity: 23.858,
  poster_path: '/yE5d3BUhE8hCnkMUJOo1QDoOGNz.jpg',
  production_companies: [{
    id: 4,
    logo_path: '/fycMZt242LVjagMByZOLUGbCvv3.png',
    name: 'Paramount',
    origin_country: 'US'
  }],
  production_countries: [{
    iso_3166_1: 'US',
    name: 'United States of America'
  }],
  release_date: '1994-07-06',
  revenue: 677945399,
  runtime: 142,
  spoken_languages: [{
    iso_639_1: 'en',
    name: 'English'
  }],
  status: 'Released',
  tagline: `Life is like a box of chocolates...you never know what you're gonna get.`,
  title: 'Forrest Gump',
  video: false,
  vote_average: 8.4,
  vote_count: 15996
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
}


export const DEFAULT_PREFERENCES: IPreferences = {
  frequencyUnit: 'day',
  frequencyValue: 3,
  isDarkMode: false,
  isDirty: false,
  isEnableCache: true,
  libraryFolders: []
}
