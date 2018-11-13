webpackJsonp([111],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/common/device/device.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _deepAssign = __webpack_require__("./node_modules/deep-assign/index.js");

var _deepAssign2 = _interopRequireDefault(_deepAssign);

var _menubar = __webpack_require__("./src/components/menubar.vue");

var _menubar2 = _interopRequireDefault(_menubar);

var _tabs = __webpack_require__("./src/components/tabs.vue");

var _tabs2 = _interopRequireDefault(_tabs);

__webpack_require__("./src/assets/js/semantic/components/label.min.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: { menubar: _menubar2.default, tabs: _tabs2.default },
	data: function data() {
		return {
			showImgAlt: false,
			showDevicePage: true,
			showTips: false,
			showLoader: false
		};
	},

	props: {
		renderMeta: { type: Object, default: function _default() {
				return {};
			} },
		meta: { type: Object, default: function _default() {
				return {};
			} },
		data: { type: Object, default: function _default() {
				return {};
			} },
		device: { type: Object, default: function _default() {
				return {};
			} } },
	computed: {
		devicemeta: function devicemeta() {
			var self = this;
			var refreshButton = { name: "refresh", icon: "refresh", right: true, click: function click() {
					self.onRefreshButtonClick();
				} };

			var devicemeta = (0, _deepAssign2.default)({
				id: this.generateUUID(),
				name: "deviceVueDemo",
				title: "设备组件示例",
				closeEnable: false,
				refreshButton: true,
				additionalLink: { text: "", url: "" },
				borderless: false,
				image: {
					src: "http://gc-hn.com/content/templates/emedia/images/nopic.gif",
					alt: "设备暂无预览",
					height: 55,
					width: "auto"
				},
				mixinPages: ["actions", "alarms", "events", "subdevices", "settings"],
				pages: [],
				attrsKeyAreaWidth: 75,
				attrsHeight: 4,
				attrs: [],
				status: []
			}, this.newRenderMeta);
			devicemeta.status.forEach(function (sta) {
				try {
					sta.text = sta.text[self.data.status[sta.name].toString()];
				} catch (e) {
					sta.text = "";
				}
			});

			if (devicemeta.refreshButton) {
				devicemeta.status.push(refreshButton);
			}

			return devicemeta;
		},
		newRenderMeta: function newRenderMeta() {
			if (Object.keys(this.meta || {}).length) {
				return this.mix(this.renderMeta, this.meta || {});
			} else {
				return this.renderMeta;
			}
		},
		limitedDeviceAttrs: function limitedDeviceAttrs() {
			return this.devicemeta.attrs.slice(0, this.devicemeta.attrsHeight);
		}
	},
	methods: {
		generateUUID: function generateUUID() {
			var d = new Date().getTime();
			var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				var r = (d + Math.random() * 16) % 16 | 0;
				d = Math.floor(d / 16);
				return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
			});
			return uuid;
		},
		mix: function mix(renderMeta, deviceMeta) {
			var self = this;

			var newRenderMeta = Object.assign({}, renderMeta);

			var defaultPages = {

				actions: { tab: "actions", group: "pages",
					active: true, icon: "random", text: "动作", tips: "动作",
					content: "common/device/device.action.async.vue",

					label: "0",
					labelColor: "red",
					labelSource: "0",
					labelEmpty: "0" },
				alarms: { tab: "alarms", group: "pages",
					active: false, icon: "alarm", text: "告警", tips: "告警",
					content: "common/device/device.alarm.async.vue",


					label: "0",
					labelColor: "red",
					labelSource: "0",
					labelEmpty: "0"
				},
				events: { tab: "events", group: "pages",
					active: false, icon: "call square", text: "日志", tips: "日志",
					content: "common/device/device.event.async.vue",


					label: "0",
					labelColor: "red",
					labelSource: "0",
					labelEmpty: "0"
				},
				subdevices: { tab: "subdevices", group: "pages",
					active: false, icon: "rocket", text: "外设", tips: "外设",
					content: "common/device/device.subdevices.async.vue",


					label: "0",
					labelColor: "red",
					labelSource: "0",
					labelEmpty: "0"
				},
				settings: { tab: "settings", group: "pages",
					active: false, icon: "setting", text: "配置", tips: "配置",
					content: "common/device/device.setting.async.vue",


					label: "0",
					labelColor: "red",
					labelSource: "0",
					labelEmpty: "0"
				}
			};

			var defaultAttrsMeta = (0, _deepAssign2.default)({}, renderMeta.attrMeta);
			var defaultStatusMeta = (0, _deepAssign2.default)({ showText: true }, renderMeta.statusMeta);
			var defaultOthersMeta = {
				name: "",
				title: "",
				closeEnable: true,
				image: { height: 55, width: "auto" },
				attrsKeyAreaWidth: 75,
				mixinPages: "ALL"
			};

			Object.keys(defaultOthersMeta).forEach(function (item) {
				if (item !== "image") {
					var newOne = deviceMeta[item] === undefined ? defaultOthersMeta[item] : deviceMeta[item];
					newRenderMeta[item] = newRenderMeta[item] === undefined ? newOne : newRenderMeta[item];
				} else {
					newRenderMeta[item] = (0, _deepAssign2.default)({}, newRenderMeta[item] || {}, defaultOthersMeta[item], deviceMeta[item] || {});
				}
			});

			var mixinPages = newRenderMeta.mixinPages === "ALL" ? ["actions", "alarms", "events", "subdevices", "settings"] : typeof newRenderMeta.mixinPages === "string" ? [newRenderMeta.mixinPages] : newRenderMeta.mixinPages;

			var newPages = [];
			mixinPages.forEach(function (page) {
				if (deviceMeta[page]) {
					var newPage = (0, _deepAssign2.default)({}, defaultPages[page], deviceMeta[page]);
					deviceMeta[page] = newPage;
					newPages.push(newPage);
				}
			});

			var newAttrs = [];
			deviceMeta.attrs.forEach(function (attr) {
				var newAttr = (0, _deepAssign2.default)({}, defaultAttrsMeta, attr);
				newAttrs.push(newAttr);
			});

			var newStatus = [];
			deviceMeta.status.forEach(function (sta) {
				var newSta = (0, _deepAssign2.default)({}, defaultStatusMeta, sta);
				if (!newSta.click) {
					newSta.click = "on" + sta.name;
				}
				newStatus.push(newSta);
			});

			return (0, _deepAssign2.default)(newRenderMeta, { pages: newPages }, { attrs: newAttrs }, { status: newStatus });
		},
		onDeviceImageError: function onDeviceImageError($event) {
			var el = $event.target;
			if (el.dataset.stoperror === "false") {
				el.src = this.devicemeta.image.alt ? this.devicemeta.image.alt : "http://gc-hn.com/content/templates/emedia/images/nopic.gif";
				el.dataset.stoperror = "true";
				this.showImgAlt = false;
			} else {
				el.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
				el.dataset.stoperror = "false";
				this.showImgAlt = true;
			}
		},
		onRefreshButtonClick: function onRefreshButtonClick($event) {
			if (this.device) {
				var self = this;
				this.device.refresh().then(function (response) {
					self.dispatch("refreshSuccess", response, self.devicemeta.name, $event);
					self.showTips = true;
					setTimeout(function () {
						self.showTips = false;
					}, 1000);
				}).catch(function (reason) {
					self.dispatch("refreshFailed", reason, self.devicemeta.name, $event);
				});
			}
			this.dispatch("onRefreshButtonClick", this.devicemeta.name, $event);
		},
		onDeviceAttrButtonClick: function onDeviceAttrButtonClick(button, $event) {
			if (typeof button.action === "string") {
				this.dispatch(button.action || "onDeviceAttrButtonClick", this.devicemeta.name, button, $event);
			} else if (typeof button.action === "function") {
				button.action(button, $event);
			}
		},
		onDevicePageClosed: function onDevicePageClosed() {
			this.dispatch("devicePageClosed", this.devicemeta.name, this.data, this.meta, this);
			this.showDevicePage = false;
		}
	},
	created: function created() {
		this.dispatch("deviceCreated", this.devicemeta.name, this.data, this.meta, this);
	},
	mounted: function mounted() {
		this.dispatch("deviceMounted", this.devicemeta.name, this.data, this.meta, this);
	}
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./test/lth/device/lth.device.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _device = __webpack_require__("./src/common/device/device.vue");

