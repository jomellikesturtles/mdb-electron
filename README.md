# MdbElectron

jomellikesturtles mdb-electron

![Github code size](https://img.shields.io/github/languages/code-size/jomellikesturtles/mdb-electron) ![GitHub repo size](https://img.shields.io/github/repo-size/jomellikesturtles/mdb-electron) ![GitHub last commit](https://img.shields.io/github/last-commit/jomellikesturtles/mdb-electron) ![electron version](https://img.shields.io/npm/v/electron) ![commit per year](https://img.shields.io/github/commit-activity/y/jomellikesturtles/mdb-electron)

movie-db-ui on electron framework
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.9.

## Table of Contents

> This readme may have alot of contents

- [Prerequisites](#prerequisites)
- [Built with](#built-with)
- [How to run](#how-to-run)
- [Installation](#installation)
- [Offline Assets](#offline-assets)
- [Development Notes](#development-notes)
  - [APIs](#apis)
- [Features](#features)
- [Project Structure](#project-structure)
- [Clone](#clone)
- [Todo](#todo)
- [Branches](#branches)
- [Project Status](#project-status)
- [FAQ](#faq)

## Built with

- Angular 7
- Electronjs
- Bootstrap 4
- jquery
- nodejs libraries
  - Nedb
  - fast-levenshtein
  - xml2js
  - papaparse
  - nedb
  - webtorrent

## How To run

### Run as electron project

1. type `electron .` to run as electron project
2. type `npm run electron` to run as electron project

### Run as angular project

1. comment/remove ipcRenderer related lines to make it run for localhost:4200

2. type `npm start` to start as angular project

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Project Structure

- Routing
  - ![routing flowchart](./src/assets/readme-attachments/app-flowchart.png)
- Services
  - data
    - passing/sharing global variables
  - file
    - getting torrent info from offline dump
  - torrent
    - getting and setting torrents from API and offline file
  - movie
    - getting movie info from online API and offline imdb
- Components
  - movie-info
    - ![movie-info-ui](./src/assets/readme-attachments/movie-info-layout.png)
  - search and results
  - dashboard
  - preferences
- child-procesess
  - config-db-service
  - library-db-service
  - search-movie
  - search-torrent
  - scan-library

## Development Notes

APIs, image size

### APIs

These are APIs used/will be used in this project

#### OMDb

The OMDb API is a RESTful web service to obtain movie information, all content and images on the site are contributed and maintained by our users

- [How to use](http://www.omdbapi.com/)
- Key `3a2fe8bf or 2d83dae7-cb8f-41a3-9a08-110f8467c920`
- Examples

```
http://www.omdbapi.com/?i=tt3896198&apikey=3a2fe8bf
```

```
http://www.omdbapi.com/?t=guardians+of+the+galaxy
```

#### themoviedb

The Movie Database (TMDb) is a popular, user editable database for movies and TV shows.

- Key `a636ce7bd0c125045f4170644b4d3d25`
- [How to use 1](https://developers.themoviedb.org/3/)
- [How to use 2](https://www.themoviedb.org/documentation/api)
- Examples

```
https://api.themoviedb.org/3/movie/550?api_key=a636ce7bd0c125045f4170644b4d3d25
https://api.themoviedb.org/3/movie/550/videos?api_key=a636ce7bd0c125045f4170644b4d3d25
```

#### Google

Google API enables the use of Youtube API for trailer previews.

- Key `AIzaSyDkYv-R1piKWj-SOgUru0zYlc5zXkG9Jy0`
- [How to use](https://developers.google.com/youtube/v3/getting-started)
  - Examples

```
https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&key=YOUR_API_KEY
```

#### YTS

yts.ag or yts.am returns movie info with torrent links and youtube trailer url

- [How to use](https://yts.am/api)
- Examples

```
https://yts.am/api/v2/movie_details.json?movie_id=10
```

```
https://yts.am/api/v2/movie_details.json?movie_id=15&with_images=true&with_cast=true
```

#### imdb offline database

If online APIs go down, this is the last option. **Note:** this is updated daily by imdb

- [How to use](https://www.imdb.com/interfaces/)
- [Download](https://datasets.imdbws.com/)
  - [name.basics](https://datasets.imdbws.com/name.basics.tsv.gz)
  - [title.akas](https://datasets.imdbws.com/title.akas.tsv.gz)
  - [title.basics](https://datasets.imdbws.com/title.basics.tsv.gz)
  - [title.crew](https://datasets.imdbws.com/title.crew.tsv.gz)
  - [title.episode](https://datasets.imdbws.com/title.episode.tsv.gz)
  - [title.principals](https://datasets.imdbws.com/title.principals.tsv.gz)
  - [title.ratings](https://datasets.imdbws.com/title.ratings.tsv.gz)

#### Fanart.tv

Logos, Backgrounds, Posters and more forTV, Movie and Music collections

- personal apikey `e700c5098e329fe9cd5f3fc85ed7fffd`
- project apikey `295c36bf9229fd8369928b7360554c9a`

```
http://webservice.fanart.tv/v3/movies/tt0371746?api_key=295c36bf9229fd8369928b7360554c9a
```

## Features

- Search by title, imdbId or keyword,
- 'advanced' filters by date, genre, isAvailable, etc.
- has backup offline search by using torrent_dump and offline-imdb
- must enable caching
- electron project
- Scan for movies in user-specified directory

## Todo

- torrents from online source
- fix background image in movie-info
- imdbId goes null/undefined if Tmdb doesn't have imdb id(especially on new movies)
- mismatch number of search results because of filters(adults/non-movie)
- add individual .js file for major functions
  - update offline files
  - torrent
- add offline files into OneDrive

> major

- api search
- integrate external javascript
- upload offline files
- handle large http: chunking, pagination, (filter)
- torrent apis
- fix the services
  - data
    - passing/sharing global variables
- ipcRenderers/main
  - config db service
  - library db service
- ipcRenderers subscriptions
  - preferences
  - library movies

> minor

- youtube iframe for trailers
- lazy loading
- subtitles, trailers apis
- loading screen
- shortcut keys
- notifications

> bugs

- fileService readFile(), searchTorrentByName() loads prematurely

> unsorted

- integrate movie files scan to imdb search
- test Plex with following scenarios:
  - titles with '.' and without dot - both (tho.r becomes thor:ragnarok)
  - with year and without year - passed
  - with 's' and without 's' - passed (folder and name) ie. guardian of the galaxy.
  - mistyped letter in a title - passed
  - mismatch file size - passed
  - correct folder, 'filename.mp4' on filename - passed
  - name with incorrect year - passed
  - name with parenthesis - passed
  - incorrect folder and name - failed
  - un-dash movie title with dash(spider-man) - passed
  - year first before title - passed
- browse
  - top year/genre
  - mix year/genre
  - country
  - studio
  - awardees
  - upcoming
  - decade
  - now showing
  - director
  - language
- home
  - recommended
  - watch again
  - now showing

> todo in office

- browse/explore indexing
- file explorer
- preferences

> fonts

- market deco; showtime; futura; helvetica  

## Offline Assets

extract and import to the assets folder:

Assets

- Icons
- Images
  - app
  - cover
  - backdrop
- Offline Dump
  - [thepiratebay_torrent_dump](https://drive.google.com/open?id=1sMJnk6rWE7mjZ6aal1SgNigca7AcwSs4)
  - [Imdb_dump](https://drive.google.com/open?id=1pn1HQKkXNsKd2NP95vcH2qvpY_EYpiQw)
    - **Note:** this is 5/13/2019 query
- Videos
  - Sample movies (videos)
  - sample trailer
- .config/.db files
  - user preferences
  - system
- XMLs
  - <imdbId>.xml
- [other_assets](https://drive.google.com/open?id=122cEkeCWuOB0Zy1ypaHexZx8Y1VYGttd)

## Influenced by

UI and functionalities are influenced by follows: (in descending order)

- [OfflineBay](https://github.com/techtacoriginal/offlinebay)
- IMDB Mobile
- Disney+
- Netflix
- YTS
- IMDB
- Amazon
- Plex
- Hulu

## Useful links

- https://morioh.com/p/64c30140144a/build-a-desktop-application-with-angular-and-electron
- Github readme reference https://github.com/Day8/re-frame https://gist.github.com/fvcproductions/1bfc2d4aecb01a834b46#faq
- https://github.com/thakursc1/IMDB-Movie-DataBase
- https://raw.githubusercontent.com/thakursc1/IMDB-Movie-DataBase/master/MOVIE%20DATABASE%20USING%20BINARY%20SEARCH%20TREE%20DOC.docx

- possible useful API:
  - [Cinema and Television Api](https://collectapi.com/api/watching/cinema-and-television-api/moviesImdb). Cinema and television API)
    - Pricing per Call: 0.001$
  - https://popcorn-official.github.io/popcorn-api/
  - https://github.com/sampotts/plyr

## Resources

- [Project Report: IMDB 5000 Movie Dataset](http://rstudio-pubs-static.s3.amazonaws.com/342210_7c8d57cfdd784cf58dc077d3eb7a2ca3.html)
- http://www.opensubtitles.org/en/downloads#exports
- https://trac.opensubtitles.org/projects/opensubtitles/wiki/DevReadFirst
- https://forum.opensubtitles.org/viewtopic.php?f=8&t=16453#p39771

## changes from office

- adm-zip
- bittorrent-tracker, bittorrent-dht, rimraf, moment

- changes 2

- libraryFiles.db,mock-data,subject,results

## notes

- tsv parse search is faster than nedb; ~2s vs ~15s
- search queries: title, releaseYear, genre/s, rating, ratingcount, language, country origin/region,
- minify tsv stream has leak
- tmdb criteria: year,region, language, vote count, vote average.
- snackbar/toast doesnt work
- omdb and Imdb has same genre in movies

https://api.themoviedb.org/3/movie/157336?api_key=a636ce7bd0c125045f4170644b4d3d25&append_to_response=videos,images,credits,changes,translations,similar,external_ids,ss

api_key
string
1 validations
required
language
string
Specify a language to query translatable fields with.

minLength: 2
pattern: ([a-z]{2})-([A-Z]{2})
default: en-US
optional
region
string
Specify a ISO 3166-1 code to filter release dates. Must be uppercase.

pattern: ^[A-Z]{2}$
optional

sort_by:string
Choose from one of the many available sort options.
Allowed Values: , popularity.asc, popularity.desc, release_date.asc, release_date.desc, revenue.asc, revenue.desc, primary_release_date.asc, primary_release_date.desc, original_title.asc, original_title.desc, vote_average.asc, vote_average.desc, vote_count.asc, vote_count.desc
default: popularity.desc
optional

certification_country:string
Used in conjunction with the certification filter, use this to specify a country with a valid certification.
optional

certification:string
Filter results with a valid certification from the 'certification_country' field.
optional

certification.lte:string
Filter and only include movies that have a certification that is less than or equal to the specified value.
optional

certification.gte:string
Filter and only include movies that have a certification that is greater than or equal to the specified value.
optional

include_adult:boolean
A filter and include or exclude adult movies.

default
optional

include_video:boolean
A filter to include or exclude videos.

default
optional

page
integer
Specify the page of results to query.

minimum: 1
maximum: 1000
default: 1
optional

primary_release_year
integer
A filter to limit the results to a specific primary release year.

optional
primary_release_date.gte
string
Filter and only include movies that have a primary release date that is greater or equal to the specified value.

format: date
optional
primary_release_date.lte
string
Filter and only include movies that have a primary release date that is less than or equal to the specified value.

format: date
optional
release_date.gte
string
Filter and only include movies that have a release date (looking at all release dates) that is greater or equal to the specified value.

format: date
optional
release_date.lte
string
Filter and only include movies that have a release date (looking at all release dates) that is less than or equal to the specified value.

format: date
optional
with_release_type
integer
Specify a comma (AND) or pipe (OR) separated value to filter release types by. These release types map to the same values found on the movie release date method.

minimum: 1
maximum: 6
optional
year
integer
A filter to limit the results to a specific year (looking at all release dates).

optional
vote_count.gte
integer
Filter and only include movies that have a vote count that is greater or equal to the specified value.

minimum: 0
optional
vote_count.lte
integer
Filter and only include movies that have a vote count that is less than or equal to the specified value.

minimum: 1
optional
vote_average.gte
number
Filter and only include movies that have a rating that is greater or equal to the specified value.

minimum: 0
optional
vote_average.lte
number
Filter and only include movies that have a rating that is less than or equal to the specified value.

minimum: 0
optional
with_cast
string
A comma separated list of person ID's. Only include movies that have one of the ID's added as an actor.

optional
with_crew
string
A comma separated list of person ID's. Only include movies that have one of the ID's added as a crew member.

optional
with_people
string
A comma separated list of person ID's. Only include movies that have one of the ID's added as a either a actor or a crew member.

optional
with_companies
string
A comma separated list of production company ID's. Only include movies that have one of the ID's added as a production company.

optional
with_genres
string
Comma separated value of genre ids that you want to include in the results.

optional
without_genres
string
Comma separated value of genre ids that you want to exclude from the results.

optional
with_keywords
string
A comma separated list of keyword ID's. Only includes movies that have one of the ID's added as a keyword.
optional

without_keywords
string
Exclude items with certain keywords. You can comma and pipe seperate these values to create an 'AND' or 'OR' logic.
optional

with_runtime.gte
integer
Filter and only include movies that have a runtime that is greater or equal to a value. optional

with_runtime.lte integer Filter and only include movies that have a runtime that is less than or equal to a value. optional

with_original_language string Specify an ISO 639-1 string to filter results by their original language value. optional
