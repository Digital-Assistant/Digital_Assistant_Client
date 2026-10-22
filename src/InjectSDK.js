// Migrated to use @udan/digital-assistant-sdk package
import { checkBrowser, checkScreenSize } from "@udan/digital-assistant-sdk";

let { enableUDAPlugin, udaBrowserVar, udaIdentifiedBrowser } = checkBrowser();

const { enablePluginForScreen, showScreenAlert } = checkScreenSize();
global.isUDASdk = true;

if (enableUDAPlugin === false) {
    console.log('Plugin disabled for browser: ' + udaIdentifiedBrowser.name);
} else if (enablePluginForScreen === false) {
    console.log('Plugin disabled due to lower resolution');
} else {
    require("./AuthService");
    require("./main");
}