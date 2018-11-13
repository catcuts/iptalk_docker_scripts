webpackJsonp([47],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/devices/operates/prison/prison.device.detail.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__("./src/assets/js/semantic/components/button.min.css");

__webpack_require__("./src/assets/js/semantic/components/input.min.css");

exports.default = {
	components: {},
	data: function data() {
		return {
			nodeviceImg: __webpack_require__("./src/assets/images/device.png")
		};
	},

	computed: {},
	props: {
		item: { type: Array, default: function _default() {
				return [];
			} }
	},
	watch: {},

	methods: {},
	created: function created() {},
	beforeDestroy: function beforeDestroy() {},
	mounted: function mounted() {
		$('.ui.dropdown').dropdown();
	}
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3b191c5f\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/devices/operates/prison/prison.device.detail.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3b191c5f\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/devices/operates/prison/prison.device.detail.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.devicetail .table[data-v-3b191c5f] {\r\n\twidth: 100%;\r\n\tborder: 1px solid #e5e5e5;\r\n\tpadding: 1px;\r\n\tbackground-color: #fff;\r\n\tborder-radius: 5px 5px 0 5px;\n}\n.devicetail .table td[data-v-3b191c5f] {\r\n\twidth: 15%;\r\n\tborder: 1px solid #e5e5e5;\r\n\tpadding: 5px;\r\n\tbackground-color: #fff;\r\n\tborder-radius: 5px 5px 0 5px;\r\n\tword-wrap: break-word;\r\n\tword-break: break-all;\n}\n.devicetail .table .tds[data-v-3b191c5f] {\r\n\tbackground-color: #f8f7f7;\r\n\tfont-weight: bold;\n}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-3b191c5f\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/devices/operates/prison/prison.device.detail.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "devicetail"
  }, [_c('div', [_c('table', {
    staticClass: "table"
  }, [_c('tr', [_c('td', {
    staticClass: "tds"
  }, [_vm._v(_vm._s(_vm.L('设备名称')))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(_vm.item[0].row.alias))]), _vm._v(" "), _c('td', {
    staticClass: "tds"
  }, [_vm._v(_vm._s(_vm.L('监区')))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(_vm.item[0].row.area))]), _vm._v(" "), _c('td', {
    staticClass: "tds",
    attrs: {
      "rowspan": "6",
      "colspan": "2"
    }
  }, [_c('img', {
    staticStyle: {
      "width": "100%",
      "height": "inherit",
      "max-height": "180px",
      "min-height": "150px"
    },
    attrs: {
      "src": _vm.item[0].row.photo || _vm.nodeviceImg,
      "alt": ""
    }
  })])]), _vm._v(" "), _c('tr', [_c('td', {
    staticClass: "tds"
  }, [_vm._v(_vm._s(_vm.L('设备IP')))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(_vm.item[0].row.dev_ip))]), _vm._v(" "), _c('td', {
    staticClass: "tds"
  }, [_vm._v(_vm._s(_vm.L('监室')))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(_vm.item[0].row.room))])]), _vm._v(" "), _c('tr', [_c('td', {
    staticClass: "tds"
  }, [_vm._v(_vm._s(_vm.L('子网掩码')))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(_vm.item[0].row.dev_mask))]), _vm._v(" "), _c('td', {
    staticClass: "tds"
  }, [_vm._v(_vm._s(_vm.L('编号')))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(_vm.item[0].row.dev_id))])]), _vm._v(" "), _c('tr', [_c('td', {
    staticClass: "tds"
  }, [_vm._v(_vm._s(_vm.L('网关')))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(_vm.item[0].row.dev_gw))]), _vm._v(" "), _c('td', {
    staticClass: "tds"
  }, [_vm._v(_vm._s(_vm.L('服务器IP')))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(_vm.item[0].row.server_ip))])]), _vm._v(" "), _c('tr', [_c('td', {
    staticClass: "tds"
  }, [_vm._v(_vm._s(_vm.L('DNS')))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(_vm.item[0].row.dev_dns))]), _vm._v(" "), _c('td', {
    staticClass: "tds"
  }, [_vm._v(_vm._s(_vm.L('设备令牌')))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(_vm.item[0].row.token))])]), _vm._v(" "), _c('tr', [_c('td', {
    staticClass: "tds"
  }, [_vm._v(_vm._s(_vm.L('设备版本')))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(_vm.item[0].row.version))]), _vm._v(" "), _c('td', {
    staticClass: "tds"
  }, [_vm._v(_vm._s(_vm.L('是否在线')))]), _vm._v(" "), _c('td', [(_vm.item[0].row.status == 1 || _vm.item[0].row.status == true) ? _c('i', {
    staticClass: "green checkmark large  icon",
    staticStyle: {
      "margin": "0 5%"
    }
  }) : _c('i', {
    staticClass: "red remove large  icon",
    staticStyle: {
      "margin": "0 5%"
    }
  })])])])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-3b191c5f", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3b191c5f\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/devices/operates/prison/prison.device.detail.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3b191c5f\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/devices/operates/prison/prison.device.detail.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("03d17316", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3b191c5f\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!../../../../utils/lang-loader.js!./prison.device.detail.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3b191c5f\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!../../../../utils/lang-loader.js!./prison.device.detail.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3b191c5f\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/devices/operates/prison/prison.device.detail.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3b191c5f\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/devices/operates/prison/prison.device.detail.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("c2a41be8", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3b191c5f\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./prison.device.detail.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3b191c5f\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./prison.device.detail.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/assets/images/device.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/device.8564f8.png";

/***/ }),

/***/ "./src/devices/operates/prison/prison.device.detail.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3b191c5f\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/devices/operates/prison/prison.device.detail.vue")
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3b191c5f\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/devices/operates/prison/prison.device.detail.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/devices/operates/prison/prison.device.detail.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-3b191c5f\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/devices/operates/prison/prison.device.detail.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-3b191c5f",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\devices\\operates\\prison\\prison.device.detail.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] prison.device.detail.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3b191c5f", Component.options)
  } else {
    hotAPI.reload("data-v-3b191c5f", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ })

});