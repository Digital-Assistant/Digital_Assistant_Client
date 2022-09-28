const fs = require('fs')

fs.readFile(`./build/assets/bundle.js`, 'utf-8', function (err, contents) {
  if (err) {
    console.log(err);
    return;
  }
  let replaced = contents.replace(/win\.location\.origin/gi, 'win?.location?.origin');
  replaced = replaced.replace(/win\.location\.href/gi, 'win?.location?.href');
  replaced = replaced.replace(/setImmediate/gi, 'setTimeout');
  
  fs.writeFile(`./build/assets/bundle.js`, replaced, 'utf-8', function (e) {
    //console.log(e);
  });
});


