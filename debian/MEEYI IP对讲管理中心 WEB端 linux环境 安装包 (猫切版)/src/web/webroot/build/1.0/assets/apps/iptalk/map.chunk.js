webpackJsonp([99],{

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

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/map.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, $) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _axios = __webpack_require__("./node_modules/axios/index.js");

var _axios2 = _interopRequireDefault(_axios);

var _urls = __webpack_require__("./src/apps/iptalk/urls.js");

var urls = _interopRequireWildcard(_urls);

var _deviceTree = __webpack_require__("./src/common/device.tree.vue");

var _deviceTree2 = _interopRequireDefault(_deviceTree);

var _map = __webpack_require__("./src/components/richmap/map.vue");

var _map2 = _interopRequireDefault(_map);

var _dialog = __webpack_require__("./src/common/dialog.rich.js");

var _eventbus = __webpack_require__("./src/common/eventbus.js");

var _eventbus2 = _interopRequireDefault(_eventbus);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: { tree: _deviceTree2.default, bmap: _map2.default },
	mixins: [],
	data: function data() {
		return {
			urls: urls,
			treeId: 'device_tree_for_map',
			dimensions: [{
				type: "custom",
				name: L("所有设备", "iptalk"),
				expandLevel: 0
			}, {
				type: "new",
				name: L("新的设备", "iptalk"),
				expandLevel: 0
			}],
			devices: [],
			baiduMapMeta: {
				modes: {
					edit: true,
					draw: true
				},
				rightCorners: {
					search: true,
					config: true
				},
				itemOptions: {
					iptalk_host: {
						name: "iptalk_host",
						category: "iptalk_host",
						text: L("IPTALK主机", "iptalk"),
						icon: "drto-pad iconfont",
						anicolor: "blue",
						imgsrc: "/js/baidumapv2/images/iptalk_host_32.png",
						markerIcon: { url: "/js/baidumapv2/images/iptalk_host_16.png", size: [16, 16] },

						actions: []
					},
					iptalk_terminal: {
						name: "iptalk_terminal",
						category: "iptalk_terminal",
						text: L("IPTALK终端", "iptalk"),
						icon: "drto-panel iconfont",
						anicolor: "blue",
						imgsrc: "/js/baidumapv2/images/iptalk_terminal_32.png",
						markerIcon: { url: "/js/baidumapv2/images/iptalk_terminal_16.png", size: [16, 16] },

						actions: []
					},
					iptalk_speaker: {
						name: "iptalk_speaker",
						category: "iptalk_speaker",
						text: L("广播音柱", "iptalk"),
						icon: "drto-speaker iconfont",
						anicolor: "blue",
						imgsrc: "/js/baidumapv2/images/iptalk_speaker_32.png",
						markerIcon: { url: "/js/baidumapv2/images/iptalk_speaker_16.png", size: [16, 16] },

						actions: []
					},
					gk680_alarm: {
						name: "gk680_alarm",
						category: "gk680_alarm",
						text: L("汇防报警设备", "iptalk"),
						icon: "drto-gk680_alarm iconfont",
						anicolor: "blue",
						imgsrc: "/js/baidumapv2/images/gk680_alarm_32.png",
						markerIcon: { url: "/js/baidumapv2/images/gk680_alarm_16.png", size: [16, 16] },

						actions: []
					}
				},
				configItems: []
			},
			baiduMapData: {
				centerX: 118.62,
				centerY: 24.90,
				centerCity: "泉州",
				zoomScale: 17
			},

			dialogOptions: {
				title: "",
				fit: false,
				maxable: true,
				closeable: true,
				header: {
					visible: true
				},
				footer: {
					visible: false
				},
				popup: {
					enabled: false
				},

				width: '800px',
				height: '440px',
				moveable: true,
				resizable: true,
				dimmer: true,
				type: "vue",
				source: "apps/iptalk/map.form.async.vue",
				autoDestroy: true
			},
			dialogOnMap: {},
			dialogCloseButton: {},
			mapEventCallback: null,
			showMapTip: false,
			mapTip: "",
			currentAction: "",
			actDevicesId: [],
			devicesId: [],
			events: [],
			eventPointer: 0,
			eventShowInterval: null,
			eventShowTimeout: null,
			statusTranslate: {
				offline: L("离线", "iptalk"),
				online: L("在线", "iptalk"),
				alarm: L("告警", "iptalk"),
				call: L("呼叫", "iptalk"),
				view: L("监视", "iptalk"),
				listen: L("监听", "iptalk"),
				broadcast: L("广播", "iptalk"),
				speaking: L("通话中", "iptalk"),
				speakerBroadcast: L("广播中...", "iptalk") },
			destroyed: false
		};
	},

	props: {
		options: { type: Object, default: function _default() {} }
	},
	computed: {},
	methods: {
		init: function init() {
			var self = this;
			self.getDevices().then(function (devices) {
				self.devices = self.formatDevices(devices);
				self.processCallStack();
			});
			_eventbus2.default.$on("deviceEvent", self.onDeviceEvent);
		},
		processCallStack: function processCallStack() {
			for (var i = 0; i < global.callStack.length; i++) {
				var callEvent = global.callEventStack[i];
				if (callEvent) {
					this.onDeviceEvent(callEvent);
				}
			}
		},
		onDeviceEvent: function onDeviceEvent(event) {
			console.log("onDeviceEvent@map.vue:\n\tdestroyed:", this.destroyed);

			if (this.eventShowTimeout) {
				clearTimeout(this.eventShowTimeout);
				this.eventShowTimeout = null;
			}

			if (this.destroyed) {
				return;
			}
			if (!this.eventShowInterval) {
				this.events.push(event);
				this.StartShowEvents(event);
			} else {
				this.events.push(event);
			}
		},
		activeDevice: function activeDevice(fromDevice, eventAction, toDevice) {
			console.log("activeDevice@map.vue:\n\teventAction:", eventAction);
			var self = this;
			if (!eventAction) {
				self.$set(fromDevice, "label", fromDevice.name + "：" + L("未知状态", "iptalk"));
			}
			switch (eventAction) {
				case "offline":
					self.$set(fromDevice, "color", "light blue");
					self.$set(fromDevice, "active", false);
					self.$set(fromDevice, "label", fromDevice.name + "：" + L("离线", "iptalk"));
					break;
				case "online":
				case "endCall":
					self.$set(fromDevice, "color", "blue");
					self.$set(fromDevice, "active", false);
					self.$set(fromDevice, "label", fromDevice.name + "：" + L("在线", "iptalk"));
					break;
				case "alarm":
					self.$set(fromDevice, "color", "red");
					self.$set(fromDevice, "active", true);
					self.$set(fromDevice, "label", fromDevice.name + "：" + L("告警！", "iptalk"));
					break;
				case "call":
				case "view":
				case "listen":
				case "speakerBroadcast":
				case "broadcast":
					self.$set(fromDevice, "color", "blue");
					self.$set(fromDevice, "active", true);
					self.$set(fromDevice, "label", fromDevice.name + "：" + L(this.statusTranslate[eventAction]));
					break;
			}
			this.$set(fromDevice, "status", eventAction);
		},
		formatDeviceAction: function formatDeviceAction(_ref) {
			var deviceAction = _ref.deviceAction,
			    deviceActionNum = _ref.deviceActionNum,
			    calledID = _ref.calledID,
			    callCmd = _ref.callCmd;

			var formated;
			if (deviceAction === "deviceAction") {
				switch (deviceActionNum) {
					case 1:
						formated = "offline";break;
					case 4:
					case 2:
						formated = "online";break;
					case 3:
						formated = "speakerBroadcast";break;}
			} else if (deviceAction === "call") {
				if (callCmd !== 2 && callCmd !== 4) {
					deviceActionNum = 0;
				}
				switch (deviceActionNum) {
					case 0:
						formated = "online";break;
					case 1:
						formated = "call";break;
					case 2:
						formated = "view";break;
					case 3:
						formated = "listen";break;
					case 4:
						formated = "broadcast";break;}
			} else if (deviceAction === "gk680Alarm") {
				switch (deviceActionNum) {
					case 1:
						formated = "online";break;
					case 2:
						formated = "alarm";break;

				}
			} else {
				formated = deviceAction;
			}
			return formated;
		},
		getCalledDeviceByEvent: function getCalledDeviceByEvent() {
			return {};
		},
		StartShowEvents: function StartShowEvents(event) {
			var self = this;
			var showInterval = 1000;
			var showTimeout = 5000;

			var initEvent = self.events[0];
			self.eventShowInterval = setTimeout(function showNextEvent(event) {

				var event = self.events[self.eventPointer] || initEvent;

				if (event) {
					self.showEvent(event);
					self.eventPointer += 1;
				} else if (!self.eventShowTimeout) {
					self.eventShowTimeout = setTimeout(function () {
						self.stopShowEvent();
					}, showTimeout);
				}

				initEvent = null;

				self.eventShowInterval = setTimeout(function () {
					showNextEvent(event);
				}, showInterval);
			}, showInterval);
		},
		showEvent: function showEvent(event) {
			var fromDeviceIndex = this.devicesId.indexOf(event.DevID.toString());
			var fromDevice = this.devices[fromDeviceIndex];
			var toDevice = this.getCalledDeviceByEvent(event);
			if (event.Action !== "deviceAction" || event.ActionNum === 3) {
				this.panToDevice(fromDevice);
			}
			if (fromDevice) {
				var actionInfo = {
					deviceAction: event.Action,
					deviceActionNum: event.ActionNum,
					calledID: event.CalledID,
					callCmd: event.CallNum
				};
				console.log("showEvent@map.vue:\n\tactionInfo:", actionInfo);
				this.activeDevice(fromDevice, this.formatDeviceAction(actionInfo), toDevice);
			}
		},
		stopShowEvent: function stopShowEvent() {
			clearTimeout(this.eventShowInterval);
			this.eventShowInterval = null;
			this.events = [];
			this.eventPointer = 0;
		},
		enableRealTimeEventLocating: function enableRealTimeEventLocating(checked) {},
		getDevices: function getDevices() {
			return new Promise(function (resolve, reject) {
				_axios2.default.get(urls.getDevicesForMap).then(function (response) {
					if (response.data.status === "success") {
						resolve(response.data.result);
					} else if (response.data.status === "error") {
						reject(response.data.error);
					}
				}).catch(function (error) {
					reject(error);
				});
			});
		},
		formatDevices: function formatDevices(devices) {
			var _this = this;

			var formatedDevices = [];
			devices.forEach(function (device) {
				if (device.x && device.y) {
					_this.formatDevice(device);
					formatedDevices.push(device);
					_this.devicesId.push(device.id);
				}
			});
			return formatedDevices;
		},
		formatDevice: function formatDevice(device) {
			device.id = device.DevID;
			device.name = device.Alias || this.autoDeviceName(device);
			device.status = this.formatDeviceAction({ deviceAction: "deviceAction", deviceActionNum: device.DevStatus }) || device.status;
			device.label = device.name + "：" + this.statusTranslate[device.status];
			device.x = device.x ? parseFloat(device.x) : null;
			device.y = device.y ? parseFloat(device.y) : null;
			var deviceAdditionalInfo = this.getDeviceAdditionalInfo(device);
			device.type = deviceAdditionalInfo.type;
			device.imgsrc = deviceAdditionalInfo.imgsrc;
			device.color = deviceAdditionalInfo.color;
			device.active = deviceAdditionalInfo.active;
			return device;
		},
		autoDeviceName: function autoDeviceName(device) {
			var deviceNameMap = {
				iptalk_host: L("主机", "iptalk"),
				iptalk_terminal: L("终端", "iptalk")
			};
			var deviceType = this.getDeviceTypeById(device.DevID);
			return deviceNameMap[deviceType] + device.DevID;
		},
		getDeviceAdditionalInfo: function getDeviceAdditionalInfo(device) {
			var deviceAdditionalInfo = {};
			var deviceType = this.getDeviceTypeById(device.DevID);
			var colorPrefix = device.status === "offline" ? "light " : "";
			deviceAdditionalInfo.type = deviceType;
			deviceAdditionalInfo.imgsrc = this.baiduMapMeta.itemOptions[deviceType].imgsrc;
			deviceAdditionalInfo.color = colorPrefix + this.baiduMapMeta.itemOptions[deviceType].anicolor;
			deviceAdditionalInfo.active = false;
			return deviceAdditionalInfo;
		},
		createDialog: function createDialog(props) {
			this.dialogOnMap = new _dialog.RichDialog(this.dialogOptions, props);
		},
		listenDialogClose: function listenDialogClose() {
			this.dialogCloseButton = $(".rich-dialog-header > .menubar.right.menu > a[title=L('关闭')]");
			this.dialogCloseButton.addEventListener("click", this.onDialogClose);
		},
		onDialogClose: function onDialogClose() {
			if (this.mapEventCallback) {
				this.mapEventCallback("", "rejected");
				this.mapEventCallback = null;

				_eventbus2.default.$off("newItemsSuccess", self.newItemsSuccess);
				_eventbus2.default.$off("newItemsError", self.newItemsError);
			}
		},
		onViewItemsPropery: function onViewItemsPropery(event) {
			var self = this;
			var viewitem = event.targetItems[0];
			self.dialogOptions.title = L("设备属性", "iptalk");
			self.createDialog({ action: "view", targetDevice: viewitem, devices: self.devices });
			self.dialogOnMap.show();
		},
		onNewItems: function onNewItems(event) {
			var self = this;
			var newItem = event.context.newItems[0];
			self.mapEventCallback = event.callback;
			self.dialogOptions.title = L("新增设备", "iptalk");
			self.createDialog({ action: "add", targetDevice: newItem, devices: self.devices });
			self.dialogOnMap.show().then(function () {
				self.onDialogClose();
			});
			_eventbus2.default.$on("newItemsSuccess", self.newItemsSuccess);
			_eventbus2.default.$on("newItemsError", self.newItemsError);
		},
		newItemsSuccess: function newItemsSuccess(newDevice) {
			this.devices.push(this.formatDevice(newDevice));
			this.devicesId.push(newDevice.DevID);
			this.mapEventCallback("resolved", "continued");
			this.refreshTree();
		},
		newItemsError: function newItemsError(error) {
			this.mapEventCallback("rejected", "continued");
		},
		onModifyItems: function onModifyItems(event) {
			var self = this;
			var modItem = event.context.targetItems[0];
			self.mapEventCallback = event.callback;
			self.dialogOptions.title = L("修改设备", "iptalk");
			self.createDialog({ action: "mod", targetDevice: modItem, devices: self.devices });
			self.dialogOnMap.show().then(function () {
				self.onDialogClose();
			});
			_eventbus2.default.$on("modItemsSuccess", self.modItemsSuccess);
			_eventbus2.default.$on("modItemsError", self.modItemsError);
		},
		modItemsSuccess: function modItemsSuccess(modDevice) {
			var oldDevice = this.selectDeviceById(modDevice.DevID);
			this.setDevice(oldDevice, this.formatDevice(modDevice));
			this.mapEventCallback("resolved", "continued");
			this.refreshTree();
		},
		modItemsError: function modItemsError(error) {
			this.mapEventCallback("rejected", "continued");
		},
		selectDeviceById: function selectDeviceById(id) {
			return this.devices.filter(function (device) {
				return device.DevID === id;
			})[0];
		},
		getDeviceTypeById: function getDeviceTypeById(id) {
			if (id.length === 8 && id.startsWith("1")) {
				return "iptalk_terminal";
			} else if (id.length === 8 && id.startsWith("2")) {
				return "iptalk_host";
			} else if (id.length === 8 && id.startsWith("4")) {
				return "gk680_alarm";
			} else {
				return "iptalk_speaker";
			}
		},
		setDevice: function setDevice(oldDevice, newDevice) {
			for (var k in oldDevice) {
				this.$set(oldDevice, k, newDevice[k] || oldDevice[k]);
			}
		},
		onMoveItems: function onMoveItems(event) {
			var self = this;
			var movDevice = event.context.targetItems[0];
			self.mapEventCallback = event.callback;

			this.currentAction = "mov";
			if (true) {
				var confirmationContent = "是否保存设备位置到指定地点？";
				confirm(confirmationContent).then(function (reply) {
					var decision = reply.button.name;
					self.onActItemsConfirmed(decision, [movDevice]);
				});
			} else {
				var map = self.$refs.bmap.map;
				var point = new BMap.Point(movDevice.x, movDevice.y);
				var geoc = new BMap.Geocoder();
				geoc.getLocation(point, function (rs) {
					var addrComp = rs.addressComponents;
					var address = addrComp.province + ", " + addrComp.city + ", " + addrComp.district + ", " + addrComp.street + ", " + addrComp.streetNumber;
					address = address.replace(/((,\s){2,4})|((,\s$))/g, "") || L("指定地点", "iptalk");
					var confirmationContent = L("是否保存设备位置到\n" + address + "？", "iptalk");
					confirm(confirmationContent).then(function (reply) {
						var decision = reply.button.name;
						self.onActItemsConfirmed(decision, [movDevice]);
					});
				});
			}
		},
		onActItemsConfirmed: function onActItemsConfirmed(decision, actDevices) {
			this.actDevicesId = actDevices.map(function (device) {
				return device.id;
			});
			switch (decision) {
				case "ok":
					this.onActItemsSubmit(actDevices);
					break;
				case "cancel":
					this.onActItemsCancel(actDevices);
					break;
			}
		},
		onActItemsSubmit: function onActItemsSubmit(actDevices) {
			var self = this;
			var params = self.getActSubmitParams(actDevices);
			(0, _axios2.default)({
				method: this.currentAction === "del" ? "post" : "get",
				url: urls[this.currentAction + "DevicesByMap"],
				params: this.currentAction === "mov" ? params : {},
				data: this.currentAction === "del" ? params : {} }).then(function (response) {
				if (response.data.status === "success") {
					self.actItemsSuccess(response.data.result);
				} else if (response.data.status === "error") {
					self.actItemsError(response.data.error, actDevices);
				}
			}).catch(function (error) {
				self.actItemsError(error, actDevices);
			});
		},
		getActSubmitParams: function getActSubmitParams(actDevices) {
			var params = {};
			switch (this.currentAction) {
				case "mov":
					var actDevice = actDevices[0];
					params = {
						devid: actDevice.id,
						devalias: actDevice.name,
						x: this.currentAction === "del" ? "" : actDevice.x,
						y: this.currentAction === "del" ? "" : actDevice.y
					};
					break;
				case "del":
					var delDevIDs = this.actDevicesId;
					params = {
						devsid: delDevIDs
					};
					break;
			}
			return params;
		},
		onActItemsCancel: function onActItemsCancel(actDevices) {
			var reply = {
				unResolvedItemsId: this.actDevicesId
			};
			this.mapEventCallback(reply, "rejected");
			this.mapEventCallback = null;
		},
		actItemsSuccess: function actItemsSuccess(actDevices) {
			if (this.currentAction === "del") {
				this.removeItems(actDevices);
			}
			this.mapEventCallback("", "resolved");
			this.mapEventCallback = null;
			this.raiseMapTip(this.currentAction === "del" ? L("移除成功", "iptalk") : L("保存成功", "iptalk"));
		},
		actItemsError: function actItemsError(error, actDevices) {
			var reply = {
				unResolvedItemsId: this.actDevicesId
			};
			this.mapEventCallback(reply, "rejected");
			this.mapEventCallback = null;
			this.raiseMapTip(this.currentAction === "del" ? L("移除失败", "iptalk") : L("保存失败", "iptalk"));
		},
		onRemoveItems: function onRemoveItems(event) {
			var self = this;
			var delDevices = event.context.targetItems;
			self.mapEventCallback = event.callback;

			this.currentAction = "del";
			var confirmationContent = L("是否继续？移除操作不会真的删除设备，只是从地图上抹去。您可以通过新增设备来恢复。", "iptalk");
			confirm(confirmationContent).then(function (reply) {
				var decision = reply.button.name;
				self.onActItemsConfirmed(decision, delDevices);
			});
		},
		removeItems: function removeItems(actDevicesId) {
			var self = this;
			actDevicesId.forEach(function (actDeviceId) {
				var deviceIndex = self.devicesId.indexOf(actDeviceId);
				if (deviceIndex !== -1) {
					self.devices.splice(deviceIndex, 1);
					self.devicesId.splice(deviceIndex, 1);
				}
			});
		},
		onSearch: function onSearch(event) {
			var contentAsDeviceName = event.context.content;
			var resultAsDevice = this.searchEngine(contentAsDeviceName);
			if (resultAsDevice.length) {
				event.callback({
					point: {
						lng: resultAsDevice[0].x,
						lat: resultAsDevice[0].y
					}
				}, "resolved");
			} else {
				event.callback({
					error: L("没有搜索结果~", "iptalk")
				}, "rejected");
				this.raiseMapTip(L("没有搜索结果~", "iptalk"));
			}
		},
		searchEngine: function searchEngine(keyword) {
			var resultDevices = this.devices.filter(function (device) {
				return device.id.search(keyword) !== -1 || device.name.search(keyword) !== -1;
			});

			return resultDevices;
		},
		refreshTree: function refreshTree() {
			this.$refs.xmastree.init();
		},
		raiseMapTip: function raiseMapTip(tip) {
			this.mapTip = tip;
			this.showMapTip = true;
			var self = this;
			setTimeout(function () {
				self.showMapTip = false;
			}, 2000);
		},
		onTreeItemClick: function onTreeItemClick(event, treeId, treeNode) {
			var deviceIndex = this.devicesId.indexOf(treeNode.targetId);
			if (deviceIndex !== -1) {
				var device = this.devices[deviceIndex];
				var blink = true;
				this.panToDevice(device, blink);
			} else {
				this.raiseMapTip(L("设备尚未添加到地图", "iptalk"));
			}
		},
		panToDevice: function panToDevice(device, blink) {
			if (!device || !device.x || !device.y) {
				return;
			}
			var map = this.$refs.bmap.map;
			var point = new BMap.Point(device.x, device.y);
			map.panTo(point);
			blink && !device.active ? this.blinkDevice(device) : "";
		},
		blinkDevice: function blinkDevice(device) {
			var _this2 = this;

			this.$set(device, "active", true);
			setTimeout(function () {
				_this2.$set(device, "active", false);
			}, 750);
		},
		uuid: function uuid() {
			var d = new Date().getTime();
			var uuid = 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				var r = (d + Math.random() * 16) % 16 | 0;
				d = Math.floor(d / 16);
				return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
			});
			return uuid;
		}
	},
	created: function created() {},
	mounted: function mounted() {
		this.init();
	},
	destroyed: function destroyed() {
		this.destroyed = true;
	},
	beforeDestroy: function beforeDestroy() {
		_eventbus2.default.$off('deviceEvent', this.onDeviceEvent);
	}
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js"), __webpack_require__("./node_modules/jquery/dist/jquery.min.js")))

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

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/components/contextmenu.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _menubar = __webpack_require__("./src/components/menubar.vue");