var _device2 = _interopRequireDefault(_device);

var _device3 = __webpack_require__("./src/common/device.js");

var _device4 = _interopRequireDefault(_device3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    components: { devicePage: _device2.default },
    mixins: [],
    name: "testapp",
    events: {},
    data: function data() {
        return {
            device: new _device4.default('1', 'IPTalk'),
            deviceRenderMeta: {
                closeEnable: true,
                refreshButton: true,
                image: { height: 55, width: "auto" },
                attrsKeyAreaWidth: 75,
                mixinPages: "ALL",
                pages: [],
                attrs: [],
                status: []
            }
        };
    },

    methods: {
        onButton1Click: function onButton1Click(item, $event) {
            console.log('onButton1Click');
        }
    },
    created: function created() {
        this.$on("onButton1Click", function (item, $event) {
            this.onButton1Click(item, $event);
        });
    }
};

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1196a064\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/common/device/device.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.vue-device {\n\t\tposition: relative;\n}\n.vue-device .device-attr-container,\n\t .vue-device .device-status-container {\n\t\tdisplay: flex;\n\t\tflex-wrap: wrap;\n\t\tjustify-content: center;\n}\n.vue-device .device-status-container,\n\t.vue-device .device-tab-container {\n\t\tpadding: 0;\n}\n.vue-device.borderless .device-attr-container,\n\t .vue-device.borderless .device-status-container,\n\t .vue-device.borderless .device-tab-container{\n\t\tborder-left: none!important;\n\t\tborder-right: none!important;\n}\n.vue-device.borderless .device-attr-container{\n\t\tborder-top: none!important;\n}\n.vue-device.borderless .device-tab-container{\n\t\tborder-bottom: none!important;\n}\n.vue-device .device-status-container .menubar {\n\t\tborder: 0;\n}\n.vue-device .device-tab-container .tabbar {\n\t\tborder-top: none!important;\n\t\tborder-right: none!important;\n\t\tborder-left: none!important;\n}\n.vue-device .device-tab-container .tabbar .active.item {\n\t\tfont-weight: bold;\n}\n.vue-device .device-tab-container .tabpanel {\n\t\tborder-right: none!important;\n\t\tborder-left: none!important;\n\t\tborder-bottom: none!important;\n\t\tpadding: 0;\n}\n.vue-device .device-attr-container>* {\n\t\tmargin: 0 5px 0 5px;\n}\n.vue-device .device-attr-container>*:first-child {\n\t\tmargin-left: 0;\n}\n.vue-device .device-attr-container>*:last-child {\n\t\tmargin-right: 0;\n}\n.vue-device .device-attr-container .device-title,\n\t.vue-device .device-attr-container .device-image-container,\n\t.vue-device .device-attr-container .device-attr {\n\t\tposition: relative;\n\t\toverflow: hidden;\n\t\tpadding: 0;\n\t\tborder: 0;\n    \tbox-shadow: none;\n}\n.vue-device .device-attr-container .device-name {\n\t\tdisplay: block!important;\n\t\ttext-align: center!important;\n}\n.vue-device .device-attr-container .device-image-container img {\n\t\theight: inherit;\n\t\twidth: inherit;\n}\n.vue-device .device-attr-container .device-image-container span {\n\t    position: absolute;\n\t\ttop: 50%;\n\t\tleft: 50%;\n\t\ttransform: translate(-50%,-50%);\n}\n.vue-device .device-attr .key {\n\t\tdisplay: inline-block;\n\t\tfont-weight: bold;\n}\n.vue-device .device-attr .value {\n\t\tpadding-left: 5px;\n}\n.vue-device .device-attr i {\n\t\tcursor: pointer;\n}\n.vue-device .device-status {\n\t\tposition: relative;\n}\n.vue-device .device-status i {\n\t\tmargin: 0;\n}\n.vue-device .device-status span {\n\t\tmargin-right: 10px;\n}\n.vue-device .device-status .empty.label {\n\t\tmargin: 10px 0 0 -15px!important;\n}\n,\n    .vue-device .ui.bottom.right.attached.label {\n}\n.vue-device .fade-enter-active, .vue-device .fade-leave-active {\n        transition: opacity 1s\n}\n.vue-device .fade-enter, .vue-device .fade-leave-active {\n        opacity: 0\n}\n.vue-device .tips {\n\t\tposition: absolute;\n\t\ttransform: translate(-50%,-50%);\n\t\tleft: 50%;\n\t\ttop: 50%;\n\t\tfont-weight: bold;\n}\n\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-66b04f49\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./test/lth/device/lth.device.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* 列表视图 */\n.richlist>.richlist-body .list.listItem{\n    /*border: 1px solid #2e8cd2;*/\n    margin: 0 auto 0 auto\n}\n.lth_testapp .container{\n    /*padding-top:100px;\n    margin-left:200px; \n    float:left;*/\n}\n\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-1196a064\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/common/device/device.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.showDevicePage),
      expression: "showDevicePage"
    }],
    class: ['vue-device', {
      'borderless': _vm.devicemeta.borderless
    }]
  }, [_c('div', {
    staticClass: "ui top attached segment device-attr-container"
  }, [_c('div', {
    staticClass: "device-title"
  }, [_c('div', {
    staticClass: "device-image-container",
    style: ({
      height: _vm.devicemeta.image.height + 'px',
      width: _vm.devicemeta.image.width + 'px'
    })
  }, [_c('img', {
    attrs: {
      "src": _vm.devicemeta.image.src,
      "data-stoperror": "false"
    },
    on: {
      "error": _vm.onDeviceImageError
    }
  }), _vm._v(" "), (_vm.showImgAlt) ? _c('span', [_vm._v(_vm._s(_vm.devicemeta.image.alt))]) : _vm._e()]), _vm._v(" "), _c('span', {
    staticClass: "device-name"
  }, [_vm._v(_vm._s(_vm.devicemeta.title))])]), _vm._v(" "), _c('div', {
    staticClass: "device-attr"
  }, _vm._l((_vm.limitedDeviceAttrs), function(deviceAttr) {
    return _c('div', [_c('span', {
      staticClass: "key",
      style: ({
        width: _vm.devicemeta.attrsKeyAreaWidth + 'px'
      })
    }, [_vm._v(_vm._s(deviceAttr.title))]), _vm._v("\n\t\t\t\t\t:\n\t\t\t\t\t"), _c('span', {
      staticClass: "value",
      style: ({
        color: deviceAttr.valueColor,
        fontWeight: deviceAttr.valueBold ? 'bold' : ''
      })
    }, [_vm._v(_vm._s(_vm.data.attrs[deviceAttr.name]))]), _vm._v(" "), _vm._l((deviceAttr.actions), function(button) {
      return _c('i', {
        class: [button.icon, 'icon'],
        attrs: {
          "title": button.text
        },
        on: {
          "click": function($event) {
            _vm.onDeviceAttrButtonClick(button, $event)
          }
        }
      })
    })], 2)
  }))]), _vm._v(" "), _c('div', {
    staticClass: "ui attached segment device-status-container"
  }, [_c('menubar', {
    attrs: {
      "items": _vm.devicemeta.status,
      "compact": true,
      "borderless": true
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "ui attached segment device-tab-container"
  }, [_c('tabs', {
    attrs: {
      "tabs": _vm.devicemeta.pages
    }
  })], 1), _vm._v(" "), (_vm.devicemeta.closeEnable) ? _c('a', {
    staticClass: "ui top right attached label",
    on: {
      "click": _vm.onDevicePageClosed
    }
  }, [_vm._v("x")]) : _vm._e(), _vm._v(" "), _c('transition', {
    attrs: {
      "name": "fade"
    }
  }, [(_vm.showTips) ? _c('span', {
    staticClass: "tips"
  }, [_vm._v(_vm._s(_vm.L("刷新成功")))]) : _vm._e()])], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-1196a064", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-66b04f49\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./test/lth/device/lth.device.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "lth_testapp"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('device-page', {
    attrs: {
      "meta": _vm.device.meta,
      "data": _vm.device.data,
      "device": _vm.device,
      "renderMeta": {
        borderless: false
      }
    }
  }, [_vm._v("\n            啥都没有\n            "), _c('div', {
    staticClass: "ui segment",
    attrs: {
      "slot": "tab1"
    },
    slot: "tab1"
  }, [_vm._v("\n                    我是firstChild tab1\n            ")]), _vm._v(" "), _c('div', {
    staticClass: "ui segment",
    attrs: {
      "slot": "tab2"
    },
    slot: "tab2"
  }, [_c('p', [_vm._v("我是firstChild tab2")]), _vm._v(" "), _c('p', [_vm._v("我是firstChild tab2")]), _vm._v(" "), _c('p', [_vm._v("我是firstChild tab2")]), _vm._v(" "), _c('p', [_vm._v("我是firstChild tab2")]), _vm._v(" "), _c('p', [_vm._v("我是firstChild tab2")]), _vm._v(" "), _c('p', [_vm._v("我是firstChild tab2")]), _vm._v(" "), _c('p', [_vm._v("我是firstChild tab2")]), _vm._v(" "), _c('p', [_vm._v("我是firstChild tab2")]), _vm._v(" "), _c('p', [_vm._v("我是firstChild tab2")])]), _vm._v(" "), _c('div', {
    staticClass: "ui segment",
    attrs: {
      "slot": "tab3"
    },
    slot: "tab3"
  }, [_c('p', [_vm._v("我是firstChild tab2")]), _vm._v(" "), _c('p', [_vm._v("我是firstChild tab2")]), _vm._v(" "), _c('p', [_vm._v("我是firstChild tab2")]), _vm._v(" "), _c('p', [_vm._v("我是firstChild tab2")])]), _vm._v(" "), _c('div', {
    staticClass: "ui segment",
    attrs: {
      "slot": "tab4"
    },
    slot: "tab4"
  }, [_c('p', [_vm._v("我是firstChild tab2")]), _vm._v(" "), _c('p', [_vm._v("我是firstChild tab2")]), _vm._v(" "), _c('p', [_vm._v("我是firstChild tab2")]), _vm._v(" "), _c('p', [_vm._v("我是firstChild tab2")]), _vm._v(" "), _c('p', [_vm._v("我是firstChild tab2")]), _vm._v(" "), _c('p', [_vm._v("我是firstChild tab2")])])])], 1)])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-66b04f49", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1196a064\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/common/device/device.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1196a064\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/common/device/device.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("5c425d1b", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1196a064\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../utils/lang-loader.js!./device.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1196a064\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../utils/lang-loader.js!./device.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-66b04f49\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./test/lth/device/lth.device.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-66b04f49\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./test/lth/device/lth.device.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("7dd523d2", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-66b04f49\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../utils/lang-loader.js!./lth.device.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-66b04f49\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../utils/lang-loader.js!./lth.device.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/assets/js/reconnecting-websocket.min.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!function (a, b) {
	 true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (b),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : "undefined" != typeof module && module.exports ? module.exports = b() : a.ReconnectingWebSocket = b();
}(undefined, function () {
	function a(b, c, d) {
		function l(a, b) {
			var c = document.createEvent("CustomEvent");
			return c.initCustomEvent(a, !1, !1, b), c;
		}
		var e = {
			debug: !1,
			automaticOpen: !0,
			reconnectInterval: 1e3,
			maxReconnectInterval: 3e4,
			reconnectDecay: 1.5,
			timeoutInterval: 2e3
		};
		d || (d = {});
		for (var f in e) {
			this[f] = "undefined" != typeof d[f] ? d[f] : e[f];
		}this.url = b, this.reconnectAttempts = 0, this.readyState = WebSocket.CONNECTING, this.protocol = null;
		var h,
		    g = this,
		    i = !1,
		    j = !1,
		    k = document.createElement("div");
		k.addEventListener("open", function (a) {
			g.onopen(a);
		}), k.addEventListener("close", function (a) {
			g.onclose(a);
		}), k.addEventListener("connecting", function (a) {
			g.onconnecting(a);
		}), k.addEventListener("message", function (a) {
			g.onmessage(a);
		}), k.addEventListener("error", function (a) {
			g.onerror(a);
		}), this.addEventListener = k.addEventListener.bind(k), this.removeEventListener = k.removeEventListener.bind(k), this.dispatchEvent = k.dispatchEvent.bind(k), this.open = function (b) {
			h = new WebSocket(g.url, c || []), b || k.dispatchEvent(l("connecting")), (g.debug || a.debugAll) && console.debug("ReconnectingWebSocket", "attempt-connect", g.url);
			var d = h,
			    e = setTimeout(function () {
				(g.debug || a.debugAll) && console.debug("ReconnectingWebSocket", "connection-timeout", g.url), j = !0, d.close(), j = !1;
			}, g.timeoutInterval);
			h.onopen = function () {
				clearTimeout(e), (g.debug || a.debugAll) && console.debug("ReconnectingWebSocket", "onopen", g.url), g.protocol = h.protocol, g.readyState = WebSocket.OPEN, g.reconnectAttempts = 0;
				var d = l("open");
				d.isReconnect = b, b = !1, k.dispatchEvent(d);
			}, h.onclose = function (c) {
				if (clearTimeout(e), h = null, i) g.readyState = WebSocket.CLOSED, k.dispatchEvent(l("close"));else {
					g.readyState = WebSocket.CONNECTING;
					var d = l("connecting");
					d.code = c.code, d.reason = c.reason, d.wasClean = c.wasClean, k.dispatchEvent(d), b || j || ((g.debug || a.debugAll) && console.debug("ReconnectingWebSocket", "onclose", g.url), k.dispatchEvent(l("close")));
					var e = g.reconnectInterval * Math.pow(g.reconnectDecay, g.reconnectAttempts);
					setTimeout(function () {
						g.reconnectAttempts++, g.open(!0);
					}, e > g.maxReconnectInterval ? g.maxReconnectInterval : e);
				}
			}, h.onmessage = function (b) {
				(g.debug || a.debugAll) && console.debug("ReconnectingWebSocket", "onmessage", g.url, b.data);
				var c = l("message");
				c.data = b.data, k.dispatchEvent(c);
			}, h.onerror = function (b) {
				(g.debug || a.debugAll) && console.debug("ReconnectingWebSocket", "onerror", g.url, b), k.dispatchEvent(l("error"));
			};
		}, 1 == this.automaticOpen && this.open(!1), this.send = function (b) {
			if (h) return (g.debug || a.debugAll) && console.debug("ReconnectingWebSocket", "send", g.url, b), h.send(b);
			throw "INVALID_STATE_ERR : Pausing to reconnect websocket";
		}, this.close = function (a, b) {
			"undefined" == typeof a && (a = 1e3), i = !0, h && h.close(a, b);
		}, this.refresh = function () {
			h && h.close();
		};
	}
	return a.prototype.onopen = function () {}, a.prototype.onclose = function () {}, a.prototype.onconnecting = function () {}, a.prototype.onmessage = function () {}, a.prototype.onerror = function () {}, a.debugAll = !1, a.CONNECTING = WebSocket.CONNECTING, a.OPEN = WebSocket.OPEN, a.CLOSING = WebSocket.CLOSING, a.CLOSED = WebSocket.CLOSED, a;
});

