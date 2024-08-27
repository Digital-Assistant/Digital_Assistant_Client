import { getScreenSize } from "./getScreenSize";
export const checkScreenSize = () => {
    const screenSize = getScreenSize();
    let enablePluginForScreen = true;
    let showScreenAlert = false;
    if (screenSize.resolution.height < 768) {
        enablePluginForScreen = false;
    }
    else if (screenSize.resolution.height < 1080) {
        showScreenAlert = true;
    }
    if (screenSize.resolution.width < 1366) {
        enablePluginForScreen = false;
    }
    else if (screenSize.resolution.width < 1920) {
        showScreenAlert = true;
    }
    return { enablePluginForScreen, showScreenAlert };
};
//# sourceMappingURL=checkScreenSize.js.map