var _menubar2 = _interopRequireDefault(_menubar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  components: { menubar: _menubar2.default },
  data: function data() {
    return {
      style: {}
    };
  },

  props: {
    show: { type: Boolean, default: false },
    event: { type: Object, default: function _default() {
        return {};
      } },
    items: { type: Array, default: function _default() {
        return [];
      } },
    eventHub: { type: String, default: '' },
    theme: { type: String, default: '' } },
  computed: {},
  watch: {
    show: function show(currShow, lastShow) {
      if (currShow) {
        this.draw();
      }
    }
  },
  methods: {
    draw: function draw() {
      this.style = {
        left: this.event.clientX + "px",
        top: this.event.clientY + "px"
      };
    },
    test: function test() {
      console.log("test");
    }
  },
  created: function created() {
    this.$watch("event.clientX", this.draw);
    this.$watch("event.clientY", this.draw);
  },
  mounted: function mounted() {}
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/components/richmap/map.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _vue = __webpack_require__("./node_modules/vue/dist/vue.min.js");

var _vue2 = _interopRequireDefault(_vue);

var _loadjs = __webpack_require__("./node_modules/loadjs/dist/loadjs.umd.js");

var _loadjs2 = _interopRequireDefault(_loadjs);

var _deepAssign = __webpack_require__("./node_modules/deep-assign/index.js");

var _deepAssign2 = _interopRequireDefault(_deepAssign);

__webpack_require__("./src/components/richmap/icons/iconfont.css");

var _menubar = __webpack_require__("./src/components/menubar.vue");

var _menubar2 = _interopRequireDefault(_menubar);

var _asyncloadvue = __webpack_require__("./src/common/asyncloadvue.js");

var _asyncloadvue2 = _interopRequireDefault(_asyncloadvue);

var _contextmenu = __webpack_require__("./src/components/contextmenu.vue");

var _contextmenu2 = _interopRequireDefault(_contextmenu);

var _MapEventManager = __webpack_require__("./src/components/richmap/MapEventManager.js");

var _MapEventManager2 = _interopRequireDefault(_MapEventManager);

var _dialog = __webpack_require__("./src/common/dialog.rich.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Menubar = _vue2.default.extend({
    ref: "menubar",
    components: { menubar: _menubar2.default },
    template: "<menubar :items=\"items\" :compact=\"true\" :eventHub=\"eventHub\"></menubar>",
    data: function data() {
        return {};
    },

    props: {
        items: { type: Array, default: function _default() {
                return [];
            } },
        eventHub: { type: String, default: "" }
    },
    methods: {
        init: function init() {
            var self = this;
            var intervalPolling = setInterval(function () {
                var $search = $("#map_search");
                if ($search) {
                    $search.bind("input", self.onSearchInput);
                    clearTimeout(intervalPolling);
                }
            }, 1);
        },
        onSearchInput: function onSearchInput(event) {
            var input = event.target.value;
            var start = input[0];
            var mode = "";
            var keyword = "";
            switch (start) {
                case ":":
                    mode = "itemSearch";
                    keyword = input.replace(/^:\s*/, "");
                    break;
                case ">":
                    mode = "locationSearch";
                    keyword = input.replace(/^>\s*/, "");
                    break;
                default:
                    mode = "mixSearch";
                    keyword = input;
                    break;
            }
            this.openSearch(mode, keyword);
        },
        openSearch: function openSearch(mode, keyword) {
            this.$parent.searchMode = mode;
            switch (mode) {
                case "itemSearch":
                    this.$parent.searchSource = this.items[1].options.source = this.$parent.itemSearchSuggestions;
                    break;
                case "locationSearch":
                case "mixSearch":
                    this.$parent.locationSearchSuggestions = [];
                    var self = this;
                    var local = new BMap.LocalSearch(this.$parent.map, {
                        onSearchComplete: function onSearchComplete() {
                            var results = local.getResults();
                            var numPois = results ? results.getNumPois() : 0;
                            for (var i = 0; i < numPois; i++) {
                                var poi = results.getPoi(i);
                                if (poi) {
                                    var suggestion = {
                                        title: ">" + poi.title,
                                        point: poi.point
                                    };
                                    self.$parent.locationSearchSuggestions.push(suggestion);
                                }
                            }
                            if (mode === "locationSearch") {
                                self.$parent.searchSource = self.items[1].options.source = self.$parent.locationSearchSuggestions;
                            } else if (mode === "mixSearch") {
                                self.$parent.searchSource = self.items[1].options.source = self.$parent.itemSearchSuggestions.concat(self.$parent.locationSearchSuggestions);
                            }
                        }
                    });
                    local.search(keyword);
                    break;
            }
        },
        closeSearch: function closeSearch(mode) {
            switch (mode) {
                case "itemSearch":
                    this.items[1].options.source = [];
                    break;
                case "locationSearch":
                case "mixSearch":
                    this.autoCompleter = null;
                    break;
            }
        }
    },
    computed: {},
    mounted: function mounted() {
        this.init();
    }
});

var Marker = _vue2.default.extend({
    ref: "marker",
    template: "\n            <div :class=\"item.status\">\n                <div :class=\"['baiduicon', item.color, { 'active': item.active }]\" \n                    :data-id=\"item.id\"\n                    @click.stop=\"onclick($event)\"\n                    @mousedown.stop=\"onmousedown($event)\"\n                    @mouseup.stop=\"onmouseup\"\n                    @contextmenu.stop.prevent=\"oncontextmenu($event)\"\n                >\n                    <img v-if=\"buffering\" :src=\"loadingImg\">\n                    <img :src=\"item.imgsrc\">\n                    <div :class=\"{ 'selected': selected }\"></div>\n                    <div class=\"waving\"></div>\n                    <div class=\"waving\"></div>\n                    <div class=\"waving\"></div>\n                </div><!--\n                <div :class=\"['pointer', item.color]\" :title=\"item.name\"></div>-->\n                <div class=\"ignored ui popup top left transition\">\n                    <div class=\"loadingtext\">\u6B63\u5728\u52A0\u8F7D\u4E2D...</div>\n                </div>\n            </div>\n        ",
    data: function data() {
        return {
            enableDragging: false,
            enableInfoWindow: true,
            pointOffset: {
                lat: 0,
                lng: 0
            },
            beforeMouseMove: true,
            loadingImg: __webpack_require__("./src/assets/images/loading.gif"),
            buffering: false,
            selected: false };
    },

    props: {
        item: { type: Object, default: function _default() {
                return {};
            } }
    },
    computed: {},
    methods: {
        onclick: function onclick(e) {
            this.$parent.showContextMenu = false;
            this.onselect(e);
            if (!this.item.isNewItem && this.$parent.baiduMapMeta.showInfoWindow) {
                this.$parent.onOpenInfoWindow(this.item);
            }
            this.$parent.setMenuItems();
        },
        onmousedown: function onmousedown(e) {
            var currentItem = this.$parent.getCurrentItem(e);

            this.enableDragging = currentItem.draggable;
            if (this.enableDragging) {
                this.startDragging();
            }
        },
        onmouseup: function onmouseup() {
            if (this.enableDragging) {
                this.enableDragging = false;
                this.endDragging();
            }
        },
        onmousemove: function onmousemove(e) {
            if (this.enableDragging) {
                this.onselect(e);
                var mkol = this.$parent.markerOverlays[this.item.id];
                var mk = mkol.marker;
                var ol = mkol.ol;
                if (this.beforeMouseMove) {
                    this.beforeMouseMove = false;
                    this.pointOffset.lng = e.point.lng - ol._point.lng;
                    this.pointOffset.lat = e.point.lat - ol._point.lat;
                } else {
                    var x = e.point.lng - this.pointOffset.lng;
                    var y = e.point.lat - this.pointOffset.lat;
                    this.$parent.setPosition(this.item, x, y);
                }
            }
        },
        oncontextmenu: function oncontextmenu(e) {
            this.mouseOnTarget = "marker";
            this.$parent.showContextMenu = true;
            this.$parent.contextmenuEvent = e;
            var currentItem = this.$parent.getCurrentItem(e);
            if (this.$parent.selectedItemsIdUnsorted.indexOf(currentItem.id) !== -1) {} else {
                this.onselect(e);
            }
            this.$parent.setMenuItems();
        },
        startDragging: function startDragging() {
            this.$parent.map.disableDragging();
            this.$parent.map.addEventListener("mousemove", this.onmousemove);
            this.enableInfoWindow = false;
        },
        endDragging: function endDragging() {
            this.$parent.map.enableDragging();
            this.$parent.map.removeEventListener("mousemove", this.onmousemove);
            this.enableInfoWindow = true;
            this.beforeMouseMove = true;
        },
        onselect: function onselect(e) {
            var currentItem = this.$parent.getCurrentItem(e);
            if (!currentItem || this.$parent.currentMode === "fenceRelateMode" && currentItem.isShape || this.$parent.currentMode === "fenceRelateMode" && currentItem.isNewItem) {
                    return;
                }

            this.currentShape = null;

            if (currentItem.isShape) {
                this.$parent.clearSelectedItems();
                this.$parent.mouseOnTarget = "shape";
                this.$parent.currentShape = currentItem;
                this.$parent.setSelectedShapes(this.$parent.currentShape, e.ctrlKey);
            } else {
                this.$parent.clearSelectedShapes();
                this.$parent.mouseOnTarget = "marker";
                this.$parent.currentItem = currentItem;
                this.$parent.setSelectedItems(this.$parent.currentItem, e.ctrlKey);
            }
        }
    },

    created: function created() {},
    mounted: function mounted() {}
});

_vue2.default.directive('menu', {
    inserted: function inserted(target) {
        target.oncontextmenu = function () {
            return false;
        };
    }
});

