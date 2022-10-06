const fs = require('fs')
const targetDir = "./build", sourceDir = "./public";

//replace few js error prone expressions of 3rd party package code
fs.readFile(`${targetDir}/assets/bundle.js`, 'utf-8', function (err, contents) {
  if (err) {
    console.log(err);
    return;
  }
  let replaced = contents.replace(/win\.location\.origin/gi, 'win?.location?.origin');
  replaced = replaced.replace(/win\.location\.href/gi, 'win?.location?.href');
  replaced = replaced.replace(/setImmediate/gi, 'setTimeout');
  
  fs.writeFile(`${targetDir}/assets/bundle.js`, replaced, 'utf-8', function (e) {
    //console.log(e);
  });
});


//copy background,index and manifest files to build from public folder
fs.writeFileSync(`${targetDir}/background.js`, fs.readFileSync(`${sourceDir}/background.js`));
fs.writeFileSync(`${targetDir}/index.js`, fs.readFileSync(`${sourceDir}/index.js`));
fs.writeFileSync(`${targetDir}/manifest.json`, fs.readFileSync(`${sourceDir}/manifest.json`));