/***/ }),

/***/ "./src/common/device.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__("./src/common/streamingmanager/datamanager.js");

var _datastreaming = __webpack_require__("./src/common/streamingmanager/datastreaming.js");

var _datastreaming2 = _interopRequireDefault(_datastreaming);

var _ajaxChannel = __webpack_require__("./src/common/streamingmanager/ajax.channel.js");

var _ajaxChannel2 = _interopRequireDefault(_ajaxChannel);

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

var _urls = __webpack_require__("./src/urls.js");

var urls = _interopRequireWildcard(_urls);

var _deepAssign = __webpack_require__("./node_modules/deep-assign/index.js");

var _deepAssign2 = _interopRequireDefault(_deepAssign);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DeviceBaseURL = "/mock" + "/device/";

var metas = {
    default: {
        name: "",
        title: "",
        image: {}
    }
};

var Device = function () {
    function Device() {
        var deviceId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'unassigned';
        var deviceType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';

        _classCallCheck(this, Device);

        this.classId = "device";

        this.id = deviceId;
        this.type = deviceType;

        this.meta = metas[deviceType];

        this.data = {};

        this.attrs = {};
        this.status = {};
        this.alarms = {};
        this.events = {};
        this.subdevices = {};

        this.ready = false;

        this.init();
    }

    _createClass(Device, [{
        key: "init",
        value: function init() {
            var curUserName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "undefined";

            if (Object.keys(metas).includes(this.type)) {
                this.refresh();
            } else {
                var needmeta = void 0;
                this.refresh(needmeta = true);
            }

            this.createDeviceDataChannel(curUserName);
        }
    }, {
        key: "createDeviceDataChannel",
        value: function createDeviceDataChannel(curUserName) {
            if (this.createWebSocketDataChannel(curUserName)) {
                logger.debug("websocket通道创建成功。");
            } else if (this.createAjaxPollingDataChannel()) {
                logger.debug("websocket通道创建失败，换用ajax轮询。");
                logger.debug("ajax轮询通道创建成功。");
            } else {
                logger.debug("websocket通道创建失败，换用ajax轮询。");
                logger.debug("ajax轮询通道创建失败。当前没有通道获取后台通知。");
            }
        }
    }, {
        key: "createWebSocketDataChannel",
        value: function createWebSocketDataChannel(curUserName) {
            var self = this;
            StreamingManager.registerStreaming("device_streaming", new _datastreaming2.default());

            var informStreaming = StreamingManager.getStreaming("device_streaming");
            informStreaming.subscribe(function (value, channel) {
                self.updateDeviceData(value);
            });

            return true;
        }
    }, {
        key: "createAjaxPollingDataChannel",
        value: function createAjaxPollingDataChannel() {
            var self = this;
            try {
                setTimeout(function ajaxPolling() {
                    self.refresh();
                    setTimeout(ajaxPolling, 3000);
                }, 3000);
            } catch (e) {
                return false;
            }

            return true;
        }
    }, {
        key: "updateDeviceData",
        value: function updateDeviceData(deviceData) {
            var _this = this;

            this.meta = Object.keys(deviceData.meta).length ? deviceData.meta : metas[this.type] || metas["default"];

            this.data = deviceData.data || {};
            Object.keys(this.data).forEach(function (key) {
                _this[key] = _this.data[key];
            });

            this.ready = deviceData.ready || this.ready;

            if (Object.keys(deviceData.meta).length) {
                metas[this.type] = deviceData.meta;
            }
        }
    }, {
        key: "refresh",
        value: function refresh() {
            var needmeta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var self = this;
            var opts = { type: this.type, needmeta: needmeta };
            return new Promise(function (resolve, reject) {
                _webservice2.default.getJSON(urls.getdevicedatas, opts).then(function (response) {
                    if (response.status == "success") {
                        self.updateDeviceData(response.result.payload);
                    }
                    resolve(response.result);
                }).catch(function (reason) {
                    reject(reason);
                });
            });
        }
    }, {
        key: "execute",
        value: function execute(name) {
            var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var self = this;
            var opts = Object.assign({ deviceName: name }, args);
            return new Promise(function (resolve, reject) {
                _webservice2.default.post(urls.getdevicedatas, opts).then(function (response) {
                    if (response.status == "ok") {
                        logger.debug("mock response post: ", response, "actions.js post");
                        self.updateDeviceData(response.result);
                    }
                    resolve(response.result);
                }).catch(function (reason) {
                    reject(reason);
                });
            });
        }
    }, {
        key: "on",
        value: function on() {}
    }, {
        key: "open",
        value: function open() {}
    }]);

    return Device;
}();

