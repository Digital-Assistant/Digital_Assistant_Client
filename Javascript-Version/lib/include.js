var currentpath=document.currentScript.src.toString().replace("lib/include.js","");
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

include(currentpath+'lib/load.js','end');
include(currentpath+'chrome-plugin/js/Voicepluginsdk.js','end');
