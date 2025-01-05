import {checkBrowser} from "./util/checkBrowser";
import {checkScreenSize} from "./util/checkScreenSize";

let {enableUDAPlugin, udaBrowserVar, udaIdentifiedBrowser} = checkBrowser();

const {enablePluginForScreen, showScreenAlert} = checkScreenSize();
global.isUDASdk = true;

if(enableUDAPlugin === false) {
    console.log('Plugin disabled for browser: '+udaIdentifiedBrowser.name);
} else if(enablePluginForScreen === false){
    console.log('Plugin disabled due to lower resolution');
} else {
    require("./AuthService");
    require("./index");
}
