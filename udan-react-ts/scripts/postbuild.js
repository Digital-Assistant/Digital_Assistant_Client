const fs = require('fs')

fs.readFile(`./build/assets/bundle.js`, 'utf-8', function (err, contents) {
  if (err) {
    console.log(err);
    return;
  }
  const replaced = contents.replace(/win\.location\.href/gi, 'win?.location?.href');
  fs.writeFile(`./build/assets/bundle.js`, replaced, 'utf-8', function (e) {
    //console.log(e);
  });
});
