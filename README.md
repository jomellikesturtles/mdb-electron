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

- ipcRenderers
- yts
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
  - torrent
    - gets and setting torrents from API
  - movie
    - gets movie info from online API
- ipcRenderers/main
  - config db service
  - library db service
- ipcRenderers subscriptions
  - preferences
  - library movies

> minor

- click to external links (imdb,yts,rotten tomatoes, etc..)
- youtube iframe for trailers
- lazy loading
- subtitles, trailers apis
- loading screen
- shortcut keys
- notifications

> bugs

- fileService readFile(), searchTorrentByName() loads prematurely
- fileService reads offline torrent file twice
- push to config file only appends to config file

> unsorted

- integrate moviefiles scan to imdbsearch
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
  - undash movie title with dash(spider-man) - passed
  - year first before title - passed
  
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