exports.default = {
    components: { menubar: _menubar2.default, contextmenu: _contextmenu2.default },
    mixins: [],
    data: function data() {
        return {
            events: {},

            map: {},
            mapEventManager: {},
            drawingManager: {},
            markerManager: {},
            markerClusterers: {},
            markerTool: {},
            GeoUtils: {},
            DistanceTool: {},
            menubarInst: {},
            topStatics: [{
                name: "locate",
                icon: "drto-locate iconfont",
                text: L("定位到"),
                showText: true,
                showArrow: false,
                color: "#000",
                tips: "",

                enabled: true,

                active: false,
                children: [{ name: "locate_mypos", text: L("我的位置"), icon: "drto-locate_mypos iconfont" }, { name: "locate_devicepos", text: L("选择设备"), icon: "drto-locate_devicepos iconfont" }]
            }, {
                type: "search",
                name: "search",
                icon: "drto-search iconfont",
                text: "",
                showText: true,
                showArrow: false,
                color: "#000",
                tips: "",

                enabled: true,

                active: false,
                right: true,
                id: "map_search",
                options: {
                    source: []
                }
            }, {
                name: "config",
                icon: "drto-config iconfont",
                text: "",
                showText: true,
                showArrow: false,
                color: "#000",
                tips: L("配置"),

                enabled: true,

                active: false,
                right: true,
                children: [{ name: "enableDisplayItemsLabel", text: L("显示标注名称"), icon: "drto-check iconfont", type: "checkbox", value: "checked" }]
            }, {
                name: "layer_device",
                icon: "drto-layer_device iconfont",
                text: "",
                showText: true,
                showArrow: false,
                color: "#000",
                tips: L("设备图层"),

                enabled: true,

                active: false,
                right: true,
                children: []
            }, {
                name: "toolbox",
                icon: "drto-toolbox iconfont",
                text: "",
                showText: true,
                showArrow: false,
                color: "#000",
                tips: L("工具"),

                enabled: true,

                active: false,
                right: true,
                children: [{ name: "measure", text: L("测距"), icon: "drto-measure iconfont" }, { name: "share", text: L("分享"), icon: "drto-share iconfont" }]
            }, {
                name: "collection",
                icon: "drto-collection iconfont",
                text: "",
                showText: true,
                showArrow: false,
                color: "#000",
                tips: L("收藏"),

                enabled: true,

                active: false,
                right: true,
                children: []
            }, {
                name: "refresh",
                icon: "drto-refresh iconfont",
                text: "",
                showText: true,
                showArrow: false,
                color: "#000",
                tips: L("刷新"),

                enabled: true,

                active: false,
                right: true
            }],
            rightStatics: [{
                name: "action",
                icon: "drto-action iconfont",
                text: L("动作"),
                showText: true,
                showArrow: false,
                color: "#000",
                tips: "",

                enabled: false,
                visible: false,

                active: false,
                children: []
            }, {
                name: "attribute",
                icon: "drto-attribute iconfont",
                text: L("属性"),
                showText: true,
                color: "#000",
                tips: "",

                enabled: false,

                active: false,
                visible: false
            }],
            toolOptions: {
                edit: {
                    name: "edit",
                    icon: "drto-edit iconfont",
                    text: L("编辑"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false
                },
                new: {
                    name: "new",
                    icon: "drto-new iconfont",
                    text: L("新增"),
                    showText: true,
                    showArrow: false,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false,
                    children: []
                },
                remove: {
                    name: "remove",
                    icon: "drto-remove iconfont",
                    text: L("移除"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false
                },
                modify: {
                    name: "modify",
                    icon: "drto-edit iconfont",
                    text: L("修改"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false
                },
                move: {
                    name: "move",
                    icon: "drto-move iconfont",
                    text: L("移动"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false
                },
                move_cancel: {
                    name: "move_cancel",
                    icon: "drto-cancel iconfont",
                    text: L("取消移动"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false,
                    visible: false
                },
                move_end: {
                    name: "move_end",
                    icon: "drto-check iconfont",
                    text: L("结束移动"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false,
                    visible: false
                },

                draw: {
                    name: "draw",
                    icon: "drto-shape iconfont",
                    text: L("绘制图形"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false
                },
                circle: {
                    name: "circle",
                    icon: "drto-circle iconfont",
                    text: L("圆形"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false
                },
                rectangle: {
                    name: "rectangle",
                    icon: "drto-rectangle iconfont",
                    text: L("矩形"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false
                },
                polygon: {
                    name: "polygon",
                    icon: "drto-polygon iconfont",
                    text: L("多边形"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false
                },
                mark: {
                    name: "mark",
                    icon: "drto-marker iconfont",
                    text: L("标注"),
                    showText: true,
                    showArrow: false,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false,
                    children: []
                },
                shape_edit: {
                    name: "shape_edit",
                    icon: "drto-shape_edit iconfont",
                    text: L("调整"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false
                },
                shape_remove: {
                    name: "shape_remove",
                    icon: "drto-remove iconfont",
                    text: L("移除"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false
                },
                shape_clear: {
                    name: "shape_clear",
                    icon: "drto-clear iconfont",
                    text: L("清空"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false
                },
                shape_edit_cancel: {
                    name: "shape_edit_cancel",
                    icon: "drto-cancel iconfont",
                    text: L("取消调整"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false
                },
                shape_edit_end: {
                    name: "shape_edit_end",
                    icon: "drto-check iconfont",
                    text: L("完成调整"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false
                },

                fence: {
                    name: "fence",
                    icon: "drto-fence iconfont",
                    text: L("电子围栏"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false
                },
                fence_show: {
                    name: "fence_show",
                    icon: "drto-show iconfont",
                    text: L("显示"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false,
                    visible: false
                },
                fence_hide: {
                    name: "fence_hide",
                    icon: "drto-hide iconfont",
                    text: L("隐藏"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false,
                    visible: false
                },
                fence_new: {
                    name: "fence_new",
                    icon: "drto-new iconfont",
                    text: L("新增"),
                    showText: true,
                    showArrow: false,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false,
                    children: [{
                        name: "circle",
                        icon: "drto-circle iconfont",
                        text: L("圆形围栏"),
                        showText: true,
                        color: "#000",
                        tips: "",

                        enabled: true,

                        active: false
                    }, {
                        name: "rectangle",
                        icon: "drto-rectangle iconfont",
                        text: L("矩形围栏"),
                        showText: true,
                        color: "#000",
                        tips: "",

                        enabled: true,

                        active: false
                    }, {
                        name: "polygon",
                        icon: "drto-polygon iconfont",
                        text: L("多边形围栏"),
                        showText: true,
                        color: "#000",
                        tips: "",

                        enabled: true,

                        active: false
                    }]
                },
                relate_in: {
                    name: "relate_in",
                    icon: "drto-in iconfont",
                    text: L("入围关联"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false
                },
                relate_out: {
                    name: "relate_out",
                    icon: "drto-out iconfont",
                    text: L("出围关联"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false
                },
                relate_end: {
                    name: "relate_end",
                    icon: "drto-check iconfont",
                    text: L("结束关联"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false
                },
                relate_cancel: {
                    name: "relate_cancel",
                    icon: "drto-cancel iconfont",
                    text: L("取消"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false
                },

                trace: {
                    name: "trace",
                    icon: "drto-trace iconfont",
                    text: L("轨迹"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false
                },
                trace_play: {
                    name: "trace_play",
                    icon: "drto-play iconfont",
                    text: L("播放"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false
                },
                trace_pause: {
                    name: "trace_pause",
                    icon: "drto-pause iconfont",
                    text: L("暂停"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false
                },

                track: {
                    name: "track",
                    icon: "drto-track iconfont",
                    text: L("跟踪"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false
                },
                track_start: {
                    name: "track_start",
                    icon: "drto-play iconfont",
                    text: L("开始"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false
                },
                track_stop: {
                    name: "track_stop",
                    icon: "drto-stop iconfont",
                    text: L("停止"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false
                },

                select: {
                    name: "select",
                    icon: "drto-select iconfont",
                    text: L("选取"),
                    showText: true,
                    showArrow: false,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false
                },
                cancel: {
                    name: "cancel",
                    icon: "drto-cancel iconfont",
                    text: L("取消"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false
                },
                attribute: {
                    name: "attribute",
                    icon: "drto-attribute iconfont",
                    text: L("属性"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false
                },
                find: {
                    name: "find",
                    icon: "drto-search iconfont",
                    text: L("查询周边"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false
                },

                exit: {
                    name: "exit",
                    icon: "drto-exit iconfont",
                    text: L("退出"),
                    showText: true,
                    color: "#000",
                    tips: "",

                    enabled: true,

                    active: false
                }
            },

            handlers: [{ name: "editHandler", users: ["edit", "new", "remove", "modify", "move", "move_cancel", "move_end"] }, {
                name: "drawingHandler",
                users: ["draw", "circle", "rectangle", "polygon", "mark", "select", "shape_edit", "shape_remove", "shape_clear", "shape_edit_cancel", "shape_edit_end", "fence_edit", "fence_delete"]
            }, { name: "fenceHandler", users: ["fence", "fence_new", "fence_show", "fence_hide", "fence_rename", "relate_in", "relate_out", "relate_end", "relate_cancel"] }, { name: "traceHandler", users: ["trace", "trace_play", "trace_pause"] }, { name: "trackHandler", users: ["track", "track_start", "track_stop"] }, { name: "locateHandler", users: ["locate_mypos", "locate_devicepos"] }, { name: "toolboxHandler", users: ["measure", "share"] }, { name: "refreshHandler", users: ["refresh"] }, { name: "configHandler", users: ["enableDisplayItemsLabel"] }, { name: "searchHandler", users: ["search"] }, { name: "selectHandler", users: ["single", "multi", "all", "invert"] }, { name: "clearHandler", users: ["clear"] }, { name: "cancelHandler", users: ["cancel"] }, { name: "deleteHandler", users: ["delete"] }, { name: "collectHandler", users: ["collect"] }, { name: "lockHandler", users: ["lock"] }, { name: "unlockHandler", users: ["unlock"] }, { name: "exitHandler", users: ["exit"] }, { name: "attributeHandler", users: ["attribute"] }],

            showContextMenu: false,
            contextmenuEvent: null,
            menubarItems: [],
            contextmenuItems: [],

            tempItems: [],
            selectedItemsId: {},
            selectedItemsIdUnsorted: [],
            currentItem: null,
            movingItems: {},
            bufferItemsId: [],
            bkupItemsPos: {},

            shapes: {},
            shapesId: [],
            currentShape: null,
            editingShapes: {},
            selectedShapes: [],
            selectedShapesId: [],
            bkupShapesPath: {},
            svgDom: null,
            rulerDom: null,

            tempFences: {},
            fenceEditing: false,
            fenceRelateMode: "",
            fenceTitleLabels: {},

            markerOverlays: {},
            modeNameCN: {
                defaultMode: "默认模式",
                editMode: "编辑模式",
                drawMode: "绘图模式",
                fenceMode: "围栏模式",
                traceMode: "轨迹模式",
                trackMode: "追踪模式"
            },
            labelColor: {
                blue: "#2185d0",
                red: "#db2828",
                "light blue": "#2185d0",
                "light red": "#db2828"
            },

            locatingMarker: null,

            trace: [],
            tracePlayingId: "",
            tracePlaying: false,
            tracePausing: false,
            playingProgress: 0,
            playingTraceItem: null,

            searchMode: "",
            searchSource: [],
            locationSearchSuggestions: [],

            loadingImg: __webpack_require__("./src/assets/images/loading.gif"),

            currentMode: "defaultMode",
            mouseOnTarget: "",
            selecting: false,
            showingFences: false,
            playingTrace: false,
            loadingMap: true,

            dialogOptions: {
                title: "选项",
                fit: false,
                maxable: true,
                closeable: true,
                header: {
                    visible: true
                },
                footer: {
                    visible: false
                },
                popup: {
                    enabled: false
                },

                width: '800px',
                height: '440px',
                moveable: true,
                resizable: true,
                dimmer: true,
                type: "vue",
                source: "components/richmap/map.form.async.vue",
                autoDestroy: true
            }
        };
    },

    props: {
        meta: { type: Object, default: function _default() {} },
        data: { type: Object, default: function _default() {} },
        items: { type: Object, default: function _default() {
                return [];
            } },
        fences: { type: Object, default: function _default() {} },
        QueryCommandEnable: { type: Function, default: null },
        offline: false
    },
    computed: {
        baiduMapMeta: function baiduMapMeta() {
            var baiduMapMeta = (0, _deepAssign2.default)({
                debug: false,
                apiKey: "8de0cddf67519eeb66e3886c4596365c",
                baiduMapAPI: "",
                baiduMapCSS: "",
                baiduMapPlugins: {
                    drawingManager: "http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager.js",
                    markerManager: "http://api.map.baidu.com/library/MarkerManager/1.2/src/MarkerManager_min.js",
                    textIconOverlay: "http://api.map.baidu.com/library/TextIconOverlay/1.2/src/TextIconOverlay_min.js",
                    markerClusterer: "http://api.map.baidu.com/library/MarkerClusterer/1.2/src/MarkerClusterer_min.js",
                    markerTool: "http://api.map.baidu.com/library/MarkerTool/1.2/src/MarkerTool_min.js",
                    GeoUtils: "http://api.map.baidu.com/library/GeoUtils/1.2/src/GeoUtils_min.js",
                    DistanceTool: "http://api.map.baidu.com/library/DistanceTool/1.2/src/DistanceTool_min.js"
                },
                urls: {
                    refresh: "http://"
                },
                id: this.generateUUID(),
                modes: {
                    edit: false,
                    draw: true,
                    fence: false,
                    trace: false,
                    track: false
                },
                rightCorners: {
                    search: false,
                    config: false,
                    layer_device: false,
                    toolbox: false,
                    collection: false,
                    refresh: false
                },

                mapControllers: {
                    Navigation: true,
                    Scale: true,
                    MapType: true,
                    OverviewMap: true,
                    CityList: true },
                drawingOpts: {
                    markerOptions: {},
                    circleOptions: { strokeWeight: 1 },
                    polylineOptions: { strokeWeight: 1 },
                    polygonOptions: { strokeWeight: 1 },
                    rectangleOptions: { strokeWeight: 1 } },
                markerOpts: {
                    enableDragging: true,
                    shadow: false,
                    minZoom: 12,
                    maxZoom: 19,
                    markerClustererOpts: {
                        markers: [],
                        girdSize: 60,
                        maxZoom: 12,
                        minClusterSize: 2,
                        isAverangeCenter: false },

                    followText: "",
                    autoClose: false,
                    showLabel: true
                },
                itemOptions: {},
                fenceOptions: {
                    showingFences: false
                },
                showInfoWindow: false,
                infoWindowContent: "",
                infoWindowOpts: {
                    width: 0,
                    height: 0,
                    maxWidth: 730,
                    offset: 0,
                    title: undefined,
                    enableAutoPan: true,
                    enableCloseOnClick: true,
                    enableMessage: true,
                    message: undefined },
                itemPropMapping: {
                    id: "id",
                    type: "type",
                    name: "name",
                    x: "x",
                    y: "y",
                    active: "active",
                    imgsrc: "imgsrc",
                    anicolor: "anicolor"
                },
                deviceActions: {},
                configItems: []
            }, this.meta);
            if (!baiduMapMeta.baiduMapAPI) {
                baiduMapMeta.baiduMapAPI = "http://api.map.baidu.com/api?v=2.0&ak=" + baiduMapMeta.apiKey + "&callback=BaiduMapCallback";
            }
            return baiduMapMeta;
        },
        baiduMapData: function baiduMapData() {
            return (0, _deepAssign2.default)({
                centerX: 118.62,
                centerY: 24.90,
                centerCity: "泉州",
                centerAuto: true,
                zoomScale: 5
            }, this.data);
        },
        markableItems: function markableItems() {
            var markableItems = [];
            for (var key in this.baiduMapMeta.itemOptions) {
                markableItems.push(this.baiduMapMeta.itemOptions[key]);
            }
            return markableItems;
        },
        itemSearchSuggestions: function itemSearchSuggestions() {
            var itemSearchSuggestions = [];
            this.items.map(function (item) {
                if (item.id === item.name) {
                    itemSearchSuggestions.push({
                        title: ":" + item.id,
                        point: new BMap.Point(item.x, item.y)
                    });
                } else {
                    itemSearchSuggestions.push({
                        title: ":" + item.id,
                        point: new BMap.Point(item.x, item.y)
                    }, {
                        title: ":" + item.name,
                        point: new BMap.Point(item.x, item.y)
                    });
                }
            });
            return itemSearchSuggestions;
        }
    },
    watch: {
        items: {
            handler: function handler(newItems, oldItems) {
                if (Object.keys(this.map).length) {
                    var self = this;
                    var newItemsDict = {};
                    newItems.forEach(function (newItem) {
                        if (!self.markerOverlays[newItem.id]) {
                            self.addMarkers(self.map, newItem);
                        } else if (self.markerOverlays[newItem.id].ol) {
                            var oldItem = self.markerOverlays[newItem.id].ol._markerInst.item;
                            self.setItem(newItem);
                            self.setPosition(newItem, newItem.x, newItem.y);
                            self.setLabelContent(newItem, newItem.label);
                        }

                        newItemsDict[newItem.id] = newItem.id;
                    });
                    for (var oldItemId in self.markerOverlays) {
                        var oldIsTemp = false;
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = self.tempItems[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var tempItem = _step.value;
                                if (tempItem.id === oldItemId) {
                                    oldIsTemp = true;break;
                                }
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

                        if (!newItemsDict[oldItemId] && !oldIsTemp) {
                            self.detachItems(oldItemId);
                        }
                    }
                }
            },
            deep: true
        },
        fences: {
            handler: function handler(newFences, oldFences) {
                this.debugValues("$watchFences", { newFences: newFences }, "shapes", "shapesId", "fences", "tempFences");
                if (Object.keys(this.map).length) {
                    var self = this;
                    for (var k in newFences) {
                        var newFence = newFences[k];
                        if (!this.shapes[newFences[k].shape.id]) {
                            self.addFences(newFence);
                        } else {
                            var oldFenceTitle = self.fenceTitleLabels[newFence.id].getContent();
                            if (oldFenceTitle !== newFence.title) {
                                self.setFenceTitle(newFence, newFence.title);
                                self.showFences(newFence.id, self.showingFences);
                                self.showFenceTitle(newFence.id, self.showingFences);
                            }
                        }
                    }
                    for (var shapeId in self.shapes) {
                        if (!self.fenceTitleLabels[shapeId]) {
                            var oldFenceId = "fence_" + shapeId;
                            if (!self.tempFences[oldFenceId]) {
                                self.detachFences(oldFenceId);
                            }
                        }
                    }
                }
            },
            deep: false
        }
    },
    methods: {
        test: function test() {
            console.log("test!");
        },
        notifyLoadStatus: function notifyLoadStatus(loadName) {
            var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "success";

            if (status === "success") {
                this.$set(window, loadName + "Success", true);
            } else {
                window[loadName + "Success"] = false;
            }
        },
        watchTrue: function watchTrue(prop, cb) {
            var stop;
            setTimeout(function t() {
                if (window[prop]) {
                    cb();
                } else if (!stop) {
                    setTimeout(t, 1);
                }
            }, 1000);
            setTimeout(function () {
                stop = true;
            }, 10000);
        },
        init: function init() {
            this.applyConfigs();
            this.initListeners();
            this.initMenubarItems();
        },
        initListeners: function initListeners() {
            this.$on("BMapMenuItemClick", function (item, $event) {
                this.BMapMenuItemClick(item, $event);
            });
            this.$on("menuItemEvent", function (item, $event) {
                this.BMapMenuItemClick(item, $event);
            });
        },
        initMenubarItems: function initMenubarItems() {
            var configItemBase = this.topStatics[2].children;
            var configableItems = configItemBase.slice(0, -1).concat(this.baiduMapMeta.configItems, configItemBase.slice(-1));
            this._bindDropdownChildren(configableItems, this.topStatics[2], "configHandler");
        },
        loadBaiduMap: function loadBaiduMap() {
            var self = this;

            if (!_loadjs2.default.isDefined('baidumap')) {
                if (self.offline || !navigator.onLine || self.baiduMapMeta.baiduMapAPI) {
                    self.watchTrue("BMapSuccess", function () {
                        self.initMap();
                    });

                    self.notifyLoadStatus("BMap", "loading");
                    (0, _loadjs2.default)(self.baiduMapMeta.baiduMapAPI, "baidumap", { success: function success() {
                            self.notifyLoadStatus("BMap", "success");
                        } });
                    (0, _loadjs2.default)(self.baiduMapMeta.baiduMapCSS);
                } else {
                    window.BaiduMapCallback = function () {
                        self.initMap();
                    };

                    self.notifyLoadStatus("BMap", "loading");
                    (0, _loadjs2.default)(self.baiduMapMeta.baiduMapAPI, "baidumap");
                }
            } else if (!window.BMapSuccess) {
                self.watchTrue("BMapSuccess", function () {
                    self.initMap();
                });
            } else {
                self.initMap();
            }
        },
        initMap: function initMap() {
            var _this = this;

            var mapOptions = { enableMapClick: false };
            var map = new BMap.Map(this.baiduMapMeta.id, mapOptions);
            this.map = map;

            this.addControllers(function () {
                var controllers = [];for (var k in _this.baiduMapMeta.mapControllers) {
                    if (_this.baiduMapMeta.mapControllers[k]) {
                        controllers.push(k);
                    }
                };return controllers;
            }());

            map.enableScrollWheelZoom(true);

            this.initMapCenterAndZoom(map);

            map.addEventListener("zoomend", this._reCalcMarkers);
            map.addEventListener("rightclick", this.oncontextmenu);

            window.addEventListener("resize", this.onWindowResize);

            this.addMarkers(map, this.items);
            this.initFences();
            this.addMenubar(map);

            this.mapEventManager = new _MapEventManager2.default(this);

            this.loadPlugins(this.getPluginList());
            this.setMenuItems();

            this.loadingMap = false;
        },
        initMapCenterAndZoom: function initMapCenterAndZoom(map) {
            var self = this;
            if (self.baiduMapData.centerAuto) {
                var autoCity = new BMap.LocalCity({ autoViewport: true });
                autoCity.get(function (r) {
                    map.centerAndZoom(r.center, self.baiduMapData.zoomScale);
                    map.setCurrentCity(r.name);
                });
            }
            map.centerAndZoom(new BMap.Point(self.baiduMapData.centerX, self.baiduMapData.centerY), self.baiduMapData.zoomScale);
            map.setCurrentCity(self.baiduMapData.centerCity);
        },
        addControllers: function addControllers(controllers) {
            var offset = new BMap.Size(10, 55);
            var controllersOpts = {
                Navigation: { offset: offset },
                Scale: {},
                MapType: { anchor: BMAP_ANCHOR_BOTTOM_RIGHT },
                OverviewMap: {},
                CityList: { anchor: BMAP_ANCHOR_TOP_RIGHT, offset: offset }
            };
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = controllers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var controller = _step2.value;

                    this.map.addControl(new BMap[controller + "Control"](controllersOpts[controller]));
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
        },
        onAddControl: function onAddControl(e) {
            var self = this;
            window.addEventListener("resize", function () {
                self.onWindowResize();
            });
            self.resizeMenubar();
        },
        onWindowResize: function onWindowResize() {
            this.resizeMenubar();
        },
        getPluginList: function getPluginList() {
            var pluginList = ["DistanceTool", "GeoUtils"];
            for (var modeName in this.baiduMapMeta.modes) {
                if (this.baiduMapMeta.modes[modeName]) {
                    switch (modeName) {
                        case "edit":
                            pluginList.push("drawingManager", "markerTool");break;
                        case "draw":
                            pluginList.push("drawingManager", "markerTool");break;
                        case "fence":
                            pluginList.push("drawingManager");break;
                    }
                }
            }
            return Array.from(new Set(pluginList));
        },
        loadPlugins: function loadPlugins(plugins) {
            console.log(this.baiduMapMeta.id + " --------  " + new Date() + "  --------");
            if (!Array.isArray(plugins)) {
                plugins ? [plugins] : [];
            }
            var self = this;
            var initPlugins = {};
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = plugins[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var plugin = _step3.value;

                    if (!_loadjs2.default.isDefined(plugin)) {
                        console.log(this.baiduMapMeta.id + " loading " + plugin);
                        self.notifyLoadStatus(plugin, "loading");(function (plugin) {
                            (0, _loadjs2.default)(self.baiduMapMeta.baiduMapPlugins[plugin], plugin, {
                                success: function success() {
                                    console.log(self.baiduMapMeta.id + " loading success " + plugin);
                                    self.notifyLoadStatus(plugin, "success");
                                    self.initPlugin(plugin);
                                },
                                error: function error() {
                                    console.error("Loading BaiduMap API Error:", self.baiduMapMeta.baiduMapPlugins[plugin]);
                                }
                            });
                        })(plugin);
                    } else if (!window[plugin + "Success"]) {
                        console.log(this.baiduMapMeta.id + " wait " + plugin);(function (plugin) {
                            self.watchTrue(plugin + "Success", function () {
                                console.log(self.baiduMapMeta.id + " loading success after wait " + plugin);
                                self.initPlugin(plugin);
                            });
                        })(plugin);
                    } else {
                        console.log(this.baiduMapMeta.id + " directly init " + plugin);
                        self.initPlugin(plugin);
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        },
        initPlugin: function initPlugin(pluginName) {
            console.log(this.baiduMapMeta.id + " init " + pluginName);
            this["init_" + pluginName]();
            this.setMenuItems();
        },
        init_drawingManager: function init_drawingManager() {
            var opts = {
                isOpen: true,
                enableDrawingTool: false,
                drawingToolOptions: {
                    anchor: BMAP_ANCHOR_TOP_LEFT,
                    offset: new BMap.Size(50, 50),
                    scale: 1,
                    drawingModes: [BMAP_DRAWING_MARKER, BMAP_DRAWING_CIRCLE, BMAP_DRAWING_POLYLINE, BMAP_DRAWING_POLYGON, BMAP_DRAWING_RECTANGLE],
                    enableCalculate: false },
                markerOptions: this.baiduMapMeta.drawingOpts.markerOptions,
                circleOptions: this.baiduMapMeta.drawingOpts.circleOptions,
                polylineOptions: this.baiduMapMeta.drawingOpts.polygonOptions,
                polygonOptions: this.baiduMapMeta.drawingOpts.polygonOptions,
                rectangleOptions: this.baiduMapMeta.drawingOpts.rectangleOptions };
            this.drawingManager = new BMapLib.DrawingManager(this.map, opts);
            this.drawingManager.close();
            this.drawingManager.addEventListener("overlaycomplete", this.onOverlayComplete);
        },
        init_markerTool: function init_markerTool() {
            var opts = {
                followText: this.baiduMapMeta.markerOpts.followText,
                autoClose: this.baiduMapMeta.markerOpts.autoClose };
            this.markerTool = new BMapLib.MarkerTool(this.map, opts);
            this.markerTool.addEventListener("markend", this.onMarkerEnd);
        },
        onMarkerEnd: function onMarkerEnd(event) {
            var self = this;

            var originalPixel = self.map.pointToPixel(event.marker.point);
            var correctedPixel = new BMap.Pixel(originalPixel.x, originalPixel.y + self.getOffsetTop(self.svgDom || self.rulerDom));
            var corrctedPoint = self.map.pixelToPoint(correctedPixel);
            event.marker.setPosition(corrctedPoint);

            var refItem = event.target._opts.icon.menubarClickedItem;
            var tempItemId = "newItem_" + self.generateUUID();
            var tempItem = {
                id: tempItemId,
                type: refItem.category,
                x: event.marker.point.lng,
                y: corrctedPoint.lat,
                imgsrc: refItem.imgsrc,
                color: refItem.anicolor,
                title: "未命名",
                isNewItem: true
            };
            if (self.currentMode === "drawMode") {
                tempItem.isShape = true;
            }
            self.tempItems.push(tempItem);

            self.addMarkers(self.map, tempItem);

            var mkol = self.markerOverlays[tempItem.id];

            event.target._map.addEventListener("mouseup", mkol.ol._markerInst.onmouseup);

            if (self.currentMode === "editMode") {
                self.map.removeOverlay(event.marker);

                self.bufferItems(tempItem.id, true);(function (tempItem) {
                    self.mapEventManager.mapEvent.emit("newItems", self.items, { newItems: [tempItem], currentMode: self.currentMode }, function (status, reply) {
                        if (status === "resolved" || status === "continued" || status === "rejected") {
                            self.detachItems(tempItem.id);
                            var itemIndex = self.itemIndex(self.tempItems, tempItem.id);
                            if (itemIndex) {
                                self.tempItems.splice(itemIndex, 1);
                            }
                        }
                        if (status !== "continued") {
                            tempItem = null;
                        }
                    });
                })(tempItem);
            } else {
                mkol.marker = event.marker;
                self.shapes[tempItem.id] = tempItem;
                self.shapesId.push(tempItem.id);
            }
        },
        init_GeoUtils: function init_GeoUtils() {
            this.GeoUtils = BMapLib.GeoUtils;
        },
        init_DistanceTool: function init_DistanceTool() {
            this.DistanceTool = new BMapLib.DistanceTool(this.map);
        },
        initFences: function initFences() {
            this.showingFences = this.baiduMapMeta.fenceOptions.showingFences;
            this.addFences(this.fences);
            this.$watch("baiduMapMeta.fenceOptions.showingFences", function () {
                this.showingFences = this.baiduMapMeta.fenceOptions.showingFences;
            });
        },
        onclick: function onclick(e) {
            if ((e.target.className === "BMap_mask" || e.target.nodeName === "svg") && !e.ctrlKey) {
                this.generallyCancel();
            }
            this.showContextMenu = false;
        },
        onmousehweel: function onmousehweel() {
            this.showContextMenu = false;
        },
        oncontextmenu: function oncontextmenu(e) {
            this.mouseOnTarget = "map";
            this.showContextMenu = true;
            this.contextmenuEvent = e;
            this.clearSelectedItems();
            this.setMenuItems();
        },
        onmouseup: function onmouseup() {
            for (var k in this.movingItems) {
                this.markerOverlays[this.movingItems[k].id].ol._markerInst.endDragging();
            }
        },

        setMenuItems: function setMenuItems() {
            var itemName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
            var prop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
            var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

            var menubarItems = this.genMenubarItems();
            var contextmenuItems = this.genContextmenuItems();
            var commandItems = menubarItems.concat(contextmenuItems);

            var queryResultExternal;
            var queryResultInternal;
            var queryResult;
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = commandItems[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var commandItem = _step4.value;

                    var commandName = commandItem.name;

                    queryResultExternal = null;
                    queryResultInternal = null;

                    if (this.QueryCommandEnable) {
                        queryResultExternal = this.QueryCommandEnable(commandName, this.currentMode);
                    }
                    queryResultInternal = this.QueryCommandEnableInternal(commandName, this.currentMode);

                    queryResult = null;
                    if (queryResultExternal || queryResultInternal) {
                        queryResult = (0, _deepAssign2.default)(queryResultExternal || {}, queryResultInternal);
                    }

                    if (queryResult) {
                        if (queryResult.enabled !== undefined && commandItem.enabled !== queryResult.enabled) {
                            this.$set(commandItem, "enabled", queryResult.enabled);
                        }
                        if (queryResult.visible !== undefined && commandItem.visible !== queryResult.visible) {
                            this.$set(commandItem, "visible", queryResult.visible);
                        }
                    }
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            if (itemName && prop) {
                this.$set(this.toolOptions[itemName], prop, value);
            }
            this.menubarInst.items = menubarItems;

            contextmenuItems = JSON.parse(JSON.stringify(contextmenuItems));var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = contextmenuItems[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var contextmenuItem = _step5.value;
                    contextmenuItem.showText = true;
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            this.$set(this, "contextmenuItems", contextmenuItems);

            this.resizeMenubar();
        },
        resizeMenubar: function resizeMenubar() {
            if (!$("menubar BMap_noprint anchorTL")) {
                return;
            }
            if (this.getMenubarWidth() > this.getMapWidth()) {
                this.hideAllMenubarText(true);
            } else {
                this.hideAllMenubarText(false);
                var self = this;
                this.$nextTick(function () {
                    if (self.getMenubarWidth() > self.getMapWidth()) {
                        self.hideAllMenubarText(true);
                    }
                });
            }
        },
        getMenubarWidth: function getMenubarWidth() {
            var menubarWidth = 0;
            var menubarItems = 0;
            try {
                menubarItems = $("#" + this.baiduMapMeta.id + " .menubar.BMap_noprint.anchorTL").get(0).children[0].children;
            } catch (e) {
                menubarItems = [];
            }
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = menubarItems[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var menubarItem = _step6.value;

                    if (Number.isInteger(parseInt(menubarItem.clientWidth))) {
                        menubarWidth += menubarItem.clientWidth;
                    }
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }

            return menubarWidth;
        },
        getMapWidth: function getMapWidth() {
            var mapWidth = 0;
            try {
                mapWidth = $("#" + this.baiduMapMeta.id + ".map.baidumap").get(0).clientWidth;
            } catch (e) {
                mapWidth = 0;
            }
            return mapWidth;
        },
        hideAllMenubarText: function hideAllMenubarText() {
            var hide = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            var items = this.menubarInst.items;
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = items[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var _item = _step7.value;

                    this.$set(_item, "showText", !hide);
                }
            } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                        _iterator7.return();
                    }
                } finally {
                    if (_didIteratorError7) {
                        throw _iteratorError7;
                    }
                }
            }
        },

        genMenubarItems: function genMenubarItems() {
            var menubarItems = JSON.parse(JSON.stringify(this.topStatics));
            var self = this;
            menubarItems.map(function (item) {
                item.visible = self.baiduMapMeta.rightCorners[item.name] === undefined ? true : self.baiduMapMeta.rightCorners[item.name];
            });
            var dynamicToolNames = [];

            if (this.mouseOnTarget === "marker") {
                switch (this.currentMode) {
                    case "defaultMode":
                        dynamicToolNames = ["select", "edit", "draw", "fence"];break;


                    case "editMode":
                        dynamicToolNames = ["select", "new", "remove", "modify", "move", "move_cancel", "move_end", "exit"];break;


                    case "drawMode":
                        dynamicToolNames = ["select"];break;


                    case "fenceMode":
                        dynamicToolNames = ["select", "trace_play", "trace_pause", "exit"];break;


                    case "fenceRelateMode":
                        dynamicToolNames = ["select", "relate_end", "relate_cancel"];break;

                    case "traceMode":
                        dynamicToolNames = ["select", "trace_play", "trace_pause", "exit"];break;


                    case "trackMode":
                        dynamicToolNames = ["select", "track_start", "track_stop", "exit"];break;
                }
            } else if (this.mouseOnTarget === "map") {
                switch (this.currentMode) {
                    case "defaultMode":
                        dynamicToolNames = ["select", "edit", "draw", "fence"];break;


                    case "editMode":
                        dynamicToolNames = ["select", "new", "move_cancel", "move_end", "exit"];break;


                    case "drawMode":
                        dynamicToolNames = ["select", "circle", "rectangle", "polygon", "mark", "shape_clear", "shape_edit", "shape_edit_end", "shape_edit_cancel", "exit"];break;


                    case "fenceMode":
                        dynamicToolNames = ["fence_new", "fence_show", "fence_hide", "shape_edit", "shape_edit_end", "shape_edit_cancel", "exit"];break;


                    case "fenceRelateMode":
                        dynamicToolNames = ["select", "relate_end", "relate_cancel"];break;

                    case "traceMode":
                        dynamicToolNames = ["select", "trace_play", "trace_pause", "exit"];break;


                    case "trackMode":
                        dynamicToolNames = ["select", "track_start", "track_stop", "exit"];break;
                }
            } else if (this.mouseOnTarget === "shape") {
                dynamicToolNames = ["shape_remove", "shape_edit", "shape_edit_end", "shape_edit_cancel"];
            } else if (this.mouseOnTarget === "fence") {
                if (this.currentMode === "fenceRelateMode") {
                    dynamicToolNames = ["select", "relate_end", "relate_cancel"];
                } else {
                    dynamicToolNames = ["shape_remove", "relate_in", "relate_out", "shape_clear", "shape_edit", "shape_edit_end", "shape_edit_cancel"];
                }
            } else {
                dynamicToolNames = ["select", "edit", "draw", "fence"];
            }

            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = dynamicToolNames[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var name = _step8.value;

                    var tool = this.toolOptions[name];
                    var children = this.markableItems;

                    if (name === "mark" || name === "new") {
                        this._bindDropdownChildren(children, tool, "markHandler");
                    } else if (name === "exit") {
                        tool.text = L("退出" + this.modeNameCN[this.currentMode]);
                    }

                    menubarItems.push(tool);
                }
            } catch (err) {
                _didIteratorError8 = true;
                _iteratorError8 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion8 && _iterator8.return) {
                        _iterator8.return();
                    }
                } finally {
                    if (_didIteratorError8) {
                        throw _iteratorError8;
                    }
                }
            }

            var rightResisdents = this.getRightResisdents();
            if (rightResisdents) {
                menubarItems = menubarItems.concat(rightResisdents);
            }

            return menubarItems;
        },
        genContextmenuItems: function genContextmenuItems() {
            var contextmenuItems = [];
            var dynamicToolNames = [];
            var rightResisdents = null;

            if (this.mouseOnTarget === "marker") {
                switch (this.currentMode) {
                    case "defaultMode":
                        dynamicToolNames = ["edit", "trace", "track"];break;


                    case "editMode":
                        dynamicToolNames = ["remove", "modify", "move", "move_cancel", "move_end"];break;


                    case "drawMode":
                        dynamicToolNames = [];break;


                    case "fenceMode":
                        dynamicToolNames = [];break;


                    case "fenceRelateMode":
                        dynamicToolNames = [];break;

                    case "traceMode":
                        dynamicToolNames = [];break;


                    case "trackMode":
                        dynamicToolNames = [];break;
                }
            } else if (this.mouseOnTarget === "map") {
                switch (this.currentMode) {
                    case "defaultMode":
                        dynamicToolNames = ["select", "edit", "draw", "fence"];break;


                    case "editMode":
                        dynamicToolNames = ["exit"];break;


                    case "drawMode":
                        dynamicToolNames = ["select", "circle", "rectangle", "polygon", "mark", "shape_clear", "exit"];break;


                    case "fenceMode":
                        dynamicToolNames = ["circle", "rectangle", "polygon", "fence_show", "fence_hide", "exit"];break;


                    case "fenceRelateMode":
                        dynamicToolNames = ["select", "relate_end", "relate_cancel"];break;

                    case "traceMode":
                        dynamicToolNames = ["select", "trace_play", "trace_pause", "exit"];break;


                    case "trackMode":
                        dynamicToolNames = ["select", "track_start", "track_stop", "exit"];break;
                }
            } else if (this.mouseOnTarget === "shape") {
                dynamicToolNames = ["shape_edit", "shape_remove"];
            }

            var _iteratorNormalCompletion9 = true;
            var _didIteratorError9 = false;
            var _iteratorError9 = undefined;

            try {
                for (var _iterator9 = dynamicToolNames[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                    var name = _step9.value;

                    var tool = this.toolOptions[name];
                    contextmenuItems.push(tool);
                }
            } catch (err) {
                _didIteratorError9 = true;
                _iteratorError9 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion9 && _iterator9.return) {
                        _iterator9.return();
                    }
                } finally {
                    if (_didIteratorError9) {
                        throw _iteratorError9;
                    }
                }
            }

            rightResisdents = this.getRightResisdents();
            if (rightResisdents) {
                contextmenuItems = contextmenuItems.concat(rightResisdents);
            }

            return contextmenuItems;
        },
        getRightResisdents: function getRightResisdents() {
            var rightResisdents = null;

            var commonType = null;
            var count = 0;
            for (var commonType in this.selectedItemsId) {
                if (count === 1) {
                    commonType = null;break;
                }
                count++;
            }

            rightResisdents = JSON.parse(JSON.stringify(this.rightStatics));
            var actionsDropdown = rightResisdents[0];

            actionsDropdown.enable = false;
            if (commonType) {
                if (this.baiduMapMeta.itemOptions[commonType].actions) {
                    if (this.baiduMapMeta.itemOptions[commonType].actions.length) {
                        actionsDropdown.enable = true;
                    }
                }
            }
            actionsDropdown.visible = this.mouseOnTarget === "marker";

            if (actionsDropdown.enable) {
                actionsDropdown.children = this.baiduMapMeta.itemOptions[commonType].actions;

                if (actionsDropdown.children) {
                    var users = [];
                    for (var j = 0; j < actionsDropdown.children.length; j++) {
                        users.push(actionsDropdown.children[j].name);
                    }
                    this._bindUsersToHandler(users, "actionHandler");
                }
            } else {
                actionsDropdown.enabled = false;
            }

            return rightResisdents;
        },
        _bindUsersToHandler: function _bindUsersToHandler(users, handlerName) {
            if (!Array.isArray(users)) {
                users = [users];
            }

            var notFoundHandler = true;
            var _iteratorNormalCompletion10 = true;
            var _didIteratorError10 = false;
            var _iteratorError10 = undefined;

            try {
                for (var _iterator10 = this.handlers[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                    var handler = _step10.value;

                    if (handler.name === handlerName) {
                        var _iteratorNormalCompletion11 = true;
                        var _didIteratorError11 = false;
                        var _iteratorError11 = undefined;

                        try {
                            for (var _iterator11 = users[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                                var user = _step11.value;

                                if (!(user in handler.users)) {
                                    handler.users.push(user);
                                }
                            }
                        } catch (err) {
                            _didIteratorError11 = true;
                            _iteratorError11 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion11 && _iterator11.return) {
                                    _iterator11.return();
                                }
                            } finally {
                                if (_didIteratorError11) {
                                    throw _iteratorError11;
                                }
                            }
                        }

                        notFoundHandler = false;
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError10 = true;
                _iteratorError10 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion10 && _iterator10.return) {
                        _iterator10.return();
                    }
                } finally {
                    if (_didIteratorError10) {
                        throw _iteratorError10;
                    }
                }
            }

            if (notFoundHandler) {
                this.handlers.push({ name: handlerName, users: users });
            }
        },
        _bindDropdownChildren: function _bindDropdownChildren(children, parent, childrenHandlerName) {
            if (!children.icon) {
                children.icon = "drto-check iconfont";
            }
            parent.children = children;

            var users = [];
            for (var j = 0; j < parent.children.length; j++) {
                users.push(parent.children[j].name);
            }
            this._bindUsersToHandler(users, childrenHandlerName);
        },
        BMapMenuItemClick: function BMapMenuItemClick(item, $event) {
            if (item.enabled !== undefined && !item.enabled) {
                return;
            }
            for (var i = 0; i < this.handlers.length; i++) {
                var handler = this.handlers[i];
                if (handler.users.indexOf(item.name) !== -1 && typeof this[handler.name] === "function") {
                    this[handler.name](item);
                    break;
                }
            }
            this.$emit("onBMapMenuItemClick", item, $event);
        },

        initMenu: function initMenu() {
            this.setMenuItems();
        },

        QueryCommandEnableInternal: function QueryCommandEnableInternal(commandName, currentMode) {
            var itemBuffering = this.hasIntersection(this.bufferItemsId, this.selectedItemsIdUnsorted);
            var fenceBuffing = this.tempFences["fence_" + this.selectedShapesId];
            if (this.isEmpty(this.map) || itemBuffering || fenceBuffing) {
                return { enabled: false };
            }

            var result;
            switch (commandName) {
                case "select":
                    result = { enabled: window.drawingManagerSuccess && window.GeoUtilsSuccess };
                    break;
                case "edit":
                    result = {
                        enabled: window.drawingManagerSuccess && window.markerToolSuccess,
                        visible: this.baiduMapMeta.modes.edit
                    };
                    break;
                case "draw":
                    result = {
                        enabled: window.drawingManagerSuccess && window.markerToolSuccess,
                        visible: this.baiduMapMeta.modes.draw
                    };
                    break;
                case "fence":
                    result = {
                        enabled: window.drawingManagerSuccess,
                        visible: this.baiduMapMeta.modes.fence
                    };
                    break;
                case "measure":
                    result = { enabled: window.DistanceToolSuccess };
                    break;
                case "trace":
                    result = {
                        enabled: true,
                        visible: this.baiduMapMeta.modes.trace
                    };
                    break;
                case "track":
                    result = {
                        enabled: true,
                        visible: this.baiduMapMeta.modes.track
                    };
                    break;

                case "action":
                    break;
                case "attribute":
                    if (this.mouseOnTarget === "marker") {
                        result = { enabled: true, visible: true };
                    } else {
                        result = { enabled: false, visible: false };
                    }
                    break;

                case "new":
                    if (this.isEmpty(this.baiduMapMeta.itemOptions)) {
                        result = { enabled: false, visible: true };
                    } else {
                        result = { enabled: true, visible: true };
                    }
                    break;
                case "move":
                    if (this.selectedItemsIdUnsorted.length > 1) {
                        result = { enabled: false, visible: true };
                    } else if (this.movingItems[(this.currentItem || {}).id]) {
                        result = { enabled: false, visible: false };
                    } else {
                        result = { enabled: true, visible: true };
                    }
                    break;
                case "move_cancel":
                case "move_end":
                    if (this.hasIntersection(this.selectedItemsIdUnsorted, this.movingItems)) {
                        result = { enabled: true, visible: true };
                    } else {
                        result = { enabled: false, visible: false };
                    }
                    break;

                case "mark":
                    if (this.isEmpty(this.baiduMapMeta.itemOptions)) {
                        result = { enabled: false, visible: true };
                    } else {
                        result = { enabled: true, visible: true };
                    }
                    break;

                case "shape_edit":
                    if (Object.keys(this.editingShapes).length) {
                        result = { enabled: false, visible: false };
                    } else if (Object.keys(this.shapes).length - Object.keys(this.tempFences).length) {
                        result = { enabled: true, visible: true };
                    } else {
                        result = { enabled: false, visible: false };
                    }
                    break;
                case "shape_edit_cancel":
                case "shape_edit_end":
                    if (Object.keys(this.editingShapes).length) {
                        result = { enabled: true, visible: true };
                    } else {
                        result = { enabled: false, visible: false };
                    }
                    break;
                case "shape_clear":
                    if (Object.keys(this.shapes).length - Object.keys(this.tempFences).length + this.tempItems.length) {
                        result = { enabled: true, visible: true };
                    } else if (this.currentMode === "fenceMode") {
                        result = { enabled: false, visible: false };
                    } else {
                        result = { enabled: false, visible: true };
                    }
                    break;

                case "fence_show":
                    if (this.showingFences) {
                        result = { enabled: false, visible: false };
                    } else if (!this.showingFences && this.isEmpty(this.fences)) {
                        result = { enabled: false, visible: true };
                    } else {
                        result = { enabled: true, visible: true };
                    }
                    break;
                case "fence_hide":
                    if (!this.showingFences) {
                        result = { enabled: false, visible: false };
                    } else if (this.showingFences && this.isEmpty(this.fences)) {
                        result = { enabled: false, visible: true };
                    } else {
                        result = { enabled: true, visible: true };
                    }
                    break;

                case "trace_play":
                case "track_start":
                    if (this.playingTrace) {
                        result = { enabled: false, visible: true };
                    } else {
                        result = { enabled: true, visible: true };
                    }
                    break;
                case "trace_pause":
                case "track_stop":
                    if (!this.playingTrace) {
                        result = { enabled: false, visible: true };
                    } else {
                        result = { enabled: true, visible: true };
                    }
                    break;
                default:
                    result = { enabled: true };
            }

            return result;
        },
        getCurrentItem: function getCurrentItem(e) {
            var items = this.items.concat(this.tempItems);
            var currentItem = null;
            var id = e.target.parentElement ? e.target.parentElement.dataset.id : e.domEvent.srcElement.parentElement.dataset.id;
            var _iteratorNormalCompletion12 = true;
            var _didIteratorError12 = false;
            var _iteratorError12 = undefined;

            try {
                for (var _iterator12 = items[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                    var _item2 = _step12.value;

                    if (_item2.id === id) {
                        currentItem = _item2;
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError12 = true;
                _iteratorError12 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion12 && _iterator12.return) {
                        _iterator12.return();
                    }
                } finally {
                    if (_didIteratorError12) {
                        throw _iteratorError12;
                    }
                }
            }

            return currentItem;
        },
        setSelectedItems: function setSelectedItems(currentItems) {
            var multi = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            currentItems = Array.isArray(currentItems) ? currentItems : [currentItems];
            if (!currentItems.length) {
                return;
            }
            var _iteratorNormalCompletion13 = true;
            var _didIteratorError13 = false;
            var _iteratorError13 = undefined;

            try {
                for (var _iterator13 = currentItems[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                    var currentItem = _step13.value;

                    if (multi) {
                        var selectedItemsId = this.selectedItemsId;
                        if (selectedItemsId[currentItem.type]) {
                            var i = selectedItemsId[currentItem.type].indexOf(currentItem.id);
                            if (i !== -1) {
                                selectedItemsId[currentItem.type].splice(i, 1);
                                if (!selectedItemsId[currentItem.type].length) {
                                    this.$delete(selectedItemsId, currentItem.type);
                                }
                                this.highlightItems(currentItem.id, false);
                            } else {
                                selectedItemsId[currentItem.type].push(currentItem.id);
                                this.highlightItems(currentItem.id, true);
                            }
                        } else {
                            this.$set(selectedItemsId, currentItem.type, [currentItem.id]);
                            this.highlightItems(currentItem.id, true);
                        }

                        var selectedItemsIdUnsorted = this.selectedItemsIdUnsorted;
                        var j = selectedItemsIdUnsorted.indexOf(currentItem.id);
                        if (j !== -1) {
                            selectedItemsIdUnsorted.splice(j, 1);
                        } else {
                            selectedItemsIdUnsorted.push(currentItem.id);
                        }
                    } else {
                        this.clearSelectedItems();
                        this.selectedItemsId[currentItem.type] = [currentItem.id];
                        this.selectedItemsIdUnsorted = [currentItem.id];
                        this.highlightItems(currentItem.id, true);
                    }
                }
            } catch (err) {
                _didIteratorError13 = true;
                _iteratorError13 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion13 && _iterator13.return) {
                        _iterator13.return();
                    }
                } finally {
                    if (_didIteratorError13) {
                        throw _iteratorError13;
                    }
                }
            }
        },
        clearSelectedItems: function clearSelectedItems() {
            this.selectedItemsId = {};
            this.highlightItems(this.selectedItemsIdUnsorted, false);
            this.selectedItemsIdUnsorted = [];
        },
        highlightItems: function highlightItems(itemsId) {
            var highlight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            if (!Array.isArray(itemsId)) {
                itemsId = itemsId ? [itemsId] : [];
            }
            var _iteratorNormalCompletion14 = true;
            var _didIteratorError14 = false;
            var _iteratorError14 = undefined;

            try {
                for (var _iterator14 = itemsId[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                    var itemId = _step14.value;

                    if (this.markerOverlays[itemId]) {
                        this.markerOverlays[itemId].ol._markerInst.selected = highlight;
                    }
                }
            } catch (err) {
                _didIteratorError14 = true;
                _iteratorError14 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion14 && _iterator14.return) {
                        _iterator14.return();
                    }
                } finally {
                    if (_didIteratorError14) {
                        throw _iteratorError14;
                    }
                }
            }
        },
        setSelectedShapes: function setSelectedShapes(currentShapes) {
            var multi = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (!Array.isArray(currentShapes)) {
                currentShapes = this.isEmpty(currentShapes) ? [] : [currentShapes];
            }
            if (!currentShapes.length) {
                return;
            }
            var _iteratorNormalCompletion15 = true;
            var _didIteratorError15 = false;
            var _iteratorError15 = undefined;

            try {
                for (var _iterator15 = currentShapes[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
                    var currentShape = _step15.value;


                    if (multi) {
                        var i = this.selectedShapesId.indexOf(currentShape.id);
                        if (i !== -1) {
                            this.selectedShapes.splice(i, 1);
                            this.selectedShapesId.splice(i, 1);
                            this.highlightShapes(currentShape.id, false);
                        } else {
                            this.selectedShapes.push(currentShape);
                            this.selectedShapesId.push(currentShape.id);
                            this.highlightShapes(currentShape.id, true);
                        }
                    } else {
                        this.clearSelectedShapes();
                        this.selectedShapes = [currentShape];
                        this.selectedShapesId = [currentShape.id];
                        this.highlightShapes(currentShape.id, true);
                    }
                }
            } catch (err) {
                _didIteratorError15 = true;
                _iteratorError15 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion15 && _iterator15.return) {
                        _iterator15.return();
                    }
                } finally {
                    if (_didIteratorError15) {
                        throw _iteratorError15;
                    }
                }
            }
        },
        clearSelectedShapes: function clearSelectedShapes() {
            if (this.selectedShapes.length && this.currentMode !== "fenceRelateMode") {
                this.highlightShapes(this.selectedShapesId, false);
                try {
                    this.highlightItems(this.fences[this.selectedShapes[0].belongToFenceID].itemsId, false);
                } catch (e) {}
                this.selectedShapes = [];
                this.selectedShapesId = [];
            }
        },
        highlightShapes: function highlightShapes(shapesId) {
            var highlight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            if (!Array.isArray(shapesId)) {
                shapesId = shapesId ? [shapesId] : [];
            }
            var _iteratorNormalCompletion16 = true;
            var _didIteratorError16 = false;
            var _iteratorError16 = undefined;

            try {
                for (var _iterator16 = shapesId[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
                    var shapeId = _step16.value;

                    var shape = this.shapes[shapeId];
                    if (shape.shapeMode) {
                        var strokeWeight = this.baiduMapMeta.drawingOpts[shape.shapeMode + "Options"].strokeWeight;
                        shape.setStrokeWeight(highlight ? 2 * strokeWeight : strokeWeight);
                    } else {
                        this.markerOverlays[shape.id].ol._markerInst.selected = highlight;
                    }
                }
            } catch (err) {
                _didIteratorError16 = true;
                _iteratorError16 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion16 && _iterator16.return) {
                        _iterator16.return();
                    }
                } finally {
                    if (_didIteratorError16) {
                        throw _iteratorError16;
                    }
                }
            }
        },
        _creatMenubarControl: function _creatMenubarControl(map) {
            var self = this;

            function MenubarControl() {
                this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
                this.defaultOffset = new BMap.Size(0, 0);
            }

            MenubarControl.prototype = new BMap.Control();

            MenubarControl.prototype.initialize = function (map) {
                var div = self._createMenubarElement();
                map.getContainer().appendChild(div);
                var element = $(div).children().get(0);
                var props = { items: self.menubarItems, eventHub: "BMapMenuItemClick" };
                var parent = self;
                self.menubarInst = new Menubar({
                    el: element,
                    propsData: props,
                    parent: parent
                });
                self.setMenuItems();


                return div;
            };

            return new MenubarControl();
        },
        _createMenubarElement: function _createMenubarElement() {
            var menubar_template = "\n                    <div class=\"menubar\" style=\"width: 100%\">\n                        <div></div>\n                    </div>\n                ";
            var menubarEle = $(menubar_template).get(0);
            return menubarEle;
        },
        addMenubar: function addMenubar(map) {
            var mu = this._creatMenubarControl();
            map.addControl(mu);
        },
        _creatCustomMarkerOverlay: function _creatCustomMarkerOverlay(item) {
            var self = this;
            var mt = self.baiduMapMeta.itemPropMapping;
            var mi = self.markableItems;
            function ComplexCustomOverlay(item) {
                var point = new BMap.Point(item[mt.x], item[mt.y]);
                this._item = {};
                this._id = this._item.id = item[mt.id];
                this._type = this._item.type = item[mt.type];
                this._name = this._item.name = item[mt.name];
                this._point = point;
                this._isActive = this._item.active = item[mt.active];
                for (var i = 0; i < mi.length; i++) {
                    if (mi[i].category === this._type) {
                        var imgsrc = mi[i].imgsrc;
                        var color = mi[i].anicolor;
                        break;
                    }
                }
                this._imgsrc = this._item.imgsrc = item[mt.imgsrc] || imgsrc;
                this._color = this._item.color = item[mt.anicolor] || color;
            }

            ComplexCustomOverlay.prototype = new BMap.Overlay();

            ComplexCustomOverlay.prototype.initialize = function (map) {
                this._map = map;
                var div = self._createMarkerElement(this._item);
                map.getPanes().markerPane.appendChild(div);
                var element = $(div).children().get(0);
                var props = { item: this._item, map: map };
                var parent = self;
                var markerInst = new Marker({
                    el: element,
                    propsData: props,
                    parent: parent
                });


                this._div = div;
                this._markerInst = markerInst;
                return this._div;
            };

            ComplexCustomOverlay.prototype.draw = function () {
                var pixel = this._map.pointToOverlayPixel(this._point);
                this._div.style.left = pixel.x - 16 + "px";
                this._div.style.top = pixel.y - 44 + "px";
            };

            var customMarkerOverlay = new ComplexCustomOverlay(item);
            self.markerOverlays[item.id] = { id: item.id, item: item, ol: customMarkerOverlay };


            return customMarkerOverlay;
        },
        _createMarkerElement: function _createMarkerElement(item) {
            var marker_template = "\n                    <div class=\"marker\">\n                        <div></div>\n                    </div>\n                ";
            var markerEle = $(marker_template).get(0);
            return markerEle;
        },
        _createLabelOverlay: function _createLabelOverlay(item) {
            if (!item.name) {
                return;
            }
            var position = new BMap.Point(item.x, item.y);
            var offset = new BMap.Size(0, 0);
            if (!item.label) {
                this.$set(item, "label", this.autoItemLabel(item));
            }
            var label = new BMap.Label(item.label, { position: position, offset: offset });
            label.setStyle({
                borderRadius: "5px",
                borderColor: this.labelColor[item.color],
                backgroundColor: this.labelColor[item.color],
                color: this.labelColor[item.color] ? "white" : "",
                opacity: "0.8"
            });
            return label;
        },
        autoItemLabel: function autoItemLabel(item) {
            return item.name;
        },
        addMarkers: function addMarkers(map, items) {
            if (!Array.isArray(items)) {
                items = [items];
            }
            for (var i = 0; i < items.length; i++) {
                var ol = this._creatCustomMarkerOverlay(items[i]);
                map.addOverlay(ol);
                if (this.baiduMapMeta.markerOpts.showLabel) {
                    var label = this._createLabelOverlay(items[i]);
                    this.markerOverlays[items[i].id].label = label;
                    map.addOverlay(label);
                }
                this.setItem(items[i]);
            }
        },
        _reCalcMarkers: function _reCalcMarkers() {
            for (var olID in this.markerOverlays) {
                this.markerOverlays[olID].ol.draw();
                if (this.markerOverlays[olID].label) {
                    this.markerOverlays[olID].label.draw();
                }
            }
        },
        setPosition: function setPosition(item, x, y) {
            var mkol = item.id ? this.markerOverlays[item.id] : item;
            var ol = mkol.ol;
            var mk = mkol.marker;
            var lb = mkol.label;
            ol._point.lng = x;
            ol._point.lat = y;

            this.setItem(item, "x", x);
            this.setItem(item, "y", y);

            ol.draw();
            if (lb) {
                lb.setPosition(ol._point);
            }
            if (mk) {
                mk.setPosition(ol._point);
            }
        },
        setLabelContent: function setLabelContent(item, labelContent) {
            var mkol = item.id ? this.markerOverlays[item.id] : item;
            var label = mkol.label;
            var labelColor = this.labelColor[item.color];
            if (labelColor) {
                label.setStyle({
                    borderColor: labelColor,
                    backgroundColor: labelColor,
                    color: labelColor ? "white" : ""
                });
            }
            label.setContent(labelContent);
        },
        setItem: function setItem(item, prop, val) {
            var mkol = this.markerOverlays[item.id];
            var ol = mkol.ol;
            var mi = ol._markerInst;
            if (prop && val) {
                this.$set(item, prop, val);
                this.$set(mkol.item, prop, val);
                this.$set(ol._item, prop, val);
                this.$set(mi.item, prop, val);
            } else {
                item = item;
                mkol.item = item;
                ol._item = item;
                mi.item = item;
            }
        },
        disableItemsMoving: function disableItemsMoving(itemsId) {
            var _iteratorNormalCompletion17 = true;
            var _didIteratorError17 = false;
            var _iteratorError17 = undefined;

            try {
                for (var _iterator17 = itemsId[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
                    var itemId = _step17.value;

                    if (this.movingItems[itemId]) {
                        this.$set(this.movingItems[itemId], "draggable", false);
                        delete this.movingItems[itemId];
                    }
                }
            } catch (err) {
                _didIteratorError17 = true;
                _iteratorError17 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion17 && _iterator17.return) {
                        _iterator17.return();
                    }
                } finally {
                    if (_didIteratorError17) {
                        throw _iteratorError17;
                    }
                }
            }
        },
        onOpenInfoWindow: function onOpenInfoWindow(item) {
            var _this2 = this;

            var loadingContent = "<img class='loadingInfoWindow' src=" + this.loadingImg + ">";
            var infoWindow = new BMap.InfoWindow(loadingContent, this.baiduMapMeta.infoWindowOpts);
            var self = this;
            infoWindow.addEventListener("open", function () {
                self.request("itemInfo", {
                    resolved: function resolved() {
                        var r = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                        self.loadInfoContent(infoWindow, _this2.baiduMapMeta.infoWindowContent, item, r.props);
                    },
                    rejected: function rejected(r) {
                        var timeoutContent = "\n                                <div class='timeout'>\n                                    <h1>" + r.reason.toUpperCase() + "\n                                        </br>\n                                        <i class='drto-suprise iconfont' style=\"font-size: 2rem\">\n                                    </h1></div>";
                        self.loadInfoContent(infoWindow, timeoutContent);
                    }
                }, {}, 3);
                self.bufferItems(self.selectedItemsIdUnsorted, false);
                self.setMenuItems();
            });

            this.map.openInfoWindow(infoWindow, new BMap.Point(item.x, item.y));

            if (document.querySelector(".BMap_bubble_content img")) {
                document.querySelector(".BMap_bubble_content img").onload = function () {
                    infoWindow.redraw();
                };
            }
        },
        loadInfoContent: function loadInfoContent(infoWindow, content, item, props) {
            var element = $("#" + this.baiduMapMeta.id + " .BMap_bubble_content").children().get(0);
            if (element.className !== "loadingInfoWindow") {
                return;
            }


            var contentIsVue = /.+\.async.vue$/.test(content);

            if (contentIsVue) {
                var self = this;
                setTimeout(function () {
                    self.asyncLoadInfoContent(content, element, props, self.markerOverlays[item.id].ol._markerInst);
                }, 500);
            } else {
                infoWindow.setContent(content);
            }
        },
        asyncLoadInfoContent: function asyncLoadInfoContent(content, element, options, parent) {
            var self = this;
            (0, _asyncloadvue2.default)(content, element, options, parent).then(function (resolve) {
                self.dispatch("infoContentLoadSuccess", content, element, options, parent);
            }).catch(function (reason) {
                self.dispatch("infoContentLoadError", content, element, options, parent, reason);
            });
        },
        exitHandler: function exitHandler(item) {
            this.setCurrentMode("defaultMode");
            if (!this.isEmpty(this.movingItems)) {
                this.disableItemsMoving(Object.keys(this.movingItems));
                this.edithandlerEmit("moveItems", "afterMovingItems");
            }
            if (!this.isEmpty(this.playingTraceItem)) {
                this.tracePlayer("stop");
            }
            this.setMenuItems();
        },
        editHandler: function editHandler(item) {
            switch (item.name) {
                case "edit":
                    this.mouseOnTarget = this.selectedItemsIdUnsorted.length ? "marker" : "map";
                    this.setCurrentMode("editMode");
                    this.setMenuItems();
                    break;
                case "select":
                    break;
                case "new":
                    this.markHandler(item);
                    break;
                case "remove":
                    this.edithandlerEmit("removeItems");
                    break;
                case "modify":
                    this.edithandlerEmit("modifyItems", "bufferItems");
                    break;
                case "move":
                    this.movingItems[this.currentItem.id] = this.currentItem;
                    this.bkupItems(this.currentItem);
                    this.$set(this.currentItem, "draggable", true);
                    this.setMenuItems();

                    break;
                case "move_cancel":
                    this.restoreItems(this.selectedItemsIdUnsorted);
                    this.disableItemsMoving(this.selectedItemsIdUnsorted);
                    this.setMenuItems();
                    break;
                case "move_end":
                    this.disableItemsMoving(this.selectedItemsIdUnsorted);
                    this.edithandlerEmit("moveItems", "afterMovingItems");
                    break;
            }
        },
        bufferItems: function bufferItems(itemsId, buffering) {
            if (!Array.isArray(itemsId)) {
                itemsId = itemsId ? [itemsId] : [];
            }
            var _iteratorNormalCompletion18 = true;
            var _didIteratorError18 = false;
            var _iteratorError18 = undefined;

            try {
                for (var _iterator18 = itemsId[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
                    var itemId = _step18.value;

                    var mkol = this.markerOverlays[itemId];
                    var mi = mkol.ol._markerInst;
                    mi.buffering = buffering;
                    buffering ? this.bufferItemsId.push(itemId) : this.bufferItemsId.splice(this.bufferItemsId.indexOf(itemId), 1);
                }
            } catch (err) {
                _didIteratorError18 = true;
                _iteratorError18 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion18 && _iterator18.return) {
                        _iterator18.return();
                    }
                } finally {
                    if (_didIteratorError18) {
                        throw _iteratorError18;
                    }
                }
            }

            this.setMenuItems();
        },
        detachItems: function detachItems(itemsId) {
            if (!Array.isArray(itemsId)) {
                itemsId = itemsId ? [itemsId] : [];
            }
            var _iteratorNormalCompletion19 = true;
            var _didIteratorError19 = false;
            var _iteratorError19 = undefined;

            try {
                for (var _iterator19 = itemsId[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
                    var itemId = _step19.value;

                    var mkol = this.markerOverlays[itemId];
                    if (mkol) {
                        this.bufferItems(itemId, false);
                        var mi = mkol.ol._markerInst;
                        this.map.removeOverlay(mkol.ol);
                        this.map.removeOverlay(mkol.label);
                        mi.$destroy();
                        delete this.markerOverlays[itemId];
                    }
                }
            } catch (err) {
                _didIteratorError19 = true;
                _iteratorError19 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion19 && _iterator19.return) {
                        _iterator19.return();
                    }
                } finally {
                    if (_didIteratorError19) {
                        throw _iteratorError19;
                    }
                }
            }

            this.clearSelectedItems();
            this.mouseOnTarget = "map";
            this.setMenuItems();
        },
        hasIntersection: function hasIntersection(a, b) {
            if (Array.isArray(b)) {
                var _iteratorNormalCompletion20 = true;
                var _didIteratorError20 = false;
                var _iteratorError20 = undefined;

                try {
                    for (var _iterator20 = b[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
                        var k = _step20.value;

                        if (a.indexOf(k) !== -1) {
                            return true;
                        }
                    }
                } catch (err) {
                    _didIteratorError20 = true;
                    _iteratorError20 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion20 && _iterator20.return) {
                            _iterator20.return();
                        }
                    } finally {
                        if (_didIteratorError20) {
                            throw _iteratorError20;
                        }
                    }
                }
            } else {
                for (var k in b) {
                    if (a.indexOf(k) !== -1) {
                        return true;
                    }
                }
            }
            return false;
        },
        edithandlerEmit: function edithandlerEmit(eventName, callbackName) {
            var self = this;
            self.bufferItems(self.selectedItemsIdUnsorted, true);
            self.setMenuItems();(function (selectedItemsIdUnsorted) {
                self.mapEventManager.mapEvent.emit(eventName, self.items, { targetItems: self.getItemsbyIds(selectedItemsIdUnsorted), currentMode: self.currentMode }, function (status, reply) {
                    if (status === "resolved") {
                        callbackName ? self[callbackName](selectedItemsIdUnsorted, false) : "";
                        self.removeBkupItems(selectedItemsIdUnsorted);
                    } else if (status === "continued") {
                        callbackName ? self[callbackName](reply.resolvedItemsId, false) : "";
                        self.removeBkupItems(reply.resolvedItemsId);
                    } else {
                        var _iteratorNormalCompletion21 = true;
                        var _didIteratorError21 = false;
                        var _iteratorError21 = undefined;

                        try {
                            for (var _iterator21 = (reply.unResolvedItemsId || [])[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
                                var unResolvedItemId = _step21.value;

                                eventName !== "removeItems" ? self.restoreItems(unResolvedItemId) : self.bufferItems(unResolvedItemId, false);
                            }
                        } catch (err) {
                            _didIteratorError21 = true;
                            _iteratorError21 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion21 && _iterator21.return) {
                                    _iterator21.return();
                                }
                            } finally {
                                if (_didIteratorError21) {
                                    throw _iteratorError21;
                                }
                            }
                        }

                        callbackName ? self[callbackName](selectedItemsIdUnsorted, false) : "";
                    }
                    if (status !== "continued") {
                        selectedItemsIdUnsorted = null;
                    }
                });
            })(self.selectedItemsIdUnsorted);
        },
        afterMovingItems: function afterMovingItems(itemsId) {
            var _iteratorNormalCompletion22 = true;
            var _didIteratorError22 = false;
            var _iteratorError22 = undefined;

            try {
                for (var _iterator22 = itemsId[Symbol.iterator](), _step22; !(_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done); _iteratorNormalCompletion22 = true) {
                    var itemId = _step22.value;

                    this.bufferItems(itemId, false);
                    delete this.movingItems[itemId];
                }
            } catch (err) {
                _didIteratorError22 = true;
                _iteratorError22 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion22 && _iterator22.return) {
                        _iterator22.return();
                    }
                } finally {
                    if (_didIteratorError22) {
                        throw _iteratorError22;
                    }
                }
            }
        },
        bkupItems: function bkupItems(items) {
            if (!Array.isArray(items)) {
                items = items ? [items] : [];
            }
            var _iteratorNormalCompletion23 = true;
            var _didIteratorError23 = false;
            var _iteratorError23 = undefined;

            try {
                for (var _iterator23 = items[Symbol.iterator](), _step23; !(_iteratorNormalCompletion23 = (_step23 = _iterator23.next()).done); _iteratorNormalCompletion23 = true) {
                    var _item3 = _step23.value;

                    this.bkupItemsPos[_item3.id] = { x: _item3.x, y: _item3.y };
                }
            } catch (err) {
                _didIteratorError23 = true;
                _iteratorError23 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion23 && _iterator23.return) {
                        _iterator23.return();
                    }
                } finally {
                    if (_didIteratorError23) {
                        throw _iteratorError23;
                    }
                }
            }
        },
        restoreItems: function restoreItems(itemsId) {
            if (!Array.isArray(itemsId)) {
                itemsId = itemsId ? [itemsId] : [];
            }
            for (var itemId in this.bkupItemsPos) {
                if (itemsId.indexOf(itemId) !== -1) {
                    var bkupItem = this.markerOverlays[itemId].item;
                    var bkupX = this.bkupItemsPos[itemId].x;
                    var bkupY = this.bkupItemsPos[itemId].y;
                    this.setPosition(bkupItem, bkupX, bkupY);
                    this.removeBkupItems(itemId);
                }
            }
        },
        removeBkupItems: function removeBkupItems(itemsId) {
            if (!Array.isArray(itemsId)) {
                itemsId = itemsId ? [itemsId] : [];
            }
            for (var itemId in itemsId) {
                delete this.bkupItemsPos[itemId];
            }
        },
        drawingHandler: function drawingHandler(item) {
            if (item.name === "draw") {
                this.mouseOnTarget = "map";
                this.setCurrentMode("drawMode");
                this.setMenuItems();
            } else if (item.name === "shape_edit") {
                this.openShapesEditing(this.shapesId);
            } else if (item.name === "shape_remove") {
                this.removeShapes();
                this.mouseOnTarget = "map";
                this.setMenuItems();
            } else if (item.name === "shape_clear") {
                this.clearShape();
            } else if (item.name in Object.keys(this.baiduMapMeta.itemOptions)) {
                this.markHandler(item);
            } else if (item.name === "select") {
                this.drawShape("rectangle");
                this.selecting = true;
            } else if (item.name === "shape_edit_cancel") {
                this.closeShapeEditing(true);
            } else if (item.name === "shape_edit_end") {
                this.closeShapeEditing();
            } else {
                this.drawShape(item.name);
            }
        },
        drawShape: function drawShape(shapeName) {
            var drawingMode = "BMAP_DRAWING_" + shapeName.toUpperCase();
            this.drawingManager.setDrawingMode(window[drawingMode]);
            this.drawingManager.open();
        },
        onOverlayComplete: function onOverlayComplete(e) {
            this.debugValues("onOverlayComplete_before_onNewFences", {}, "shapes", "shapesId", "fences", "tempFences");
            var self = this;
            var shape = e.overlay;
            if (shape.getBounds().toSpan().lng && shape.getBounds().toSpan().lat) {

                shape.shapeMode = e.drawingMode;
                if (this.selecting) {
                    this.onSelectByOverlayComplete(shape);
                    this.selecting = false;
                    return;
                }

                shape.id = this.generateUUID();
                this.shapes[shape.id] = shape;
                this.shapesId.push(shape.id);

                if (this.currentMode === "fenceMode") {
                    this.onNewFences(shape);
                }

                shape.addEventListener("click", function () {
                    self.onClickShape(shape);
                });
            } else {
                this.map.removeOverlay(shape);
            }

            if (!this.svgDom) {
                this.svgDom = e.overlay.V.parentElement;
            }
        },
        onSelectByOverlayComplete: function onSelectByOverlayComplete(shape) {
            var itemsInShape = this.getItemsInShape(shape, this.items);
            var tempItemsInShape = this.getItemsInShape(shape, this.tempItems);

            if (itemsInShape.length) {
                this.clearSelectedShapes();
                if (itemsInShape.length === 1) {
                    this.currentItem = itemsInShape[0];
                }
                this.setSelectedItems(itemsInShape, true);
                this.mouseOnTarget = "marker";
            } else if (this.currentMode !== "fenceRelateMode") {
                this.clearSelectedItems();
                this.setSelectedShapes(tempItemsInShape, true);
                this.mouseOnTarget = "shape";
            }

            this.map.removeOverlay(shape);
            this.drawingManager.close();
            this.setMenuItems();
        },
        onClickShape: function onClickShape(shape) {
            if (this.currentMode === "fenceRelateMode") {
                return;
            }
            if (shape.belongToFenceID) {
                this.mouseOnTarget = "fence";
            } else {
                this.mouseOnTarget = "shape";
            }
            this.currentShape = shape;
            this.currentItem = null;

            this.clearSelectedItems();
            this.setSelectedShapes(this.currentShape, false);
            this.setMenuItems();

            if (this.mouseOnTarget === "fence") {
                this.setSelectedItems(this.fences[shape.belongToFenceID].items, true);
            }
        },
        openShapesEditing: function openShapesEditing(shapesId) {
            var _iteratorNormalCompletion24 = true;
            var _didIteratorError24 = false;
            var _iteratorError24 = undefined;

            try {
                for (var _iterator24 = shapesId[Symbol.iterator](), _step24; !(_iteratorNormalCompletion24 = (_step24 = _iterator24.next()).done); _iteratorNormalCompletion24 = true) {
                    var shapeId = _step24.value;

                    var shape = this.shapes[shapeId];
                    this.editingShapes[shape.id] = shape;
                    this.bkupShapes(shape);
                    if (shape.isNewItem) {
                        this.$set(shape, "draggable", true);
                    } else {
                        shape.enableEditing();
                        this.fenceEditing = true;
                    }
                }
            } catch (err) {
                _didIteratorError24 = true;
                _iteratorError24 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion24 && _iterator24.return) {
                        _iterator24.return();
                    }
                } finally {
                    if (_didIteratorError24) {
                        throw _iteratorError24;
                    }
                }
            }

            this.setMenuItems();
        },
        removeShapes: function removeShapes() {
            var all = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var shapesId = (all ? this.shapesId : this.selectedShapesId).slice();var _iteratorNormalCompletion25 = true;
            var _didIteratorError25 = false;
            var _iteratorError25 = undefined;

            try {
                for (var _iterator25 = shapesId[Symbol.iterator](), _step25; !(_iteratorNormalCompletion25 = (_step25 = _iterator25.next()).done); _iteratorNormalCompletion25 = true) {
                    var shapeId = _step25.value;

                    var shape = this.shapes[shapeId];
                    if (shape.isNewItem) {
                        var mkol = this.markerOverlays[shape.id];
                        this.map.removeOverlay(mkol.ol);
                        this.map.removeOverlay(mkol.marker);
                        this.map.removeOverlay(mkol.label);
                        delete this.markerOverlays[shape.id];
                        this.tempItems.splice(this.itemIndex(this.tempItems, shape.id), 1);

                        this.shapesId.splice(this.shapesId.indexOf(shapeId), 1);
                        delete this.shapes[shapeId];
                        this.selectedShapes = [];
                        this.selectedShapesId = [];
                        delete this.editingShapes[shapeId];
                    } else if (!shape.isFence) {
                        this.map.removeOverlay(shape);

                        this.shapesId.splice(this.shapesId.indexOf(shapeId), 1);
                        delete this.shapes[shapeId];
                        this.selectedShapes = [];
                        this.selectedShapesId = [];
                        delete this.editingShapes[shapeId];
                    }
                }
            } catch (err) {
                _didIteratorError25 = true;
                _iteratorError25 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion25 && _iterator25.return) {
                        _iterator25.return();
                    }
                } finally {
                    if (_didIteratorError25) {
                        throw _iteratorError25;
                    }
                }
            }

            this.currentShape = null;
        },
        clearShape: function clearShape() {
            this.removeShapes(true);
            this.setMenuItems();
        },
        closeShapeEditing: function closeShapeEditing() {
            var cancel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (this.fenceEditing && !cancel) {
                this.fenceEditing = false;
                var fencesId = [];
                for (var shapeId in this.shapes) {
                    fencesId.push(this.shapes[shapeId].belongToFenceID);
                }
                this.onModifyFences(fencesId);
            }

            this.disableShapesEditing();
            this.currentShape = null;

            if (cancel) {
                this.restoreShapes(Object.keys(this.bkupShapesPath));
            }
            this.bkupShapesPath = {};
            this.setMenuItems();
        },
        disableShapesEditing: function disableShapesEditing() {
            var shapesId = this.shapesId;
            if (!Array.isArray(shapesId)) {
                shapesId = shapesId ? [shapesId] : [];
            }
            var _iteratorNormalCompletion26 = true;
            var _didIteratorError26 = false;
            var _iteratorError26 = undefined;

            try {
                for (var _iterator26 = shapesId[Symbol.iterator](), _step26; !(_iteratorNormalCompletion26 = (_step26 = _iterator26.next()).done); _iteratorNormalCompletion26 = true) {
                    var shapeId = _step26.value;

                    if (!this.shapes[shapeId].isNewItem) {
                        this.shapes[shapeId].disableEditing();
                        delete this.editingShapes[shapeId];
                    }
                }
            } catch (err) {
                _didIteratorError26 = true;
                _iteratorError26 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion26 && _iterator26.return) {
                        _iterator26.return();
                    }
                } finally {
                    if (_didIteratorError26) {
                        throw _iteratorError26;
                    }
                }
            }

            var _iteratorNormalCompletion27 = true;
            var _didIteratorError27 = false;
            var _iteratorError27 = undefined;

            try {
                for (var _iterator27 = this.tempItems[Symbol.iterator](), _step27; !(_iteratorNormalCompletion27 = (_step27 = _iterator27.next()).done); _iteratorNormalCompletion27 = true) {
                    var tempItem = _step27.value;

                    this.$set(tempItem, "draggable", false);
                    delete this.movingItems[tempItem.id];
                    delete this.editingShapes[tempItem.id];
                }
            } catch (err) {
                _didIteratorError27 = true;
                _iteratorError27 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion27 && _iterator27.return) {
                        _iterator27.return();
                    }
                } finally {
                    if (_didIteratorError27) {
                        throw _iteratorError27;
                    }
                }
            }
        },
        bkupShapes: function bkupShapes(shapes) {
            if (!Array.isArray(shapes)) {
                shapes = this.isEmpty(shapes) ? [] : [shapes];
            }
            var _iteratorNormalCompletion28 = true;
            var _didIteratorError28 = false;
            var _iteratorError28 = undefined;

            try {
                for (var _iterator28 = shapes[Symbol.iterator](), _step28; !(_iteratorNormalCompletion28 = (_step28 = _iterator28.next()).done); _iteratorNormalCompletion28 = true) {
                    var shape = _step28.value;

                    if (shape.isNewItem) {
                        this.bkupShapesPath[shape.id] = { x: shape.x, y: shape.y };
                    } else {
                        this.bkupShapesPath[shape.id] = { path: shape.getPath() };
                    }
                }
            } catch (err) {
                _didIteratorError28 = true;
                _iteratorError28 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion28 && _iterator28.return) {
                        _iterator28.return();
                    }
                } finally {
                    if (_didIteratorError28) {
                        throw _iteratorError28;
                    }
                }
            }
        },
        restoreShapes: function restoreShapes(shapesId) {
            if (!Array.isArray(shapesId)) {
                shapesId = shapesId ? [shapesId] : [];
            }
            var _iteratorNormalCompletion29 = true;
            var _didIteratorError29 = false;
            var _iteratorError29 = undefined;

            try {
                for (var _iterator29 = shapesId[Symbol.iterator](), _step29; !(_iteratorNormalCompletion29 = (_step29 = _iterator29.next()).done); _iteratorNormalCompletion29 = true) {
                    var shapeId = _step29.value;

                    if (this.shapes[shapeId].isNewItem) {
                        var bkupItem = this.shapes[shapeId];
                        var bkupX = this.bkupShapesPath[shapeId].x;
                        var bkupY = this.bkupShapesPath[shapeId].y;
                        this.setPosition(bkupItem, bkupX, bkupY);
                    } else {
                        this.shapes[shapeId].setPath(this.bkupShapesPath[shapeId].path);
                    }
                    delete this.bkupShapesPath[shapeId];
                }
            } catch (err) {
                _didIteratorError29 = true;
                _iteratorError29 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion29 && _iterator29.return) {
                        _iterator29.return();
                    }
                } finally {
                    if (_didIteratorError29) {
                        throw _iteratorError29;
                    }
                }
            }
        },
        correctSvgPos: function correctSvgPos() {
            if (!this.svgDom) {
                return;
            }

            var offsetTop = "0px";

            var p = this.svgDom.parentElement;
            while (p) {
                if (p && Number.isInteger(parseInt($(p).css("top")))) {
                    offsetTop = $(p).css("top");
                }
                p = p.parentElement;
            }
            this.svgDom.parentElement.style.top = "-" + offsetTop;
        },
        restoreSvgPos: function restoreSvgPos() {
            this.svgDom.parentElement.style.top = "0px";
        },
        fenceHandler: function fenceHandler(item) {
            if (item.name === "fence") {
                this.mouseOnTarget = "map";
                this.setCurrentMode("fenceMode");
                this.setMenuItems();
            } else if (item.name === "fence_show") {
                this.showFences(Object.keys(this.fences), true);
                this.setMenuItems();
            } else if (item.name === "fence_hide") {
                this.showFences(Object.keys(this.fences), false);
                this.setMenuItems();
            } else if (item.name === "fence_rename") {} else if (item.name === "relate_in") {
                this.onFenceRelate("in");
            } else if (item.name === "relate_out") {
                this.onFenceRelate("out");
            } else if (item.name === "relate_end") {
                this.onFenceRelateEnd(this.fenceRelateMode);
            } else if (item.name === "relate_cancel") {
                this.onFenceRelateEnd(this.fenceRelateMode, true);
            }
        },
        onFenceRelate: function onFenceRelate(mode) {
            this.setCurrentMode("fenceRelateMode");
            this.fenceRelateMode = mode;
            this.setMenuItems();
        },
        onFenceRelateEnd: function onFenceRelateEnd(mode) {
            var cancel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            this.setCurrentMode("fenceMode");
            if (!cancel) {
                var fenceId = this.selectedShapes[0].belongToFenceID;
                var currentFence = this.fences[fenceId];
                var fencedItems = [];
                var _iteratorNormalCompletion30 = true;
                var _didIteratorError30 = false;
                var _iteratorError30 = undefined;

                try {
                    for (var _iterator30 = this.selectedItemsIdUnsorted[Symbol.iterator](), _step30; !(_iteratorNormalCompletion30 = (_step30 = _iterator30.next()).done); _iteratorNormalCompletion30 = true) {
                        var id = _step30.value;

                        fencedItems.push(this.markerOverlays[id].item);
                    }
                } catch (err) {
                    _didIteratorError30 = true;
                    _iteratorError30 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion30 && _iterator30.return) {
                            _iterator30.return();
                        }
                    } finally {
                        if (_didIteratorError30) {
                            throw _iteratorError30;
                        }
                    }
                }

                currentFence.items = fencedItems;
                currentFence.itemsId = this.selectedItemsIdUnsorted;
                currentFence["relate_" + mode + "_ItemsId"] = this.selectedItemsIdUnsorted;
                this.onModifyFences(fenceId, { fenceRelateMode: mode });
                this.setMenuItems();
            } else {
                this.generallyCancel();
            }
        },
        onNewFences: function onNewFences(shapes) {
            if (!Array.isArray(shapes)) {
                shapes = this.isEmpty(shapes) ? [] : [shapes];
            }
            var newFences = {};
            var fencesId = [];
            var _iteratorNormalCompletion31 = true;
            var _didIteratorError31 = false;
            var _iteratorError31 = undefined;

            try {
                for (var _iterator31 = shapes[Symbol.iterator](), _step31; !(_iteratorNormalCompletion31 = (_step31 = _iterator31.next()).done); _iteratorNormalCompletion31 = true) {
                    var shape = _step31.value;

                    var fence = {
                        id: "fence_" + shape.id,
                        title: "处理中...",
                        shape: shape,
                        items: [],
                        itemsId: [] };
                    fence.shape.isFence = true;
                    fence.shape.belongToFenceID = fence.id;
                    this.tempFences[fence.id] = newFences[fence.id] = fence;
                    fencesId.push(fence.id);
                    this.setFenceTitle(fence, fence.title);
                    this.showFenceTitle(fence.id, true);
                }
            } catch (err) {
                _didIteratorError31 = true;
                _iteratorError31 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion31 && _iterator31.return) {
                        _iterator31.return();
                    }
                } finally {
                    if (_didIteratorError31) {
                        throw _iteratorError31;
                    }
                }
            }

            this.debugValues("end_of_onNewFences_before_onFencesEmit", { shapes: shapes }, "shapes", "shapesId", "fences", "tempFences");

            this.onFencesEmit("newFences", fencesId, { newFences: newFences });
        },
        onModifyFences: function onModifyFences(fencesId, params) {
            this.onFencesEmit("modifyFences", fencesId, params);
        },
        onRemoveFences: function onRemoveFences(fencesId) {
            if (!Array.isArray(fencesId)) {
                fencesId = fencesId ? [fencesId] : [];
            }

            this.onFencesEmit("removeFences", fencesId);
        },
        onFencesEmit: function onFencesEmit(eventName, fencesId, params) {
            var self = this;
            if (!Array.isArray(fencesId)) {
                fencesId = fencesId ? [fencesId] : [];
            }
            var allFences = (0, _deepAssign2.default)({}, self.fences, self.tempFences);
            self.mapEventManager.mapEvent.emit(eventName, null, (0, _deepAssign2.default)({
                allFences: allFences,
                fences: self.fences,
                fencesId: fencesId,
                currentMode: self.currentMode,
                shapeFactory: function shapeFactory(shape, shapeId, opts) {
                    var isFence = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

                    var newShape = new shape.constructor(shape.getPath(), opts);
                    newShape.id = shapeId;
                    newShape.shapeMode = shape.shapeMode;
                    newShape.isFence = isFence;
                    newShape.belongToFenceID = shapeId;
                    newShape.addEventListener("click", function () {
                        self.onClickShape(newShape);
                    });
                    return newShape;
                } }, params), function (status, reply) {
                if (status === "resolved") {
                    self.debugValues("callback_of_onFencesEmit", { fencesId: fencesId }, "shapes", "shapesId", "fences", "tempFences");
                    self.detachFences(fencesId);
                } else if (status === "continued") {
                    self.detachFences(reply.resolvedFencesId);
                } else {}
            });
            this.debugValues("end_of_onFencesEmit. Wait for callback ...");
        },
        addFences: function addFences(fences) {
            var showFence = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var showTitle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            this.debugValues("addFences_start", { fences: fences }, "shapes", "shapesId", "fences", "tempFences");
            if (!Array.isArray(fences)) {
                fences = this.isEmpty(fences) ? [] : [fences];
            }
            var _iteratorNormalCompletion32 = true;
            var _didIteratorError32 = false;
            var _iteratorError32 = undefined;

            try {
                for (var _iterator32 = fences[Symbol.iterator](), _step32; !(_iteratorNormalCompletion32 = (_step32 = _iterator32.next()).done); _iteratorNormalCompletion32 = true) {
                    var fence = _step32.value;

                    this.map.addOverlay(fence.shape);
                    this.shapesId.push(fence.shape.id);
                    this.shapes[fence.shape.id] = fence.shape;
                    this.setFenceTitle(fence, fence.title);
                    this.showFences(fence.id, showFence);
                    this.showFenceTitle(fence.id, showTitle);
                }
            } catch (err) {
                _didIteratorError32 = true;
                _iteratorError32 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion32 && _iterator32.return) {
                        _iterator32.return();
                    }
                } finally {
                    if (_didIteratorError32) {
                        throw _iteratorError32;
                    }
                }
            }

            this.debugValues("addFences_end", { fences: fences }, "shapes", "shapesId", "fences", "tempFences");
        },
        setFenceTitle: function setFenceTitle(fence, title) {
            if (this.isEmpty(fence)) {
                return;
            }
            var shapeCenterPoint = fence.shape.getBounds().getCenter();
            var opts = {
                position: shapeCenterPoint };
            var label = new BMap.Label(title, opts);
            label.setStyle({
                color: "#2185D0",
                border: "none",
                fontSize: "12px",
                height: "20px",
                lineHeight: "20px",
                fontFamily: "微软雅黑",
                backgroundColor: "none"
            });

            this.fenceTitleLabels[fence.id] = label;
        },
        showFences: function showFences(fencesId, show) {
            if (!Array.isArray(fencesId)) {
                fencesId = fencesId ? [fencesId] : [];
            }
            var _iteratorNormalCompletion33 = true;
            var _didIteratorError33 = false;
            var _iteratorError33 = undefined;

            try {
                for (var _iterator33 = fencesId[Symbol.iterator](), _step33; !(_iteratorNormalCompletion33 = (_step33 = _iterator33.next()).done); _iteratorNormalCompletion33 = true) {
                    var fenceId = _step33.value;

                    if (show) {
                        this.fences[fenceId].shape.show();
                    } else {
                        this.fences[fenceId].shape.hide();
                    }
                    this.showFenceTitle(fenceId, show);
                }
            } catch (err) {
                _didIteratorError33 = true;
                _iteratorError33 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion33 && _iterator33.return) {
                        _iterator33.return();
                    }
                } finally {
                    if (_didIteratorError33) {
                        throw _iteratorError33;
                    }
                }
            }

            this.showingFences = show;
        },
        showFenceTitle: function showFenceTitle(fenceId, show) {
            var titleLabel = this.fenceTitleLabels[fenceId];
            if (show) {
                this.map.addOverlay(titleLabel);
            } else {
                this.map.removeOverlay(titleLabel);
            }
        },
        detachFences: function detachFences(fencesId) {
            this.debugValues("detachFences_start", { fencesId: fencesId }, "shapes", "shapesId", "fences", "tempFences");
            if (!Array.isArray(fencesId)) {
                fencesId = fencesId ? [fencesId] : [];
            }
            var allFences = (0, _deepAssign2.default)({}, this.fences, this.tempFences);
            var _iteratorNormalCompletion34 = true;
            var _didIteratorError34 = false;
            var _iteratorError34 = undefined;

            try {
                for (var _iterator34 = fencesId[Symbol.iterator](), _step34; !(_iteratorNormalCompletion34 = (_step34 = _iterator34.next()).done); _iteratorNormalCompletion34 = true) {
                    var fenceId = _step34.value;

                    var shape = allFences[fenceId].shape;
                    var fenceTitleLabel = this.fenceTitleLabels[fenceId];
                    this.map.removeOverlay(fenceTitleLabel);
                    this.map.removeOverlay(shape);
                    delete this.shapes[shape.id];
                    var shapeIdIndex = this.shapesId.indexOf(shape.id);
                    if (shapeIdIndex !== -1) {
                        this.shapesId.splice(shapeIdIndex + 1);
                    }
                    delete this.tempFences[fenceId];
                    delete this.fenceTitleLabels[fenceId];
                }
            } catch (err) {
                _didIteratorError34 = true;
                _iteratorError34 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion34 && _iterator34.return) {
                        _iterator34.return();
                    }
                } finally {
                    if (_didIteratorError34) {
                        throw _iteratorError34;
                    }
                }
            }

            var _iteratorNormalCompletion35 = true;
            var _didIteratorError35 = false;
            var _iteratorError35 = undefined;

            try {
                for (var _iterator35 = fencesId[Symbol.iterator](), _step35; !(_iteratorNormalCompletion35 = (_step35 = _iterator35.next()).done); _iteratorNormalCompletion35 = true) {
                    var _fenceId = _step35.value;

                    delete allFences[_fenceId];
                }
            } catch (err) {
                _didIteratorError35 = true;
                _iteratorError35 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion35 && _iterator35.return) {
                        _iterator35.return();
                    }
                } finally {
                    if (_didIteratorError35) {
                        throw _iteratorError35;
                    }
                }
            }

            this.debugValues("detachFences_end", { fencesId: fencesId }, "shapes", "shapesId", "fences", "tempFences");
            this.setMenuItems();
        },
        getItemsInShape: function getItemsInShape(shape, scopeItems) {
            var results = [];
            var _iteratorNormalCompletion36 = true;
            var _didIteratorError36 = false;
            var _iteratorError36 = undefined;

            try {
                for (var _iterator36 = scopeItems[Symbol.iterator](), _step36; !(_iteratorNormalCompletion36 = (_step36 = _iterator36.next()).done); _iteratorNormalCompletion36 = true) {
                    var scopeItem = _step36.value;

                    var isInShape = this.isInShape(scopeItem, shape);
                    if (isInShape) {
                        results.push(scopeItem);
                    }
                }
            } catch (err) {
                _didIteratorError36 = true;
                _iteratorError36 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion36 && _iterator36.return) {
                        _iterator36.return();
                    }
                } finally {
                    if (_didIteratorError36) {
                        throw _iteratorError36;
                    }
                }
            }

            return results;
        },
        isInShape: function isInShape(item, shape) {
            var isInShape = false;
            switch (shape.shapeMode) {
                case "circle":
                    isInShape = this.GeoUtils.isPointInCircle(new BMap.Point(item.x, item.y), shape);
                    break;
                case "rectangle":
                    isInShape = shape.containPoint(new BMap.Point(item.x, item.y));
                    break;
                case "polygon":
                    isInShape = this.GeoUtils.isPointInPolygon(new BMap.Point(item.x, item.y), shape);
                    break;
            }
            return isInShape;
        },
        traceHandler: function traceHandler(item) {
            if (item.name === "trace") {
                this.mouseOnTarget = "map";
                this.setCurrentMode("traceMode");
                this.setMenuItems();
            } else if (item.name === "trace_play") {
                this.tracePlayer("start");
            } else if (item.name === "trace_pause") {
                this.tracePlayer("pause");
                this.setMenuItems();
            }
        },
        request: function request(name, _ref, params, timeout) {
            var resolved = _ref.resolved,
                continued = _ref.continued,
                rejected = _ref.rejected,
                error = _ref.error;

            var self = this;
            self.bufferItems(self.selectedItemsIdUnsorted, true);
            self.setMenuItems();(function (selectedItemsIdUnsorted) {
                self.mapEventManager.mapEvent.emit("request" + name[0].toUpperCase() + name.slice(1), self.items, (0, _deepAssign2.default)({ selectedItemsId: self.selectedItemsIdUnsorted, currentMode: self.currentMode }, params), function (status, reply) {
                    self.bufferItems(selectedItemsIdUnsorted, false);
                    self.setMenuItems();
                    if (status === "resolved" && typeof resolved === "function") {
                        resolved(reply);
                    } else if (status === "continued" && typeof continued === "function") {
                        continued(reply);
                    } else if (status === "rejected" && typeof rejected === "function") {
                        rejected(reply);
                    } else if (status === "error" && typeof error === "function") {
                        error(reply);
                    }
                    if (status !== "continued") {
                        selectedItemsIdUnsorted = null;
                    }
                }, timeout);
            })(self.selectedItemsIdUnsorted);
        },
        tracePlayer: function tracePlayer(cmd, speed) {
            var self = this;
            if (cmd === "start" && !self.tracePlaying) {
                self.request("trace", {
                    resolved: function resolved() {
                        self.trace = reply.trace;
                        self.playingTraceItem = self.markerOverlays[selectedItemsIdUnsorted].item;
                        self.bkupItems(self.playingTraceItem);
                        self.tracePlayer("start");
                    },
                    continued: function continued() {
                        var _self$trace;

                        (_self$trace = self.trace).push.apply(_self$trace, _toConsumableArray(reply.trace));
                    }
                });
                self.tracePlaying = true;
                return;
            }
            self[cmd + "PlayingTrace"](speed);
        },
        startPlayingTrace: function startPlayingTrace() {
            var speed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;

            var self = this;
            var k = progress || self.playingProgress;
            self.tracePlayingId = setTimeout(function playing() {
                self.setPosition(self.playingTraceItem, self.trace[k].x, self.trace[k].y);
                self.map.panTo(new BMap.Point(self.trace[k].x, self.trace[k].y));
                k++;
                self.playingProgress = k;
                if (k < trace.length) {
                    self.tracePlayingId = setTimeout(playing, 2000);
                } else {
                    self.stopPlayingTrace(item);
                }
            }, 2000);
        },
        pausePlayingTrace: function pausePlayingTrace() {
            this.tracePausing = true;
            clearTimeout(this.tracePlayingId);
            this.$emit("pausePlayingTrace");
        },
        stopPlayingTrace: function stopPlayingTrace() {
            this.tracePlaying = false;
            this.tracePausing = false;
            this.playingProgress = 0;
            clearTimeout(this.tracePlayingId);
            this.tracePlayingId = "";
            var bkupItem = this.bkupItemsPos[this.playingTraceItem.id];
            this.map.panTo(new BMap.Point(bkupItem.x, bkupItem.y));
            this.restoreItems(this.playingTraceItem.id);
            this.playingTraceItem = null;
            this.$emit("stopPlayingTrace");
        },
        trackHandler: function trackHandler(item) {
            if (item.name === "track") {
                this.mouseOnTarget = "map";
                this.setCurrentMode("trackMode");
                this.setMenuItems();
            } else if (item.name === "track_start") {
                this.tracePlayer("start");
            } else if (item.name === "track_stop") {
                this.tracePlayer("stop");
                this.setMenuItems();
            }
        },
        locateHandler: function locateHandler(item) {
            if (item.name === "locate_mypos") {
                this.locateToPos("browser");
            } else if (item.name === "locate_devicepos") {
                var self = this;
                self.mapEventManager.mapEvent.emit(eventName, null, {}, function (status, reply) {
                    if (status === "resolved") {
                        this.locateToPos("point", false, { lng: reply.x, lat: reply.y });
                    }
                });
            }
        },
        locateToPos: function locateToPos() {
            var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "ip";
            var marker = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
            var point = arguments[2];

            var self = this;
            self.map.removeOverlay(self.locatingMarker);
            switch (mode) {
                case "browser":
                    var geolocation = new BMap.Geolocation();
                    geolocation.getCurrentPosition(function (r) {
                        if (this.getStatus() === BMAP_STATUS_SUCCESS) {

                            self.locatingMarker = self.markToPos(r.point, marker);
                            point = r.point;
                        } else {
                            alert('failed' + this.getStatus());
                        }
                    }, { enableHighAccuracy: true });
                    break;
                case "ip":
                    var myCity = new BMap.LocalCity({ autoViewport: true });
                    myCity.get(function (r) {
                        self.locatingMarker = self.markToPos(r.center, marker);
                        point = r.center;
                    });
                    break;
                case "point":
                    point = new BMap.Point(point.lng, point.lat);
                    self.locatingMarker = self.markToPos(point, marker);
                    break;
            }
            self.map.setCenter(point);
        },
        markToPos: function markToPos(point, marker) {
            if (marker) {
                var mk = new BMap.Marker(point);
                this.map.addOverlay(mk);
            }
            this.map.panTo(point);
            return mk;
        },
        toolboxHandler: function toolboxHandler(item) {
            if (item.name === "measure") {
                this.openDisTool();
            } else if (item.name === "share") {}
        },
        openDisTool: function openDisTool() {
            this.DistanceTool.open();
            this.correctDistanceTool();
        },
        correctDistanceTool: function correctDistanceTool() {
            var $rulerDom = $('div[style*="ruler"]');
            if (!this.rulerDom) {
                this.rulerDom = $rulerDom.get(0);
            }
            $rulerDom.css("top", "-" + this.getOffsetTop(this.rulerDom) + "px");
        },
        configHandler: function configHandler(item) {
            if (!item.type || item.type === "button") {
                this[item.name](item);
            } else {
                var check = "value";
                var checked = "checked";
                var unchecked = "";
                var configs = this.menubarInst.$props.items[2];
                var _iteratorNormalCompletion37 = true;
                var _didIteratorError37 = false;
                var _iteratorError37 = undefined;

                try {
                    for (var _iterator37 = configs.children[Symbol.iterator](), _step37; !(_iteratorNormalCompletion37 = (_step37 = _iterator37.next()).done); _iteratorNormalCompletion37 = true) {
                        var config = _step37.value;

                        if (config.name === item.name) {
                            if (typeof item.handler === "function") {
                                item.handler(config[check]);
                            } else {
                                this[config.name](config[check]);
                            }
                            this.topStatics[2] = configs;
                        }
                    }
                } catch (err) {
                    _didIteratorError37 = true;
                    _iteratorError37 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion37 && _iterator37.return) {
                            _iterator37.return();
                        }
                    } finally {
                        if (_didIteratorError37) {
                            throw _iteratorError37;
                        }
                    }
                }
            }
        },
        enableDisplayItemsLabel: function enableDisplayItemsLabel(checked) {
            var _iteratorNormalCompletion38 = true;
            var _didIteratorError38 = false;
            var _iteratorError38 = undefined;

            try {
                for (var _iterator38 = this.items[Symbol.iterator](), _step38; !(_iteratorNormalCompletion38 = (_step38 = _iterator38.next()).done); _iteratorNormalCompletion38 = true) {
                    var _item4 = _step38.value;

                    var mkol = this.markerOverlays[_item4.id];
                    var label = mkol.label;
                    checked ? label.show() : label.hide();
                }
            } catch (err) {
                _didIteratorError38 = true;
                _iteratorError38 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion38 && _iterator38.return) {
                        _iterator38.return();
                    }
                } finally {
                    if (_didIteratorError38) {
                        throw _iteratorError38;
                    }
                }
            }
        },
        onMoreOptions: function onMoreOptions() {
            var check = "value";
            var checked = "checked";
            var formFields = this.topStatics[2].children.slice(0, -1);
            var formFieldsData = {};
            for (var i = 0; i < formFields.length; i++) {
                formFieldsData[formFields[i].name] = formFields[i][check] ? "checked" : "";
            }
            var props = { formFields: formFields, formFieldsData: formFieldsData };
            this.createDialog(props);
            this.dialogOnMap.show();
        },
        createDialog: function createDialog(props) {
            this.dialogOnMap = new _dialog.RichDialog(this.dialogOptions, props);
        },
        applyConfigs: function applyConfigs() {
            var localConfigs = this.getConfigsFromLocal();
            (0, _deepAssign2.default)(this.meta, localConfigs.meta);
            (0, _deepAssign2.default)(this.data, localConfigs.data);
        },
        getConfigsFromLocal: function getConfigsFromLocal() {
            var localConfigs = {};
            localConfigs.meta = {};
            localConfigs.data = {};
            return localConfigs;
        },
        refreshHandler: function refreshHandler() {
            this.$emit("refresh", this);
        },
        searchHandler: function searchHandler(item) {
            this.searchByInternal(item.text);
        },
        searchByInternal: function searchByInternal(content) {
            var results = this.searchSource.filter(function (s) {
                return s.title === content;
            });
            results[0] ? this.locateToPos("point", true, results[0].point) : "";
        },
        searchByExternal: function searchByExternal(content) {
            var self = this;
            self.mapEventManager.mapEvent.emit("search", self.items, { content: content, map: self.map }, function (status, reply) {
                if (status === "resolved") {
                    self.locateToPos("point", false, reply.point);
                } else if (status === "continued") {} else if (status === "rejected") {} else if (status === "error") {}
                if (status !== "continued") {}
            });
        },
        attributeHandler: function attributeHandler(item) {
            var event = {
                targetItems: this.getItemsbyIds(this.selectedItemsIdUnsorted),
                currentMode: this.currentMode
            };
            this.$emit("viewProperty", event);
        },
        selectHandler: function selectHandler(item) {},
        markHandler: function markHandler(item) {
            var markerIcon = new BMap.Icon(item.markerIcon.url, new (Function.prototype.bind.apply(BMap.Size, [null].concat(_toConsumableArray(item.markerIcon.size))))());
            markerIcon.menubarClickedItem = item;

            this.markerTool.setIcon(markerIcon);
            this.markerTool._followLabel = new BMap.Label(item.followText || this.baiduMapMeta.markerOpts.followText, { offset: new BMap.Size(20, 0) });

            this.markerTool.open();

            this.correctMarkerTool();
        },
        correctMarkerTool: function correctMarkerTool() {
            var a = a || {
                guid: "$BAIDU$"
            };
            var c = this.markerTool;
            var self = this;
            c._map.removeEventListener("mousemove", c._mouseMoveHandler);
            c._mouseMoveHandler = function (d) {
                var pixel = c._map.pointToPixel(d.point);pixel.y = pixel.y + self.getOffsetTop(self.svgDom || self.rulerDom);
                var e = c._map.pixelToPoint(pixel);
                c._followMarker.setIcon(c._opts.icon);
                c._followMarker.setPosition(e);
                c._followMarker.setLabel(c._followLabel);
                c._followMarker.show();
            };
            c._map.addEventListener("mousemove", c._mouseMoveHandler);
        },
        getOffsetTop: function getOffsetTop(target) {
            var offsetTop = 0;

            var p = target ? target.parentElement : undefined;
            while (p) {
                if (p && Number.isInteger(parseInt($(p).css("top")))) {
                    offsetTop = parseInt($(p).css("top"));
                }
                p = p.parentElement;
            }

            return offsetTop;
        },
        clearHandler: function clearHandler(item) {
            if (this.currentMode === "select") {}
        },
        cancelHandler: function cancelHandler(item) {
            this.generallyCancel();
        },
        generallyCancel: function generallyCancel() {
            this.mouseOnTarget = "map";
            this.currentItem = null;
            this.currentShape = null;
            this.clearSelectedItems();
            this.clearSelectedShapes();

            this.setMenuItems();
            this.showContextMenu = false;
        },
        deleteHandler: function deleteHandler(item) {},
        lockHandler: function lockHandler(item) {},
        unlockHandler: function unlockHandler(item) {},
        onKeyupEsc: function onKeyupEsc() {
            this.mouseOnTarget = "map";
            this.generallyCancel();
            this.closeAllTools();
        },
        closeAllTools: function closeAllTools() {
            this.drawingManager.close();
            this.markerTool.close();
        },
        genModeName: function genModeName() {},
        setCurrentMode: function setCurrentMode(mode) {
            if (mode === "defaultMode") {
                this.currentMode = "defaultMode";
                this.closeAllTools();
            } else {
                this.currentMode = mode;
            }
        },
        modeHandler: function modeHandler(item) {},
        generateUUID: function generateUUID() {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
            });
            return uuid;
        },
        isEmpty: function isEmpty(obj) {
            for (var k in obj) {
                return false;
            }
            return true;
        },
        itemIndex: function itemIndex(items, id) {
            var c = 0;
            var _iteratorNormalCompletion39 = true;
            var _didIteratorError39 = false;
            var _iteratorError39 = undefined;

            try {
                for (var _iterator39 = items[Symbol.iterator](), _step39; !(_iteratorNormalCompletion39 = (_step39 = _iterator39.next()).done); _iteratorNormalCompletion39 = true) {
                    var o = _step39.value;

                    if (o.id === id) {
                        return c;
                    }
                    c++;
                }
            } catch (err) {
                _didIteratorError39 = true;
                _iteratorError39 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion39 && _iterator39.return) {
                        _iterator39.return();
                    }
                } finally {
                    if (_didIteratorError39) {
                        throw _iteratorError39;
                    }
                }
            }
        },
        debugValues: function debugValues(title) {
            var _console;

            var input = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            if (!this.baiduMapMeta.debug) {
                return;
            }
            title = "--------" + title + "--------";

            for (var _len = arguments.length, props = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                props[_key - 2] = arguments[_key];
            }

            props.unshift.apply(props, ["inputAsBelow"].concat(_toConsumableArray(Object.keys(input)), ["inputAsAbove"]));
            var template = "\n\t";
            var values = [];
            for (var i in props) {
                var key = props[i];
                var val = this[key] ? this[key] : key;
                val = this.washVal(val);
                template += (!key.startsWith("input") ? "\n\t" : "\n") + key + "\t: %s";
                values.push(val);
            }
            (_console = console).debug.apply(_console, [title + template].concat(values));
        },
        washVal: function washVal(val) {
            try {
                return Array.isArray(val) ? val.join("; ") : typeof val === "string" ? val : Object.keys(val).join("; ");
            } catch (e) {
                return "";
            }
        },
        getItemsbyIds: function getItemsbyIds(ids) {
            if (!Array.isArray(ids)) {
                ids = ids ? [ids] : [];
            }
            var items = [];
            var _iteratorNormalCompletion40 = true;
            var _didIteratorError40 = false;
            var _iteratorError40 = undefined;

            try {
                for (var _iterator40 = ids[Symbol.iterator](), _step40; !(_iteratorNormalCompletion40 = (_step40 = _iterator40.next()).done); _iteratorNormalCompletion40 = true) {
                    var id = _step40.value;

                    var mkol = this.markerOverlays[id];
                    items.push(mkol.item);
                }
            } catch (err) {
                _didIteratorError40 = true;
                _iteratorError40 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion40 && _iterator40.return) {
                        _iterator40.return();
                    }
                } finally {
                    if (_didIteratorError40) {
                        throw _iteratorError40;
                    }
                }
            }

            return items;
        }
    },
    created: function created() {
        this.init();
    },
    mounted: function mounted() {
        this.loadBaiduMap();

        var self = this;
        $(document).keyup(function (e) {
            if (e.keyCode == 27) {
                self.onKeyupEsc();
            }
        });
    }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-09f709d0\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/contextmenu.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.contextmenu[data-v-09f709d0] {\n  position: fixed; /* 这里不能是 absolute */\n  background-color: white;\n  border-radius: 2px;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-236629d7\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/richmap/map.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports
exports.i(__webpack_require__("./node_modules/css-loader/index.js!./src/components/richmap/baidumap.css"), "");

// module
exports.push([module.i, "\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-236629d7\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/components/richmap/map.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n   /* @import url(\"./iconfont.css\")*/\n.vue-baidumap {\n        height: 100%;\n        position: relative;\n}\n.vue-baidumap .map {\n        width: 100%;\n        height: 100%;\n        overflow: hidden;\n        margin:0;\n}\n.vue-baidumap > .map.baidumap > .menubar.BMap_noprint.anchorTL > .menubar {  /* menubar vue */\n        background-color: #2185D0;\n}\n.vue-baidumap > .map.baidumap > .menubar.BMap_noprint.anchorTL > .menubar > .item,\n    .vue-baidumap > .map.baidumap > .menubar.BMap_noprint.anchorTL > .menubar > .right.menu > .item {\n        color: #fff!important;\n}\n.vue-baidumap > .map.baidumap > .menubar.BMap_noprint.anchorTL > .menubar > .disabled.item,\n    .vue-baidumap > .map.baidumap > .menubar.BMap_noprint.anchorTL > .menubar > .right.menu > .disabled.item {\n        color: #006bbb!important;\n}\n.vue-baidumap .menubar i.icon,\n    .vue-baidumap .ui.menu .ui.dropdown .menu>.item .icon:not(.dropdown) {\n        font-size: 1.2em!important;\n}\n.vue-baidumap .menubar .item:last-child {\n        border-left: 1px solid rgba(34,36,38,.1);\n}\n\n    /* infoWindow 圆角 */\n.vue-baidumap .BMap_pop > div:nth-child(1) > div,\n    .vue-baidumap .BMap_pop > div:nth-child(3) > div,\n    .vue-baidumap .BMap_pop > div:nth-child(5) > div,\n    .vue-baidumap .BMap_pop > div:nth-child(7) > div {\n        border-radius: 5px;\n}\n.vue-baidumap .BMap_bubble_content img {\n        margin-left: auto; \n        margin-right: auto; \n        display: block;\n}\n.vue-baidumap .BMap_bubble_content .timeout {\n        text-align: center;\n        color: gray;\n}\n.vue-baidumap .BMap_noprint.anchorTL:not(.menubar),\n    .vue-baidumap .BMap_noprint.anchorTR:not(.menubar) {\n        z-index: 9!important;  /* 避免挡住工具条 */\n}\n.vue-baidumap .ui.vertical.menu .item {\n        min-width: 120px;\n}\n.vue-baidumap .ui.vertical.menu .item > i.icon {\n        float: left;\n        margin: 0 5px 0 0\n}\n\n\n/*\n    .vue-baidumap .icon {\n       /* 通过设置 font-size 来改变图标大小 \n        width: 1em; height: 1em;\n        /* 图标和文字相邻时，垂直对齐 \n        vertical-align: -0.15em;\n        /* 通过设置 color 来改变 SVG 的颜色/fill \n        fill: currentColor;\n        /* path 和 stroke 溢出 viewBox 部分在 IE 下会显示\n            normalize.css 中也包含这行 \n        overflow: hidden;\n    }\n\n    /*工具条旧方案\n    .vue-baidumap .ui.buttons.toolbar {\n        position: absolute;\n        top: 1%;\n        left: 1%;\n    }\n\n    .vue-baidumap .ui.buttons.toolbar .ui.button.tool,\n    .vue-baidumap .ui.buttons.toolbar .ui.button.tool:hover {\n        background: rgb(255, 255, 255);\n        color: rgb(255, 255, 255);\n    }\n\n    .vue-baidumap .ui.buttons.toolbar .ui.button.tool {\n        box-shadow: rgba(0, 0, 0, 0.35) 2px 2px 3px;\n        border-left: 1px solid rgb(139, 164, 220);\n        border-top: 1px solid rgb(139, 164, 220);\n        border-bottom: 1px solid rgb(139, 164, 220);\n    }\n\n    .vue-baidumap .ui.buttons.toolbar .ui.button.tool.active {\n        background-color: #8ea8e0;\n        /*background-color: #2279b5;\n        color: #ffffff;\n    }*/\n\n\n", ""]);

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

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-cfbb1e2c\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/apps/iptalk/map.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.map .ui.dropdown.item > .drto-config + .menubar.menu {\n\tmargin: 0 0 0 calc(-200px + 43px);  /* 下拉菜单默认是200宽，续左退43-200以免超出浏览器边界，其中43为下拉按钮的宽度 */\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-cfbb1e2c\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/map.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.map[data-v-cfbb1e2c],\n\t.map .left-panel[data-v-cfbb1e2c],\n\t.map .left-panel .tree[data-v-cfbb1e2c],\n\t.map .right-panel[data-v-cfbb1e2c] {\n\t\tposition: relative;\n}\n.map[data-v-cfbb1e2c],\n\t.map .left-panel[data-v-cfbb1e2c] {\n\t\theight: calc(100% - 1px);  /* 为了不挡住底边 1px 的 border */\n}\n.map .left-panel .tree[data-v-cfbb1e2c],\n\t.map .right-panel[data-v-cfbb1e2c] {\n\t\theight: 100%;\n}\n.map[data-v-cfbb1e2c] {\n\t    border-radius: 5px 0 0 5px;\n}\n.map .left-panel[data-v-cfbb1e2c] {\n\t\tfloat: left;\n\t\twidth: 250px;\n\t\toverflow:auto;\n\t    border-radius: 5px;\n}\n.map .left-panel .tree[data-v-cfbb1e2c],\n\t.map .right-panel[data-v-cfbb1e2c] {\n\t\tbackground-color: #fff;\n}\n.map .right-panel[data-v-cfbb1e2c] {\n\t\twidth: calc(100% - 250px);\n\t\tfloat: left;\n\t\t/*border-left: 1px solid #d9d9d9;\n\t\tborder-bottom: 1px solid #d9d9d9;*/\n\t\tborder-radius: 0 5px 5px 0;\n}\n.map .fade-enter-active[data-v-cfbb1e2c], .map .fade-leave-active[data-v-cfbb1e2c] {\n        transition: opacity 1s\n}\n.map .fade-enter[data-v-cfbb1e2c], .map .fade-leave-active[data-v-cfbb1e2c] {\n        opacity: 0\n}\n.map .showTip[data-v-cfbb1e2c] {\n        position: absolute;\n        top: 50%;\n        left: 50%;\n        color: white;\n        background: rgba(0,0,0,0.5);\n        border-radius: 4px;\n        padding: 1em;\n        cursor: pointer;\n}  \n", ""]);

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

/***/ "./node_modules/css-loader/index.js!./src/components/richmap/baidumap.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ".mapwrapper.fit{\r\n\tposition: absolute;\r\n\ttop:0px;\r\n\tleft:0px;\r\n\twidth: 100%;\r\n\theight:100%;\r\n}\r\n.baidumap {\r\n\tposition: absolute;\r\n  /*top:42px;*/\r\n\ttop:0px;\r\n\tleft:0px;\r\n\tright: 0px;\r\n\tbottom:0px;\r\n}\r\n.baidumap.fit{\r\n  top:0px;\r\n}\r\n.baidumap .marker{\r\n\tposition: absolute;\r\n}\r\n.baidumap .marker .ignored.ui.popup{\r\n\tposition: absolute;\r\n\tright :auto;\r\n\ttop :auto;\r\n\tbottom: 0px;\r\n  min-width: 300px;\r\n  left: -134px;/*150-32/2*/\r\n\tmax-width:1000px;/*覆盖原有320px*/\r\n\tpadding:2px;/*覆盖原有.833em 1em*/\r\n\tbox-shadow: 10px -10px 10px rgba(0,0,0,.4);\r\n  text-align: center;\r\n}\r\n.baidumap .marker .ignored.ui.popup:before{\r\n\tz-index: -1;\r\n}\r\n.baidumap .marker .ignored.ui.popup .loadingtext{\r\n\twhite-space:nowrap;/*强制不换行*/\r\n}\r\n/*点*/\r\n.baidumap .marker > div > .pointer{\r\n\tposition: absolute;\r\n\ttop:40px;\r\n    left:12px;\r\n\twidth:8px;\r\n\theight:8px;\r\n\tborder-radius:4px;\r\n}\r\n.baidumap .marker > div > .pointer:before{\r\n\tcontent: attr(title);\r\n\tposition: absolute;\r\n\ttop:12px;\r\n  background:none;\r\n  padding:2px;\r\n\twhite-space:nowrap;\r\n\tfont-family:\"\\5B8B\\4F53\";\r\n\tfont-size: 12px;\r\n\tleft: 50%;\r\n\twidth: 200px;\r\n\tmargin-left: -100px;\r\n\ttext-align: center;\r\n}\r\n@-webkit-keyframes marker {\r\n    0% {\r\n      -webkit-transform : scale(1);\r\n      transform         : scale(1);\r\n      opacity           : 0;\r\n    }\r\n    15% {\r\n      opacity : 1;\r\n    }\r\n\r\n    100% {\r\n      -webkit-transform : scale(3);\r\n      transform         : scale(3);\r\n      opacity           : 0;\r\n    }\r\n\t}\r\n@-moz-keyframes marker {\r\n    0% {\r\n      -webkit-transform : scale(1);\r\n      transform         : scale(1);\r\n      opacity           : 0;\r\n    }\r\n    15% {\r\n      opacity : 1;\r\n    }\r\n\r\n    100% {\r\n      -webkit-transform : scale(3);\r\n      transform         : scale(3);\r\n      opacity           : 0;\r\n    } \r\n}\r\n\r\n@keyframes marker {\r\n    0% {\r\n      -webkit-transform           : scale(1);\r\n      transform                   : scale(1);\r\n      opacity                     : 0; \r\n    }\r\n    15% {\r\n      opacity                     : 1; \r\n    }\r\n    100% {\r\n      -webkit-transform           : scale(3);\r\n      transform                   : scale(3);\r\n      opacity                     : 0; \r\n    } \r\n}\r\n.baidumap .marker > div > .baiduicon{\r\n    position      : absolute;\r\n    top           : 0px;\r\n    left          : 0px;\r\n    width         : 32px;\r\n    height        : 32px;\r\n    border-radius : 16px;\r\n    background    : white;\r\n    -webkit-box-shadow: 0px 0px 4px #555;\r\n    -moz-box-shadow: 0px 0px 4px #555;\r\n    box-shadow: 0px 0px 4px #555;\r\n    cursor: pointer;\r\n}\r\n.baidumap .marker > div > .baiduicon.active {   \r\n/*  -webkit-transform : translateY(-30px);\r\n    -moz-transform    : translateY(-30px);\r\n    transform         : translateY(-30px);*/\r\n}\r\n/*文字部分*/\r\n.baidumap .marker > div > .baiduicon > .title{\r\n\tposition:absolute;\r\n\tleft: 36px;\r\n\ttop: 6px;\r\n\tsize : 12px;\r\n\theight : 20px;\r\n\tline-height : 20px;\r\n\tfont-family:\"\\5B8B\\4F53\";\r\n\twhite-space:nowrap;/*强制不换行*/\r\n}\r\n.baidumap .marker > div > .baiduicon > div.waving{\r\n    position      : absolute;\r\n    box-sizing    : border-box;\r\n    width         : 32px;\r\n    height        : 32px;\r\n    border-radius : 100%;\r\n    margin        : 0px;\r\n}\r\n.baidumap .marker > div > .baiduicon:hover > div.waving{\r\n    border                      : 1px solid #DDD;\r\n    -webkit-animation-fill-mode : both;\r\n    animation-fill-mode         : both;\r\n    opacity                     : 0;\r\n    -webkit-animation           : marker 1s 0s linear infinite;\r\n    -moz-animation              : marker 1s 0s linear infinite;\r\n    animation                   : marker 1s 0s linear infinite;\r\n}\r\n.baidumap .marker > div > .baiduicon.active > div.waving{\r\n    border                      : 1px solid #DDD;\r\n    -webkit-animation-fill-mode : both;\r\n    animation-fill-mode         : both;\r\n    opacity                     : 0;\r\n    -webkit-animation           : marker 1s 0s linear infinite;\r\n    -moz-animation              : marker 1s 0s linear infinite;\r\n    animation                   : marker 1s 0s linear infinite;\r\n}\r\n.baidumap .marker > div > .baiduicon.active > div.waving:nth-child(2) {\r\n    -webkit-animation-delay : 0.3s;\r\n    -moz-animation-delay    : 0.3s;\r\n    animation-delay         : 0.3s;\r\n}\r\n.baidumap .marker > div > .baiduicon.active > div.waving:nth-child(3) {\r\n    -webkit-animation-delay : 0.8s;\r\n    -moz-animation-delay    : 0.8s;\r\n    animation-delay         : 0.8s;\r\n}\r\n.baidumap .marker > div > .baiduicon > div.selected{\r\n    position      : absolute;\r\n    box-sizing    : border-box;\r\n    width         : 32px;\r\n    height        : 32px;\r\n    margin        : 0px;\r\n    border-width  : 2px;\r\n    border-style  : dashed;\r\n}\r\n.baidumap .marker > div > .baiduicon:after{\r\n    content       : \"\";\r\n    position      : absolute;\r\n    display       : block;\r\n    top           : 98%;\r\n    width         : 8px;\r\n    height        : 16px;\r\n    left          : 12px;\r\n    border-top    : 8px solid white;\r\n    border-bottom : 8px solid transparent;\r\n    border-left   : 4px solid transparent;\r\n    border-right  : 4px solid transparent;\r\n    box-sizing    : border-box;\r\n}\r\n.baidumap .marker > div > .baiduicon:before{\r\n    content       : \"\";\r\n    display       : block;\r\n    position      : absolute;\r\n    top           : 3px;\r\n    left          : 3px;\r\n    width         : 26px;\r\n    height        : 26px;\r\n    border-radius : 13px;\r\n    background    : white;\r\n    border        : 1px solid #AAA;\r\n    box-sizing    : border-box;\r\n}\r\n.baidumap .marker > div > .baiduicon>img{\r\n\tposition      : absolute;\r\n\ttop           : 4px;\r\n\tleft          : 4px;\r\n\twidth         : 24px;\r\n\theight        : 24px;\r\n\tborder-radius : 12px;\r\n  }\r\n.baidumap .marker > div > .baiduicon:hover{\r\n    -moz-box-shadow: 0px 0px 55px #d6d6d6;\r\n    -webkit-box-shadow: 0px 0px 55px #d6d6d6;\r\n    box-shadow: 0px 0px 55px #d6d6d6,0px 2px 2px #555;\r\n}\r\n/*选择*/\r\n.baidumap .marker > div > .baiduicon.selected{\r\n    -webkit-box-shadow: inset 0px 1px 4px #555;\r\n    -moz-box-shadow: inset 0px 1px 4px #555;\r\n    box-shadow: inset 0px 1px 4px #555;\r\n}\r\n\r\n/*影响范围*/\r\n@keyframes  marker_scope {\r\n    0% {\r\n      -webkit-transform           : scale(1);\r\n      transform                   : scale(1);\r\n      opacity                     : 0; \r\n    }\r\n    15% {\r\n      opacity                     : 1; \r\n    }\r\n    100% {\r\n      -webkit-transform           : scale(3);\r\n      transform                   : scale(3);\r\n      opacity                     : 1; \r\n    } \r\n}\r\n.baidumap .marker > div > .baiduicon:before:before{\r\n    position: absolute;\r\n    display: block;\r\n    top:0px;\r\n    left:0px;\r\n    height:300%;\r\n    height:300%;\r\n    border:1px solid blue;\r\n    box-sizing:border-box;\r\n}\r\n.baidumap .marker > div .light{\r\n  opacity: 0.75;\r\n}\r\n\r\n.baidumap .marker > div .red{background: #DB2828;}\r\n.baidumap .marker > div .orange{background: #F2711C;}\r\n.baidumap .marker > div .yellow{background: #FBBD08;}\r\n.baidumap .marker > div .olive{background: #B5CC18;}\r\n.baidumap .marker > div .green{background: #21BA45;}\r\n.baidumap .marker > div .teal{background: #00B5AD;}\r\n.baidumap .marker > div .blue{background: #2185D0;}\r\n.baidumap .marker > div .violet{background: #6435C9;}\r\n.baidumap .marker > div .purple{background: #A333C8;}\r\n.baidumap .marker > div .pink{background: #E03997;}\r\n.baidumap .marker > div .brown{background: #A5673F;}\r\n.baidumap .marker > div .grey{background: #767676;}\r\n.baidumap .marker > div .black{background: #1B1C1D;}\r\n\r\n.baidumap .marker > div .active.red > div.waving{border : 1px solid #DB2828;}\r\n.baidumap .marker > div .active.orange > div.waving{border : 1px solid #F2711C;}\r\n.baidumap .marker > div .active.yellow > div.waving{border : 1px solid #FBBD08;}\r\n.baidumap .marker > div .active.olive > div.waving{border : 1px solid #B5CC18;}\r\n.baidumap .marker > div .active.green > div.waving{border : 1px solid #21BA45;}\r\n.baidumap .marker > div .active.teal > div.waving{border : 1px solid #00B5AD;}\r\n.baidumap .marker > div .active.blue > div.waving{border : 1px solid #2185D0;}\r\n.baidumap .marker > div .active.violet > div.waving{border : 1px solid #6435C9;}\r\n.baidumap .marker > div .active.purple > div.waving{border : 1px solid #A333C8;}\r\n.baidumap .marker > div .active.pink > div.waving{border : 1px solid #E03997;}\r\n.baidumap .marker > div .active.brown > div.waving{border : 1px solid #A5673F;}\r\n.baidumap .marker > div .active.grey > div.waving{border : 1px solid #767676;}\r\n.baidumap .marker > div .active.grey > div.waving{border : 1px solid #767676;}\r\n.baidumap .marker > div .active.black > div.waving{border : 1px solid #1B1C1D;}\r\n\r\n.baidumap .marker > div .red:after{border-top : 8px solid #DB2828;}\r\n.baidumap .marker > div .orange:after{border-top : 8px solid #F2711C;}\r\n.baidumap .marker > div .yellow:after{border-top : 8px solid #FBBD08;}\r\n.baidumap .marker > div .olive:after{border-top : 8px solid #B5CC18;}\r\n.baidumap .marker > div .green:after{border-top : 8px solid #21BA45;}\r\n.baidumap .marker > div .teal:after{border-top : 8px solid #00B5AD;}\r\n.baidumap .marker > div .blue:after{border-top : 8px solid #2185D0;}\r\n.baidumap .marker > div .violet:after{border-top : 8px solid #6435C9;}\r\n.baidumap .marker > div .purple:after{border-top : 8px solid #A333C8;}\r\n.baidumap .marker > div .pink:after{border-top : 8px solid #E03997;}\r\n.baidumap .marker > div .brown:after{border-top : 8px solid #A5673F;}\r\n.baidumap .marker > div .grey:after{border-top : 8px solid #767676;}\r\n.baidumap .marker > div .black:after{border-top : 8px solid #1B1C1D;}\r\n\r\n.baidumap .marker > div .red > div.selected{border : 2px dashed #DB2828;}\r\n.baidumap .marker > div .orange > div.selected{border : 2px dashed #F2711C;}\r\n.baidumap .marker > div .yellow > div.selected{border : 2px dashed #FBBD08;}\r\n.baidumap .marker > div .olive > div.selected{border : 2px dashed #B5CC18;}\r\n.baidumap .marker > div .green > div.selected{border : 2px dashed #21BA45;}\r\n.baidumap .marker > div .teal > div.selected{border : 2px dashed #00B5AD;}\r\n.baidumap .marker > div .blue > div.selected{border : 2px dashed #2185D0;}\r\n.baidumap .marker > div .violet > div.selected{border : 2px dashed #6435C9;}\r\n.baidumap .marker > div .purple > div.selected{border : 2px dashed #A333C8;}\r\n.baidumap .marker > div .pink > div.selected{border : 2px dashed #E03997;}\r\n.baidumap .marker > div .brown > div.selected{border : 2px dashed #A5673F;}\r\n.baidumap .marker > div .grey > div.selected{border : 2px dashed #767676;}\r\n.baidumap .marker > div .grey > div.selected{border : 2px dashed #767676;}\r\n.baidumap .marker > div .black > div.selected{border : 2px dashed #1B1C1D;}", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./src/components/richmap/icons/iconfont.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n@font-face {font-family: \"iconfont\";\n  src: url(" + __webpack_require__("./src/components/richmap/icons/iconfont.eot?t=1524124485646") + "); /* IE9*/\n  src: url(" + __webpack_require__("./src/components/richmap/icons/iconfont.eot?t=1524124485646") + "#iefix) format('embedded-opentype'), \n  url('data:application/x-font-woff;charset=utf-8;base64,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') format('woff'),\n  url(" + __webpack_require__("./src/components/richmap/icons/iconfont.ttf?t=1524124485646") + ") format('truetype'), \n  url(" + __webpack_require__("./src/components/richmap/icons/iconfont.svg?t=1524124485646") + "#iconfont) format('svg'); /* iOS 4.1- */\n}\n\n.iconfont {\n  font-family:\"iconfont\" !important;\n  font-size:16px;\n  font-style:normal;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.drto-action_2:before { content: \"\\E630\"; }\n\n.drto-share:before { content: \"\\E609\"; }\n\n.drto-more__three_dots:before { content: \"\\E622\"; }\n\n.drto-delete:before { content: \"\\E65E\"; }\n\n.drto-save:before { content: \"\\E63E\"; }\n\n.drto-check:before { content: \"\\E66C\"; }\n\n.drto-refresh:before { content: \"\\E77C\"; }\n\n.drto-more:before { content: \"\\E676\"; }\n\n.drto-cancel:before { content: \"\\E6DF\"; }\n\n.drto-circle:before { content: \"\\E606\"; }\n\n.drto-map_plain:before { content: \"\\E63D\"; }\n\n.drto-collection:before { content: \"\\E620\"; }\n\n.drto-show:before { content: \"\\E64C\"; }\n\n.drto-fence:before { content: \"\\E607\"; }\n\n.drto-suprise:before { content: \"\\E652\"; }\n\n.drto-in:before { content: \"\\E615\"; }\n\n.drto-cryingTVboy:before { content: \"\\E602\"; }\n\n.drto-edit:before { content: \"\\E657\"; }\n\n.drto-layer_device:before { content: \"\\E64B\"; }\n\n.drto-stop:before { content: \"\\E7B0\"; }\n\n.drto-move:before { content: \"\\E838\"; }\n\n.drto-locate:before { content: \"\\E640\"; }\n\n.drto-layer_geography:before { content: \"\\E673\"; }\n\n.drto-shutdown:before { content: \"\\E651\"; }\n\n.drto-unlock:before { content: \"\\E73A\"; }\n\n.drto-measure:before { content: \"\\E6C4\"; }\n\n.drto-map_3d:before { content: \"\\E604\"; }\n\n.drto-speaker:before { content: \"\\E7EC\"; }\n\n.drto-shape_edit:before { content: \"\\E654\"; }\n\n.drto-locate_mypos:before { content: \"\\E62E\"; }\n\n.drto-action:before { content: \"\\E6CA\"; }\n\n.drto-mic:before { content: \"\\E612\"; }\n\n.drto-polyline:before { content: \"\\E69D\"; }\n\n.drto-action_1:before { content: \"\\E629\"; }\n\n.drto-attribute:before { content: \"\\E61C\"; }\n\n.drto-cry:before { content: \"\\E601\"; }\n\n.drto-exit:before { content: \"\\E649\"; }\n\n.drto-fence_add:before { content: \"\\E688\"; }\n\n.drto-safebox:before { content: \"\\E6FA\"; }\n\n.drto-config:before { content: \"\\E650\"; }\n\n.drto-hide:before { content: \"\\E69F\"; }\n\n.drto-fence_manage:before { content: \"\\E600\"; }\n\n.drto-select:before { content: \"\\E752\"; }\n\n.drto-toolbox:before { content: \"\\E627\"; }\n\n.drto-marker:before { content: \"\\E643\"; }\n\n.drto-trace:before { content: \"\\E6AC\"; }\n\n.drto-new:before { content: \"\\E69B\"; }\n\n.drto-lock:before { content: \"\\E786\"; }\n\n.drto-locate_devicepos:before { content: \"\\E65D\"; }\n\n.drto-drag:before { content: \"\\E64E\"; }\n\n.drto-finger:before { content: \"\\E653\"; }\n\n.drto-remove:before { content: \"\\E857\"; }\n\n.drto-search:before { content: \"\\E6C2\"; }\n\n.drto-rename:before { content: \"\\E644\"; }\n\n.drto-play:before { content: \"\\E8C8\"; }\n\n.drto-panel:before { content: \"\\E6C3\"; }\n\n.drto-clear:before { content: \"\\E608\"; }\n\n.drto-track_replay:before { content: \"\\E631\"; }\n\n.drto-polygon:before { content: \"\\E82D\"; }\n\n.drto-rectangle:before { content: \"\\E60A\"; }\n\n.drto-track:before { content: \"\\E646\"; }\n\n.drto-map_satellite:before { content: \"\\E6E2\"; }\n\n.drto-pause:before { content: \"\\E605\"; }\n\n.drto-shape:before { content: \"\\E60C\"; }\n\n.drto-switch:before { content: \"\\E6B6\"; }\n\n.drto-out:before { content: \"\\E61D\"; }\n\n.drto-gk680_alarm:before { content: \"\\E63F\"; }\n\n.drto-pad:before { content: \"\\E8CA\"; }\n\n", ""]);

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

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-09f709d0\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/components/contextmenu.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.show),
      expression: "show"
    }],
    staticClass: "contextmenu",
    style: (_vm.style)
  }, [_c('menubar', {
    attrs: {
      "items": _vm.items,
      "compact": true,
      "eventHub": _vm.eventHub,
      "vertical": true,
      "theme": _vm.theme,
      "shadow": true
    }
  })], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-09f709d0", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-236629d7\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/components/richmap/map.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "vue-baidumap",
    on: {
      "click": _vm.onclick,
      "mouseup": _vm.onmouseup
    }
  }, [_c('div', {
    staticClass: "map baidumap",
    attrs: {
      "id": _vm.baiduMapMeta.id
    }
  }), _vm._v(" "), _c('contextmenu', {
    attrs: {
      "show": _vm.showContextMenu,
      "event": _vm.contextmenuEvent,
      "items": _vm.contextmenuItems,
      "eventHub": "BMapMenuItemClick"
    }
  }), _vm._v(" "), _c('div', {
    class: ['ui dimmer inverted', _vm.loadingMap ? 'active' : '']
  }, [_c('div', {
    staticClass: "ui text loader"
  }, [_vm._v(_vm._s(_vm.L("加载中 ...")))])])], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-236629d7", module.exports)
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

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-cfbb1e2c\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/map.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "map"
  }, [_c('div', {
    staticClass: "left-panel"
  }, [_c('div', {
    staticClass: "tree"
  }, [_c('tree', {
    ref: "xmastree",
    attrs: {
      "language": "en",
      "url": _vm.urls.getIptalkTreeChildrenByID,
      "id": _vm.treeId,
      "dimensions": _vm.dimensions,
      "not-open": _vm.L("没有子节点", "iptalk"),
      "compaticableGridLayout": true,
      "setDragData": _vm.setDragData
    },
    on: {
      "on-item-click": _vm.onTreeItemClick
    }
  })], 1)]), _vm._v(" "), _c('div', {
    staticClass: "right-panel"
  }, [_c('bmap', {
    ref: "bmap",
    attrs: {
      "meta": _vm.baiduMapMeta,
      "data": _vm.baiduMapData,
      "items": _vm.devices
    },
    on: {
      "newItems": _vm.onNewItems,
      "removeItems": _vm.onRemoveItems,
      "modifyItems": _vm.onModifyItems,
      "moveItems": _vm.onMoveItems,
      "viewProperty": _vm.onViewItemsPropery,
      "search": _vm.onSearch
    }
  }), _vm._v(" "), _c('transition', {
    attrs: {
      "name": "fade"
    }
  }, [(_vm.showMapTip) ? _c('span', {
    staticClass: "showTip"
  }, [_vm._v(_vm._s(_vm.mapTip))]) : _vm._e()])], 1)])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-cfbb1e2c", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-09f709d0\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/contextmenu.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-09f709d0\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/contextmenu.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("1e793bff", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-09f709d0\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../utils/lang-loader.js!./contextmenu.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-09f709d0\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../utils/lang-loader.js!./contextmenu.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-236629d7\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/richmap/map.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-236629d7\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/richmap/map.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("24e58e50", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-236629d7\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../utils/lang-loader.js!./map.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-236629d7\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../utils/lang-loader.js!./map.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-236629d7\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/components/richmap/map.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-236629d7\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/components/richmap/map.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("161b2412", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-236629d7\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!../../../utils/lang-loader.js!./map.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-236629d7\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!../../../utils/lang-loader.js!./map.vue");
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

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-cfbb1e2c\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/apps/iptalk/map.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-cfbb1e2c\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/apps/iptalk/map.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("3ed28d84", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-cfbb1e2c\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!../../../utils/lang-loader.js!./map.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-cfbb1e2c\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!../../../utils/lang-loader.js!./map.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-cfbb1e2c\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/map.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-cfbb1e2c\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/map.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("5fdac354", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-cfbb1e2c\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../utils/lang-loader.js!./map.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-cfbb1e2c\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../utils/lang-loader.js!./map.vue");
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

/***/ "./src/apps/iptalk/map.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-cfbb1e2c\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/map.vue")
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-cfbb1e2c\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/apps/iptalk/map.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/map.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-cfbb1e2c\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/map.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-cfbb1e2c",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\iptalk\\map.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] map.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-cfbb1e2c", Component.options)
  } else {
    hotAPI.reload("data-v-cfbb1e2c", Component.options)
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

/***/ "./src/assets/images/loading.gif":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/loading.64d7c5.gif";

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

/***/ "./src/components/contextmenu.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-09f709d0\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/contextmenu.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/components/contextmenu.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-09f709d0\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/components/contextmenu.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-09f709d0",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\components\\contextmenu.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] contextmenu.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-09f709d0", Component.options)
  } else {
    hotAPI.reload("data-v-09f709d0", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/components/richmap/MapEventManager.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MapEventManager = function MapEventManager(vueInstance) {
    _classCallCheck(this, MapEventManager);

    this.mapEvent = new MapEvent(vueInstance);
    this.Target = Target;
    this.Context = Context;
};

var MapEvent = function () {
    function MapEvent(vue) {
        _classCallCheck(this, MapEvent);

        this.vue = vue;
        this.map = vue.map;
    }

    _createClass(MapEvent, [{
        key: "emit",
        value: function emit(eventName, target, context, onCallback, timeout) {
            if (target && target.constructor.name !== "Target") {
                target = new Target(target, this.vue);
            }
            if (context && context.constructor.name !== "Context") {
                context = new Context(context, this.vue);
            }

            var self = this;

            var callback = function callback() {};
            if (typeof onCallback === "function") {
                var eventId = self.uuid();
                if (timeout) {
                    var timeoutId = setTimeout(function () {
                        self.callback(eventId, { reason: "timeout" }, "rejected");
                    }, timeout * 1000);
                }
                self.vue.$set(self.vue.events, eventId, { status: "", reply: "", timeoutId: timeoutId });
                callback = function callback(reply, status) {
                    self.callback.call(self, eventId, reply, status);
                };
                var unwatch = self.vue.$watch("events." + eventId + ".status", function (n, o) {
                    if (n !== o) {
                        onCallback(self.vue.events[eventId].status, self.vue.events[eventId].reply);
                        clearTimeout(self.vue.events[eventId].timeoutId);
                        if (self.vue.events[eventId].status !== "continued") {
                            unwatch();
                            delete self.vue.events[eventId];
                        }
                    }
                }, { deep: true });
            }

            setTimeout(function () {
                self.vue.$emit(eventName, { target: target, context: context, callback: callback });
            }, 0);
        }
    }, {
        key: "callback",
        value: function callback(eventId) {
            var reply = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
            var status = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "resolved";

            this.vue.events[eventId].status = status;
            this.vue.events[eventId].reply = reply;
        }
    }, {
        key: "uuid",
        value: function uuid() {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
            });
            return uuid;
        }
    }]);

    return MapEvent;
}();

