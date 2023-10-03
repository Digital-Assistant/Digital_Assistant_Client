import {checkBrowser} from "./util/checkBrowser";
import {checkScreenSize} from "./util/checkScreenSize";

let {enablePlugin, browserVar, identifiedBrowser} = checkBrowser();

const {enablePluginForScreen, showScreenAlert} = checkScreenSize();

if(enablePlugin === false) {
    console.log('Plugin disabled for browser: '+identifiedBrowser.name);
} else if(enablePluginForScreen === false){
    console.log('Plugin disabled due to lower resolution');
} else {
    require("./AuthService");
    require("./index");
}