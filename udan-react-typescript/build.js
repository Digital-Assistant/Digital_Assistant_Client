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

  console.log("Done")
});