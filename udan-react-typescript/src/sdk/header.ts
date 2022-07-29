import {UDAConsoleLogger} from '../config/error-log';
import {UDAAddNewElement, DSA_OBSERVER} from '../util/index';
// import { UDAUserAuthData } from './modules/authData'
import {UDABrowserCheck} from '../modules/browserCheck';

const UDABrowserName = UDABrowserCheck.detectBrowserNameAndVersion(navigator);
const UDAAllowedBrowsers = ['chrome', 'edge'];
const isUDAAllowed = UDAAllowedBrowsers.indexOf(
    UDABrowserName?.name?.toLowerCase(),
);

if (isUDAAllowed < 0) {
  // UDAConsoleLogger.info('UDA links script not loaded');
} else {
  // adding the click object that is registered via javascript
  EventTarget.prototype.addEventListener = (function(addEventListener) {
    const element = this;
    return function() {
      if (arguments[0] === 'click') {
        UDAAddNewElement(element as HTMLElement);
      }
      addEventListener.call(element, arguments[0], arguments[1], arguments[2]);
    };
  })(EventTarget.prototype.addEventListener);

  // starting the mutation observer
  DSA_OBSERVER.observe(document, {
    childList: true,
    subtree: true,
  });
}
