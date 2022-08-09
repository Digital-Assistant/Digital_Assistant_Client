// select the target node
// var target = document.querySelector('#some-id');
let target = document.querySelector("body");
let links = document.body.getElementsByTagName("a");

// // create an observer instance
// let observer = new MutationObserver(function(mutations) {  
//   mutations.forEach(function(mutation) {
//     attachClickEvents();
//   });    
// });

// // configuration of the observer:
// let config = { attributes: true, childList: true, characterData: true };

// // pass in the target node, as well as the observer options
// if(target) observer.observe(target, config);

// If your extension doesn't need a content script, just leave this file empty

// import { link } from "fs";

// This is an example of a script that will run on every page. This can alter pages
// Don't forget to change `matches` in manifest.json if you want to only change specific webpages
createAnIframe();


// console.log(links)
// function attachClickEvents() {
  for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('mouseover', function (a: any) {
      if (a?.target?.className?.indexOf('test') === -1) {
        a.target.className += " test"
        // a.target.attributes.push('clickable')
        createAnIframe();
      };
    });
  }
// }

export function createAnIframe() {

  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg === "toggle") {
      console.log('toggle')
      toggle();
    }
    if (msg === 'GET_DOM') {
      const anchors = document.body.getElementsByTagName("a");
      const resp = {
        anchors: Array.from(document.getElementsByTagName<"a">("a")).filter(a=> a.className.indexOf('test')!==-1).map(a => a.innerText)
      }
      sendResponse(resp);
    }
  });

let iframe = document.createElement('iframe'); 
iframe.style.height = "100%";
// iframe.style.width = "0px";
iframe.style.position = "fixed";
iframe.style.top = "0px";
iframe.style.right = "0px";
iframe.style.border = "none";
iframe.style.zIndex = "999999";
iframe.src = chrome.extension.getURL("popup.html")

document.body.appendChild(iframe);

function toggle(){
    if(iframe.style.width === "0px"){
        iframe.style.width="350px";
    }
    else{
        iframe.style.width="50px";
    }
}
}