var Target = function () {
    function Target(target, vue) {
        _classCallCheck(this, Target);

        this.target = Array.isArray(target) ? target : [target];
    }

    _createClass(Target, [{
        key: "add",
        value: function add(item) {
            var self = this;
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    if (!self.existed(item.id)) {
                        this.target.push(item);resolve();
                    } else {
                        reject();
                    }
                }, 1);
            });
        }
    }, {
        key: "del",
        value: function del(itemId) {
            var self = this;
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    if (self.existed(itemId)) {
                        self.target.splice(self.itemIndex(itemId), 1);resolve();
                    } else {
                        reject();
                    }
                }, 1);
            });
        }
    }, {
        key: "mov",
        value: function mov(itemId, x, y) {
            var self = this;
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    if (self.existed(itemId)) {
                        vue.setPosition(self.target[self.itemIndex(itemId)], x, y);resolve();
                    } else {
                        reject();
                    }
                }, 1);
            });
        }
    }, {
        key: "rename",
        value: function rename(itemId, name) {
            var self = this;
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    if (self.existed(itemId)) {
                        vue.$set(self.target[self.itemIndex(itemId)], "name", name);resolve();
                    } else {
                        reject();
                    }
                }, 1);
            });
        }
    }, {
        key: "existed",
        value: function existed(itemId) {
            for (var k in vue.items) {
                if (vue.items[k].id === itemId) {
                    return false;
                }
            }
        }
    }, {
        key: "itemIndex",
        value: function itemIndex(itemId) {
            for (var k in vue.items) {
                if (vue.items[k].id === item.id) {
                    return k;
                }
            }
        }
    }]);

    return Target;
}();

var Context = function Context(additionals, vue) {
    _classCallCheck(this, Context);

    for (var k in additionals) {
        this[k] = additionals[k];
    }
};

exports.default = MapEventManager;

/***/ }),

/***/ "./src/components/richmap/icons/iconfont.css":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./src/components/richmap/icons/iconfont.css");
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
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!./iconfont.css", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!./iconfont.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/components/richmap/icons/iconfont.eot?t=1524124485646":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/iconfont.c99511.eot";

/***/ }),

/***/ "./src/components/richmap/icons/iconfont.svg?t=1524124485646":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/iconfont.e43ce6.svg";

/***/ }),

/***/ "./src/components/richmap/icons/iconfont.ttf?t=1524124485646":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/iconfont.f73f25.ttf";

/***/ }),

/***/ "./src/components/richmap/map.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-236629d7\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/richmap/map.vue")
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-236629d7\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/components/richmap/map.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/components/richmap/map.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-236629d7\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/components/richmap/map.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\components\\richmap\\map.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] map.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-236629d7", Component.options)
  } else {
    hotAPI.reload("data-v-236629d7", Component.options)
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