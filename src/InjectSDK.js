require("./AuthService");

const currentPath = document.currentScript.src.toString().replace("UDALoad.js", "");

function include(file,position='start') {
    var script  = document.createElement('script');
    script.src  = file;
    script.type = 'text/javascript';
    script.defer = true;
    if(position=='start') {
        document.getElementsByTagName('head').item(0).appendChild(script);
    } else {
        document.body.appendChild(script);
    }
}

include(currentPath+'UDASdk.js','end');
