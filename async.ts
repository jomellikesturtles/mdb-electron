// import { catchError } from "rxjs/operators";
// import { log } from 'util';

// // import { pureFunction1 } from "@angular/core/src/render3"
// // import { BehaviorSubject } from 'rxjs';
// var BehaviorSubject = require('rxjs/BehaviorSubject');

// // var observable = Observable;
// let movie = new BehaviorSubject<string>([])

// console.time('time1')
// console.log('ey')


// console.log('movie', movie)
// movie.next(['titanic'])
// console.log('movie', movie)

// function function1(resolve, reject) {
//     return new Promise((resolve, reject) => {
//         let index = 0
//         while (index < 100000) {
//             index++
//         }
//         resolve('hey')
//         reject('reject')
//     })

// }

// function1().then(function (value) {
//     console.log(value)
// })
// function1().then((value) => {
//     console.log(value)
// })

// // function1()
// console.log('end')
// console.timeEnd('time1')

var Rx = require('rxjs');
var tap = require('rxjs/operators');
var rxCommon = require('@angular/common');
// var http = require('http');
var https = require('https');

const subject = new Rx.BehaviorSubject(123);
rxCommon.
// two new subscribers will get initial value => output: 123, 123
subject.subscribe(console.log);
subject.subscribe(console.log);

// two subscribers will get new value => output: 456, 456
subject.next(456);

// new subscriber will get latest value (456) => output: 456
subject.subscribe(console.log);

// all three subscribers will get new value => output: 789, 789, 789
subject.next(789);

https.get('https://api.themoviedb.org/3/movie/550?api_key=a636ce7bd0c125045f4170644b4d3d25').pipe(tap(_ => console.log('')))
// http .get<any>(url).pipe(tap(_ => this.log('')),
//       catchError(this.handleError<any>('searchMovieByTitle')))

