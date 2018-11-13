webpackJsonp([56],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/devices/operates/prison/prison.complain.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _prisonurls = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"prisonurls\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

var urls = _interopRequireWildcard(_prisonurls);

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

__webpack_require__("./src/assets/js/semantic/components/button.min.css");

__webpack_require__("./src/assets/js/semantic/components/input.min.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
	components: {},
	data: function data() {
		return {
			historys: '',
			contentID: '',
			prisoner: '',
			polices: ''
		};
	},

	props: {
		items: {
			type: Array,
			default: function _default() {
				return [];
			}
		},
		newComplainitem: {
			type: Array,
			default: function _default() {
				return [];
			}
		}
	},
	watch: {},
	computed: {},
	methods: {
		addItem: function addItem() {
			this.items.push({
				sn: "",
				id: this.generateUUID(8, 16)
			});
		},
		removeItem: function removeItem(item) {
			var self = this;
			for (var i = 0; i < self.items.length; i++) {
				if (self.items[i].id == item) {
					self.items.splice(i, 1);
				}
			}
		},
		generateUUID: function generateUUID(len, radix) {
			var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
			var uuid = [],
			    i;
			radix = radix || chars.length;
			if (len) {
				for (i = 0; i < len; i++) {
					uuid[i] = chars[0 | Math.random() * radix];
				}
			} else {
				var r;
				uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
				uuid[14] = '4';
				for (i = 0; i < 36; i++) {
					if (!uuid[i]) {
						r = 0 | Math.random() * 16;
						uuid[i] = chars[i == 19 ? r & 0x3 | 0x8 : r];
					}
				}
			}
			return uuid.join('');
		},
		gethistory: function gethistory(e) {
			var self = this;
			if (e) {
				_webservice2.default.get(urls.complainlistdate + e.id).then(function (response) {
					if (response.status === 'success') {
						for (var i = 0; i < response.payload.length; i++) {
							if (response.payload[i].approver_date) {
								var e = response.payload[i].approver_date;
								var date = new Date(e - 0);
								var Y = date.getFullYear() + "-";
								var M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
								var D = date.getDate() + " ";
								var h = date.getHours() + ":";
								var m = date.getMinutes() + ":";
								var s = date.getSeconds();
								response.payload[i].approver_date = Y + M + D + h + m + s;
							}
						}
						self.historys = response.payload;
					}
				});
			}
		},
		getprisoner: function getprisoner(e) {
			var self = this;
			_webservice2.default.get(urls.getbeinprisonList + e, {}).then(function (response) {
				if (response.status === 'success') {
					self.prisoner = response.payload;
				}
			});
		},
		getpolices: function getpolices(e) {
			var self = this;
			_webservice2.default.get(urls.complainlistdate + e, {
				filter: 'chargePolice'
			}).then(function (response) {
				if (response.status === 'success') {
					self.polices = response.payload;
				} else {
					toast(response);
				}
			}).catch(function (err) {
				return toast(response);
			});
		},
		postContent: function postContent() {
			var self = this;
			self.items.content = $('textarea')[0].value;
			self.items.nextDuty = $('#applicationValue')[0].innerHTML;
		},
		applicationScroll: function applicationScroll() {
			setTimeout(function () {
				$('.right').scrollTop('650');
			}, 1000);
		}
	},
	created: function created() {},
	beforeDestroy: function beforeDestroy() {
		var self = this;
		self.newComplainitem.opinion = $('textarea')[0].value;
		var nApprover = $('#applicationValue')[0].innerHTML == "无" ? '' : $('#applicationValue')[0].innerHTML;
		self.newComplainitem.next_approver = nApprover;
		self.polices.forEach(function (e, index) {
			if (e.name == self.newComplainitem.next_approver) {
				self.newComplainitem.next_approverNO = e.number;
			}
		});
	},
	mounted: function mounted() {
		var self = this;
		self.contentID = self.items.id;
		self.gethistory(self.items);
		self.getpolices(self.items.number);
		self.getprisoner(self.items.number);
		$('.applicationDropdown').dropdown();
	}
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-44e900e3\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/devices/operates/prison/prison.complain.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.complainmain[data-v-44e900e3] {\n\theight: 100%;\n\tdisplay: flex;\n\tjustify-content: space-around;\n}\n.complainmain .left[data-v-44e900e3] {\n\twidth: 30%;\n}\n.complainmain .right[data-v-44e900e3] {\n\twidth: 70%;\n\tpadding: 10px;\n\toverflow-y: auto;\n\tposition: relative;\n}\n.complainmain .rightContent[data-v-44e900e3] {\n\theight: auto;\n\tposition: relative;\n}\n.complainmain .timeLine[data-v-44e900e3] {\n\theight: 100%;\n\tposition: absolute;\n\tz-index: 1;\n\twidth: 3px;\n\tbackground-color: lightgray;\n\tborder-radius: 10px;\n\tleft: 100px;\n}\n.complainmain .rightInput[data-v-44e900e3] {\n\theight: 150px;\n}\n.complainmain .rightDate[data-v-44e900e3] {\n\tposition: relative;\n\tpadding: 3px 0 20px 0;\n}\n.complainmain .dateTime[data-v-44e900e3] {\n\twidth: 80px;\n\tborder-radius: 10px;\n\tposition: absolute;\n\tleft: 8px;\n\ttop: 20px;\n}\n.complainmain .dateIcon[data-v-44e900e3] {\n\tposition: absolute;\n\tleft: 93px;\n\ttop: 26px;\n\tz-index: 2;\n}\n.complainmain .dateContent[data-v-44e900e3] {\n\twidth: 411px;\n\tright: -110px;\n\tposition: relative;\n\ttop: 11px;\n\tborder: 1px solid lightgray;\n\tborder-radius: 10px;\n\tpadding: 5px;\n}\n.complainmain .dateName[data-v-44e900e3] {\n\tposition: relative;\n\tright: -110px;\n\tbottom: -6px;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-44e900e3\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/devices/operates/prison/prison.complain.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "complainmain"
  }, [_c('div', {
    staticClass: "left"
  }, [_c('table', {
    staticClass: "ui celled table"
  }, [_c('tr', [_c('td', {
    staticClass: "active"
  }, [_vm._v("姓名")]), _vm._v(" "), _c('td', [_vm._v(_vm._s(_vm.items.name))])]), _vm._v(" "), _c('tr', [_c('td', {
    staticClass: "active"
  }, [_vm._v("编号")]), _vm._v(" "), _c('td', [_vm._v(_vm._s(_vm.items.number))])]), _vm._v(" "), _c('tr', [_c('td', {
    staticClass: "active"
  }, [_vm._v("年龄")]), _vm._v(" "), _c('td', [_vm._v(_vm._s(_vm.prisoner.age))])]), _vm._v(" "), _c('tr', [_c('td', {
    staticClass: "active"
  }, [_vm._v("监区")]), _vm._v(" "), _c('td', [_vm._v(_vm._s(_vm.prisoner.area_alias))])]), _vm._v(" "), _c('tr', [_c('td', {
    staticClass: "active"
  }, [_vm._v("监室")]), _vm._v(" "), _c('td', [_vm._v(_vm._s(_vm.prisoner.room_alias))])]), _vm._v(" "), _c('tr', [_c('td', {
    staticClass: "active"
  }, [_vm._v("亲属姓名")]), _vm._v(" "), _c('td', [_vm._v(_vm._s(_vm.prisoner.family_name))])]), _vm._v(" "), _c('tr', [_c('td', {
    staticClass: "active"
  }, [_vm._v("联系电话")]), _vm._v(" "), _c('td', [_vm._v(_vm._s(_vm.prisoner.family_relation))])]), _vm._v(" "), _c('tr', [_c('td', {
    staticClass: "active"
  }, [_vm._v("犯罪行为")]), _vm._v(" "), _c('td', [_vm._v(_vm._s(_vm.prisoner.accusation))])]), _vm._v(" "), _c('tr', [_c('td', {
    staticClass: "active"
  }, [_vm._v("申请日期")]), _vm._v(" "), _c('td', [_vm._v(_vm._s(_vm.items.apply_date))])]), _vm._v(" "), _c('tr', [_c('td', {
    staticClass: "active"
  }, [_vm._v("投诉事项")]), _vm._v(" "), _c('td', [_vm._v(_vm._s(_vm.items.content))])]), _vm._v(" "), _c('tr', [_c('td', {
    staticClass: "active"
  }, [_vm._v("被投诉人")]), _vm._v(" "), _c('td', _vm._l((_vm.items.be_complaineds), function(complained) {
    return (complained.name) ? _c('span', [_vm._v(_vm._s(complained.name))]) : _vm._e()
  }))])])]), _vm._v(" "), _c('div', {
    staticClass: "right"
  }, [_c('div', {
    staticClass: "rightContent"
  }, [_c('span', {
    staticClass: "timeLine"
  }), _vm._v(" "), _vm._l((_vm.historys), function(history) {
    return _c('div', {
      staticClass: "rightDate"
    }, [_c('span', {
      staticClass: "dateTime"
    }, [_vm._v(_vm._s(history.approver_date))]), _vm._v(" "), _c('i', {
      staticClass: "circle icon dateIcon"
    }), _vm._v(" "), _c('span', {
      staticClass: "dateName"
    }, [_vm._v("审批人:　" + _vm._s(history.approver))]), _vm._v(" "), _c('p', {
      staticClass: "dateContent"
    }, [_vm._v("审批意见:　\n\t\t\t\t\t" + _vm._s(history.opinion) + "\n\t\t\t\t")])])
  })], 2), _vm._v(" "), _vm._m(0), _vm._v(" "), _c('label', {
    attrs: {
      "for": "applicationDropdown"
    }
  }, [_vm._v("下一审批人:")]), _vm._v(" "), _c('div', {
    staticClass: "ui fluid search selection dropdown applicationDropdown",
    on: {
      "click": function($event) {
        _vm.applicationScroll()
      }
    }
  }, [_c('input', {
    staticClass: "applicationInput",
    attrs: {
      "type": "hidden",
      "name": "country"
    }
  }), _vm._v(" "), _c('i', {
    staticClass: "dropdown icon"
  }), _vm._v(" "), _c('div', {
    staticClass: "default text",
    attrs: {
      "id": "applicationValue"
    }
  }, [_vm._v("无")]), _vm._v(" "), _c('div', {
    staticClass: "menu"
  }, [_c('div', {
    staticClass: "item",
    attrs: {
      "data-value": "无"
    }
  }, [_vm._v("无")]), _vm._v(" "), _vm._l((_vm.polices), function(police) {
    return _c('div', {
      staticClass: "item",
      attrs: {
        "data-value": "黄"
      }
    }, [_vm._v(_vm._s(police.name))])
  })], 2)])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "rightInput"
  }, [_c('h3', [_vm._v("审批意见:")]), _vm._v(" "), _c('textarea', {
    attrs: {
      "name": "inputContent",
      "rows": "5",
      "cols": "70",
      "placeholder": "审批内容"
    }
  })])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-44e900e3", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-44e900e3\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/devices/operates/prison/prison.complain.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-44e900e3\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/devices/operates/prison/prison.complain.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("158f974e", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-44e900e3\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./prison.complain.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-44e900e3\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./prison.complain.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/common/webservice.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __instance = function () {
	var instance = void 0;
	return function (newInstance) {
		if (newInstance) instance = newInstance;
		return instance;
	};
}();

var WebServiceWrapper = exports.WebServiceWrapper = function () {
	function WebServiceWrapper(options) {
		_classCallCheck(this, WebServiceWrapper);

		this.version = "last";
		this.baseUrl = "";
		this.token = "";
		this.secret = "";
		this.credentials = "include";
		this.mode = "cors";

		if (__instance()) return __instance();
		__instance(this);
		if (options) {
			this.version = options.version || "last";
			this.baseUrl = options.baseUrl || "/api/";
			this.token = options.token || "";
			this.secret = options.secret || "";
			this.mode = options.mode || "cors";
			this.credentials = options.credentials || "include";
			this.headers = options.headers || {};
		}
	}

	_createClass(WebServiceWrapper, [{
		key: "_buildURL",
		value: function _buildURL(url, params) {
			if (!url.endsWith("/")) url = url + "/";
			if (this.baseUrl != "" && !this.baseUrl.endsWith("/")) this.baseUrl = this.baseUrl + "/";
			if (this.version == "last") {
				return this.baseUrl + url + "?" + params;
			} else {
				return this.baseUrl + "v" + this.version + "/" + url;
			}
		}
	}, {
		key: "get",
		value: function get(url) {
			var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

			data["__token__"] = this.token;

			var params = $.param(data);
			url = this._buildURL(url, params);

			options = Object.assign({
				method: "GET",
				credentials: this.credentials,
				headers: this.headers || { 'Content-Type': 'application/json' },
				mode: this.mode
			}, options);

			return fetch(url, options).then(function (response) {
				if (response.ok) {
					return response.json();
				}
			});
		}
	}, {
		key: "post",
		value: function post(url) {
			var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

			options = Object.assign({
				method: "POST",
				credentials: this.credentials,
				headers: this.headers || { 'Content-Type': 'application/json' },
				mode: this.mode,
				body: JSON.stringify(data)
			}, options);

			return fetch(url, options).then(function (response) {
				logger.debug("response.ok after fetch post", response.ok, "webservice.js post");
				logger.debug("response.statue after fetch post", response.status, "webservice.js post");
				logger.debug("response.body after fetch post", response.body, "webservice.js post");
				if (response.ok) {
					return response.json();
				}
			});
		}
	}, {
		key: "delete",
		value: function _delete(url) {
			var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

			options = Object.assign({
				method: "DELETE",
				credentials: this.credentials,
				headers: this.headers || { 'Content-Type': 'application/json' },
				mode: this.mode,
				body: JSON.stringify(data)
			}, options);

			return fetch(url, options).then(function (response) {
				logger.debug("response after fetch delete", response, "webservice.js delete");
				if (response.ok) {
					return response.json();
				}
			});
		}
	}, {
		key: "put",
		value: function put(url) {
			var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

			options = Object.assign({
				method: "PUT",
				credentials: this.credentials,
				headers: this.headers || { 'Content-Type': 'application/json' },
				mode: this.mode,
				body: JSON.stringify(data)
			}, options);

			return fetch(url, options).then(function (response) {
				if (response.ok) {
					return response.json();
				}
			});
		}
	}, {
		key: "getJSON",
		value: function getJSON() {
			var _$;

			return (_$ = $).getJSON.apply(_$, arguments);
		}
	}]);

	return WebServiceWrapper;
}();

var WebService = new WebServiceWrapper();

exports.default = WebService;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./src/devices/operates/prison/prison.complain.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-44e900e3\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/devices/operates/prison/prison.complain.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/devices/operates/prison/prison.complain.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-44e900e3\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/devices/operates/prison/prison.complain.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-44e900e3",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\devices\\operates\\prison\\prison.complain.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] prison.complain.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-44e900e3", Component.options)
  } else {
    hotAPI.reload("data-v-44e900e3", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ })

});