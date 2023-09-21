import {checkBrowser} from "./util/checkBrowser";

let {enablePlugin, browserVar, identifiedBrowser} = checkBrowser();

if(enablePlugin === false) {
    console.log('Plugin disabled for browser: '+identifiedBrowser.name);
} else {
    require("./AuthService");
    require("./index");
}