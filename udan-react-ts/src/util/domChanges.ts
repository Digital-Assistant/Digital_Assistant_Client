import {addBodyEvents} from "./addBodyEvents";
import {indexDom} from "./indexDom";
import {CONFIG} from "../config";
import {getFromStore} from "./index";

declare const UDAClickObjects;

/**
 * self calling function to detect dom changes
 */
(function (window) {
  let last = +new Date();
  let delay = 100; // default delay

  // Manage event queue
  let stack: any = [];

  function callback() {
    let now = +new Date();
    if (now - last > delay) {
      for (let i = 0; i < stack.length; i++) {
        stack[i]();
      }
      last = now;
    }
  }

  // Public interface
  const onDomChange = (fn: any, newdelay: any) => {
    if (newdelay) delay = newdelay;
    stack.push(fn);
  };

  // Naive approach for compatibility
  function naive() {
    let last: any = document.getElementsByTagName("*");
    let lastLen = last.length;
    setTimeout(function check() {
      // get current state of the document
      let current = document.getElementsByTagName("*");
      let len = current.length;

      // if the length is different
      // it's fairly obvious
      if (len != lastLen) {
        // just make sure the loop finishes early
        last = [];
      }

      // go check every element in order
      for (let i = 0; i < len; i++) {
        if (current[i] !== last[i]) {
          callback();
          last = current;
          lastLen = len;
          break;
        }
      }

      // over, and over, and over again
      setTimeout(check, delay);
    }, delay);
  }

  //
  //  Check for mutation events support
  //
  let support: any = {};

  let el = document.documentElement;
  let remain = 3;

  // callback for the tests
  function decide() {
    if (support.DOMNodeInserted) {
      window.addEventListener(
          "DOMContentLoaded",
          function () {
            if (support.DOMSubtreeModified) {
              // for FF 3+, Chrome
              el.addEventListener("DOMSubtreeModified", callback, false);
            } else {
              // for FF 2, Safari, Opera 9.6+
              el.addEventListener("DOMNodeInserted", callback, false);
              el.addEventListener("DOMNodeRemoved", callback, false);
            }
          },
          false
      );
    } else {
      // fallback
      naive();
    }
  }

  // checks a particular event
  function test(event: any) {
    el.addEventListener(
        event,
        function fn() {
          support[event] = true;
          el.removeEventListener(event, fn, false);
          if (--remain === 0) decide();
        },
        false
    );
  }

  // attach test events
  // if (window.addEventListener) {
    test("DOMSubtreeModified");
    test("DOMNodeInserted");
    test("DOMNodeRemoved");
  // } else {
    decide();
  // }

  // do the dummy test
  let dummy = document.createElement("div");
  el.appendChild(dummy);
  el.removeChild(dummy);

  // expose
  window.onDomChange = onDomChange;
})(window);


/**
 * To listen to dom changes
 */

/*window.onDomChange(async () => {
  console.log(UDAClickObjects);
  console.log(CONFIG.isRecording);
  const isRecording =
      await getFromStore(CONFIG.RECORDING_SWITCH_KEY, true) == "true" ? true : false;

  CONFIG.isRecording = isRecording;

  if (isRecording) {
    // addBodyEvents(document.body);
    await indexDom(document.body);
  }
});*/

const observer = new MutationObserver( (list) => {
  setTimeout(async () => {
    console.log(list);
    console.log(UDAClickObjects);
    console.log(CONFIG.isRecording);
    const isRecording =
        await getFromStore(CONFIG.RECORDING_SWITCH_KEY, true) == "true" ? true : false;

    CONFIG.isRecording = isRecording;
    console.log(CONFIG.isRecording);

    if (isRecording) {
      // addBodyEvents(document.body);
      await indexDom(document.body);
    }
  }, CONFIG.DEBOUNCE_INTERVAL);

});
observer.observe(document.body, {attributes: true, childList: true, subtree: true});
