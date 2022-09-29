export const REST = {
  apiCal,
  syncApiCal,
  processArgs,
};

function checkValidUser() {
  let userData: any = localStorage.getItem("user");
  userData = JSON.parse(userData);
  if (userData && userData.tenantId !== sessionStorage.getItem("tenantId")) {
    localStorage.clear();
    window.location.href = "/";
    return false;
  } else {
    return true;
  }
}

/**
 * common REST call
 * @options : object (properties needed for REST call)
 */
function apiCal(options: any) {
  // const validate = checkValidUser()
  // if(!validate) return
  const requestOptions = {
    method: options.method,
    headers: options?.headers ? options?.headers : getHTTPHeaders("json"),
    body: options.body ? JSON.stringify(options.body) : null,
  };

  return fetch(options.url, requestOptions)
    .then((response) => {
      //throw route to login if unauthorized response received
      if (response?.status == 401) {
        localStorage.clear();
        // window.location.href = '/'
      }
      return options?.responseType == "text"
        ? response.text()
        : response.json();
    })
    .then((json) => {
      return json;
    })
    .catch((error) => {
      return error;
    });
}

/**
 * common sync REST call
 * @options : object (properties needed for REST call)
 */
async function syncApiCal(options: any) {
  // const validate = checkValidUser()
  // if(!validate) return
  const requestOptions = {
    method: options.method,
    headers: getHTTPHeaders("json"),
    body: options.body ? JSON.stringify(options.body) : null,
  };

  let response: any = {};
  try {
    response = await fetch(options.url, requestOptions);
    return await response?.json();
  } catch (e) {}
}

/**
 * @objective To set autherization token for all outgoing REST calls
 * @param contentType
 * @returns HTTP headers
 */
function getHTTPHeaders(contentType: string) {
  const headers = new Headers();
  if (contentType === "json")
    headers.append("Content-Type", "application/json");

  return headers;
}

/**
 * @obective to replace static query params with dynamic values
 * @param url
 * @param val
 * @returns reconstructed url
 */
function processArgs(url: string, val: any) {
  return url?.replace(/#([^#]+)#/g, (_, key) => (val[key] || "") && val[key]);
}