exports.default = Device;

/***/ }),

/***/ "./src/common/device/device.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1196a064\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/common/device/device.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/common/device/device.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-1196a064\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/common/device/device.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\common\\device\\device.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] device.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1196a064", Component.options)
  } else {
    hotAPI.reload("data-v-1196a064", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/common/streamingmanager/ajax.channel.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.AlarmAjaxPollingDataChannel = exports.AjaxPollingDataChannel = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _datachannel = __webpack_require__("./src/common/streamingmanager/datachannel.js");

var _datachannel2 = _interopRequireDefault(_datachannel);

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AjaxPollingDataChannel = exports.AjaxPollingDataChannel = function (_DataChannel) {
	_inherits(AjaxPollingDataChannel, _DataChannel);

	function AjaxPollingDataChannel() {
		var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
		var interval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3000;

		_classCallCheck(this, AjaxPollingDataChannel);

		var _this = _possibleConstructorReturn(this, (AjaxPollingDataChannel.__proto__ || Object.getPrototypeOf(AjaxPollingDataChannel)).call(this));

		_this.url = url;
		_this.interval = interval;
		return _this;
	}

	_createClass(AjaxPollingDataChannel, [{
		key: "open",
		value: function open() {
			var _this2 = this;

			this.id = setInterval(function () {
				_webservice2.default.getJSON(_this2.url, function (data) {
					_this2.processData(data);
				});
			}, this.interval);
		}
	}, {
		key: "close",
		value: function close() {
			clearInterval(this.id);
		}
	}, {
		key: "processData",
		value: function processData(data) {
			this.dispatch(data);
		}
	}]);

	return AjaxPollingDataChannel;
}(_datachannel2.default);

var AlarmAjaxPollingDataChannel = exports.AlarmAjaxPollingDataChannel = function (_AjaxPollingDataChann) {
	_inherits(AlarmAjaxPollingDataChannel, _AjaxPollingDataChann);

	function AlarmAjaxPollingDataChannel() {
		_classCallCheck(this, AlarmAjaxPollingDataChannel);

		return _possibleConstructorReturn(this, (AlarmAjaxPollingDataChannel.__proto__ || Object.getPrototypeOf(AlarmAjaxPollingDataChannel)).apply(this, arguments));
	}

	_createClass(AlarmAjaxPollingDataChannel, [{
		key: "processData",
		value: function processData(observer, data) {
			if (data.status == "success") {
				if (data.type == "array") {
					if ($.isArray(data.result)) {
						$.each(data.result, function (index, value) {
							observer.next(value);
						});
					} else {
						observer.next(data.result);
					}
				}
			} else if (data.type == "error") {
				observer.error(data.message);
			}
		}
	}]);

	return AlarmAjaxPollingDataChannel;
}(AjaxPollingDataChannel);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./src/common/streamingmanager/datachannel.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DataChannel = function () {
	function DataChannel() {
		_classCallCheck(this, DataChannel);

		this.ready = false;
		this.dispatcher = null;
		this.datatype = "json";

		this.name = String(Math.random() + Math.random()).replace(/\d\.\d{4}/, "");
	}

	_createClass(DataChannel, [{
		key: "init",
		value: function init(dispatcher) {
			this.dispatcher = dispatcher;
			this.open();
		}
	}, {
		key: "open",
		value: function open() {}
	}, {
		key: "dispatch",
		value: function dispatch(data) {
			if (this.datatype == "json") {
				if (typeof data != "string") {
					try {
						data = JSON.parse(data);
					} catch (e) {}
				}
			}
			this.dispatcher._dispatch(data, this);
		}
	}, {
		key: "close",
		value: function close() {}
	}, {
		key: "send",
		value: function send(data) {}
	}]);

	return DataChannel;
}();

exports.default = DataChannel;

/***/ }),

