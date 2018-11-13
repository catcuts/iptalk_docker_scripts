webpackJsonp([123],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/expand/ad/videoAdSetting.vue":
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
			cols: [{ name: 'DevID', title: L("设备ID", "iptalk") }, { name: 'Alias', title: L("设备名称", "iptalk") }, { name: 'State', title: L("设备状态", "iptalk") }, { name: 'FileList', title: L("音视频文件", "iptalk") }],
			deviceStates: [L("未启用", "iptalk"), L("断开", "iptalk"), L("空闲", "iptalk")],
			deviceStateColors: ['black', 'red', 'blue'],
			page: 1,
			pageSize: 10,
			pageCount: 0,
			devices: [],
			checkedAll: false,
			logList: [],
			downloadLog: [L("成功", "iptalk"), L("忙", "iptalk"), L("空间不够", "iptalk"), L("文件已存在", "iptalk"), L("ftp连接失败", "iptalk"), L("md5验证失败", "iptalk"), L("其它原因", "iptalk")],
			deleteLog: [L("成功", "iptalk"), L("忙", "iptalk"), L("文件不存在", "iptalk"), L("其它原因", "iptalk")],
			playLog: [L("成功", "iptalk"), L("忙", "iptalk"), L("没有文件", "iptalk"), L("其它原因", "iptalk")],
			stopLog: [L("成功", "iptalk"), L("忙", "iptalk"), L("已停止", "iptalk")],
			clearLog: [L("成功", "iptalk"), L("忙", "iptalk"), L("没有文件", "iptalk"), L("其它原因", "iptalk")],
			managerDialogOptions: {
				title: L("音视频文件管理", "iptalk"),
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
				source: "devices/operates/iptalk.video.add.vue",
				autoDestroy: true
			},
			logDialogOptions: {
				title: L("操作日志", "iptalk"),
				fit: false,
				header: {
					closeable: true
				},
				order: 1,
				width: '400px',
				height: '600px',
				moveable: true,
				resizable: true,
				dimmer: false,
				type: "vue",
				source: "devices/operates/iptalk.video.log.vue",
				autoDestroy: true
			},
			addDialogOptions: {
				title: L("选择需要新增的文件", "iptalk"),
				fit: false,
				header: {
					closeable: true
				},
				order: 1,
				width: '300px',
				height: '200px',
				moveable: true,
				resizable: true,
				type: "vue",
				source: "devices/operates/iptalk.video.select.vue",
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
	watch: {},
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
					self.devices = [];
					response.result.list.forEach(function (item) {
						if (item.DevID.startsWith('2')) {
							self.devices.push(item);
						}
					});
					self.pageCount = parseInt(self.devices.length / self.pageSize) + 1;
					self.getDevicesFiles();
				} else {
					alert(response.result);
				}
			});
		},
		getAdList: function getAdList(list) {
			if (!(list instanceof Array)) {
				list = [list];
			}
			if (list.length > 0) {
				_webservice2.default.getJSON(urls.getAdListByDevIds, { DevIDs: list }).then(function (response) {});
			}
		},
		getDevicesFiles: function getDevicesFiles() {
			var deviceList = [];
			this.devices.forEach(function (item) {
				if (item.State == 2) {
					deviceList.push(item.DevID);
				}
			});
			this.getAdList(deviceList);
		},
		manager: function manager() {
			var dialog = new _dialog.RichDialog(this.managerDialogOptions, { 'getIptalkAdPacks': urls.getIptalkAdPacks, 'addIptalkAdPack': urls.addIptalkAdPack, 'deleteIptalkAdPack': urls.deleteIptalkAdPack });
			dialog.show();
		},
		showlog: function showlog() {
			var dialog = new _dialog.RichDialog(this.logDialogOptions, { 'logList': this.logList });
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
		onFileDelete: function onFileDelete(row, fileName, event) {
			var self = this;
			var deviceIdList = this.formCherk(row);
			if (deviceIdList == undefined) {
				return;
			}
			_webservice2.default.getJSON(urls.deleteAdByDevIds, { DevIDs: deviceIdList, FileName: fileName }).then(function (response) {
				if (response.status == "success") {}
			});
		},
		add: function add(row) {
			var self = this;
			var deviceIdList = this.formCherk(row);
			if (deviceIdList == undefined) {
				return;
			}
			var dialog = new _dialog.RichDialog(this.addDialogOptions, { 'getIptalkAdPacks': urls.getIptalkAdPacks });
			dialog.show().then(function (item) {
				if (item.button.name != "ok") {
					return;
				}
				var selectedFile = item.contentVueInstance.selectedFile;
				_webservice2.default.getJSON(urls.addAdByDevIds, { DevIDs: deviceIdList, selectedFile: selectedFile }).then(function (response) {
					if (response.status == "success") {
						alert(response.result.successDevID.length + L("台设备正在添加", "iptalk"));
					} else {}
				});
			});
		},
		refresh: function refresh(row) {
			var deviceIdList = this.formCherk(row);
			if (deviceIdList == undefined) {
				return;
			}
			this.getAdList(deviceIdList);
		},
		clear: function clear(row) {
			var deviceIdList = this.formCherk(row);
			if (deviceIdList == undefined) {
				return;
			}
			_webservice2.default.getJSON(urls.clearAdByDevIds, { DevIDs: deviceIdList }).then(function (response) {
				if (response.status == "success") {
					alert(response.result.successDevID.length + L("台设备正在清空文件", "iptalk"));
				} else {}
			});
		},
		play: function play(row) {
			var deviceIdList = this.formCherk(row);
			if (deviceIdList == undefined) {
				return;
			}
			_webservice2.default.getJSON(urls.playAdByDevIds, { DevIDs: deviceIdList }).then(function (response) {
				if (response.status == "success") {}
			});
		},
		stop: function stop(row) {
			var deviceIdList = this.formCherk(row);
			if (deviceIdList == undefined) {
				return;
			}
			_webservice2.default.getJSON(urls.stopAdByDevIds, { DevIDs: deviceIdList }).then(function (response) {
				if (response.status == "success") {}
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
						if (obj.ActionNum == 2) {
							self.getAdList(obj.DevID);
						}
					}
				});
			} else if (obj.Action == 'deviceAd') {
				this.addLogList(obj);
				if (obj.SubAction == 'download') {
					if (obj.OperatorResult == 0) {
						this.getAdList(obj.DevID);
					}
				} else if (obj.SubAction == 'delete') {
					if (obj.OperatorResult == 0) {
						this.getAdList(obj.DevID);
					}
				} else if (obj.SubAction == 'query') {
					var temp = void 0;
					var i = 0;
					for (; i < this.devices.length; i++) {
						if (this.devices[i].DevID == obj.DevID) {
							temp = this.devices[i];
							break;
						}
					}
					temp.FileList = obj.FileList.sort();
					if (temp.FileList.length == 0) {
						temp.PlayFlag = 2;
					} else {
						temp.PlayFlag = obj.PlayFlag;
					}
					this.devices.splice(i, 1, temp);
				} else if (obj.SubAction == 'play') {
					if (obj.OperatorResult == 0) {
						this.getAdList(obj.DevID);
					}
				} else if (obj.SubAction == 'stop') {
					if (obj.OperatorResult == 0) {
						this.getAdList(obj.DevID);
					}
				} else if (obj.SubAction == 'clear') {
					if (obj.OperatorResult == 0) {
						this.getAdList(obj.DevID);
					}
				}
			}
		},
		addLogList: function addLogList(obj) {
			switch (obj.SubAction) {
				case 'download':
					{
						var msg = L("设备", "iptalk") + ' ' + obj.DevID + ' ' + L("下载", "iptalk") + ' ' + obj.FileName + ' ' + (obj.OperatorResult == 0 ? L("成功", "iptalk") : L("失败", "iptalk") + "(" + this.downloadLog[obj.OperatorResult] + ")");
						this.logList.push(msg);
						break;
					}
				case 'delete':
					{
						var _msg = L("设备", "iptalk") + ' ' + obj.DevID + ' ' + L("删除", "iptalk") + ' ' + obj.FileName + ' ' + (obj.OperatorResult == 0 ? L("成功", "iptalk") : L("失败", "iptalk") + "(" + this.deleteLog[obj.OperatorResult] + ")");
						this.logList.push(_msg);
						break;
					}
				case 'query':
					{
						break;
					}
				case 'play':
					{
						var _msg2 = L("设备", "iptalk") + ' ' + obj.DevID + ' ' + L("播放", "iptalk") + (obj.OperatorResult == 0 ? L("成功", "iptalk") : L("失败", "iptalk") + "(" + this.playLog[obj.OperatorResult] + ")");
						this.logList.push(_msg2);
						break;
					}
				case 'stop':
					{
						var _msg3 = L("设备", "iptalk") + ' ' + obj.DevID + ' ' + L("停止播放", "iptalk") + (obj.OperatorResult == 0 ? L("成功", "iptalk") : L("失败", "iptalk") + "(" + this.stopLog[obj.OperatorResult] + ")");
						this.logList.push(_msg3);
						break;
					}
				case 'clear':
					{
						var _msg4 = L("设备", "iptalk") + ' ' + obj.DevID + ' ' + L("清除文件", "iptalk") + (obj.OperatorResult == 0 ? L("成功", "iptalk") : L("失败", "iptalk") + "(" + this.clearLog[obj.OperatorResult] + ")");
						this.logList.push(_msg4);
						break;
					}
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

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-dcbe7aea\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/expand/ad/videoAdSetting.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.videoAdSetting[data-v-dcbe7aea]{\r\n\tposition: relative;\r\n\twidth: 100%;\r\n\tpadding: 20px;\r\n\theight: 100%;\r\n\toverflow-y: auto;\r\n\toverflow-x: hidden;\n}\n.videoAdSetting .manager[data-v-dcbe7aea]{\r\n\tmargin-bottom: 10px;\n}\n.videoAdSetting .deviceTable[data-v-dcbe7aea]{\r\n\tposition: relative;\n}\n.videoAdSetting .deviceTable .checkbox[data-v-dcbe7aea]{\r\n\twidth: 17px;\n}\n.videoAdSetting .deviceTable td[data-v-dcbe7aea]{\r\n\tpadding: 5px 11px;\n}\n.videoAdSetting .deviceTable td.buttons[data-v-dcbe7aea],\r\n.videoAdSetting .deviceTable th.buttons[data-v-dcbe7aea]\r\n{\r\n\tmin-width:330px;\n}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-dcbe7aea\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/expand/ad/videoAdSetting.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "videoAdSetting"
  }, [_c('div', {
    staticClass: "manager"
  }, [_c('button', {
    staticClass: "ui primary button",
    on: {
      "click": _vm.manager
    }
  }, [_vm._v(_vm._s(_vm.L("音视频文件管理", "iptalk")))]), _vm._v(" "), _c('button', {
    staticClass: "ui primary button",
    on: {
      "click": _vm.showlog
    }
  }, [_vm._v(_vm._s(_vm.L("操作日志", "iptalk")))])]), _vm._v(" "), _c('div', {
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
        _vm.play()
      }
    }
  }, [_vm._v(_vm._s(_vm.L("播放", "iptalk")))]), _vm._v(" "), _c('button', {
    staticClass: "ui primary button mini",
    on: {
      "click": function($event) {
        _vm.stop()
      }
    }
  }, [_vm._v(_vm._s(_vm.L("停止", "iptalk")))]), _vm._v(" "), _c('button', {
    staticClass: "ui primary button mini",
    on: {
      "click": function($event) {
        _vm.add()
      }
    }
  }, [_vm._v(_vm._s(_vm.L("新增", "iptalk")))]), _vm._v(" "), _c('button', {
    staticClass: "ui primary button mini",
    on: {
      "click": function($event) {
        _vm.refresh()
      }
    }
  }, [_vm._v(_vm._s(_vm.L("刷新", "iptalk")))]), _vm._v(" "), _c('button', {
    staticClass: "ui primary button mini",
    on: {
      "click": function($event) {
        _vm.clear()
      }
    }
  }, [_vm._v(_vm._s(_vm.L("清空", "iptalk")))])])], 2)]), _vm._v(" "), _c('tbody', _vm._l((_vm.rows), function(row) {
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
      }, [_vm._v(_vm._s(_vm.deviceStates[row[col.name]]))])] : [_vm._v("\n\t\t\t\t\t\t\t\t" + _vm._s(row[col.name]) + "\n\t\t\t\t\t\t\t")]]], 2)
    }), _vm._v(" "), _c('td', {
      staticClass: "buttons"
    }, [_c('button', {
      class: (row.PlayFlag == 1 ? '' : 'disabled ') + 'ui primary button mini',
      on: {
        "click": function($event) {
          _vm.play(row)
        }
      }
    }, [_vm._v(_vm._s(_vm.L("播放", "iptalk")))]), _vm._v(" "), _c('button', {
      class: (row.PlayFlag == 0 ? '' : 'disabled ') + 'ui primary button mini',
      on: {
        "click": function($event) {
          _vm.stop(row)
        }
      }
    }, [_vm._v(_vm._s(_vm.L("停止", "iptalk")))]), _vm._v(" "), _c('button', {
      staticClass: "ui primary button mini",
      on: {
        "click": function($event) {
          _vm.add(row)
        }
      }
    }, [_vm._v(_vm._s(_vm.L("新增", "iptalk")))]), _vm._v(" "), _c('button', {
      staticClass: "ui primary button mini",
      on: {
        "click": function($event) {
          _vm.refresh(row)
        }
      }
    }, [_vm._v(_vm._s(_vm.L("刷新", "iptalk")))]), _vm._v(" "), _c('button', {
      staticClass: "ui primary button mini",
      on: {
        "click": function($event) {
          _vm.clear(row)
        }
      }
    }, [_vm._v(_vm._s(_vm.L("清空", "iptalk")))])])], 2)
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
     require("vue-hot-reload-api").rerender("data-v-dcbe7aea", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-dcbe7aea\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/expand/ad/videoAdSetting.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-dcbe7aea\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/expand/ad/videoAdSetting.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("71c81bf2", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-dcbe7aea\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../../utils/lang-loader.js!./videoAdSetting.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-dcbe7aea\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../../utils/lang-loader.js!./videoAdSetting.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/apps/iptalk/expand/ad/videoAdSetting.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-dcbe7aea\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/expand/ad/videoAdSetting.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/expand/ad/videoAdSetting.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-dcbe7aea\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/expand/ad/videoAdSetting.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-dcbe7aea",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\iptalk\\expand\\ad\\videoAdSetting.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] videoAdSetting.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-dcbe7aea", Component.options)
  } else {
    hotAPI.reload("data-v-dcbe7aea", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ })

});