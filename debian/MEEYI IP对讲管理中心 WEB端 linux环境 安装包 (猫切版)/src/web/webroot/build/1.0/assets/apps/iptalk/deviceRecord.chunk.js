webpackJsonp([125],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deivce-record.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _table = __webpack_require__("./src/components/table.vue");

var _table2 = _interopRequireDefault(_table);

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

var _urls = __webpack_require__("./src/apps/iptalk/urls.js");

var urls = _interopRequireWildcard(_urls);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: { vuetable: _table2.default },
	data: function data() {
		var self = this;
		var records = new Map();
		return {
			cols: [{ name: 'DevID', title: L("ID", "iptalk"), width: "10%" }, { name: 'Alias', title: L("设备名称", "iptalk"), width: "10%" }, { name: 'Action', title: L("事件", "iptalk"), width: "40%", type: "custom", output: function output(row, colname) {
					return self.types[row[colname.name]];
				}
			}, { name: 'Time', title: L("时间", "iptalk"), width: "40%", type: "custom", output: function output(row, colname) {
					return new Date(row[colname.name] * 1000).toLocaleString();
				}
			}],
			rows: [],
			pagination: {
				pageNumber: 0,
				pageCount: 0,
				pageSize: 20
			},
			records: records,
			types: ["", L("下线", "iptalk"), L("上线", "iptalk")]
		};
	},
	created: function created() {},

	methods: {
		onLoadData: function onLoadData(context) {
			var self = this;
			var newPage = context ? context.newPage : 1;
			if (context && context.force) {
				this.records.clear();
				newPage = this.currentPage;
			}
			var item = this.records.get(newPage);
			if (item) {
				this.dumpToPage(item, context);
			} else {
				this.getRecords(newPage, this.pagination.pageSize, function (result) {
					self.dumpToPage(result, context);
					self.records.set(result.pageNumber, result);
				});
			}
		},
		dumpToPage: function dumpToPage(item, context) {
			this.currentPage = item.pageNumber;
			this.rows = item.list;
			this.pagination = {
				pageNumber: item.pageNumber,
				pageCount: item.pageCount,
				pageSize: 20
			};
			if (context) {
				context.success(this.pagination);
			}
		},
		getRecords: function getRecords(newPage, pageSize, callback) {
			_webservice2.default.getJSON(urls.getIptalkDeviceRecord, { newPage: newPage, pageSize: pageSize }).then(function (response) {
				if (response.status == "success") {
					var result = response.result;
					result.pageNumber = typeof result.pageNumber == "number" ? result.pageNumber : parseInt(result.pageNumber);
					result.pageCount = typeof result.pageCount == "number" ? result.pageCount : parseInt(result.pageCount);
					result.pageSize = typeof result.pageSize == "number" ? result.pageSize : parseInt(result.pageSize);
					callback(result);
				}
			});
		}
	},
	mounted: function mounted() {
		this.onLoadData();
	}
};

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-ad1a2508\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deivce-record.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.select[data-v-ad1a2508]{\r\n\tposition: relative;\r\n\tpadding: 20px;\r\n\theight: 100%;\r\n\toverflow-y: auto;\r\n\toverflow-x: hidden;\n}\n.select h2[data-v-ad1a2508]{\r\n\ttext-align: center;\n}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-ad1a2508\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deivce-record.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "select"
  }, [_c('h2', [_vm._v(_vm._s(_vm.L("设备登陆记录", "iptalk")))]), _vm._v(" "), _c('vuetable', {
    directives: [{
      name: "ref",
      rawName: "v-ref:vuetable",
      arg: "vuetable"
    }],
    attrs: {
      "fit": false,
      "cols": _vm.cols,
      "rows": _vm.rows,
      "pagination": _vm.pagination,
      "multi-select": false,
      "show-toolbar": false,
      "show-selector": false
    },
    on: {
      "loaddata": _vm.onLoadData
    }
  })], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-ad1a2508", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-ad1a2508\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deivce-record.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-ad1a2508\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deivce-record.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("52234ba8", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-ad1a2508\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../utils/lang-loader.js!./deivce-record.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-ad1a2508\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../utils/lang-loader.js!./deivce-record.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/apps/iptalk/deivce-record.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-ad1a2508\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deivce-record.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deivce-record.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-ad1a2508\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deivce-record.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-ad1a2508",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\iptalk\\deivce-record.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] deivce-record.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ad1a2508", Component.options)
  } else {
    hotAPI.reload("data-v-ad1a2508", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ })

});