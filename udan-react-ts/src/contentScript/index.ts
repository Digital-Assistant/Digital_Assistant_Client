export { };
  
  let iframe: any = null;
  
document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false);

function fireContentLoadedEvent () {
try {
  let links = document.body.getElementsByTagName("a");
  // console.log(links)
  // function attachClickEvents() {
  for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('mouseover', function (a: any) {
      console.log(a.target)
      if (a?.target?.className?.indexOf('test') === -1) {
        a.target.className += " test"
        // a.target.attributes.push('clickable')
        createAnIframe();
      }
      // else { 
      //   a.target.className = "test";
      //   createAnIframe();
      // }
    });
  }
  // }
} catch (e) { 
  console.log(e);
  }

  
  createAnIframe();

  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg === "toggle") {
      toggle();
    }

  function toggle() {
      if (!iframe) return;
    if (iframe.style.width === "28px") {
        // iframe.src = chrome.extension.getURL("logo.html"); 
        //iframe.contentWindow.document.body.className=""
        iframe.style.width="350px";
      }
    else {
      // iframe.src = chrome.extension.getURL("popup.html"); 
      // iframe.contentWindow.document.body.className="only-icon"
      iframe.style.width="28px";
    }
    }
  });
}






  function createAnIframe() {

    chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
      if (msg === 'GET_DOM') {
       
        const resp = {
          anchors: Array.from(document.getElementsByTagName<"a">("a")).filter(a => a.className.indexOf('test') !== -1).map(a => a.innerText)
        }
        sendResponse(resp);
      }
    });

    const udanIFrame = document.getElementsByClassName('udan-ce-panel');
   

    try {
      if (udanIFrame.length === 0) {
        iframe = document.createElement('iframe');
        iframe.style.height = "100%";
        iframe.style.width = "28px";
        // iframe.style.width = "350px";
        iframe.style.position = "fixed";
        iframe.style.top = "0px";
        iframe.style.right = "0px";
        iframe.style.border = "none";
        iframe.style.zIndex = "999999";
        iframe.className = "udan-ce-panel";
        iframe.src = chrome.extension.getURL("popup.html");
        document.body.appendChild(iframe);
      } else {
        iframe = udanIFrame[0];
        iframe.src = chrome.extension.getURL("popup.html");
      }
    }catch(e){console.log(e);}
}