/***/ "./src/common/streamingmanager/datamanager.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _datastreaming = __webpack_require__("./src/common/streamingmanager/datastreaming.js");

var _datastreaming2 = _interopRequireDefault(_datastreaming);

var _intervalChannel = __webpack_require__("./src/common/streamingmanager/interval.channel.js");

var _intervalChannel2 = _interopRequireDefault(_intervalChannel);

var _websocketChannel = __webpack_require__("./src/common/streamingmanager/websocket.channel.js");

var _websocketChannel2 = _interopRequireDefault(_websocketChannel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __instance = function () {
	var instance = void 0;
	return function (newInstance) {
		if (newInstance) instance = newInstance;
		return instance;
	};
}();

function generateID() {
	var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

	return prefix + String(Math.random() + Math.random()).replace(/\d\.\d{4}/, "");
}

var DataStreamingManager = function () {
	function DataStreamingManager() {
		_classCallCheck(this, DataStreamingManager);

		if (__instance()) return __instance();
		this.streamings = {};
		this.channels = {};
		this.dispatchers = {};
		__instance(this);
	}

	_createClass(DataStreamingManager, [{
		key: "registerChannel",
		value: function registerChannel(name, channel) {
			if (!(name in this.channels)) {
				this.channels[name] = channel;
			} else {
				console.log("Duplication of channel name.");
			}
			var channel = this.channels[name];
			try {
				channel.name = name;
				channel.init(this);
			} catch (e) {
				console.log("Register channel " + name + " error:" + e.message);
			}
			return channel;
		}
	}, {
		key: "unRegisterChannel",
		value: function unRegisterChannel(name) {
			try {
				this.channels[name].close();
				delete this.channels[name];
			} catch (e) {
				console.log("Unregister channel " + name + " error:" + e.message);
			}
		}
	}, {
		key: "registerStreaming",
		value: function registerStreaming(name, streaming) {
			if (name in this.streamings) {
				console.log("Duplication of streaming name.");
				return this.streamings[name];
			} else {
				this.streamings[name] = streaming;
				return streaming;
			}
		}
	}, {
		key: "unRegisterStreaming",
		value: function unRegisterStreaming(name) {
			delete this.streamings[name];
		}
	}, {
		key: "getStreaming",
		value: function getStreaming(name) {
			return this.streamings[name];
		}
	}, {
		key: "getChannel",
		value: function getChannel(name) {
			return this.channels[name];
		}
	}, {
		key: "addDispatcher",
		value: function addDispatcher() {
			var dispId = generateID("D");
			if (arguments.length == 2) {
				this.dispatchers[dispId] = [arguments[0], arguments[1]];
			} else if (arguments.length == 1) {
				this.dispatchers[dispId] = arguments[0];
			} else {
				console.log("Add dispatcher fail:error params.");
			}
			return dispId;
		}
	}, {
		key: "removeDispatcher",
		value: function removeDispatcher(dispId) {
			delete this.dispatchers[dispId];
		}
	}, {
		key: "_selectStreamings",
		value: function _selectStreamings(data, channel) {
			var streamings = [];
			for (var dispName in this.dispatchers) {
				var dispatcher = this.dispatchers[dispName];
				if (Array.isArray(dispatcher)) {
					if (channel.name == dispatcher[0]) {
						if (Array.isArray(dispatcher[1])) {
							streamings = streamings.concat(dispatcher[1]);
						} else {
							streamings.push(dispatcher[1]);
						}
					}
				} else {
					var target = dispatcher(data, channel);
					if (target) {
						streamings.push(target);
					}
				}
			}

			return [].concat(_toConsumableArray(new Set(streamings)));
		}
	}, {
		key: "_dispatch",
		value: function _dispatch(data, channel) {
			var streamings = this._selectStreamings(data, channel) || [];

			if (Object.keys(this.dispatchers).lengths = 0 || streamings.length == 0) {
				streamings = this.streamings;
			}
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = streamings[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var name = _step.value;

					try {
						var streaming = this.streamings[name];
						streaming.emit(data, channel);
					} catch (e) {}
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
		}
	}, {
		key: "OpenChannels",
		value: function OpenChannels() {
			for (var name in this.channels) {
				try {
					if (!this.channels[name].ready) {
						this.channels[name].open();
					}
				} catch (e) {
					console.log("When opening channel <" + name + "> error:" + e.message);
				}
			}
		}
	}, {
		key: "closeChannels",
		value: function closeChannels() {
			for (var name in this.channels) {
				try {
					this.channels[name].close();
				} catch (e) {
					console.log("When closing channel <" + name + "> error:" + e.message);
				}
			}
		}
	}, {
		key: "clearChannels",
		value: function clearChannels() {
			this.closeChannels();
			this.channels = {};
		}
	}, {
		key: "subscribe",
		value: function subscribe() {
			if (arguments.lenght == 1) {
				this.subscribes.push(arguments);
			} else if (arguments.lenght == 2) {
				this.streamings[arguments[0]].subscribe(arguments[1]);
			}
		}
	}]);

	return DataStreamingManager;
}();

var GSM = new DataStreamingManager();

GSM.registerStreaming("alarm_streaming", new _datastreaming2.default());
GSM.registerStreaming("response_streaming", new _datastreaming2.default());

window.StreamingManager = GSM;

exports.default = GSM;

/***/ }),

