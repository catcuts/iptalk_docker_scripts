webpackJsonp([101],{

/***/ "./node_modules/axios/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__("./node_modules/axios/lib/utils.js");
var settle = __webpack_require__("./node_modules/axios/lib/core/settle.js");
var buildURL = __webpack_require__("./node_modules/axios/lib/helpers/buildURL.js");
var parseHeaders = __webpack_require__("./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__("./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__("./node_modules/axios/lib/core/createError.js");
var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__("./node_modules/axios/lib/helpers/btoa.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if (process.env.NODE_ENV !== 'test' &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/mzabriskie/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__("./node_modules/axios/lib/helpers/cookies.js");

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("./node_modules/axios/lib/utils.js");
var bind = __webpack_require__("./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__("./node_modules/axios/lib/core/Axios.js");
var defaults = __webpack_require__("./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__("./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__("./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__("./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__("./node_modules/axios/lib/helpers/spread.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__("./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__("./node_modules/axios/lib/defaults.js");
var utils = __webpack_require__("./node_modules/axios/lib/utils.js");
var InterceptorManager = __webpack_require__("./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__("./node_modules/axios/lib/core/dispatchRequest.js");
var isAbsoluteURL = __webpack_require__("./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__("./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, this.defaults, { method: 'get' }, config);
  config.method = config.method.toLowerCase();

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__("./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__("./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__("./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__("./node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__("./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("./node_modules/axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__("./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__("./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__("./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = __webpack_require__("./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/btoa.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      }

      if (!utils.isArray(val)) {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("./node_modules/axios/lib/utils.js");

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__("./node_modules/axios/lib/helpers/bind.js");
var isBuffer = __webpack_require__("./node_modules/is-buffer/index.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object' && !isArray(obj)) {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/commander.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = __webpack_require__("./node_modules/axios/index.js");

var _axios2 = _interopRequireDefault(_axios);

var _urls = __webpack_require__("./src/apps/iptalk/urls.js");

var urls = _interopRequireWildcard(_urls);

var _deviceTree = __webpack_require__("./src/common/device.tree.vue");

var _deviceTree2 = _interopRequireDefault(_deviceTree);

var _gridLayout = __webpack_require__("./src/components/grid.layout.vue");

var _gridLayout2 = _interopRequireDefault(_gridLayout);

var _video = __webpack_require__("./src/components/video.vue");

var _video2 = _interopRequireDefault(_video);

var _eventbus = __webpack_require__("./src/common/eventbus.js");

var _eventbus2 = _interopRequireDefault(_eventbus);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Display = function () {
	function Display(camera, serverIP) {
		_classCallCheck(this, Display);

		this.streamTag = camera.streamTag;
		this.src = "rtmp://" + serverIP + "/live/" + camera.streamTag;
		this.camera = camera;
		this.serverIP = serverIP;
		this.on(this.src);
	}

	_createClass(Display, [{
		key: "on",
		value: function on(src) {
			this.src = src;
		}
	}, {
		key: "off",
		value: function off() {
			this.src = "";
		}
	}]);

	return Display;
}();

var DevCamera = function () {
	function DevCamera(devIP, devRelatedIPCAddrs, videoType, monitorID) {
		_classCallCheck(this, DevCamera);

		if (videoType === "monitor") {
			this.addr = "rtsp://" + devIP + "/meeyi/ipc";
		} else {
			this.addr = "rtsp://" + devIP + "/meeyi";
		}
		this.type = "mic";
		this.key = devIP;
		this.streamTag = devIP;
		this.videoType = videoType;
		this.monitorID = monitorID;
		this.relatedIPCs = this.genRelatedIPCs(devIP, devRelatedIPCAddrs, videoType, monitorID);
	}

	_createClass(DevCamera, [{
		key: "genRelatedIPCs",
		value: function genRelatedIPCs(devIP, devRelatedIPCAddrs, videoType, monitorID) {
			if (!Array.isArray(devRelatedIPCAddrs)) {
				devRelatedIPCAddrs = devRelatedIPCAddrs ? [devRelatedIPCAddrs] : [];
			}
			var c = 1;
			var devRelatedIPCs = devRelatedIPCAddrs.map(function (addr) {
				return {
					addr: addr,
					type: "ipc",
					key: devIP,
					streamTag: devIP + ".ipc" + c++,
					videoType: videoType,
					monitorID: monitorID
				};
			});
			return devRelatedIPCs;
		}
	}]);

	return DevCamera;
}();

exports.default = {
	components: { tree: _deviceTree2.default, grid: _gridLayout2.default, player: _video2.default },
	mixins: [],
	data: function data() {
		return {
			urls: urls,
			treeId: 'device_tree',
			dimensions: [{
				type: "custom",
				name: L("所有设备", "iptalk"),
				expandLevel: 0
			}],
			setDragData: function setDragData(event) {
				var content = {
					type: "vue",
					url: "devices/operates/video.operate.vue",
					params: {
						videoType: "hls",
						videoSrc: urls.recstoreage + "/" + "28888888_10000130_20170927_113554.ts" + "_playlist.m3u8",
						dependencies: {
							videoCSS: "/js/video.js/dist/video-js.min.css",
							videojs: "/js/video.js/dist/video.min.js",
							videojsContribHls: "/js/videojs-contrib-hls/dist/videojs-contrib-hls.min.js"
						},
						playerOpts: {
							aspectRatio: "16:9"
						}
					}
				};

				event.dataTransfer.setData("text", JSON.stringify(content));
			},
			displays: [],
			displayStatus: {
				off: 4,
				on: 0,
				occupied: 0,
				total: 4,
				devIPs: []
			},
			displayDependencies: {
				videoCSS: "/js/video.js/dist/5.20.4/video-js.min.css",
				videojs: "/js/video.js/dist/5.20.4/video.min.js"
			},
			displayOptions: {
				controlBar: {
					playToggle: false
				}
			},
			beforeDestroy: false
		};
	},

	props: {
		options: { type: Object, default: function _default() {} }
	},
	computed: {},
	methods: {
		init: function init() {
			this.processCallStack();
			_eventbus2.default.$on("deviceEvent", this.onDeviceEvent);
			_eventbus2.default.$on('stopOneVideoPlayer', this.onStopVideoPlay);
		},
		processCallStack: function processCallStack() {
			for (var i = 0; i < global.callStack.length; i++) {
				var call = global.callStack[i];
				if (call && call.ActionNum === 1 && this.displayStatus.devIPs.indexOf(call.DevIP) === -1) {
					this.onCallPickedup(call.DevIP, call.DevRelatedIPC, call.VideoType, call.monitorID);
				}
			}
		},
		onDeviceEvent: function onDeviceEvent(event) {
			if (this.beforeDestroy || event.ActionNum !== 1) {
				return;
			}
			switch (event.CallNum) {
				case 4:
					this.onCallPickedup(event.DevIP, event.DevRelatedIPC);break;
				case 3:
					this.onCallHangedup(event.DevIP, event.DevRelatedIPC);break;
			}
		},
		onCallPickedup: function onCallPickedup(devIP, devRelatedIPCAddrs) {
			var videoType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
			var monitorID = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

			var self = this;
			devRelatedIPCAddrs = devRelatedIPCAddrs.filter(function (item) {
				return item;
			});

			if (devRelatedIPCAddrs.length + 1 <= self.displayStatus.total - self.displayStatus.occupied) {
				var devCam = new DevCamera(devIP, devRelatedIPCAddrs, videoType, monitorID);
				var calledIPCams = [devCam].concat(devCam.relatedIPCs);
				self.displayStatus.occupied += devRelatedIPCAddrs.length + 1;

				self.liveControl("get_server_ip").then(function (liveServerIP) {
					self.liveControl("start", calledIPCams);
					for (var i = 0; i < calledIPCams.length; i++) {
						var display = new Display(calledIPCams[i], liveServerIP);
						self.addDisplay(display);
					}
					self.displayStatus.devIPs.push(devIP);
				}, function (error) {
					alert(L("获取直播服务器IP时发生错误", "iptalk"));
				});
			}
		},
		liveControl: function liveControl(cmd) {
			var cameras = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

			return new Promise(function (resolve, reject) {
				_axios2.default.post(urls.liveControl + "/", { cmd: cmd, cameras: cameras }).then(function (response) {
					if (response.data.status === "success") {
						resolve(response.data.serverIP);
					} else if (response.data.status === "error") {
						reject(L(response.data.errors));
					}
				}, function (error) {
					reject(L("意外错误", "iptalk"));
				});
			});
		},
		onCallHangedup: function onCallHangedup(devIP, devRelatedIPCAddrs) {
			var videoType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
			var monitorID = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

			devRelatedIPCAddrs = devRelatedIPCAddrs.filter(function (item) {
				return item;
			});
			var devCam = new DevCamera(devIP, devRelatedIPCAddrs, videoType, monitorID);
			var calledIPCams = [devCam].concat(devCam.relatedIPCs);
			this.displayStatus.occupied -= devRelatedIPCAddrs.length + 1;

			var self = this;
			this.liveControl("stop", calledIPCams);
			for (var _i2 = 0; _i2 < calledIPCams.length; _i2++) {
				var indexOfExpiredDisplay = self.findIndexOfDisplay(calledIPCams[_i2].streamTag, "streamTag");
				self.removeDisplay(indexOfExpiredDisplay);
			}
			var i = this.displayStatus.devIPs.indexOf(devIP);
			this.displayStatus.devIPs.splice(i, 1);
		},
		onStopVideoPlay: function onStopVideoPlay(event) {
			var self = this;
			if (self.displays.length === 0) {
				return;
			}
			var storage = window.localStorage;
			for (var i = 0; i < global.callStack.length; i++) {
				if ((global.callStack[i] || {}).DevIP === event.key) {
					if (event.type === 'mic') {
						self.onCallHangedup(event.key, global.callStack[i].DevRelatedIPC, 'monitor', event.monitorID);
						global.callStack.splice(i, 1);
						storage.removeItem(event.key);
					} else {
						var indexOfExpiredDisplay = self.findIndexOfDisplay(event.streamTag, "streamTag");
						self.removeDisplay(indexOfExpiredDisplay);
						self.displayStatus.occupied -= 1;

						this.liveControl("stop", [event]);

						var ipcNO = parseInt(event.streamTag.charAt(event.streamTag.length - 1));
						global.callStack[i].DevRelatedIPC.splice(ipcNO - 1, 1);

						storage.setItem(event.key, JSON.stringify(global.callStack[i]));
					}
					break;
				}
			}
		},
		addDisplay: function addDisplay(display) {
			var IndexOfEmptySeat = this.findIndexOfEmpty();
			if (IndexOfEmptySeat !== -1) {
				this.$set(this.displays, IndexOfEmptySeat, display);
				this.displayStatus.on++;
				this.displayStatus.off--;
			}
		},
		removeDisplay: function removeDisplay(indexOfExpiredDisplay) {
			if (indexOfExpiredDisplay !== -1) {
				this.$set(this.displays, indexOfExpiredDisplay, undefined);
				this.displayStatus.on--;
				this.displayStatus.off++;
				this.onDisplayRemoved(indexOfExpiredDisplay);
			}
		},
		onDisplayRemoved: function onDisplayRemoved(indexOfExpiredDisplay) {
			if (!this.beforeDestroy) {
				this.processCallStack();
			}
		},
		findIndexOfEmpty: function findIndexOfEmpty() {
			var t = this.displayStatus.total;
			for (var i = 0; i < t; i++) {
				if (!this.displays[i]) {
					return i;
				}
			}
			return -1;
		},
		findIndexOfDisplay: function findIndexOfDisplay(val, key) {
			var t = this.displayStatus.total;
			for (var i = 0; i < t; i++) {
				if (val === (this.displays[i] || {})[key]) {
					return i;
				}
			}
			return -1;
		},
		getIndexOfCallStack: function getIndexOfCallStack(key, value) {
			for (var i = 0; i < global.callStack.length; i++) {
				if ((global.callStack[i] || {})[key] === value) {
					return i;
				}
			}
			return -1;
		},
		RrCc: function RrCc(i) {
			var RrCc;
			var _i = i + 1;
			var rt = 2;
			var ct = 2;
			var _q = parseInt(_i / ct);
			var _r = _i % ct;
			if (_q === 0) {
				var c = _i;
				var r = 1;
			} else if (_r === 0) {
				var c = ct;
				var r = _q;
			} else {
				var c = _r;
				var r = _q + 1;
			}
			RrCc = "R" + r + "C" + c;
			return RrCc;
		}
	},
	created: function created() {},
	mounted: function mounted() {
		this.init();
	},
	beforeDestroy: function beforeDestroy() {
		this.beforeDestroy = true;

		_eventbus2.default.$off('deviceEvent', this.onDeviceEvent);
		_eventbus2.default.$off('stopOneVideoPlayer', this.onStopVideoPlay);
	}
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/common/device.tree.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__("./src/assets/css/sprite/restree.css");

__webpack_require__("./node_modules/ztree/js/jquery.ztree.all.js");

__webpack_require__("./node_modules/ztree/css/zTreeStyle/zTreeStyle.css");

var _dnd = __webpack_require__("./src/mixins/dnd.mixin.js");

var _dnd2 = _interopRequireDefault(_dnd);

var _menubar = __webpack_require__("./src/components/menubar.vue");

var _menubar2 = _interopRequireDefault(_menubar);

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: { menubar: _menubar2.default },
	mixins: [_dnd2.default],
	data: function data() {
		var map = new Map();
		var map1 = new Map();
		return {
			setting: {
				callback: {
					beforeDrag: this.beforeDrag,
					beforeExpand: this.onLoadChildren,
					beforeDragOpen: this.beforeDragOpen,
					beforeDrop: this.beforeDrop,
					onClick: this.onItemClick,
					onRename: this.onRename,
					onRightClick: this.onRightClick
				},
				data: {
					key: {
						title: "title"
					}
				},
				edit: {
					enable: true,
					showRemoveBtn: false,
					showRenameBtn: false,
					drag: {
						prev: false,
						next: false,
						autoOpenTime: 100
					}
				},
				view: {
					selectedMulti: this.showCheckbox,
					showTitle: this.showTitle
				}
			},
			default: {
				type: "default",
				name: L("所有设备"),
				show: true,
				showRoot: true,
				rootNodes: [],
				allowAdd: false,
				allowEdit: false,
				allowDelete: false,
				allowRefresh: true,
				allowMove: true,
				rightMenu: [],
				expandLevel: 2 },
			draggable: {
				selector: "ul.ztree a" },
			treeObj: null,
			$rightMenu: null,
			rightItems: [],
			currentRightTreeId: null,
			currentRightTreeNode: null,
			asyncLock: map1,
			onEditOldName: null };
	},

	props: {
		id: String,
		dimension: String,
		multiSelect: { type: Boolean, default: false },
		showCheckbox: { type: Boolean, default: false },
		selectedNodes: { type: Array, default: function _default() {
				return [];
			} },
		initNodes: { type: Array, default: function _default() {
				return [];
			} },
		dimensions: { type: Array, default: function _default() {
				return [];
			} },
		language: { type: String, default: 'cn' },
		url: { type: String, default: 'getChildren' },
		addurl: { type: String, default: 'addChildren' },
		editurl: { type: String, default: 'editnode' },
		deleteurl: { type: String, default: 'deletenode' },
		moveurl: { type: String, default: 'movenode' },
		notOpen: { type: String, default: L("没有访问的权限") },
		compaticableGridLayout: false,
		setDragData: { type: Function, default: null }
	},
	methods: {
		init: function init() {
			var self = this;

			$.fn.zTree.init($("#" + this.id), this.setting, this.initNodes);
			this.treeObj = $.fn.zTree.getZTreeObj(this.id);
			var temps = [];
			this.dimensions.forEach(function (item) {
				var temp = Object.assign({}, self.default);
				Object.assign(temp, item);
				temp.isParent = true;
				temp.id = temp.type;
				temp.type = 1;
				if (temp.rootNodes && temp.rootNodes.length > 0 && temp.expandLevel > 0) {
					temp.open = true;
					temp.children = temp.rootNodes;
				}
				temps.push(temp);
			});
			this.treeObj.addNodes(null, 0, temps, false);
			this.treeObj.getNodes().forEach(function (item) {
				if (item.expandLevel >= 0) {
					self.onLoadChildren(null, item, item.expandLevel, false);
				}
			});
			if (this.compaticableGridLayout) {
				self.treeObj.setEditable(false);
			}
			this.$rightMenu = $("#tree_menu_" + this.id);
			this.$rightMenu.css({ visibility: "hidden" });
		},
		getRootNode: function getRootNode(treeNode) {
			var temp = treeNode.getPath();
			return temp[0];
		},
		isRootNode: function isRootNode(treeNode) {
			var rootNode = this.getRootNode(treeNode);
			return rootNode == treeNode;
		},
		disableTreeNode: function disableTreeNode(treeNode) {
			var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;

			var temp = treeNode.getPath();
			for (var i = 0; i < temp.length - 1; i++) {
				if (temp[i].type == type) {
					return true;
				}
			}
			return false;
		},
		showRMenu: function showRMenu(treeId, treeNode, x, y) {
			if (this.disableTreeNode(treeNode)) {
				return;
			}
			var self = this;
			this.rightItems = [];
			var rootNode = this.getRootNode(treeNode);
			if (rootNode.allowAdd && treeNode.type != 8) {
				this.rightItems.push({ text: L("添加节点"), name: 'add', click: this.addNode });
			}
			if (rootNode.allowEdit && treeNode != rootNode) {
				this.rightItems.push({ text: L("编辑节点"), name: 'edit', click: this.editNode });
			}
			if (rootNode.allowDelete && treeNode != rootNode) {
				this.rightItems.push({ text: L("删除节点"), name: 'delete', click: this.deleteNode });
			}
			if (rootNode.allowRefresh && treeNode.isParent) {
				this.rightItems.push({ text: L("刷新节点"), name: 'refresh', click: this.refreshNode });
			}
			rootNode.rightMenu.forEach(function (item) {
				if (item.beforeShow && item.beforeShow(treeId, treeNode)) {
					self.rightItems.push({ text: item.text, name: item.name, click: self.onCustomClick, callback: item.callback });
				}
			});
			if (this.rightItems.length == 0) {
				return;
			}
			this.$rightMenu.css({ visibility: "visible" });
			this.$rightMenu.offset({ top: y, left: x });
			$("body").bind("mousedown", this.onBodyMouseDown);

			this.currentRightTreeId = treeId;
			this.currentRightTreeNode = treeNode;
		},
		hiddenRMenu: function hiddenRMenu() {
			this.$rightMenu.css({ visibility: "hidden" });
			$("body").unbind("mousedown", this.onBodyMouseDown);

			this.currentRightTreeId = null;
			this.currentRightTreeNode = null;
		},
		onBodyMouseDown: function onBodyMouseDown(event) {
			if (this.$rightMenu == null) return;
			if (!(event.target.id == "tree_menu_" + this.id || $(event.target).parents("#tree_menu_" + this.id).length > 0)) this.hiddenRMenu();
		},
		onCustomClick: function onCustomClick(rightItem, event) {
			rightItem.callback(this.currentRightTreeId, this.currentRightTreeNode, rightItem.name, this.treeObj, event);
			this.hiddenRMenu();
		},
		addNode: function addNode(rightItem, event) {
			var temp = { name: L("新的节点"), type: 1 };
			var newNode = this.treeObj.addNodes(this.currentRightTreeNode, temp, false);
			if (newNode) {
				this.treeObj.editName(newNode[0]);
			} else {
				alert(L("无法增加子节点"));
			}
			this.hiddenRMenu();
		},
		editNode: function editNode(rightItem, event) {
			this.onEditOldName = this.currentRightTreeNode.name;
			this.treeObj.editName(this.currentRightTreeNode);
			this.hiddenRMenu();
		},
		deleteNode: function deleteNode(rightItem, event) {
			var self = this;
			var treeNode = this.currentRightTreeNode;
			_webservice2.default.getJSON(this.deleteurl, { id: treeNode.id }, function (response) {
				if (response.status == "success") {
					self.treeObj.removeNode(treeNode);
					var oldParentNode = treeNode.getParentNode();
					if (oldParentNode.getParentNode() == null) {
						oldParentNode.isParent = true;
						self.treeObj.updateNode(oldParentNode);
					}
				} else {}
				alert(response.result);
			});
			this.hiddenRMenu();
		},
		refreshNode: function refreshNode() {
			var b = this.currentRightTreeNode.isParent;
			this.treeObj.removeChildNodes(this.currentRightTreeNode);
			this.currentRightTreeNode.isParent = b;
			this.onLoadChildren(this.currentRightTreeId, this.currentRightTreeNode);
			this.hiddenRMenu();
		},
		dropNode: function dropNode(treeNode, targetNode, isCopy) {
			if (targetNode.type == 8) {
				return false;
			}
			if (isCopy) {
				this.treeObj.addNodes(targetNode, -1, treeNode, false);
			} else {
				this.treeObj.removeNode(treeNode, true);
				var oldParentNode = treeNode.getParentNode();
				if (oldParentNode.getParentNode() == null) {
					oldParentNode.isParent = true;
					this.treeObj.updateNode(oldParentNode);
				}
				this.treeObj.addNodes(targetNode, -1, treeNode, false);
			}
		},
		onLoadChildren: function onLoadChildren(treeId, treeNode) {
			var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
			var notOpenMsg = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

			var self = this;
			if (treeNode.children == undefined || treeNode.children.length == 0) {
				if (this.asyncLock.get(treeNode.id)) {
					return false;
				}
				this.asyncLock.set(treeNode.id, true);
				var jqobj = $("#" + treeNode.tId + "_switch");
				jqobj.addClass("loading");
				_webservice2.default.getJSON(this.url, { id: treeNode.id, level: level, type: treeNode.type, targetInfo: treeNode.targetInfo }, function (response) {
					jqobj.removeClass("loading");
					if (response.status == "success" && response.result && response.result.children) {
						self.treeObj.addNodes(treeNode, -1, response.result.children, false);
						self.dndEnabled();
					} else {
						if (notOpenMsg) {
							if (response.status == "fail" && response.result) {
								alert(response.result);
							} else {
								alert(self.notOpen);
							}
						}
					}
					self.asyncLock.delete(treeNode.id);
				});
				return false;
			}
			return true;
		},
		onRightClick: function onRightClick(event, treeId, treeNode) {
			if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
				this.treeObj.cancelSelectedNode();
			} else if (treeNode && !treeNode.noR) {
				this.treeObj.selectNode(treeNode);
				this.showRMenu(treeId, treeNode, event.clientX, event.clientY);
			}
		},
		beforeDrag: function beforeDrag(treeId, treeNodes) {
			if (this.isRootNode(treeNodes[0])) {
				return false;
			}
			if (this.disableTreeNode(treeNodes[0])) {
				return false;
			}
			return this.getRootNode(treeNodes[0]).allowMove;
		},
		beforeDragOpen: function beforeDragOpen(treeId, treeNode) {
			this.onLoadChildren(treeId, treeNode, 2, false);
		},
		beforeDrop: function beforeDrop(treeId, treeNodes, targetNode, moveType, isCopy) {
			if (this.disableTreeNode(targetNode) || targetNode.type == 8) {
				return false;
			}
			var self = this;
			var data = {
				id: treeNodes[0].id,
				targetid: targetNode.id,
				copy: isCopy
			};
			_webservice2.default.getJSON(this.moveurl, data, function (response) {
				if (response.status == "success") {
					self.dropNode(treeNodes[0], targetNode, isCopy);
				} else {
					alert(response.result);
				}
			});
			return false;
		},
		showTitle: function showTitle(treeId, treeNode) {
			return treeNode.title != undefined && treeNode.title != null;
		},
		onItemClick: function onItemClick(event, treeId, treeNode, clickFlag) {
			this.$emit("before-item-click", event, treeId, treeNode);
			if (this.disableTreeNode(treeNode)) {
				return;
			}
			this.$emit("on-item-click", event, treeId, treeNode);
		},
		onRename: function onRename(event, treeId, treeNode) {
			var self = this;
			if (treeNode.id) {
				if (treeNode.name == this.onEditOldName) {
					self.onEditOldName = null;
					return;
				}
				var data = {
					id: treeNode.id,
					name: treeNode.name
				};
				_webservice2.default.getJSON(this.editurl, data, function (response) {
					if (response.status == "success") {} else {
						treeNode.name = self.onEditOldName;
						self.treeObj.updateNode(treeNode);
					}
					alert(response.result);
					self.onEditOldName = null;
				});
			} else {
				var _data = {
					pid: treeNode.getParentNode().id,
					name: treeNode.name,
					type: treeNode.type
				};
				_webservice2.default.getJSON(this.addurl, _data, function (response) {
					if (response.status == "success") {
						treeNode.id = response.result.id;
						self.treeObj.updateNode(treeNode);
						alert(L('添加成功'));
					} else {
						self.treeObj.removeNode(treeNode);
						alert(L(response.result));
					}
				});
			}
		},
		onSetDragData: function onSetDragData(event) {
			if (typeof this.setDragData !== "function") {
				return;
			}
			this.setDragData(event);
		}
	},
	mounted: function mounted() {
		this.init();
	}
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/components/grid.layout.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dnd = __webpack_require__("./src/mixins/dnd.mixin.js");

var _dnd2 = _interopRequireDefault(_dnd);

var _loading = __webpack_require__("./src/mixins/loading.mixin.js");

var _loading2 = _interopRequireDefault(_loading);

var _vue = __webpack_require__("./node_modules/vue/dist/vue.min.js");

var _vue2 = _interopRequireDefault(_vue);

var _asyncloadvue = __webpack_require__("./src/common/asyncloadvue.js");

var _asyncloadvue2 = _interopRequireDefault(_asyncloadvue);

__webpack_require__("./src/assets/js/semantic/components/button.min.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  mixins: [_loading2.default, _dnd2.default],
  data: function data() {
    return {
      maxable: true,
      closeable: true,
      expandCtrlMenu: false,
      droppable: {
        selector: ["td.cell"],
        allowRetry: false,
        params: {} },
      draggable: {
        selector: ["td.cell > :first-child"]
      },
      _layoutId: "",
      cellSources: {} };
  },

  watch: {
    preset: function preset(newValue, oldValue) {
      this.changePresetLayout(newValue);
    }
  },
  methods: {
    onCellDragStart: function onCellDragStart(event) {
      var $cell = this._getCellFromEventTarget(event);
      event.dataTransfer.setData("text", JSON.stringify({
        type: "cell",
        url: $cell.get(0).id
      }));
    },
    onReloadCell: function onReloadCell(cell1) {},
    swapCell: function swapCell(cell1, cell2) {
      var $sourceCell = $(cell1);
      var $targetCell = $(cell2);
      if ($sourceCell.length > 0) {

        var $targetContent = this.getCellContent($targetCell);
        var $sourceContent = this.getCellContent($sourceCell);
        $targetContent.appendTo($sourceCell);
        $sourceContent.appendTo($targetCell);
      }
    },
    _getCellFromEventTarget: function _getCellFromEventTarget(event) {
      if (event.target) {
        var $cell = $(event.target);
        if ($cell.hasClass("cell") && $cell.get(0).tagName == "TD") {
          return $cell;
        } else {
          return $cell.parents("td.cell").eq(0);
        }
      }
    },
    _showCellControlbar: function _showCellControlbar($cell) {
      var $bar = this.getCellControlbar($cell);
      $bar.stop().fadeIn(function () {
        $cell.addClass("hover");
        setTimeout(function () {
          if (!$bar.hasClass("active")) {
            $bar.animate({ opacity: 0.1 });
          }
        }, 1000);
      });
    },
    _hideCellControlbar: function _hideCellControlbar($cell) {
      var $bar = this.getCellControlbar($cell);
      $bar.stop().fadeOut(function () {
        $cell.removeClass("hover");
        $bar.css("opacity", 1);
      });
    },
    onCellControlbarEnter: function onCellControlbarEnter(event) {
      var $bar = this.getCellControlbar(this._getCellFromEventTarget(event));
      if ($bar.length > 0) {
        $bar.stop().animate({ opacity: 0.8 }).addClass("active");
        this.expandCtrlMenu = true;
      }
    },
    onControlbarLeave: function onControlbarLeave(event) {
      var $bar = this.getCellControlbar(this._getCellFromEventTarget(event));
      if ($bar.length > 0) {
        $bar.stop();
        $bar.animate({ opacity: 0.1 });
        $bar.removeClass("active");
        this.expandCtrlMenu = false;
      }
    },
    getCellControlbar: function getCellControlbar($cell) {
      return $cell.children(".cellctrl.buttons").eq(0);
    },
    onEnterCell: function onEnterCell(row, col, event) {
      var $cell = this._getCellFromEventTarget(event);
      this._showCellControlbar($cell);
    },
    onLeaveCell: function onLeaveCell(row, col, event) {
      var $cell = this._getCellFromEventTarget(event);
      this._hideCellControlbar($cell);
    },
    changePresetLayout: function changePresetLayout(preset) {
      var _this = this;

      preset = preset || this.preset;
      var spanBeginCol = 1,
          spanEndCol = 1,
          spanBeginRow = 1,
          spanEndRow = 1;
      var rows = 2,
          cols = 2;
      switch (preset) {
        case 0:
          rows = 1;
          cols = 1;
          break;
        case 1:
          rows = 1;
          cols = 2;
          break;
        case 2:
          rows = 2;
          cols = 2;
          break;
        case 3:
          rows = 3;
          cols = 3;
          break;
        case 4:
          rows = 4;
          cols = 4;
          break;
        case 5:
          rows = 3;
          cols = 4;
          spanBeginRow = 1;
          spanEndRow = 2;
          spanBeginCol = 2;
          spanEndCol = 3;
          break;
        case 6:
          rows = 3;
          cols = 3;
          spanBeginRow = 1;
          spanEndRow = 2;
          spanBeginCol = 1;
          spanEndCol = 2;
          break;
        case 7:
          rows = 3;
          cols = 3;
          spanBeginRow = 1;
          spanEndRow = 2;
          spanBeginCol = 2;
          spanEndCol = 3;
          break;
        default:
          this.preset = 1;
      }
      Object.assign(this, {
        rows: rows,
        cols: cols,
        spanBeginRow: spanBeginRow,
        spanEndRow: spanEndRow,
        spanBeginCol: spanBeginCol,
        spanEndCol: spanEndCol
      });
      this.$nextTick(function () {
        _this.dndEnabled(true);
      });
    },
    onSetDragData: function onSetDragData(event) {
      event.dataTransfer.setData("text", JSON.stringify({
        type: "cell",
        url: $(event.target).parents("td").get(0).id
      }));
    },
    onLoadingRetry: function onLoadingRetry(cell) {
      this._retryLoadview(cell);
      return false;
    },
    onLoadingCancel: function onLoadingCancel(cell) {
      this.hideLoading(cell);
    },
    getFreeCells: function getFreeCells() {
      return $(this.$el).children("tbody>tr>td");
    },
    _getCellName: function _getCellName(targetCell) {
      var cellId = targetCell.id;
      return cellId ? cellId.replace(this.layoutId + "_", "") : "";
    },
    _retryLoadview: function _retryLoadview(targetCell) {
      var cellId = this._getCellName(targetCell);
      var content = this.cellSources[cellId] || {};
      this._loadCellView(targetCell, content);
    },
    _loadCellView: function _loadCellView(targetCell, source) {
      var targetCellID = null;
      if (targetCell) {
        targetCellID = this._getCellName(targetCell);
      } else {
        return;
      }
      try {
        var jsonData = JSON.parse(source);
      } catch (e) {
        var source = source.toLowerCase();
        var defaultType = "url";
        var imageMatch = /\.(jpg|bmp|png|gif|webp)$/i;
        var videoMatch = /\.(mp4|webm|ogg|swf)$/i;
        if (source.endsWith(".vue")) {
          defaultType = "image";
        } else if (imageMatch.test(source)) {
          defaultType = "vue";
        } else if (videoMatch.test(source)) {
          defaultType = "video";
        } else if (source == "") {
          defaultType = "empty";
        }
        var jsonData = {
          type: defaultType,
          url: source,
          useiframe: false,
          params: {}
        };
      }
      switch (jsonData.type) {
        case "image":
          this._loadImage(targetCell, jsonData);
          break;
        case "vue":
          this._loadVue(targetCell, jsonData);
          break;
        case "cell":
          this._loadCell(targetCell, jsonData);
          break;
        case "url":
          this._loadURL(targetCell, jsonData);
          break;
        default:
          targetCellID = false;
          alert("不支持的内容格式！");
          break;
      }

      if (targetCellID) {
        this.cellSources[targetCellID] = jsonData;
      }
    },
    getCellByName: function getCellByName(name) {
      if (typeof name == "string") {
        return $(this.$el).children("#" + this.layoutId + "_" + name).get(0);
      }
    },
    getCellContent: function getCellContent(cell) {
      if (typeof cell == "string") {
        cell = this.getCellByName(cell);
      }
      return $(cell).children(":not(.loading-mixin,.cellctrl)");
    },
    getCellCtrlContent: function getCellCtrlContent(cell) {
      if (typeof cell == "string") {
        cell = this.getCellByName(cell);
      }
      return $(cell).children(".loading-mixin,.cellctrl");
    },
    _loadCell: function _loadCell(targetCell, content) {
      if (content.url != targetCell.id) {
        this.showLoading(targetCell);
        this.swapCell($("#" + content.url).get(0), targetCell);
        this.hideLoading(targetCell);
      }
    },
    _loadVue: function _loadVue(targetCell, content) {

      var self = this;
      self.showLoading(targetCell);
      var ele = document.createElement("div");
      self._PlaceContentToCell(targetCell, ele, { useIFrame: false });
      var vueloader = (0, _asyncloadvue2.default)(content.url, ele, content.params);
      try {
        vueloader.then(function (inst) {
          self.dndSetElementDraggable($(targetCell).children(":not(.loading-mixin)").first());
          self.hideLoading(targetCell);
        }, function (error) {
          self.hideLoading(targetCell);
        });
      } catch (e) {
        self.retryLoading(targetCell, e.message);
      }
    },
    _loadImage: function _loadImage(targetCell, content) {
      this.showLoading(targetCell);
      var self = this;
      var img = document.createElement("img");
      img.style.display = "none";
      img.src = content.url;
      img.addEventListener("load", function () {
        img.style.display = "block";
        if (this.width > this.height) {
          this.setAttribute("width", "100%");
          this.setAttribute("height", 100 * this.height / this.width + "%");
        } else {
          this.setAttribute("width", 100 * this.width / this.height + "%");
          this.setAttribute("height", "100%");
        }
        self.hideLoading(targetCell);
      });
      this._PlaceContentToCell(targetCell, img);
    },
    _loadURL: function _loadURL(targetCell, content) {
      var _this2 = this;

      this.showLoading(targetCell, { retryButton: true });
      var frame = this._createCellFrame();
      this._PlaceContentToCell(targetCell, frame);
      $(frame).on("load", function () {
        _this2.hideLoading(targetCell);
      });
      frame.src = content.url;
    },
    _createCellFrame: function _createCellFrame() {
      var frame = document.createElement("iframe");
      $(frame).css({
        position: "absolute",
        border: "none",
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      }).attr("scrolling", false).attr("src", "about:blank").attr("draggable", true);
      return frame;
    },
    placeToCell: function placeToCell(cell, element, options) {
      var $cell = this.getCellByName(cell);
      if ($cell) {
        this._PlaceContentToCell(cell, element, options);
      }
    },
    clearCell: function clearCell(cell) {
      this.getCellContent(cell).remove();
    },
    _PlaceContentToCell: function _PlaceContentToCell(targetCell, content) {
      var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var $Target = $(targetCell);

      var options = Object.assign({
        allowRetry: this.allowRetry
      }, this.droppable[targetCell.id] || {});
      Object.assign(options, opts);
      $(content).css({
        position: "absolute",
        top: 0,
        left: 0,
        margin: 0,
        width: "100%",
        height: "100%"
      });

      this.clearCell(targetCell);
      if (options.useIFrame) {
        var frame = this._createCellFrame();
        $(frame).attr("src", "about:blank").on("load", function () {
          $(this.contentDocument).find("body").css({
            position: "absolute",
            top: 0,
            left: 0,
            margin: 0,
            width: "100%",
            height: "100%"
          }).append(content);
        });
        $(targetCell).append($(frame));
      } else {
        $(targetCell).append(content);
      }
      return $(content).get(0);
    },
    onDropComplate: function onDropComplate(event) {
      var item = event.dataTransfer.items[0];
      var data = event.dataTransfer.getData("text");
      if (event.target.tagName == "TD") {
        var target = event.target;
      } else {
        var target = $(event.target).parents("td").get(0);
      }
      this._loadCellView(target, data);
    }
  },
  created: function created() {},
  mounted: function mounted() {},

  computed: {
    layoutId: function layoutId() {
      if (this._layoutId == undefined) {
        this._layoutId = "gl" + String(Math.random() * 100).replace(/\d\.\d{8}/, "");
      }
      return this._layoutId;
    }
  },
  props: {
    border: { type: Boolean, default: true },
    rows: { type: Number, default: 2 },
    cols: { type: Number, default: 2 },
    useIFrame: Boolean,
    spanBeginCol: { type: Number, default: 1 },
    spanEndCol: { type: Number, default: 1 },
    spanBeginRow: { type: Number, default: 1 },
    spanEndRow: { type: Number, default: 1 },
    placeholder: { type: String, default: L("拖动要显示的内容到此处") },
    buttons: { type: Array, default: function _default() {
        return [];
      } },
    preset: { type: Number, default: 0 }
  }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/components/video.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, $) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _iptalkurls = __webpack_require__("./src/apps/iptalk/urls.js");

var urls = _interopRequireWildcard(_iptalkurls);

var _loadjs = __webpack_require__("./node_modules/loadjs/dist/loadjs.umd.js");

var _loadjs2 = _interopRequireDefault(_loadjs);

var _eventbus = __webpack_require__("./src/common/eventbus.js");

var _eventbus2 = _interopRequireDefault(_eventbus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ThirdPlayer = function () {
	function ThirdPlayer(player) {
		var _this = this;

		_classCallCheck(this, ThirdPlayer);

		this.player = videojs(player.id, player.opts, function () {
			player.ready(_this.player);
		});
	}

	_createClass(ThirdPlayer, [{
		key: "start",
		value: function start() {
			this.player.play();
		}
	}, {
		key: "stop",
		value: function stop() {
			this.player.dispose();
		}
	}, {
		key: "refresh",
		value: function refresh() {
			var src = this.player.reset().src({
				type: this.player.currentType(),
				src: this.player.currentSrc()
			});
			this.player.load(src).play();
		}
	}]);

	return ThirdPlayer;
}();

var NativePlayer = function () {
	function NativePlayer(player) {
		_classCallCheck(this, NativePlayer);

		this.player = player;
	}

	_createClass(NativePlayer, [{
		key: "start",
		value: function start() {}
	}, {
		key: "stop",
		value: function stop() {}
	}]);

	return NativePlayer;
}();

var dependencies = {
	videoCSS: "https://cdnjs.cloudflare.com/ajax/libs/video.js/6.2.8/video-js.min.css",
	videojs: "https://cdnjs.cloudflare.com/ajax/libs/video.js/6.2.8/video.min.js",
	videojsContribHls: "https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-hls/5.10.1/videojs-contrib-hls.min.js"
};

var defaultVideojsOpts = {
	controls: true,
	aspectRatio: "16:9",
	autoplay: true,
	preload: "auto"
};

exports.default = {
	components: {},
	data: function data() {
		return {
			player: null,
			id: "video_" + this.uuid()
		};
	},

	props: {
		dependencies: { type: Object, default: function _default() {
				return dependencies;
			} },
		videoType: { type: String, default: "" },
		videoSrc: { type: String, default: "" },
		command: { type: String, default: "" },
		playerOpts: { type: Object, default: function _default() {} },
		cameraObj: { type: Object, default: function _default() {} }
	},
	computed: {
		videojsOpts: function videojsOpts() {
			var videojsOpts = Object.assign({}, defaultVideojsOpts, this.playerOpts);
			return videojsOpts;
		}
	},
	methods: {
		test: function test() {
			console.log("meow");
		},
		loadDependencies: function loadDependencies() {
			var self = this;
			return new Promise(function (resolve, reject) {
				if (!self.depsToBeLoaded().length) {
					resolve();
				}
				(0, _loadjs2.default)(self.depsToBeLoaded(), {
					success: function success() {
						global.playerReady[self.videoType] = true;resolve();
					},
					error: function error(e) {
						reject(e);
					},
					async: false
				});
			});
		},
		initPlayer: function initPlayer(type, src) {
			var _this2 = this;

			if (this.player) {
				this.stopPlayer();
			}
			if (type) {
				var player = { id: this.id, opts: this.videojsOpts, ready: function ready(player) {
						_this2.onThirdPlayerReady(player, type, src);
					} };
				this.player = new ThirdPlayer(player);
			} else {
				var player = $("#" + this.id);
				this.player = new NativePlayer(player);
			}
		},
		onThirdPlayerReady: function onThirdPlayerReady(player, type, src) {
			console.log("player is ready");
			this.enablePlayerSizeResponsive(player);
			player.src({
				type: this.formatedType(type),
				src: src
			});


			var refreshComponent = this.createRefreshComponent(player);
			player.controlBar.addChild(refreshComponent, {}, 1);
			if (this.cameraObj.videoType === 'monitor') {
				var stopComponent = this.createStopComponent(player);
				player.controlBar.addChild(stopComponent, {}, 2);
			}
		},
		startPlayer: function startPlayer() {
			this.player.start();
		},
		stopPlayer: function stopPlayer() {
			this.player.stop();
		},
		enablePlayerSizeResponsive: function enablePlayerSizeResponsive(player) {
			var aspectRatio = player.aspectRatio().split(":");
			aspectRatio = aspectRatio[1] / aspectRatio[0];
			var width = $('#' + player.id()).parent().width();
			player.width(width);
			player.height(width * aspectRatio);
			window.onresize = function () {
				var width = $('#' + player.id()).parent().width();
				player.width(width);
				player.height(width * aspectRatio);
			};
		},
		depsToBeLoaded: function depsToBeLoaded() {
			var deps;
			switch (this.videoType) {
				case "hls":
					deps = [this.dependencies.videoCSS, this.dependencies.videojs, this.dependencies.videojsContribHls];break;
				case "rtmp":
					deps = [this.dependencies.videoCSS, this.dependencies.videojs];break;
				case "http":
					deps = [];break;
			}
			return deps;
		},
		formatedType: function formatedType(type) {
			switch (type) {
				case "hls":
					return "application/x-mpegURL";break;
				case "rtmp":
					return "rtmp/flv";break;
				case "http":
					return "";break;
			}
		},
		uuid: function uuid() {
			var d = new Date().getTime();
			var uuid = 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				var r = (d + Math.random() * 16) % 16 | 0;
				d = Math.floor(d / 16);
				return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
			});
			return uuid;
		},
		createRefreshComponent: function createRefreshComponent(player) {
			var Component = videojs.getComponent("Component");

			var RefreshComponent = videojs.extend(Component, {
				createEl: function createEl() {
					var button = document.createElement("button");
					button.innerHTML = "刷新";
					return button;
				}
			});

			var refreshComponent = new RefreshComponent();

			var self = this;
			refreshComponent.on("click", function () {
				self.player.refresh();
			});

			refreshComponent.on("dispose", function () {});


			return refreshComponent;
		},
		createStopComponent: function createStopComponent(player) {
			var Component = videojs.getComponent("Component");

			var StopComponent = videojs.extend(Component, {
				createEl: function createEl() {
					var button = document.createElement("button");
					button.innerHTML = "结束";
					return button;
				}
			});

			var stopComponent = new StopComponent();

			var self = this;
			stopComponent.on("click", function () {
				var camera = self.cameraObj;
				if (camera.type === 'mic') {
					for (var i = 0; i < global.callStack.length; i++) {
						if ((global.callStack[i] || {}).DevIP === camera.key) {
							if (global.callStack[i].DevRelatedIPC.length === 0) {
								self.emitStopPaly(camera);
							} else {
								confirm(L("结束终端视频，联动摄像头的视频将被一起结束，确定结束吗？")).then(function (obj) {
									if (obj.button.classs === "positive") {
										self.emitStopPaly(camera);
									}
								});
							}
							break;
						}
					}
				} else {
					self.emitStopPaly(camera);
				}
			});

			stopComponent.on("dispose", function () {});


			return stopComponent;
		},
		emitStopPaly: function emitStopPaly(camera) {
			_eventbus2.default.$emit("stopOneVideoPlayer", camera);
		},
		addRefreshButton: function addRefreshButton(player, refreshComponent) {
			player.controlBar.addChild(refreshComponent, {}, 5);
		}
	},
	created: function created() {},
	beforeDestroy: function beforeDestroy() {
		this.stopPlayer();
	},
	mounted: function mounted() {
		this.$nextTick(function () {
			if (!global.playerReady[this.videoType]) {
				var self = this;
				this.loadDependencies().then(function () {
					self.initPlayer(self.videoType, self.videoSrc);
				}, function (e) {
					console.error(e);
				});
			} else {
				this.initPlayer(this.videoType, this.videoSrc);
			}
		});
	}
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js"), __webpack_require__("./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6e2a585c\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/grid.layout.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.grid-layout{\r\n\tposition:absolute;\r\n\ttop:0px;\r\n\tleft:0px;\r\n\twidth: 100%;\r\n\theight:100%;\n}\n.grid-layout>table{\r\n\tposition:absolute;\r\n\ttop:0px;\r\n\tleft:0px;\r\n\twidth: 100%;\r\n\theight:100%;\r\n  border-collapse:separate; \r\n\ttable-layout:fixed\n}\n.grid-layout>table>tbody>tr>td{\r\n\tposition:relative;\r\n\tborder:1px solid #DDD;\r\n\ttext-align: center;\r\n\tbackground:#c5c5c5;\n}\n.grid-layout>table>tbody>tr>td.active{\r\n  border:1px solid red;\n}\n.grid-layout>table>tbody>tr>td>:not(.cellctrl){\r\n\tposition:absolute;\r\n\ttop:0px;\r\n\tleft:0px;\r\n\twidth: 100%;\r\n\theight:100%;\n}\n.grid-layout>table>tbody>tr>td>.cellctrl.ui.buttons{\r\n  position:absolute;\r\n  top:5px;\r\n  right:5px;\r\n  background:rgba(0,0,0,.5);\r\n  z-index: 9999;\r\n  border-radius: 4px;\r\n  display: none\n}\n.grid-layout>table>tbody>tr>td.hover>.cellctrl.ui.buttons{\r\n  display: block;\n}\n.grid-layout>table>tbody>tr>td>.cellctrl.ui.buttons>.ui.button{\r\n  background:rgba(0,0,0,.5);\r\n  color:#DDD;\n}\n.grid-layout>table>tbody>tr>td>.cellctrl.ui.buttons>.ui.button:hover{\r\n  color:yellow;\n}\n.grid-layout>table>tbody>tr>td>.cellctrl.placeholder{\r\n  color:#ddd;\r\n  font-size: 1em;\n}\n.grid-layout>table>tbody>tr>td:first{\r\n\tborder-left: none;\n}\n.grid-layout>table>tbody>tr>td:last{\r\n\tborder-right: none;\n}\n.grid-layout>table>tbody>tr>td.dragenter{\r\n\tborder:1px solid red;\n}\r\n\r\n\r\n\r\n\r\n\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7416abd6\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/common/device.tree.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.ztree li span.button.loading.switch.roots_close,\r\n.ztree li span.button.loading.switch.center_close,\r\n.ztree li span.button.loading.switch.bottom_close\r\n{\r\n\twidth:14px;\r\n\theight:14px;\r\n\tmargin: 2px;\r\n\tborder-radius:50%;\r\n\tborder:2px solid #767676;\r\n\tborder-right-color:transparent;\r\n\t-webkit-transform: rotate(360deg); \r\n\t-webkit-animation: spin 1s linear infinite;\r\n\tbackground-image:none;\n}\n@-webkit-keyframes spin {\nfrom {-webkit-transform: rotate(0deg);\n}\nto {-webkit-transform: rotate(360deg);\n}\n}\n@keyframes spin {\nfrom {transform: rotate(0deg);\n}\nto {transform: rotate(360deg);\n}\n}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7416abd6\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/common/device.tree.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.devicestree[data-v-7416abd6]{\r\n\tposition: relative;\r\n\twidth: 100%;\r\n\theight: 100%;\n}\n.devicestree .menu[data-v-7416abd6]{\r\n\tposition: absolute;\r\n\ttop: 0px;\r\n\tleft: 0px;\r\n\twidth: 6em;\r\n\twidth: -moz-calc(5em + 18px);/*margin 5*4=20*/\r\n\twidth: -webkit-calc(5em + 18px);\r\n\twidth: calc(6em + 18px);\n}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7a48d305\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/video.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.videoContainer[data-v-7a48d305] {\n\tposition: relative;\n\ttop: 50%;\n\ttransform: translateY(-50%);\n}\n\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-fbed9b74\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/apps/iptalk/commander.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.commander .grid-layout > table > tbody > tr > td {\n\tbackground-color: rgba(0, 0, 0, 0.8);\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-fbed9b74\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/commander.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.commander[data-v-fbed9b74],\n.commander .left-panel[data-v-fbed9b74],\n.commander .left-panel .tree[data-v-fbed9b74],\n.commander .right-panel[data-v-fbed9b74] {\n\tposition: relative;\n}\n.commander[data-v-fbed9b74],\n.commander .left-panel[data-v-fbed9b74] {\n\theight: calc(100% - 1px);  /* 为了不挡住底边 1px 的 border */\n}\n.commander .left-panel .tree[data-v-fbed9b74],\n.commander .right-panel[data-v-fbed9b74] {\n\theight: 100%;\n}\n.commander[data-v-fbed9b74] {\n    border-radius: 5px 0 0 5px;\n}\n.commander .left-panel[data-v-fbed9b74] {\n\tfloat: left;\n\twidth: 250px;\n\toverflow:auto;\n    border-radius: 5px;\n}\n.commander .left-panel .tree[data-v-fbed9b74],\n.commander .right-panel[data-v-fbed9b74] {\n\tbackground-color: #fff;\n}\n.commander .right-panel[data-v-fbed9b74] {\n\twidth: 100%;\n\t/*width: calc(100% - 250px);*/\n\tfloat: left;\n\tborder-left: 1px solid #d9d9d9;\n\tborder-bottom: 1px solid #d9d9d9;\n\tborder-radius: 0 5px 5px 0;\n}\t\n\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/ztree/css/zTreeStyle/zTreeStyle.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "/*-------------------------------------\nzTree Style\n\nversion:\t3.5.19\nauthor:\t\tHunter.z\nemail:\t\thunter.z@263.net\nwebsite:\thttp://code.google.com/p/jquerytree/\n\n-------------------------------------*/\n\n.ztree * {padding:0; margin:0; font-size:12px; font-family: Verdana, Arial, Helvetica, AppleGothic, sans-serif}\n.ztree {margin:0; padding:5px; color:#333}\n.ztree li{padding:0; margin:0; list-style:none; line-height:14px; text-align:left; white-space:nowrap; outline:0}\n.ztree li ul{ margin:0; padding:0 0 0 18px}\n.ztree li ul.line{ background:url(" + __webpack_require__("./node_modules/ztree/css/zTreeStyle/img/line_conn.gif") + ") 0 0 repeat-y;}\n\n.ztree li a {padding:1px 3px 0 0; margin:0; cursor:pointer; height:17px; color:#333; background-color: transparent;\n\ttext-decoration:none; vertical-align:top; display: inline-block}\n.ztree li a:hover {text-decoration:underline}\n.ztree li a.curSelectedNode {padding-top:0px; background-color:#FFE6B0; color:black; height:16px; border:1px #FFB951 solid; opacity:0.8;}\n.ztree li a.curSelectedNode_Edit {padding-top:0px; background-color:#FFE6B0; color:black; height:16px; border:1px #FFB951 solid; opacity:0.8;}\n.ztree li a.tmpTargetNode_inner {padding-top:0px; background-color:#316AC5; color:white; height:16px; border:1px #316AC5 solid;\n\topacity:0.8; filter:alpha(opacity=80)}\n.ztree li a.tmpTargetNode_prev {}\n.ztree li a.tmpTargetNode_next {}\n.ztree li a input.rename {height:14px; width:80px; padding:0; margin:0;\n\tfont-size:12px; border:1px #7EC4CC solid; *border:0px}\n.ztree li span {line-height:16px; margin-right:2px}\n.ztree li span.button {line-height:0; margin:0; width:16px; height:16px; display: inline-block; vertical-align:middle;\n\tborder:0 none; cursor: pointer;outline:none;\n\tbackground-color:transparent; background-repeat:no-repeat; background-attachment: scroll;\n\tbackground-image:url(" + __webpack_require__("./node_modules/ztree/css/zTreeStyle/img/zTreeStandard.png") + "); *background-image:url(" + __webpack_require__("./node_modules/ztree/css/zTreeStyle/img/zTreeStandard.gif") + ")}\n\n.ztree li span.button.chk {width:13px; height:13px; margin:0 3px 0 0; cursor: auto}\n.ztree li span.button.chk.checkbox_false_full {background-position:0 0}\n.ztree li span.button.chk.checkbox_false_full_focus {background-position:0 -14px}\n.ztree li span.button.chk.checkbox_false_part {background-position:0 -28px}\n.ztree li span.button.chk.checkbox_false_part_focus {background-position:0 -42px}\n.ztree li span.button.chk.checkbox_false_disable {background-position:0 -56px}\n.ztree li span.button.chk.checkbox_true_full {background-position:-14px 0}\n.ztree li span.button.chk.checkbox_true_full_focus {background-position:-14px -14px}\n.ztree li span.button.chk.checkbox_true_part {background-position:-14px -28px}\n.ztree li span.button.chk.checkbox_true_part_focus {background-position:-14px -42px}\n.ztree li span.button.chk.checkbox_true_disable {background-position:-14px -56px}\n.ztree li span.button.chk.radio_false_full {background-position:-28px 0}\n.ztree li span.button.chk.radio_false_full_focus {background-position:-28px -14px}\n.ztree li span.button.chk.radio_false_part {background-position:-28px -28px}\n.ztree li span.button.chk.radio_false_part_focus {background-position:-28px -42px}\n.ztree li span.button.chk.radio_false_disable {background-position:-28px -56px}\n.ztree li span.button.chk.radio_true_full {background-position:-42px 0}\n.ztree li span.button.chk.radio_true_full_focus {background-position:-42px -14px}\n.ztree li span.button.chk.radio_true_part {background-position:-42px -28px}\n.ztree li span.button.chk.radio_true_part_focus {background-position:-42px -42px}\n.ztree li span.button.chk.radio_true_disable {background-position:-42px -56px}\n\n.ztree li span.button.switch {width:18px; height:18px}\n.ztree li span.button.root_open{background-position:-92px -54px}\n.ztree li span.button.root_close{background-position:-74px -54px}\n.ztree li span.button.roots_open{background-position:-92px 0}\n.ztree li span.button.roots_close{background-position:-74px 0}\n.ztree li span.button.center_open{background-position:-92px -18px}\n.ztree li span.button.center_close{background-position:-74px -18px}\n.ztree li span.button.bottom_open{background-position:-92px -36px}\n.ztree li span.button.bottom_close{background-position:-74px -36px}\n.ztree li span.button.noline_open{background-position:-92px -72px}\n.ztree li span.button.noline_close{background-position:-74px -72px}\n.ztree li span.button.root_docu{ background:none;}\n.ztree li span.button.roots_docu{background-position:-56px 0}\n.ztree li span.button.center_docu{background-position:-56px -18px}\n.ztree li span.button.bottom_docu{background-position:-56px -36px}\n.ztree li span.button.noline_docu{ background:none;}\n\n.ztree li span.button.ico_open{margin-right:2px; background-position:-110px -16px; vertical-align:top; *vertical-align:middle}\n.ztree li span.button.ico_close{margin-right:2px; background-position:-110px 0; vertical-align:top; *vertical-align:middle}\n.ztree li span.button.ico_docu{margin-right:2px; background-position:-110px -32px; vertical-align:top; *vertical-align:middle}\n.ztree li span.button.edit {margin-right:2px; background-position:-110px -48px; vertical-align:top; *vertical-align:middle}\n.ztree li span.button.remove {margin-right:2px; background-position:-110px -64px; vertical-align:top; *vertical-align:middle}\n\n.ztree li span.button.ico_loading{margin-right:2px; background:url(" + __webpack_require__("./node_modules/ztree/css/zTreeStyle/img/loading.gif") + ") no-repeat scroll 0 0 transparent; vertical-align:top; *vertical-align:middle}\n\nul.tmpTargetzTree {background-color:#FFE6B0; opacity:0.8; filter:alpha(opacity=80)}\n\nspan.tmpzTreeMove_arrow {width:16px; height:16px; display: inline-block; padding:0; margin:2px 0 0 1px; border:0 none; position:absolute;\n\tbackground-color:transparent; background-repeat:no-repeat; background-attachment: scroll;\n\tbackground-position:-110px -80px; background-image:url(" + __webpack_require__("./node_modules/ztree/css/zTreeStyle/img/zTreeStandard.png") + "); *background-image:url(" + __webpack_require__("./node_modules/ztree/css/zTreeStyle/img/zTreeStandard.gif") + ")}\n\nul.ztree.zTreeDragUL {margin:0; padding:0; position:absolute; width:auto; height:auto;overflow:hidden; background-color:#cfcfcf; border:1px #00B83F dotted; opacity:0.8; filter:alpha(opacity=80)}\n.zTreeMask {z-index:10000; background-color:#cfcfcf; opacity:0.0; filter:alpha(opacity=0); position:absolute}\n\n/* level style*/\n/*.ztree li span.button.level0 {\n\tdisplay:none;\n}\n.ztree li ul.level0 {\n\tpadding:0;\n\tbackground:none;\n}*/", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./src/assets/css/sprite/restree.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ".ztree li span.button.aircle_ico_open {background: -16px 0;}\r\n.ztree li span.button.aircle_ico_close {background: -16px 0;}\r\n.ztree li span.button.aircle_ico_docu {background: -16px 0;}\r\n.ztree li span.button.alarm_ico_open {background: -112px -16px;}\r\n.ztree li span.button.alarm_ico_close {background: -112px -16px;}\r\n.ztree li span.button.alarm_ico_docu {background: -112px -16px;}\r\n.ztree li span.button.alarm2_ico_open {background: 0 -16px;}\r\n.ztree li span.button.alarm2_ico_close {background: 0 -16px;}\r\n.ztree li span.button.alarm2_ico_docu {background: 0 -16px;}\r\n.ztree li span.button.alarmbox_ico_open {background: -16px -16px;}\r\n.ztree li span.button.alarmbox_ico_close {background: -16px -16px;}\r\n.ztree li span.button.alarmbox_ico_docu {background: -16px -16px;}\r\n.ztree li span.button.all_ico_open {background: -32px 0;}\r\n.ztree li span.button.all_ico_close {background: -32px 0;}\r\n.ztree li span.button.all_ico_docu {background: -32px 0;}\r\n.ztree li span.button.attrib_ico_open {background: -32px -16px;}\r\n.ztree li span.button.attrib_ico_close {background: -32px -16px;}\r\n.ztree li span.button.attrib_ico_docu {background: -32px -16px;}\r\n.ztree li span.button.attrib2_ico_open {background: 0 -32px;}\r\n.ztree li span.button.attrib2_ico_close {background: 0 -32px;}\r\n.ztree li span.button.attrib2_ico_docu {background: 0 -32px;}\r\n.ztree li span.button.authusers_ico_open {background: -16px -32px;}\r\n.ztree li span.button.authusers_ico_close {background: -16px -32px;}\r\n.ztree li span.button.authusers_ico_docu {background: -16px -32px;}\r\n.ztree li span.button.blank_ico_open {background: -32px -32px;}\r\n.ztree li span.button.blank_ico_close {background: -32px -32px;}\r\n.ztree li span.button.blank_ico_docu {background: -32px -32px;}\r\n.ztree li span.button.books_ico_open {background: -48px 0;}\r\n.ztree li span.button.books_ico_close {background: -48px 0;}\r\n.ztree li span.button.books_ico_docu {background: -48px 0;}\r\n.ztree li span.button.caller_ico_open {background: -48px -16px;}\r\n.ztree li span.button.caller_ico_close {background: -48px -16px;}\r\n.ztree li span.button.caller_ico_docu {background: -48px -16px;}\r\n.ztree li span.button.callman_ico_open {background: -48px -32px;}\r\n.ztree li span.button.callman_ico_close {background: -48px -32px;}\r\n.ztree li span.button.callman_ico_docu {background: -48px -32px;}\r\n.ztree li span.button.camera_ico_open {background: 0 -48px;}\r\n.ztree li span.button.camera_ico_close {background: 0 -48px;}\r\n.ztree li span.button.camera_ico_docu {background: 0 -48px;}\r\n.ztree li span.button.camera1_ico_open {background: -16px -48px;}\r\n.ztree li span.button.camera1_ico_close {background: -16px -48px;}\r\n.ztree li span.button.camera1_ico_docu {background: -16px -48px;}\r\n.ztree li span.button.camera3_ico_open {background: -32px -48px;}\r\n.ztree li span.button.camera3_ico_close {background: -32px -48px;}\r\n.ztree li span.button.camera3_ico_docu {background: -32px -48px;}\r\n.ztree li span.button.camera4_ico_open {background: -48px -48px;}\r\n.ztree li span.button.camera4_ico_close {background: -48px -48px;}\r\n.ztree li span.button.camera4_ico_docu {background: -48px -48px;}\r\n.ztree li span.button.charge_ico_open {background: -64px 0;}\r\n.ztree li span.button.charge_ico_close {background: -64px 0;}\r\n.ztree li span.button.charge_ico_docu {background: -64px 0;}\r\n.ztree li span.button.chat_ico_open {background: -64px -16px;}\r\n.ztree li span.button.chat_ico_close {background: -64px -16px;}\r\n.ztree li span.button.chat_ico_docu {background: -64px -16px;}\r\n.ztree li span.button.company_ico_open {background: -64px -32px;}\r\n.ztree li span.button.company_ico_close {background: -64px -32px;}\r\n.ztree li span.button.company_ico_docu {background: -64px -32px;}\r\n.ztree li span.button.computer_ico_open {background: -64px -48px;}\r\n.ztree li span.button.computer_ico_close {background: -64px -48px;}\r\n.ztree li span.button.computer_ico_docu {background: -64px -48px;}\r\n.ztree li span.button.computer1_ico_open {background: 0 -64px;}\r\n.ztree li span.button.computer1_ico_close {background: 0 -64px;}\r\n.ztree li span.button.computer1_ico_docu {background: 0 -64px;}\r\n.ztree li span.button.computer2_ico_open {background: -16px -64px;}\r\n.ztree li span.button.computer2_ico_close {background: -16px -64px;}\r\n.ztree li span.button.computer2_ico_docu {background: -16px -64px;}\r\n.ztree li span.button.computer3_ico_open {background: -32px -64px;}\r\n.ztree li span.button.computer3_ico_close {background: -32px -64px;}\r\n.ztree li span.button.computer3_ico_docu {background: -32px -64px;}\r\n.ztree li span.button.contact_ico_open {background: -48px -64px;}\r\n.ztree li span.button.contact_ico_close {background: -48px -64px;}\r\n.ztree li span.button.contact_ico_docu {background: -48px -64px;}\r\n.ztree li span.button.contact2_ico_open {background: -64px -64px;}\r\n.ztree li span.button.contact2_ico_close {background: -64px -64px;}\r\n.ztree li span.button.contact2_ico_docu {background: -64px -64px;}\r\n.ztree li span.button.dbs_ico_open {background: -80px 0;}\r\n.ztree li span.button.dbs_ico_close {background: -80px 0;}\r\n.ztree li span.button.dbs_ico_docu {background: -80px 0;}\r\n.ztree li span.button.dept_ico_open {background: -80px -16px;}\r\n.ztree li span.button.dept_ico_close {background: -80px -16px;}\r\n.ztree li span.button.dept_ico_docu {background: -80px -16px;}\r\n.ztree li span.button.device_ico_open {background: -80px -32px;}\r\n.ztree li span.button.device_ico_close {background: -80px -32px;}\r\n.ztree li span.button.device_ico_docu {background: -80px -32px;}\r\n.ztree li span.button.devicegroup_ico_open {background: -80px -48px;}\r\n.ztree li span.button.devicegroup_ico_close {background: -80px -48px;}\r\n.ztree li span.button.devicegroup_ico_docu {background: -80px -48px;}\r\n.ztree li span.button.devicetype_ico_open {background: -80px -64px;}\r\n.ztree li span.button.devicetype_ico_close {background: -80px -64px;}\r\n.ztree li span.button.devicetype_ico_docu {background: -80px -64px;}\r\n.ztree li span.button.devicetypes_ico_open {background: 0 -80px;}\r\n.ztree li span.button.devicetypes_ico_close {background: 0 -80px;}\r\n.ztree li span.button.devicetypes_ico_docu {background: 0 -80px;}\r\n.ztree li span.button.dl_ico_open {background: -16px -80px;}\r\n.ztree li span.button.dl_ico_close {background: -16px -80px;}\r\n.ztree li span.button.dl_ico_docu {background: -16px -80px;}\r\n.ztree li span.button.factory_ico_open {background: -32px -80px;}\r\n.ztree li span.button.factory_ico_close {background: -32px -80px;}\r\n.ztree li span.button.factory_ico_docu {background: -32px -80px;}\r\n.ztree li span.button.favorite_ico_open {background: -48px -80px;}\r\n.ztree li span.button.favorite_ico_close {background: -48px -80px;}\r\n.ztree li span.button.favorite_ico_docu {background: -48px -80px;}\r\n.ztree li span.button.find_ico_open {background: -64px -80px;}\r\n.ztree li span.button.find_ico_close {background: -64px -80px;}\r\n.ztree li span.button.find_ico_docu {background: -64px -80px;}\r\n.ztree li span.button.flags_ico_open {background: -80px -80px;}\r\n.ztree li span.button.flags_ico_close {background: -80px -80px;}\r\n.ztree li span.button.flags_ico_docu {background: -80px -80px;}\r\n.ztree li span.button.folderclose_ico_open {background: -96px 0;}\r\n.ztree li span.button.folderclose_ico_close {background: -96px 0;}\r\n.ztree li span.button.folderclose_ico_docu {background: -96px 0;}\r\n.ztree li span.button.folderfind_ico_open {background: -96px -16px;}\r\n.ztree li span.button.folderfind_ico_close {background: -96px -16px;}\r\n.ztree li span.button.folderfind_ico_docu {background: -96px -16px;}\r\n.ztree li span.button.folderopen_ico_open {background: -96px -32px;}\r\n.ztree li span.button.folderopen_ico_close {background: -96px -32px;}\r\n.ztree li span.button.folderopen_ico_docu {background: -96px -32px;}\r\n.ztree li span.button.graph_ico_open {background: -96px -48px;}\r\n.ztree li span.button.graph_ico_close {background: -96px -48px;}\r\n.ztree li span.button.graph_ico_docu {background: -96px -48px;}\r\n.ztree li span.button.graph2_ico_open {background: -96px -64px;}\r\n.ztree li span.button.graph2_ico_close {background: -96px -64px;}\r\n.ztree li span.button.graph2_ico_docu {background: -96px -64px;}\r\n.ztree li span.button.graph3_ico_open {background: -96px -80px;}\r\n.ztree li span.button.graph3_ico_close {background: -96px -80px;}\r\n.ztree li span.button.graph3_ico_docu {background: -96px -80px;}\r\n.ztree li span.button.graph4_ico_open {background: 0 -96px;}\r\n.ztree li span.button.graph4_ico_close {background: 0 -96px;}\r\n.ztree li span.button.graph4_ico_docu {background: 0 -96px;}\r\n.ztree li span.button.graph5_ico_open {background: -16px -96px;}\r\n.ztree li span.button.graph5_ico_close {background: -16px -96px;}\r\n.ztree li span.button.graph5_ico_docu {background: -16px -96px;}\r\n.ztree li span.button.home_ico_open {background: -32px -96px;}\r\n.ztree li span.button.home_ico_close {background: -32px -96px;}\r\n.ztree li span.button.home_ico_docu {background: -32px -96px;}\r\n.ztree li span.button.hyt16_ico_open {background: -108px -32px;}\r\n.ztree li span.button.hyt16_ico_close {background: -108px -32px;}\r\n.ztree li span.button.hyt16_ico_docu {background: -108px -32px;}\r\n.ztree li span.button.image_ico_open {background: -48px -96px;}\r\n.ztree li span.button.image_ico_close {background: -48px -96px;}\r\n.ztree li span.button.image_ico_docu {background: -48px -96px;}\r\n.ztree li span.button.images_ico_open {background: -64px -96px;}\r\n.ztree li span.button.images_ico_close {background: -64px -96px;}\r\n.ztree li span.button.images_ico_docu {background: -64px -96px;}\r\n.ztree li span.button.inj_ico_open {background: -80px -96px;}\r\n.ztree li span.button.inj_ico_close {background: -80px -96px;}\r\n.ztree li span.button.inj_ico_docu {background: -80px -96px;}\r\n.ztree li span.button.internet_ico_open {background: -96px -96px;}\r\n.ztree li span.button.internet_ico_close {background: -96px -96px;}\r\n.ztree li span.button.internet_ico_docu {background: -96px -96px;}\r\n.ztree li span.button.lamp_ico_open {background: -112px 0;}\r\n.ztree li span.button.lamp_ico_close {background: -112px 0;}\r\n.ztree li span.button.lamp_ico_docu {background: -112px 0;}\r\n.ztree li span.button.lb_ico_open {background: 0 0;}\r\n.ztree li span.button.lb_ico_close {background: 0 0;}\r\n.ztree li span.button.lb_ico_docu {background: 0 0;}\r\n.ztree li span.button.link_ico_open {background: -112px -32px;}\r\n.ztree li span.button.link_ico_close {background: -112px -32px;}\r\n.ztree li span.button.link_ico_docu {background: -112px -32px;}\r\n.ztree li span.button.loc_ico_open {background: -112px -48px;}\r\n.ztree li span.button.loc_ico_close {background: -112px -48px;}\r\n.ztree li span.button.loc_ico_docu {background: -112px -48px;}\r\n.ztree li span.button.loc2_ico_open {background: -112px -64px;}\r\n.ztree li span.button.loc2_ico_close {background: -112px -64px;}\r\n.ztree li span.button.loc2_ico_docu {background: -112px -64px;}\r\n.ztree li span.button.lock_ico_open {background: -112px -80px;}\r\n.ztree li span.button.lock_ico_close {background: -112px -80px;}\r\n.ztree li span.button.lock_ico_docu {background: -112px -80px;}\r\n.ztree li span.button.mail_fold_ico_open {background: 0 -81px;}\r\n.ztree li span.button.mail_fold_ico_close {background: 0 -81px;}\r\n.ztree li span.button.mail_fold_ico_docu {background: 0 -81px;}\r\n.ztree li span.button.mail_unfold_ico_open {background: -65px -64px;}\r\n.ztree li span.button.mail_unfold_ico_close {background: -65px -64px;}\r\n.ztree li span.button.mail_unfold_ico_docu {background: -65px -64px;}\r\n.ztree li span.button.major_ico_open {background: -112px -96px;}\r\n.ztree li span.button.major_ico_close {background: -112px -96px;}\r\n.ztree li span.button.major_ico_docu {background: -112px -96px;}\r\n.ztree li span.button.mans_ico_open {background: 0 -112px;}\r\n.ztree li span.button.mans_ico_close {background: 0 -112px;}\r\n.ztree li span.button.mans_ico_docu {background: 0 -112px;}\r\n.ztree li span.button.meeting_ico_open {background: -16px -112px;}\r\n.ztree li span.button.meeting_ico_close {background: -16px -112px;}\r\n.ztree li span.button.meeting_ico_docu {background: -16px -112px;}\r\n.ztree li span.button.meeyi16.gray_ico_open {background: -83px 0;}\r\n.ztree li span.button.meeyi16.gray_ico_close {background: -83px 0;}\r\n.ztree li span.button.meeyi16.gray_ico_docu {background: -83px 0;}\r\n.ztree li span.button.meeyi16.red_ico_open {background: -83px -16px;}\r\n.ztree li span.button.meeyi16.red_ico_close {background: -83px -16px;}\r\n.ztree li span.button.meeyi16.red_ico_docu {background: -83px -16px;}\r\n.ztree li span.button.mic_ico_open {background: -32px -112px;}\r\n.ztree li span.button.mic_ico_close {background: -32px -112px;}\r\n.ztree li span.button.mic_ico_docu {background: -32px -112px;}\r\n.ztree li span.button.mphone_ico_open {background: -48px -112px;}\r\n.ztree li span.button.mphone_ico_close {background: -48px -112px;}\r\n.ztree li span.button.mphone_ico_docu {background: -48px -112px;}\r\n.ztree li span.button.net_ico_open {background: -64px -112px;}\r\n.ztree li span.button.net_ico_close {background: -64px -112px;}\r\n.ztree li span.button.net_ico_docu {background: -64px -112px;}\r\n.ztree li span.button.net2_ico_open {background: -80px -112px;}\r\n.ztree li span.button.net2_ico_close {background: -80px -112px;}\r\n.ztree li span.button.net2_ico_docu {background: -80px -112px;}\r\n.ztree li span.button.net3_ico_open {background: -96px -112px;}\r\n.ztree li span.button.net3_ico_close {background: -96px -112px;}\r\n.ztree li span.button.net3_ico_docu {background: -96px -112px;}\r\n.ztree li span.button.netunit_ico_open {background: -112px -112px;}\r\n.ztree li span.button.netunit_ico_close {background: -112px -112px;}\r\n.ztree li span.button.netunit_ico_docu {background: -112px -112px;}\r\n.ztree li span.button.netunit2_ico_open {background: -128px 0;}\r\n.ztree li span.button.netunit2_ico_close {background: -128px 0;}\r\n.ztree li span.button.netunit2_ico_docu {background: -128px 0;}\r\n.ztree li span.button.netuser_ico_open {background: -128px -16px;}\r\n.ztree li span.button.netuser_ico_close {background: -128px -16px;}\r\n.ztree li span.button.netuser_ico_docu {background: -128px -16px;}\r\n.ztree li span.button.note_ico_open {background: -128px -32px;}\r\n.ztree li span.button.note_ico_close {background: -128px -32px;}\r\n.ztree li span.button.note_ico_docu {background: -128px -32px;}\r\n.ztree li span.button.note2_ico_open {background: -128px -48px;}\r\n.ztree li span.button.note2_ico_close {background: -128px -48px;}\r\n.ztree li span.button.note2_ico_docu {background: -128px -48px;}\r\n.ztree li span.button.notify_ico_open {background: -128px -64px;}\r\n.ztree li span.button.notify_ico_close {background: -128px -64px;}\r\n.ztree li span.button.notify_ico_docu {background: -128px -64px;}\r\n.ztree li span.button.notifypage_ico_open {background: -128px -80px;}\r\n.ztree li span.button.notifypage_ico_close {background: -128px -80px;}\r\n.ztree li span.button.notifypage_ico_docu {background: -128px -80px;}\r\n.ztree li span.button.org_ico_open {background: -128px -96px;}\r\n.ztree li span.button.org_ico_close {background: -128px -96px;}\r\n.ztree li span.button.org_ico_docu {background: -128px -96px;}\r\n.ztree li span.button.org2_ico_open {background: -128px -112px;}\r\n.ztree li span.button.org2_ico_close {background: -128px -112px;}\r\n.ztree li span.button.org2_ico_docu {background: -128px -112px;}\r\n.ztree li span.button.org22_ico_open {background: 0 -128px;}\r\n.ztree li span.button.org22_ico_close {background: 0 -128px;}\r\n.ztree li span.button.org22_ico_docu {background: 0 -128px;}\r\n.ztree li span.button.org3_ico_open {background: -16px -128px;}\r\n.ztree li span.button.org3_ico_close {background: -16px -128px;}\r\n.ztree li span.button.org3_ico_docu {background: -16px -128px;}\r\n.ztree li span.button.outj_ico_open {background: -32px -128px;}\r\n.ztree li span.button.outj_ico_close {background: -32px -128px;}\r\n.ztree li span.button.outj_ico_docu {background: -32px -128px;}\r\n.ztree li span.button.phone_ico_open {background: -48px -128px;}\r\n.ztree li span.button.phone_ico_close {background: -48px -128px;}\r\n.ztree li span.button.phone_ico_docu {background: -48px -128px;}\r\n.ztree li span.button.point_green_ico_open {background: -64px -128px;}\r\n.ztree li span.button.point_green_ico_close {background: -64px -128px;}\r\n.ztree li span.button.point_green_ico_docu {background: -64px -128px;}\r\n.ztree li span.button.point_red_ico_open {background: -80px -128px;}\r\n.ztree li span.button.point_red_ico_close {background: -80px -128px;}\r\n.ztree li span.button.point_red_ico_docu {background: -80px -128px;}\r\n.ztree li span.button.point_yellow_ico_open {background: -96px -128px;}\r\n.ztree li span.button.point_yellow_ico_close {background: -96px -128px;}\r\n.ztree li span.button.point_yellow_ico_docu {background: -96px -128px;}\r\n.ztree li span.button.pointer_ico_open {background: -112px -128px;}\r\n.ztree li span.button.pointer_ico_close {background: -112px -128px;}\r\n.ztree li span.button.pointer_ico_docu {background: -112px -128px;}\r\n.ztree li span.button.print_ico_open {background: -128px -128px;}\r\n.ztree li span.button.print_ico_close {background: -128px -128px;}\r\n.ztree li span.button.print_ico_docu {background: -128px -128px;}\r\n.ztree li span.button.question_ico_open {background: -144px 0;}\r\n.ztree li span.button.question_ico_close {background: -144px 0;}\r\n.ztree li span.button.question_ico_docu {background: -144px 0;}\r\n.ztree li span.button.recyclebin_ico_open {background: -144px -16px;}\r\n.ztree li span.button.recyclebin_ico_close {background: -144px -16px;}\r\n.ztree li span.button.recyclebin_ico_docu {background: -144px -16px;}\r\n.ztree li span.button.refresh_ico_open {background: -144px -32px;}\r\n.ztree li span.button.refresh_ico_close {background: -144px -32px;}\r\n.ztree li span.button.refresh_ico_docu {background: -144px -32px;}\r\n.ztree li span.button.router_ico_open {background: -144px -48px;}\r\n.ztree li span.button.router_ico_close {background: -144px -48px;}\r\n.ztree li span.button.router_ico_docu {background: -144px -48px;}\r\n.ztree li span.button.safebox_ico_open {background: -144px -64px;}\r\n.ztree li span.button.safebox_ico_close {background: -144px -64px;}\r\n.ztree li span.button.safebox_ico_docu {background: -144px -64px;}\r\n.ztree li span.button.schedule_ico_open {background: -144px -80px;}\r\n.ztree li span.button.schedule_ico_close {background: -144px -80px;}\r\n.ztree li span.button.schedule_ico_docu {background: -144px -80px;}\r\n.ztree li span.button.sound_ico_open {background: -144px -96px;}\r\n.ztree li span.button.sound_ico_close {background: -144px -96px;}\r\n.ztree li span.button.sound_ico_docu {background: -144px -96px;}\r\n.ztree li span.button.statistics_ico_open {background: -144px -112px;}\r\n.ztree li span.button.statistics_ico_close {background: -144px -112px;}\r\n.ztree li span.button.statistics_ico_docu {background: -144px -112px;}\r\n.ztree li span.button.table_ico_open {background: -144px -128px;}\r\n.ztree li span.button.table_ico_close {background: -144px -128px;}\r\n.ztree li span.button.table_ico_docu {background: -144px -128px;}\r\n.ztree li span.button.task_ico_open {background: 0 -144px;}\r\n.ztree li span.button.task_ico_close {background: 0 -144px;}\r\n.ztree li span.button.task_ico_docu {background: 0 -144px;}\r\n.ztree li span.button.term_ico_open {background: -16px -144px;}\r\n.ztree li span.button.term_ico_close {background: -16px -144px;}\r\n.ztree li span.button.term_ico_docu {background: -16px -144px;}\r\n.ztree li span.button.tools_ico_open {background: -32px -144px;}\r\n.ztree li span.button.tools_ico_close {background: -32px -144px;}\r\n.ztree li span.button.tools_ico_docu {background: -32px -144px;}\r\n.ztree li span.button.tower_ico_open {background: -48px -144px;}\r\n.ztree li span.button.tower_ico_close {background: -48px -144px;}\r\n.ztree li span.button.tower_ico_docu {background: -48px -144px;}\r\n.ztree li span.button.video_ico_open {background: -64px -144px;}\r\n.ztree li span.button.video_ico_close {background: -64px -144px;}\r\n.ztree li span.button.video_ico_docu {background: -64px -144px;}\r\n.ztree li span.button.voip_ico_open {background: -80px -144px;}\r\n.ztree li span.button.voip_ico_close {background: -80px -144px;}\r\n.ztree li span.button.voip_ico_docu {background: -80px -144px;}\r\n.ztree li span.button.web_ico_open {background: -96px -144px;}\r\n.ztree li span.button.web_ico_close {background: -96px -144px;}\r\n.ztree li span.button.web_ico_docu {background: -96px -144px;}\r\n.ztree li span.button.webfind_ico_open {background: -112px -144px;}\r\n.ztree li span.button.webfind_ico_close {background: -112px -144px;}\r\n.ztree li span.button.webfind_ico_docu {background: -112px -144px;}\r\n.ztree li span.button.webpages_ico_open {background: -128px -144px;}\r\n.ztree li span.button.webpages_ico_close {background: -128px -144px;}\r\n.ztree li span.button.webpages_ico_docu {background: -128px -144px;}\r\n.ztree li span.button.week_ico_open {background: -144px -144px;}\r\n.ztree li span.button.week_ico_close {background: -144px -144px;}\r\n.ztree li span.button.week_ico_docu {background: -144px -144px;}\r\n.ztree li span.button.wizard_ico_open {background: -160px 0;}\r\n.ztree li span.button.wizard_ico_close {background: -160px 0;}\r\n.ztree li span.button.wizard_ico_docu {background: -160px 0;}\r\n.ztree li span.button.hyt16_ico_open,.ztree li span.button.hyt16_ico_close,.ztree li span.button.hyt16_ico_docu,.ztree li span.button.mail_fold_ico_open,.ztree li span.button.mail_fold_ico_close,.ztree li span.button.mail_fold_ico_docu,.ztree li span.button.mail_unfold_ico_open,.ztree li span.button.mail_unfold_ico_close,.ztree li span.button.mail_unfold_ico_docu,.ztree li span.button.meeyi16.gray_ico_open,.ztree li span.button.meeyi16.gray_ico_close,.ztree li span.button.meeyi16.gray_ico_docu,.ztree li span.button.meeyi16.red_ico_open,.ztree li span.button.meeyi16.red_ico_close,.ztree li span.button.meeyi16.red_ico_docu{background-image: url(" + __webpack_require__("./src/assets/css/sprite/images/sprite_common.png") + ");}\r\n.ztree li span.button.lb_ico_open,.ztree li span.button.lb_ico_close,.ztree li span.button.lb_ico_docu,.ztree li span.button.aircle_ico_open,.ztree li span.button.aircle_ico_close,.ztree li span.button.aircle_ico_docu,.ztree li span.button.alarm2_ico_open,.ztree li span.button.alarm2_ico_close,.ztree li span.button.alarm2_ico_docu,.ztree li span.button.alarmbox_ico_open,.ztree li span.button.alarmbox_ico_close,.ztree li span.button.alarmbox_ico_docu,.ztree li span.button.all_ico_open,.ztree li span.button.all_ico_close,.ztree li span.button.all_ico_docu,.ztree li span.button.attrib_ico_open,.ztree li span.button.attrib_ico_close,.ztree li span.button.attrib_ico_docu,.ztree li span.button.attrib2_ico_open,.ztree li span.button.attrib2_ico_close,.ztree li span.button.attrib2_ico_docu,.ztree li span.button.authusers_ico_open,.ztree li span.button.authusers_ico_close,.ztree li span.button.authusers_ico_docu,.ztree li span.button.blank_ico_open,.ztree li span.button.blank_ico_close,.ztree li span.button.blank_ico_docu,.ztree li span.button.books_ico_open,.ztree li span.button.books_ico_close,.ztree li span.button.books_ico_docu,.ztree li span.button.caller_ico_open,.ztree li span.button.caller_ico_close,.ztree li span.button.caller_ico_docu,.ztree li span.button.callman_ico_open,.ztree li span.button.callman_ico_close,.ztree li span.button.callman_ico_docu,.ztree li span.button.camera_ico_open,.ztree li span.button.camera_ico_close,.ztree li span.button.camera_ico_docu,.ztree li span.button.camera1_ico_open,.ztree li span.button.camera1_ico_close,.ztree li span.button.camera1_ico_docu,.ztree li span.button.camera3_ico_open,.ztree li span.button.camera3_ico_close,.ztree li span.button.camera3_ico_docu,.ztree li span.button.camera4_ico_open,.ztree li span.button.camera4_ico_close,.ztree li span.button.camera4_ico_docu,.ztree li span.button.charge_ico_open,.ztree li span.button.charge_ico_close,.ztree li span.button.charge_ico_docu,.ztree li span.button.chat_ico_open,.ztree li span.button.chat_ico_close,.ztree li span.button.chat_ico_docu,.ztree li span.button.company_ico_open,.ztree li span.button.company_ico_close,.ztree li span.button.company_ico_docu,.ztree li span.button.computer_ico_open,.ztree li span.button.computer_ico_close,.ztree li span.button.computer_ico_docu,.ztree li span.button.computer1_ico_open,.ztree li span.button.computer1_ico_close,.ztree li span.button.computer1_ico_docu,.ztree li span.button.computer2_ico_open,.ztree li span.button.computer2_ico_close,.ztree li span.button.computer2_ico_docu,.ztree li span.button.computer3_ico_open,.ztree li span.button.computer3_ico_close,.ztree li span.button.computer3_ico_docu,.ztree li span.button.contact_ico_open,.ztree li span.button.contact_ico_close,.ztree li span.button.contact_ico_docu,.ztree li span.button.contact2_ico_open,.ztree li span.button.contact2_ico_close,.ztree li span.button.contact2_ico_docu,.ztree li span.button.dbs_ico_open,.ztree li span.button.dbs_ico_close,.ztree li span.button.dbs_ico_docu,.ztree li span.button.dept_ico_open,.ztree li span.button.dept_ico_close,.ztree li span.button.dept_ico_docu,.ztree li span.button.device_ico_open,.ztree li span.button.device_ico_close,.ztree li span.button.device_ico_docu,.ztree li span.button.devicegroup_ico_open,.ztree li span.button.devicegroup_ico_close,.ztree li span.button.devicegroup_ico_docu,.ztree li span.button.devicetype_ico_open,.ztree li span.button.devicetype_ico_close,.ztree li span.button.devicetype_ico_docu,.ztree li span.button.devicetypes_ico_open,.ztree li span.button.devicetypes_ico_close,.ztree li span.button.devicetypes_ico_docu,.ztree li span.button.dl_ico_open,.ztree li span.button.dl_ico_close,.ztree li span.button.dl_ico_docu,.ztree li span.button.factory_ico_open,.ztree li span.button.factory_ico_close,.ztree li span.button.factory_ico_docu,.ztree li span.button.favorite_ico_open,.ztree li span.button.favorite_ico_close,.ztree li span.button.favorite_ico_docu,.ztree li span.button.find_ico_open,.ztree li span.button.find_ico_close,.ztree li span.button.find_ico_docu,.ztree li span.button.flags_ico_open,.ztree li span.button.flags_ico_close,.ztree li span.button.flags_ico_docu,.ztree li span.button.folderclose_ico_open,.ztree li span.button.folderclose_ico_close,.ztree li span.button.folderclose_ico_docu,.ztree li span.button.folderfind_ico_open,.ztree li span.button.folderfind_ico_close,.ztree li span.button.folderfind_ico_docu,.ztree li span.button.folderopen_ico_open,.ztree li span.button.folderopen_ico_close,.ztree li span.button.folderopen_ico_docu,.ztree li span.button.graph_ico_open,.ztree li span.button.graph_ico_close,.ztree li span.button.graph_ico_docu,.ztree li span.button.graph2_ico_open,.ztree li span.button.graph2_ico_close,.ztree li span.button.graph2_ico_docu,.ztree li span.button.graph3_ico_open,.ztree li span.button.graph3_ico_close,.ztree li span.button.graph3_ico_docu,.ztree li span.button.graph4_ico_open,.ztree li span.button.graph4_ico_close,.ztree li span.button.graph4_ico_docu,.ztree li span.button.graph5_ico_open,.ztree li span.button.graph5_ico_close,.ztree li span.button.graph5_ico_docu,.ztree li span.button.home_ico_open,.ztree li span.button.home_ico_close,.ztree li span.button.home_ico_docu,.ztree li span.button.image_ico_open,.ztree li span.button.image_ico_close,.ztree li span.button.image_ico_docu,.ztree li span.button.images_ico_open,.ztree li span.button.images_ico_close,.ztree li span.button.images_ico_docu,.ztree li span.button.inj_ico_open,.ztree li span.button.inj_ico_close,.ztree li span.button.inj_ico_docu,.ztree li span.button.internet_ico_open,.ztree li span.button.internet_ico_close,.ztree li span.button.internet_ico_docu,.ztree li span.button.lamp_ico_open,.ztree li span.button.lamp_ico_close,.ztree li span.button.lamp_ico_docu,.ztree li span.button.alarm_ico_open,.ztree li span.button.alarm_ico_close,.ztree li span.button.alarm_ico_docu,.ztree li span.button.link_ico_open,.ztree li span.button.link_ico_close,.ztree li span.button.link_ico_docu,.ztree li span.button.loc_ico_open,.ztree li span.button.loc_ico_close,.ztree li span.button.loc_ico_docu,.ztree li span.button.loc2_ico_open,.ztree li span.button.loc2_ico_close,.ztree li span.button.loc2_ico_docu,.ztree li span.button.lock_ico_open,.ztree li span.button.lock_ico_close,.ztree li span.button.lock_ico_docu,.ztree li span.button.major_ico_open,.ztree li span.button.major_ico_close,.ztree li span.button.major_ico_docu,.ztree li span.button.mans_ico_open,.ztree li span.button.mans_ico_close,.ztree li span.button.mans_ico_docu,.ztree li span.button.meeting_ico_open,.ztree li span.button.meeting_ico_close,.ztree li span.button.meeting_ico_docu,.ztree li span.button.mic_ico_open,.ztree li span.button.mic_ico_close,.ztree li span.button.mic_ico_docu,.ztree li span.button.mphone_ico_open,.ztree li span.button.mphone_ico_close,.ztree li span.button.mphone_ico_docu,.ztree li span.button.net_ico_open,.ztree li span.button.net_ico_close,.ztree li span.button.net_ico_docu,.ztree li span.button.net2_ico_open,.ztree li span.button.net2_ico_close,.ztree li span.button.net2_ico_docu,.ztree li span.button.net3_ico_open,.ztree li span.button.net3_ico_close,.ztree li span.button.net3_ico_docu,.ztree li span.button.netunit_ico_open,.ztree li span.button.netunit_ico_close,.ztree li span.button.netunit_ico_docu,.ztree li span.button.netunit2_ico_open,.ztree li span.button.netunit2_ico_close,.ztree li span.button.netunit2_ico_docu,.ztree li span.button.netuser_ico_open,.ztree li span.button.netuser_ico_close,.ztree li span.button.netuser_ico_docu,.ztree li span.button.note_ico_open,.ztree li span.button.note_ico_close,.ztree li span.button.note_ico_docu,.ztree li span.button.note2_ico_open,.ztree li span.button.note2_ico_close,.ztree li span.button.note2_ico_docu,.ztree li span.button.notify_ico_open,.ztree li span.button.notify_ico_close,.ztree li span.button.notify_ico_docu,.ztree li span.button.notifypage_ico_open,.ztree li span.button.notifypage_ico_close,.ztree li span.button.notifypage_ico_docu,.ztree li span.button.org_ico_open,.ztree li span.button.org_ico_close,.ztree li span.button.org_ico_docu,.ztree li span.button.org2_ico_open,.ztree li span.button.org2_ico_close,.ztree li span.button.org2_ico_docu,.ztree li span.button.org22_ico_open,.ztree li span.button.org22_ico_close,.ztree li span.button.org22_ico_docu,.ztree li span.button.org3_ico_open,.ztree li span.button.org3_ico_close,.ztree li span.button.org3_ico_docu,.ztree li span.button.outj_ico_open,.ztree li span.button.outj_ico_close,.ztree li span.button.outj_ico_docu,.ztree li span.button.phone_ico_open,.ztree li span.button.phone_ico_close,.ztree li span.button.phone_ico_docu,.ztree li span.button.point_green_ico_open,.ztree li span.button.point_green_ico_close,.ztree li span.button.point_green_ico_docu,.ztree li span.button.point_red_ico_open,.ztree li span.button.point_red_ico_close,.ztree li span.button.point_red_ico_docu,.ztree li span.button.point_yellow_ico_open,.ztree li span.button.point_yellow_ico_close,.ztree li span.button.point_yellow_ico_docu,.ztree li span.button.pointer_ico_open,.ztree li span.button.pointer_ico_close,.ztree li span.button.pointer_ico_docu,.ztree li span.button.print_ico_open,.ztree li span.button.print_ico_close,.ztree li span.button.print_ico_docu,.ztree li span.button.question_ico_open,.ztree li span.button.question_ico_close,.ztree li span.button.question_ico_docu,.ztree li span.button.recyclebin_ico_open,.ztree li span.button.recyclebin_ico_close,.ztree li span.button.recyclebin_ico_docu,.ztree li span.button.refresh_ico_open,.ztree li span.button.refresh_ico_close,.ztree li span.button.refresh_ico_docu,.ztree li span.button.router_ico_open,.ztree li span.button.router_ico_close,.ztree li span.button.router_ico_docu,.ztree li span.button.safebox_ico_open,.ztree li span.button.safebox_ico_close,.ztree li span.button.safebox_ico_docu,.ztree li span.button.schedule_ico_open,.ztree li span.button.schedule_ico_close,.ztree li span.button.schedule_ico_docu,.ztree li span.button.sound_ico_open,.ztree li span.button.sound_ico_close,.ztree li span.button.sound_ico_docu,.ztree li span.button.statistics_ico_open,.ztree li span.button.statistics_ico_close,.ztree li span.button.statistics_ico_docu,.ztree li span.button.table_ico_open,.ztree li span.button.table_ico_close,.ztree li span.button.table_ico_docu,.ztree li span.button.task_ico_open,.ztree li span.button.task_ico_close,.ztree li span.button.task_ico_docu,.ztree li span.button.term_ico_open,.ztree li span.button.term_ico_close,.ztree li span.button.term_ico_docu,.ztree li span.button.tools_ico_open,.ztree li span.button.tools_ico_close,.ztree li span.button.tools_ico_docu,.ztree li span.button.tower_ico_open,.ztree li span.button.tower_ico_close,.ztree li span.button.tower_ico_docu,.ztree li span.button.video_ico_open,.ztree li span.button.video_ico_close,.ztree li span.button.video_ico_docu,.ztree li span.button.voip_ico_open,.ztree li span.button.voip_ico_close,.ztree li span.button.voip_ico_docu,.ztree li span.button.web_ico_open,.ztree li span.button.web_ico_close,.ztree li span.button.web_ico_docu,.ztree li span.button.webfind_ico_open,.ztree li span.button.webfind_ico_close,.ztree li span.button.webfind_ico_docu,.ztree li span.button.webpages_ico_open,.ztree li span.button.webpages_ico_close,.ztree li span.button.webpages_ico_docu,.ztree li span.button.week_ico_open,.ztree li span.button.week_ico_close,.ztree li span.button.week_ico_docu,.ztree li span.button.wizard_ico_open,.ztree li span.button.wizard_ico_close,.ztree li span.button.wizard_ico_docu{background-image: url(" + __webpack_require__("./src/assets/css/sprite/images/sprite_restree.png") + ");}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/is-buffer/index.js":
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),

/***/ "./node_modules/loadjs/dist/loadjs.umd.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference common_library"))(11);

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-6e2a585c\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/components/grid.layout.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "grid-layout"
  }, [_c('table', {
    style: ({
      border: _vm.border ? '1px solid rgba(34,36,38,.15);' : ''
    })
  }, [_c('tbody', _vm._l((_vm.rows), function(row, rowIndex) {
    return _c('tr', {
      style: ({
        height: (100 / this.rows) + '%'
      }),
      attrs: {
        "id": 'R' + (rowIndex + 1)
      }
    }, _vm._l((_vm.cols), function(col, colIndex) {
      return (!(rowIndex + 1 >= _vm.spanBeginRow && rowIndex + 1 <= _vm.spanEndRow &&
        colIndex + 1 >= _vm.spanBeginCol && colIndex + 1 <= _vm.spanEndCol) || (rowIndex + 1 == _vm.spanBeginRow && colIndex + 1 == _vm.spanBeginCol)) ? _c('td', {
        staticClass: "cell",
        style: (rowIndex + 1 == _vm.spanBeginRow && colIndex + 1 == _vm.spanBeginCol ? {
          width: (100 / this.cols) * (_vm.spanEndCol - _vm.spanBeginCol + 1) + '%'
        } : {
          width: (100 / this.cols) + '%'
        }),
        attrs: {
          "colspan": rowIndex + 1 == _vm.spanBeginRow && colIndex + 1 == _vm.spanBeginCol ? _vm.spanEndCol - _vm.spanBeginCol + 1 : '',
          "rowspan": rowIndex + 1 == _vm.spanBeginRow && colIndex + 1 == _vm.spanBeginCol ? _vm.spanEndRow - _vm.spanBeginRow + 1 : '',
          "id": _vm.layoutId + '_R' + (rowIndex + 1) + 'C' + (colIndex + 1)
        },
        on: {
          "mouseenter": function($event) {
            _vm.onEnterCell(row, col, $event)
          },
          "mouseleave": function($event) {
            _vm.onLeaveCell(row, col, $event)
          }
        }
      }, [_vm._v("\n             \n            "), _c('div', {
        staticClass: "cellctrl placeholder"
      }, [_vm._v(_vm._s(_vm.placeholder))]), _vm._v(" "), _c('div', {
        staticClass: "cellctrl ctrlmenu ui icon mini buttons",
        on: {
          "mouseenter": function($event) {
            _vm.onCellControlbarEnter($event)
          },
          "mouseleave": function($event) {
            _vm.onControlbarLeave($event)
          }
        }
      }, [_vm._l((_vm.buttons), function(btn) {
        return (_vm.expandCtrlMenu) ? _c('button', {
          attrs: {
            "title": "btn.text"
          },
          on: {
            "click": function($event) {
              btn.click(btn)
            }
          }
        }, [_c('i', {
          class: ['ui', btn.icon, 'icon']
        })]) : _vm._e()
      }), _vm._v(" "), _vm._v("\"最大化/恢复\")>"), _c('i', {
        staticClass: "square outline icon"
      }), _vm._v(" "), _vm._v("\"移动\")>\n                  "), _c('i', {
        staticClass: "move icon"
      }), _vm._v(" "), _vm._v("\"移除\")>"), _c('i', {
        staticClass: "remove icon"
      })], 2), _vm._v(" "), _vm._t('R' + (rowIndex + 1) + 'C' + (colIndex + 1))], 2) : _vm._e()
    }))
  }))])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-6e2a585c", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-7416abd6\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/common/device.tree.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "devicestree"
  }, [_c('ul', {
    staticClass: "ztree",
    attrs: {
      "id": _vm.id
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "menu",
    attrs: {
      "id": 'tree_menu_' + _vm.id
    }
  }, [_c('menubar', {
    attrs: {
      "items": _vm.rightItems,
      "moudle": "true",
      "vertical": true
    }
  })], 1)])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-7416abd6", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-7a48d305\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/components/video.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "videoContainer",
    on: {
      "click": _vm.test
    }
  }, [_c('video', {
    staticClass: "video-js vjs-default-skin",
    attrs: {
      "id": _vm.id
    }
  })])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-7a48d305", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-fbed9b74\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/commander.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "commander"
  }, [_c('div', {
    staticClass: "right-panel"
  }, [_c('grid', {
    attrs: {
      "row": 2,
      "col": 2,
      "placeholder": ""
    }
  }, _vm._l((_vm.displays), function(display, index) {
    return _c('div', {
      attrs: {
        "slot": _vm.RrCc(index)
      },
      slot: _vm.RrCc(index)
    }, [(display) ? _c('player', {
      attrs: {
        "videoType": "rtmp",
        "videoSrc": display.src,
        "dependencies": _vm.displayDependencies,
        "playerOpts": _vm.displayOptions,
        "cameraObj": display.camera
      }
    }) : _vm._e()], 1)
  }))], 1)])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-fbed9b74", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6e2a585c\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/grid.layout.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6e2a585c\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/grid.layout.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("db2779cc", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6e2a585c\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../utils/lang-loader.js!./grid.layout.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6e2a585c\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../utils/lang-loader.js!./grid.layout.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7416abd6\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/common/device.tree.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7416abd6\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/common/device.tree.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("1b5a14c6", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7416abd6\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!../../utils/lang-loader.js!./device.tree.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7416abd6\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!../../utils/lang-loader.js!./device.tree.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7416abd6\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/common/device.tree.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7416abd6\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/common/device.tree.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("74a7fede", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7416abd6\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../utils/lang-loader.js!./device.tree.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7416abd6\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../utils/lang-loader.js!./device.tree.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7a48d305\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/video.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7a48d305\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/video.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("5ef9b8df", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7a48d305\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../utils/lang-loader.js!./video.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7a48d305\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../utils/lang-loader.js!./video.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-fbed9b74\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/apps/iptalk/commander.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-fbed9b74\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/apps/iptalk/commander.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("cd4719fe", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-fbed9b74\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!../../../utils/lang-loader.js!./commander.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-fbed9b74\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!../../../utils/lang-loader.js!./commander.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-fbed9b74\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/commander.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-fbed9b74\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/commander.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("af309602", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-fbed9b74\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../utils/lang-loader.js!./commander.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-fbed9b74\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../utils/lang-loader.js!./commander.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/ztree/css/zTreeStyle/img/line_conn.gif":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/line_conn.a2649b.gif";

/***/ }),

/***/ "./node_modules/ztree/css/zTreeStyle/img/loading.gif":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/loading.4f3236.gif";

/***/ }),

/***/ "./node_modules/ztree/css/zTreeStyle/img/zTreeStandard.gif":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/zTreeStandard.158458.gif";

/***/ }),

/***/ "./node_modules/ztree/css/zTreeStyle/img/zTreeStandard.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/zTreeStandard.524f50.png";

/***/ }),

