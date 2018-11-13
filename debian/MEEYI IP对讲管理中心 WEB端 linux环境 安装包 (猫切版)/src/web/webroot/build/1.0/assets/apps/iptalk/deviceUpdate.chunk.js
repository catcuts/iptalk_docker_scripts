webpackJsonp([124],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/device-update.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

var _urls = __webpack_require__("./src/apps/iptalk/urls.js");

var urls = _interopRequireWildcard(_urls);

var _dialog = __webpack_require__("./src/common/dialog.rich.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: {},
	data: function data() {
		var self = this;
		return {
			groupID: 'custom',
			targetinfo: undefined,
			type: 1,
			cols: [{ name: 'DevID', title: L("设备ID", "iptalk") }, { name: 'Alias', title: L("设备名称", "iptalk") }, { name: 'DevIP', title: L("设备IP", "iptalk") }, { name: 'Version', title: L("设备版本", "iptalk") }, { name: 'State', title: L("设备状态", "iptalk") }, { name: 'UpgradeState', title: L("升级状态", "iptalk") }],
			deviceStates: [L("未启用", "iptalk"), L("断开", "iptalk"), L("空闲", "iptalk")],
			deviceStateColors: ['black', 'red', 'blue'],
			page: 1,
			pageSize: 10,
			pageCount: 0,
			devices: [],
			checkedAll: false,
			managerDialogOptions: {
				title: L("升级文件管理", "iptalk"),
				fit: false,
				header: {
					closeable: true
				},
				order: 1,
				width: '400px',
				height: '600px',
				moveable: true,
				resizable: true,
				type: "vue",
				source: "devices/operates/iptalk.update.add.vue",
				autoDestroy: true
			},
			addDialogOptions: {
				title: L("选择需要新增的文件", "iptalk"),
				fit: false,
				header: {
					closeable: true
				},
				order: 1,
				width: '400px',
				height: '200px',
				moveable: true,
				resizable: true,
				type: "vue",
				source: "devices/operates/iptalk.update.select.vue",
				autoDestroy: true
			}
		};
	},

	computed: {
		rows: function rows() {
			var left = this.pageSize * (this.page - 1);
			var right = left + this.pageSize;
			return this.devices.slice(left, right);
		}
	},
	methods: {
		prev: function prev() {
			if (this.page <= 1) {
				return;
			}
			this.page -= 1;
		},
		next: function next() {
			if (this.page >= this.pageCount) {
				return;
			}
			this.page += 1;
		},
		changePage: function changePage(event) {
			var value = event.target.value;
			this.page = typeof value == "number" ? value : parseInt(value);
		},
		onSelectChange: function onSelectChange(row) {
			if (row.checked == true) {
				row.checked = false;
			} else {
				row.checked = true;
			}
		},
		onSelectAllChange: function onSelectAllChange() {
			var self = this;
			this.checkedAll = !this.checkedAll;
			this.devices.forEach(function (item) {
				item.checked = self.checkedAll;
			});
		},
		getSelectDevID: function getSelectDevID() {
			var online = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			var checkedList = [];
			this.devices.forEach(function (item) {
				if (item.checked == true && (online == false || item.State == 2)) {
					checkedList.push(item.DevID);
				}
			});
			return checkedList;
		},
		getDevices: function getDevices() {
			var self = this;
			_webservice2.default.getJSON(urls.getIptalkDeviceListByTreeNodeID, { treeNodeID: this.groupID, type: this.type, targetInfo: this.targetinfo }).then(function (response) {
				if (response.status == "success") {
					response.result.list.forEach(function (item) {
						item.UpgradeState = "";
					});
					self.devices = response.result.list;
					self.pageCount = parseInt(self.devices.length / self.pageSize) + 1;
				} else {
					alert(response.result);
				}
			});
		},
		manager: function manager() {
			var dialog = new _dialog.RichDialog(this.managerDialogOptions, { 'getIptalkUpdatePacks': urls.getIptalkUpdatePacks, 'addIptalkUpdatePack': urls.addIptalkUpdatePack, 'deleteIptalkUpdatePack': urls.deleteIptalkUpdatePack });
			dialog.show();
		},
		formCherk: function formCherk(row) {
			var deviceIdList = void 0;
			if (row == undefined) {
				deviceIdList = this.getSelectDevID(true);
				if (deviceIdList.length == 0) {
					alert(L("勾选的设备均不在线", "iptalk"));
					return;
				}
			} else {
				if (row.State != 2) {
					alert(L("设备不在线", "iptalk"));
					return;
				}
				deviceIdList = [row.DevID];
			}
			return deviceIdList;
		},
		update: function update(row) {
			var self = this;
			var deviceIdList = this.formCherk(row);
			if (deviceIdList == undefined) {
				return;
			}

			var dialog = new _dialog.RichDialog(this.addDialogOptions, { 'getIptalkUpdatePacks': urls.getIptalkUpdatePacks });
			dialog.show().then(function (item) {
				var selectedFile = item.contentVueInstance.selectedFile;
				if (item.button.name == "ok") {
					self.devices.forEach(function (item) {
						if (deviceIdList.contains(item.DevID) && selectedFile != "") {
							item.UpgradeState = L("准备升级中", "iptalk");
						}
					});
				} else {
					return;
				}

				_webservice2.default.getJSON(urls.deviceUpdate, { DevIDs: deviceIdList, selectedFile: selectedFile }).then(function (response) {
					if (response.status == "success") {
						if (response.result.length > 0) {
							alert(response.message);
							self.devices.forEach(function (item) {
								if (response.result.contains(item.DevID)) {
									item.UpgradeState = L("升级失败", "iptalk");
								}
							});
						}
					}
				});
			});
		},
		restart: function restart(row) {
			var deviceIdList = this.formCherk(row);
			if (deviceIdList == undefined) {
				return;
			}
			this.control(deviceIdList, 'restart');
		},
		reset: function reset(row) {
			var deviceIdList = this.formCherk(row);
			if (deviceIdList == undefined) {
				return;
			}
			this.control(deviceIdList, 'reset');
		},
		demolition: function demolition(row) {
			var deviceIdList = this.formCherk(row);
			if (deviceIdList == undefined) {
				return;
			}
			this.control(deviceIdList, 'demolition');
		},
		forceCall: function forceCall(row) {
			alert(1);
		},
		control: function control(deviceIdList, cmd) {
			_webservice2.default.getJSON(urls.deviceControl, { DevIDs: deviceIdList, Cmd: cmd }).then(function (response) {
				if (response.status == "success") {
					alert(response.result);
				} else {
					alert(response.result);
				}
			});
		},
		startSubscribe: function startSubscribe() {
			var self = this;
			this.streamSid = StreamingManager.getStreaming("IPTalk_Streaming").subscribe(function (response, channel) {
				self.onMessage(response);
			});
		},
		onMessage: function onMessage(response) {
			var self = this;
			var obj = JSON.parse(response.data);
			if (obj.Action == 'deviceAction') {
				this.devices.forEach(function (item) {
					if (item.DevID == obj.DevID) {
						item.State = obj.ActionNum;
					}
				});
			} else if (obj.Action == 'deviceUpdate') {
				this.devices.forEach(function (item) {
					if (item.DevID == obj.DevID) {
						item.UpgradeState = obj.UpgradeState;
					}
				});
			}
		}
	},
	mounted: function mounted() {
		this.getDevices();
		this.startSubscribe();
	},
	beforeDestroy: function beforeDestroy() {
		delete StreamingManager.getStreaming("IPTalk_Streaming").subscribes[this.streamSid];
	}
};

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2b497016\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/device-update.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.deviceUpdate[data-v-2b497016]{\r\n\tposition: relative;\r\n\twidth: 100%;\r\n\tpadding: 20px;\r\n\theight: 100%;\r\n\toverflow-y: auto;\r\n\toverflow-x: hidden;\n}\n.deviceUpdate .manager[data-v-2b497016]{\r\n\tmargin-bottom: 10px;\n}\n.deviceUpdate .deviceTable[data-v-2b497016]{\r\n\tposition: relative;\n}\n.deviceUpdate .deviceTable .checkbox[data-v-2b497016]{\r\n\twidth: 17px;\n}\n.deviceUpdate .deviceTable td[data-v-2b497016]{\r\n\tpadding: 5px 11px;\n}\n.deviceUpdate .deviceTable td.buttons[data-v-2b497016],\r\n.deviceUpdate .deviceTable th.buttons[data-v-2b497016]\r\n{\r\n\tmin-width:60px;\n}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-2b497016\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/device-update.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "deviceUpdate"
  }, [_c('div', {
    staticClass: "manager"
  }, [_c('button', {
    staticClass: "ui primary button",
    on: {
      "click": _vm.manager
    }
  }, [_vm._v(_vm._s(_vm.L("升级文件管理", "iptalk")))]), _vm._v("\n\t\t\t" + _vm._s(_vm.L('版本号示例：image_V02.05.0068.14.dd，仅版本号用点隔开')) + "\n\t\t")]), _vm._v(" "), _c('div', {
    staticClass: "deviceTable"
  }, [_c('table', {
    staticClass: "ui celled table"
  }, [_c('thead', [_c('tr', [_c('th', {
    staticClass: "checkbox"
  }, [_c('div', {
    staticClass: "ui checkbox"
  }, [_c('input', {
    attrs: {
      "type": "checkbox"
    },
    domProps: {
      "checked": _vm.checkedAll
    },
    on: {
      "change": _vm.onSelectAllChange
    }
  }), _vm._v(" "), _c('label')])]), _vm._v(" "), _vm._l((_vm.cols), function(col) {
    return _c('th', [_vm._v(_vm._s(col.title))])
  }), _vm._v(" "), _c('th', {
    staticClass: "buttons"
  }, [_c('button', {
    staticClass: "ui primary button mini",
    on: {
      "click": function($event) {
        _vm.update()
      }
    }
  }, [_vm._v(_vm._s(_vm.L("升级", "iptalk")))]), _vm._v(" "), _c('button', {
    staticClass: "ui primary button mini",
    on: {
      "click": function($event) {
        _vm.restart()
      }
    }
  }, [_vm._v(_vm._s(_vm.L("重启", "iptalk")))])])], 2)]), _vm._v(" "), _c('tbody', _vm._l((_vm.rows), function(row) {
    return _c('tr', [_c('td', {
      staticClass: "checkbox"
    }, [_c('div', {
      staticClass: "ui checkbox"
    }, [_c('input', {
      attrs: {
        "type": "checkbox"
      },
      domProps: {
        "checked": row.checked
      },
      on: {
        "change": function($event) {
          _vm.onSelectChange(row)
        }
      }
    }), _vm._v(" "), _c('label')])]), _vm._v(" "), _vm._l((_vm.cols), function(col) {
      return _c('td', [(row[col.name] instanceof Array) ? [_vm._l((row[col.name]), function(item) {
        return [_c('a', {
          staticClass: "ui label"
        }, [_vm._v(_vm._s(item)), _c('i', {
          staticClass: "delete icon",
          on: {
            "click": function($event) {
              _vm.onFileDelete(row, item, $event)
            }
          }
        })])]
      })] : [(col.name == 'State') ? [_c('font', {
        attrs: {
          "color": _vm.deviceStateColors[row[col.name]]
        }
      }, [_vm._v(_vm._s(_vm.deviceStates[row[col.name]]))])] : [_vm._v("\n\t\t\t\t\t\t\t\t\t" + _vm._s(row[col.name]) + "\n\t\t\t\t\t\t\t\t")]]], 2)
    }), _vm._v(" "), _c('td', {
      staticClass: "buttons"
    }, [_c('button', {
      staticClass: "ui primary button mini",
      on: {
        "click": function($event) {
          _vm.update(row)
        }
      }
    }, [_vm._v(_vm._s(_vm.L("升级", "iptalk")))]), _vm._v(" "), _c('button', {
      staticClass: "ui primary button mini",
      on: {
        "click": function($event) {
          _vm.restart(row)
        }
      }
    }, [_vm._v(_vm._s(_vm.L("重启", "iptalk")))])])], 2)
  }))]), _vm._v(" "), _c('button', {
    staticClass: "ui primary button",
    on: {
      "click": _vm.prev
    }
  }, [_vm._v(_vm._s(_vm.L("上一页", "iptalk")))]), _vm._v(" "), _c('select', {
    staticClass: "ui dropdown",
    domProps: {
      "value": _vm.page
    },
    on: {
      "change": _vm.changePage
    }
  }, _vm._l((_vm.pageCount), function(n) {
    return _c('option', [_vm._v(_vm._s(n))])
  })), _vm._v(" "), _c('button', {
    staticClass: "ui primary button",
    on: {
      "click": _vm.next
    }
  }, [_vm._v(_vm._s(_vm.L("下一页", "iptalk")))])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-2b497016", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2b497016\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/device-update.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2b497016\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/device-update.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("0fff6f29", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2b497016\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./device-update.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2b497016\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./device-update.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/apps/iptalk/deviceManager/device-update.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2b497016\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/device-update.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/device-update.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-2b497016\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/device-update.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-2b497016",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\iptalk\\deviceManager\\device-update.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] device-update.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2b497016", Component.options)
  } else {
    hotAPI.reload("data-v-2b497016", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ })

});