/***/ "./src/common/streamingmanager/datastreaming.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function generateID() {
	var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

	return prefix + String(Math.random() + Math.random()).replace(/\d\.\d{4}/, "");
}

var StreamingCancelError = Error("streaming cancel.");

function DataStreamingPathContext(rootContext) {
	var _this = this,
	    _arguments = arguments;

	this.__DATA_STREAMING_PATH__ = true;
	this.root = rootContext;
	this.filters = [];
	this.filter = function () {
		return context.filter.apply(_this, _arguments);
	};
	this.subscribe = function () {
		return context.subscribe.apply(_this, _arguments);
	};
}

var DataStreaming = function () {
	function DataStreaming(options) {
		_classCallCheck(this, DataStreaming);

		this.enabled = true;
		this.lastChannel = null;
		this.options = Object.assign({
			emitAtOnce: true,
			initValue: null }, options || {});
		this.lastValue = this.options.initValue;
		this.paths = {};
		this.subscribes = {};
	}

	_createClass(DataStreaming, [{
		key: "init",
		value: function init(dispatcher) {
			this.dispatcher = dispatcher;
		}
	}, {
		key: "emit",
		value: function emit(data, channel) {
			if (!this.enabled) return;
			this.lastValue = data;
			this.lastChannel = channel;
			for (var sid in this.subscribes) {
				var result = data;
				var subscribe = this.subscribes[sid];
				try {
					var path = this.paths[sid];
					if (path) {
						result = this._executeFilter(path.filters, result, channel);
					}
					if (subscribe.success) {
						subscribe.success.call(this, result, channel);
					}
				} catch (err) {
					console.log("Subscribe runtime error :", err.message);
					if (subscribe.error) {
						subscribe.error.call(this, err, channel);
					}
				}
			}
		}
	}, {
		key: "error",
		value: function error(state, channel) {
			if (!this.enabled) return;
			for (var sid in this.subscribes) {
				var subscribe = this.subscribes[sid];
				if (subscribe.error) {
					subscribe.error.call(this, state, channel);
				}
			}
		}
	}, {
		key: "_executeFilter",
		value: function _executeFilter(filters, data, channel) {
			if (filters.length == 0) {
				return data;
			} else {
				var result = data;
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = filters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var filter = _step.value;

						try {
							result = filter.call(this, result, channel);
						} catch (StreamingCancelError) {
							console.log("Execute streaming filter error:" + e.message);
							throw StreamingCancelError;
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

				return result;
			}
		}
	}, {
		key: "filter",
		value: function filter(callback) {
			var context = this;
			if (!context.__DATA_STREAMING_PATH__) {
				context = new DataStreamingPathContext(this);
			}
			context.filters.push(callback);
			return context;
		}
	}, {
		key: "subscribe",
		value: function subscribe(success, error) {
			var context = this;
			var sid = generateID();

			if (context.__DATA_STREAMING_PATH__) {
				var rootContext = context.root;
				rootContext.paths[sid] = {
					filters: context.filters
				};
			} else {
				rootContext = context;
			}

			rootContext.subscribes[sid] = {
				"success": success,
				"error": error
			};

			if (rootContext.options.emitAtOnce && rootContext.lastValue) {
				rootContext.emit(rootContext.lastValue, rootContext.lastChannel);
			}
			return sid;
		}
	}, {
		key: "unSubscribe",
		value: function unSubscribe(sid) {
			try {
				delete this.subscribes[sid];
				delete this.paths[sid];
			} catch (e) {}
		}
	}]);

	return DataStreaming;
}();

exports.default = DataStreaming;

/***/ }),

