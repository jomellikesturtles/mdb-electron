const path = require('path');

const sayHello = function () {
  console.log('hell')
  console.log(path.join(__dirname, '..', 'db', 'bookmarks.db'));
}

module.exports = {
  sayHello: sayHello
}