/***/ "./node_modules/ztree/css/zTreeStyle/zTreeStyle.css":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/ztree/css/zTreeStyle/zTreeStyle.css");
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__("./node_modules/style-loader/lib/addStyles.js")(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../css-loader/index.js!./zTreeStyle.css", function() {
			var newContent = require("!!../../../css-loader/index.js!./zTreeStyle.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/ztree/js/jquery.ztree.all.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {
/*
 * JQuery zTree core v3.5.23
 * http://zTree.me/
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Licensed same as jquery - MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * email: hunter.z@263.net
 * Date: 2016-04-01
 */
(function($){
	var settings = {}, roots = {}, caches = {},
	//default consts of core
	_consts = {
		className: {
			BUTTON: "button",
			LEVEL: "level",
			ICO_LOADING: "ico_loading",
			SWITCH: "switch",
			NAME: 'node_name'
		},
		event: {
			NODECREATED: "ztree_nodeCreated",
			CLICK: "ztree_click",
			EXPAND: "ztree_expand",
			COLLAPSE: "ztree_collapse",
			ASYNC_SUCCESS: "ztree_async_success",
			ASYNC_ERROR: "ztree_async_error",
			REMOVE: "ztree_remove",
			SELECTED: "ztree_selected",
			UNSELECTED: "ztree_unselected"
		},
		id: {
			A: "_a",
			ICON: "_ico",
			SPAN: "_span",
			SWITCH: "_switch",
			UL: "_ul"
		},
		line: {
			ROOT: "root",
			ROOTS: "roots",
			CENTER: "center",
			BOTTOM: "bottom",
			NOLINE: "noline",
			LINE: "line"
		},
		folder: {
			OPEN: "open",
			CLOSE: "close",
			DOCU: "docu"
		},
		node: {
			CURSELECTED: "curSelectedNode"
		}
	},
	//default setting of core
	_setting = {
		treeId: "",
		treeObj: null,
		view: {
			addDiyDom: null,
			autoCancelSelected: true,
			dblClickExpand: true,
			expandSpeed: "fast",
			fontCss: {},
			nameIsHTML: false,
			selectedMulti: true,
			showIcon: true,
			showLine: true,
			showTitle: true,
			txtSelectedEnable: false
		},
		data: {
			key: {
				children: "children",
				name: "name",
				title: "",
				url: "url",
				icon: "icon"
			},
			simpleData: {
				enable: false,
				idKey: "id",
				pIdKey: "pId",
				rootPId: null
			},
			keep: {
				parent: false,
				leaf: false
			}
		},
		async: {
			enable: false,
			contentType: "application/x-www-form-urlencoded",
			type: "post",
			dataType: "text",
			url: "",
			autoParam: [],
			otherParam: [],
			dataFilter: null
		},
		callback: {
			beforeAsync:null,
			beforeClick:null,
			beforeDblClick:null,
			beforeRightClick:null,
			beforeMouseDown:null,
			beforeMouseUp:null,
			beforeExpand:null,
			beforeCollapse:null,
			beforeRemove:null,

			onAsyncError:null,
			onAsyncSuccess:null,
			onNodeCreated:null,
			onClick:null,
			onDblClick:null,
			onRightClick:null,
			onMouseDown:null,
			onMouseUp:null,
			onExpand:null,
			onCollapse:null,
			onRemove:null
		}
	},
	//default root of core
	//zTree use root to save full data
	_initRoot = function (setting) {
		var r = data.getRoot(setting);
		if (!r) {
			r = {};
			data.setRoot(setting, r);
		}
		r[setting.data.key.children] = [];
		r.expandTriggerFlag = false;
		r.curSelectedList = [];
		r.noSelection = true;
		r.createdNodes = [];
		r.zId = 0;
		r._ver = (new Date()).getTime();
	},
	//default cache of core
	_initCache = function(setting) {
		var c = data.getCache(setting);
		if (!c) {
			c = {};
			data.setCache(setting, c);
		}
		c.nodes = [];
		c.doms = [];
	},
	//default bindEvent of core
	_bindEvent = function(setting) {
		var o = setting.treeObj,
		c = consts.event;
		o.bind(c.NODECREATED, function (event, treeId, node) {
			tools.apply(setting.callback.onNodeCreated, [event, treeId, node]);
		});

		o.bind(c.CLICK, function (event, srcEvent, treeId, node, clickFlag) {
			tools.apply(setting.callback.onClick, [srcEvent, treeId, node, clickFlag]);
		});

		o.bind(c.EXPAND, function (event, treeId, node) {
			tools.apply(setting.callback.onExpand, [event, treeId, node]);
		});

		o.bind(c.COLLAPSE, function (event, treeId, node) {
			tools.apply(setting.callback.onCollapse, [event, treeId, node]);
		});

		o.bind(c.ASYNC_SUCCESS, function (event, treeId, node, msg) {
			tools.apply(setting.callback.onAsyncSuccess, [event, treeId, node, msg]);
		});

		o.bind(c.ASYNC_ERROR, function (event, treeId, node, XMLHttpRequest, textStatus, errorThrown) {
			tools.apply(setting.callback.onAsyncError, [event, treeId, node, XMLHttpRequest, textStatus, errorThrown]);
		});

		o.bind(c.REMOVE, function (event, treeId, treeNode) {
			tools.apply(setting.callback.onRemove, [event, treeId, treeNode]);
		});

		o.bind(c.SELECTED, function (event, treeId, node) {
			tools.apply(setting.callback.onSelected, [treeId, node]);
		});
		o.bind(c.UNSELECTED, function (event, treeId, node) {
			tools.apply(setting.callback.onUnSelected, [treeId, node]);
		});
	},
	_unbindEvent = function(setting) {
		var o = setting.treeObj,
		c = consts.event;
		o.unbind(c.NODECREATED)
		.unbind(c.CLICK)
		.unbind(c.EXPAND)
		.unbind(c.COLLAPSE)
		.unbind(c.ASYNC_SUCCESS)
		.unbind(c.ASYNC_ERROR)
		.unbind(c.REMOVE)
		.unbind(c.SELECTED)
		.unbind(c.UNSELECTED);
	},
	//default event proxy of core
	_eventProxy = function(event) {
		var target = event.target,
		setting = data.getSetting(event.data.treeId),
		tId = "", node = null,
		nodeEventType = "", treeEventType = "",
		nodeEventCallback = null, treeEventCallback = null,
		tmp = null;

		if (tools.eqs(event.type, "mousedown")) {
			treeEventType = "mousedown";
		} else if (tools.eqs(event.type, "mouseup")) {
			treeEventType = "mouseup";
		} else if (tools.eqs(event.type, "contextmenu")) {
			treeEventType = "contextmenu";
		} else if (tools.eqs(event.type, "click")) {
			if (tools.eqs(target.tagName, "span") && target.getAttribute("treeNode"+ consts.id.SWITCH) !== null) {
				tId = tools.getNodeMainDom(target).id;
				nodeEventType = "switchNode";
			} else {
				tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
				if (tmp) {
					tId = tools.getNodeMainDom(tmp).id;
					nodeEventType = "clickNode";
				}
			}
		} else if (tools.eqs(event.type, "dblclick")) {
			treeEventType = "dblclick";
			tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
			if (tmp) {
				tId = tools.getNodeMainDom(tmp).id;
				nodeEventType = "switchNode";
			}
		}
		if (treeEventType.length > 0 && tId.length == 0) {
			tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
			if (tmp) {tId = tools.getNodeMainDom(tmp).id;}
		}
		// event to node
		if (tId.length>0) {
			node = data.getNodeCache(setting, tId);
			switch (nodeEventType) {
				case "switchNode" :
					if (!node.isParent) {
						nodeEventType = "";
					} else if (tools.eqs(event.type, "click")
						|| (tools.eqs(event.type, "dblclick") && tools.apply(setting.view.dblClickExpand, [setting.treeId, node], setting.view.dblClickExpand))) {
						nodeEventCallback = handler.onSwitchNode;
					} else {
						nodeEventType = "";
					}
					break;
				case "clickNode" :
					nodeEventCallback = handler.onClickNode;
					break;
			}
		}
		// event to zTree
		switch (treeEventType) {
			case "mousedown" :
				treeEventCallback = handler.onZTreeMousedown;
				break;
			case "mouseup" :
				treeEventCallback = handler.onZTreeMouseup;
				break;
			case "dblclick" :
				treeEventCallback = handler.onZTreeDblclick;
				break;
			case "contextmenu" :
				treeEventCallback = handler.onZTreeContextmenu;
				break;
		}
		var proxyResult = {
			stop: false,
			node: node,
			nodeEventType: nodeEventType,
			nodeEventCallback: nodeEventCallback,
			treeEventType: treeEventType,
			treeEventCallback: treeEventCallback
		};
		return proxyResult
	},
	//default init node of core
	_initNode = function(setting, level, n, parentNode, isFirstNode, isLastNode, openFlag) {
		if (!n) return;
		var r = data.getRoot(setting),
		childKey = setting.data.key.children;
		n.level = level;
		n.tId = setting.treeId + "_" + (++r.zId);
		n.parentTId = parentNode ? parentNode.tId : null;
		n.open = (typeof n.open == "string") ? tools.eqs(n.open, "true") : !!n.open;
		if (n[childKey] && n[childKey].length > 0) {
			n.isParent = true;
			n.zAsync = true;
		} else {
			n.isParent = (typeof n.isParent == "string") ? tools.eqs(n.isParent, "true") : !!n.isParent;
			n.open = (n.isParent && !setting.async.enable) ? n.open : false;
			n.zAsync = !n.isParent;
		}
		n.isFirstNode = isFirstNode;
		n.isLastNode = isLastNode;
		n.getParentNode = function() {return data.getNodeCache(setting, n.parentTId);};
		n.getPreNode = function() {return data.getPreNode(setting, n);};
		n.getNextNode = function() {return data.getNextNode(setting, n);};
		n.getIndex = function() {return data.getNodeIndex(setting, n);};
		n.getPath = function() {return data.getNodePath(setting, n);};
		n.isAjaxing = false;
		data.fixPIdKeyValue(setting, n);
	},
	_init = {
		bind: [_bindEvent],
		unbind: [_unbindEvent],
		caches: [_initCache],
		nodes: [_initNode],
		proxys: [_eventProxy],
		roots: [_initRoot],
		beforeA: [],
		afterA: [],
		innerBeforeA: [],
		innerAfterA: [],
		zTreeTools: []
	},
	//method of operate data
	data = {
		addNodeCache: function(setting, node) {
			data.getCache(setting).nodes[data.getNodeCacheId(node.tId)] = node;
		},
		getNodeCacheId: function(tId) {
			return tId.substring(tId.lastIndexOf("_")+1);
		},
		addAfterA: function(afterA) {
			_init.afterA.push(afterA);
		},
		addBeforeA: function(beforeA) {
			_init.beforeA.push(beforeA);
		},
		addInnerAfterA: function(innerAfterA) {
			_init.innerAfterA.push(innerAfterA);
		},
		addInnerBeforeA: function(innerBeforeA) {
			_init.innerBeforeA.push(innerBeforeA);
		},
		addInitBind: function(bindEvent) {
			_init.bind.push(bindEvent);
		},
		addInitUnBind: function(unbindEvent) {
			_init.unbind.push(unbindEvent);
		},
		addInitCache: function(initCache) {
			_init.caches.push(initCache);
		},
		addInitNode: function(initNode) {
			_init.nodes.push(initNode);
		},
		addInitProxy: function(initProxy, isFirst) {
			if (!!isFirst) {
				_init.proxys.splice(0,0,initProxy);
			} else {
				_init.proxys.push(initProxy);
			}
		},
		addInitRoot: function(initRoot) {
			_init.roots.push(initRoot);
		},
		addNodesData: function(setting, parentNode, index, nodes) {
			var childKey = setting.data.key.children, params;
			if (!parentNode[childKey]) {
				parentNode[childKey] = [];
				index = -1;
			} else if (index >= parentNode[childKey].length) {
				index = -1;
			}

			if (parentNode[childKey].length > 0 && index === 0) {
				parentNode[childKey][0].isFirstNode = false;
				view.setNodeLineIcos(setting, parentNode[childKey][0]);
			} else if (parentNode[childKey].length > 0 && index < 0) {
				parentNode[childKey][parentNode[childKey].length - 1].isLastNode = false;
				view.setNodeLineIcos(setting, parentNode[childKey][parentNode[childKey].length - 1]);
			}
			parentNode.isParent = true;

			if (index<0) {
				parentNode[childKey] = parentNode[childKey].concat(nodes);
			} else {
				params = [index, 0].concat(nodes);
				parentNode[childKey].splice.apply(parentNode[childKey], params);
			}
		},
		addSelectedNode: function(setting, node) {
			var root = data.getRoot(setting);
			if (!data.isSelectedNode(setting, node)) {
				root.curSelectedList.push(node);
			}
		},
		addCreatedNode: function(setting, node) {
			if (!!setting.callback.onNodeCreated || !!setting.view.addDiyDom) {
				var root = data.getRoot(setting);
				root.createdNodes.push(node);
			}
		},
		addZTreeTools: function(zTreeTools) {
			_init.zTreeTools.push(zTreeTools);
		},
		exSetting: function(s) {
			$.extend(true, _setting, s);
		},
		fixPIdKeyValue: function(setting, node) {
			if (setting.data.simpleData.enable) {
				node[setting.data.simpleData.pIdKey] = node.parentTId ? node.getParentNode()[setting.data.simpleData.idKey] : setting.data.simpleData.rootPId;
			}
		},
		getAfterA: function(setting, node, array) {
			for (var i=0, j=_init.afterA.length; i<j; i++) {
				_init.afterA[i].apply(this, arguments);
			}
		},
		getBeforeA: function(setting, node, array) {
			for (var i=0, j=_init.beforeA.length; i<j; i++) {
				_init.beforeA[i].apply(this, arguments);
			}
		},
		getInnerAfterA: function(setting, node, array) {
			for (var i=0, j=_init.innerAfterA.length; i<j; i++) {
				_init.innerAfterA[i].apply(this, arguments);
			}
		},
		getInnerBeforeA: function(setting, node, array) {
			for (var i=0, j=_init.innerBeforeA.length; i<j; i++) {
				_init.innerBeforeA[i].apply(this, arguments);
			}
		},
		getCache: function(setting) {
			return caches[setting.treeId];
		},
		getNodeIndex: function(setting, node) {
			if (!node) return null;
			var childKey = setting.data.key.children,
			p = node.parentTId ? node.getParentNode() : data.getRoot(setting);
			for (var i=0, l=p[childKey].length-1; i<=l; i++) {
				if (p[childKey][i] === node) {
					return i;
				}
			}
			return -1;
		},
		getNextNode: function(setting, node) {
			if (!node) return null;
			var childKey = setting.data.key.children,
			p = node.parentTId ? node.getParentNode() : data.getRoot(setting);
			for (var i=0, l=p[childKey].length-1; i<=l; i++) {
				if (p[childKey][i] === node) {
					return (i==l ? null : p[childKey][i+1]);
				}
			}
			return null;
		},
		getNodeByParam: function(setting, nodes, key, value) {
			if (!nodes || !key) return null;
			var childKey = setting.data.key.children;
			for (var i = 0, l = nodes.length; i < l; i++) {
				if (nodes[i][key] == value) {
					return nodes[i];
				}
				var tmp = data.getNodeByParam(setting, nodes[i][childKey], key, value);
				if (tmp) return tmp;
			}
			return null;
		},
		getNodeCache: function(setting, tId) {
			if (!tId) return null;
			var n = caches[setting.treeId].nodes[data.getNodeCacheId(tId)];
			return n ? n : null;
		},
		getNodeName: function(setting, node) {
			var nameKey = setting.data.key.name;
			return "" + node[nameKey];
		},
		getNodePath: function(setting, node) {
			if (!node) return null;

			var path;
			if(node.parentTId) {
				path = node.getParentNode().getPath();
			} else {
				path = [];
			}

			if (path) {
				path.push(node);
			}

			return path;
		},
		getNodeTitle: function(setting, node) {
			var t = setting.data.key.title === "" ? setting.data.key.name : setting.data.key.title;
			return "" + node[t];
		},
		getNodes: function(setting) {
			return data.getRoot(setting)[setting.data.key.children];
		},
		getNodesByParam: function(setting, nodes, key, value) {
			if (!nodes || !key) return [];
			var childKey = setting.data.key.children,
			result = [];
			for (var i = 0, l = nodes.length; i < l; i++) {
				if (nodes[i][key] == value) {
					result.push(nodes[i]);
				}
				result = result.concat(data.getNodesByParam(setting, nodes[i][childKey], key, value));
			}
			return result;
		},
		getNodesByParamFuzzy: function(setting, nodes, key, value) {
			if (!nodes || !key) return [];
			var childKey = setting.data.key.children,
			result = [];
			value = value.toLowerCase();
			for (var i = 0, l = nodes.length; i < l; i++) {
				if (typeof nodes[i][key] == "string" && nodes[i][key].toLowerCase().indexOf(value)>-1) {
					result.push(nodes[i]);
				}
				result = result.concat(data.getNodesByParamFuzzy(setting, nodes[i][childKey], key, value));
			}
			return result;
		},
		getNodesByFilter: function(setting, nodes, filter, isSingle, invokeParam) {
			if (!nodes) return (isSingle ? null : []);
			var childKey = setting.data.key.children,
			result = isSingle ? null : [];
			for (var i = 0, l = nodes.length; i < l; i++) {
				if (tools.apply(filter, [nodes[i], invokeParam], false)) {
					if (isSingle) {return nodes[i];}
					result.push(nodes[i]);
				}
				var tmpResult = data.getNodesByFilter(setting, nodes[i][childKey], filter, isSingle, invokeParam);
				if (isSingle && !!tmpResult) {return tmpResult;}
				result = isSingle ? tmpResult : result.concat(tmpResult);
			}
			return result;
		},
		getPreNode: function(setting, node) {
			if (!node) return null;
			var childKey = setting.data.key.children,
			p = node.parentTId ? node.getParentNode() : data.getRoot(setting);
			for (var i=0, l=p[childKey].length; i<l; i++) {
				if (p[childKey][i] === node) {
					return (i==0 ? null : p[childKey][i-1]);
				}
			}
			return null;
		},
		getRoot: function(setting) {
			return setting ? roots[setting.treeId] : null;
		},
		getRoots: function() {
			return roots;
		},
		getSetting: function(treeId) {
			return settings[treeId];
		},
		getSettings: function() {
			return settings;
		},
		getZTreeTools: function(treeId) {
			var r = this.getRoot(this.getSetting(treeId));
			return r ? r.treeTools : null;
		},
		initCache: function(setting) {
			for (var i=0, j=_init.caches.length; i<j; i++) {
				_init.caches[i].apply(this, arguments);
			}
		},
		initNode: function(setting, level, node, parentNode, preNode, nextNode) {
			for (var i=0, j=_init.nodes.length; i<j; i++) {
				_init.nodes[i].apply(this, arguments);
			}
		},
		initRoot: function(setting) {
			for (var i=0, j=_init.roots.length; i<j; i++) {
				_init.roots[i].apply(this, arguments);
			}
		},
		isSelectedNode: function(setting, node) {
			var root = data.getRoot(setting);
			for (var i=0, j=root.curSelectedList.length; i<j; i++) {
				if(node === root.curSelectedList[i]) return true;
			}
			return false;
		},
		removeNodeCache: function(setting, node) {
			var childKey = setting.data.key.children;
			if (node[childKey]) {
				for (var i=0, l=node[childKey].length; i<l; i++) {
					data.removeNodeCache(setting, node[childKey][i]);
				}
			}
			data.getCache(setting).nodes[data.getNodeCacheId(node.tId)] = null;
		},
		removeSelectedNode: function(setting, node) {
			var root = data.getRoot(setting);
			for (var i=0, j=root.curSelectedList.length; i<j; i++) {
				if(node === root.curSelectedList[i] || !data.getNodeCache(setting, root.curSelectedList[i].tId)) {
					root.curSelectedList.splice(i, 1);
					setting.treeObj.trigger(consts.event.UNSELECTED, [setting.treeId, node]);
					i--;j--;
				}
			}
		},
		setCache: function(setting, cache) {
			caches[setting.treeId] = cache;
		},
		setRoot: function(setting, root) {
			roots[setting.treeId] = root;
		},
		setZTreeTools: function(setting, zTreeTools) {
			for (var i=0, j=_init.zTreeTools.length; i<j; i++) {
				_init.zTreeTools[i].apply(this, arguments);
			}
		},
		transformToArrayFormat: function (setting, nodes) {
			if (!nodes) return [];
			var childKey = setting.data.key.children,
			r = [];
			if (tools.isArray(nodes)) {
				for (var i=0, l=nodes.length; i<l; i++) {
					r.push(nodes[i]);
					if (nodes[i][childKey])
						r = r.concat(data.transformToArrayFormat(setting, nodes[i][childKey]));
				}
			} else {
				r.push(nodes);
				if (nodes[childKey])
					r = r.concat(data.transformToArrayFormat(setting, nodes[childKey]));
			}
			return r;
		},
		transformTozTreeFormat: function(setting, sNodes) {
			var i,l,
			key = setting.data.simpleData.idKey,
			parentKey = setting.data.simpleData.pIdKey,
			childKey = setting.data.key.children;
			if (!key || key=="" || !sNodes) return [];

			if (tools.isArray(sNodes)) {
				var r = [];
				var tmpMap = [];
				for (i=0, l=sNodes.length; i<l; i++) {
					tmpMap[sNodes[i][key]] = sNodes[i];
				}
				for (i=0, l=sNodes.length; i<l; i++) {
					if (tmpMap[sNodes[i][parentKey]] && sNodes[i][key] != sNodes[i][parentKey]) {
						if (!tmpMap[sNodes[i][parentKey]][childKey])
							tmpMap[sNodes[i][parentKey]][childKey] = [];
						tmpMap[sNodes[i][parentKey]][childKey].push(sNodes[i]);
					} else {
						r.push(sNodes[i]);
					}
				}
				return r;
			}else {
				return [sNodes];
			}
		}
	},
	//method of event proxy
	event = {
		bindEvent: function(setting) {
			for (var i=0, j=_init.bind.length; i<j; i++) {
				_init.bind[i].apply(this, arguments);
			}
		},
		unbindEvent: function(setting) {
			for (var i=0, j=_init.unbind.length; i<j; i++) {
				_init.unbind[i].apply(this, arguments);
			}
		},
		bindTree: function(setting) {
			var eventParam = {
				treeId: setting.treeId
			},
			o = setting.treeObj;
			if (!setting.view.txtSelectedEnable) {
				// for can't select text
				o.bind('selectstart', handler.onSelectStart).css({
					"-moz-user-select":"-moz-none"
				});
			}
			o.bind('click', eventParam, event.proxy);
			o.bind('dblclick', eventParam, event.proxy);
			o.bind('mouseover', eventParam, event.proxy);
			o.bind('mouseout', eventParam, event.proxy);
			o.bind('mousedown', eventParam, event.proxy);
			o.bind('mouseup', eventParam, event.proxy);
			o.bind('contextmenu', eventParam, event.proxy);
		},
		unbindTree: function(setting) {
			var o = setting.treeObj;
			o.unbind('selectstart', handler.onSelectStart)
				.unbind('click', event.proxy)
				.unbind('dblclick', event.proxy)
				.unbind('mouseover', event.proxy)
				.unbind('mouseout', event.proxy)
				.unbind('mousedown', event.proxy)
				.unbind('mouseup', event.proxy)
				.unbind('contextmenu', event.proxy);
		},
		doProxy: function(e) {
			var results = [];
			for (var i=0, j=_init.proxys.length; i<j; i++) {
				var proxyResult = _init.proxys[i].apply(this, arguments);
				results.push(proxyResult);
				if (proxyResult.stop) {
					break;
				}
			}
			return results;
		},
		proxy: function(e) {
			var setting = data.getSetting(e.data.treeId);
			if (!tools.uCanDo(setting, e)) return true;
			var results = event.doProxy(e),
			r = true, x = false;
			for (var i=0, l=results.length; i<l; i++) {
				var proxyResult = results[i];
				if (proxyResult.nodeEventCallback) {
					x = true;
					r = proxyResult.nodeEventCallback.apply(proxyResult, [e, proxyResult.node]) && r;
				}
				if (proxyResult.treeEventCallback) {
					x = true;
					r = proxyResult.treeEventCallback.apply(proxyResult, [e, proxyResult.node]) && r;
				}
			}
			return r;
		}
	},
	//method of event handler
	handler = {
		onSwitchNode: function (event, node) {
			var setting = data.getSetting(event.data.treeId);
			if (node.open) {
				if (tools.apply(setting.callback.beforeCollapse, [setting.treeId, node], true) == false) return true;
				data.getRoot(setting).expandTriggerFlag = true;
				view.switchNode(setting, node);
			} else {
				if (tools.apply(setting.callback.beforeExpand, [setting.treeId, node], true) == false) return true;
				data.getRoot(setting).expandTriggerFlag = true;
				view.switchNode(setting, node);
			}
			return true;
		},
		onClickNode: function (event, node) {
			var setting = data.getSetting(event.data.treeId),
			clickFlag = ( (setting.view.autoCancelSelected && (event.ctrlKey || event.metaKey)) && data.isSelectedNode(setting, node)) ? 0 : (setting.view.autoCancelSelected && (event.ctrlKey || event.metaKey) && setting.view.selectedMulti) ? 2 : 1;
			if (tools.apply(setting.callback.beforeClick, [setting.treeId, node, clickFlag], true) == false) return true;
			if (clickFlag === 0) {
				view.cancelPreSelectedNode(setting, node);
			} else {
				view.selectNode(setting, node, clickFlag === 2);
			}
			setting.treeObj.trigger(consts.event.CLICK, [event, setting.treeId, node, clickFlag]);
			return true;
		},
		onZTreeMousedown: function(event, node) {
			var setting = data.getSetting(event.data.treeId);
			if (tools.apply(setting.callback.beforeMouseDown, [setting.treeId, node], true)) {
				tools.apply(setting.callback.onMouseDown, [event, setting.treeId, node]);
			}
			return true;
		},
		onZTreeMouseup: function(event, node) {
			var setting = data.getSetting(event.data.treeId);
			if (tools.apply(setting.callback.beforeMouseUp, [setting.treeId, node], true)) {
				tools.apply(setting.callback.onMouseUp, [event, setting.treeId, node]);
			}
			return true;
		},
		onZTreeDblclick: function(event, node) {
			var setting = data.getSetting(event.data.treeId);
			if (tools.apply(setting.callback.beforeDblClick, [setting.treeId, node], true)) {
				tools.apply(setting.callback.onDblClick, [event, setting.treeId, node]);
			}
			return true;
		},
		onZTreeContextmenu: function(event, node) {
			var setting = data.getSetting(event.data.treeId);
			if (tools.apply(setting.callback.beforeRightClick, [setting.treeId, node], true)) {
				tools.apply(setting.callback.onRightClick, [event, setting.treeId, node]);
			}
			return (typeof setting.callback.onRightClick) != "function";
		},
		onSelectStart: function(e){
			var n = e.originalEvent.srcElement.nodeName.toLowerCase();
			return (n === "input" || n === "textarea" );
		}
	},
	//method of tools for zTree
	tools = {
		apply: function(fun, param, defaultValue) {
			if ((typeof fun) == "function") {
				return fun.apply(zt, param?param:[]);
			}
			return defaultValue;
		},
		canAsync: function(setting, node) {
			var childKey = setting.data.key.children;
			return (setting.async.enable && node && node.isParent && !(node.zAsync || (node[childKey] && node[childKey].length > 0)));
		},
		clone: function (obj){
			if (obj === null) return null;
			var o = tools.isArray(obj) ? [] : {};
			for(var i in obj){
				o[i] = (obj[i] instanceof Date) ? new Date(obj[i].getTime()) : (typeof obj[i] === "object" ? tools.clone(obj[i]) : obj[i]);
			}
			return o;
		},
		eqs: function(str1, str2) {
			return str1.toLowerCase() === str2.toLowerCase();
		},
		isArray: function(arr) {
			return Object.prototype.toString.apply(arr) === "[object Array]";
		},
		$: function(node, exp, setting) {
			if (!!exp && typeof exp != "string") {
				setting = exp;
				exp = "";
			}
			if (typeof node == "string") {
				return $(node, setting ? setting.treeObj.get(0).ownerDocument : null);
			} else {
				return $("#" + node.tId + exp, setting ? setting.treeObj : null);
			}
		},
		getMDom: function (setting, curDom, targetExpr) {
			if (!curDom) return null;
			while (curDom && curDom.id !== setting.treeId) {
				for (var i=0, l=targetExpr.length; curDom.tagName && i<l; i++) {
					if (tools.eqs(curDom.tagName, targetExpr[i].tagName) && curDom.getAttribute(targetExpr[i].attrName) !== null) {
						return curDom;
					}
				}
				curDom = curDom.parentNode;
			}
			return null;
		},
		getNodeMainDom:function(target) {
			return ($(target).parent("li").get(0) || $(target).parentsUntil("li").parent().get(0));
		},
		isChildOrSelf: function(dom, parentId) {
			return ( $(dom).closest("#" + parentId).length> 0 );
		},
		uCanDo: function(setting, e) {
			return true;
		}
	},
	//method of operate ztree dom
	view = {
		addNodes: function(setting, parentNode, index, newNodes, isSilent) {
			if (setting.data.keep.leaf && parentNode && !parentNode.isParent) {
				return;
			}
			if (!tools.isArray(newNodes)) {
				newNodes = [newNodes];
			}
			if (setting.data.simpleData.enable) {
				newNodes = data.transformTozTreeFormat(setting, newNodes);
			}
			if (parentNode) {
				var target_switchObj = $$(parentNode, consts.id.SWITCH, setting),
				target_icoObj = $$(parentNode, consts.id.ICON, setting),
				target_ulObj = $$(parentNode, consts.id.UL, setting);

				if (!parentNode.open) {
					view.replaceSwitchClass(parentNode, target_switchObj, consts.folder.CLOSE);
					view.replaceIcoClass(parentNode, target_icoObj, consts.folder.CLOSE);
					parentNode.open = false;
					target_ulObj.css({
						"display": "none"
					});
				}

				data.addNodesData(setting, parentNode, index, newNodes);
				view.createNodes(setting, parentNode.level + 1, newNodes, parentNode, index);
				if (!isSilent) {
					view.expandCollapseParentNode(setting, parentNode, true);
				}
			} else {
				data.addNodesData(setting, data.getRoot(setting), index, newNodes);
				view.createNodes(setting, 0, newNodes, null, index);
			}
		},
		appendNodes: function(setting, level, nodes, parentNode, index, initFlag, openFlag) {
			if (!nodes) return [];
			var html = [],
			childKey = setting.data.key.children;

			var tmpPNode = (parentNode) ? parentNode: data.getRoot(setting),
				tmpPChild = tmpPNode[childKey],
				isFirstNode, isLastNode;

			if (!tmpPChild || index >= tmpPChild.length) {
				index = -1;
			}

			for (var i = 0, l = nodes.length; i < l; i++) {
				var node = nodes[i];
				if (initFlag) {
					isFirstNode = ((index===0 || tmpPChild.length == nodes.length) && (i == 0));
					isLastNode = (index < 0 && i == (nodes.length - 1));
					data.initNode(setting, level, node, parentNode, isFirstNode, isLastNode, openFlag);
					data.addNodeCache(setting, node);
				}

				var childHtml = [];
				if (node[childKey] && node[childKey].length > 0) {
					//make child html first, because checkType
					childHtml = view.appendNodes(setting, level + 1, node[childKey], node, -1, initFlag, openFlag && node.open);
				}
				if (openFlag) {

					view.makeDOMNodeMainBefore(html, setting, node);
					view.makeDOMNodeLine(html, setting, node);
					data.getBeforeA(setting, node, html);
					view.makeDOMNodeNameBefore(html, setting, node);
					data.getInnerBeforeA(setting, node, html);
					view.makeDOMNodeIcon(html, setting, node);
					data.getInnerAfterA(setting, node, html);
					view.makeDOMNodeNameAfter(html, setting, node);
					data.getAfterA(setting, node, html);
					if (node.isParent && node.open) {
						view.makeUlHtml(setting, node, html, childHtml.join(''));
					}
					view.makeDOMNodeMainAfter(html, setting, node);
					data.addCreatedNode(setting, node);
				}
			}
			return html;
		},
		appendParentULDom: function(setting, node) {
			var html = [],
			nObj = $$(node, setting);
			if (!nObj.get(0) && !!node.parentTId) {
				view.appendParentULDom(setting, node.getParentNode());
				nObj = $$(node, setting);
			}
			var ulObj = $$(node, consts.id.UL, setting);
			if (ulObj.get(0)) {
				ulObj.remove();
			}
			var childKey = setting.data.key.children,
			childHtml = view.appendNodes(setting, node.level+1, node[childKey], node, -1, false, true);
			view.makeUlHtml(setting, node, html, childHtml.join(''));
			nObj.append(html.join(''));
		},
		asyncNode: function(setting, node, isSilent, callback) {
			var i, l;
			if (node && !node.isParent) {
				tools.apply(callback);
				return false;
			} else if (node && node.isAjaxing) {
				return false;
			} else if (tools.apply(setting.callback.beforeAsync, [setting.treeId, node], true) == false) {
				tools.apply(callback);
				return false;
			}
			if (node) {
				node.isAjaxing = true;
				var icoObj = $$(node, consts.id.ICON, setting);
				icoObj.attr({"style":"", "class":consts.className.BUTTON + " " + consts.className.ICO_LOADING});
			}

			var tmpParam = {};
			for (i = 0, l = setting.async.autoParam.length; node && i < l; i++) {
				var pKey = setting.async.autoParam[i].split("="), spKey = pKey;
				if (pKey.length>1) {
					spKey = pKey[1];
					pKey = pKey[0];
				}
				tmpParam[spKey] = node[pKey];
			}
			if (tools.isArray(setting.async.otherParam)) {
				for (i = 0, l = setting.async.otherParam.length; i < l; i += 2) {
					tmpParam[setting.async.otherParam[i]] = setting.async.otherParam[i + 1];
				}
			} else {
				for (var p in setting.async.otherParam) {
					tmpParam[p] = setting.async.otherParam[p];
				}
			}

			var _tmpV = data.getRoot(setting)._ver;
			$.ajax({
				contentType: setting.async.contentType,
                cache: false,
				type: setting.async.type,
				url: tools.apply(setting.async.url, [setting.treeId, node], setting.async.url),
				data: tmpParam,
				dataType: setting.async.dataType,
				success: function(msg) {
					if (_tmpV != data.getRoot(setting)._ver) {
						return;
					}
					var newNodes = [];
					try {
						if (!msg || msg.length == 0) {
							newNodes = [];
						} else if (typeof msg == "string") {
							newNodes = eval("(" + msg + ")");
						} else {
							newNodes = msg;
						}
					} catch(err) {
						newNodes = msg;
					}

					if (node) {
						node.isAjaxing = null;
						node.zAsync = true;
					}
					view.setNodeLineIcos(setting, node);
					if (newNodes && newNodes !== "") {
						newNodes = tools.apply(setting.async.dataFilter, [setting.treeId, node, newNodes], newNodes);
						view.addNodes(setting, node, -1, !!newNodes ? tools.clone(newNodes) : [], !!isSilent);
					} else {
						view.addNodes(setting, node, -1, [], !!isSilent);
					}
					setting.treeObj.trigger(consts.event.ASYNC_SUCCESS, [setting.treeId, node, msg]);
					tools.apply(callback);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					if (_tmpV != data.getRoot(setting)._ver) {
						return;
					}
					if (node) node.isAjaxing = null;
					view.setNodeLineIcos(setting, node);
					setting.treeObj.trigger(consts.event.ASYNC_ERROR, [setting.treeId, node, XMLHttpRequest, textStatus, errorThrown]);
				}
			});
			return true;
		},
		cancelPreSelectedNode: function (setting, node, excludeNode) {
			var list = data.getRoot(setting).curSelectedList,
				i, n;
			for (i=list.length-1; i>=0; i--) {
				n = list[i];
				if (node === n || (!node && (!excludeNode || excludeNode !== n))) {
					$$(n, consts.id.A, setting).removeClass(consts.node.CURSELECTED);
					if (node) {
						data.removeSelectedNode(setting, node);
						break;
					} else {
						list.splice(i, 1);
						setting.treeObj.trigger(consts.event.UNSELECTED, [setting.treeId, n]);
					}
				}
			}
		},
		createNodeCallback: function(setting) {
			if (!!setting.callback.onNodeCreated || !!setting.view.addDiyDom) {
				var root = data.getRoot(setting);
				while (root.createdNodes.length>0) {
					var node = root.createdNodes.shift();
					tools.apply(setting.view.addDiyDom, [setting.treeId, node]);
					if (!!setting.callback.onNodeCreated) {
						setting.treeObj.trigger(consts.event.NODECREATED, [setting.treeId, node]);
					}
				}
			}
		},
		createNodes: function(setting, level, nodes, parentNode, index) {
			if (!nodes || nodes.length == 0) return;
			var root = data.getRoot(setting),
			childKey = setting.data.key.children,
			openFlag = !parentNode || parentNode.open || !!$$(parentNode[childKey][0], setting).get(0);
			root.createdNodes = [];
			var zTreeHtml = view.appendNodes(setting, level, nodes, parentNode, index, true, openFlag),
				parentObj, nextObj;

			if (!parentNode) {
				parentObj = setting.treeObj;
				//setting.treeObj.append(zTreeHtml.join(''));
			} else {
				var ulObj = $$(parentNode, consts.id.UL, setting);
				if (ulObj.get(0)) {
					parentObj = ulObj;
					//ulObj.append(zTreeHtml.join(''));
				}
			}
			if (parentObj) {
				if (index >= 0) {
					nextObj = parentObj.children()[index];
				}
				if (index >=0 && nextObj) {
					$(nextObj).before(zTreeHtml.join(''));
				} else {
					parentObj.append(zTreeHtml.join(''));
				}
			}

			view.createNodeCallback(setting);
		},
		destroy: function(setting) {
			if (!setting) return;
			data.initCache(setting);
			data.initRoot(setting);
			event.unbindTree(setting);
			event.unbindEvent(setting);
			setting.treeObj.empty();
			delete settings[setting.treeId];
		},
		expandCollapseNode: function(setting, node, expandFlag, animateFlag, callback) {
			var root = data.getRoot(setting),
			childKey = setting.data.key.children;
			var tmpCb, _callback;
			if (!node) {
				tools.apply(callback, []);
				return;
			}
			if (root.expandTriggerFlag) {
				_callback = callback;
				tmpCb = function(){
					if (_callback) _callback();
					if (node.open) {
						setting.treeObj.trigger(consts.event.EXPAND, [setting.treeId, node]);
					} else {
						setting.treeObj.trigger(consts.event.COLLAPSE, [setting.treeId, node]);
					}
				};
				callback = tmpCb;
				root.expandTriggerFlag = false;
			}
			if (!node.open && node.isParent && ((!$$(node, consts.id.UL, setting).get(0)) || (node[childKey] && node[childKey].length>0 && !$$(node[childKey][0], setting).get(0)))) {
				view.appendParentULDom(setting, node);
				view.createNodeCallback(setting);
			}
			if (node.open == expandFlag) {
				tools.apply(callback, []);
				return;
			}
			var ulObj = $$(node, consts.id.UL, setting),
			switchObj = $$(node, consts.id.SWITCH, setting),
			icoObj = $$(node, consts.id.ICON, setting);

			if (node.isParent) {
				node.open = !node.open;
				if (node.iconOpen && node.iconClose) {
					icoObj.attr("style", view.makeNodeIcoStyle(setting, node));
				}

				if (node.open) {
					view.replaceSwitchClass(node, switchObj, consts.folder.OPEN);
					view.replaceIcoClass(node, icoObj, consts.folder.OPEN);
					if (animateFlag == false || setting.view.expandSpeed == "") {
						ulObj.show();
						tools.apply(callback, []);
					} else {
						if (node[childKey] && node[childKey].length > 0) {
							ulObj.slideDown(setting.view.expandSpeed, callback);
						} else {
							ulObj.show();
							tools.apply(callback, []);
						}
					}
				} else {
					view.replaceSwitchClass(node, switchObj, consts.folder.CLOSE);
					view.replaceIcoClass(node, icoObj, consts.folder.CLOSE);
					if (animateFlag == false || setting.view.expandSpeed == "" || !(node[childKey] && node[childKey].length > 0)) {
						ulObj.hide();
						tools.apply(callback, []);
					} else {
						ulObj.slideUp(setting.view.expandSpeed, callback);
					}
				}
			} else {
				tools.apply(callback, []);
			}
		},
		expandCollapseParentNode: function(setting, node, expandFlag, animateFlag, callback) {
			if (!node) return;
			if (!node.parentTId) {
				view.expandCollapseNode(setting, node, expandFlag, animateFlag, callback);
				return;
			} else {
				view.expandCollapseNode(setting, node, expandFlag, animateFlag);
			}
			if (node.parentTId) {
				view.expandCollapseParentNode(setting, node.getParentNode(), expandFlag, animateFlag, callback);
			}
		},
		expandCollapseSonNode: function(setting, node, expandFlag, animateFlag, callback) {
			var root = data.getRoot(setting),
			childKey = setting.data.key.children,
			treeNodes = (node) ? node[childKey]: root[childKey],
			selfAnimateSign = (node) ? false : animateFlag,
			expandTriggerFlag = data.getRoot(setting).expandTriggerFlag;
			data.getRoot(setting).expandTriggerFlag = false;
			if (treeNodes) {
				for (var i = 0, l = treeNodes.length; i < l; i++) {
					if (treeNodes[i]) view.expandCollapseSonNode(setting, treeNodes[i], expandFlag, selfAnimateSign);
				}
			}
			data.getRoot(setting).expandTriggerFlag = expandTriggerFlag;
			view.expandCollapseNode(setting, node, expandFlag, animateFlag, callback );
		},
		isSelectedNode: function (setting, node) {
			if (!node) {
				return false;
			}
			var list = data.getRoot(setting).curSelectedList,
				i;
			for (i=list.length-1; i>=0; i--) {
				if (node === list[i]) {
					return true;
				}
			}
			return false;
		},
		makeDOMNodeIcon: function(html, setting, node) {
			var nameStr = data.getNodeName(setting, node),
			name = setting.view.nameIsHTML ? nameStr : nameStr.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
			html.push("<span id='", node.tId, consts.id.ICON,
				"' title='' treeNode", consts.id.ICON," class='", view.makeNodeIcoClass(setting, node),
				"' style='", view.makeNodeIcoStyle(setting, node), "'></span><span id='", node.tId, consts.id.SPAN,
				"' class='", consts.className.NAME,
				"'>",name,"</span>");
		},
		makeDOMNodeLine: function(html, setting, node) {
			html.push("<span id='", node.tId, consts.id.SWITCH,	"' title='' class='", view.makeNodeLineClass(setting, node), "' treeNode", consts.id.SWITCH,"></span>");
		},
		makeDOMNodeMainAfter: function(html, setting, node) {
			html.push("</li>");
		},
		makeDOMNodeMainBefore: function(html, setting, node) {
			html.push("<li id='", node.tId, "' class='", consts.className.LEVEL, node.level,"' tabindex='0' hidefocus='true' treenode>");
		},
		makeDOMNodeNameAfter: function(html, setting, node) {
			html.push("</a>");
		},
		makeDOMNodeNameBefore: function(html, setting, node) {
			var title = data.getNodeTitle(setting, node),
			url = view.makeNodeUrl(setting, node),
			fontcss = view.makeNodeFontCss(setting, node),
			fontStyle = [];
			for (var f in fontcss) {
				fontStyle.push(f, ":", fontcss[f], ";");
			}
			html.push("<a id='", node.tId, consts.id.A, "' class='", consts.className.LEVEL, node.level,"' treeNode", consts.id.A," onclick=\"", (node.click || ''),
				"\" ", ((url != null && url.length > 0) ? "href='" + url + "'" : ""), " target='",view.makeNodeTarget(node),"' style='", fontStyle.join(''),
				"'");
			if (tools.apply(setting.view.showTitle, [setting.treeId, node], setting.view.showTitle) && title) {html.push("title='", title.replace(/'/g,"&#39;").replace(/</g,'&lt;').replace(/>/g,'&gt;'),"'");}
			html.push(">");
		},
		makeNodeFontCss: function(setting, node) {
			var fontCss = tools.apply(setting.view.fontCss, [setting.treeId, node], setting.view.fontCss);
			return (fontCss && ((typeof fontCss) != "function")) ? fontCss : {};
		},
		makeNodeIcoClass: function(setting, node) {
			var icoCss = ["ico"];
			if (!node.isAjaxing) {
				icoCss[0] = (node.iconSkin ? node.iconSkin + "_" : "") + icoCss[0];
				if (node.isParent) {
					icoCss.push(node.open ? consts.folder.OPEN : consts.folder.CLOSE);
				} else {
					icoCss.push(consts.folder.DOCU);
				}
			}
			return consts.className.BUTTON + " " + icoCss.join('_');
		},
		makeNodeIcoStyle: function(setting, node) {
			var icoStyle = [];
			if (!node.isAjaxing) {
				var icon = (node.isParent && node.iconOpen && node.iconClose) ? (node.open ? node.iconOpen : node.iconClose) : node[setting.data.key.icon];
				if (icon) icoStyle.push("background:url(", icon, ") 0 0 no-repeat;");
				if (setting.view.showIcon == false || !tools.apply(setting.view.showIcon, [setting.treeId, node], true)) {
					icoStyle.push("width:0px;height:0px;");
				}
			}
			return icoStyle.join('');
		},
		makeNodeLineClass: function(setting, node) {
			var lineClass = [];
			if (setting.view.showLine) {
				if (node.level == 0 && node.isFirstNode && node.isLastNode) {
					lineClass.push(consts.line.ROOT);
				} else if (node.level == 0 && node.isFirstNode) {
					lineClass.push(consts.line.ROOTS);
				} else if (node.isLastNode) {
					lineClass.push(consts.line.BOTTOM);
				} else {
					lineClass.push(consts.line.CENTER);
				}
			} else {
				lineClass.push(consts.line.NOLINE);
			}
			if (node.isParent) {
				lineClass.push(node.open ? consts.folder.OPEN : consts.folder.CLOSE);
			} else {
				lineClass.push(consts.folder.DOCU);
			}
			return view.makeNodeLineClassEx(node) + lineClass.join('_');
		},
		makeNodeLineClassEx: function(node) {
			return consts.className.BUTTON + " " + consts.className.LEVEL + node.level + " " + consts.className.SWITCH + " ";
		},
		makeNodeTarget: function(node) {
			return (node.target || "_blank");
		},
		makeNodeUrl: function(setting, node) {
			var urlKey = setting.data.key.url;
			return node[urlKey] ? node[urlKey] : null;
		},
		makeUlHtml: function(setting, node, html, content) {
			html.push("<ul id='", node.tId, consts.id.UL, "' class='", consts.className.LEVEL, node.level, " ", view.makeUlLineClass(setting, node), "' style='display:", (node.open ? "block": "none"),"'>");
			html.push(content);
			html.push("</ul>");
		},
		makeUlLineClass: function(setting, node) {
			return ((setting.view.showLine && !node.isLastNode) ? consts.line.LINE : "");
		},
		removeChildNodes: function(setting, node) {
			if (!node) return;
			var childKey = setting.data.key.children,
			nodes = node[childKey];
			if (!nodes) return;

			for (var i = 0, l = nodes.length; i < l; i++) {
				data.removeNodeCache(setting, nodes[i]);
			}
			data.removeSelectedNode(setting);
			delete node[childKey];

			if (!setting.data.keep.parent) {
				node.isParent = false;
				node.open = false;
				var tmp_switchObj = $$(node, consts.id.SWITCH, setting),
				tmp_icoObj = $$(node, consts.id.ICON, setting);
				view.replaceSwitchClass(node, tmp_switchObj, consts.folder.DOCU);
				view.replaceIcoClass(node, tmp_icoObj, consts.folder.DOCU);
				$$(node, consts.id.UL, setting).remove();
			} else {
				$$(node, consts.id.UL, setting).empty();
			}
		},
		scrollIntoView: function(dom) {
			if (!dom) {
				return;
			}
			if (dom.scrollIntoViewIfNeeded) {
				dom.scrollIntoViewIfNeeded();
			} else if (dom.scrollIntoView) {
				dom.scrollIntoView(false);
			} else {
				try{dom.focus().blur();}catch(e){}
			}
		},
		setFirstNode: function(setting, parentNode) {
			var childKey = setting.data.key.children, childLength = parentNode[childKey].length;
			if ( childLength > 0) {
				parentNode[childKey][0].isFirstNode = true;
			}
		},
		setLastNode: function(setting, parentNode) {
			var childKey = setting.data.key.children, childLength = parentNode[childKey].length;
			if ( childLength > 0) {
				parentNode[childKey][childLength - 1].isLastNode = true;
			}
		},
		removeNode: function(setting, node) {
			var root = data.getRoot(setting),
			childKey = setting.data.key.children,
			parentNode = (node.parentTId) ? node.getParentNode() : root;

			node.isFirstNode = false;
			node.isLastNode = false;
			node.getPreNode = function() {return null;};
			node.getNextNode = function() {return null;};

			if (!data.getNodeCache(setting, node.tId)) {
				return;
			}

			$$(node, setting).remove();
			data.removeNodeCache(setting, node);
			data.removeSelectedNode(setting, node);

			for (var i = 0, l = parentNode[childKey].length; i < l; i++) {
				if (parentNode[childKey][i].tId == node.tId) {
					parentNode[childKey].splice(i, 1);
					break;
				}
			}
			view.setFirstNode(setting, parentNode);
			view.setLastNode(setting, parentNode);

			var tmp_ulObj,tmp_switchObj,tmp_icoObj,
			childLength = parentNode[childKey].length;

			//repair nodes old parent
			if (!setting.data.keep.parent && childLength == 0) {
				//old parentNode has no child nodes
				parentNode.isParent = false;
				parentNode.open = false;
				tmp_ulObj = $$(parentNode, consts.id.UL, setting);
				tmp_switchObj = $$(parentNode, consts.id.SWITCH, setting);
				tmp_icoObj = $$(parentNode, consts.id.ICON, setting);
				view.replaceSwitchClass(parentNode, tmp_switchObj, consts.folder.DOCU);
				view.replaceIcoClass(parentNode, tmp_icoObj, consts.folder.DOCU);
				tmp_ulObj.css("display", "none");

			} else if (setting.view.showLine && childLength > 0) {
				//old parentNode has child nodes
				var newLast = parentNode[childKey][childLength - 1];
				tmp_ulObj = $$(newLast, consts.id.UL, setting);
				tmp_switchObj = $$(newLast, consts.id.SWITCH, setting);
				tmp_icoObj = $$(newLast, consts.id.ICON, setting);
				if (parentNode == root) {
					if (parentNode[childKey].length == 1) {
						//node was root, and ztree has only one root after move node
						view.replaceSwitchClass(newLast, tmp_switchObj, consts.line.ROOT);
					} else {
						var tmp_first_switchObj = $$(parentNode[childKey][0], consts.id.SWITCH, setting);
						view.replaceSwitchClass(parentNode[childKey][0], tmp_first_switchObj, consts.line.ROOTS);
						view.replaceSwitchClass(newLast, tmp_switchObj, consts.line.BOTTOM);
					}
				} else {
					view.replaceSwitchClass(newLast, tmp_switchObj, consts.line.BOTTOM);
				}
				tmp_ulObj.removeClass(consts.line.LINE);
			}
		},
		replaceIcoClass: function(node, obj, newName) {
			if (!obj || node.isAjaxing) return;
			var tmpName = obj.attr("class");
			if (tmpName == undefined) return;
			var tmpList = tmpName.split("_");
			switch (newName) {
				case consts.folder.OPEN:
				case consts.folder.CLOSE:
				case consts.folder.DOCU:
					tmpList[tmpList.length-1] = newName;
					break;
			}
			obj.attr("class", tmpList.join("_"));
		},
		replaceSwitchClass: function(node, obj, newName) {
			if (!obj) return;
			var tmpName = obj.attr("class");
			if (tmpName == undefined) return;
			var tmpList = tmpName.split("_");
			switch (newName) {
				case consts.line.ROOT:
				case consts.line.ROOTS:
				case consts.line.CENTER:
				case consts.line.BOTTOM:
				case consts.line.NOLINE:
					tmpList[0] = view.makeNodeLineClassEx(node) + newName;
					break;
				case consts.folder.OPEN:
				case consts.folder.CLOSE:
				case consts.folder.DOCU:
					tmpList[1] = newName;
					break;
			}
			obj.attr("class", tmpList.join("_"));
			if (newName !== consts.folder.DOCU) {
				obj.removeAttr("disabled");
			} else {
				obj.attr("disabled", "disabled");
			}
		},
		selectNode: function(setting, node, addFlag) {
			if (!addFlag) {
				view.cancelPreSelectedNode(setting, null, node);
			}
			$$(node, consts.id.A, setting).addClass(consts.node.CURSELECTED);
			data.addSelectedNode(setting, node);
			setting.treeObj.trigger(consts.event.SELECTED, [setting.treeId, node]);
		},
		setNodeFontCss: function(setting, treeNode) {
			var aObj = $$(treeNode, consts.id.A, setting),
			fontCss = view.makeNodeFontCss(setting, treeNode);
			if (fontCss) {
				aObj.css(fontCss);
			}
		},
		setNodeLineIcos: function(setting, node) {
			if (!node) return;
			var switchObj = $$(node, consts.id.SWITCH, setting),
			ulObj = $$(node, consts.id.UL, setting),
			icoObj = $$(node, consts.id.ICON, setting),
			ulLine = view.makeUlLineClass(setting, node);
			if (ulLine.length==0) {
				ulObj.removeClass(consts.line.LINE);
			} else {
				ulObj.addClass(ulLine);
			}
			switchObj.attr("class", view.makeNodeLineClass(setting, node));
			if (node.isParent) {
				switchObj.removeAttr("disabled");
			} else {
				switchObj.attr("disabled", "disabled");
			}
			icoObj.removeAttr("style");
			icoObj.attr("style", view.makeNodeIcoStyle(setting, node));
			icoObj.attr("class", view.makeNodeIcoClass(setting, node));
		},
		setNodeName: function(setting, node) {
			var title = data.getNodeTitle(setting, node),
			nObj = $$(node, consts.id.SPAN, setting);
			nObj.empty();
			if (setting.view.nameIsHTML) {
				nObj.html(data.getNodeName(setting, node));
			} else {
				nObj.text(data.getNodeName(setting, node));
			}
			if (tools.apply(setting.view.showTitle, [setting.treeId, node], setting.view.showTitle)) {
				var aObj = $$(node, consts.id.A, setting);
				aObj.attr("title", !title ? "" : title);
			}
		},
		setNodeTarget: function(setting, node) {
			var aObj = $$(node, consts.id.A, setting);
			aObj.attr("target", view.makeNodeTarget(node));
		},
		setNodeUrl: function(setting, node) {
			var aObj = $$(node, consts.id.A, setting),
			url = view.makeNodeUrl(setting, node);
			if (url == null || url.length == 0) {
				aObj.removeAttr("href");
			} else {
				aObj.attr("href", url);
			}
		},
		switchNode: function(setting, node) {
			if (node.open || !tools.canAsync(setting, node)) {
				view.expandCollapseNode(setting, node, !node.open);
			} else if (setting.async.enable) {
				if (!view.asyncNode(setting, node)) {
					view.expandCollapseNode(setting, node, !node.open);
					return;
				}
			} else if (node) {
				view.expandCollapseNode(setting, node, !node.open);
			}
		}
	};
	// zTree defind
	$.fn.zTree = {
		consts : _consts,
		_z : {
			tools: tools,
			view: view,
			event: event,
			data: data
		},
		getZTreeObj: function(treeId) {
			var o = data.getZTreeTools(treeId);
			return o ? o : null;
		},
		destroy: function(treeId) {
			if (!!treeId && treeId.length > 0) {
				view.destroy(data.getSetting(treeId));
			} else {
				for(var s in settings) {
					view.destroy(settings[s]);
				}
			}
		},
		init: function(obj, zSetting, zNodes) {
			var setting = tools.clone(_setting);
			$.extend(true, setting, zSetting);
			setting.treeId = obj.attr("id");
			setting.treeObj = obj;
			setting.treeObj.empty();
			settings[setting.treeId] = setting;
			//For some older browser,(e.g., ie6)
			if(typeof document.body.style.maxHeight === "undefined") {
				setting.view.expandSpeed = "";
			}
			data.initRoot(setting);
			var root = data.getRoot(setting),
			childKey = setting.data.key.children;
			zNodes = zNodes ? tools.clone(tools.isArray(zNodes)? zNodes : [zNodes]) : [];
			if (setting.data.simpleData.enable) {
				root[childKey] = data.transformTozTreeFormat(setting, zNodes);
			} else {
				root[childKey] = zNodes;
			}

			data.initCache(setting);
			event.unbindTree(setting);
			event.bindTree(setting);
			event.unbindEvent(setting);
			event.bindEvent(setting);

			var zTreeTools = {
				setting : setting,
				addNodes : function(parentNode, index, newNodes, isSilent) {
					if (!parentNode) parentNode = null;
					if (parentNode && !parentNode.isParent && setting.data.keep.leaf) return null;

					var i = parseInt(index, 10);
					if (isNaN(i)) {
						isSilent = !!newNodes;
						newNodes = index;
						index = -1;
					} else {
						index = i;
					}
					if (!newNodes) return null;


					var xNewNodes = tools.clone(tools.isArray(newNodes)? newNodes: [newNodes]);
					function addCallback() {
						view.addNodes(setting, parentNode, index, xNewNodes, (isSilent==true));
					}

					if (tools.canAsync(setting, parentNode)) {
						view.asyncNode(setting, parentNode, isSilent, addCallback);
					} else {
						addCallback();
					}
					return xNewNodes;
				},
				cancelSelectedNode : function(node) {
					view.cancelPreSelectedNode(setting, node);
				},
				destroy : function() {
					view.destroy(setting);
				},
				expandAll : function(expandFlag) {
					expandFlag = !!expandFlag;
					view.expandCollapseSonNode(setting, null, expandFlag, true);
					return expandFlag;
				},
				expandNode : function(node, expandFlag, sonSign, focus, callbackFlag) {
					if (!node || !node.isParent) return null;
					if (expandFlag !== true && expandFlag !== false) {
						expandFlag = !node.open;
					}
					callbackFlag = !!callbackFlag;

					if (callbackFlag && expandFlag && (tools.apply(setting.callback.beforeExpand, [setting.treeId, node], true) == false)) {
						return null;
					} else if (callbackFlag && !expandFlag && (tools.apply(setting.callback.beforeCollapse, [setting.treeId, node], true) == false)) {
						return null;
					}
					if (expandFlag && node.parentTId) {
						view.expandCollapseParentNode(setting, node.getParentNode(), expandFlag, false);
					}
					if (expandFlag === node.open && !sonSign) {
						return null;
					}

					data.getRoot(setting).expandTriggerFlag = callbackFlag;
					if (!tools.canAsync(setting, node) && sonSign) {
						view.expandCollapseSonNode(setting, node, expandFlag, true, showNodeFocus);
					} else {
						node.open = !expandFlag;
						view.switchNode(this.setting, node);
						showNodeFocus();
					}
					return expandFlag;

					function showNodeFocus() {
						var a = $$(node, setting).get(0);
						if (a && focus !== false) {
							view.scrollIntoView(a);
						}
					}
				},
				getNodes : function() {
					return data.getNodes(setting);
				},
				getNodeByParam : function(key, value, parentNode) {
					if (!key) return null;
					return data.getNodeByParam(setting, parentNode?parentNode[setting.data.key.children]:data.getNodes(setting), key, value);
				},
				getNodeByTId : function(tId) {
					return data.getNodeCache(setting, tId);
				},
				getNodesByParam : function(key, value, parentNode) {
					if (!key) return null;
					return data.getNodesByParam(setting, parentNode?parentNode[setting.data.key.children]:data.getNodes(setting), key, value);
				},
				getNodesByParamFuzzy : function(key, value, parentNode) {
					if (!key) return null;
					return data.getNodesByParamFuzzy(setting, parentNode?parentNode[setting.data.key.children]:data.getNodes(setting), key, value);
				},
				getNodesByFilter: function(filter, isSingle, parentNode, invokeParam) {
					isSingle = !!isSingle;
					if (!filter || (typeof filter != "function")) return (isSingle ? null : []);
					return data.getNodesByFilter(setting, parentNode?parentNode[setting.data.key.children]:data.getNodes(setting), filter, isSingle, invokeParam);
				},
				getNodeIndex : function(node) {
					if (!node) return null;
					var childKey = setting.data.key.children,
					parentNode = (node.parentTId) ? node.getParentNode() : data.getRoot(setting);
					for (var i=0, l = parentNode[childKey].length; i < l; i++) {
						if (parentNode[childKey][i] == node) return i;
					}
					return -1;
				},
				getSelectedNodes : function() {
					var r = [], list = data.getRoot(setting).curSelectedList;
					for (var i=0, l=list.length; i<l; i++) {
						r.push(list[i]);
					}
					return r;
				},
				isSelectedNode : function(node) {
					return data.isSelectedNode(setting, node);
				},
				reAsyncChildNodes : function(parentNode, reloadType, isSilent) {
					if (!this.setting.async.enable) return;
					var isRoot = !parentNode;
					if (isRoot) {
						parentNode = data.getRoot(setting);
					}
					if (reloadType=="refresh") {
						var childKey = this.setting.data.key.children;
						for (var i = 0, l = parentNode[childKey] ? parentNode[childKey].length : 0; i < l; i++) {
							data.removeNodeCache(setting, parentNode[childKey][i]);
						}
						data.removeSelectedNode(setting);
						parentNode[childKey] = [];
						if (isRoot) {
							this.setting.treeObj.empty();
						} else {
							var ulObj = $$(parentNode, consts.id.UL, setting);
							ulObj.empty();
						}
					}
					view.asyncNode(this.setting, isRoot? null:parentNode, !!isSilent);
				},
				refresh : function() {
					this.setting.treeObj.empty();
					var root = data.getRoot(setting),
					nodes = root[setting.data.key.children]
					data.initRoot(setting);
					root[setting.data.key.children] = nodes
					data.initCache(setting);
					view.createNodes(setting, 0, root[setting.data.key.children], null, -1);
				},
				removeChildNodes : function(node) {
					if (!node) return null;
					var childKey = setting.data.key.children,
					nodes = node[childKey];
					view.removeChildNodes(setting, node);
					return nodes ? nodes : null;
				},
				removeNode : function(node, callbackFlag) {
					if (!node) return;
					callbackFlag = !!callbackFlag;
					if (callbackFlag && tools.apply(setting.callback.beforeRemove, [setting.treeId, node], true) == false) return;
					view.removeNode(setting, node);
					if (callbackFlag) {
						this.setting.treeObj.trigger(consts.event.REMOVE, [setting.treeId, node]);
					}
				},
				selectNode : function(node, addFlag, isSilent) {
					if (!node) return;
					if (tools.uCanDo(setting)) {
						addFlag = setting.view.selectedMulti && addFlag;
						if (node.parentTId) {
							view.expandCollapseParentNode(setting, node.getParentNode(), true, false, showNodeFocus);
						} else {
							try{$$(node, setting).focus().blur();}catch(e){}
						}
						view.selectNode(setting, node, addFlag);
					}

					function showNodeFocus() {
						if (isSilent) {
							return;
						}
						var a = $$(node, setting).get(0);
						view.scrollIntoView(a);
					}
				},
				transformTozTreeNodes : function(simpleNodes) {
					return data.transformTozTreeFormat(setting, simpleNodes);
				},
				transformToArray : function(nodes) {
					return data.transformToArrayFormat(setting, nodes);
				},
				updateNode : function(node, checkTypeFlag) {
					if (!node) return;
					var nObj = $$(node, setting);
					if (nObj.get(0) && tools.uCanDo(setting)) {
						view.setNodeName(setting, node);
						view.setNodeTarget(setting, node);
						view.setNodeUrl(setting, node);
						view.setNodeLineIcos(setting, node);
						view.setNodeFontCss(setting, node);
					}
				}
			}
			root.treeTools = zTreeTools;
			data.setZTreeTools(setting, zTreeTools);

			if (root[childKey] && root[childKey].length > 0) {
				view.createNodes(setting, 0, root[childKey], null, -1);
			} else if (setting.async.enable && setting.async.url && setting.async.url !== '') {
				view.asyncNode(setting);
			}
			return zTreeTools;
		}
	};

	var zt = $.fn.zTree,
	$$ = tools.$,
	consts = zt.consts;
})(jQuery);
/*
 * JQuery zTree excheck v3.5.23
 * http://zTree.me/
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Licensed same as jquery - MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * email: hunter.z@263.net
 * Date: 2016-04-01
 */
(function($){
	//default consts of excheck
	var _consts = {
		event: {
			CHECK: "ztree_check"
		},
		id: {
			CHECK: "_check"
		},
		checkbox: {
			STYLE: "checkbox",
			DEFAULT: "chk",
			DISABLED: "disable",
			FALSE: "false",
			TRUE: "true",
			FULL: "full",
			PART: "part",
			FOCUS: "focus"
		},
		radio: {
			STYLE: "radio",
			TYPE_ALL: "all",
			TYPE_LEVEL: "level"
		}
	},
	//default setting of excheck
	_setting = {
		check: {
			enable: false,
			autoCheckTrigger: false,
			chkStyle: _consts.checkbox.STYLE,
			nocheckInherit: false,
			chkDisabledInherit: false,
			radioType: _consts.radio.TYPE_LEVEL,
			chkboxType: {
				"Y": "ps",
				"N": "ps"
			}
		},
		data: {
			key: {
				checked: "checked"
			}
		},
		callback: {
			beforeCheck:null,
			onCheck:null
		}
	},
	//default root of excheck
	_initRoot = function (setting) {
		var r = data.getRoot(setting);
		r.radioCheckedList = [];
	},
	//default cache of excheck
	_initCache = function(treeId) {},
	//default bind event of excheck
	_bindEvent = function(setting) {
		var o = setting.treeObj,
		c = consts.event;
		o.bind(c.CHECK, function (event, srcEvent, treeId, node) {
			event.srcEvent = srcEvent;
			tools.apply(setting.callback.onCheck, [event, treeId, node]);
		});
	},
	_unbindEvent = function(setting) {
		var o = setting.treeObj,
		c = consts.event;
		o.unbind(c.CHECK);
	},
	//default event proxy of excheck
	_eventProxy = function(e) {
		var target = e.target,
		setting = data.getSetting(e.data.treeId),
		tId = "", node = null,
		nodeEventType = "", treeEventType = "",
		nodeEventCallback = null, treeEventCallback = null;

		if (tools.eqs(e.type, "mouseover")) {
			if (setting.check.enable && tools.eqs(target.tagName, "span") && target.getAttribute("treeNode"+ consts.id.CHECK) !== null) {
				tId = tools.getNodeMainDom(target).id;
				nodeEventType = "mouseoverCheck";
			}
		} else if (tools.eqs(e.type, "mouseout")) {
			if (setting.check.enable && tools.eqs(target.tagName, "span") && target.getAttribute("treeNode"+ consts.id.CHECK) !== null) {
				tId = tools.getNodeMainDom(target).id;
				nodeEventType = "mouseoutCheck";
			}
		} else if (tools.eqs(e.type, "click")) {
			if (setting.check.enable && tools.eqs(target.tagName, "span") && target.getAttribute("treeNode"+ consts.id.CHECK) !== null) {
				tId = tools.getNodeMainDom(target).id;
				nodeEventType = "checkNode";
			}
		}
		if (tId.length>0) {
			node = data.getNodeCache(setting, tId);
			switch (nodeEventType) {
				case "checkNode" :
					nodeEventCallback = _handler.onCheckNode;
					break;
				case "mouseoverCheck" :
					nodeEventCallback = _handler.onMouseoverCheck;
					break;
				case "mouseoutCheck" :
					nodeEventCallback = _handler.onMouseoutCheck;
					break;
			}
		}
		var proxyResult = {
			stop: nodeEventType === "checkNode",
			node: node,
			nodeEventType: nodeEventType,
			nodeEventCallback: nodeEventCallback,
			treeEventType: treeEventType,
			treeEventCallback: treeEventCallback
		};
		return proxyResult
	},
	//default init node of excheck
	_initNode = function(setting, level, n, parentNode, isFirstNode, isLastNode, openFlag) {
		if (!n) return;
		var checkedKey = setting.data.key.checked;
		if (typeof n[checkedKey] == "string") n[checkedKey] = tools.eqs(n[checkedKey], "true");
		n[checkedKey] = !!n[checkedKey];
		n.checkedOld = n[checkedKey];
		if (typeof n.nocheck == "string") n.nocheck = tools.eqs(n.nocheck, "true");
		n.nocheck = !!n.nocheck || (setting.check.nocheckInherit && parentNode && !!parentNode.nocheck);
		if (typeof n.chkDisabled == "string") n.chkDisabled = tools.eqs(n.chkDisabled, "true");
		n.chkDisabled = !!n.chkDisabled || (setting.check.chkDisabledInherit && parentNode && !!parentNode.chkDisabled);
		if (typeof n.halfCheck == "string") n.halfCheck = tools.eqs(n.halfCheck, "true");
		n.halfCheck = !!n.halfCheck;
		n.check_Child_State = -1;
		n.check_Focus = false;
		n.getCheckStatus = function() {return data.getCheckStatus(setting, n);};

		if (setting.check.chkStyle == consts.radio.STYLE && setting.check.radioType == consts.radio.TYPE_ALL && n[checkedKey] ) {
			var r = data.getRoot(setting);
			r.radioCheckedList.push(n);
		}
	},
	//add dom for check
	_beforeA = function(setting, node, html) {
		var checkedKey = setting.data.key.checked;
		if (setting.check.enable) {
			data.makeChkFlag(setting, node);
			html.push("<span ID='", node.tId, consts.id.CHECK, "' class='", view.makeChkClass(setting, node), "' treeNode", consts.id.CHECK, (node.nocheck === true?" style='display:none;'":""),"></span>");
		}
	},
	//update zTreeObj, add method of check
	_zTreeTools = function(setting, zTreeTools) {
		zTreeTools.checkNode = function(node, checked, checkTypeFlag, callbackFlag) {
			var checkedKey = this.setting.data.key.checked;
			if (node.chkDisabled === true) return;
			if (checked !== true && checked !== false) {
				checked = !node[checkedKey];
			}
			callbackFlag = !!callbackFlag;

			if (node[checkedKey] === checked && !checkTypeFlag) {
				return;
			} else if (callbackFlag && tools.apply(this.setting.callback.beforeCheck, [this.setting.treeId, node], true) == false) {
				return;
			}
			if (tools.uCanDo(this.setting) && this.setting.check.enable && node.nocheck !== true) {
				node[checkedKey] = checked;
				var checkObj = $$(node, consts.id.CHECK, this.setting);
				if (checkTypeFlag || this.setting.check.chkStyle === consts.radio.STYLE) view.checkNodeRelation(this.setting, node);
				view.setChkClass(this.setting, checkObj, node);
				view.repairParentChkClassWithSelf(this.setting, node);
				if (callbackFlag) {
					this.setting.treeObj.trigger(consts.event.CHECK, [null, this.setting.treeId, node]);
				}
			}
		}

		zTreeTools.checkAllNodes = function(checked) {
			view.repairAllChk(this.setting, !!checked);
		}

		zTreeTools.getCheckedNodes = function(checked) {
			var childKey = this.setting.data.key.children;
			checked = (checked !== false);
			return data.getTreeCheckedNodes(this.setting, data.getRoot(this.setting)[childKey], checked);
		}

		zTreeTools.getChangeCheckedNodes = function() {
			var childKey = this.setting.data.key.children;
			return data.getTreeChangeCheckedNodes(this.setting, data.getRoot(this.setting)[childKey]);
		}

		zTreeTools.setChkDisabled = function(node, disabled, inheritParent, inheritChildren) {
			disabled = !!disabled;
			inheritParent = !!inheritParent;
			inheritChildren = !!inheritChildren;
			view.repairSonChkDisabled(this.setting, node, disabled, inheritChildren);
			view.repairParentChkDisabled(this.setting, node.getParentNode(), disabled, inheritParent);
		}

		var _updateNode = zTreeTools.updateNode;
		zTreeTools.updateNode = function(node, checkTypeFlag) {
			if (_updateNode) _updateNode.apply(zTreeTools, arguments);
			if (!node || !this.setting.check.enable) return;
			var nObj = $$(node, this.setting);
			if (nObj.get(0) && tools.uCanDo(this.setting)) {
				var checkObj = $$(node, consts.id.CHECK, this.setting);
				if (checkTypeFlag == true || this.setting.check.chkStyle === consts.radio.STYLE) view.checkNodeRelation(this.setting, node);
				view.setChkClass(this.setting, checkObj, node);
				view.repairParentChkClassWithSelf(this.setting, node);
			}
		}
	},
	//method of operate data
	_data = {
		getRadioCheckedList: function(setting) {
			var checkedList = data.getRoot(setting).radioCheckedList;
			for (var i=0, j=checkedList.length; i<j; i++) {
				if(!data.getNodeCache(setting, checkedList[i].tId)) {
					checkedList.splice(i, 1);
					i--; j--;
				}
			}
			return checkedList;
		},
		getCheckStatus: function(setting, node) {
			if (!setting.check.enable || node.nocheck || node.chkDisabled) return null;
			var checkedKey = setting.data.key.checked,
			r = {
				checked: node[checkedKey],
				half: node.halfCheck ? node.halfCheck : (setting.check.chkStyle == consts.radio.STYLE ? (node.check_Child_State === 2) : (node[checkedKey] ? (node.check_Child_State > -1 && node.check_Child_State < 2) : (node.check_Child_State > 0)))
			};
			return r;
		},
		getTreeCheckedNodes: function(setting, nodes, checked, results) {
			if (!nodes) return [];
			var childKey = setting.data.key.children,
			checkedKey = setting.data.key.checked,
			onlyOne = (checked && setting.check.chkStyle == consts.radio.STYLE && setting.check.radioType == consts.radio.TYPE_ALL);
			results = !results ? [] : results;
			for (var i = 0, l = nodes.length; i < l; i++) {
				if (nodes[i].nocheck !== true && nodes[i].chkDisabled !== true && nodes[i][checkedKey] == checked) {
					results.push(nodes[i]);
					if(onlyOne) {
						break;
					}
				}
				data.getTreeCheckedNodes(setting, nodes[i][childKey], checked, results);
				if(onlyOne && results.length > 0) {
					break;
				}
			}
			return results;
		},
		getTreeChangeCheckedNodes: function(setting, nodes, results) {
			if (!nodes) return [];
			var childKey = setting.data.key.children,
			checkedKey = setting.data.key.checked;
			results = !results ? [] : results;
			for (var i = 0, l = nodes.length; i < l; i++) {
				if (nodes[i].nocheck !== true && nodes[i].chkDisabled !== true && nodes[i][checkedKey] != nodes[i].checkedOld) {
					results.push(nodes[i]);
				}
				data.getTreeChangeCheckedNodes(setting, nodes[i][childKey], results);
			}
			return results;
		},
		makeChkFlag: function(setting, node) {
			if (!node) return;
			var childKey = setting.data.key.children,
			checkedKey = setting.data.key.checked,
			chkFlag = -1;
			if (node[childKey]) {
				for (var i = 0, l = node[childKey].length; i < l; i++) {
					var cNode = node[childKey][i];
					var tmp = -1;
					if (setting.check.chkStyle == consts.radio.STYLE) {
						if (cNode.nocheck === true || cNode.chkDisabled === true) {
							tmp = cNode.check_Child_State;
						} else if (cNode.halfCheck === true) {
							tmp = 2;
						} else if (cNode[checkedKey]) {
							tmp = 2;
						} else {
							tmp = cNode.check_Child_State > 0 ? 2:0;
						}
						if (tmp == 2) {
							chkFlag = 2; break;
						} else if (tmp == 0){
							chkFlag = 0;
						}
					} else if (setting.check.chkStyle == consts.checkbox.STYLE) {
						if (cNode.nocheck === true || cNode.chkDisabled === true) {
							tmp = cNode.check_Child_State;
						} else if (cNode.halfCheck === true) {
							tmp = 1;
						} else if (cNode[checkedKey] ) {
							tmp = (cNode.check_Child_State === -1 || cNode.check_Child_State === 2) ? 2 : 1;
						} else {
							tmp = (cNode.check_Child_State > 0) ? 1 : 0;
						}
						if (tmp === 1) {
							chkFlag = 1; break;
						} else if (tmp === 2 && chkFlag > -1 && i > 0 && tmp !== chkFlag) {
							chkFlag = 1; break;
						} else if (chkFlag === 2 && tmp > -1 && tmp < 2) {
							chkFlag = 1; break;
						} else if (tmp > -1) {
							chkFlag = tmp;
						}
					}
				}
			}
			node.check_Child_State = chkFlag;
		}
	},
	//method of event proxy
	_event = {

	},
	//method of event handler
	_handler = {
		onCheckNode: function (event, node) {
			if (node.chkDisabled === true) return false;
			var setting = data.getSetting(event.data.treeId),
			checkedKey = setting.data.key.checked;
			if (tools.apply(setting.callback.beforeCheck, [setting.treeId, node], true) == false) return true;
			node[checkedKey] = !node[checkedKey];
			view.checkNodeRelation(setting, node);
			var checkObj = $$(node, consts.id.CHECK, setting);
			view.setChkClass(setting, checkObj, node);
			view.repairParentChkClassWithSelf(setting, node);
			setting.treeObj.trigger(consts.event.CHECK, [event, setting.treeId, node]);
			return true;
		},
		onMouseoverCheck: function(event, node) {
			if (node.chkDisabled === true) return false;
			var setting = data.getSetting(event.data.treeId),
			checkObj = $$(node, consts.id.CHECK, setting);
			node.check_Focus = true;
			view.setChkClass(setting, checkObj, node);
			return true;
		},
		onMouseoutCheck: function(event, node) {
			if (node.chkDisabled === true) return false;
			var setting = data.getSetting(event.data.treeId),
			checkObj = $$(node, consts.id.CHECK, setting);
			node.check_Focus = false;
			view.setChkClass(setting, checkObj, node);
			return true;
		}
	},
	//method of tools for zTree
	_tools = {

	},
	//method of operate ztree dom
	_view = {
		checkNodeRelation: function(setting, node) {
			var pNode, i, l,
			childKey = setting.data.key.children,
			checkedKey = setting.data.key.checked,
			r = consts.radio;
			if (setting.check.chkStyle == r.STYLE) {
				var checkedList = data.getRadioCheckedList(setting);
				if (node[checkedKey]) {
					if (setting.check.radioType == r.TYPE_ALL) {
						for (i = checkedList.length-1; i >= 0; i--) {
							pNode = checkedList[i];
							if (pNode[checkedKey] && pNode != node) {
								pNode[checkedKey] = false;
								checkedList.splice(i, 1);

								view.setChkClass(setting, $$(pNode, consts.id.CHECK, setting), pNode);
								if (pNode.parentTId != node.parentTId) {
									view.repairParentChkClassWithSelf(setting, pNode);
								}
							}
						}
						checkedList.push(node);
					} else {
						var parentNode = (node.parentTId) ? node.getParentNode() : data.getRoot(setting);
						for (i = 0, l = parentNode[childKey].length; i < l; i++) {
							pNode = parentNode[childKey][i];
							if (pNode[checkedKey] && pNode != node) {
								pNode[checkedKey] = false;
								view.setChkClass(setting, $$(pNode, consts.id.CHECK, setting), pNode);
							}
						}
					}
				} else if (setting.check.radioType == r.TYPE_ALL) {
					for (i = 0, l = checkedList.length; i < l; i++) {
						if (node == checkedList[i]) {
							checkedList.splice(i, 1);
							break;
						}
					}
				}

			} else {
				if (node[checkedKey] && (!node[childKey] || node[childKey].length==0 || setting.check.chkboxType.Y.indexOf("s") > -1)) {
					view.setSonNodeCheckBox(setting, node, true);
				}
				if (!node[checkedKey] && (!node[childKey] || node[childKey].length==0 || setting.check.chkboxType.N.indexOf("s") > -1)) {
					view.setSonNodeCheckBox(setting, node, false);
				}
				if (node[checkedKey] && setting.check.chkboxType.Y.indexOf("p") > -1) {
					view.setParentNodeCheckBox(setting, node, true);
				}
				if (!node[checkedKey] && setting.check.chkboxType.N.indexOf("p") > -1) {
					view.setParentNodeCheckBox(setting, node, false);
				}
			}
		},
		makeChkClass: function(setting, node) {
			var checkedKey = setting.data.key.checked,
			c = consts.checkbox, r = consts.radio,
			fullStyle = "";
			if (node.chkDisabled === true) {
				fullStyle = c.DISABLED;
			} else if (node.halfCheck) {
				fullStyle = c.PART;
			} else if (setting.check.chkStyle == r.STYLE) {
				fullStyle = (node.check_Child_State < 1)? c.FULL:c.PART;
			} else {
				fullStyle = node[checkedKey] ? ((node.check_Child_State === 2 || node.check_Child_State === -1) ? c.FULL:c.PART) : ((node.check_Child_State < 1)? c.FULL:c.PART);
			}
			var chkName = setting.check.chkStyle + "_" + (node[checkedKey] ? c.TRUE : c.FALSE) + "_" + fullStyle;
			chkName = (node.check_Focus && node.chkDisabled !== true) ? chkName + "_" + c.FOCUS : chkName;
			return consts.className.BUTTON + " " + c.DEFAULT + " " + chkName;
		},
		repairAllChk: function(setting, checked) {
			if (setting.check.enable && setting.check.chkStyle === consts.checkbox.STYLE) {
				var checkedKey = setting.data.key.checked,
				childKey = setting.data.key.children,
				root = data.getRoot(setting);
				for (var i = 0, l = root[childKey].length; i<l ; i++) {
					var node = root[childKey][i];
					if (node.nocheck !== true && node.chkDisabled !== true) {
						node[checkedKey] = checked;
					}
					view.setSonNodeCheckBox(setting, node, checked);
				}
			}
		},
		repairChkClass: function(setting, node) {
			if (!node) return;
			data.makeChkFlag(setting, node);
			if (node.nocheck !== true) {
				var checkObj = $$(node, consts.id.CHECK, setting);
				view.setChkClass(setting, checkObj, node);
			}
		},
		repairParentChkClass: function(setting, node) {
			if (!node || !node.parentTId) return;
			var pNode = node.getParentNode();
			view.repairChkClass(setting, pNode);
			view.repairParentChkClass(setting, pNode);
		},
		repairParentChkClassWithSelf: function(setting, node) {
			if (!node) return;
			var childKey = setting.data.key.children;
			if (node[childKey] && node[childKey].length > 0) {
				view.repairParentChkClass(setting, node[childKey][0]);
			} else {
				view.repairParentChkClass(setting, node);
			}
		},
		repairSonChkDisabled: function(setting, node, chkDisabled, inherit) {
			if (!node) return;
			var childKey = setting.data.key.children;
			if (node.chkDisabled != chkDisabled) {
				node.chkDisabled = chkDisabled;
			}
			view.repairChkClass(setting, node);
			if (node[childKey] && inherit) {
				for (var i = 0, l = node[childKey].length; i < l; i++) {
					var sNode = node[childKey][i];
					view.repairSonChkDisabled(setting, sNode, chkDisabled, inherit);
				}
			}
		},
		repairParentChkDisabled: function(setting, node, chkDisabled, inherit) {
			if (!node) return;
			if (node.chkDisabled != chkDisabled && inherit) {
				node.chkDisabled = chkDisabled;
			}
			view.repairChkClass(setting, node);
			view.repairParentChkDisabled(setting, node.getParentNode(), chkDisabled, inherit);
		},
		setChkClass: function(setting, obj, node) {
			if (!obj) return;
			if (node.nocheck === true) {
				obj.hide();
			} else {
				obj.show();
			}
            obj.attr('class', view.makeChkClass(setting, node));
		},
		setParentNodeCheckBox: function(setting, node, value, srcNode) {
			var childKey = setting.data.key.children,
			checkedKey = setting.data.key.checked,
			checkObj = $$(node, consts.id.CHECK, setting);
			if (!srcNode) srcNode = node;
			data.makeChkFlag(setting, node);
			if (node.nocheck !== true && node.chkDisabled !== true) {
				node[checkedKey] = value;
				view.setChkClass(setting, checkObj, node);
				if (setting.check.autoCheckTrigger && node != srcNode) {
					setting.treeObj.trigger(consts.event.CHECK, [null, setting.treeId, node]);
				}
			}
			if (node.parentTId) {
				var pSign = true;
				if (!value) {
					var pNodes = node.getParentNode()[childKey];
					for (var i = 0, l = pNodes.length; i < l; i++) {
						if ((pNodes[i].nocheck !== true && pNodes[i].chkDisabled !== true && pNodes[i][checkedKey])
						|| ((pNodes[i].nocheck === true || pNodes[i].chkDisabled === true) && pNodes[i].check_Child_State > 0)) {
							pSign = false;
							break;
						}
					}
				}
				if (pSign) {
					view.setParentNodeCheckBox(setting, node.getParentNode(), value, srcNode);
				}
			}
		},
		setSonNodeCheckBox: function(setting, node, value, srcNode) {
			if (!node) return;
			var childKey = setting.data.key.children,
			checkedKey = setting.data.key.checked,
			checkObj = $$(node, consts.id.CHECK, setting);
			if (!srcNode) srcNode = node;

			var hasDisable = false;
			if (node[childKey]) {
				for (var i = 0, l = node[childKey].length; i < l; i++) {
					var sNode = node[childKey][i];
					view.setSonNodeCheckBox(setting, sNode, value, srcNode);
					if (sNode.chkDisabled === true) hasDisable = true;
				}
			}

			if (node != data.getRoot(setting) && node.chkDisabled !== true) {
				if (hasDisable && node.nocheck !== true) {
					data.makeChkFlag(setting, node);
				}
				if (node.nocheck !== true && node.chkDisabled !== true) {
					node[checkedKey] = value;
					if (!hasDisable) node.check_Child_State = (node[childKey] && node[childKey].length > 0) ? (value ? 2 : 0) : -1;
				} else {
					node.check_Child_State = -1;
				}
				view.setChkClass(setting, checkObj, node);
				if (setting.check.autoCheckTrigger && node != srcNode && node.nocheck !== true && node.chkDisabled !== true) {
					setting.treeObj.trigger(consts.event.CHECK, [null, setting.treeId, node]);
				}
			}

		}
	},

	_z = {
		tools: _tools,
		view: _view,
		event: _event,
		data: _data
	};
	$.extend(true, $.fn.zTree.consts, _consts);
	$.extend(true, $.fn.zTree._z, _z);

	var zt = $.fn.zTree,
	tools = zt._z.tools,
	consts = zt.consts,
	view = zt._z.view,
	data = zt._z.data,
	event = zt._z.event,
	$$ = tools.$;

	data.exSetting(_setting);
	data.addInitBind(_bindEvent);
	data.addInitUnBind(_unbindEvent);
	data.addInitCache(_initCache);
	data.addInitNode(_initNode);
	data.addInitProxy(_eventProxy, true);
	data.addInitRoot(_initRoot);
	data.addBeforeA(_beforeA);
	data.addZTreeTools(_zTreeTools);

	var _createNodes = view.createNodes;
	view.createNodes = function(setting, level, nodes, parentNode, index) {
		if (_createNodes) _createNodes.apply(view, arguments);
		if (!nodes) return;
		view.repairParentChkClassWithSelf(setting, parentNode);
	}
	var _removeNode = view.removeNode;
	view.removeNode = function(setting, node) {
		var parentNode = node.getParentNode();
		if (_removeNode) _removeNode.apply(view, arguments);
		if (!node || !parentNode) return;
		view.repairChkClass(setting, parentNode);
		view.repairParentChkClass(setting, parentNode);
	}

	var _appendNodes = view.appendNodes;
	view.appendNodes = function(setting, level, nodes, parentNode, index, initFlag, openFlag) {
		var html = "";
		if (_appendNodes) {
			html = _appendNodes.apply(view, arguments);
		}
		if (parentNode) {
			data.makeChkFlag(setting, parentNode);
		}
		return html;
	}
})(jQuery);
/*
 * JQuery zTree exedit v3.5.23
 * http://zTree.me/
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Licensed same as jquery - MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * email: hunter.z@263.net
 * Date: 2016-04-01
 */
(function($){
	//default consts of exedit
	var _consts = {
		event: {
			DRAG: "ztree_drag",
			DROP: "ztree_drop",
			RENAME: "ztree_rename",
			DRAGMOVE:"ztree_dragmove"
		},
		id: {
			EDIT: "_edit",
			INPUT: "_input",
			REMOVE: "_remove"
		},
		move: {
			TYPE_INNER: "inner",
			TYPE_PREV: "prev",
			TYPE_NEXT: "next"
		},
		node: {
			CURSELECTED_EDIT: "curSelectedNode_Edit",
			TMPTARGET_TREE: "tmpTargetzTree",
			TMPTARGET_NODE: "tmpTargetNode"
		}
	},
	//default setting of exedit
	_setting = {
		edit: {
			enable: false,
			editNameSelectAll: false,
			showRemoveBtn: true,
			showRenameBtn: true,
			removeTitle: "remove",
			renameTitle: "rename",
			drag: {
				autoExpandTrigger: false,
				isCopy: true,
				isMove: true,
				prev: true,
				next: true,
				inner: true,
				minMoveSize: 5,
				borderMax: 10,
				borderMin: -5,
				maxShowNodeNum: 5,
				autoOpenTime: 500
			}
		},
		view: {
			addHoverDom: null,
			removeHoverDom: null
		},
		callback: {
			beforeDrag:null,
			beforeDragOpen:null,
			beforeDrop:null,
			beforeEditName:null,
			beforeRename:null,
			onDrag:null,
			onDragMove:null,
			onDrop:null,
			onRename:null
		}
	},
	//default root of exedit
	_initRoot = function (setting) {
		var r = data.getRoot(setting), rs = data.getRoots();
		r.curEditNode = null;
		r.curEditInput = null;
		r.curHoverNode = null;
		r.dragFlag = 0;
		r.dragNodeShowBefore = [];
		r.dragMaskList = new Array();
		rs.showHoverDom = true;
	},
	//default cache of exedit
	_initCache = function(treeId) {},
	//default bind event of exedit
	_bindEvent = function(setting) {
		var o = setting.treeObj;
		var c = consts.event;
		o.bind(c.RENAME, function (event, treeId, treeNode, isCancel) {
			tools.apply(setting.callback.onRename, [event, treeId, treeNode, isCancel]);
		});

		o.bind(c.DRAG, function (event, srcEvent, treeId, treeNodes) {
			tools.apply(setting.callback.onDrag, [srcEvent, treeId, treeNodes]);
		});

		o.bind(c.DRAGMOVE,function(event, srcEvent, treeId, treeNodes){
			tools.apply(setting.callback.onDragMove,[srcEvent, treeId, treeNodes]);
		});

		o.bind(c.DROP, function (event, srcEvent, treeId, treeNodes, targetNode, moveType, isCopy) {
			tools.apply(setting.callback.onDrop, [srcEvent, treeId, treeNodes, targetNode, moveType, isCopy]);
		});
	},
	_unbindEvent = function(setting) {
		var o = setting.treeObj;
		var c = consts.event;
		o.unbind(c.RENAME);
		o.unbind(c.DRAG);
		o.unbind(c.DRAGMOVE);
		o.unbind(c.DROP);
	},
	//default event proxy of exedit
	_eventProxy = function(e) {
		var target = e.target,
		setting = data.getSetting(e.data.treeId),
		relatedTarget = e.relatedTarget,
		tId = "", node = null,
		nodeEventType = "", treeEventType = "",
		nodeEventCallback = null, treeEventCallback = null,
		tmp = null;

		if (tools.eqs(e.type, "mouseover")) {
			tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
			if (tmp) {
				tId = tools.getNodeMainDom(tmp).id;
				nodeEventType = "hoverOverNode";
			}
		} else if (tools.eqs(e.type, "mouseout")) {
			tmp = tools.getMDom(setting, relatedTarget, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
			if (!tmp) {
				tId = "remove";
				nodeEventType = "hoverOutNode";
			}
		} else if (tools.eqs(e.type, "mousedown")) {
			tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
			if (tmp) {
				tId = tools.getNodeMainDom(tmp).id;
				nodeEventType = "mousedownNode";
			}
		}
		if (tId.length>0) {
			node = data.getNodeCache(setting, tId);
			switch (nodeEventType) {
				case "mousedownNode" :
					nodeEventCallback = _handler.onMousedownNode;
					break;
				case "hoverOverNode" :
					nodeEventCallback = _handler.onHoverOverNode;
					break;
				case "hoverOutNode" :
					nodeEventCallback = _handler.onHoverOutNode;
					break;
			}
		}
		var proxyResult = {
			stop: false,
			node: node,
			nodeEventType: nodeEventType,
			nodeEventCallback: nodeEventCallback,
			treeEventType: treeEventType,
			treeEventCallback: treeEventCallback
		};
		return proxyResult
	},
	//default init node of exedit
	_initNode = function(setting, level, n, parentNode, isFirstNode, isLastNode, openFlag) {
		if (!n) return;
		n.isHover = false;
		n.editNameFlag = false;
	},
	//update zTreeObj, add method of edit
	_zTreeTools = function(setting, zTreeTools) {
		zTreeTools.cancelEditName = function(newName) {
			var root = data.getRoot(this.setting);
			if (!root.curEditNode) return;
			view.cancelCurEditNode(this.setting, newName?newName:null, true);
		}
		zTreeTools.copyNode = function(targetNode, node, moveType, isSilent) {
			if (!node) return null;
			if (targetNode && !targetNode.isParent && this.setting.data.keep.leaf && moveType === consts.move.TYPE_INNER) return null;
			var _this = this,
				newNode = tools.clone(node);
			if (!targetNode) {
				targetNode = null;
				moveType = consts.move.TYPE_INNER;
			}
			if (moveType == consts.move.TYPE_INNER) {
				function copyCallback() {
					view.addNodes(_this.setting, targetNode, -1, [newNode], isSilent);
				}

				if (tools.canAsync(this.setting, targetNode)) {
					view.asyncNode(this.setting, targetNode, isSilent, copyCallback);
				} else {
					copyCallback();
				}
			} else {
				view.addNodes(this.setting, targetNode.parentNode, -1, [newNode], isSilent);
				view.moveNode(this.setting, targetNode, newNode, moveType, false, isSilent);
			}
			return newNode;
		}
		zTreeTools.editName = function(node) {
			if (!node || !node.tId || node !== data.getNodeCache(this.setting, node.tId)) return;
			if (node.parentTId) view.expandCollapseParentNode(this.setting, node.getParentNode(), true);
			view.editNode(this.setting, node)
		}
		zTreeTools.moveNode = function(targetNode, node, moveType, isSilent) {
			if (!node) return node;
			if (targetNode && !targetNode.isParent && this.setting.data.keep.leaf && moveType === consts.move.TYPE_INNER) {
				return null;
			} else if (targetNode && ((node.parentTId == targetNode.tId && moveType == consts.move.TYPE_INNER) || $$(node, this.setting).find("#" + targetNode.tId).length > 0)) {
				return null;
			} else if (!targetNode) {
				targetNode = null;
			}
			var _this = this;
			function moveCallback() {
				view.moveNode(_this.setting, targetNode, node, moveType, false, isSilent);
			}
			if (tools.canAsync(this.setting, targetNode) && moveType === consts.move.TYPE_INNER) {
				view.asyncNode(this.setting, targetNode, isSilent, moveCallback);
			} else {
				moveCallback();
			}
			return node;
		}
		zTreeTools.setEditable = function(editable) {
			this.setting.edit.enable = editable;
			return this.refresh();
		}
	},
	//method of operate data
	_data = {
		setSonNodeLevel: function(setting, parentNode, node) {
			if (!node) return;
			var childKey = setting.data.key.children;
			node.level = (parentNode)? parentNode.level + 1 : 0;
			if (!node[childKey]) return;
			for (var i = 0, l = node[childKey].length; i < l; i++) {
				if (node[childKey][i]) data.setSonNodeLevel(setting, node, node[childKey][i]);
			}
		}
	},
	//method of event proxy
	_event = {

	},
	//method of event handler
	_handler = {
		onHoverOverNode: function(event, node) {
			var setting = data.getSetting(event.data.treeId),
			root = data.getRoot(setting);
			if (root.curHoverNode != node) {
				_handler.onHoverOutNode(event);
			}
			root.curHoverNode = node;
			view.addHoverDom(setting, node);
		},
		onHoverOutNode: function(event, node) {
			var setting = data.getSetting(event.data.treeId),
			root = data.getRoot(setting);
			if (root.curHoverNode && !data.isSelectedNode(setting, root.curHoverNode)) {
				view.removeTreeDom(setting, root.curHoverNode);
				root.curHoverNode = null;
			}
		},
		onMousedownNode: function(eventMouseDown, _node) {
			var i,l,
			setting = data.getSetting(eventMouseDown.data.treeId),
			root = data.getRoot(setting), roots = data.getRoots();
			//right click can't drag & drop
			if (eventMouseDown.button == 2 || !setting.edit.enable || (!setting.edit.drag.isCopy && !setting.edit.drag.isMove)) return true;

			//input of edit node name can't drag & drop
			var target = eventMouseDown.target,
			_nodes = data.getRoot(setting).curSelectedList,
			nodes = [];
			if (!data.isSelectedNode(setting, _node)) {
				nodes = [_node];
			} else {
				for (i=0, l=_nodes.length; i<l; i++) {
					if (_nodes[i].editNameFlag && tools.eqs(target.tagName, "input") && target.getAttribute("treeNode"+consts.id.INPUT) !== null) {
						return true;
					}
					nodes.push(_nodes[i]);
					if (nodes[0].parentTId !== _nodes[i].parentTId) {
						nodes = [_node];
						break;
					}
				}
			}

			view.editNodeBlur = true;
			view.cancelCurEditNode(setting);

			var doc = $(setting.treeObj.get(0).ownerDocument),
			body = $(setting.treeObj.get(0).ownerDocument.body), curNode, tmpArrow, tmpTarget,
			isOtherTree = false,
			targetSetting = setting,
			sourceSetting = setting,
			preNode, nextNode,
			preTmpTargetNodeId = null,
			preTmpMoveType = null,
			tmpTargetNodeId = null,
			moveType = consts.move.TYPE_INNER,
			mouseDownX = eventMouseDown.clientX,
			mouseDownY = eventMouseDown.clientY,
			startTime = (new Date()).getTime();

			if (tools.uCanDo(setting)) {
				doc.bind("mousemove", _docMouseMove);
			}
			function _docMouseMove(event) {
				//avoid start drag after click node
				if (root.dragFlag == 0 && Math.abs(mouseDownX - event.clientX) < setting.edit.drag.minMoveSize
					&& Math.abs(mouseDownY - event.clientY) < setting.edit.drag.minMoveSize) {
					return true;
				}
				var i, l, tmpNode, tmpDom, tmpNodes,
				childKey = setting.data.key.children;
				body.css("cursor", "pointer");

				if (root.dragFlag == 0) {
					if (tools.apply(setting.callback.beforeDrag, [setting.treeId, nodes], true) == false) {
						_docMouseUp(event);
						return true;
					}

					for (i=0, l=nodes.length; i<l; i++) {
						if (i==0) {
							root.dragNodeShowBefore = [];
						}
						tmpNode = nodes[i];
						if (tmpNode.isParent && tmpNode.open) {
							view.expandCollapseNode(setting, tmpNode, !tmpNode.open);
							root.dragNodeShowBefore[tmpNode.tId] = true;
						} else {
							root.dragNodeShowBefore[tmpNode.tId] = false;
						}
					}

					root.dragFlag = 1;
					roots.showHoverDom = false;
					tools.showIfameMask(setting, true);

					//sort
					var isOrder = true, lastIndex = -1;
					if (nodes.length>1) {
						var pNodes = nodes[0].parentTId ? nodes[0].getParentNode()[childKey] : data.getNodes(setting);
						tmpNodes = [];
						for (i=0, l=pNodes.length; i<l; i++) {
							if (root.dragNodeShowBefore[pNodes[i].tId] !== undefined) {
								if (isOrder && lastIndex > -1 && (lastIndex+1) !== i) {
									isOrder = false;
								}
								tmpNodes.push(pNodes[i]);
								lastIndex = i;
							}
							if (nodes.length === tmpNodes.length) {
								nodes = tmpNodes;
								break;
							}
						}
					}
					if (isOrder) {
						preNode = nodes[0].getPreNode();
						nextNode = nodes[nodes.length-1].getNextNode();
					}

					//set node in selected
					curNode = $$("<ul class='zTreeDragUL'></ul>", setting);
					for (i=0, l=nodes.length; i<l; i++) {
						tmpNode = nodes[i];
						tmpNode.editNameFlag = false;
						view.selectNode(setting, tmpNode, i>0);
						view.removeTreeDom(setting, tmpNode);

						if (i > setting.edit.drag.maxShowNodeNum-1) {
							continue;
						}

						tmpDom = $$("<li id='"+ tmpNode.tId +"_tmp'></li>", setting);
						tmpDom.append($$(tmpNode, consts.id.A, setting).clone());
						tmpDom.css("padding", "0");
						tmpDom.children("#" + tmpNode.tId + consts.id.A).removeClass(consts.node.CURSELECTED);
						curNode.append(tmpDom);
						if (i == setting.edit.drag.maxShowNodeNum-1) {
							tmpDom = $$("<li id='"+ tmpNode.tId +"_moretmp'><a>  ...  </a></li>", setting);
							curNode.append(tmpDom);
						}
					}
					curNode.attr("id", nodes[0].tId + consts.id.UL + "_tmp");
					curNode.addClass(setting.treeObj.attr("class"));
					curNode.appendTo(body);

					tmpArrow = $$("<span class='tmpzTreeMove_arrow'></span>", setting);
					tmpArrow.attr("id", "zTreeMove_arrow_tmp");
					tmpArrow.appendTo(body);

					setting.treeObj.trigger(consts.event.DRAG, [event, setting.treeId, nodes]);
				}

				if (root.dragFlag == 1) {
					if (tmpTarget && tmpArrow.attr("id") == event.target.id && tmpTargetNodeId && (event.clientX + doc.scrollLeft()+2) > ($("#" + tmpTargetNodeId + consts.id.A, tmpTarget).offset().left)) {
						var xT = $("#" + tmpTargetNodeId + consts.id.A, tmpTarget);
						event.target = (xT.length > 0) ? xT.get(0) : event.target;
					} else if (tmpTarget) {
						tmpTarget.removeClass(consts.node.TMPTARGET_TREE);
						if (tmpTargetNodeId) $("#" + tmpTargetNodeId + consts.id.A, tmpTarget).removeClass(consts.node.TMPTARGET_NODE + "_" + consts.move.TYPE_PREV)
							.removeClass(consts.node.TMPTARGET_NODE + "_" + _consts.move.TYPE_NEXT).removeClass(consts.node.TMPTARGET_NODE + "_" + _consts.move.TYPE_INNER);
					}
					tmpTarget = null;
					tmpTargetNodeId = null;

					//judge drag & drop in multi ztree
					isOtherTree = false;
					targetSetting = setting;
					var settings = data.getSettings();
					for (var s in settings) {
						if (settings[s].treeId && settings[s].edit.enable && settings[s].treeId != setting.treeId
							&& (event.target.id == settings[s].treeId || $(event.target).parents("#" + settings[s].treeId).length>0)) {
							isOtherTree = true;
							targetSetting = settings[s];
						}
					}

					var docScrollTop = doc.scrollTop(),
					docScrollLeft = doc.scrollLeft(),
					treeOffset = targetSetting.treeObj.offset(),
					scrollHeight = targetSetting.treeObj.get(0).scrollHeight,
					scrollWidth = targetSetting.treeObj.get(0).scrollWidth,
					dTop = (event.clientY + docScrollTop - treeOffset.top),
					dBottom = (targetSetting.treeObj.height() + treeOffset.top - event.clientY - docScrollTop),
					dLeft = (event.clientX + docScrollLeft - treeOffset.left),
					dRight = (targetSetting.treeObj.width() + treeOffset.left - event.clientX - docScrollLeft),
					isTop = (dTop < setting.edit.drag.borderMax && dTop > setting.edit.drag.borderMin),
					isBottom = (dBottom < setting.edit.drag.borderMax && dBottom > setting.edit.drag.borderMin),
					isLeft = (dLeft < setting.edit.drag.borderMax && dLeft > setting.edit.drag.borderMin),
					isRight = (dRight < setting.edit.drag.borderMax && dRight > setting.edit.drag.borderMin),
					isTreeInner = dTop > setting.edit.drag.borderMin && dBottom > setting.edit.drag.borderMin && dLeft > setting.edit.drag.borderMin && dRight > setting.edit.drag.borderMin,
					isTreeTop = (isTop && targetSetting.treeObj.scrollTop() <= 0),
					isTreeBottom = (isBottom && (targetSetting.treeObj.scrollTop() + targetSetting.treeObj.height()+10) >= scrollHeight),
					isTreeLeft = (isLeft && targetSetting.treeObj.scrollLeft() <= 0),
					isTreeRight = (isRight && (targetSetting.treeObj.scrollLeft() + targetSetting.treeObj.width()+10) >= scrollWidth);

					if (event.target && tools.isChildOrSelf(event.target, targetSetting.treeId)) {
						//get node <li> dom
						var targetObj = event.target;
						while (targetObj && targetObj.tagName && !tools.eqs(targetObj.tagName, "li") && targetObj.id != targetSetting.treeId) {
							targetObj = targetObj.parentNode;
						}

						var canMove = true;
						//don't move to self or children of self
						for (i=0, l=nodes.length; i<l; i++) {
							tmpNode = nodes[i];
							if (targetObj.id === tmpNode.tId) {
								canMove = false;
								break;
							} else if ($$(tmpNode, setting).find("#" + targetObj.id).length > 0) {
								canMove = false;
								break;
							}
						}
						if (canMove && event.target && tools.isChildOrSelf(event.target, targetObj.id + consts.id.A)) {
							tmpTarget = $(targetObj);
							tmpTargetNodeId = targetObj.id;
						}
					}

					//the mouse must be in zTree
					tmpNode = nodes[0];
					if (isTreeInner && tools.isChildOrSelf(event.target, targetSetting.treeId)) {
						//judge mouse move in root of ztree
						if (!tmpTarget && (event.target.id == targetSetting.treeId || isTreeTop || isTreeBottom || isTreeLeft || isTreeRight) && (isOtherTree || (!isOtherTree && tmpNode.parentTId))) {
							tmpTarget = targetSetting.treeObj;
						}
						//auto scroll top
						if (isTop) {
							targetSetting.treeObj.scrollTop(targetSetting.treeObj.scrollTop()-10);
						} else if (isBottom)  {
							targetSetting.treeObj.scrollTop(targetSetting.treeObj.scrollTop()+10);
						}
						if (isLeft) {
							targetSetting.treeObj.scrollLeft(targetSetting.treeObj.scrollLeft()-10);
						} else if (isRight) {
							targetSetting.treeObj.scrollLeft(targetSetting.treeObj.scrollLeft()+10);
						}
						//auto scroll left
						if (tmpTarget && tmpTarget != targetSetting.treeObj && tmpTarget.offset().left < targetSetting.treeObj.offset().left) {
							targetSetting.treeObj.scrollLeft(targetSetting.treeObj.scrollLeft()+ tmpTarget.offset().left - targetSetting.treeObj.offset().left);
						}
					}

					curNode.css({
						"top": (event.clientY + docScrollTop + 3) + "px",
						"left": (event.clientX + docScrollLeft + 3) + "px"
					});

					var dX = 0;
					var dY = 0;
					if (tmpTarget && tmpTarget.attr("id")!=targetSetting.treeId) {
						var tmpTargetNode = tmpTargetNodeId == null ? null: data.getNodeCache(targetSetting, tmpTargetNodeId),
							isCopy = ((event.ctrlKey || event.metaKey) && setting.edit.drag.isMove && setting.edit.drag.isCopy) || (!setting.edit.drag.isMove && setting.edit.drag.isCopy),
							isPrev = !!(preNode && tmpTargetNodeId === preNode.tId),
							isNext = !!(nextNode && tmpTargetNodeId === nextNode.tId),
							isInner = (tmpNode.parentTId && tmpNode.parentTId == tmpTargetNodeId),
							canPrev = (isCopy || !isNext) && tools.apply(targetSetting.edit.drag.prev, [targetSetting.treeId, nodes, tmpTargetNode], !!targetSetting.edit.drag.prev),
							canNext = (isCopy || !isPrev) && tools.apply(targetSetting.edit.drag.next, [targetSetting.treeId, nodes, tmpTargetNode], !!targetSetting.edit.drag.next),
							canInner = (isCopy || !isInner) && !(targetSetting.data.keep.leaf && !tmpTargetNode.isParent) && tools.apply(targetSetting.edit.drag.inner, [targetSetting.treeId, nodes, tmpTargetNode], !!targetSetting.edit.drag.inner);

						function clearMove() {
							tmpTarget = null;
							tmpTargetNodeId = "";
							moveType = consts.move.TYPE_INNER;
							tmpArrow.css({
								"display":"none"
							});
							if (window.zTreeMoveTimer) {
								clearTimeout(window.zTreeMoveTimer);
								window.zTreeMoveTargetNodeTId = null
							}
						}
						if (!canPrev && !canNext && !canInner) {
							clearMove();
						} else {
							var tmpTargetA = $("#" + tmpTargetNodeId + consts.id.A, tmpTarget),
								tmpNextA = tmpTargetNode.isLastNode ? null : $("#" + tmpTargetNode.getNextNode().tId + consts.id.A, tmpTarget.next()),
								tmpTop = tmpTargetA.offset().top,
								tmpLeft = tmpTargetA.offset().left,
								prevPercent = canPrev ? (canInner ? 0.25 : (canNext ? 0.5 : 1) ) : -1,
								nextPercent = canNext ? (canInner ? 0.75 : (canPrev ? 0.5 : 0) ) : -1,
								dY_percent = (event.clientY + docScrollTop - tmpTop)/tmpTargetA.height();

							if ((prevPercent==1 || dY_percent<=prevPercent && dY_percent>=-.2) && canPrev) {
								dX = 1 - tmpArrow.width();
								dY = tmpTop - tmpArrow.height()/2;
								moveType = consts.move.TYPE_PREV;
							} else if ((nextPercent==0 || dY_percent>=nextPercent && dY_percent<=1.2) && canNext) {
								dX = 1 - tmpArrow.width();
								dY = (tmpNextA == null || (tmpTargetNode.isParent && tmpTargetNode.open)) ? (tmpTop + tmpTargetA.height() - tmpArrow.height()/2) : (tmpNextA.offset().top - tmpArrow.height()/2);
								moveType = consts.move.TYPE_NEXT;
							} else if (canInner) {
								dX = 5 - tmpArrow.width();
								dY = tmpTop;
								moveType = consts.move.TYPE_INNER;
							} else {
								clearMove();
							}

							if (tmpTarget) {
								tmpArrow.css({
									"display":"block",
									"top": dY + "px",
									"left": (tmpLeft + dX) + "px"
								});
								tmpTargetA.addClass(consts.node.TMPTARGET_NODE + "_" + moveType);

								if (preTmpTargetNodeId != tmpTargetNodeId || preTmpMoveType != moveType) {
									startTime = (new Date()).getTime();
								}
								if (tmpTargetNode && tmpTargetNode.isParent && moveType == consts.move.TYPE_INNER) {
									var startTimer = true;
									if (window.zTreeMoveTimer && window.zTreeMoveTargetNodeTId !== tmpTargetNode.tId) {
										clearTimeout(window.zTreeMoveTimer);
										window.zTreeMoveTargetNodeTId = null;
									} else if (window.zTreeMoveTimer && window.zTreeMoveTargetNodeTId === tmpTargetNode.tId) {
										startTimer = false;
									}
									if (startTimer) {
										window.zTreeMoveTimer = setTimeout(function() {
											if (moveType != consts.move.TYPE_INNER) return;
											if (tmpTargetNode && tmpTargetNode.isParent && !tmpTargetNode.open && (new Date()).getTime() - startTime > targetSetting.edit.drag.autoOpenTime
												&& tools.apply(targetSetting.callback.beforeDragOpen, [targetSetting.treeId, tmpTargetNode], true)) {
												view.switchNode(targetSetting, tmpTargetNode);
												if (targetSetting.edit.drag.autoExpandTrigger) {
													targetSetting.treeObj.trigger(consts.event.EXPAND, [targetSetting.treeId, tmpTargetNode]);
												}
											}
										}, targetSetting.edit.drag.autoOpenTime+50);
										window.zTreeMoveTargetNodeTId = tmpTargetNode.tId;
									}
								}
							}
						}
					} else {
						moveType = consts.move.TYPE_INNER;
						if (tmpTarget && tools.apply(targetSetting.edit.drag.inner, [targetSetting.treeId, nodes, null], !!targetSetting.edit.drag.inner)) {
							tmpTarget.addClass(consts.node.TMPTARGET_TREE);
						} else {
							tmpTarget = null;
						}
						tmpArrow.css({
							"display":"none"
						});
						if (window.zTreeMoveTimer) {
							clearTimeout(window.zTreeMoveTimer);
							window.zTreeMoveTargetNodeTId = null;
						}
					}
					preTmpTargetNodeId = tmpTargetNodeId;
					preTmpMoveType = moveType;

					setting.treeObj.trigger(consts.event.DRAGMOVE, [event, setting.treeId, nodes]);
				}
				return false;
			}

			doc.bind("mouseup", _docMouseUp);
			function _docMouseUp(event) {
				if (window.zTreeMoveTimer) {
					clearTimeout(window.zTreeMoveTimer);
					window.zTreeMoveTargetNodeTId = null;
				}
				preTmpTargetNodeId = null;
				preTmpMoveType = null;
				doc.unbind("mousemove", _docMouseMove);
				doc.unbind("mouseup", _docMouseUp);
				doc.unbind("selectstart", _docSelect);
				body.css("cursor", "auto");
				if (tmpTarget) {
					tmpTarget.removeClass(consts.node.TMPTARGET_TREE);
					if (tmpTargetNodeId) $("#" + tmpTargetNodeId + consts.id.A, tmpTarget).removeClass(consts.node.TMPTARGET_NODE + "_" + consts.move.TYPE_PREV)
							.removeClass(consts.node.TMPTARGET_NODE + "_" + _consts.move.TYPE_NEXT).removeClass(consts.node.TMPTARGET_NODE + "_" + _consts.move.TYPE_INNER);
				}
				tools.showIfameMask(setting, false);

				roots.showHoverDom = true;
				if (root.dragFlag == 0) return;
				root.dragFlag = 0;

				var i, l, tmpNode;
				for (i=0, l=nodes.length; i<l; i++) {
					tmpNode = nodes[i];
					if (tmpNode.isParent && root.dragNodeShowBefore[tmpNode.tId] && !tmpNode.open) {
						view.expandCollapseNode(setting, tmpNode, !tmpNode.open);
						delete root.dragNodeShowBefore[tmpNode.tId];
					}
				}

				if (curNode) curNode.remove();
				if (tmpArrow) tmpArrow.remove();

				var isCopy = ((event.ctrlKey || event.metaKey) && setting.edit.drag.isMove && setting.edit.drag.isCopy) || (!setting.edit.drag.isMove && setting.edit.drag.isCopy);
				if (!isCopy && tmpTarget && tmpTargetNodeId && nodes[0].parentTId && tmpTargetNodeId==nodes[0].parentTId && moveType == consts.move.TYPE_INNER) {
					tmpTarget = null;
				}
				if (tmpTarget) {
					var dragTargetNode = tmpTargetNodeId == null ? null: data.getNodeCache(targetSetting, tmpTargetNodeId);
					if (tools.apply(setting.callback.beforeDrop, [targetSetting.treeId, nodes, dragTargetNode, moveType, isCopy], true) == false) {
						view.selectNodes(sourceSetting, nodes);
						return;
					}
					var newNodes = isCopy ? tools.clone(nodes) : nodes;

					function dropCallback() {
						if (isOtherTree) {
							if (!isCopy) {
								for(var i=0, l=nodes.length; i<l; i++) {
									view.removeNode(setting, nodes[i]);
								}
							}
							if (moveType == consts.move.TYPE_INNER) {
								view.addNodes(targetSetting, dragTargetNode, -1, newNodes);
							} else {
								view.addNodes(targetSetting, dragTargetNode.getParentNode(), moveType == consts.move.TYPE_PREV ? dragTargetNode.getIndex() : dragTargetNode.getIndex()+1, newNodes);
							}
						} else {
							if (isCopy && moveType == consts.move.TYPE_INNER) {
								view.addNodes(targetSetting, dragTargetNode, -1, newNodes);
							} else if (isCopy) {
								view.addNodes(targetSetting, dragTargetNode.getParentNode(), moveType == consts.move.TYPE_PREV ? dragTargetNode.getIndex() : dragTargetNode.getIndex()+1, newNodes);
							} else {
								if (moveType != consts.move.TYPE_NEXT) {
									for (i=0, l=newNodes.length; i<l; i++) {
										view.moveNode(targetSetting, dragTargetNode, newNodes[i], moveType, false);
									}
								} else {
									for (i=-1, l=newNodes.length-1; i<l; l--) {
										view.moveNode(targetSetting, dragTargetNode, newNodes[l], moveType, false);
									}
								}
							}
						}
						view.selectNodes(targetSetting, newNodes);

						var a = $$(newNodes[0], setting).get(0);
						view.scrollIntoView(a);

						setting.treeObj.trigger(consts.event.DROP, [event, targetSetting.treeId, newNodes, dragTargetNode, moveType, isCopy]);
					}

					if (moveType == consts.move.TYPE_INNER && tools.canAsync(targetSetting, dragTargetNode)) {
						view.asyncNode(targetSetting, dragTargetNode, false, dropCallback);
					} else {
						dropCallback();
					}

				} else {
					view.selectNodes(sourceSetting, nodes);
					setting.treeObj.trigger(consts.event.DROP, [event, setting.treeId, nodes, null, null, null]);
				}
			}

			doc.bind("selectstart", _docSelect);
			function _docSelect() {
				return false;
			}

			//Avoid FireFox's Bug
			//If zTree Div CSS set 'overflow', so drag node outside of zTree, and event.target is error.
			if(eventMouseDown.preventDefault) {
				eventMouseDown.preventDefault();
			}
			return true;
		}
	},
	//method of tools for zTree
	_tools = {
		getAbs: function (obj) {
			var oRect = obj.getBoundingClientRect(),
			scrollTop = document.body.scrollTop+document.documentElement.scrollTop,
			scrollLeft = document.body.scrollLeft+document.documentElement.scrollLeft;
			return [oRect.left+scrollLeft,oRect.top+scrollTop];
		},
		inputFocus: function(inputObj) {
			if (inputObj.get(0)) {
				inputObj.focus();
				tools.setCursorPosition(inputObj.get(0), inputObj.val().length);
			}
		},
		inputSelect: function(inputObj) {
			if (inputObj.get(0)) {
				inputObj.focus();
				inputObj.select();
			}
		},
		setCursorPosition: function(obj, pos){
			if(obj.setSelectionRange) {
				obj.focus();
				obj.setSelectionRange(pos,pos);
			} else if (obj.createTextRange) {
				var range = obj.createTextRange();
				range.collapse(true);
				range.moveEnd('character', pos);
				range.moveStart('character', pos);
				range.select();
			}
		},
		showIfameMask: function(setting, showSign) {
			var root = data.getRoot(setting);
			//clear full mask
			while (root.dragMaskList.length > 0) {
				root.dragMaskList[0].remove();
				root.dragMaskList.shift();
			}
			if (showSign) {
				//show mask
				var iframeList = $$("iframe", setting);
				for (var i = 0, l = iframeList.length; i < l; i++) {
					var obj = iframeList.get(i),
					r = tools.getAbs(obj),
					dragMask = $$("<div id='zTreeMask_" + i + "' class='zTreeMask' style='top:" + r[1] + "px; left:" + r[0] + "px; width:" + obj.offsetWidth + "px; height:" + obj.offsetHeight + "px;'></div>", setting);
					dragMask.appendTo($$("body", setting));
					root.dragMaskList.push(dragMask);
				}
			}
		}
	},
	//method of operate ztree dom
	_view = {
		addEditBtn: function(setting, node) {
			if (node.editNameFlag || $$(node, consts.id.EDIT, setting).length > 0) {
				return;
			}
			if (!tools.apply(setting.edit.showRenameBtn, [setting.treeId, node], setting.edit.showRenameBtn)) {
				return;
			}
			var aObj = $$(node, consts.id.A, setting),
			editStr = "<span class='" + consts.className.BUTTON + " edit' id='" + node.tId + consts.id.EDIT + "' title='"+tools.apply(setting.edit.renameTitle, [setting.treeId, node], setting.edit.renameTitle)+"' treeNode"+consts.id.EDIT+" style='display:none;'></span>";
			aObj.append(editStr);

			$$(node, consts.id.EDIT, setting).bind('click',
				function() {
					if (!tools.uCanDo(setting) || tools.apply(setting.callback.beforeEditName, [setting.treeId, node], true) == false) return false;
					view.editNode(setting, node);
					return false;
				}
				).show();
		},
		addRemoveBtn: function(setting, node) {
			if (node.editNameFlag || $$(node, consts.id.REMOVE, setting).length > 0) {
				return;
			}
			if (!tools.apply(setting.edit.showRemoveBtn, [setting.treeId, node], setting.edit.showRemoveBtn)) {
				return;
			}
			var aObj = $$(node, consts.id.A, setting),
			removeStr = "<span class='" + consts.className.BUTTON + " remove' id='" + node.tId + consts.id.REMOVE + "' title='"+tools.apply(setting.edit.removeTitle, [setting.treeId, node], setting.edit.removeTitle)+"' treeNode"+consts.id.REMOVE+" style='display:none;'></span>";
			aObj.append(removeStr);

			$$(node, consts.id.REMOVE, setting).bind('click',
				function() {
					if (!tools.uCanDo(setting) || tools.apply(setting.callback.beforeRemove, [setting.treeId, node], true) == false) return false;
					view.removeNode(setting, node);
					setting.treeObj.trigger(consts.event.REMOVE, [setting.treeId, node]);
					return false;
				}
				).bind('mousedown',
				function(eventMouseDown) {
					return true;
				}
				).show();
		},
		addHoverDom: function(setting, node) {
			if (data.getRoots().showHoverDom) {
				node.isHover = true;
				if (setting.edit.enable) {
					view.addEditBtn(setting, node);
					view.addRemoveBtn(setting, node);
				}
				tools.apply(setting.view.addHoverDom, [setting.treeId, node]);
			}
		},
		cancelCurEditNode: function (setting, forceName, isCancel) {
			var root = data.getRoot(setting),
			nameKey = setting.data.key.name,
			node = root.curEditNode;

			if (node) {
				var inputObj = root.curEditInput,
				newName = forceName ? forceName:(isCancel ? node[nameKey]: inputObj.val());
				if (tools.apply(setting.callback.beforeRename, [setting.treeId, node, newName, isCancel], true) === false) {
					return false;
				}
                node[nameKey] = newName;
                var aObj = $$(node, consts.id.A, setting);
				aObj.removeClass(consts.node.CURSELECTED_EDIT);
				inputObj.unbind();
				view.setNodeName(setting, node);
				node.editNameFlag = false;
				root.curEditNode = null;
				root.curEditInput = null;
				view.selectNode(setting, node, false);
                setting.treeObj.trigger(consts.event.RENAME, [setting.treeId, node, isCancel]);
			}
			root.noSelection = true;
			return true;
		},
		editNode: function(setting, node) {
			var root = data.getRoot(setting);
			view.editNodeBlur = false;
			if (data.isSelectedNode(setting, node) && root.curEditNode == node && node.editNameFlag) {
				setTimeout(function() {tools.inputFocus(root.curEditInput);}, 0);
				return;
			}
			var nameKey = setting.data.key.name;
			node.editNameFlag = true;
			view.removeTreeDom(setting, node);
			view.cancelCurEditNode(setting);
			view.selectNode(setting, node, false);
			$$(node, consts.id.SPAN, setting).html("<input type=text class='rename' id='" + node.tId + consts.id.INPUT + "' treeNode" + consts.id.INPUT + " >");
			var inputObj = $$(node, consts.id.INPUT, setting);
			inputObj.attr("value", node[nameKey]);
			if (setting.edit.editNameSelectAll) {
				tools.inputSelect(inputObj);
			} else {
				tools.inputFocus(inputObj);
			}

			inputObj.bind('blur', function(event) {
				if (!view.editNodeBlur) {
					view.cancelCurEditNode(setting);
				}
			}).bind('keydown', function(event) {
				if (event.keyCode=="13") {
					view.editNodeBlur = true;
					view.cancelCurEditNode(setting);
				} else if (event.keyCode=="27") {
					view.cancelCurEditNode(setting, null, true);
				}
			}).bind('click', function(event) {
				return false;
			}).bind('dblclick', function(event) {
				return false;
			});

			$$(node, consts.id.A, setting).addClass(consts.node.CURSELECTED_EDIT);
			root.curEditInput = inputObj;
			root.noSelection = false;
			root.curEditNode = node;
		},
		moveNode: function(setting, targetNode, node, moveType, animateFlag, isSilent) {
			var root = data.getRoot(setting),
			childKey = setting.data.key.children;
			if (targetNode == node) return;
			if (setting.data.keep.leaf && targetNode && !targetNode.isParent && moveType == consts.move.TYPE_INNER) return;
			var oldParentNode = (node.parentTId ? node.getParentNode(): root),
			targetNodeIsRoot = (targetNode === null || targetNode == root);
			if (targetNodeIsRoot && targetNode === null) targetNode = root;
			if (targetNodeIsRoot) moveType = consts.move.TYPE_INNER;
			var targetParentNode = (targetNode.parentTId ? targetNode.getParentNode() : root);

			if (moveType != consts.move.TYPE_PREV && moveType != consts.move.TYPE_NEXT) {
				moveType = consts.move.TYPE_INNER;
			}

			if (moveType == consts.move.TYPE_INNER) {
				if (targetNodeIsRoot) {
					//parentTId of root node is null
					node.parentTId = null;
				} else {
					if (!targetNode.isParent) {
						targetNode.isParent = true;
						targetNode.open = !!targetNode.open;
						view.setNodeLineIcos(setting, targetNode);
					}
					node.parentTId = targetNode.tId;
				}
			}

			//move node Dom
			var targetObj, target_ulObj;
			if (targetNodeIsRoot) {
				targetObj = setting.treeObj;
				target_ulObj = targetObj;
			} else {
				if (!isSilent && moveType == consts.move.TYPE_INNER) {
					view.expandCollapseNode(setting, targetNode, true, false);
				} else if (!isSilent) {
					view.expandCollapseNode(setting, targetNode.getParentNode(), true, false);
				}
				targetObj = $$(targetNode, setting);
				target_ulObj = $$(targetNode, consts.id.UL, setting);
				if (!!targetObj.get(0) && !target_ulObj.get(0)) {
					var ulstr = [];
					view.makeUlHtml(setting, targetNode, ulstr, '');
					targetObj.append(ulstr.join(''));
				}
				target_ulObj = $$(targetNode, consts.id.UL, setting);
			}
			var nodeDom = $$(node, setting);
			if (!nodeDom.get(0)) {
				nodeDom = view.appendNodes(setting, node.level, [node], null, -1, false, true).join('');
			} else if (!targetObj.get(0)) {
				nodeDom.remove();
			}
			if (target_ulObj.get(0) && moveType == consts.move.TYPE_INNER) {
				target_ulObj.append(nodeDom);
			} else if (targetObj.get(0) && moveType == consts.move.TYPE_PREV) {
				targetObj.before(nodeDom);
			} else if (targetObj.get(0) && moveType == consts.move.TYPE_NEXT) {
				targetObj.after(nodeDom);
			}

			//repair the data after move
			var i,l,
			tmpSrcIndex = -1,
			tmpTargetIndex = 0,
			oldNeighbor = null,
			newNeighbor = null,
			oldLevel = node.level;
			if (node.isFirstNode) {
				tmpSrcIndex = 0;
				if (oldParentNode[childKey].length > 1 ) {
					oldNeighbor = oldParentNode[childKey][1];
					oldNeighbor.isFirstNode = true;
				}
			} else if (node.isLastNode) {
				tmpSrcIndex = oldParentNode[childKey].length -1;
				oldNeighbor = oldParentNode[childKey][tmpSrcIndex - 1];
				oldNeighbor.isLastNode = true;
			} else {
				for (i = 0, l = oldParentNode[childKey].length; i < l; i++) {
					if (oldParentNode[childKey][i].tId == node.tId) {
						tmpSrcIndex = i;
						break;
					}
				}
			}
			if (tmpSrcIndex >= 0) {
				oldParentNode[childKey].splice(tmpSrcIndex, 1);
			}
			if (moveType != consts.move.TYPE_INNER) {
				for (i = 0, l = targetParentNode[childKey].length; i < l; i++) {
					if (targetParentNode[childKey][i].tId == targetNode.tId) tmpTargetIndex = i;
				}
			}
			if (moveType == consts.move.TYPE_INNER) {
				if (!targetNode[childKey]) targetNode[childKey] = new Array();
				if (targetNode[childKey].length > 0) {
					newNeighbor = targetNode[childKey][targetNode[childKey].length - 1];
					newNeighbor.isLastNode = false;
				}
				targetNode[childKey].splice(targetNode[childKey].length, 0, node);
				node.isLastNode = true;
				node.isFirstNode = (targetNode[childKey].length == 1);
			} else if (targetNode.isFirstNode && moveType == consts.move.TYPE_PREV) {
				targetParentNode[childKey].splice(tmpTargetIndex, 0, node);
				newNeighbor = targetNode;
				newNeighbor.isFirstNode = false;
				node.parentTId = targetNode.parentTId;
				node.isFirstNode = true;
				node.isLastNode = false;

			} else if (targetNode.isLastNode && moveType == consts.move.TYPE_NEXT) {
				targetParentNode[childKey].splice(tmpTargetIndex + 1, 0, node);
				newNeighbor = targetNode;
				newNeighbor.isLastNode = false;
				node.parentTId = targetNode.parentTId;
				node.isFirstNode = false;
				node.isLastNode = true;

			} else {
				if (moveType == consts.move.TYPE_PREV) {
					targetParentNode[childKey].splice(tmpTargetIndex, 0, node);
				} else {
					targetParentNode[childKey].splice(tmpTargetIndex + 1, 0, node);
				}
				node.parentTId = targetNode.parentTId;
				node.isFirstNode = false;
				node.isLastNode = false;
			}
			data.fixPIdKeyValue(setting, node);
			data.setSonNodeLevel(setting, node.getParentNode(), node);

			//repair node what been moved
			view.setNodeLineIcos(setting, node);
			view.repairNodeLevelClass(setting, node, oldLevel)

			//repair node's old parentNode dom
			if (!setting.data.keep.parent && oldParentNode[childKey].length < 1) {
				//old parentNode has no child nodes
				oldParentNode.isParent = false;
				oldParentNode.open = false;
				var tmp_ulObj = $$(oldParentNode, consts.id.UL, setting),
				tmp_switchObj = $$(oldParentNode, consts.id.SWITCH, setting),
				tmp_icoObj = $$(oldParentNode, consts.id.ICON, setting);
				view.replaceSwitchClass(oldParentNode, tmp_switchObj, consts.folder.DOCU);
				view.replaceIcoClass(oldParentNode, tmp_icoObj, consts.folder.DOCU);
				tmp_ulObj.css("display", "none");

			} else if (oldNeighbor) {
				//old neigbor node
				view.setNodeLineIcos(setting, oldNeighbor);
			}

			//new neigbor node
			if (newNeighbor) {
				view.setNodeLineIcos(setting, newNeighbor);
			}

			//repair checkbox / radio
			if (!!setting.check && setting.check.enable && view.repairChkClass) {
				view.repairChkClass(setting, oldParentNode);
				view.repairParentChkClassWithSelf(setting, oldParentNode);
				if (oldParentNode != node.parent)
					view.repairParentChkClassWithSelf(setting, node);
			}

			//expand parents after move
			if (!isSilent) {
				view.expandCollapseParentNode(setting, node.getParentNode(), true, animateFlag);
			}
		},
		removeEditBtn: function(setting, node) {
			$$(node, consts.id.EDIT, setting).unbind().remove();
		},
		removeRemoveBtn: function(setting, node) {
			$$(node, consts.id.REMOVE, setting).unbind().remove();
		},
		removeTreeDom: function(setting, node) {
			node.isHover = false;
			view.removeEditBtn(setting, node);
			view.removeRemoveBtn(setting, node);
			tools.apply(setting.view.removeHoverDom, [setting.treeId, node]);
		},
		repairNodeLevelClass: function(setting, node, oldLevel) {
			if (oldLevel === node.level) return;
			var liObj = $$(node, setting),
			aObj = $$(node, consts.id.A, setting),
			ulObj = $$(node, consts.id.UL, setting),
			oldClass = consts.className.LEVEL + oldLevel,
			newClass = consts.className.LEVEL + node.level;
			liObj.removeClass(oldClass);
			liObj.addClass(newClass);
			aObj.removeClass(oldClass);
			aObj.addClass(newClass);
			ulObj.removeClass(oldClass);
			ulObj.addClass(newClass);
		},
		selectNodes : function(setting, nodes) {
			for (var i=0, l=nodes.length; i<l; i++) {
				view.selectNode(setting, nodes[i], i>0);
			}
		}
	},

	_z = {
		tools: _tools,
		view: _view,
		event: _event,
		data: _data
	};
	$.extend(true, $.fn.zTree.consts, _consts);
	$.extend(true, $.fn.zTree._z, _z);

	var zt = $.fn.zTree,
	tools = zt._z.tools,
	consts = zt.consts,
	view = zt._z.view,
	data = zt._z.data,
	event = zt._z.event,
	$$ = tools.$;

	data.exSetting(_setting);
	data.addInitBind(_bindEvent);
	data.addInitUnBind(_unbindEvent);
	data.addInitCache(_initCache);
	data.addInitNode(_initNode);
	data.addInitProxy(_eventProxy);
	data.addInitRoot(_initRoot);
	data.addZTreeTools(_zTreeTools);

	var _cancelPreSelectedNode = view.cancelPreSelectedNode;
	view.cancelPreSelectedNode = function (setting, node) {
		var list = data.getRoot(setting).curSelectedList;
		for (var i=0, j=list.length; i<j; i++) {
			if (!node || node === list[i]) {
				view.removeTreeDom(setting, list[i]);
				if (node) break;
			}
		}
		if (_cancelPreSelectedNode) _cancelPreSelectedNode.apply(view, arguments);
	}

	var _createNodes = view.createNodes;
	view.createNodes = function(setting, level, nodes, parentNode, index) {
		if (_createNodes) {
			_createNodes.apply(view, arguments);
		}
		if (!nodes) return;
		if (view.repairParentChkClassWithSelf) {
			view.repairParentChkClassWithSelf(setting, parentNode);
		}
	}

	var _makeNodeUrl = view.makeNodeUrl;
	view.makeNodeUrl = function(setting, node) {
		return setting.edit.enable ? null : (_makeNodeUrl.apply(view, arguments));
	}

	var _removeNode = view.removeNode;
	view.removeNode = function(setting, node) {
		var root = data.getRoot(setting);
		if (root.curEditNode === node) root.curEditNode = null;
		if (_removeNode) {
			_removeNode.apply(view, arguments);
		}
	}

	var _selectNode = view.selectNode;
	view.selectNode = function(setting, node, addFlag) {
		var root = data.getRoot(setting);
		if (data.isSelectedNode(setting, node) && root.curEditNode == node && node.editNameFlag) {
			return false;
		}
		if (_selectNode) _selectNode.apply(view, arguments);
		view.addHoverDom(setting, node);
		return true;
	}

	var _uCanDo = tools.uCanDo;
	tools.uCanDo = function(setting, e) {
		var root = data.getRoot(setting);
		if (e && (tools.eqs(e.type, "mouseover") || tools.eqs(e.type, "mouseout") || tools.eqs(e.type, "mousedown") || tools.eqs(e.type, "mouseup"))) {
			return true;
		}
		if (root.curEditNode) {
			view.editNodeBlur = false;
			root.curEditInput.focus();
		}
		return (!root.curEditNode) && (_uCanDo ? _uCanDo.apply(view, arguments) : true);
	}
})(jQuery);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./src/apps/iptalk/commander.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-fbed9b74\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/commander.vue")
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-fbed9b74\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/apps/iptalk/commander.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/commander.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-fbed9b74\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/commander.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-fbed9b74",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\iptalk\\commander.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] commander.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-fbed9b74", Component.options)
  } else {
    hotAPI.reload("data-v-fbed9b74", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/assets/css/sprite/images/sprite_common.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/sprite_common.ab0fe1.png";

/***/ }),

/***/ "./src/assets/css/sprite/images/sprite_restree.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/sprite_restree.8ee787.png";

/***/ }),

/***/ "./src/assets/css/sprite/restree.css":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./src/assets/css/sprite/restree.css");
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__("./node_modules/style-loader/lib/addStyles.js")(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!./restree.css", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!./restree.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/common/device.tree.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7416abd6\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/common/device.tree.vue")
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7416abd6\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/common/device.tree.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/common/device.tree.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-7416abd6\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/common/device.tree.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-7416abd6",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\common\\device.tree.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] device.tree.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7416abd6", Component.options)
  } else {
    hotAPI.reload("data-v-7416abd6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/components/grid.layout.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6e2a585c\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/grid.layout.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/components/grid.layout.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-6e2a585c\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/components/grid.layout.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\components\\grid.layout.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] grid.layout.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6e2a585c", Component.options)
  } else {
    hotAPI.reload("data-v-6e2a585c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/components/video.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7a48d305\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/video.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/components/video.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-7a48d305\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/components/video.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-7a48d305",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\components\\video.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] video.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7a48d305", Component.options)
  } else {
    hotAPI.reload("data-v-7a48d305", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/mixins/dnd.mixin.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var DnDMixin = {
	data: function data() {
		return {
			draggable: {
				enabled: true,
				selector: []
			},

			droppable: {
				enabled: true,
				selector: [],
				effect: "move"
			}
		};
	},

	methods: {
		onSetDragData: function onSetDragData(event) {},
		onDropComplate: function onDropComplate(event) {},
		_onDragStart: function _onDragStart(event) {
			var r = true;
			if (this.onDragstart) {
				r = this.onDragstart(event.originalEvent);
			}
			if (r !== false) {
				this.onSetDragData(event.originalEvent);
			}
		},
		_onDrag: function _onDrag(event) {
			if (this.onDrag) {
				this.onDrag(event.originalEvent);
			}
		},
		_onDragEnd: function _onDragEnd(event) {
			if (this.onDragend) {
				this.onDragend(event.originalEvent);
			}
		},
		_onDragenter: function _onDragenter(event) {
			var r = true;
			if (this.onDragenter) {
				r = this.onDragenter(event.originalEvent);
			}
			if (r !== false) {
				var dt = event.originalEvent.dataTransfer;
				dt.dropEffect = this.droppable.effect;
				var $TargerEle = $(event.target);
				if ($TargerEle.length > 0) {
					$TargerEle.addClass("dragenter");
				}
			}
		},
		_onDragleave: function _onDragleave(event) {
			var r = true;
			if (this.onDragleave) {
				r = this.onDragleave(event.originalEvent);
			}
			if (r !== false) {
				var $TargerEle = $(event.target);
				if ($TargerEle.length > 0) {
					$TargerEle.removeClass("dragenter");
				}
			}
		},
		_onDragover: function _onDragover(event) {
			var r = true;
			if (this.onDragover) {
				r = this.onDragover(event.originalEvent);
			}
			if (r !== false) {
				event.preventDefault();
			}
		},
		_onDrop: function _onDrop(event) {
			var r = true;
			if (this.onDrop) {
				this.onDrop(event.originalEvent);
			}
			if (r !== false) {
				var $TargerEle = $(event.target);
				if ($TargerEle.length > 0) {
					$TargerEle.removeClass("dragenter");
				}
				var oEvent = event.originalEvent;
				if (oEvent.dataTransfer.items == undefined) {
					oEvent.dataTransfer.items = [];
					for (var i = 0; i < oEvent.dataTransfer.types.length; i++) {
						oEvent.dataTransfer.items.push({ type: oEvent.dataTransfer.types[i] });
					}
				}
				this.onDropComplate(oEvent);
				event.preventDefault();
			}
		},
		dndSetElementDraggable: function dndSetElementDraggable(ele) {
			var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

			if (value) {
				$(ele).attr("draggable", value).on("dragstart", this._onDragStart).on("dragend", this._onDragEnd);
			} else {
				$(ele).removeAttr("draggable").off("dragstart dragend");
			}
		},
		dndSetElementDroppable: function dndSetElementDroppable(ele) {
			var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

			if (value) {
				$(ele).attr("droppable", value).on("dragenter", this._onDragenter).on("dragleave", this._onDragleave).on("dragover", this._onDragover).on("drop", this._onDrop);
			} else {
				$(ele).removeAttr("droppable").off("dragenter dragleave dragover drop");
			}
		},
		dndEnabled: function dndEnabled() {
			var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			if (typeof this.draggable.selector == "string") {
				this.dndSetElementDraggable($(this.$el).find(this.draggable.selector), value);
			} else {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = this.draggable.selector[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var sel = _step.value;

						this.dndSetElementDraggable($(this.$el).find(sel), value);
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}

				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = this.droppable.selector[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var _sel = _step2.value;

						this.dndSetElementDroppable($(this.$el).find(_sel), value);
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}
			}
		}
	},
	mounted: function mounted() {
		var _this = this;

		this.$nextTick(function () {
			_this.dndEnabled();
		});
	}
};

exports.default = DnDMixin;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.min.js")))

/***/ })

});