/***/ "./src/common/streamingmanager/interval.channel.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.IntervalDataChannel = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _datachannel = __webpack_require__("./src/common/streamingmanager/datachannel.js");

var _datachannel2 = _interopRequireDefault(_datachannel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IntervalDataChannel = exports.IntervalDataChannel = function (_DataChannel) {
	_inherits(IntervalDataChannel, _DataChannel);

	function IntervalDataChannel() {
		var initValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
		var interval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3000;

		_classCallCheck(this, IntervalDataChannel);

		var _this = _possibleConstructorReturn(this, (IntervalDataChannel.__proto__ || Object.getPrototypeOf(IntervalDataChannel)).call(this));

		_this.datatype = "raw";

		_this.count = initValue;
		_this.interval = interval;
		_this.id = 0;
		return _this;
	}

	_createClass(IntervalDataChannel, [{
		key: "open",
		value: function open() {
			var _this2 = this;

			if (this.id == 0) {
				this.id = setInterval(function () {
					_this2.count += 1;
					_this2.dispatch(_this2.count);
				}, this.interval);
			}
		}
	}, {
		key: "close",
		value: function close() {
			_get(IntervalDataChannel.prototype.__proto__ || Object.getPrototypeOf(IntervalDataChannel.prototype), "close", this).call(this);
			clearInterval(this.id);
			this.id = 0;
		}
	}]);

	return IntervalDataChannel;
}(_datachannel2.default);

exports.default = IntervalDataChannel;

/***/ }),

