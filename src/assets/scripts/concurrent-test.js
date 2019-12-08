
/**
 * JUST A TEST
 */

let args = process.argv.slice(2);
let index = args[0];

function initializeApp() {
  console.log('in');
  let i = 0
  while (i < 100) {
    i++
  }
  console.log('initializeApp DONE!', index);

}


console.log('initializeApp', index);

initializeApp()
