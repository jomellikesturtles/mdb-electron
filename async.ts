/**
 * For practicing only
 */

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
var http = require('http');


const options = {
  hostname: 'omdbapi.com',
  port: 9400,
  path: '/?t=wall-e&apikey=3a2fe8bf',
  method: 'GET'
}

// const req = https.request(options, res => {
//   console.log(`statusCode: ${res.statusCode}`)

//   res.on('data', d => {
//     process.stdout.write(d)
//   })
// })

// req.on('error', error => {
//   console.error(error)
// })

// req.end()



// http.get(options, function (http_res) {
//   // initialize the container for our data
//   var data = "";

//   // this event fires many times, each time collecting another piece of the response
//   http_res.on("data", function (chunk) {
//       // append this chunk to our growing `data` var
//       data += chunk;
//   });

//   // this event fires *one* time, after all the `data` events/chunks have been gathered
//   http_res.on("end", function () {
//       // you can use res.send instead of console.log to output via express
//       console.log(data);
//   });
// });

// ------------

// const inDb = [true, false, false]
// // const

// // -------------------
// function function1() {
//   console.log(typeof (Worker));
//   return new Promise(resolve => {
//     setTimeout(() => {
//       console.log('hey');
//       resolve('hey');
//     }, 3000);
//   })
// }

// async function onInit() {
//   console.log('initializing...');
//   var result = await function1()
//   console.log(result)
//   console.log('in here')
// }

// onInit()
// console.log('afte in here')

// // -------------------


function random(val) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Math.random())
    }, val * 1000);
  })
}

const sumRandomAsyncNums = async () => {
  const first = await random(1)
  const third = await random(3)
  console.log(`sumRandomAsyncNums ${first}`);
  console.log(`sumRandomAsyncNums ${third}`);
}

const sumRandomAsyncNums2 = async () => {
  const second = await random(2)
  console.log(`${second}`);
}
const sumRandomAsyncNums3 = async () => {
  const second = await random(2)
  console.log(`${second}`);
}

function testfunction() {
  const myarr = []
  let page = 0
  while (page < 5) {
    myarr[page] = page
    page++
  }
  console.log(myarr);

}

testfunction()
// sumRandomAsyncNums()
// sumRandomAsyncNums()
// sumRandomAsyncNums2()
