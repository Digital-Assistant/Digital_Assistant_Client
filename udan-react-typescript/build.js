// const webpack = require('webpack');
// const webpackConfig = require('./webpack.config.js')
// // import webpackConfig, { webappDir } from "./webpack.config.js"

// const webpackCompiler = webpack(webpackConfig);

// const webpackDevMiddleware = require("webpack-dev-middleware");
// const webpackHotMiddleware = require("webpack-hot-middleware");

// webpackDevMiddleware(webpackCompiler);
// webpackHotMiddleware(webpackCompiler);


const webpack = require('webpack');
const config = require('./webpack.config');
const compiler = webpack(config);
const fs = require("fs");

compiler.run((err, stats) => {
    const replace = require("replace");
    
    replace({
        regex: "const nodeVersion =",
        replacement: "const nodeVersion = 'v14.17.3'//",
        paths: ['./output/bundle/headers.js'],
        recursive: true,
        silent: true,
    });

    replace({
        regex: "fs.realpath.native",
        replacement: "fs?.realpath?.native",
        paths: ['./output/bundle/headers.js'],
        recursive: true,
        silent: true,
    });


    replace({
        regex: "setImmediate",
        replacement: "setTimeout",
        paths: ['./output/bundle/Voicepluginsdk.js'],
        recursive: true,
        silent: true,
    });

    fs.copyFileSync('./output/bundle/headers.js', '../chrome-plugin/js/headers.js');
    fs.copyFileSync('./output/bundle/Voicepluginsdk.js', '../chrome-plugin/js/Voicepluginsdk.js');
    const headers = fs.readFileSync('./output/bundle/headers.js', "utf8");

    let content = "var s = document.createElement('script');s.async = false;s.onload = function() {};s.text = `" + headers + "`;";
    fs.writeFile('./temp/injectscriptmodifier.js', content, function (e) {
        if (e) throw e;
        console.log('File is created successfully.');
        fs.copyFileSync('./temp/injectscriptmodifier.js', '../chrome-plugin/js/injectscriptmodifier.js');
    });
    // console.log(headers)
});