/***/ "./src/common/streamingmanager/websocket.channel.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _datachannel = __webpack_require__("./src/common/streamingmanager/datachannel.js");

var _datachannel2 = _interopRequireDefault(_datachannel);

var _reconnectingWebsocketMin = __webpack_require__("./src/assets/js/reconnecting-websocket.min.js");

var _reconnectingWebsocketMin2 = _interopRequireDefault(_reconnectingWebsocketMin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WebSocketDataChannel = function (_DataChannel) {
	_inherits(WebSocketDataChannel, _DataChannel);

	function WebSocketDataChannel(url, username) {
		_classCallCheck(this, WebSocketDataChannel);

		var _this = _possibleConstructorReturn(this, (WebSocketDataChannel.__proto__ || Object.getPrototypeOf(WebSocketDataChannel)).call(this));

		_this.username = username;
		_this.url = url;
		_this.iswebclient = "iswebclient";
		return _this;
	}

	_createClass(WebSocketDataChannel, [{
		key: "open",
		value: function open(streaming, observer) {
			var _this2 = this;

			if ("undefined" == typeof this._websockobj || null == this._websockobj) {
				this._websockobj = new _reconnectingWebsocketMin2.default(this.url);
				this._websockobj.onopen = function () {
					_this2.onWebSocketOpen(streaming, observer);
				};
				this._websockobj.onmessage = function (data) {
					_this2.onWebSocketMessage(streaming, observer, data);
				};
				this._websockobj.onclose = function (event) {
					_this2.onWebSocketClose(streaming, observer, event);
				};
				this._websockobj.onerror = function (event) {
					_this2.onWebSocketError(streaming, observer, event);
				};
			}
		}
	}, {
		key: "close",
		value: function close() {
			this._websockobj.close();
			this._websockobj = null;
		}
	}, {
		key: "send",
		value: function send(data) {
			this._websockobj.send(data);
		}
	}, {
		key: "reconnect",
		value: function reconnect() {
			this._websockobj.refresh();
		}
	}, {
		key: "onWebSocketOpen",
		value: function onWebSocketOpen(streaming, observer) {
			this.send('{"username":"' + this.username + '","iswebclient":"' + this.iswebclient + '"}');
			StreamingManager.addDispatcher(function (msg, channel) {
				if (msg.type == "notify") {
					return "alarm_streaming";
				} else if (msg.type == "200") {
					return "response_streaming";
				} else if (msg.type == "device") {
					return "device_streaming";
				} else {
					return "other_streaming";
				}
			});
		}
	}, {
		key: "onWebSocketMessage",
		value: function onWebSocketMessage(streaming, observer, message) {
			var msg = JSON.parse(message.data);

			this.dispatch(msg);
		}
	}, {
		key: "onWebSocketClose",
		value: function onWebSocketClose(streaming, observer, event) {
			this.reconnect();
		}
	}, {
		key: "onWebSocketError",
		value: function onWebSocketError(streaming, observer, event) {
			this.reconnect();
		}
	}]);

	return WebSocketDataChannel;
}(_datachannel2.default);

exports.default = WebSocketDataChannel;

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

/***/ "./src/urls.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

String.prototype.params = function (args, params) {
  var srcstr = this;
  var pattern = new UrlPattern(srcstr);
  return pattern.stringify(params);
};

var baseUrl = "/mock";

var captcha = exports.captcha = baseUrl + '/voerka/captcha/';var forgetpassword = exports.forgetpassword = baseUrl + '/voerka/forgetpassword/';var login = exports.login = baseUrl + '/voerka/login/';var logout = exports.logout = baseUrl + '/voerka/logout/';var resetpassword = exports.resetpassword = baseUrl + '/voerka/resetpassword/';var addiptalkupgradepack = exports.addiptalkupgradepack = baseUrl + 'devices/iptalk/addiptalkupgradepack/';var getdevicedatas = exports.getdevicedatas = baseUrl + '/device/getdevicedatas/';var getiptalkdevicelistbytreenodeid = exports.getiptalkdevicelistbytreenodeid = baseUrl + 'devices/iptalk/getiptalkdevicelistbytreenodeid/';var getformdata = exports.getformdata = baseUrl + '/voerka/getformdata/';var getuserinfo = exports.getuserinfo = baseUrl + '/voerka/getuserinfo/';var getnotifymessages = exports.getnotifymessages = baseUrl + '/voerka/getnotifymessages/';

/***/ }),

/***/ "./test/lth/device/lth.device.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-66b04f49\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./test/lth/device/lth.device.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./test/lth/device/lth.device.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-66b04f49\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./test/lth/device/lth.device.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\test\\lth\\device\\lth.device.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] lth.device.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-66b04f49", Component.options)
  } else {
    hotAPI.reload("data-v-66b04f49", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ })

});