webpackJsonp([96],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/device-list.vue":
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

var _menubar = __webpack_require__("./src/components/menubar.vue");

var _menubar2 = _interopRequireDefault(_menubar);

var _eventbus = __webpack_require__("./src/common/eventbus.js");

var _eventbus2 = _interopRequireDefault(_eventbus);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: { vuetable: _table2.default, menubar: _menubar2.default },
	data: function data() {
		var self = this;
		return {
			alias: L("设备名称", "iptalk"),
			devip: L("IP地址", "iptalk"),
			devMASK: L("子网掩码", "iptalk"),
			devGW: L("网关", "iptalk"),
			dns: L("DNS", "iptalk"),
			version: L("版本", "iptalk"),
			cols: [{ name: 'DevID', title: L("设备ID", "iptalk"), width: "120px" }, { name: 'Alias', title: L("设备名称", "iptalk") }, { name: 'DevIP', title: L("设备IP", "iptalk"), width: "120px" }, { name: 'Version', title: L("设备版本", "iptalk"), width: "120px" }, { name: 'SvrIP', title: L("服务器IP", "iptalk"), width: "120px" }, { name: 'State', title: L("设备状态", "iptalk"), width: "120px", type: "custom", output: function output(row, colname) {
					return '<font color="' + self.deviceStateColors[row[colname.name]] + '">' + self.deviceStates[row[colname.name]] + '</font>';
				}
			}],
			rows: [],
			datas: [],
			pagination: {
				pageNumber: 1,
				pageCount: 0,
				pageSize: 20
			},
			deviceTypes: [L("其他", "iptalk"), L("终端", "iptalk"), L("话筒", "iptalk")],
			deviceStates: [L("未启用", "iptalk"), L("断开", "iptalk"), L("空闲", "iptalk"), L("广播中...", "iptalk"), L("通话中...", "iptalk")],
			deviceStateColors: ['black', 'red', 'blue', 'blue', 'blue'],
			mode: 1,
			items: [{
				text: L("升级", "iptalk"), icon: "level up",
				click: function click() {
					window.location.href = urls.host + "devices/iptalk/#/deviceUpdate";
				}
			}, {
				text: L("列表模式", "iptalk"), icon: "list", right: true, active: true, group: "deviceView",
				click: function click() {
					self.mode = 1;
					self.onLoadData();
				}
			}, {
				text: L("图标模式", "iptalk"), icon: "image", right: true, active: false, group: "deviceView",
				click: function click() {
					self.mode = 2;
					self.onLoadData();
				}
			}]
		};
	},

	watch: {
		"groupID": function groupID(newvalue, oldvalue) {
			this.onLoadData();
		}
	},
	props: {
		groupID: { type: String },
		type: { type: Number },
		targetinfo: { type: String, default: undefined }
	},
	methods: {
		onLoadData: function onLoadData(context) {
			var self = this;
			var newPage = context ? context.newPage : 1;
			this.getList(newPage, this.pagination.pageSize, function (result) {
				self.dumpToPage(result, context);
			});
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
		headerClick: function headerClick(col) {},
		getList: function getList(newPage, pageSize, callback) {
			var self = this;
			if (this.mode == 1) {
				_webservice2.default.getJSON(urls.getIptalkDeviceListByTreeNodeID, { treeNodeID: this.groupID, type: this.type, targetInfo: this.targetinfo, newPage: newPage, pageSize: pageSize }).then(function (response) {
					if (response.status == "success") {
						callback(response.result);
					} else {
						alert(response.result);
					}
				});
			} else if (this.mode == 2) {
				_webservice2.default.getJSON(urls.getIptalkDeviceListByTreeNodeID, { treeNodeID: this.groupID, type: this.type, targetInfo: this.targetinfo }).then(function (response) {
					if (response.status == "success") {
						self.datas = response.result.list;
					} else {
						alert(response.result);
					}
				});
			}
		},
		clearColsSort: function clearColsSort() {},
		startSubscribe: function startSubscribe() {
			var self = this;
			this.streamSid = StreamingManager.getStreaming("IPTalk_Streaming").subscribe(function (response, channel) {
				self.onMessage(response);
			});
		},
		onMessage: function onMessage(response) {
			var obj = JSON.parse(response.data);
			if (obj.Action === 'deviceAction') {
				this.datas.forEach(function (item) {
					if (item.DevID == obj.DevID) {
						if (obj.ActionNum == 4) obj.ActionNum = 2;
						item.State = obj.ActionNum;
					}
				});
				this.rows.forEach(function (item) {
					if (item.DevID == obj.DevID) {
						if (obj.ActionNum == 4) obj.ActionNum = 2;
						item.State = obj.ActionNum;
					}
				});
			}
		}
	},
	mounted: function mounted() {
		this.onLoadData();
		this.startSubscribe();
	},
	beforeDestroy: function beforeDestroy() {
		delete StreamingManager.getStreaming("IPTalk_Streaming").subscribes[this.streamSid];
	},
	destroyed: function destroyed() {}
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/device.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mikeInfo = __webpack_require__("./src/apps/iptalk/deviceManager/mike-info.vue");

var _mikeInfo2 = _interopRequireDefault(_mikeInfo);

var _terminal = __webpack_require__("./src/apps/iptalk/deviceManager/terminal.vue");

var _terminal2 = _interopRequireDefault(_terminal);

var _ktSpeaker = __webpack_require__("./src/apps/iptalk/deviceManager/kt-speaker.vue");

var _ktSpeaker2 = _interopRequireDefault(_ktSpeaker);

var _gk = __webpack_require__("./src/apps/iptalk/deviceManager/gk680.vue");

var _gk2 = _interopRequireDefault(_gk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: { mikeinfo: _mikeInfo2.default, terminal: _terminal2.default, ktspeaker: _ktSpeaker2.default, gk680: _gk2.default },
	data: function data() {
		return {};
	},

	props: {
		devID: { type: String },
		treeId: { type: String, default: '' }
	},
	methods: {},
	mounted: function mounted() {}
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-alarmstatus.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

var _urls = __webpack_require__("./src/apps/iptalk/urls.js");

var urls = _interopRequireWildcard(_urls);

__webpack_require__("./src/assets/js/semantic/components/button.min.css");

__webpack_require__("./src/assets/js/semantic/components/form.min.css");

__webpack_require__("./src/assets/js/semantic/components/form.min.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: {},
	data: function data() {
		return {
			alarmIntv: 10,
			driveAssistT: 60,
			assistNO: '',
			setting: L("设置", "iptalk"),
			alarmInterval: L("报警间隔时间（1-255秒）", "iptalk"),
			driveAssistTime: L("驱动辅助时间（1-65535秒）", "iptalk"),
			Label: L("辅助号", "iptalk"),
			all: L("所有辅助", "iptalk"),
			timeOut: 0
		};
	},

	props: {
		devID: { type: String, default: '' },
		ip: { type: String, default: '' }
	},
	watch: {},
	methods: {
		setAlarmIntv: function setAlarmIntv() {
			self = this;
			_webservice2.default.getJSON(urls.setGK680AlarmInterval, { DevID: this.devID, alarmIntv: this.alarmIntv, ip: this.ip }, function (response) {
				if (response.status == "success") {
					self.timeOut = setTimeout("alert('设置报警间隔时间超时')", 5000);
				} else {
					alert(response.message);
				}
			});
		},
		setDriveAssistT: function setDriveAssistT() {
			self = this;
			_webservice2.default.getJSON(urls.setGK680DriveAssistTime, { DevID: this.devID, driveAssistT: this.driveAssistT, assistNO: this.assistNO, ip: this.ip }, function (response) {
				if (response.status == "success") {
					self.timeOut = setTimeout("alert('设置驱动辅助时间超时')", 5000);
				} else {
					alert(response.message);
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
			if (obj.Action === 'gk680AlarmInterval' || obj.Action === 'gk680DriveAssistTime') {
				clearTimeout(self.timeOut);
				alert(obj.Remark);
			}
		}
	},
	mounted: function mounted() {
		this.startSubscribe();
	},
	beforeDestroy: function beforeDestroy() {
		delete StreamingManager.getStreaming("IPTalk_Streaming").subscribes[this.streamSid];
	}
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-alarmtype.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

var _urls = __webpack_require__("./src/apps/iptalk/urls.js");

var urls = _interopRequireWildcard(_urls);

__webpack_require__("./src/assets/js/semantic/components/button.min.css");

__webpack_require__("./src/assets/js/semantic/components/form.min.css");

__webpack_require__("./src/assets/js/semantic/components/form.min.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: {},
	data: function data() {
		return {
			setting: L("设置", "iptalk"),
			defence1: L("1号防区", "iptalk"),
			defence2: L("2号防区", "iptalk"),
			defence3: L("3防区", "iptalk"),
			defence4: L("4防区", "iptalk"),
			defence5: L("5号防区", "iptalk"),
			defence6: L("6号防区", "iptalk"),
			defence7: L("7号防区", "iptalk"),
			defence8: L("8号防区", "iptalk"),
			defence9: L("9号防区", "iptalk"),
			defence10: L("10号防区", "iptalk"),
			defence11: L("11号防区", "iptalk"),
			defence12: L("12号防区", "iptalk"),
			defence13: L("13号防区", "iptalk"),
			defence14: L("14号防区", "iptalk"),
			defence15: L("15号防区", "iptalk"),
			defence16: L("16号防区", "iptalk")
		};
	},

	props: {
		item: { type: Object, default: function _default() {} },
		devID: { type: String, default: '' },
		ip: { type: String, default: '' }
	},
	watch: {},
	methods: {
		alarmTypeSubmit: function alarmTypeSubmit() {
			self = this;
			if (!('DevID' in self.item)) {
				self.item.DevID = self.devID;
			}
			this.item.ip = this.ip;
			_webservice2.default.getJSON(urls.setGK680AlarmType, this.item, function (response) {
				alert(response.message);
			});
		}
	},
	mounted: function mounted() {}
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-assistctrl.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

var _urls = __webpack_require__("./src/apps/iptalk/urls.js");

var urls = _interopRequireWildcard(_urls);

__webpack_require__("./src/assets/js/semantic/components/button.min.css");

__webpack_require__("./src/assets/js/semantic/components/form.min.css");

__webpack_require__("./src/assets/js/semantic/components/form.min.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: {},
	data: function data() {
		return {
			ctrl: { 'assist1': '', 'assist2': '', 'assist3': '', 'assist4': '', 'assist5': '', 'assist6': '', 'assist7': '', 'assist8': '' },
			relate: {},
			assist: {
				assist1: L("辅助1", "iptalk"),
				assist2: L("辅助2", "iptalk"),
				assist3: L("辅助3", "iptalk"),
				assist4: L("辅助4", "iptalk"),
				assist5: L("辅助5", "iptalk"),
				assist6: L("辅助6", "iptalk"),
				assist7: L("辅助7", "iptalk"),
				assist8: L("辅助8", "iptalk")
			},
			disconnect: L("断开", "iptalk"),
			connect: L("闭合", "iptalk"),
			setting: L("设置", "iptalk"),
			read: L("读取", "iptalk"),
			clear: L("清除", "iptalk"),
			timeOut: 0
		};
	},

	props: {
		devID: { type: String, default: '' },
		ip: { type: String, default: '' }
	},
	watch: {
		"devID": function devID(newvalue, oldvalue) {
			this.init();
		}
	},
	methods: {
		init: function init() {
			this.ctrl = { 'assist1': '', 'assist2': '', 'assist3': '', 'assist4': '', 'assist5': '', 'assist6': '', 'assist7': '', 'assist8': '' };
		},
		getAssistCtrl: function getAssistCtrl() {
			self = this;
			_webservice2.default.getJSON(urls.getGK680AssistCtrl, { DevID: this.devID, ip: this.ip }, function (response) {
				if (response.status == "success") {
					self.timeOut = setTimeout("alert('辅助状态获取超时')", 5000);
				} else {
					alert(response.message);
				}
			});
		},
		setAssistCtrl: function setAssistCtrl(data) {
			self = this;
			data.DevID = this.devID;
			data.ip = this.ip;
			_webservice2.default.getJSON(urls.setGK680AssistCtrl, data, function (response) {
				if (response.status == "success") {
					self.timeOut = setTimeout("alert('辅助状态设置超时')", 5000);
				} else {
					alert(response.message);
				}
			});
		},
		clearDataCtrl: function clearDataCtrl(data) {
			this.ctrl[data] = '';
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
			if (obj.Action === 'gk680AssistCtrl') {
				if (obj.ActionNum === 1) {
					var assist1 = obj.Ctrl.assist1 === self.ctrl.assist1;
					var assist2 = obj.Ctrl.assist2 === self.ctrl.assist2;
					var assist3 = obj.Ctrl.assist3 === self.ctrl.assist3;
					var assist4 = obj.Ctrl.assist4 === self.ctrl.assist4;
					var assist5 = obj.Ctrl.assist5 === self.ctrl.assist5;
					var assist6 = obj.Ctrl.assist6 === self.ctrl.assist6;
					var assist7 = obj.Ctrl.assist7 === self.ctrl.assist7;
					var assist8 = obj.Ctrl.assist8 === self.ctrl.assist8;
					if (assist1) {
						alert('辅助1设置成功');
					} else if (assist2) {
						alert('辅助2设置成功');
					} else if (assist3) {
						alert('辅助3设置成功');
					} else if (assist4) {
						alert('辅助4设置成功');
					} else if (assist5) {
						alert('辅助5设置成功');
					} else if (assist6) {
						alert('辅助6设置成功');
					} else if (assist7) {
						alert('辅助7设置成功');
					} else if (assist8) {
						alert('辅助8设置成功');
					} else {
						alert('辅助设置失败');
					}
				} else {
					self.ctrl = obj.Ctrl;
					alert('辅助状态获取成功');
				}
				clearTimeout(self.timeOut);
			}
		}
	},
	mounted: function mounted() {
		this.startSubscribe();
	},
	beforeDestroy: function beforeDestroy() {
		delete StreamingManager.getStreaming("IPTalk_Streaming").subscribes[this.streamSid];
	}
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-assistrelate.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

var _urls = __webpack_require__("./src/apps/iptalk/urls.js");

var urls = _interopRequireWildcard(_urls);

__webpack_require__("./src/assets/js/semantic/components/button.min.css");

__webpack_require__("./src/assets/js/semantic/components/form.min.css");

__webpack_require__("./src/assets/js/semantic/components/form.min.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = {
	components: {},
	data: function data() {
		var _ref;

		return _ref = {
			relate: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] },
			assist: {
				assist1: L("辅助1", "iptalk"),
				assist2: L("辅助2", "iptalk"),
				assist3: L("辅助3", "iptalk"),
				assist4: L("辅助4", "iptalk"),
				assist5: L("辅助5", "iptalk"),
				assist6: L("辅助6", "iptalk"),
				assist7: L("辅助7", "iptalk"),
				assist8: L("辅助8", "iptalk")
			},
			arealist: [{ text: L("防区", "iptalk"), value: '' }, { text: L("1号防区", "iptalk"), value: 1 }, { text: L("2号防区", "iptalk"), value: 2 }, { text: L("3号防区", "iptalk"), value: 3 }, { text: L("4号防区", "iptalk"), value: 4 }, { text: L("5号防区", "iptalk"), value: 5 }, { text: L("6号防区", "iptalk"), value: 6 }, { text: L("7号防区", "iptalk"), value: 7 }, { text: L("8号防区", "iptalk"), value: 8 }, { text: L("9号防区", "iptalk"), value: 9 }, { text: L("10号防区", "iptalk"), value: 10 }, { text: L("11号防区", "iptalk"), value: 11 }, { text: L("12号防区", "iptalk"), value: 12 }, { text: L("13号防区", "iptalk"), value: 13 }, { text: L("14号防区", "iptalk"), value: 14 }, { text: L("15号防区", "iptalk"), value: 15 }, { text: L("16号防区", "iptalk"), value: 16 }],
			setting: L("设置", "iptalk"),
			read: L("读取", "iptalk"),
			clear: L("清除", "iptalk"),
			ctrl_old: {},
			relate_old: {}
		}, _defineProperty(_ref, 'relate_old', { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] }), _defineProperty(_ref, 'timeOut', 0), _ref;
	},

	props: {
		devID: { type: String, default: '' },
		ip: { type: String, default: '' }
	},
	watch: {
		"devID": function devID(newvalue, oldvalue) {
			this.init();
		}
	},
	methods: {
		init: function init() {
			$('.ui.dropdown.relate').dropdown('clear');
		},
		getAssistRelate: function getAssistRelate(assistNO) {
			self = this;
			_webservice2.default.getJSON(urls.getGK680AssistRelate, { DevID: this.devID, assistNO: assistNO, ip: this.ip }, function (response) {
				if (response.status == "success") {
					self.timeOut = setTimeout("alert('获取辅助关联防区超时')", 5000);
				} else {
					alert(response.message);
				}
			});
		},
		setAssistRelate: function setAssistRelate(assistNO, data) {
			self = this;
			_webservice2.default.getJSON(urls.setGK680AssistRelate, { DevID: this.devID, assistNO: assistNO, relate: data, ip: this.ip }, function (response) {
				if (response.status == "success") {
					self.timeOut = setTimeout("alert('设置辅助关联防区超时')", 5000);
				} else {
					alert(response.message);
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

			if (obj.Action === 'gk680AssistRelate') {
				if (obj.ActionNum === 1) {
					if (obj.Relate.toString() === self.relate[obj.AssistNO - 1].toString()) {
						self.relate_old[obj.AssistNO - 1] = [].concat(_toConsumableArray(obj.Relate));
						alert('防区关联设置成功');
					} else {
						self.relate[obj.AssistNO - 1] = [].concat(_toConsumableArray(self.relate_old[obj.AssistNO - 1]));
						alert('防区关联设置失败');
					}
				} else {
					self.relate[obj.AssistNO - 1] = obj.Relate;
					self.relate_old[obj.AssistNO - 1] = [].concat(_toConsumableArray(obj.Relate));
					alert('获取辅助关联防区成功');
				}
				this.initDropdown();
				clearTimeout(self.timeOut);
			}
		},
		initDropdown: function initDropdown() {
			this.$nextTick(function () {
				$('.ui.dropdown').dropdown();
			});
		}
	},
	mounted: function mounted() {
		this.startSubscribe();
		$('.ui.dropdown').dropdown();
		$('.ui.button.blue.right.assist1').on('click', function () {
			$('.ui.dropdown.relate.assist1').dropdown('clear');
		});
		$('.ui.button.blue.right.assist2').on('click', function () {
			$('.ui.dropdown.relate.assist2').dropdown('clear');
		});
		$('.ui.button.blue.right.assist3').on('click', function () {
			$('.ui.dropdown.relate.assist3').dropdown('clear');
		});
		$('.ui.button.blue.right.assist4').on('click', function () {
			$('.ui.dropdown.relate.assist4').dropdown('clear');
		});
		$('.ui.button.blue.right.assist5').on('click', function () {
			$('.ui.dropdown.relate.assist5').dropdown('clear');
		});
		$('.ui.button.blue.right.assist6').on('click', function () {
			$('.ui.dropdown.relate.assist6').dropdown('clear');
		});
		$('.ui.button.blue.right.assist7').on('click', function () {
			$('.ui.dropdown.relate.assist7').dropdown('clear');
		});
		$('.ui.button.blue.right.assist8').on('click', function () {
			$('.ui.dropdown.relate.assist8').dropdown('clear');
		});
	},
	beforeDestroy: function beforeDestroy() {
		delete StreamingManager.getStreaming("IPTalk_Streaming").subscribes[this.streamSid];
	}
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-autodefence.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

var _urls = __webpack_require__("./src/apps/iptalk/urls.js");

var urls = _interopRequireWildcard(_urls);

__webpack_require__("./src/assets/js/semantic/components/button.min.css");

__webpack_require__("./src/assets/js/semantic/components/form.min.css");

__webpack_require__("./src/assets/js/semantic/components/form.min.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: {},
	data: function data() {
		return {
			setting: L("设置", "iptalk"),
			periodType: L("时段类型", "iptalk"),
			period: ["1", "2", "3"],
			defenceType: L("布撤防", "iptalk"),
			week: L("星期", "iptalk"),
			weekday: [{ text: L("星期日", "iptalk"), value: "0" }, { text: L("星期一", "iptalk"), value: "1" }, { text: L("星期二", "iptalk"), value: "2" }, { text: L("星期三", "iptalk"), value: "3" }, { text: L("星期四", "iptalk"), value: "4" }, { text: L("星期五", "iptalk"), value: "5" }, { text: L("星期六", "iptalk"), value: "6" }],
			hour: L("时", "iptalk"),
			min: L("分", "iptalk"),
			clear: L("清空", "iptalk"),
			undefence: L("撤防", "iptalk"),
			defence: L("布防", "iptalk"),
			timeOut: 0
		};
	},

	props: {
		item: { type: Object, default: function _default() {} },
		devID: { type: String, default: '' },
		ip: { type: String, default: '' }
	},
	watch: {},
	methods: {
		autoDefenceSubmit: function autoDefenceSubmit() {
			self = this;
			var data = {};
			data.DevID = this.devID;
			data.ip = this.ip;
			data.item = JSON.stringify(this.item);

			_webservice2.default.getJSON(urls.setGK680AutoDefence, data, function (response) {
				if (response.status == "success") {
					self.timeOut = setTimeout("alert('分时段布撤防超时')", 5000);
				} else {
					alert(response.message);
				}
			});
		},
		autoDefenceClear: function autoDefenceClear(data) {
			this.item[data].period = '';
			this.item[data].defencetype = '';
			this.item[data].week = '';
			this.item[data].hour = '';
			this.item[data].min = '';
		},
		startSubscribe: function startSubscribe() {
			var self = this;
			this.streamSid = StreamingManager.getStreaming("IPTalk_Streaming").subscribe(function (response, channel) {
				self.onMessage(response);
			});
		},
		onMessage: function onMessage(response) {
			self = this;
			var obj = JSON.parse(response.data);
			if (obj.Action == 'gk680AutoDefence') {
				alert(obj.Remark);
				clearTimeout(self.timeOut);
			}
		}
	},
	mounted: function mounted() {
		this.startSubscribe();
	},
	beforeDestroy: function beforeDestroy() {
		delete StreamingManager.getStreaming("IPTalk_Streaming").subscribes[this.streamSid];
	}
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-time.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

var _urls = __webpack_require__("./src/apps/iptalk/urls.js");

var urls = _interopRequireWildcard(_urls);

__webpack_require__("./src/assets/js/semantic/components/button.min.css");

__webpack_require__("./src/assets/js/semantic/components/form.min.css");

__webpack_require__("./src/assets/js/semantic/components/form.min.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: {},
	data: function data() {
		return {
			date: {},
			time: {},
			setting: L("设置", "iptalk"),
			year: L("年", "iptalk"),
			month: L("月", "iptalk"),
			day: L("日", "iptalk"),
			week: L("星期", "iptalk"),
			hour: L("时", "iptalk"),
			minute: L("分", "iptalk"),
			second: L("秒", "iptalk"),
			read: L("读取", "iptalk"),
			clear: L("清除", "iptalk"),
			Sun: L("星期日", "iptalk"),
			Mon: L("星期一", "iptalk"),
			Tue: L("星期二", "iptalk"),
			Wed: L("星期三", "iptalk"),
			Thu: L("星期四", "iptalk"),
			Fri: L("星期五", "iptalk"),
			Sat: L("星期六", "iptalk"),
			date_old: {},
			time_old: {},
			timeOut: 0
		};
	},

	props: {
		devID: { type: String, default: '' },
		ip: { type: String, default: '' }
	},
	watch: {
		"devID": function devID(newvalue, oldvalue) {
			this.init();
		}
	},
	methods: {
		init: function init() {
			this.clearDate();
			this.clearTime();
		},
		getDeviceDate: function getDeviceDate() {
			self = this;
			_webservice2.default.getJSON(urls.getGK680Date, { DevID: this.devID, ip: this.ip }, function (response) {
				if (response.status == "success") {
					self.timeOut = setTimeout("alert('获取日期超时')", 5000);
				} else {
					alert(response.message);
				}
			});
		},
		setDate: function setDate() {
			self = this;
			this.date.DevID = this.devID;
			this.date.ip = this.ip;
			_webservice2.default.getJSON(urls.setGK680Date, this.date, function (response) {
				if (response.status == "success") {
					self.timeOut = setTimeout("alert('设置日期超时')", 5000);
				} else {
					alert(response.message);
				}
			});
		},
		getDeviceTime: function getDeviceTime() {
			self = this;
			_webservice2.default.getJSON(urls.getGK680Time, { DevID: this.devID, ip: this.ip }, function (response) {
				if (response.status == "success") {
					self.timeOut = setTimeout("alert('获取时间超时')", 5000);
				} else {
					alert(response.message);
				}
			});
		},
		setTime: function setTime() {
			self = this;
			this.time.DevID = this.devID;
			this.time.ip = this.ip;
			_webservice2.default.getJSON(urls.setGK680Time, this.time, function (response) {
				if (response.status == "success") {
					self.timeOut = setTimeout("alert('设置时间超时')", 5000);
				} else {
					alert(response.message);
				}
			});
		},
		clearData: function clearData(data) {
			switch (data) {
				case 'date':
					this.clearDate();
					break;
				case 'time':
					this.clearTime();
					break;
			}
		},
		clearDate: function clearDate() {
			this.date.year = '';
			this.date.month = '';
			this.date.day = '';
			this.date.week = '';
		},
		clearTime: function clearTime() {
			this.time.hour = '';
			this.time.minute = '';
			this.time.second = '';
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
			if (obj.Action === 'gk680Date') {
				if (obj.ActionNum === 1) {
					var year = obj.Date.year === self.date.year;
					var month = obj.Date.month === self.date.month;
					var day = obj.Date.day === self.date.day;
					var week = obj.Date.week === self.date.week;
					if (year && month && day && week) {
						self.date_old = Object.assign({}, obj.Date);
						alert('设置日期成功');
					} else {
						self.date = Object.assign({}, self.date_old);
						alert('设置日期失败');
					}
				} else {
					self.date = obj.Date;
					self.date_old = Object.assign({}, obj.Date);
					alert('获取日期成功');
				}
				clearTimeout(self.timeOut);
			}
			if (obj.Action === 'gk680Time') {
				if (obj.ActionNum === 1) {
					var hour = obj.Time.hour === self.time.hour;
					var minute = obj.Time.minute === self.time.minute;
					var second = obj.Time.second === self.time.second;
					if (hour && minute && second) {
						self.time_old = Object.assign({}, obj.Time);
						alert('设置时间成功');
					} else {
						self.time = Object.assign({}, self.time_old);
						alert('设置时间失败');
					}
				} else {
					self.time = obj.Time;
					self.time_old = Object.assign({}, obj.Time);
					alert('获取时间成功');
				}
				clearTimeout(self.timeOut);
			}
		}
	},
	mounted: function mounted() {
		this.startSubscribe();
	},
	beforeDestroy: function beforeDestroy() {
		delete StreamingManager.getStreaming("IPTalk_Streaming").subscribes[this.streamSid];
	}
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

var _urls = __webpack_require__("./src/apps/iptalk/urls.js");

var urls = _interopRequireWildcard(_urls);

__webpack_require__("./src/assets/js/semantic/components/button.min.css");

__webpack_require__("./src/assets/js/semantic/components/form.min.css");

__webpack_require__("./src/assets/js/semantic/components/form.min.js");

var _gk680Alarmtype = __webpack_require__("./src/apps/iptalk/deviceManager/gk680-alarmtype.vue");

var _gk680Alarmtype2 = _interopRequireDefault(_gk680Alarmtype);

var _gk680Autodefence = __webpack_require__("./src/apps/iptalk/deviceManager/gk680-autodefence.vue");

var _gk680Autodefence2 = _interopRequireDefault(_gk680Autodefence);

var _gk680Time = __webpack_require__("./src/apps/iptalk/deviceManager/gk680-time.vue");

var _gk680Time2 = _interopRequireDefault(_gk680Time);

var _gk680Assistctrl = __webpack_require__("./src/apps/iptalk/deviceManager/gk680-assistctrl.vue");

var _gk680Assistctrl2 = _interopRequireDefault(_gk680Assistctrl);

var _gk680Assistrelate = __webpack_require__("./src/apps/iptalk/deviceManager/gk680-assistrelate.vue");

var _gk680Assistrelate2 = _interopRequireDefault(_gk680Assistrelate);

var _gk680Alarmstatus = __webpack_require__("./src/apps/iptalk/deviceManager/gk680-alarmstatus.vue");

var _gk680Alarmstatus2 = _interopRequireDefault(_gk680Alarmstatus);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: { gk680alarmtype: _gk680Alarmtype2.default, gk680autodefence: _gk680Autodefence2.default, gk680time: _gk680Time2.default, gk680assistctrl: _gk680Assistctrl2.default, gk680assistrelate: _gk680Assistrelate2.default, gk680alarmstatus: _gk680Alarmstatus2.default },
	data: function data() {
		return {
			info: {},
			alarmType: {},
			defenceInSomeTime: {},
			synchronizeDevice: L("同步数据", "iptalk"),
			basicInformation: L("基本信息", "iptalk"),
			alarmTypeInfo: L("防区报警类型设置", "iptalk"),
			deviceID: L("设备ID", "iptalk"),
			deviceName: L("设备名称", "iptalk"),
			ipAddress: L("IP地址", "iptalk"),
			state: L("状态", "iptalk"),
			disconnect: L("断开", "iptalk"),
			free: L("空闲", "iptalk"),
			serverIp: L("服务器IP", "iptalk"),
			setting: L("设置", "iptalk"),
			autoDefence: L("分时段布撤防", "iptalk"),
			dateAndTime: L("时间和日期设置", "iptalk"),
			assistCtrl: L("辅助开关设置", "iptalk"),
			assistRelate: L("辅助与防区关联设置", "iptalk"),
			alarmSet: L("报警状态设置", "iptalk"),
			timeOut: 0,
			areaAddr: L("区域地址（1-65535）", "iptalk"),
			addrValue: 1
		};
	},

	props: {
		devID: { type: String },
		treeId: { type: String, default: '' }
	},
	watch: {
		"devID": function devID(newvalue, oldvalue) {
			this.init();
		}
	},
	methods: {
		init: function init() {
			$('.device .ui.accordion').accordion({
				exclusive: false
			});
			var self = this;
			_webservice2.default.getJSON(urls.getGK680ByDevID, { DevID: this.devID }, function (response) {
				if (response.status == "success") {
					self.info = response.result.info;
					self.addrValue = self.getAreaAddr(self.info.DevID);
					self.alarmType = response.result.alarm_type;
					self.defenceInSomeTime = response.result.auto_defence;
				} else {
					alert(response.message);
				}
			});
		},
		getAreaAddr: function getAreaAddr(data) {
			if (typeof data !== 'string') return 1;
			var temp = data.substring(1);
			var area = 1;
			for (var i = 0, len = temp.length; i <= len; i++) {
				if (temp.substr(i, 1) !== '0') {
					area = temp.substring(i);
					break;
				}
			}
			return area;
		},
		synchronized: function synchronized() {
			var self = this;
			_webservice2.default.getJSON(urls.getGK680ByDevID, { DevID: this.devID, isSync: 1 }, function (response) {
				if (response.status == "success") {
					alert(response.message);
					self.info = response.result.info;
					self.alarmType = response.result.alarm_type;
					self.defenceInSomeTime = response.result.auto_defence;
				} else {
					alert(response.message);
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
			self = this;
			var obj = JSON.parse(response.data);
			if (obj.Action === 'gk680SetDefence' || obj.Action === 'gk680SetArea') {
				alert(obj.Remark);
				clearTimeout(self.timeOut);
			}
		},
		submit: function submit() {
			var self = this;
			this.info.ip = this.info.DevIP;
			_webservice2.default.getJSON(urls.setGK680Info, this.info, function (response) {
				if (response.status == "success") {
					var treeObj = $.fn.zTree.getZTreeObj(self.treeId);
					var node = treeObj.getNodeByParam('targetId', self.info.DevID);
					node.name = self.info.Alias;
					treeObj.updateNode(node);
				}
				alert(response.message);
			});
		},
		ondefense: function ondefense() {
			self = this;
			_webservice2.default.getJSON(urls.setGK680DefencseByDevID, { DevID: this.devID, ip: this.info.DevIP }, function (response) {
				if (response.status == "success") {
					self.timeOut = setTimeout("alert('一键布防超时')", 5000);
				} else {
					alert(response.message);
				}
			});
		},
		undefense: function undefense() {
			self = this;
			_webservice2.default.getJSON(urls.setGK680UnDefencseByDevID, { DevID: this.devID, ip: this.info.DevIP }, function (response) {
				if (response.status == "success") {
					self.timeOut = setTimeout("alert('一键撤防超时')", 5000);
				} else {
					alert(response.message);
				}
			});
		},
		setAreaAddr: function setAreaAddr() {
			self = this;
			_webservice2.default.getJSON(urls.setgk680AreaAddr, { DevID: this.devID, addrValue: this.addrValue, ip: this.info.DevIP }, function (response) {
				if (response.status == "success") {
					self.timeOut = setTimeout("alert('设置区域地址超时')", 5000);
				} else {
					alert(response.message);
				}
			});
		}
	},
	mounted: function mounted() {
		this.init();
		this.startSubscribe();
	},
	beforeDestroy: function beforeDestroy() {
		delete StreamingManager.getStreaming("IPTalk_Streaming").subscribes[this.streamSid];
	}
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/group.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

var _urls = __webpack_require__("./src/apps/iptalk/urls.js");

var urls = _interopRequireWildcard(_urls);

__webpack_require__("./src/assets/js/semantic/components/input.min.css");

__webpack_require__("./src/assets/js/semantic/components/dropdown.min.css");

__webpack_require__("./src/assets/js/semantic/components/dropdown.min.js");

__webpack_require__("./src/assets/js/semantic/components/button.min.css");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: {},
	data: function data() {
		return {
			item: {
				name: null,
				strategy: null
			},
			groupInfo: L("分组信息", "iptalk"),
			groupName: L("分组名称", "iptalk"),
			groupStrategy: L("分组策略", "iptalk"),
			normal: L("正常模式", "iptalk"),
			callAll: L("一呼多响", "iptalk"),
			priorityModel: L("坐席制", "iptalk"),
			commit1: L("提交", "iptalk")
		};
	},

	watch: {
		"id": function id(newvalue, oldvalue) {
			this.init();
		}
	},
	methods: {
		init: function init() {
			var self = this;
			_webservice2.default.getJSON(urls.getIptalkTreeNodeByID, { id: this.id }, function (response) {
				if (response.status == "success") {
					self.item = response.result;
				}
			});
		},
		commit: function commit() {
			var self = this;
			_webservice2.default.getJSON(urls.setIptalkTreeNodeByID, this.item, function (response) {
				if (response.status == "success") {
					var treeObj = $.fn.zTree.getZTreeObj(self.treeId);
					var node = treeObj.getNodeByParam('id', self.id);
					node.name = self.item.name;
					treeObj.updateNode(node);
					alert(response.result);
				}
			});
		}
	},
	props: {
		id: String,
		treeId: { type: String, default: '' }
	},
	mounted: function mounted() {
		this.init();
	}
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/kt-speaker.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

var _urls = __webpack_require__("./src/apps/iptalk/urls.js");

var urls = _interopRequireWildcard(_urls);

__webpack_require__("./src/assets/js/semantic/components/button.min.css");

__webpack_require__("./src/assets/js/semantic/components/form.min.css");

__webpack_require__("./src/assets/js/semantic/components/form.min.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: {},
	data: function data() {
		return {
			item: {},
			synchronizeDevice: L("同步数据", "iptalk"),
			basicInformation: L("基本信息", "iptalk"),
			deviceID: L("设备ID", "iptalk"),
			deviceName: L("设备名称", "iptalk"),
			ipAddress: L("IP地址", "iptalk"),
			state: L("状态", "iptalk"),
			disconnect: L("断开", "iptalk"),
			free: L("空闲", "iptalk"),
			working: L("广播中...", "iptalk"),
			serverIp: L("服务器IP", "iptalk"),
			volume: L("音量", "iptalk"),
			vol: 56
		};
	},

	props: {
		devID: { type: String },
		treeId: { type: String, default: '' }
	},
	watch: {
		"devID": function devID(newvalue, oldvalue) {
			this.init();
		}
	},
	methods: {
		init: function init() {
			$('.device .ui.accordion').accordion({
				exclusive: false
			});
			var self = this;
			_webservice2.default.getJSON(urls.getSpeakerByDevID, { DevID: this.devID }, function (response) {
				if (response.status == "success") {
					self.getAndSetResult(response);
				}
			});
		},
		synchronized: function synchronized() {
			var self = this;
			_webservice2.default.getJSON(urls.getSpeakerByDevID, { DevID: this.devID, isSync: 1 }, function (response) {
				if (response.status == "success") {
					alert(response.message);
					self.getAndSetResult(response);
				}
			});
		},
		setVolume: function setVolume() {
			_webservice2.default.getJSON(urls.setSpeakerVolumeByDevID, { DevID: this.devID, vol: this.item.AudioPort }, function (response) {
				if (response.status == "success") {
					alert(response.message);
				}
			});
		},
		changePage: function changePage(event) {
			var value = event.target.value;
			this.item.AudioPort = typeof value == "number" ? value : parseInt(value);
		},
		startSubscribe: function startSubscribe() {
			var self = this;
			this.streamSid = StreamingManager.getStreaming("IPTalk_Streaming").subscribe(function (response, channel) {
				self.onMessage(response);
			});
		},
		onMessage: function onMessage(response) {
			var obj = JSON.parse(response.data);
			if (obj.Action == 'deviceAction') {
				switch (obj.ActionNum) {
					case 1:
						this.item.State = -1;
						break;
					case 2:
						this.item.State = 0;
						break;
					case 3:
						this.item.State = 9;
						break;
					case 4:
						this.item.State = 0;
						break;
				}
			}
		},
		getAndSetResult: function getAndSetResult(response) {
			var self = this;
			var State = response.result.State;
			if (State > 0 && State !== 9) {
				response.result.State = 9;
				self.item = response.result;
			} else {
				self.item = response.result;
			}
		}
	},
	mounted: function mounted() {
		this.init();
		this.startSubscribe();
	},
	beforeDestroy: function beforeDestroy() {
		delete StreamingManager.getStreaming("IPTalk_Streaming").subscribes[this.streamSid];
	}
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/mike-info.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

var _urls = __webpack_require__("./src/apps/iptalk/urls.js");

var urls = _interopRequireWildcard(_urls);

__webpack_require__("./src/assets/js/semantic/components/button.min.css");

__webpack_require__("./src/assets/js/semantic/components/form.min.css");

__webpack_require__("./src/assets/js/semantic/components/form.min.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: {},
	data: function data() {
		return {
			item: {},
			enableDevice: L("启用设备", "iptalk"),
			disableDevice: L("禁用设备", "iptalk"),
			synchronizeDevice: L("同步数据", "iptalk"),
			basicInformation: L("基本信息", "iptalk"),
			deviceID: L("设备ID", "iptalk"),
			deviceName: L("设备名称", "iptalk"),
			ipAddress: L("IP地址", "iptalk"),
			state: L("状态", "iptalk"),
			unregistered: L("未注册", "iptalk"),
			disconnect: L("断开", "iptalk"),
			free: L("空闲", "iptalk"),
			subnetMask: L("子网掩码", "iptalk"),
			gateway: L("网关", "iptalk"),
			DNS: L("DNS", "iptalk"),
			serverIp: L("服务器IP", "iptalk"),
			macAddress: L("Mac地址", "iptalk"),
			audioPort: L("音频端口", "iptalk"),
			videoPort: L("视频端口", "iptalk"),
			superiorAddress: L("上级地址", "iptalk"),
			output: L("短路输出", "iptalk"),
			none: L("无", "iptalk"),
			callPrompt: L("来电提示", "iptalk"),
			priorityLevel: L("优先级别", "iptalk"),
			lv1: L("一级", "iptalk"),
			lv2: L("二级", "iptalk"),
			lv3: L("三级", "iptalk"),
			lv4: L("四级", "iptalk"),
			lv5: L("五级", "iptalk"),
			isRecord: L("是否录像", "iptalk"),
			updateWay: L("升级方式", "iptalk"),
			manual: L("手动", "iptalk"),
			auto: L("自动", "iptalk"),
			yes: L("是", "iptalk"),
			no: L("否", "iptalk"),
			setting: L("设置", "iptalk"),
			controlType: L("控制类型", "iptalk"),
			initiative: L("主控", "iptalk"),
			restrict: L("限制", "iptalk")
		};
	},

	props: {
		devID: { type: String },
		treeId: { type: String, default: '' }
	},
	watch: {
		"devID": function devID(newvalue, oldvalue) {
			this.init();
		}
	},
	methods: {
		init: function init() {
			$('.device .ui.accordion').accordion({
				exclusive: false
			});
			var self = this;
			_webservice2.default.getJSON(urls.getMikeByDevID, { DevID: this.devID }, function (response) {
				if (response.status == "success") {
					self.item = response.result;
				} else {
					alert(response.message);
				}
			});
		},
		enable: function enable() {
			var self = this;
			_webservice2.default.getJSON(urls.enableDeviceByDevID, { DevID: this.devID }, function (response) {
				if (response.status == "success") {
					alert(response.result);
					self.init();
				}
			});
		},
		disable: function disable() {
			var self = this;
			_webservice2.default.getJSON(urls.disableDeviceByDevID, { DevID: this.devID }, function (response) {
				if (response.status == "success") {
					alert(response.result);
					self.init();
				}
			});
		},
		synchronized: function synchronized() {
			var self = this;
			_webservice2.default.getJSON(urls.synchronizedDeviceByDevID, { DevID: this.devID }, function (response) {
				if (response.status == "success") {
					alert(response.result);
					self.init();
				}
			});
		},
		checkIP: function checkIP() {
			var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;

			for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
				params[_key] = arguments[_key];
			}

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = params[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var ip = _step.value;

					if (re.test(ip) && parseInt(RegExp.$1) < 256 && parseInt(RegExp.$2) < 256 && parseInt(RegExp.$3) < 256 && parseInt(RegExp.$4) < 256 && parseInt(RegExp.$1).toString() == RegExp.$1 && parseInt(RegExp.$2).toString() == RegExp.$2 && parseInt(RegExp.$3).toString() == RegExp.$3 && parseInt(RegExp.$4).toString() == RegExp.$4) {
						continue;
					} else {
						alert("IP有误！");
						return false;
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

			return true;
		},
		submit: function submit() {
			var self = this;
			var DevID = this.item.DevID;
			if (!DevID || DevID.length !== 8 || !/^\d+$/.test(DevID) || !['1', '2'].includes(DevID.substr(0, 1))) {
				alert("出错了！设备编码是8位纯数字、话筒以2开头、终端以1开头");
				return;
			}
			var ipCorrect = this.checkIP(this.item.DevIP, this.item.DevMASK, this.item.DevGW, this.item.DNS, this.item.SvrIP);
			if (!ipCorrect) return;
			if (!/^\d+$/.test(this.item.AudioPort) || !/^\d+$/.test(this.item.VideoPort) || parseInt(this.item.AudioPort) > 65535 || parseInt(this.item.VideoPort) > 65535) {
				alert("端口号必须是0-65535的纯数字");
				return;
			}
			_webservice2.default.getJSON(urls.setDeviceInfo, this.item, function (response) {
				if (response.status == "success") {
					var treeObj = $.fn.zTree.getZTreeObj(self.treeId);
					var node = treeObj.getNodeByParam('targetId', self.item.DevID);
					node.name = self.item.Alias;
					treeObj.updateNode(node);
					alert(response.result);
				}
			});
		}
	},
	mounted: function mounted() {
		this.init();
	}
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/server.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

var _urls = __webpack_require__("./src/apps/iptalk/urls.js");

var urls = _interopRequireWildcard(_urls);

__webpack_require__("./src/assets/js/semantic/components/input.min.css");

__webpack_require__("./src/assets/js/semantic/components/button.min.css");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: {},
	data: function data() {
		return {
			item: {
				name: null,
				strategy: null
			},
			serverInfo: L("服务器信息", "iptalk"),
			serverId: L("服务器ID", "iptalk"),
			serverName: L("服务器名称", "iptalk"),
			commit1: L("提交", "iptalk")
		};
	},

	watch: {
		"id": function id(newvalue, oldvalue) {
			this.init();
		}
	},
	methods: {
		init: function init() {
			var self = this;
			_webservice2.default.getJSON(urls.getIptalkTreeNodeByID, { id: this.id }, function (response) {
				if (response.status == "success") {
					self.item = response.result;
				}
			});
		},
		commit: function commit() {
			var self = this;
			_webservice2.default.getJSON(urls.setIptalkTreeNodeByID, this.item, function (response) {
				if (response.status == "success") {
					var treeObj = $.fn.zTree.getZTreeObj(self.treeId);
					var node = treeObj.getNodeByParam('id', self.id);
					node.name = self.item.name;
					node.targetInfo = self.item.targetInfo;
					treeObj.removeChildNodes(node);
					node.isParent = true;
					node.open = false;
					treeObj.updateNode(node);
					alert(response.result);
				}
			});
		}
	},
	props: {
		id: String,
		treeId: { type: String, default: '' }
	},
	mounted: function mounted() {
		this.init();
	}
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-alarm.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

var _urls = __webpack_require__("./src/apps/iptalk/urls.js");

var urls = _interopRequireWildcard(_urls);

__webpack_require__("./src/assets/js/semantic/components/form.min.css");

__webpack_require__("./src/assets/js/semantic/components/form.min.js");

__webpack_require__("./src/assets/js/semantic/components/button.min.css");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: {},
	data: function data() {
		return {
			startTime: L("开始时间", "iptalk"),
			endTime: L("结束时间", "iptalk"),
			protection: L("布防开关", "iptalk"),
			alarmDelay: L("报警延迟", "iptalk"),
			output: L("短路输入", "iptalk"),
			disable: L("禁用", "iptalk"),
			enable: L("启用", "iptalk"),
			open: L("打开", "iptalk"),
			close: L("关闭", "iptalk"),
			seconds: L("秒", "iptalk"),
			minutes: L("分钟", "iptalk"),
			hours: L("小时", "iptalk"),
			setting: L("设置", "iptalk")
		};
	},

	props: {
		items: { type: Array },
		devID: { type: String }
	},
	methods: {
		submit: function submit() {
			var self = this;
			var temp = {};
			temp.device_id = this.devID;
			for (var i = 0; i < 4; i++) {
				var k = i + 1;
				temp["SetFlag" + k] = this.items[i].SetFlag;
				temp["OnOff" + k] = this.items[i].OnOff;
				temp["TrigerDelay" + k] = this.items[i].TrigerDelay;
				temp["StarTime" + k] = this.items[i].StarTimeHour * 256 + this.items[i].StarTimeMinute;
				temp["EndTime" + k] = this.items[i].EndTimeHour * 256 + this.items[i].EndTimeMinute;
			}
			_webservice2.default.getJSON(urls.setTerminalAlarm, temp, function (response) {
				if (response.status == "success") {
					alert(response.result);
					self.$emit("reload");
				}
			});
		}
	}
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-info.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

var _urls = __webpack_require__("./src/apps/iptalk/urls.js");

var urls = _interopRequireWildcard(_urls);

__webpack_require__("./src/assets/js/semantic/components/form.min.css");

__webpack_require__("./src/assets/js/semantic/components/form.min.js");

__webpack_require__("./src/assets/js/semantic/components/button.min.css");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: {},
	data: function data() {
		return {
			deviceID: L("设备ID", "iptalk"),
			deviceName: L("设备名称", "iptalk"),
			ipAddress: L("IP地址", "iptalk"),
			state: L("状态", "iptalk"),
			unregistered: L("未注册", "iptalk"),
			disconnect: L("断开", "iptalk"),
			free: L("空闲", "iptalk"),
			subnetMask: L("子网掩码", "iptalk"),
			gateway: L("网关", "iptalk"),
			DNS: L("DNS", "iptalk"),
			serverIp: L("服务器IP", "iptalk"),
			macAddress: L("Mac地址", "iptalk"),
			audioPort: L("音频端口", "iptalk"),
			videoPort: L("视频端口", "iptalk"),
			alarmTime: L("报警时长", "iptalk"),
			minutes: L("分钟", "iptalk"),
			output: L("短路输出", "iptalk"),
			none: L("无", "iptalk"),
			callPrompt: L("来电提示", "iptalk"),
			priorityLevel: L("优先级别", "iptalk"),
			lv1: L("一级", "iptalk"),
			lv2: L("二级", "iptalk"),
			lv3: L("三级", "iptalk"),
			lv4: L("四级", "iptalk"),
			lv5: L("五级", "iptalk"),
			isRecord: L("是否录像", "iptalk"),
			updateWay: L("升级方式", "iptalk"),
			manual: L("手动", "iptalk"),
			auto: L("自动", "iptalk"),
			yes: L("是", "iptalk"),
			no: L("否", "iptalk"),
			setting: L("设置", "iptalk")
		};
	},

	props: {
		item: { type: Object },
		devID: { type: String },
		treeId: { type: String, default: '' }
	},
	methods: {
		submit: function submit() {
			var self = this;
			var DevID = this.item.DevID;
			if (!DevID || DevID.length !== 8 || !/^\d+$/.test(DevID) || !['1', '2'].includes(DevID.substr(0, 1))) {
				alert("出错了！设备编码是8位纯数字、话筒以2开头、终端以1开头");
				return;
			}
			var ipCorrect = this.checkIP(this.item.DevIP, this.item.DevMASK, this.item.DevGW, this.item.DNS, this.item.SvrIP);
			if (!ipCorrect) return;
			if (!/^\d+$/.test(this.item.AudioPort) || !/^\d+$/.test(this.item.VideoPort) || parseInt(this.item.AudioPort) > 65535 || parseInt(this.item.VideoPort) > 65535) {
				alert("端口号必须是0-65535的纯数字");
				return;
			}
			_webservice2.default.getJSON(urls.setDeviceInfo, this.item, function (response) {
				if (response.status == "success") {
					var treeObj = $.fn.zTree.getZTreeObj(self.treeId);
					var node = treeObj.getNodeByParam('targetId', self.item.DevID);
					node.name = self.item.Alias;
					treeObj.updateNode(node);
					alert(response.result);
				}
			});
		}
	}
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-io.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

var _urls = __webpack_require__("./src/apps/iptalk/urls.js");

var urls = _interopRequireWildcard(_urls);

__webpack_require__("./src/assets/js/semantic/components/form.min.css");

__webpack_require__("./src/assets/js/semantic/components/form.min.js");

__webpack_require__("./src/assets/js/semantic/components/button.min.css");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: {},
	data: function data() {
		return {
			setting: L("设置", "iptalk"),
			feedback: L("触发类型", "iptalk"),
			correspondingOutput: L("对应短路输出", "iptalk"),
			feedbackAddress: L("反馈地址", "iptalk"),
			input: L("短路输入", "iptalk"),
			on: L("常开", "iptalk"),
			off: L("常闭", "iptalk"),
			open: L("打开", "iptalk"),
			close: L("关闭", "iptalk"),
			callAddress: L("呼叫地址", "iptalk"),
			serviceAddress: L("咨询地址", "iptalk"),
			emergencyAddress: L("紧急地址", "iptalk"),
			patrolAddress: L("巡更地址", "iptalk"),
			managerCenter: L("管理中心", "iptalk"),
			none: L("无", "iptalk"),
			delayTime: L("延迟时间", "iptalk"),
			seconds: L("秒", "iptalk"),
			output: L("短路输出", "iptalk"),
			electricLock: L("电控锁触发", "iptalk")
		};
	},

	props: {
		item: { type: Object },
		types: { type: Array },
		devID: { type: String }
	},
	methods: {
		submit: function submit() {
			var self = this;
			this.item.device_id = this.devID;
			_webservice2.default.getJSON(urls.setTerminalIO, this.item, function (response) {
				if (response.status == "success") {
					alert(response.result);
					self.$emit("reload");
				}
			});
		}
	}
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-ipc.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

var _urls = __webpack_require__("./src/apps/iptalk/urls.js");

var urls = _interopRequireWildcard(_urls);

__webpack_require__("./src/assets/js/semantic/components/form.min.css");

__webpack_require__("./src/assets/js/semantic/components/form.min.js");

__webpack_require__("./src/assets/js/semantic/components/button.min.css");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: {},
	data: function data() {
		return {
			IPCAddr1: L("IPC地址1", "iptalk"),
			IPCAddr2: L("IPC地址2", "iptalk"),
			IPCAddr3: L("IPC地址3", "iptalk"),
			setting: L("设置", "iptalk")
		};
	},

	props: {
		item: { type: Object },
		devID: { type: String }
	},
	methods: {
		submit: function submit() {
			var temp = Object.assign({}, this.item);
			_webservice2.default.getJSON(urls.relateDeviceIPC, temp, function (response) {
				if (response.status == "success") {
					alert(response.result);
				}
			});
		}
	}
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-led.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

var _urls = __webpack_require__("./src/apps/iptalk/urls.js");

var urls = _interopRequireWildcard(_urls);

__webpack_require__("./src/assets/js/semantic/components/form.min.css");

__webpack_require__("./src/assets/js/semantic/components/form.min.js");

__webpack_require__("./src/assets/js/semantic/components/button.min.css");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: {},
	data: function data() {
		return {
			showMode: L("显示模式", "iptalk"),
			screenColor: L("屏幕颜色", "iptalk"),
			showType: L("显示方式", "iptalk"),
			runSpeed: L("运行速度", "iptalk"),
			stayTime: L("停留时间", "iptalk"),
			displayNum: L("显示字数", "iptalk"),
			scrollMode: L("滚屏设置", "iptalk"),
			displayText: L("要发送的文字", "iptalk"),
			saveInfo: L("保存信息", "iptalk"),
			syncTime: L("同步时间", "iptalk"),
			sendText: L("发送文字", "iptalk")
		};
	},

	props: {
		item: { type: Object },
		devID: { type: String }
	},
	methods: {
		setsaveInfo: function setsaveInfo() {
			var temp = Object.assign({}, this.item);
			delete temp.ScrollMode;
			_webservice2.default.getJSON(urls.saveLEDInfo, temp, function (response) {
				if (response.status == "success") {
					alert(response.result);
				}
			});
		},
		setScrollMode: function setScrollMode() {
			var temp = Object.assign({}, { "DevID": this.item.DevID, "ScrollMode": this.item.ScrollMode });
			_webservice2.default.getJSON(urls.setLEDScrollMode, temp, function (response) {
				if (response.status == "success") {
					alert(response.result);
				}
			});
		},
		setsyncTime: function setsyncTime() {
			var temp = Object.assign({}, { "DevID": this.item.DevID });
			_webservice2.default.getJSON(urls.setSyncTime, temp, function (response) {
				if (response.status == "success") {
					alert(response.result);
				}
			});
		},
		setsendText: function setsendText() {
			var temp = Object.assign({}, this.item);
			delete temp.ScrollMode;
			_webservice2.default.getJSON(urls.setLEDText, temp, function (response) {
				if (response.status == "success") {
					alert(response.result);
				}
			});
		},
		submit: function submit() {
			var self = this;
			var temp = Object.assign({}, this.item);
			var list = this.item.Resolution.split("*");
			temp.VideoW = list[0];
			temp.VideoH = list[1];
			delete temp.Resolution;
			temp.device_id = this.devID;
			_webservice2.default.getJSON(urls.setTerminalVideo, temp, function (response) {
				if (response.status == "success") {
					alert(response.result);
					self.$emit("reload");
				}
			});
		}
	}
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-panel.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

var _urls = __webpack_require__("./src/apps/iptalk/urls.js");

var urls = _interopRequireWildcard(_urls);

__webpack_require__("./src/assets/js/semantic/components/form.min.css");

__webpack_require__("./src/assets/js/semantic/components/form.min.js");

__webpack_require__("./src/assets/js/semantic/components/button.min.css");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: {},
	data: function data() {
		return {
			subpanel: L("子面板", "iptalk"),
			broadcastType: L("广播类型", "iptalk"),
			terminalSpeake: L("喇叭", "iptalk"),
			externalSpeake: L("音箱", "iptalk"),
			callAddress: L("呼叫地址", "iptalk"),
			serviceAddress: L("咨询地址", "iptalk"),
			emergencyAddress: L("紧急地址", "iptalk"),
			patrolAddress: L("巡更地址", "iptalk"),
			noAction: L("无联动", "iptalk"),
			output: L("短路输出", "iptalk"),
			setting: L("设置", "iptalk")
		};
	},

	props: {
		item: { type: Object },
		devID: { type: String }
	},
	methods: {
		submit: function submit() {
			var self = this;
			var temp = Object.assign({}, this.item);
			temp.device_id = this.devID;
			temp.SubPanelExport1 = temp.SubPanelExport[0];
			temp.SubPanelExport2 = temp.SubPanelExport[1];
			temp.SubPanelExport3 = temp.SubPanelExport[2];
			temp.SubPanelExport4 = temp.SubPanelExport[3];
			temp.SubPanelExport5 = temp.SubPanelExport[4];
			temp.SubPanelExport6 = temp.SubPanelExport[5];
			temp.SubPanelExport7 = temp.SubPanelExport[6];
			temp.SubPanelExport8 = temp.SubPanelExport[7];
			delete temp.SubPanelExport;
			_webservice2.default.getJSON(urls.setTerminalPanel, temp, function (response) {
				if (response.status == "success") {
					alert(response.result);
					self.$emit("reload");
				}
			});
		}
	}
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-video.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

var _urls = __webpack_require__("./src/apps/iptalk/urls.js");

var urls = _interopRequireWildcard(_urls);

__webpack_require__("./src/assets/js/semantic/components/form.min.css");

__webpack_require__("./src/assets/js/semantic/components/form.min.js");

__webpack_require__("./src/assets/js/semantic/components/button.min.css");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: {},
	data: function data() {
		return {
			videoResolution: L("视频分辨率", "iptalk"),
			closeVideo: L("关闭视频", "iptalk"),
			videoFramerate: L("视频帧率", "iptalk"),
			videoCompressionRate: L("视频压缩率", "iptalk"),
			callVolume: L("通话音量", "iptalk"),
			ringVolume: L("铃声音量", "iptalk"),
			audioCoding: L("音频编码", "iptalk"),
			setting: L("设置", "iptalk")
		};
	},

	props: {
		item: { type: Object },
		devID: { type: String }
	},
	methods: {
		submit: function submit() {
			var self = this;
			var temp = Object.assign({}, this.item);
			var list = this.item.Resolution.split("*");
			temp.VideoW = list[0];
			temp.VideoH = list[1];
			delete temp.Resolution;
			temp.device_id = this.devID;
			_webservice2.default.getJSON(urls.setTerminalVideo, temp, function (response) {
				if (response.status == "success") {
					alert(response.result);
					self.$emit("reload");
				}
			});
		}
	}
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

var _urls = __webpack_require__("./src/apps/iptalk/urls.js");

var urls = _interopRequireWildcard(_urls);

var _terminalInfo = __webpack_require__("./src/apps/iptalk/deviceManager/terminal-info.vue");

var _terminalInfo2 = _interopRequireDefault(_terminalInfo);

var _terminalPanel = __webpack_require__("./src/apps/iptalk/deviceManager/terminal-panel.vue");

var _terminalPanel2 = _interopRequireDefault(_terminalPanel);

var _terminalIo = __webpack_require__("./src/apps/iptalk/deviceManager/terminal-io.vue");

var _terminalIo2 = _interopRequireDefault(_terminalIo);

var _terminalVideo = __webpack_require__("./src/apps/iptalk/deviceManager/terminal-video.vue");

var _terminalVideo2 = _interopRequireDefault(_terminalVideo);

var _terminalAlarm = __webpack_require__("./src/apps/iptalk/deviceManager/terminal-alarm.vue");

var _terminalAlarm2 = _interopRequireDefault(_terminalAlarm);

var _terminalLed = __webpack_require__("./src/apps/iptalk/deviceManager/terminal-led.vue");

var _terminalLed2 = _interopRequireDefault(_terminalLed);

var _terminalIpc = __webpack_require__("./src/apps/iptalk/deviceManager/terminal-ipc.vue");

var _terminalIpc2 = _interopRequireDefault(_terminalIpc);

__webpack_require__("./src/assets/js/semantic/components/accordion.min.css");

__webpack_require__("./src/assets/js/semantic/components/accordion.min.js");

__webpack_require__("./src/assets/js/semantic/components/button.min.css");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: { terminalinfo: _terminalInfo2.default, terminalpanel: _terminalPanel2.default, terminalio: _terminalIo2.default, terminalvideo: _terminalVideo2.default, terminalalarm: _terminalAlarm2.default, terminalled: _terminalLed2.default, terminalipc: _terminalIpc2.default },
	data: function data() {
		return {
			enableDevice: L("启用设备", "iptalk"),
			disableDevice: L("禁用设备", "iptalk"),
			synchronizeDevice: L("同步数据", "iptalk"),
			basicInformation: L("基本信息", "iptalk"),
			panelSetting: L("面板设置", "iptalk"),
			IOSetting: L("输入输出设置", "iptalk"),
			VideoSetting: L("音视频设置", "iptalk"),
			alarmSetting: L("布防设置", "iptalk"),
			ledSetting: L("LED设置", "iptalk"),
			ipcSetting: L("IPC设置", "iptalk"),
			info: {},
			panel: {},
			io: {},
			video: {},
			alarm: [],
			led: {},
			ipc: {},
			feedBackTypes: [] };
	},

	props: {
		devID: { type: String },
		treeId: { type: String, default: '' }
	},
	watch: {
		"devID": function devID(newvalue, oldvalue) {
			this.init();
		}
	},
	methods: {
		init: function init() {
			$('.device .ui.accordion').accordion({
				exclusive: false
			});
			var self = this;
			_webservice2.default.getJSON(urls.getTerminalByDevID, { DevID: this.devID }, function (response) {
				if (response.status == "success") {
					var result = response.result;
					self.info = result.info;
					self.panel = result.panel;
					self.panel.SubPanelExport = [self.panel.SubPanelExport1, self.panel.SubPanelExport2, self.panel.SubPanelExport3, self.panel.SubPanelExport4, self.panel.SubPanelExport5, self.panel.SubPanelExport6, self.panel.SubPanelExport7, self.panel.SubPanelExport8];
					self.io = result.io;
					self.video = result.video;
					self.video.Resolution = self.video.VideoW + "*" + self.video.VideoH;
					var alarm = result.alarm;
					self.alarm = [{ SetFlag: alarm.SetFlag1, OnOff: alarm.OnOff1, TrigerDelay: alarm.TrigerDelay1, StarTimeHour: parseInt(alarm.StarTime1 / 256), StarTimeMinute: alarm.StarTime1 % 256, EndTimeHour: parseInt(alarm.EndTime1 / 256), EndTimeMinute: alarm.EndTime1 % 256 }, { SetFlag: alarm.SetFlag2, OnOff: alarm.OnOff2, TrigerDelay: alarm.TrigerDelay2, StarTimeHour: parseInt(alarm.StarTime2 / 256), StarTimeMinute: alarm.StarTime2 % 256, EndTimeHour: parseInt(alarm.EndTime2 / 256), EndTimeMinute: alarm.EndTime2 % 256 }, { SetFlag: alarm.SetFlag3, OnOff: alarm.OnOff3, TrigerDelay: alarm.TrigerDelay3, StarTimeHour: parseInt(alarm.StarTime3 / 256), StarTimeMinute: alarm.StarTime3 % 256, EndTimeHour: parseInt(alarm.EndTime3 / 256), EndTimeMinute: alarm.EndTime3 % 256 }, { SetFlag: alarm.SetFlag4, OnOff: alarm.OnOff4, TrigerDelay: alarm.TrigerDelay4, StarTimeHour: parseInt(alarm.StarTime4 / 256), StarTimeMinute: alarm.StarTime4 % 256, EndTimeHour: parseInt(alarm.EndTime4 / 256), EndTimeMinute: alarm.EndTime4 % 256 }];
					self.led = result.led;
					self.ipc = result.ipc;
					self.feedBackTypes = result.feedBackTypes;
				} else {
					alert(response.message);
				}
			});
		},
		enable: function enable() {
			var self = this;
			_webservice2.default.getJSON(urls.enableDeviceByDevID, { DevID: this.devID }, function (response) {
				if (response.status == "success") {
					alert(response.result);
					self.init();
				}
			});
		},
		disable: function disable() {
			var self = this;
			_webservice2.default.getJSON(urls.disableDeviceByDevID, { DevID: this.devID }, function (response) {
				if (response.status == "success") {
					alert(response.result);
					self.init();
				}
			});
		},
		synchronized: function synchronized() {
			var self = this;
			_webservice2.default.getJSON(urls.synchronizedDeviceByDevID, { DevID: this.devID }, function (response) {
				if (response.status == "success") {
					alert(response.result);
					self.init();
				}
			});
		}
	},
	mounted: function mounted() {
		this.init();
	}
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/home.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, $) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _urls = __webpack_require__("./src/apps/iptalk/urls.js");

var urls = _interopRequireWildcard(_urls);

var _deviceTree = __webpack_require__("./src/common/device.tree.vue");

var _deviceTree2 = _interopRequireDefault(_deviceTree);

var _deviceList = __webpack_require__("./src/apps/iptalk/device-list.vue");

var _deviceList2 = _interopRequireDefault(_deviceList);

var _group = __webpack_require__("./src/apps/iptalk/deviceManager/group.vue");

var _group2 = _interopRequireDefault(_group);

var _device = __webpack_require__("./src/apps/iptalk/deviceManager/device.vue");

var _device2 = _interopRequireDefault(_device);

var _server = __webpack_require__("./src/apps/iptalk/deviceManager/server.vue");

var _server2 = _interopRequireDefault(_server);

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

var _eventbus = __webpack_require__("./src/common/eventbus.js");

var _eventbus2 = _interopRequireDefault(_eventbus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
	components: { tree: _deviceTree2.default, devicelist: _deviceList2.default, group: _group2.default, device: _device2.default, server: _server2.default },
	data: function data() {
		return {
			treeId: 'devicetree',
			devID: "",
			groupID: 'custom',
			serverID: "",
			targetinfo: undefined,
			type: 1,
			dimensions: [{
				type: "custom",
				name: L("所有设备", "iptalk"),
				allowAdd: true,
				allowEdit: true,
				allowDelete: true,
				rightMenu: [{ text: L("添加服务器", "iptalk"), name: 'addServer', beforeShow: this.addServerShow, callback: this.addServer }, { text: L("开始监视监听", "iptalk"), name: 'startMonitor', beforeShow: this.addMonitor, callback: this.startMonitorDevice }, { text: L("结束监视监听", "iptalk"), name: 'stopMonitor', beforeShow: this.addMonitor, callback: this.stopMonitorDevice }],
				expandLevel: 0
			}, {
				type: "new",
				name: L("新的设备", "iptalk"),
				allowDelete: true,
				expandLevel: 0
			}]
		};
	},

	props: {},
	created: function created() {
		this.urls = urls;
	},

	methods: {
		onItemClick: function onItemClick(event, treeId, treeNode) {
			this.type = treeNode.type;
			if (treeNode.type == 'custom' || treeNode.type == 'new' || treeNode.type == 1) {
				this.groupID = treeNode.id;
			} else if (treeNode.type == 4) {
				this.devID = treeNode.targetId;
			} else if (treeNode.type == 8) {
				this.serverID = treeNode.id;
			}
		},
		beforeItemClick: function beforeItemClick(event, treeId, treeNode) {
			if (treeNode.type == 8) {
				this.groupID = treeNode.id;
				this.type = treeNode.type;
				this.targetinfo = treeNode.targetInfo;
			}
		},
		addServerShow: function addServerShow(treeId, treeNode) {
			return treeNode.type != 8;
		},
		addMonitor: function addMonitor(treeId, treeNode) {
			return treeNode.type === 4 && treeNode.targetId.substring(0, 1) === '1';
		},
		addServer: function addServer(treeId, treeNode, type, treeObj, event) {
			var temp = { name: L("新的节点", "iptalk"), type: 8, isParent: true, open: false };
			var newNode = treeObj.addNodes(treeNode, temp, false);
			if (newNode) {
				treeObj.editName(newNode[0]);
			} else {
				alert(L("无法增加子节点", "iptalk"));
			}
		},
		startMonitorDevice: function startMonitorDevice(treeId, treeNode, type, treeObj, event) {
			var self = this;
			var devID = treeNode.targetId;
			if (devID in global.nodeDeviceIPList && global.nodeDeviceIPList[devID]) {
				self.emitToCommander(global.nodeDeviceIPList[devID], 4);
			} else {
				this.getDeviceIP(devID, 4);
			}
		},
		getDeviceIP: function getDeviceIP(devID, callNum) {
			var self = this;
			_webservice2.default.getJSON(urls.getDeviceIP, { DevID: devID }, function (response) {
				if (response.status == "success") {
					var _response$result = response.result,
					    ip = _response$result.ip,
					    ipc = _response$result.ipc;

					global.nodeDeviceIPList[devID] = { ip: ip, ipc: ipc };
					self.emitToCommander({ ip: ip, ipc: ipc }, callNum);
				} else {
					alert(response.message);
				}
			});
		},
		stopMonitorDevice: function stopMonitorDevice(treeId, treeNode, type, treeObj, event) {
			var self = this;
			var devID = treeNode.targetId;
			if (devID in global.nodeDeviceIPList && global.nodeDeviceIPList[devID]) {
				self.emitToCommander(global.nodeDeviceIPList[devID], 3);
			} else {
				this.getDeviceIP(devID, 3);
			}
		},
		emitToCommander: function emitToCommander(data, callNum) {
			var self = this;
			var ipc = $.extend(true, [], data.ipc);
			var storage = window.localStorage;

			if (callNum === 4) {
				for (var i = 0; i < global.callStack.length; i++) {
					if ((global.callStack[i] || {}).DevIP === data.ip && (global.callStack[i] || {}).VideoType === 'monitor') {
						alert('已经在监视中，请勿重复操作！');
						return;
					}
					if ((global.callStack[i] || {}).VideoType === 'call' && (global.callStack[i] || {}).TerminalIP === data.ip) {
						alert('设备通话直播中，请勿监视监听！');
						return;
					}
				}
				var monitorID = Math.floor(Math.random() * 10001) + "";
				var newCall = {
					DevIP: data.ip,
					DevRelatedIPC: ipc,
					ActionNum: 1,
					VideoType: 'monitor',
					monitorID: monitorID
				};

				global.callStack.push(newCall);
				storage.setItem(data.ip, JSON.stringify(newCall));

				self.$route.path.split('/').length > 2 ? self.$router.replace('/commander') : self.$router.push('commander');
			}
			if (callNum === 3) {
				for (var i = 0; i < global.callStack.length; i++) {
					if ((global.callStack[i] || {}).DevIP === data.ip) {
						self.$route.path.split('/').length > 2 ? self.$router.replace('/commander') : self.$router.push('commander');
						setTimeout(function () {
							_eventbus2.default.$emit("deviceEvent", { DevIP: data.ip, DevRelatedIPC: ipc, ActionNum: 1, CallNum: 3 });
						}, 1000);
						global.callStack.splice(i, 1);

						storage.removeItem(data.ip);
						break;
					}
				}
			}
		}
	},
	mounted: function mounted() {}
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

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-006cfd45\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-ipc.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.terminal[data-v-006cfd45]{\r\n\tposition: relative;\n}\n.terminal label[data-v-006cfd45]{\r\n\twhite-space:nowrap;\r\n\tmin-width: 10em;\r\n\ttext-align:center;\n}\n.terminal .right[data-v-006cfd45]{\r\n\tposition: relative;\r\n\ttext-align:right;\n}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-025907d6\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/kt-speaker.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.speaker[data-v-025907d6]{\r\n\tposition: relative;\n}\n.speaker .top[data-v-025907d6]{\r\n\tposition: relative;\r\n\tpadding: 10px;\n}\n.speaker label[data-v-025907d6]{\r\n\twhite-space:nowrap;\r\n\tmin-width: 6em;\r\n\ttext-align:center;\n}\n.speaker .right[data-v-025907d6]{\r\n\tposition: relative;\r\n\ttext-align:right;\n}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-189edac3\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/apps/iptalk/device-list.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.deviceList > .menubar#viewmode > .item:last-child {\r\n\tborder-right: 1px solid #d5d5d5!important;\n}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-189edac3\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/device-list.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.deviceList[data-v-189edac3]{\r\n\tposition: relative;\r\n\theight: 100%;\n}\n.deviceList .deivces[data-v-189edac3]{\r\n\tposition: relative;\r\n\theight: 90%;\r\n\theight: -moz-calc(100% - 154px);\r\n\theight: -webkit-calc(100% - 154px);\r\n\theight: calc(100% - 154px);\r\n\toverflow-y: auto;\r\n\toverflow-x: hidden;\n}\n.deviceList .item[data-v-189edac3]{\r\n\tposition: relative;\r\n\tfloat: left;\r\n\tmargin:10px;\r\n\theight: 120px;\r\n\twidth: 120px;\r\n\ttext-align: center;\n}\n.deviceList .item img[data-v-189edac3]{\r\n\theight: 80px;\r\n\twidth: 80px;\n}\n.deviceList .item.opacity img[data-v-189edac3]{\r\n\tfilter:alpha(opacity=30); /*IE滤镜，透明度30%*/\r\n\t-moz-opacity:0.3; /*Firefox私有，透明度30%*/\r\n\topacity:0.3;/*其他，透明度30%*/\n}\n.deviceList .item .red[data-v-189edac3]{\r\n\tcolor: red;\n}\n.deviceList .item .blue[data-v-189edac3]{\r\n\tcolor: blue;\n}\n.deviceList .item .black[data-v-189edac3]{\r\n\tcolor: black;\n}\n.deviceList .item .alias[data-v-189edac3]{\r\n\tfont-size: 1em;\n}\n.deviceList .item .devid[data-v-189edac3]{\r\n\tfont-size: 0.3em;\n}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-313955be\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-alarmtype.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.gk680[data-v-313955be]{\r\n\tposition: relative;\n}\n.gk680 .top[data-v-313955be]{\r\n\tposition: relative;\r\n\tpadding: 10px;\n}\n.gk680 label[data-v-313955be]{\r\n\twhite-space:nowrap;\r\n\tmin-width: 6em;\r\n\ttext-align:center;\n}\n.gk680 .right[data-v-313955be]{\r\n\tposition: relative;\r\n\ttext-align:right;\n}\n.gk680 .ui.button.blue.right[data-v-313955be]{\r\n\tmargin-right:0px;\n}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-316ac60d\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-io.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.terminal[data-v-316ac60d]{\r\n\tposition: relative;\n}\n.terminal label[data-v-316ac60d]{\r\n\twhite-space:nowrap;\r\n\tmin-width: 6em;\r\n\ttext-align:center;\n}\n.terminal label.center[data-v-316ac60d]{\r\n\tmin-width: 10em;\r\n\ttext-align:center;\n}\n.terminal .right[data-v-316ac60d]{\r\n\tposition: relative;\r\n\ttext-align:right;\n}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-33e25aed\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-panel.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.terminal[data-v-33e25aed]{\r\n\tposition: relative;\n}\n.terminal label[data-v-33e25aed]{\r\n\twhite-space:nowrap;\r\n\tmin-width: 8em;\r\n\ttext-align:center;\n}\n.terminal .right[data-v-33e25aed]{\r\n\tposition: relative;\r\n\ttext-align:right;\n}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3e60cb2c\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-time.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.gk680[data-v-3e60cb2c]{\r\n\tposition: relative;\n}\n.gk680 .top[data-v-3e60cb2c]{\r\n\tposition: relative;\r\n\tpadding: 10px;\n}\n.gk680 label[data-v-3e60cb2c]{\r\n\twhite-space:nowrap;\r\n\tmin-width: 6em;\r\n\ttext-align:center;\n}\n.gk680 .right[data-v-3e60cb2c]{\r\n\tposition: relative;\r\n\ttext-align:right;\n}\n.gk680 .ui.button.blue.right[data-v-3e60cb2c]{\r\n\tmargin-right:0px;\n}\n.gk680 .ui.form .one.wide.field[data-v-3e60cb2c]{\r\n\twidth:8.25%!important;\n}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-46dbee50\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/device.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.device[data-v-46dbee50]{\r\n\tposition: relative;\r\n\tmax-height: 100%;\r\n\toverflow-y: auto;\n}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4724d7c1\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/home.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.home[data-v-4724d7c1],\n.home .left[data-v-4724d7c1],\n.home .left .tree[data-v-4724d7c1],\n.home .right[data-v-4724d7c1] {\n\tposition: relative;\n}\n.home[data-v-4724d7c1],\n.home .left[data-v-4724d7c1] {\n\theight: calc(100% - 1px);  /* 为了不挡住底边 1px 的 border */\n}\n.home .left .tree[data-v-4724d7c1],\n.home .right[data-v-4724d7c1] {\n\theight: 100%;\n}\n.home[data-v-4724d7c1] {\n    border-radius: 5px 0 0 5px;\n}\n.home .left[data-v-4724d7c1] {\n\tfloat: left;\n\twidth: 250px;\n\toverflow:auto;\n    border-radius: 5px;\n}\n.home .left .tree[data-v-4724d7c1] {\n\tbackground-color: #fff;\n}\n.home .right[data-v-4724d7c1] {\n\twidth: calc(100% - 250px);\n\tfloat: left;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-489b5c38\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-video.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.terminal[data-v-489b5c38]{\r\n\tposition: relative;\n}\n.terminal label[data-v-489b5c38]{\r\n\twhite-space:nowrap;\r\n\tmin-width: 10em;\r\n\ttext-align:center;\n}\n.terminal .right[data-v-489b5c38]{\r\n\tposition: relative;\r\n\ttext-align:right;\n}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6118dcba\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-alarm.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.terminal[data-v-6118dcba]{\r\n\tposition: relative;\n}\n.terminal label[data-v-6118dcba]{\r\n\twhite-space:nowrap;\r\n\tmin-width: 5em;\r\n\ttext-align:center;\n}\n.terminal label.center[data-v-6118dcba]{\r\n\tmin-width: 10em;\r\n\ttext-align:center;\n}\n.terminal label.short[data-v-6118dcba]{\r\n\tmin-width: 2em;\n}\n.terminal .right[data-v-6118dcba]{\r\n\tposition: relative;\r\n\ttext-align:right;\n}\n.terminal .ui.form select[data-v-6118dcba]{\r\n\tpadding: .62em 0.5em;\n}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6ac4ef76\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-alarmstatus.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.gk680[data-v-6ac4ef76]{\r\n\tposition: relative;\n}\n.gk680 .top[data-v-6ac4ef76]{\r\n\tposition: relative;\r\n\tpadding: 10px;\n}\n.gk680 label[data-v-6ac4ef76]{\r\n\twhite-space:nowrap;\r\n\ttext-align:center;\n}\n.gk680 .right[data-v-6ac4ef76]{\r\n\tposition: relative;\r\n\ttext-align:right;\n}\n.gk680 .ui.button.blue.right[data-v-6ac4ef76]{\r\n\tmargin-right:0px;\n}\n.gk680 .ui.form .one.wide.field[data-v-6ac4ef76]{\r\n\twidth:8.25%!important;\n}\r\n", ""]);

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

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-96264eca\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/mike-info.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.mike[data-v-96264eca]{\r\n\tposition: relative;\n}\n.mike .top[data-v-96264eca]{\r\n\tposition: relative;\r\n\tpadding: 10px;\n}\n.mike label[data-v-96264eca]{\r\n\twhite-space:nowrap;\r\n\tmin-width: 6em;\r\n\ttext-align:center;\n}\n.mike .right[data-v-96264eca]{\r\n\tposition: relative;\r\n\ttext-align:right;\n}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-9e0f21c2\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-assistrelate.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.ui.fluid.dropdown.relate{\r\n\tmin-width:90%;\n}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-9e0f21c2\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-assistrelate.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.gk680[data-v-9e0f21c2]{\r\n\tposition: relative;\n}\n.gk680 .top[data-v-9e0f21c2]{\r\n\tposition: relative;\r\n\tpadding: 10px;\n}\n.gk680 label[data-v-9e0f21c2]{\r\n\twhite-space:nowrap;\r\n\tmin-width: 6em;\r\n\ttext-align:center;\n}\n.gk680 .right[data-v-9e0f21c2]{\r\n\tposition: relative;\r\n\ttext-align:right;\n}\n.gk680 .ui.button.blue.right[data-v-9e0f21c2]{\r\n\tmargin-right:0px;\n}\n.gk680 .ui.form .one.wide.field[data-v-9e0f21c2]{\r\n\twidth:8.25%!important;\n}\r\n\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-a80ffc56\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-info.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.terminal[data-v-a80ffc56]{\r\n\tposition: relative;\n}\n.terminal label[data-v-a80ffc56]{\r\n\twhite-space:nowrap;\r\n\tmin-width: 6em;\r\n\ttext-align:center;\n}\n.terminal .right[data-v-a80ffc56]{\r\n\tposition: relative;\r\n\ttext-align:right;\n}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-a9127e86\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/server.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.server[data-v-a9127e86]{\r\n\tposition: relative;\r\n\tfont-size: 1em;\n}\n.server h2[data-v-a9127e86]{\r\n\ttext-align: center;\n}\n.server .ui.input[data-v-a9127e86]{\r\n\tpadding: 10px 0;\r\n\tmargin-right: 5px;\n}\n.server .ui.input .subject[data-v-a9127e86]{\r\n\tmin-width: 8em;\r\n\ttext-align:center;\r\n\tline-height: 250%;\r\n\twhite-space:nowrap;\n}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-af58f616\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/group.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.group[data-v-af58f616]{\r\n\tposition: relative;\r\n\tfont-size: 1em;\n}\n.group h2[data-v-af58f616]{\r\n\ttext-align: center;\n}\n.group .ui.input[data-v-af58f616]{\r\n\tpadding: 10px 0;\r\n\tmargin-right: 5px;\n}\n.group .ui.input .subject[data-v-af58f616]{\r\n\tmin-width: 8em;\r\n\ttext-align:center;\r\n\tline-height: 250%;\r\n\twhite-space:nowrap;\n}\n.group .selection.dropdown[data-v-af58f616]{\r\n\tpadding-top: 8px;\r\n\tpadding-bottom: 8px;\n}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-c36ac980\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.gk680[data-v-c36ac980]{\r\n\tposition: relative;\n}\n.gk680 .top[data-v-c36ac980]{\r\n\tposition: relative;\r\n\tpadding: 10px;\n}\n.gk680 label[data-v-c36ac980]{\r\n\twhite-space:nowrap;\r\n\tmin-width: 6em;\r\n\ttext-align:center;\n}\n.gk680 .right[data-v-c36ac980]{\r\n\tposition: relative;\r\n\ttext-align:right;\n}\n.gk680 .ui.button.blue.right[data-v-c36ac980]{\r\n\tmargin-right:0px;\n}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-c74d6214\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.terminal .top[data-v-c74d6214]{\r\n\tposition: relative;\r\n\tpadding: 10px;\n}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e72f1098\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-led.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.terminal[data-v-e72f1098]{\r\n\tposition: relative;\n}\n.terminal label[data-v-e72f1098]{\r\n\twhite-space:nowrap;\r\n\tmin-width: 10em;\r\n\ttext-align:center;\n}\n.terminal .right[data-v-e72f1098]{\r\n\tposition: relative;\r\n\ttext-align:right;\n}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-f1e85a98\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-autodefence.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.gk680[data-v-f1e85a98]{\r\n\tposition: relative;\n}\n.gk680 .top[data-v-f1e85a98]{\r\n\tposition: relative;\r\n\tpadding: 10px;\n}\n.gk680 label[data-v-f1e85a98]{\r\n\twhite-space:nowrap;\r\n\tmin-width: 6em;\r\n\ttext-align:center;\n}\n.gk680 .right[data-v-f1e85a98]{\r\n\tposition: relative;\r\n\ttext-align:right;\n}\n.gk680 .ui.button.blue.right[data-v-f1e85a98]{\r\n\tmargin-right:0px;\n}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-f92cc69e\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-assistctrl.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.gk680[data-v-f92cc69e]{\r\n\tposition: relative;\n}\n.gk680 .top[data-v-f92cc69e]{\r\n\tposition: relative;\r\n\tpadding: 10px;\n}\n.gk680 label[data-v-f92cc69e]{\r\n\twhite-space:nowrap;\r\n\tmin-width: 6em;\r\n\ttext-align:center;\n}\n.gk680 .right[data-v-f92cc69e]{\r\n\tposition: relative;\r\n\ttext-align:right;\n}\n.gk680 .ui.button.blue.right[data-v-f92cc69e]{\r\n\tmargin-right:0px;\n}\n.gk680 .ui.form .one.wide.field[data-v-f92cc69e]{\r\n\twidth:8.25%!important;\n}\r\n\r\n", ""]);

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

/***/ "./node_modules/css-loader/index.js!./src/assets/js/semantic/components/accordion.min.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "/*!\r\n * # Semantic UI 2.2.10 - Accordion\r\n * http://github.com/semantic-org/semantic-ui/\r\n *\r\n *\r\n * Released under the MIT license\r\n * http://opensource.org/licenses/MIT\r\n *\r\n */.ui.accordion,.ui.accordion .accordion{max-width:100%}.ui.accordion .accordion{margin:1em 0 0;padding:0}.ui.accordion .accordion .title,.ui.accordion .title{cursor:pointer}.ui.accordion .title:not(.ui){padding:.5em 0;font-family:Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;font-size:1em;color:rgba(0,0,0,.87)}.ui.accordion .accordion .title~.content,.ui.accordion .title~.content{display:none}.ui.accordion:not(.styled) .accordion .title~.content:not(.ui),.ui.accordion:not(.styled) .title~.content:not(.ui){margin:'';padding:.5em 0 1em}.ui.accordion:not(.styled) .title~.content:not(.ui):last-child{padding-bottom:0}.ui.accordion .accordion .title .dropdown.icon,.ui.accordion .title .dropdown.icon{display:inline-block;float:none;opacity:1;width:1.25em;height:1em;margin:0 .25rem 0 0;padding:0;font-size:1em;-webkit-transition:opacity .1s ease,-webkit-transform .1s ease;transition:opacity .1s ease,-webkit-transform .1s ease;transition:transform .1s ease,opacity .1s ease;transition:transform .1s ease,opacity .1s ease,-webkit-transform .1s ease;vertical-align:baseline;-webkit-transform:none;transform:none}.ui.accordion.menu .item .title{display:block;padding:0}.ui.accordion.menu .item .title>.dropdown.icon{float:right;margin:.21425em 0 0 1em;-webkit-transform:rotate(180deg);transform:rotate(180deg)}.ui.accordion .ui.header .dropdown.icon{font-size:1em;margin:0 .25rem 0 0}.ui.accordion .accordion .active.title .dropdown.icon,.ui.accordion .active.title .dropdown.icon,.ui.accordion.menu .item .active.title>.dropdown.icon{-webkit-transform:rotate(90deg);transform:rotate(90deg)}.ui.styled.accordion{width:600px}.ui.styled.accordion,.ui.styled.accordion .accordion{border-radius:.28571429rem;background:#FFF;box-shadow:0 1px 2px 0 rgba(34,36,38,.15),0 0 0 1px rgba(34,36,38,.15)}.ui.styled.accordion .accordion .title,.ui.styled.accordion .title{margin:0;padding:.75em 1em;color:rgba(0,0,0,.4);font-weight:700;border-top:1px solid rgba(34,36,38,.15);-webkit-transition:background .1s ease,color .1s ease;transition:background .1s ease,color .1s ease}.ui.styled.accordion .accordion .title:first-child,.ui.styled.accordion>.title:first-child{border-top:none}.ui.styled.accordion .accordion .content,.ui.styled.accordion .content{margin:0;padding:.5em 1em 1.5em}.ui.styled.accordion .accordion .content{padding:.5em 1em 1.5em}.ui.styled.accordion .accordion .active.title,.ui.styled.accordion .accordion .title:hover,.ui.styled.accordion .active.title,.ui.styled.accordion .title:hover{background:0 0;color:rgba(0,0,0,.87)}.ui.styled.accordion .accordion .active.title,.ui.styled.accordion .active.title{background:0 0;color:rgba(0,0,0,.95)}.ui.accordion .accordion .active.content,.ui.accordion .active.content{display:block}.ui.fluid.accordion,.ui.fluid.accordion .accordion{width:100%}.ui.inverted.accordion .title:not(.ui){color:rgba(255,255,255,.9)}@font-face{font-family:Accordion;src:url(data:application/x-font-ttf;charset=utf-8;base64,AAEAAAALAIAAAwAwT1MvMggjB5AAAAC8AAAAYGNtYXAPfOIKAAABHAAAAExnYXNwAAAAEAAAAWgAAAAIZ2x5Zryj6HgAAAFwAAAAyGhlYWT/0IhHAAACOAAAADZoaGVhApkB5wAAAnAAAAAkaG10eAJuABIAAAKUAAAAGGxvY2EAjABWAAACrAAAAA5tYXhwAAgAFgAAArwAAAAgbmFtZfC1n04AAALcAAABPHBvc3QAAwAAAAAEGAAAACAAAwIAAZAABQAAAUwBZgAAAEcBTAFmAAAA9QAZAIQAAAAAAAAAAAAAAAAAAAABEAAAAAAAAAAAAAAAAAAAAABAAADw2gHg/+D/4AHgACAAAAABAAAAAAAAAAAAAAAgAAAAAAACAAAAAwAAABQAAwABAAAAFAAEADgAAAAKAAgAAgACAAEAIPDa//3//wAAAAAAIPDZ//3//wAB/+MPKwADAAEAAAAAAAAAAAAAAAEAAf//AA8AAQAAAAAAAAAAAAIAADc5AQAAAAABAAAAAAAAAAAAAgAANzkBAAAAAAEAAAAAAAAAAAACAAA3OQEAAAAAAQASAEkAtwFuABMAADc0PwE2FzYXFh0BFAcGJwYvASY1EgaABQgHBQYGBQcIBYAG2wcGfwcBAQcECf8IBAcBAQd/BgYAAAAAAQAAAEkApQFuABMAADcRNDc2MzIfARYVFA8BBiMiJyY1AAUGBwgFgAYGgAUIBwYFWwEACAUGBoAFCAcFgAYGBQcAAAABAAAAAQAAqWYls18PPPUACwIAAAAAAM/9o+4AAAAAz/2j7gAAAAAAtwFuAAAACAACAAAAAAAAAAEAAAHg/+AAAAIAAAAAAAC3AAEAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAAAQAAAAC3ABIAtwAAAAAAAAAKABQAHgBCAGQAAAABAAAABgAUAAEAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAADgCuAAEAAAAAAAEADAAAAAEAAAAAAAIADgBAAAEAAAAAAAMADAAiAAEAAAAAAAQADABOAAEAAAAAAAUAFgAMAAEAAAAAAAYABgAuAAEAAAAAAAoANABaAAMAAQQJAAEADAAAAAMAAQQJAAIADgBAAAMAAQQJAAMADAAiAAMAAQQJAAQADABOAAMAAQQJAAUAFgAMAAMAAQQJAAYADAA0AAMAAQQJAAoANABaAHIAYQB0AGkAbgBnAFYAZQByAHMAaQBvAG4AIAAxAC4AMAByAGEAdABpAG4AZ3JhdGluZwByAGEAdABpAG4AZwBSAGUAZwB1AGwAYQByAHIAYQB0AGkAbgBnAEYAbwBuAHQAIABnAGUAbgBlAHIAYQB0AGUAZAAgAGIAeQAgAEkAYwBvAE0AbwBvAG4ALgADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA) format('truetype'),url(data:application/font-woff;charset=utf-8;base64,d09GRk9UVE8AAASwAAoAAAAABGgAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABDRkYgAAAA9AAAAS0AAAEtFpovuE9TLzIAAAIkAAAAYAAAAGAIIweQY21hcAAAAoQAAABMAAAATA984gpnYXNwAAAC0AAAAAgAAAAIAAAAEGhlYWQAAALYAAAANgAAADb/0IhHaGhlYQAAAxAAAAAkAAAAJAKZAedobXR4AAADNAAAABgAAAAYAm4AEm1heHAAAANMAAAABgAAAAYABlAAbmFtZQAAA1QAAAE8AAABPPC1n05wb3N0AAAEkAAAACAAAAAgAAMAAAEABAQAAQEBB3JhdGluZwABAgABADr4HAL4GwP4GAQeCgAZU/+Lix4KABlT/4uLDAeLa/iU+HQFHQAAAHkPHQAAAH4RHQAAAAkdAAABJBIABwEBBw0PERQZHnJhdGluZ3JhdGluZ3UwdTF1MjB1RjBEOXVGMERBAAACAYkABAAGAQEEBwoNVp38lA78lA78lA77lA773Z33bxWLkI2Qj44I9xT3FAWOj5CNkIuQi4+JjoePiI2Gi4YIi/uUBYuGiYeHiIiHh4mGi4aLho2Ijwj7FPcUBYeOiY+LkAgO+92L5hWL95QFi5CNkI6Oj4+PjZCLkIuQiY6HCPcU+xQFj4iNhouGi4aJh4eICPsU+xQFiIeGiYaLhouHjYePiI6Jj4uQCA74lBT4lBWLDAoAAAAAAwIAAZAABQAAAUwBZgAAAEcBTAFmAAAA9QAZAIQAAAAAAAAAAAAAAAAAAAABEAAAAAAAAAAAAAAAAAAAAABAAADw2gHg/+D/4AHgACAAAAABAAAAAAAAAAAAAAAgAAAAAAACAAAAAwAAABQAAwABAAAAFAAEADgAAAAKAAgAAgACAAEAIPDa//3//wAAAAAAIPDZ//3//wAB/+MPKwADAAEAAAAAAAAAAAAAAAEAAf//AA8AAQAAAAEAADfYOJZfDzz1AAsCAAAAAADP/aPuAAAAAM/9o+4AAAAAALcBbgAAAAgAAgAAAAAAAAABAAAB4P/gAAACAAAAAAAAtwABAAAAAAAAAAAAAAAAAAAABgAAAAAAAAAAAAAAAAEAAAAAtwASALcAAAAAUAAABgAAAAAADgCuAAEAAAAAAAEADAAAAAEAAAAAAAIADgBAAAEAAAAAAAMADAAiAAEAAAAAAAQADABOAAEAAAAAAAUAFgAMAAEAAAAAAAYABgAuAAEAAAAAAAoANABaAAMAAQQJAAEADAAAAAMAAQQJAAIADgBAAAMAAQQJAAMADAAiAAMAAQQJAAQADABOAAMAAQQJAAUAFgAMAAMAAQQJAAYADAA0AAMAAQQJAAoANABaAHIAYQB0AGkAbgBnAFYAZQByAHMAaQBvAG4AIAAxAC4AMAByAGEAdABpAG4AZ3JhdGluZwByAGEAdABpAG4AZwBSAGUAZwB1AGwAYQByAHIAYQB0AGkAbgBnAEYAbwBuAHQAIABnAGUAbgBlAHIAYQB0AGUAZAAgAGIAeQAgAEkAYwBvAE0AbwBvAG4ALgADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA) format('woff');font-weight:400;font-style:normal}.ui.accordion .accordion .title .dropdown.icon,.ui.accordion .title .dropdown.icon{font-family:Accordion;line-height:1;-webkit-backface-visibility:hidden;backface-visibility:hidden;font-weight:400;font-style:normal;text-align:center}.ui.accordion .accordion .title .dropdown.icon:before,.ui.accordion .title .dropdown.icon:before{content:'\\F0DA'}", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./src/assets/js/semantic/components/form.min.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "/*!\r\n * # Semantic UI 2.2.10 - Form\r\n * http://github.com/semantic-org/semantic-ui/\r\n *\r\n *\r\n * Released under the MIT license\r\n * http://opensource.org/licenses/MIT\r\n *\r\n */.ui.form{position:relative;max-width:100%}.ui.form>p{margin:1em 0}.ui.form .field{clear:both;margin:0 0 1em}.ui.form .field:last-child,.ui.form .fields:last-child .field{margin-bottom:0}.ui.form .fields .field{clear:both;margin:0}.ui.form .field>label{display:block;margin:0 0 .28571429rem;color:rgba(0,0,0,.87);font-size:.92857143em;font-weight:700;text-transform:none}.ui.form input:not([type]),.ui.form input[type=date],.ui.form input[type=url],.ui.form input[type=datetime-local],.ui.form input[type=email],.ui.form input[type=number],.ui.form input[type=password],.ui.form input[type=search],.ui.form input[type=tel],.ui.form input[type=time],.ui.form input[type=text],.ui.form input[type=file],.ui.form textarea{width:100%;vertical-align:top}.ui.form ::-webkit-datetime-edit,.ui.form ::-webkit-inner-spin-button{height:1.21428571em}.ui.form input:not([type]),.ui.form input[type=date],.ui.form input[type=url],.ui.form input[type=datetime-local],.ui.form input[type=email],.ui.form input[type=number],.ui.form input[type=password],.ui.form input[type=search],.ui.form input[type=tel],.ui.form input[type=time],.ui.form input[type=text],.ui.form input[type=file]{font-family:Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;margin:0;outline:0;-webkit-appearance:none;tap-highlight-color:rgba(255,255,255,0);line-height:1.21428571em;padding:.67857143em 1em;font-size:1em;background:#FFF;border:1px solid rgba(34,36,38,.15);color:rgba(0,0,0,.87);border-radius:.28571429rem;box-shadow:0 0 0 0 transparent inset;-webkit-transition:color .1s ease,border-color .1s ease;transition:color .1s ease,border-color .1s ease}.ui.form textarea{margin:0;-webkit-appearance:none;tap-highlight-color:rgba(255,255,255,0);padding:.78571429em 1em;background:#FFF;border:1px solid rgba(34,36,38,.15);outline:0;color:rgba(0,0,0,.87);border-radius:.28571429rem;box-shadow:0 0 0 0 transparent inset;-webkit-transition:color .1s ease,border-color .1s ease;transition:color .1s ease,border-color .1s ease;font-size:1em;line-height:1.2857;resize:vertical}.ui.form textarea:not([rows]){height:12em;min-height:8em;max-height:24em}.ui.form input[type=checkbox],.ui.form textarea{vertical-align:top}.ui.form input.attached{width:auto}.ui.form select{display:block;height:auto;width:100%;background:#FFF;border:1px solid rgba(34,36,38,.15);border-radius:.28571429rem;box-shadow:0 0 0 0 transparent inset;padding:.62em 1em;color:rgba(0,0,0,.87);-webkit-transition:color .1s ease,border-color .1s ease;transition:color .1s ease,border-color .1s ease}.ui.form .field>.selection.dropdown{width:100%}.ui.form .field>.selection.dropdown>.dropdown.icon{float:right}.ui.form .inline.field>.selection.dropdown,.ui.form .inline.fields .field>.selection.dropdown{width:auto}.ui.form .inline.field>.selection.dropdown>.dropdown.icon,.ui.form .inline.fields .field>.selection.dropdown>.dropdown.icon{float:none}.ui.form .field .ui.input,.ui.form .fields .field .ui.input,.ui.form .wide.field .ui.input{width:100%}.ui.form .inline.field:not(.wide) .ui.input,.ui.form .inline.fields .field:not(.wide) .ui.input{width:auto;vertical-align:middle}.ui.form .field .ui.input input,.ui.form .fields .field .ui.input input{width:auto}.ui.form .eight.fields .ui.input input,.ui.form .five.fields .ui.input input,.ui.form .four.fields .ui.input input,.ui.form .nine.fields .ui.input input,.ui.form .seven.fields .ui.input input,.ui.form .six.fields .ui.input input,.ui.form .ten.fields .ui.input input,.ui.form .three.fields .ui.input input,.ui.form .two.fields .ui.input input,.ui.form .wide.field .ui.input input{-webkit-box-flex:1;-webkit-flex:1 0 auto;-ms-flex:1 0 auto;flex:1 0 auto;width:0}.ui.form .error.message,.ui.form .success.message,.ui.form .warning.message{display:none}.ui.form .message:first-child{margin-top:0}.ui.form .field .prompt.label{white-space:normal;background:#FFF!important;border:1px solid #E0B4B4!important;color:#9F3A38!important}.ui.form .inline.field .prompt,.ui.form .inline.fields .field .prompt{vertical-align:top;margin:-.25em 0 -.5em .5em}.ui.form .inline.field .prompt:before,.ui.form .inline.fields .field .prompt:before{border-width:0 0 1px 1px;bottom:auto;right:auto;top:50%;left:0}.ui.form .field.field input:-webkit-autofill{box-shadow:0 0 0 100px ivory inset!important;border-color:#E5DFA1!important}.ui.form .field.field input:-webkit-autofill:focus{box-shadow:0 0 0 100px ivory inset!important;border-color:#D5C315!important}.ui.form .error.error input:-webkit-autofill{box-shadow:0 0 0 100px #FFFAF0 inset!important;border-color:#E0B4B4!important}.ui.form ::-webkit-input-placeholder{color:rgba(191,191,191,.87)}.ui.form :-ms-input-placeholder{color:rgba(191,191,191,.87)}.ui.form ::-moz-placeholder{color:rgba(191,191,191,.87)}.ui.form :focus::-webkit-input-placeholder{color:rgba(115,115,115,.87)}.ui.form :focus:-ms-input-placeholder{color:rgba(115,115,115,.87)}.ui.form :focus::-moz-placeholder{color:rgba(115,115,115,.87)}.ui.form .error ::-webkit-input-placeholder{color:#e7bdbc}.ui.form .error :-ms-input-placeholder{color:#e7bdbc!important}.ui.form .error ::-moz-placeholder{color:#e7bdbc}.ui.form .error :focus::-webkit-input-placeholder{color:#da9796}.ui.form .error :focus:-ms-input-placeholder{color:#da9796!important}.ui.form .error :focus::-moz-placeholder{color:#da9796}.ui.form input:not([type]):focus,.ui.form input[type=date]:focus,.ui.form input[type=url]:focus,.ui.form input[type=datetime-local]:focus,.ui.form input[type=email]:focus,.ui.form input[type=number]:focus,.ui.form input[type=password]:focus,.ui.form input[type=search]:focus,.ui.form input[type=tel]:focus,.ui.form input[type=time]:focus,.ui.form input[type=text]:focus,.ui.form input[type=file]:focus{color:rgba(0,0,0,.95);border-color:#85B7D9;border-radius:.28571429rem;background:#FFF;box-shadow:0 0 0 0 rgba(34,36,38,.35) inset}.ui.form textarea:focus{color:rgba(0,0,0,.95);border-color:#85B7D9;border-radius:.28571429rem;background:#FFF;box-shadow:0 0 0 0 rgba(34,36,38,.35) inset;-webkit-appearance:none}.ui.form.success .success.message:not(:empty){display:block}.ui.form.success .compact.success.message:not(:empty){display:inline-block}.ui.form.success .icon.success.message:not(:empty){display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}.ui.form.warning .warning.message:not(:empty){display:block}.ui.form.warning .compact.warning.message:not(:empty){display:inline-block}.ui.form.warning .icon.warning.message:not(:empty){display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}.ui.form.error .error.message:not(:empty){display:block}.ui.form.error .compact.error.message:not(:empty){display:inline-block}.ui.form.error .icon.error.message:not(:empty){display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}.ui.form .field.error .input,.ui.form .field.error label,.ui.form .fields.error .field .input,.ui.form .fields.error .field label{color:#9F3A38}.ui.form .field.error .corner.label,.ui.form .fields.error .field .corner.label{border-color:#9F3A38;color:#FFF}.ui.form .field.error input:not([type]),.ui.form .field.error input[type=date],.ui.form .field.error input[type=url],.ui.form .field.error input[type=datetime-local],.ui.form .field.error input[type=email],.ui.form .field.error input[type=number],.ui.form .field.error input[type=password],.ui.form .field.error input[type=search],.ui.form .field.error input[type=tel],.ui.form .field.error input[type=time],.ui.form .field.error input[type=text],.ui.form .field.error input[type=file],.ui.form .field.error select,.ui.form .field.error textarea,.ui.form .fields.error .field input:not([type]),.ui.form .fields.error .field input[type=date],.ui.form .fields.error .field input[type=url],.ui.form .fields.error .field input[type=datetime-local],.ui.form .fields.error .field input[type=email],.ui.form .fields.error .field input[type=number],.ui.form .fields.error .field input[type=password],.ui.form .fields.error .field input[type=search],.ui.form .fields.error .field input[type=tel],.ui.form .fields.error .field input[type=time],.ui.form .fields.error .field input[type=text],.ui.form .fields.error .field input[type=file],.ui.form .fields.error .field select,.ui.form .fields.error .field textarea{background:#FFF6F6;border-color:#E0B4B4;color:#9F3A38;border-radius:'';box-shadow:none}.ui.form .field.error input:not([type]):focus,.ui.form .field.error input[type=date]:focus,.ui.form .field.error input[type=url]:focus,.ui.form .field.error input[type=datetime-local]:focus,.ui.form .field.error input[type=email]:focus,.ui.form .field.error input[type=number]:focus,.ui.form .field.error input[type=password]:focus,.ui.form .field.error input[type=search]:focus,.ui.form .field.error input[type=tel]:focus,.ui.form .field.error input[type=time]:focus,.ui.form .field.error input[type=text]:focus,.ui.form .field.error input[type=file]:focus,.ui.form .field.error select:focus,.ui.form .field.error textarea:focus{background:#FFF6F6;border-color:#E0B4B4;color:#9F3A38;-webkit-appearance:none;box-shadow:none}.ui.form .field.error select{-webkit-appearance:menulist-button}.ui.form .field.error .ui.dropdown,.ui.form .field.error .ui.dropdown .item,.ui.form .field.error .ui.dropdown .text,.ui.form .fields.error .field .ui.dropdown,.ui.form .fields.error .field .ui.dropdown .item{background:#FFF6F6;color:#9F3A38}.ui.form .field.error .ui.dropdown,.ui.form .field.error .ui.dropdown:hover,.ui.form .fields.error .field .ui.dropdown,.ui.form .fields.error .field .ui.dropdown:hover{border-color:#E0B4B4!important}.ui.form .field.error .ui.dropdown:hover .menu,.ui.form .fields.error .field .ui.dropdown:hover .menu{border-color:#E0B4B4}.ui.form .field.error .ui.multiple.selection.dropdown>.label,.ui.form .fields.error .field .ui.multiple.selection.dropdown>.label{background-color:#EACBCB;color:#9F3A38}.ui.form .field.error .ui.dropdown .menu .item:hover,.ui.form .field.error .ui.dropdown .menu .selected.item,.ui.form .fields.error .field .ui.dropdown .menu .item:hover,.ui.form .fields.error .field .ui.dropdown .menu .selected.item{background-color:#FBE7E7}.ui.form .field.error .ui.dropdown .menu .active.item,.ui.form .fields.error .field .ui.dropdown .menu .active.item{background-color:#FDCFCF!important}.ui.form .field.error .checkbox:not(.toggle):not(.slider) .box,.ui.form .field.error .checkbox:not(.toggle):not(.slider) label,.ui.form .fields.error .field .checkbox:not(.toggle):not(.slider) .box,.ui.form .fields.error .field .checkbox:not(.toggle):not(.slider) label{color:#9F3A38}.ui.form .field.error .checkbox:not(.toggle):not(.slider) .box:before,.ui.form .field.error .checkbox:not(.toggle):not(.slider) label:before,.ui.form .fields.error .field .checkbox:not(.toggle):not(.slider) .box:before,.ui.form .fields.error .field .checkbox:not(.toggle):not(.slider) label:before{background:#FFF6F6;border-color:#E0B4B4}.ui.form .field.error .checkbox .box:after,.ui.form .field.error .checkbox label:after,.ui.form .fields.error .field .checkbox .box:after,.ui.form .fields.error .field .checkbox label:after{color:#9F3A38}.ui.form .disabled.field,.ui.form .disabled.fields .field,.ui.form .field :disabled{pointer-events:none;opacity:.45}.ui.form .field.disabled>label,.ui.form .fields.disabled>label{opacity:.45}.ui.form .field.disabled :disabled{opacity:1}.ui.loading.form{position:relative;cursor:default;pointer-events:none}.ui.loading.form:before{position:absolute;content:'';top:0;left:0;background:rgba(255,255,255,.8);width:100%;height:100%;z-index:100}.ui.loading.form:after{position:absolute;content:'';top:50%;left:50%;margin:-1.5em 0 0 -1.5em;width:3em;height:3em;-webkit-animation:form-spin .6s linear;animation:form-spin .6s linear;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite;border-radius:500rem;border-color:#767676 rgba(0,0,0,.1) rgba(0,0,0,.1);border-style:solid;border-width:.2em;box-shadow:0 0 0 1px transparent;visibility:visible;z-index:101}@-webkit-keyframes form-spin{from{-webkit-transform:rotate(0);transform:rotate(0)}to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes form-spin{from{-webkit-transform:rotate(0);transform:rotate(0)}to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}.ui.form .required.field>.checkbox:after,.ui.form .required.field>label:after,.ui.form .required.fields.grouped>label:after,.ui.form .required.fields:not(.grouped)>.field>.checkbox:after,.ui.form .required.fields:not(.grouped)>.field>label:after{margin:-.2em 0 0 .2em;content:'*';color:#DB2828}.ui.form .required.field>label:after,.ui.form .required.fields.grouped>label:after,.ui.form .required.fields:not(.grouped)>.field>label:after{display:inline-block;vertical-align:top}.ui.form .required.field>.checkbox:after,.ui.form .required.fields:not(.grouped)>.field>.checkbox:after{position:absolute;top:0;left:100%}.ui.form .inverted.segment .ui.checkbox .box,.ui.form .inverted.segment .ui.checkbox label,.ui.form .inverted.segment label,.ui.inverted.form .inline.field>label,.ui.inverted.form .inline.field>p,.ui.inverted.form .inline.fields .field>label,.ui.inverted.form .inline.fields .field>p,.ui.inverted.form .inline.fields>label,.ui.inverted.form .ui.checkbox .box,.ui.inverted.form .ui.checkbox label,.ui.inverted.form label{color:rgba(255,255,255,.9)}.ui.inverted.form input:not([type]),.ui.inverted.form input[type=date],.ui.inverted.form input[type=url],.ui.inverted.form input[type=datetime-local],.ui.inverted.form input[type=email],.ui.inverted.form input[type=number],.ui.inverted.form input[type=password],.ui.inverted.form input[type=search],.ui.inverted.form input[type=tel],.ui.inverted.form input[type=time],.ui.inverted.form input[type=text],.ui.inverted.form input[type=file]{background:#FFF;border-color:rgba(255,255,255,.1);color:rgba(0,0,0,.87);box-shadow:none}.ui.form .grouped.fields{display:block;margin:0 0 1em}.ui.form .grouped.fields:last-child{margin-bottom:0}.ui.form .grouped.fields>label{margin:0 0 .28571429rem;color:rgba(0,0,0,.87);font-size:.92857143em;font-weight:700;text-transform:none}.ui.form .grouped.fields .field,.ui.form .grouped.inline.fields .field{display:block;margin:.5em 0;padding:0}.ui.form .fields{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;margin:0 -.5em 1em}.ui.form .fields>.field{-webkit-box-flex:0;-webkit-flex:0 1 auto;-ms-flex:0 1 auto;flex:0 1 auto;padding-left:.5em;padding-right:.5em}.ui.form .fields>.field:first-child{border-left:none;box-shadow:none}.ui.form .two.fields>.field,.ui.form .two.fields>.fields{width:50%}.ui.form .three.fields>.field,.ui.form .three.fields>.fields{width:33.33333333%}.ui.form .four.fields>.field,.ui.form .four.fields>.fields{width:25%}.ui.form .five.fields>.field,.ui.form .five.fields>.fields{width:20%}.ui.form .six.fields>.field,.ui.form .six.fields>.fields{width:16.66666667%}.ui.form .seven.fields>.field,.ui.form .seven.fields>.fields{width:14.28571429%}.ui.form .eight.fields>.field,.ui.form .eight.fields>.fields{width:12.5%}.ui.form .nine.fields>.field,.ui.form .nine.fields>.fields{width:11.11111111%}.ui.form .ten.fields>.field,.ui.form .ten.fields>.fields{width:10%}@media only screen and (max-width:767px){.ui.form .fields{-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap}.ui.form .eight.fields>.field,.ui.form .eight.fields>.fields,.ui.form .five.fields>.field,.ui.form .five.fields>.fields,.ui.form .four.fields>.field,.ui.form .four.fields>.fields,.ui.form .nine.fields>.field,.ui.form .nine.fields>.fields,.ui.form .seven.fields>.field,.ui.form .seven.fields>.fields,.ui.form .six.fields>.field,.ui.form .six.fields>.fields,.ui.form .ten.fields>.field,.ui.form .ten.fields>.fields,.ui.form .three.fields>.field,.ui.form .three.fields>.fields,.ui.form .two.fields>.field,.ui.form .two.fields>.fields,.ui.form [class*=\"equal width\"].fields>.field,.ui[class*=\"equal width\"].form .fields>.field{width:100%!important;margin:0 0 1em}}.ui.form .fields .wide.field{width:6.25%;padding-left:.5em;padding-right:.5em}.ui.form .one.wide.field{width:6.25%!important}.ui.form .two.wide.field{width:12.5%!important}.ui.form .three.wide.field{width:18.75%!important}.ui.form .four.wide.field{width:25%!important}.ui.form .five.wide.field{width:31.25%!important}.ui.form .six.wide.field{width:37.5%!important}.ui.form .seven.wide.field{width:43.75%!important}.ui.form .eight.wide.field{width:50%!important}.ui.form .nine.wide.field{width:56.25%!important}.ui.form .ten.wide.field{width:62.5%!important}.ui.form .eleven.wide.field{width:68.75%!important}.ui.form .twelve.wide.field{width:75%!important}.ui.form .thirteen.wide.field{width:81.25%!important}.ui.form .fourteen.wide.field{width:87.5%!important}.ui.form .fifteen.wide.field{width:93.75%!important}.ui.form .sixteen.wide.field{width:100%!important}@media only screen and (max-width:767px){.ui.form .fields>.eight.wide.field,.ui.form .fields>.eleven.wide.field,.ui.form .fields>.fifteen.wide.field,.ui.form .fields>.five.wide.field,.ui.form .fields>.four.wide.field,.ui.form .fields>.fourteen.wide.field,.ui.form .fields>.nine.wide.field,.ui.form .fields>.seven.wide.field,.ui.form .fields>.six.wide.field,.ui.form .fields>.sixteen.wide.field,.ui.form .fields>.ten.wide.field,.ui.form .fields>.thirteen.wide.field,.ui.form .fields>.three.wide.field,.ui.form .fields>.twelve.wide.field,.ui.form .fields>.two.wide.field,.ui.form .five.fields>.field,.ui.form .five.fields>.fields,.ui.form .four.fields>.field,.ui.form .four.fields>.fields,.ui.form .three.fields>.field,.ui.form .three.fields>.fields,.ui.form .two.fields>.field,.ui.form .two.fields>.fields{width:100%!important}.ui.form .fields{margin-bottom:0}}.ui.form [class*=\"equal width\"].fields>.field,.ui[class*=\"equal width\"].form .fields>.field{width:100%;-webkit-box-flex:1;-webkit-flex:1 1 auto;-ms-flex:1 1 auto;flex:1 1 auto}.ui.form .inline.fields{margin:0 0 1em;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;-ms-grid-row-align:center;align-items:center}.ui.form .inline.fields .field{margin:0;padding:0 1em 0 0}.ui.form .inline.field>label,.ui.form .inline.field>p,.ui.form .inline.fields .field>label,.ui.form .inline.fields .field>p,.ui.form .inline.fields>label{display:inline-block;width:auto;margin-top:0;margin-bottom:0;vertical-align:baseline;font-size:.92857143em;font-weight:700;color:rgba(0,0,0,.87);text-transform:none}.ui.form .inline.fields>label{margin:.035714em 1em 0 0}.ui.form .inline.field>input,.ui.form .inline.field>select,.ui.form .inline.fields .field>input,.ui.form .inline.fields .field>select{display:inline-block;width:auto;margin-top:0;margin-bottom:0;vertical-align:middle;font-size:1em}.ui.form .inline.field>:first-child,.ui.form .inline.fields .field>:first-child{margin:0 .85714286em 0 0}.ui.form .inline.field>:only-child,.ui.form .inline.fields .field>:only-child{margin:0}.ui.form .inline.fields .wide.field{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}.ui.form .inline.fields .wide.field>input,.ui.form .inline.fields .wide.field>select{width:100%}.ui.mini.form{font-size:.78571429rem}.ui.tiny.form{font-size:.85714286rem}.ui.small.form{font-size:.92857143rem}.ui.form{font-size:1rem}.ui.large.form{font-size:1.14285714rem}.ui.big.form{font-size:1.28571429rem}.ui.huge.form{font-size:1.42857143rem}.ui.massive.form{font-size:1.71428571rem}", ""]);

// exports


/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-006cfd45\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-ipc.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "terminal ui form"
  }, [_c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "fifteen wide  field"
  }, [_c('label', [_vm._v(_vm._s(_vm.IPCAddr1))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.IPCAddr1),
      expression: "item.IPCAddr1"
    }],
    domProps: {
      "value": (_vm.item.IPCAddr1)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.IPCAddr1 = $event.target.value
      }
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "fifteen wide  field"
  }, [_c('label', [_vm._v(_vm._s(_vm.IPCAddr2))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.IPCAddr2),
      expression: "item.IPCAddr2"
    }],
    domProps: {
      "value": (_vm.item.IPCAddr2)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.IPCAddr2 = $event.target.value
      }
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "fifteen wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.IPCAddr3))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.IPCAddr3),
      expression: "item.IPCAddr3"
    }],
    domProps: {
      "value": (_vm.item.IPCAddr3)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.IPCAddr3 = $event.target.value
      }
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "right"
  }, [_c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": function($event) {
        _vm.submit()
      }
    }
  }, [_vm._v(_vm._s(_vm.setting))])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-006cfd45", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-025907d6\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/kt-speaker.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "speaker ui styled fluid accordion"
  }, [(_vm.item.State != _vm.undefiend) ? _c('div', {
    staticClass: "top"
  }, [_c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": _vm.synchronized
    }
  }, [_vm._v(_vm._s(_vm.synchronizeDevice))])]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "active title"
  }, [_c('i', {
    staticClass: "dropdown icon"
  }), _vm._v("\n\t\t" + _vm._s(_vm.basicInformation) + "\n\t")]), _vm._v(" "), _c('div', {
    staticClass: "active content"
  }, [_c('div', {
    staticClass: "speaker ui form"
  }, [_c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.deviceID))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.DevID),
      expression: "item.DevID"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.DevID)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.DevID = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.deviceName))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.Alias),
      expression: "item.Alias"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.Alias)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.Alias = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.ipAddress))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.DevIP),
      expression: "item.DevIP"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.DevIP)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.DevIP = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.state))]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.State),
      expression: "item.State"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.State = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "-1"
    }
  }, [_vm._v(_vm._s(_vm.disconnect))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.free))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "9"
    }
  }, [_vm._v(_vm._s(_vm.working))])])])]), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.serverIp))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.SvrIP),
      expression: "item.SvrIP"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.SvrIP)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.SvrIP = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.volume))]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.AudioPort),
      expression: "item.AudioPort"
    }],
    staticClass: "ui dropdown",
    on: {
      "change": [function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.AudioPort = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }, _vm.changePage]
    }
  }, _vm._l((_vm.vol), function(n) {
    return _c('option', [_vm._v(_vm._s(n))])
  }))]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('button', {
    staticClass: "ui mini button",
    on: {
      "click": function($event) {
        _vm.setVolume()
      }
    }
  }, [_vm._v(_vm._s(_vm.L("音量设置", "iptalk")))])])])])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-025907d6", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-189edac3\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/device-list.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "deviceList"
  }, [_c('menubar', {
    attrs: {
      "compact": true,
      "id": "viewmode",
      "icon": false,
      "attached": "top",
      "items": _vm.items
    }
  }), _vm._v(" "), (_vm.mode == 1) ? _c('div', {
    staticClass: "deivces"
  }, [_c('vuetable', {
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
      "loaddata": _vm.onLoadData,
      "headerclick": _vm.headerClick
    }
  })], 1) : _vm._e(), _vm._v(" "), (_vm.mode == 2) ? _c('div', {
    staticClass: "deivces"
  }, [_vm._l((_vm.datas), function(item) {
    return [_c('div', {
      staticClass: "item",
      class: item.State == 2 ? '' : 'opacity'
    }, [(item.DevID.substring(0, 1) == '1') ? _c('img', {
      attrs: {
        "src": __webpack_require__("./src/apps/iptalk/images/TBV-6213B.jpg")
      }
    }) : _vm._e(), _vm._v(" "), (item.DevID.substring(0, 1) == '2') ? _c('img', {
      attrs: {
        "src": __webpack_require__("./src/apps/iptalk/images/microphone.jpg")
      }
    }) : _vm._e(), _vm._v(" "), _c('div', {
      staticClass: "alias"
    }, [_vm._v(_vm._s(item.Alias))]), _vm._v(" "), _c('div', {
      class: _vm.deviceStateColors[item.State]
    }, [_vm._v(_vm._s(_vm.deviceStates[item.State]))])])]
  })], 2) : _vm._e()], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-189edac3", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-313955be\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-alarmtype.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "gk680 ui form"
  }, [_c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.defence1))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.defence1),
      expression: "item.defence1"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.defence1)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.defence1 = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.defence2))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.defence2),
      expression: "item.defence2"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.defence2)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.defence2 = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.defence3))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.defence3),
      expression: "item.defence3"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.defence3)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.defence3 = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.defence4))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.defence4),
      expression: "item.defence4"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.defence4)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.defence4 = $event.target.value
      }
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.defence5))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.defence5),
      expression: "item.defence5"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.defence5)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.defence5 = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.defence6))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.defence6),
      expression: "item.defence6"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.defence6)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.defence6 = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.defence7))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.defence7),
      expression: "item.defence7"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.defence7)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.defence7 = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.defence8))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.defence8),
      expression: "item.defence8"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.defence8)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.defence8 = $event.target.value
      }
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.defence9))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.defence9),
      expression: "item.defence9"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.defence9)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.defence9 = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.defence10))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.defence10),
      expression: "item.defence10"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.defence10)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.defence10 = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.defence11))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.defence11),
      expression: "item.defence11"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.defence11)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.defence11 = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.defence12))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.defence12),
      expression: "item.defence12"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.defence12)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.defence12 = $event.target.value
      }
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.defence13))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.defence13),
      expression: "item.defence13"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.defence13)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.defence13 = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.defence14))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.defence14),
      expression: "item.defence14"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.defence14)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.defence14 = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.defence15))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.defence15),
      expression: "item.defence15"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.defence15)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.defence15 = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.defence16))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.defence16),
      expression: "item.defence16"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.defence16)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.defence16 = $event.target.value
      }
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "right"
  }, [_c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": _vm.alarmTypeSubmit
    }
  }, [_vm._v(_vm._s(_vm.setting))])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-313955be", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-316ac60d\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-io.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "terminal ui form"
  }, [_c('div', {
    staticClass: "inline fields"
  }, [_vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('label', {
    staticClass: "center"
  }, [_vm._v(_vm._s(_vm.setting))])]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('label', {
    staticClass: "center"
  }, [_vm._v(_vm._s(_vm.feedback))])]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('label', {
    staticClass: "center"
  }, [_vm._v(_vm._s(_vm.correspondingOutput) + "1")])]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('label', {
    staticClass: "center"
  }, [_vm._v(_vm._s(_vm.correspondingOutput) + "2")])]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('label', {
    staticClass: "center"
  }, [_vm._v(_vm._s(_vm.feedbackAddress))])])]), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "one wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.input) + "1")])]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.SignalIn1),
      expression: "item.SignalIn1"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.SignalIn1 = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.on))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.off))])])]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.FeedBack1),
      expression: "item.FeedBack1"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.FeedBack1 = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, _vm._l((_vm.types), function(item) {
    return _c('option', {
      domProps: {
        "value": item.FeedBackID
      }
    }, [_vm._v(_vm._s(item.FeedBackAlias))])
  }))]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.In1LinkOut1),
      expression: "item.In1LinkOut1"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.In1LinkOut1 = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.close))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.open))])])]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.In1LinkOut2),
      expression: "item.In1LinkOut2"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.In1LinkOut2 = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.close))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.open))])])]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.FeedBkAddr1),
      expression: "item.FeedBkAddr1"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.FeedBkAddr1 = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.none))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.callAddress))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "2"
    }
  }, [_vm._v(_vm._s(_vm.serviceAddress))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "3"
    }
  }, [_vm._v(_vm._s(_vm.emergencyAddress))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "4"
    }
  }, [_vm._v(_vm._s(_vm.patrolAddress))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "5"
    }
  }, [_vm._v(_vm._s(_vm.managerCenter))])])])]), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "one wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.input) + "2")])]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.SignalIn2),
      expression: "item.SignalIn2"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.SignalIn2 = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.on))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.off))])])]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.FeedBack2),
      expression: "item.FeedBack2"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.FeedBack2 = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, _vm._l((_vm.types), function(item) {
    return _c('option', {
      domProps: {
        "value": item.FeedBackID
      }
    }, [_vm._v(_vm._s(item.FeedBackAlias))])
  }))]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.In2LinkOut1),
      expression: "item.In2LinkOut1"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.In2LinkOut1 = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.close))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.open))])])]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.In2LinkOut2),
      expression: "item.In2LinkOut2"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.In2LinkOut2 = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.close))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.open))])])]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.FeedBkAddr2),
      expression: "item.FeedBkAddr2"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.FeedBkAddr2 = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.none))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.callAddress))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "2"
    }
  }, [_vm._v(_vm._s(_vm.serviceAddress))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "3"
    }
  }, [_vm._v(_vm._s(_vm.emergencyAddress))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "4"
    }
  }, [_vm._v(_vm._s(_vm.patrolAddress))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "5"
    }
  }, [_vm._v(_vm._s(_vm.managerCenter))])])])]), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "one wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.input) + "3")])]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.SignalIn3),
      expression: "item.SignalIn3"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.SignalIn3 = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.on))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.off))])])]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.FeedBack3),
      expression: "item.FeedBack3"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.FeedBack3 = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, _vm._l((_vm.types), function(item) {
    return _c('option', {
      domProps: {
        "value": item.FeedBackID
      }
    }, [_vm._v(_vm._s(item.FeedBackAlias))])
  }))]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.In3LinkOut1),
      expression: "item.In3LinkOut1"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.In3LinkOut1 = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.close))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.open))])])]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.In3LinkOut2),
      expression: "item.In3LinkOut2"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.In3LinkOut2 = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.close))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.open))])])]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.FeedBkAddr3),
      expression: "item.FeedBkAddr3"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.FeedBkAddr3 = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.none))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.callAddress))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "2"
    }
  }, [_vm._v(_vm._s(_vm.serviceAddress))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "3"
    }
  }, [_vm._v(_vm._s(_vm.emergencyAddress))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "4"
    }
  }, [_vm._v(_vm._s(_vm.patrolAddress))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "5"
    }
  }, [_vm._v(_vm._s(_vm.managerCenter))])])])]), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "one wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.input) + "4")])]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.SignalIn4),
      expression: "item.SignalIn4"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.SignalIn4 = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.on))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.off))])])]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.FeedBack4),
      expression: "item.FeedBack4"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.FeedBack4 = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, _vm._l((_vm.types), function(item) {
    return _c('option', {
      domProps: {
        "value": item.FeedBackID
      }
    }, [_vm._v(_vm._s(item.FeedBackAlias))])
  }))]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.In4LinkOut1),
      expression: "item.In4LinkOut1"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.In4LinkOut1 = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.close))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.open))])])]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.In4LinkOut2),
      expression: "item.In4LinkOut2"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.In4LinkOut2 = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.close))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.open))])])]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.FeedBkAddr4),
      expression: "item.FeedBkAddr4"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.FeedBkAddr4 = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.none))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.callAddress))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "2"
    }
  }, [_vm._v(_vm._s(_vm.serviceAddress))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "3"
    }
  }, [_vm._v(_vm._s(_vm.emergencyAddress))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "4"
    }
  }, [_vm._v(_vm._s(_vm.patrolAddress))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "5"
    }
  }, [_vm._v(_vm._s(_vm.managerCenter))])])])]), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.output) + "1")]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.SignalOut1),
      expression: "item.SignalOut1"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.SignalOut1 = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.close))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.open))])])]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.output) + "2")]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.SignalOut2),
      expression: "item.SignalOut2"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.SignalOut2 = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.close))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.open))])])]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.electricLock))]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.LockTrigger),
      expression: "item.LockTrigger"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.LockTrigger = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.none))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.output) + "1")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "2"
    }
  }, [_vm._v(_vm._s(_vm.output) + "2")])])]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.delayTime))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.LockOffDelayTime),
      expression: "item.LockOffDelayTime"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.LockOffDelayTime)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.LockOffDelayTime = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', [_vm._v(_vm._s(_vm.seconds))])])]), _vm._v(" "), _c('div', {
    staticClass: "right"
  }, [_c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": _vm.submit
    }
  }, [_vm._v(_vm._s(_vm.setting))])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "one wide field"
  }, [_c('label')])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-316ac60d", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-33e25aed\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-panel.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "terminal ui form"
  }, [_c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.subpanel))]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.SubPanel),
      expression: "item.SubPanel"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.SubPanel = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v("0")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v("1")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "2"
    }
  }, [_vm._v("2")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "3"
    }
  }, [_vm._v("3")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "4"
    }
  }, [_vm._v("4")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "5"
    }
  }, [_vm._v("5")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "6"
    }
  }, [_vm._v("6")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "7"
    }
  }, [_vm._v("7")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "8"
    }
  }, [_vm._v("8")])])])]), _vm._v(" "), (_vm.item.SubPanel > 0) ? _c('div', {
    staticClass: "inline fields"
  }, [_c('label', [_vm._v(_vm._s(_vm.broadcastType))]), _vm._v(" "), _vm._l((4), function(n) {
    return (n - 1 < _vm.item.SubPanel) ? _c('div', {
      staticClass: "four wide field"
    }, [_c('label', [_vm._v(_vm._s(_vm.subpanel) + _vm._s(n))]), _vm._v(" "), _c('select', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (_vm.item.SubPanelExport[n - 1]),
        expression: "item.SubPanelExport[n-1]"
      }],
      on: {
        "change": function($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
            return o.selected
          }).map(function(o) {
            var val = "_value" in o ? o._value : o.value;
            return val
          });
          _vm.$set(_vm.item.SubPanelExport, n - 1, $event.target.multiple ? $$selectedVal : $$selectedVal[0])
        }
      }
    }, [_c('option', {
      attrs: {
        "value": "0"
      }
    }, [_vm._v(_vm._s(_vm.terminalSpeake))]), _vm._v(" "), _c('option', {
      attrs: {
        "value": "1"
      }
    }, [_vm._v(_vm._s(_vm.externalSpeake))])])]) : _vm._e()
  })], 2) : _vm._e(), _vm._v(" "), (_vm.item.SubPanel > 4) ? _c('div', {
    staticClass: "inline fields"
  }, [_c('label'), _vm._v(" "), _vm._l((4), function(n) {
    return (n + 3 < _vm.item.SubPanel) ? _c('div', {
      staticClass: "four wide field"
    }, [_c('label', [_vm._v(_vm._s(_vm.subpanel) + _vm._s(n + 4))]), _vm._v(" "), _c('select', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (_vm.item.SubPanelExport[n + 3]),
        expression: "item.SubPanelExport[n+3]"
      }],
      on: {
        "change": function($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
            return o.selected
          }).map(function(o) {
            var val = "_value" in o ? o._value : o.value;
            return val
          });
          _vm.$set(_vm.item.SubPanelExport, n + 3, $event.target.multiple ? $$selectedVal : $$selectedVal[0])
        }
      }
    }, [_c('option', {
      attrs: {
        "value": "0"
      }
    }, [_vm._v(_vm._s(_vm.terminalSpeake))]), _vm._v(" "), _c('option', {
      attrs: {
        "value": "1"
      }
    }, [_vm._v(_vm._s(_vm.externalSpeake))])])]) : _vm._e()
  })], 2) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('label', [_vm._v(_vm._s(_vm.callAddress))]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.CallAddr),
      expression: "item.CallAddr"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.CallAddr)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.CallAddr = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.CallAddr1),
      expression: "item.CallAddr1"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.CallAddr1)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.CallAddr1 = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.CallAddr2),
      expression: "item.CallAddr2"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.CallAddr2)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.CallAddr2 = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.KeyLinkage1),
      expression: "item.KeyLinkage1"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.KeyLinkage1 = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.noAction))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.output) + "1")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "2"
    }
  }, [_vm._v(_vm._s(_vm.output) + "2")])])])]), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('label', [_vm._v(_vm._s(_vm.serviceAddress))]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.ConsultAddr),
      expression: "item.ConsultAddr"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.ConsultAddr)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.ConsultAddr = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.ConsultAddr1),
      expression: "item.ConsultAddr1"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.ConsultAddr1)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.ConsultAddr1 = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.ConsultAddr2),
      expression: "item.ConsultAddr2"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.ConsultAddr2)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.ConsultAddr2 = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.KeyLinkage2),
      expression: "item.KeyLinkage2"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.KeyLinkage2 = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.noAction))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.output) + "1")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "2"
    }
  }, [_vm._v(_vm._s(_vm.output) + "2")])])])]), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('label', [_vm._v(_vm._s(_vm.emergencyAddress))]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.EmergencyAddr),
      expression: "item.EmergencyAddr"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.EmergencyAddr)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.EmergencyAddr = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.EmergencyAddr1),
      expression: "item.EmergencyAddr1"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.EmergencyAddr1)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.EmergencyAddr1 = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.EmergencyAddr2),
      expression: "item.EmergencyAddr2"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.EmergencyAddr2)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.EmergencyAddr2 = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.KeyLinkage3),
      expression: "item.KeyLinkage3"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.KeyLinkage3 = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.noAction))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.output) + "1")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "2"
    }
  }, [_vm._v(_vm._s(_vm.output) + "2")])])])]), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('label', [_vm._v(_vm._s(_vm.patrolAddress))]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.WatchAddr),
      expression: "item.WatchAddr"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.WatchAddr)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.WatchAddr = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.WatchAddr1),
      expression: "item.WatchAddr1"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.WatchAddr1)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.WatchAddr1 = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.WatchAddr2),
      expression: "item.WatchAddr2"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.WatchAddr2)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.WatchAddr2 = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.KeyLinkage4),
      expression: "item.KeyLinkage4"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.KeyLinkage4 = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.noAction))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.output) + "1")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "2"
    }
  }, [_vm._v(_vm._s(_vm.output) + "2")])])])]), _vm._v(" "), _c('div', {
    staticClass: "right"
  }, [_c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": _vm.submit
    }
  }, [_vm._v(_vm._s(_vm.setting))])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-33e25aed", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-3e60cb2c\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-time.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "gk680 ui form"
  }, [_c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "three wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.year))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.date.year),
      expression: "date.year"
    }],
    attrs: {
      "type": "number",
      "min": "1970",
      "max": "2100"
    },
    domProps: {
      "value": (_vm.date.year)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.date.year = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.month))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.date.month),
      expression: "date.month"
    }],
    attrs: {
      "type": "number",
      "min": "1",
      "max": "12"
    },
    domProps: {
      "value": (_vm.date.month)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.date.month = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.day))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.date.day),
      expression: "date.day"
    }],
    attrs: {
      "type": "number",
      "min": "1",
      "max": "31"
    },
    domProps: {
      "value": (_vm.date.day)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.date.day = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.week))]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.date.week),
      expression: "date.week"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.date.week = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.Sun))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.Mon))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "2"
    }
  }, [_vm._v(_vm._s(_vm.Tue))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "3"
    }
  }, [_vm._v(_vm._s(_vm.Wed))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "4"
    }
  }, [_vm._v(_vm._s(_vm.Thu))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "5"
    }
  }, [_vm._v(_vm._s(_vm.Fri))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "6"
    }
  }, [_vm._v(_vm._s(_vm.Sat))])])]), _vm._v(" "), _c('div', {
    staticClass: "one wide field"
  }, [_c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": function($event) {
        _vm.getDeviceDate()
      }
    }
  }, [_vm._v(_vm._s(_vm.read))])]), _vm._v(" "), _c('div', {
    staticClass: "one wide field"
  }, [_c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": function($event) {
        _vm.clearData('date')
      }
    }
  }, [_vm._v(_vm._s(_vm.clear))])]), _vm._v(" "), _c('div', {
    staticClass: "one wide right"
  }, [_c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": function($event) {
        _vm.setDate()
      }
    }
  }, [_vm._v(_vm._s(_vm.setting))])])]), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "three wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.hour))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.time.hour),
      expression: "time.hour"
    }],
    attrs: {
      "type": "number",
      "min": "0",
      "max": "23"
    },
    domProps: {
      "value": (_vm.time.hour)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.time.hour = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.minute))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.time.minute),
      expression: "time.minute"
    }],
    attrs: {
      "type": "number",
      "min": "0",
      "max": "60"
    },
    domProps: {
      "value": (_vm.time.minute)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.time.minute = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.second))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.time.second),
      expression: "time.second"
    }],
    attrs: {
      "type": "number",
      "min": "0",
      "max": "60"
    },
    domProps: {
      "value": (_vm.time.second)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.time.second = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }), _vm._v(" "), _c('div', {
    staticClass: "one wide field"
  }, [_c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": function($event) {
        _vm.getDeviceTime()
      }
    }
  }, [_vm._v(_vm._s(_vm.read))])]), _vm._v(" "), _c('div', {
    staticClass: "one wide field"
  }, [_c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": function($event) {
        _vm.clearData('time')
      }
    }
  }, [_vm._v(_vm._s(_vm.clear))])]), _vm._v(" "), _c('div', {
    staticClass: "one wide right"
  }, [_c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": function($event) {
        _vm.setTime()
      }
    }
  }, [_vm._v(_vm._s(_vm.setting))])])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-3e60cb2c", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-46dbee50\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/device.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.devID) ? _c('div', {
    staticClass: "device"
  }, [_c('p', {
    staticStyle: {
      "margin": "5px auto 13px 10px",
      "font-weight": "700"
    }
  }, [_vm._v(_vm._s(_vm.L("设备信息", "iptalk")))]), _vm._v(" "), (_vm.devID.substring(0, 1) == '2' && _vm.devID.length == 8) ? _c('mikeinfo', {
    attrs: {
      "devID": _vm.devID,
      "treeId": _vm.treeId
    }
  }) : (_vm.devID.substring(0, 1) == '1' && _vm.devID.length == 8) ? _c('terminal', {
    attrs: {
      "devID": _vm.devID,
      "treeId": _vm.treeId
    }
  }) : (_vm.devID.substring(0, 1) == '4' && _vm.devID.length == 8) ? _c('gk680', {
    attrs: {
      "devID": _vm.devID,
      "treeId": _vm.treeId
    }
  }) : _c('ktspeaker', {
    attrs: {
      "devID": _vm.devID,
      "treeId": _vm.treeId
    }
  })], 1) : _vm._e()
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-46dbee50", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-4724d7c1\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/home.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "home"
  }, [_c('div', {
    staticClass: "left"
  }, [_c('div', {
    staticClass: "tree"
  }, [_c('tree', {
    directives: [{
      name: "ref",
      rawName: "v-ref:tree",
      arg: "tree"
    }],
    attrs: {
      "language": "en",
      "url": _vm.urls.getIptalkTreeChildrenByID,
      "id": _vm.treeId,
      "dimensions": _vm.dimensions,
      "not-open": _vm.L("没有子节点", "iptalk"),
      "addurl": _vm.urls.addIptalkTreeNode,
      "editurl": _vm.urls.editIptalkTreeNodeName,
      "deleteurl": _vm.urls.deleteIptalkTreeNode,
      "moveurl": _vm.urls.moveIptalkTreeNode
    },
    on: {
      "on-item-click": _vm.onItemClick,
      "before-item-click": _vm.beforeItemClick
    }
  })], 1)]), _vm._v(" "), _c('div', {
    staticClass: "right iptalkstyle"
  }, [(_vm.type === 1) ? _c('group', {
    attrs: {
      "id": _vm.groupID,
      "treeId": _vm.treeId
    }
  }) : _vm._e(), _vm._v(" "), (_vm.type === 4) ? _c('device', {
    attrs: {
      "devID": _vm.devID,
      "treeId": _vm.treeId
    }
  }) : _vm._e(), _vm._v(" "), (_vm.type === 8) ? _c('server', {
    attrs: {
      "id": _vm.serverID,
      "treeId": _vm.treeId
    }
  }) : _vm._e(), _vm._v(" "), (_vm.type === 1 || _vm.type === 8) ? _c('devicelist', {
    attrs: {
      "groupID": _vm.groupID,
      "type": _vm.type,
      "targetinfo": _vm.targetinfo
    }
  }) : _vm._e()], 1)])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-4724d7c1", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-489b5c38\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-video.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "terminal ui form"
  }, [_c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "five wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.videoResolution))]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.Resolution),
      expression: "item.Resolution"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.Resolution = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0*0"
    }
  }, [_vm._v(_vm._s(_vm.closeVideo))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "352*288"
    }
  }, [_vm._v("352*288")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "640*480"
    }
  }, [_vm._v("640*480")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "800*600"
    }
  }, [_vm._v("800*600")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1024*600"
    }
  }, [_vm._v("1024*600")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1024*720"
    }
  }, [_vm._v("1024*720")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1280*720"
    }
  }, [_vm._v("1280*720")])])]), _vm._v(" "), _c('div', {
    staticClass: "five wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.videoFramerate))]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.FrameRate),
      expression: "item.FrameRate"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.FrameRate = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, _vm._l((16), function(n) {
    return _c('option', {
      domProps: {
        "value": n - 1 + 10
      }
    }, [_vm._v(_vm._s(n - 1 + 10))])
  }))]), _vm._v(" "), _c('div', {
    staticClass: "five wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.videoCompressionRate))]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.Compression),
      expression: "item.Compression"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.Compression = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, _vm._l((15), function(n) {
    return _c('option', {
      domProps: {
        "value": n - 1 + 2
      }
    }, [_vm._v(_vm._s(n - 1 + 2))])
  }))])]), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "five wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.callVolume))]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.AudioPlayVolume),
      expression: "item.AudioPlayVolume"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.AudioPlayVolume = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, _vm._l((8), function(n) {
    return _c('option', {
      domProps: {
        "value": n - 1 + 1
      }
    }, [_vm._v(_vm._s(n - 1 + 1))])
  }))]), _vm._v(" "), _c('div', {
    staticClass: "five wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.ringVolume))]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.AudioRecordVolume),
      expression: "item.AudioRecordVolume"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.AudioRecordVolume = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, _vm._l((4), function(n) {
    return _c('option', {
      domProps: {
        "value": n - 1
      }
    }, [_vm._v(_vm._s(n - 1))])
  }))]), _vm._v(" "), _c('div', {
    staticClass: "five wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.audioCoding))]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.AudioEncode),
      expression: "item.AudioEncode"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.AudioEncode = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v("PCM")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v("SILK")])])])]), _vm._v(" "), _c('div', {
    staticClass: "right"
  }, [_c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": _vm.submit
    }
  }, [_vm._v(_vm._s(_vm.setting))])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-489b5c38", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-6118dcba\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-alarm.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "terminal ui form"
  }, [_c('div', {
    staticClass: "inline fields"
  }, [_vm._m(0), _vm._v(" "), _vm._m(1), _vm._v(" "), _c('div', {
    staticClass: "two wide field"
  }, [_c('label', {
    staticClass: "center"
  }, [_vm._v(_vm._s(_vm.startTime))])]), _vm._v(" "), _vm._m(2), _vm._v(" "), _c('div', {
    staticClass: "two wide field"
  }, [_c('label', {
    staticClass: "center"
  }, [_vm._v(_vm._s(_vm.endTime))])]), _vm._v(" "), _vm._m(3), _vm._v(" "), _c('div', {
    staticClass: "two wide field"
  }, [_c('label', {
    staticClass: "center"
  }, [_vm._v(_vm._s(_vm.protection))])]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('label', {
    staticClass: "center"
  }, [_vm._v(_vm._s(_vm.alarmDelay))])])]), _vm._v(" "), _vm._l((_vm.items), function(item, index) {
    return _c('div', {
      staticClass: "inline fields"
    }, [_c('div', {
      staticClass: "one wide field"
    }, [_c('label', [_vm._v(_vm._s(_vm.output) + _vm._s(index + 1))])]), _vm._v(" "), _c('div', {
      staticClass: "two wide field"
    }, [_c('select', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (item.SetFlag),
        expression: "item.SetFlag"
      }],
      on: {
        "change": function($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
            return o.selected
          }).map(function(o) {
            var val = "_value" in o ? o._value : o.value;
            return val
          });
          item.SetFlag = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
        }
      }
    }, [_c('option', {
      attrs: {
        "value": "0"
      }
    }, [_vm._v(_vm._s(_vm.disable))]), _vm._v(" "), _c('option', {
      attrs: {
        "value": "1"
      }
    }, [_vm._v(_vm._s(_vm.enable))])])]), _vm._v(" "), (item.SetFlag == 1) ? [_c('div', {
      staticClass: "two wide field"
    }, [_c('select', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (item.StarTimeHour),
        expression: "item.StarTimeHour"
      }],
      on: {
        "change": function($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
            return o.selected
          }).map(function(o) {
            var val = "_value" in o ? o._value : o.value;
            return val
          });
          item.StarTimeHour = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
        }
      }
    }, _vm._l((24), function(n) {
      return _c('option', {
        domProps: {
          "value": n - 1
        }
      }, [_vm._v(_vm._s(n - 1))])
    })), _vm._v(" "), _c('label', {
      staticClass: "short"
    }, [_vm._v(_vm._s(_vm.hours))])]), _vm._v(" "), _c('div', {
      staticClass: "two wide field"
    }, [_c('select', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (item.StarTimeMinute),
        expression: "item.StarTimeMinute"
      }],
      on: {
        "change": function($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
            return o.selected
          }).map(function(o) {
            var val = "_value" in o ? o._value : o.value;
            return val
          });
          item.StarTimeMinute = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
        }
      }
    }, _vm._l((60), function(n) {
      return _c('option', {
        domProps: {
          "value": n - 1
        }
      }, [_vm._v(_vm._s(n - 1))])
    })), _vm._v(" "), _c('label', {
      staticClass: "short"
    }, [_vm._v(_vm._s(_vm.minutes))])]), _vm._v(" "), _c('div', {
      staticClass: "two wide field"
    }, [_c('select', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (item.EndTimeHour),
        expression: "item.EndTimeHour"
      }],
      on: {
        "change": function($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
            return o.selected
          }).map(function(o) {
            var val = "_value" in o ? o._value : o.value;
            return val
          });
          item.EndTimeHour = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
        }
      }
    }, _vm._l((24), function(n) {
      return _c('option', {
        domProps: {
          "value": n - 1
        }
      }, [_vm._v(_vm._s(n - 1))])
    })), _vm._v(" "), _c('label', {
      staticClass: "short"
    }, [_vm._v(_vm._s(_vm.hours))])]), _vm._v(" "), _c('div', {
      staticClass: "two wide field"
    }, [_c('select', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (item.EndTimeMinute),
        expression: "item.EndTimeMinute"
      }],
      on: {
        "change": function($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
            return o.selected
          }).map(function(o) {
            var val = "_value" in o ? o._value : o.value;
            return val
          });
          item.EndTimeMinute = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
        }
      }
    }, _vm._l((60), function(n) {
      return _c('option', {
        domProps: {
          "value": n - 1
        }
      }, [_vm._v(_vm._s(n - 1))])
    })), _vm._v(" "), _c('label', {
      staticClass: "short"
    }, [_vm._v(_vm._s(_vm.minutes))])]), _vm._v(" "), _c('div', {
      staticClass: "two wide field"
    }, [_c('select', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (item.OnOff),
        expression: "item.OnOff"
      }],
      on: {
        "change": function($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
            return o.selected
          }).map(function(o) {
            var val = "_value" in o ? o._value : o.value;
            return val
          });
          item.OnOff = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
        }
      }
    }, [_c('option', {
      attrs: {
        "value": "0"
      }
    }, [_vm._v(_vm._s(_vm.open))]), _vm._v(" "), _c('option', {
      attrs: {
        "value": "1"
      }
    }, [_vm._v(_vm._s(_vm.close))])])]), _vm._v(" "), _c('div', {
      staticClass: "three wide field"
    }, [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (item.TrigerDelay),
        expression: "item.TrigerDelay"
      }],
      attrs: {
        "type": "text"
      },
      domProps: {
        "value": (item.TrigerDelay)
      },
      on: {
        "input": function($event) {
          if ($event.target.composing) { return; }
          item.TrigerDelay = $event.target.value
        }
      }
    }), _vm._v(" "), _c('label', {
      staticClass: "short"
    }, [_vm._v(_vm._s(_vm.seconds))])])] : _vm._e()], 2)
  }), _vm._v(" "), _c('div', {
    staticClass: "right"
  }, [_c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": _vm.submit
    }
  }, [_vm._v(_vm._s(_vm.setting))])])], 2)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "one wide field"
  }, [_c('label')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "two wide field"
  }, [_c('label', {
    staticClass: "center"
  })])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "two wide field"
  }, [_c('label')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "two wide field"
  }, [_c('label')])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-6118dcba", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-6ac4ef76\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-alarmstatus.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "gk680 ui form"
  }, [_c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "five wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.alarmInterval))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.alarmIntv),
      expression: "alarmIntv"
    }],
    attrs: {
      "type": "number",
      "min": "1",
      "max": "255"
    },
    domProps: {
      "value": (_vm.alarmIntv)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.alarmIntv = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": function($event) {
        _vm.setAlarmIntv()
      }
    }
  }, [_vm._v(_vm._s(_vm.setting))])])]), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "five wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.driveAssistTime))]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.assistNO),
      expression: "assistNO"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.assistNO = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "",
      "disabled": "",
      "selected": ""
    }
  }, [_vm._v(_vm._s(_vm.Label))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.all))]), _vm._v(" "), _vm._l((8), function(i) {
    return _c('option', {
      domProps: {
        "value": i
      }
    }, [_vm._v(_vm._s(i))])
  })], 2)]), _vm._v(" "), _c('div', {
    staticClass: "two wide field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.driveAssistT),
      expression: "driveAssistT"
    }],
    attrs: {
      "type": "number",
      "min": "1",
      "max": "65535"
    },
    domProps: {
      "value": (_vm.driveAssistT)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.driveAssistT = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "three wide field"
  }, [_c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": function($event) {
        _vm.setDriveAssistT()
      }
    }
  }, [_vm._v(_vm._s(_vm.setting))])])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-6ac4ef76", module.exports)
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

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-96264eca\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/mike-info.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "mike ui styled fluid accordion"
  }, [(_vm.item.State != _vm.undefiend) ? _c('div', {
    staticClass: "top"
  }, [(_vm.item.State == 0) ? _c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": _vm.enable
    }
  }, [_vm._v(_vm._s(_vm.enableDevice))]) : _c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": _vm.disable
    }
  }, [_vm._v(_vm._s(_vm.disableDevice))]), _vm._v(" "), _c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": _vm.synchronized
    }
  }, [_vm._v(_vm._s(_vm.synchronizeDevice))])]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "active title"
  }, [_c('i', {
    staticClass: "dropdown icon"
  }), _vm._v("\n\t\t" + _vm._s(_vm.basicInformation) + "\n\t")]), _vm._v(" "), _c('div', {
    staticClass: "active content"
  }, [_c('div', {
    staticClass: "mike ui form"
  }, [_c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.deviceID))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.DevID),
      expression: "item.DevID"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.DevID)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.DevID = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.deviceName))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.Alias),
      expression: "item.Alias"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.Alias)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.Alias = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.ipAddress))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.DevIP),
      expression: "item.DevIP"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.DevIP)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.DevIP = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.state))]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.State),
      expression: "item.State"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.State = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.unregistered))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.disconnect))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "2"
    }
  }, [_vm._v(_vm._s(_vm.free))])])])]), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.subnetMask))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.DevMASK),
      expression: "item.DevMASK"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.DevMASK)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.DevMASK = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.gateway))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.DevGW),
      expression: "item.DevGW"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.DevGW)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.DevGW = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.DNS))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.DNS),
      expression: "item.DNS"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.DNS)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.DNS = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.serverIp))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.SvrIP),
      expression: "item.SvrIP"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.SvrIP)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.SvrIP = $event.target.value
      }
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.superiorAddress))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.SvrUpper),
      expression: "item.SvrUpper"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.SvrUpper)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.SvrUpper = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.macAddress))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.MacAddr),
      expression: "item.MacAddr"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.MacAddr)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.MacAddr = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.audioPort))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.AudioPort),
      expression: "item.AudioPort"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.AudioPort)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.AudioPort = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.videoPort))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.VideoPort),
      expression: "item.VideoPort"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.VideoPort)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.VideoPort = $event.target.value
      }
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.output) + "1")]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.shortOut1def),
      expression: "item.shortOut1def"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.shortOut1def = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.none))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.output) + "1")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "2"
    }
  }, [_vm._v(_vm._s(_vm.output) + "2")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "3"
    }
  }, [_vm._v(_vm._s(_vm.output) + "3")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "4"
    }
  }, [_vm._v(_vm._s(_vm.output) + "4")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "5"
    }
  }, [_vm._v(_vm._s(_vm.callPrompt))])])]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.output) + "2")]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.shortOut2def),
      expression: "item.shortOut2def"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.shortOut2def = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.none))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.output) + "1")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "2"
    }
  }, [_vm._v(_vm._s(_vm.output) + "2")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "3"
    }
  }, [_vm._v(_vm._s(_vm.output) + "3")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "4"
    }
  }, [_vm._v(_vm._s(_vm.output) + "4")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "5"
    }
  }, [_vm._v(_vm._s(_vm.callPrompt))])])]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.priorityLevel))]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.priority),
      expression: "item.priority"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.priority = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.lv1))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.lv2))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "2"
    }
  }, [_vm._v(_vm._s(_vm.lv3))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "3"
    }
  }, [_vm._v(_vm._s(_vm.lv4))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "4"
    }
  }, [_vm._v(_vm._s(_vm.lv5))])])]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.isRecord))]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.RecordOnOff),
      expression: "item.RecordOnOff"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.RecordOnOff = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.yes))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.no))])])])]), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.updateWay))]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.SetParam2),
      expression: "item.SetParam2"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.SetParam2 = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.manual))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.auto))])])]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.controlType))]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.SetParam3),
      expression: "item.SetParam3"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.SetParam3 = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.initiative))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.restrict))])])])]), _vm._v(" "), _c('div', {
    staticClass: "right"
  }, [_c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": _vm.submit
    }
  }, [_vm._v(_vm._s(_vm.setting))])])])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-96264eca", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-9e0f21c2\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-assistrelate.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "gk680 ui form"
  }, _vm._l((_vm.assist), function(value, key, index) {
    return _c('div', {
      staticClass: "inline fields"
    }, [_c('div', {
      staticClass: "twelve wide field"
    }, [_c('label', [_vm._v(_vm._s(value))]), _vm._v(" "), _c('select', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (_vm.relate[index]),
        expression: "relate[index]"
      }],
      staticClass: "ui fluid dropdown relate",
      class: key,
      attrs: {
        "multiple": ""
      },
      on: {
        "change": function($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
            return o.selected
          }).map(function(o) {
            var val = "_value" in o ? o._value : o.value;
            return val
          });
          _vm.$set(_vm.relate, index, $event.target.multiple ? $$selectedVal : $$selectedVal[0])
        }
      }
    }, _vm._l((_vm.arealist), function(area) {
      return _c('option', {
        domProps: {
          "value": area.value
        }
      }, [_vm._v(_vm._s(area.text))])
    }))]), _vm._v(" "), _c('div', {
      staticClass: "one wide field"
    }, [_c('button', {
      staticClass: "ui button blue right",
      on: {
        "click": function($event) {
          _vm.getAssistRelate(index + 1)
        }
      }
    }, [_vm._v(_vm._s(_vm.read))])]), _vm._v(" "), _c('div', {
      staticClass: "one wide field"
    }, [_c('button', {
      staticClass: "ui button blue right",
      class: key
    }, [_vm._v(_vm._s(_vm.clear))])]), _vm._v(" "), _c('div', {
      staticClass: "one wide right"
    }, [_c('button', {
      staticClass: "ui button blue right",
      on: {
        "click": function($event) {
          _vm.setAssistRelate(index + 1, _vm.relate[index])
        }
      }
    }, [_vm._v(_vm._s(_vm.setting))])])])
  }))
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-9e0f21c2", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-a80ffc56\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-info.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "terminal ui form"
  }, [_c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.deviceID))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.DevID),
      expression: "item.DevID"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.DevID)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.DevID = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.deviceName))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.Alias),
      expression: "item.Alias"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.Alias)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.Alias = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.ipAddress))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.DevIP),
      expression: "item.DevIP"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.DevIP)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.DevIP = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.state))]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.State),
      expression: "item.State"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.State = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.unregistered))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.disconnect))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "2"
    }
  }, [_vm._v(_vm._s(_vm.free))])])])]), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.subnetMask))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.DevMASK),
      expression: "item.DevMASK"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.DevMASK)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.DevMASK = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.gateway))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.DevGW),
      expression: "item.DevGW"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.DevGW)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.DevGW = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.DNS))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.DNS),
      expression: "item.DNS"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.DNS)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.DNS = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.serverIp))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.SvrIP),
      expression: "item.SvrIP"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.SvrIP)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.SvrIP = $event.target.value
      }
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.macAddress))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.MacAddr),
      expression: "item.MacAddr"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.MacAddr)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.MacAddr = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.audioPort))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.AudioPort),
      expression: "item.AudioPort"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.AudioPort)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.AudioPort = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.videoPort))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.VideoPort),
      expression: "item.VideoPort"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.VideoPort)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.VideoPort = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.alarmTime))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.SetParam1),
      expression: "item.SetParam1"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.item.SetParam1)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.SetParam1 = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', [_vm._v(_vm._s(_vm.minutes))])])]), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.output) + "1")]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.shortOut1def),
      expression: "item.shortOut1def"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.shortOut1def = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.none))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.output) + "1")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "2"
    }
  }, [_vm._v(_vm._s(_vm.output) + "2")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "3"
    }
  }, [_vm._v(_vm._s(_vm.output) + "3")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "4"
    }
  }, [_vm._v(_vm._s(_vm.output) + "4")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "5"
    }
  }, [_vm._v(_vm._s(_vm.callPrompt))])])]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.output) + "2")]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.shortOut2def),
      expression: "item.shortOut2def"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.shortOut2def = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.none))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.output) + "1")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "2"
    }
  }, [_vm._v(_vm._s(_vm.output) + "2")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "3"
    }
  }, [_vm._v(_vm._s(_vm.output) + "3")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "4"
    }
  }, [_vm._v(_vm._s(_vm.output) + "4")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "5"
    }
  }, [_vm._v(_vm._s(_vm.callPrompt))])])]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.priorityLevel))]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.priority),
      expression: "item.priority"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.priority = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.lv1))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.lv2))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "2"
    }
  }, [_vm._v(_vm._s(_vm.lv3))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "3"
    }
  }, [_vm._v(_vm._s(_vm.lv4))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "4"
    }
  }, [_vm._v(_vm._s(_vm.lv5))])])]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.isRecord))]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.RecordOnOff),
      expression: "item.RecordOnOff"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.RecordOnOff = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.yes))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.no))])])])]), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.updateWay))]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.SetParam2),
      expression: "item.SetParam2"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.SetParam2 = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.manual))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.auto))])])])]), _vm._v(" "), _c('div', {
    staticClass: "right"
  }, [_c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": _vm.submit
    }
  }, [_vm._v(_vm._s(_vm.setting))])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-a80ffc56", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-a9127e86\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/server.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "server"
  }, [_c('p', {
    staticStyle: {
      "margin": "5px auto 0 10px",
      "font-weight": "700"
    }
  }, [_vm._v(_vm._s(_vm.serverInfo))]), _vm._v(" "), _c('div', {
    staticClass: "ui divider"
  }), _vm._v(" "), _c('div', {
    staticClass: "ui input"
  }, [_c('div', {
    staticClass: "subject"
  }, [_vm._v(_vm._s(_vm.serverId))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.targetInfo),
      expression: "item.targetInfo"
    }],
    staticClass: "writeIn",
    attrs: {
      "type": "text",
      "maxlength": "32"
    },
    domProps: {
      "value": (_vm.item.targetInfo)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.targetInfo = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "ui input"
  }, [_c('div', {
    staticClass: "subject"
  }, [_vm._v(_vm._s(_vm.serverName))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.name),
      expression: "item.name"
    }],
    staticClass: "writeIn",
    attrs: {
      "type": "text",
      "maxlength": "32"
    },
    domProps: {
      "value": (_vm.item.name)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.name = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('button', {
    staticClass: "ui button blue",
    on: {
      "click": _vm.commit
    }
  }, [_vm._v(_vm._s(_vm.commit1))])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-a9127e86", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-af58f616\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/group.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "group"
  }, [_c('p', {
    staticStyle: {
      "margin": "5px auto 0 10px",
      "font-weight": "700"
    }
  }, [_vm._v(_vm._s(_vm.groupInfo))]), _vm._v(" "), _c('div', {
    staticClass: "ui divider"
  }), _vm._v(" "), _c('div', {
    staticClass: "ui input"
  }, [_c('div', {
    staticClass: "subject"
  }, [_vm._v(_vm._s(_vm.groupName))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.name),
      expression: "item.name"
    }],
    staticClass: "writeIn",
    attrs: {
      "type": "text",
      "maxlength": "32"
    },
    domProps: {
      "value": (_vm.item.name)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.name = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "ui input"
  }, [_c('div', {
    staticClass: "subject"
  }, [_vm._v(_vm._s(_vm.groupStrategy))]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.strategy),
      expression: "item.strategy"
    }],
    staticClass: "ui compact selection dropdown",
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.strategy = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.normal))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.callAll))])])]), _vm._v(" "), _c('button', {
    staticClass: "ui button blue",
    on: {
      "click": _vm.commit
    }
  }, [_vm._v(_vm._s(_vm.commit1))])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-af58f616", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-c36ac980\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "gk680 ui styled fluid accordion"
  }, [(_vm.info.State != _vm.undefiend) ? _c('div', {
    staticClass: "top"
  }, [_c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": _vm.synchronized
    }
  }, [_vm._v(_vm._s(_vm.synchronizeDevice))])]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "active title"
  }, [_c('i', {
    staticClass: "dropdown icon"
  }), _vm._v("\n\t\t" + _vm._s(_vm.basicInformation) + "\n\t")]), _vm._v(" "), _c('div', {
    staticClass: "active content"
  }, [_c('div', {
    staticClass: "gk680 ui form"
  }, [_c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.deviceID))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.info.DevID),
      expression: "info.DevID"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.info.DevID)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.info.DevID = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.deviceName))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.info.Alias),
      expression: "info.Alias"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.info.Alias)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.info.Alias = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.ipAddress))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.info.DevIP),
      expression: "info.DevIP"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.info.DevIP)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.info.DevIP = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.state))]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.info.State),
      expression: "info.State"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.info.State = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "-1"
    }
  }, [_vm._v(_vm._s(_vm.disconnect))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.free))])])])]), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "four wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.serverIp))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.info.SvrIP),
      expression: "info.SvrIP"
    }],
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.info.SvrIP)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.info.SvrIP = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "twelve wide field"
  }, [_c('div', {
    staticClass: "right",
    staticStyle: {
      "width": "100%"
    }
  }, [_c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": _vm.submit
    }
  }, [_vm._v(_vm._s(_vm.setting))])])])]), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "two wide field",
    staticStyle: {
      "padding": "10px"
    }
  }, [_c('button', {
    staticClass: "ui mini button",
    on: {
      "click": function($event) {
        _vm.ondefense()
      }
    }
  }, [_vm._v(_vm._s(_vm.L("一键布防", "iptalk")))])]), _vm._v(" "), _c('div', {
    staticClass: "two wide field"
  }, [_c('button', {
    staticClass: "ui mini button",
    on: {
      "click": function($event) {
        _vm.undefense()
      }
    }
  }, [_vm._v(_vm._s(_vm.L("一键撤防", "iptalk")))])]), _vm._v(" "), _c('div', {
    staticClass: "seven wide field"
  }, [_c('label', {
    staticStyle: {
      "min-width": "auto"
    }
  }, [_vm._v(_vm._s(_vm.areaAddr))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.addrValue),
      expression: "addrValue"
    }],
    staticStyle: {
      "width": "6em",
      "margin-right": "2em"
    },
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.addrValue)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.addrValue = $event.target.value
      }
    }
  }), _vm._v(" "), _c('button', {
    staticClass: "ui mini button",
    on: {
      "click": function($event) {
        _vm.setAreaAddr()
      }
    }
  }, [_vm._v(_vm._s(_vm.L("区域设置", "iptalk")))])])])])]), _vm._v(" "), _c('div', {
    staticClass: "title"
  }, [_c('i', {
    staticClass: "dropdown icon"
  }), _vm._v("\n\t\t" + _vm._s(_vm.alarmTypeInfo) + "\n\t")]), _vm._v(" "), _c('div', {
    staticClass: "content"
  }, [_c('gk680alarmtype', {
    attrs: {
      "item": _vm.alarmType,
      "devID": _vm.devID,
      "ip": _vm.info.DevIP
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "title"
  }, [_c('i', {
    staticClass: "dropdown icon"
  }), _vm._v("\n\t\t" + _vm._s(_vm.autoDefence) + "\n\t")]), _vm._v(" "), _c('div', {
    staticClass: "content"
  }, [_c('gk680autodefence', {
    attrs: {
      "item": _vm.defenceInSomeTime,
      "devID": _vm.devID,
      "ip": _vm.info.DevIP
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "title"
  }, [_c('i', {
    staticClass: "dropdown icon"
  }), _vm._v("\n\t\t" + _vm._s(_vm.dateAndTime) + "\n\t")]), _vm._v(" "), _c('div', {
    staticClass: "content"
  }, [_c('gk680time', {
    attrs: {
      "devID": _vm.devID,
      "ip": _vm.info.DevIP
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "title"
  }, [_c('i', {
    staticClass: "dropdown icon"
  }), _vm._v("\n\t\t" + _vm._s(_vm.assistCtrl) + "\n\t")]), _vm._v(" "), _c('div', {
    staticClass: "content"
  }, [_c('gk680assistctrl', {
    attrs: {
      "devID": _vm.devID,
      "ip": _vm.info.DevIP
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "title"
  }, [_c('i', {
    staticClass: "dropdown icon"
  }), _vm._v("\n\t\t" + _vm._s(_vm.assistRelate) + "\n\t")]), _vm._v(" "), _c('div', {
    staticClass: "content"
  }, [_c('gk680assistrelate', {
    attrs: {
      "devID": _vm.devID,
      "ip": _vm.info.DevIP
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "title"
  }, [_c('i', {
    staticClass: "dropdown icon"
  }), _vm._v("\n\t\t" + _vm._s(_vm.alarmSet) + "\n\t")]), _vm._v(" "), _c('div', {
    staticClass: "content"
  }, [_c('gk680alarmstatus', {
    attrs: {
      "devID": _vm.devID,
      "ip": _vm.info.DevIP
    }
  })], 1)])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-c36ac980", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-c74d6214\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "terminal ui styled fluid accordion"
  }, [(_vm.info.State != _vm.undefiend) ? _c('div', {
    staticClass: "top"
  }, [(_vm.info.State == 0) ? _c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": _vm.enable
    }
  }, [_vm._v(_vm._s(_vm.enableDevice))]) : _c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": _vm.disable
    }
  }, [_vm._v(_vm._s(_vm.disableDevice))]), _vm._v(" "), _c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": _vm.synchronized
    }
  }, [_vm._v(_vm._s(_vm.synchronizeDevice))])]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "active title"
  }, [_c('i', {
    staticClass: "dropdown icon"
  }), _vm._v("\n\t\t" + _vm._s(_vm.basicInformation) + "\n\t")]), _vm._v(" "), _c('div', {
    staticClass: "active content"
  }, [_c('terminalinfo', {
    attrs: {
      "item": _vm.info,
      "devID": _vm.devID,
      "treeId": _vm.treeId
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "title"
  }, [_c('i', {
    staticClass: "dropdown icon"
  }), _vm._v("\n\t\t" + _vm._s(_vm.panelSetting) + "\n\t")]), _vm._v(" "), _c('div', {
    staticClass: "content"
  }, [_c('terminalpanel', {
    attrs: {
      "item": _vm.panel,
      "devID": _vm.devID
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "title"
  }, [_c('i', {
    staticClass: "dropdown icon"
  }), _vm._v("\n\t\t" + _vm._s(_vm.IOSetting) + "\n\t")]), _vm._v(" "), _c('div', {
    staticClass: "content"
  }, [_c('terminalio', {
    attrs: {
      "item": _vm.io,
      "types": _vm.feedBackTypes,
      "devID": _vm.devID
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "title"
  }, [_c('i', {
    staticClass: "dropdown icon"
  }), _vm._v("\n\t\t" + _vm._s(_vm.VideoSetting) + "\n\t")]), _vm._v(" "), _c('div', {
    staticClass: "content"
  }, [_c('terminalvideo', {
    attrs: {
      "item": _vm.video,
      "devID": _vm.devID
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "title"
  }, [_c('i', {
    staticClass: "dropdown icon"
  }), _vm._v("\n\t\t" + _vm._s(_vm.alarmSetting) + "\n\t")]), _vm._v(" "), _c('div', {
    staticClass: "content"
  }, [_c('terminalalarm', {
    attrs: {
      "items": _vm.alarm,
      "devID": _vm.devID
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "title"
  }, [_c('i', {
    staticClass: "dropdown icon"
  }), _vm._v("\n\t\t" + _vm._s(_vm.ledSetting) + "\n\t")]), _vm._v(" "), _c('div', {
    staticClass: "content"
  }, [_c('terminalled', {
    attrs: {
      "item": _vm.led,
      "devID": _vm.devID
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "title"
  }, [_c('i', {
    staticClass: "dropdown icon"
  }), _vm._v("\n\t\t" + _vm._s(_vm.ipcSetting) + "\n\t")]), _vm._v(" "), _c('div', {
    staticClass: "content"
  }, [_c('terminalipc', {
    attrs: {
      "item": _vm.ipc,
      "devID": _vm.devID
    }
  })], 1)])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-c74d6214", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-e72f1098\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-led.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "terminal ui form"
  }, [_c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "five wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.showMode))]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.ShowMode),
      expression: "item.ShowMode"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.ShowMode = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.L("文字模式", "iptalk")))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.L("时间模式", "iptalk")))])])]), _vm._v(" "), _c('div', {
    staticClass: "five wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.screenColor))]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.ScreenColor),
      expression: "item.ScreenColor"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.ScreenColor = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "00"
    }
  }, [_vm._v(_vm._s(_vm.L("红色", "iptalk")))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "01"
    }
  }, [_vm._v(_vm._s(_vm.L("绿色", "iptalk")))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "02"
    }
  }, [_vm._v(_vm._s(_vm.L("黄色", "iptalk")))])])]), _vm._v(" "), _c('div', {
    staticClass: "five wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.showType))]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.ShowType),
      expression: "item.ShowType"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.ShowType = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.L("连续左移", "iptalk")))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.L("连续上移", "iptalk")))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "2"
    }
  }, [_vm._v(_vm._s(_vm.L("左拉暮", "iptalk")))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "3"
    }
  }, [_vm._v(_vm._s(_vm.L("立即打出", "iptalk")))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "4"
    }
  }, [_vm._v(_vm._s(_vm.L("闪烁显示", "iptalk")))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "5"
    }
  }, [_vm._v(_vm._s(_vm.L("连续下移", "iptalk")))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "6"
    }
  }, [_vm._v(_vm._s(_vm.L("连续右移", "iptalk")))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "7"
    }
  }, [_vm._v(_vm._s(_vm.L("右拉暮", "iptalk")))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "FF"
    }
  }, [_vm._v(_vm._s(_vm.L("结束行", "iptalk")))])])])]), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "five wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.runSpeed))]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.RunSpeed),
      expression: "item.RunSpeed"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.RunSpeed = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.L("1(最快)", "iptalk")))]), _vm._v(" "), _vm._l((31), function(i) {
    return _c('option', {
      domProps: {
        "value": i
      }
    }, [_vm._v(_vm._s(i + 1))])
  })], 2)]), _vm._v(" "), _c('div', {
    staticClass: "five wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.stayTime))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.StayTime),
      expression: "item.StayTime"
    }],
    attrs: {
      "type": "number",
      "id": "myNumber",
      "min": "0"
    },
    domProps: {
      "value": (_vm.item.StayTime)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.StayTime = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "five wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.displayNum))]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.DisplayNum),
      expression: "item.DisplayNum"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.DisplayNum = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "4"
    }
  }, [_vm._v("4")]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "6"
    }
  }, [_vm._v("6")])])])]), _vm._v(" "), _c('div', {
    staticClass: "inline fields"
  }, [_c('div', {
    staticClass: "five wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.scrollMode))]), _vm._v(" "), _c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.ScrollMode),
      expression: "item.ScrollMode"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.item.ScrollMode = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v(_vm._s(_vm.L("默认", "iptalk")))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "1"
    }
  }, [_vm._v(_vm._s(_vm.L("上行静止，下行移动", "iptalk")))]), _vm._v(" "), _c('option', {
    attrs: {
      "value": "2"
    }
  }, [_vm._v(_vm._s(_vm.L("上行移动，下行静止", "iptalk")))])])]), _vm._v(" "), _c('div', {
    staticClass: "two wide field"
  }, [_c('button', {
    staticClass: "ui mini button",
    on: {
      "click": function($event) {
        _vm.setScrollMode()
      }
    }
  }, [_vm._v(_vm._s(_vm.L("设置", "iptalk")))])]), _vm._v(" "), _c('div', {
    staticClass: "eight wide field"
  }, [_c('label', [_vm._v(_vm._s(_vm.displayText))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.item.DisplayText),
      expression: "item.DisplayText"
    }],
    domProps: {
      "value": (_vm.item.DisplayText)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.item.DisplayText = $event.target.value
      }
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "right"
  }, [_c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": function($event) {
        _vm.setsaveInfo()
      }
    }
  }, [_vm._v(_vm._s(_vm.saveInfo))]), _vm._v(" "), _c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": function($event) {
        _vm.setsyncTime()
      }
    }
  }, [_vm._v(_vm._s(_vm.syncTime))]), _vm._v(" "), _c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": function($event) {
        _vm.setsendText()
      }
    }
  }, [_vm._v(_vm._s(_vm.sendText))])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-e72f1098", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-f1e85a98\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-autodefence.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "gk680 ui form"
  }, [_vm._l((_vm.item), function(value, key) {
    return _c('div', {
      staticClass: "inline fields"
    }, [_c('div', {
      staticClass: "three wide field"
    }, [_c('label', [_vm._v(_vm._s(_vm.periodType))]), _vm._v(" "), _c('select', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (value.period),
        expression: "value.period"
      }],
      on: {
        "change": function($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
            return o.selected
          }).map(function(o) {
            var val = "_value" in o ? o._value : o.value;
            return val
          });
          value.period = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
        }
      }
    }, _vm._l((_vm.period), function(i) {
      return _c('option', {
        domProps: {
          "value": i
        }
      }, [_vm._v(_vm._s(i))])
    }))]), _vm._v(" "), _c('div', {
      staticClass: "three wide field"
    }, [_c('label', [_vm._v(_vm._s(_vm.defenceType))]), _vm._v(" "), _c('select', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (value.defencetype),
        expression: "value.defencetype"
      }],
      on: {
        "change": function($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
            return o.selected
          }).map(function(o) {
            var val = "_value" in o ? o._value : o.value;
            return val
          });
          value.defencetype = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
        }
      }
    }, [_c('option', {
      attrs: {
        "value": "0"
      }
    }, [_vm._v(_vm._s(_vm.undefence))]), _vm._v(" "), _c('option', {
      attrs: {
        "value": "1"
      }
    }, [_vm._v(_vm._s(_vm.defence))])])]), _vm._v(" "), _c('div', {
      staticClass: "three wide field"
    }, [_c('label', [_vm._v(_vm._s(_vm.week))]), _vm._v(" "), _c('select', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (value.week),
        expression: "value.week"
      }],
      on: {
        "change": function($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
            return o.selected
          }).map(function(o) {
            var val = "_value" in o ? o._value : o.value;
            return val
          });
          value.week = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
        }
      }
    }, _vm._l((_vm.weekday), function(day) {
      return _c('option', {
        domProps: {
          "value": day.value
        }
      }, [_vm._v(_vm._s(day.text))])
    }))]), _vm._v(" "), _c('div', {
      staticClass: "three wide field"
    }, [_c('label', [_vm._v(_vm._s(_vm.hour))]), _vm._v(" "), _c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (value.hour),
        expression: "value.hour"
      }],
      attrs: {
        "type": "number",
        "id": "myNumber",
        "min": "0",
        "max": "24"
      },
      domProps: {
        "value": (value.hour)
      },
      on: {
        "input": function($event) {
          if ($event.target.composing) { return; }
          value.hour = $event.target.value
        }
      }
    })]), _vm._v(" "), _c('div', {
      staticClass: "three wide field"
    }, [_c('label', [_vm._v(_vm._s(_vm.min))]), _vm._v(" "), _c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (value.min),
        expression: "value.min"
      }],
      attrs: {
        "type": "number",
        "id": "myNumber",
        "min": "0",
        "max": "60"
      },
      domProps: {
        "value": (value.min)
      },
      on: {
        "input": function($event) {
          if ($event.target.composing) { return; }
          value.min = $event.target.value
        }
      }
    })]), _vm._v(" "), _c('div', {
      staticClass: "one wide right"
    }, [_c('button', {
      staticClass: "ui button blue right",
      on: {
        "click": function($event) {
          _vm.autoDefenceClear(key)
        }
      }
    }, [_vm._v(_vm._s(_vm.clear))])])])
  }), _vm._v(" "), _c('div', {
    staticClass: "one wide right"
  }, [_c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": _vm.autoDefenceSubmit
    }
  }, [_vm._v(_vm._s(_vm.setting))])])], 2)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-f1e85a98", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-f92cc69e\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-assistctrl.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "gk680 ui form"
  }, [_vm._l((_vm.assist), function(value, key, index) {
    return _c('div', {
      staticClass: "inline fields"
    }, [_c('div', {
      staticClass: "ten wide field"
    }, [_c('label', [_vm._v(_vm._s(value))]), _vm._v(" "), _c('select', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (_vm.ctrl[key]),
        expression: "ctrl[key]"
      }],
      on: {
        "change": function($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
            return o.selected
          }).map(function(o) {
            var val = "_value" in o ? o._value : o.value;
            return val
          });
          _vm.$set(_vm.ctrl, key, $event.target.multiple ? $$selectedVal : $$selectedVal[0])
        }
      }
    }, [_c('option', {
      attrs: {
        "value": "0"
      }
    }, [_vm._v(_vm._s(_vm.disconnect))]), _vm._v(" "), _c('option', {
      attrs: {
        "value": "1"
      }
    }, [_vm._v(_vm._s(_vm.connect))])])]), _vm._v(" "), _c('div', {
      staticClass: "one wide field"
    }, [_c('button', {
      staticClass: "ui button blue right",
      on: {
        "click": function($event) {
          _vm.clearDataCtrl(key)
        }
      }
    }, [_vm._v(_vm._s(_vm.clear))])]), _vm._v(" "), _c('div', {
      staticClass: "one wide right"
    }, [_c('button', {
      staticClass: "ui button blue right",
      on: {
        "click": function($event) {
          _vm.setAssistCtrl(( _obj = {}, _obj[key] = _vm.ctrl[key], _obj ))
          var _obj;
        }
      }
    }, [_vm._v(_vm._s(_vm.setting))])])])
  }), _vm._v(" "), _c('div', {
    staticClass: "right"
  }, [_c('button', {
    staticClass: "ui button blue right",
    on: {
      "click": _vm.getAssistCtrl
    }
  }, [_vm._v(_vm._s(_vm.read))])])], 2)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-f92cc69e", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-006cfd45\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-ipc.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-006cfd45\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-ipc.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("59423939", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-006cfd45\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./terminal-ipc.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-006cfd45\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./terminal-ipc.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-025907d6\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/kt-speaker.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-025907d6\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/kt-speaker.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("7327e7fc", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-025907d6\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./kt-speaker.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-025907d6\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./kt-speaker.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-189edac3\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/apps/iptalk/device-list.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-189edac3\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/apps/iptalk/device-list.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("48e00843", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-189edac3\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!../../../utils/lang-loader.js!./device-list.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-189edac3\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!../../../utils/lang-loader.js!./device-list.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-189edac3\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/device-list.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-189edac3\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/device-list.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("48ebf423", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-189edac3\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../utils/lang-loader.js!./device-list.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-189edac3\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../utils/lang-loader.js!./device-list.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-313955be\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-alarmtype.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-313955be\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-alarmtype.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("53b22acd", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-313955be\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./gk680-alarmtype.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-313955be\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./gk680-alarmtype.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-316ac60d\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-io.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-316ac60d\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-io.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("45ca2a35", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-316ac60d\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./terminal-io.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-316ac60d\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./terminal-io.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-33e25aed\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-panel.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-33e25aed\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-panel.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("7e5fe21d", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-33e25aed\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./terminal-panel.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-33e25aed\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./terminal-panel.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3e60cb2c\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-time.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3e60cb2c\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-time.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("53be7138", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3e60cb2c\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./gk680-time.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3e60cb2c\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./gk680-time.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-46dbee50\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/device.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-46dbee50\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/device.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("29d5969d", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-46dbee50\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./device.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-46dbee50\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./device.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4724d7c1\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/home.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4724d7c1\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/home.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("48f4417a", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4724d7c1\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../utils/lang-loader.js!./home.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4724d7c1\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../utils/lang-loader.js!./home.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-489b5c38\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-video.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-489b5c38\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-video.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("ebfffd64", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-489b5c38\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./terminal-video.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-489b5c38\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./terminal-video.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6118dcba\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-alarm.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6118dcba\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-alarm.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("775cc150", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6118dcba\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./terminal-alarm.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6118dcba\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./terminal-alarm.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6ac4ef76\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-alarmstatus.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6ac4ef76\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-alarmstatus.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("31495dc0", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6ac4ef76\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./gk680-alarmstatus.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6ac4ef76\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./gk680-alarmstatus.vue");
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

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-96264eca\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/mike-info.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-96264eca\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/mike-info.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("03f61fe7", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-96264eca\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./mike-info.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-96264eca\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./mike-info.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-9e0f21c2\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-assistrelate.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-9e0f21c2\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-assistrelate.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("4cc4547e", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-9e0f21c2\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!../../../../utils/lang-loader.js!./gk680-assistrelate.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-9e0f21c2\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!../../../../utils/lang-loader.js!./gk680-assistrelate.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-9e0f21c2\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-assistrelate.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-9e0f21c2\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-assistrelate.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("51729ba3", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-9e0f21c2\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./gk680-assistrelate.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-9e0f21c2\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./gk680-assistrelate.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-a80ffc56\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-info.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-a80ffc56\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-info.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("b731c51c", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-a80ffc56\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./terminal-info.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-a80ffc56\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./terminal-info.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-a9127e86\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/server.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-a9127e86\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/server.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("4b49bd8c", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-a9127e86\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./server.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-a9127e86\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./server.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-af58f616\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/group.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-af58f616\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/group.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("16aab7e0", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-af58f616\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./group.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-af58f616\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./group.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-c36ac980\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-c36ac980\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("79209869", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-c36ac980\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./gk680.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-c36ac980\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./gk680.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-c74d6214\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-c74d6214\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("3169e9ff", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-c74d6214\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./terminal.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-c74d6214\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./terminal.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e72f1098\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-led.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e72f1098\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-led.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("0f539962", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e72f1098\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./terminal-led.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e72f1098\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./terminal-led.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-f1e85a98\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-autodefence.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-f1e85a98\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-autodefence.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("77116215", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-f1e85a98\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./gk680-autodefence.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-f1e85a98\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./gk680-autodefence.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-f92cc69e\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-assistctrl.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-f92cc69e\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-assistctrl.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("c237cc38", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-f92cc69e\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./gk680-assistctrl.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-f92cc69e\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../utils/lang-loader.js!./gk680-assistctrl.vue");
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

/***/ "./src/apps/iptalk/device-list.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-189edac3\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/device-list.vue")
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-189edac3\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/apps/iptalk/device-list.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/device-list.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-189edac3\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/device-list.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-189edac3",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\iptalk\\device-list.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] device-list.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-189edac3", Component.options)
  } else {
    hotAPI.reload("data-v-189edac3", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/apps/iptalk/deviceManager/device.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-46dbee50\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/device.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/device.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-46dbee50\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/device.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-46dbee50",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\iptalk\\deviceManager\\device.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] device.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-46dbee50", Component.options)
  } else {
    hotAPI.reload("data-v-46dbee50", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/apps/iptalk/deviceManager/gk680-alarmstatus.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6ac4ef76\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-alarmstatus.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-alarmstatus.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-6ac4ef76\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-alarmstatus.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-6ac4ef76",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\iptalk\\deviceManager\\gk680-alarmstatus.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] gk680-alarmstatus.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6ac4ef76", Component.options)
  } else {
    hotAPI.reload("data-v-6ac4ef76", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/apps/iptalk/deviceManager/gk680-alarmtype.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-313955be\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-alarmtype.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-alarmtype.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-313955be\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-alarmtype.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-313955be",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\iptalk\\deviceManager\\gk680-alarmtype.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] gk680-alarmtype.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-313955be", Component.options)
  } else {
    hotAPI.reload("data-v-313955be", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/apps/iptalk/deviceManager/gk680-assistctrl.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-f92cc69e\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-assistctrl.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-assistctrl.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-f92cc69e\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-assistctrl.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-f92cc69e",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\iptalk\\deviceManager\\gk680-assistctrl.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] gk680-assistctrl.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-f92cc69e", Component.options)
  } else {
    hotAPI.reload("data-v-f92cc69e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/apps/iptalk/deviceManager/gk680-assistrelate.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-9e0f21c2\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-assistrelate.vue")
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-9e0f21c2\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-assistrelate.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-assistrelate.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-9e0f21c2\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-assistrelate.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-9e0f21c2",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\iptalk\\deviceManager\\gk680-assistrelate.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] gk680-assistrelate.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-9e0f21c2", Component.options)
  } else {
    hotAPI.reload("data-v-9e0f21c2", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/apps/iptalk/deviceManager/gk680-autodefence.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-f1e85a98\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-autodefence.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-autodefence.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-f1e85a98\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-autodefence.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-f1e85a98",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\iptalk\\deviceManager\\gk680-autodefence.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] gk680-autodefence.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-f1e85a98", Component.options)
  } else {
    hotAPI.reload("data-v-f1e85a98", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/apps/iptalk/deviceManager/gk680-time.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3e60cb2c\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-time.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-time.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-3e60cb2c\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680-time.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-3e60cb2c",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\iptalk\\deviceManager\\gk680-time.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] gk680-time.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3e60cb2c", Component.options)
  } else {
    hotAPI.reload("data-v-3e60cb2c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/apps/iptalk/deviceManager/gk680.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-c36ac980\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-c36ac980\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/gk680.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-c36ac980",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\iptalk\\deviceManager\\gk680.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] gk680.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c36ac980", Component.options)
  } else {
    hotAPI.reload("data-v-c36ac980", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/apps/iptalk/deviceManager/group.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-af58f616\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/group.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/group.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-af58f616\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/group.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-af58f616",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\iptalk\\deviceManager\\group.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] group.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-af58f616", Component.options)
  } else {
    hotAPI.reload("data-v-af58f616", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/apps/iptalk/deviceManager/kt-speaker.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-025907d6\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/kt-speaker.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/kt-speaker.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-025907d6\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/kt-speaker.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-025907d6",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\iptalk\\deviceManager\\kt-speaker.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] kt-speaker.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-025907d6", Component.options)
  } else {
    hotAPI.reload("data-v-025907d6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/apps/iptalk/deviceManager/mike-info.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-96264eca\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/mike-info.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/mike-info.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-96264eca\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/mike-info.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-96264eca",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\iptalk\\deviceManager\\mike-info.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] mike-info.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-96264eca", Component.options)
  } else {
    hotAPI.reload("data-v-96264eca", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/apps/iptalk/deviceManager/server.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-a9127e86\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/server.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/server.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-a9127e86\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/server.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-a9127e86",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\iptalk\\deviceManager\\server.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] server.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-a9127e86", Component.options)
  } else {
    hotAPI.reload("data-v-a9127e86", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/apps/iptalk/deviceManager/terminal-alarm.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6118dcba\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-alarm.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-alarm.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-6118dcba\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-alarm.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-6118dcba",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\iptalk\\deviceManager\\terminal-alarm.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] terminal-alarm.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6118dcba", Component.options)
  } else {
    hotAPI.reload("data-v-6118dcba", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/apps/iptalk/deviceManager/terminal-info.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-a80ffc56\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-info.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-info.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-a80ffc56\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-info.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-a80ffc56",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\iptalk\\deviceManager\\terminal-info.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] terminal-info.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-a80ffc56", Component.options)
  } else {
    hotAPI.reload("data-v-a80ffc56", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/apps/iptalk/deviceManager/terminal-io.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-316ac60d\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-io.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-io.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-316ac60d\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-io.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-316ac60d",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\iptalk\\deviceManager\\terminal-io.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] terminal-io.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-316ac60d", Component.options)
  } else {
    hotAPI.reload("data-v-316ac60d", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/apps/iptalk/deviceManager/terminal-ipc.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-006cfd45\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-ipc.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-ipc.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-006cfd45\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-ipc.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-006cfd45",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\iptalk\\deviceManager\\terminal-ipc.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] terminal-ipc.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-006cfd45", Component.options)
  } else {
    hotAPI.reload("data-v-006cfd45", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/apps/iptalk/deviceManager/terminal-led.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e72f1098\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-led.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-led.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-e72f1098\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-led.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-e72f1098",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\iptalk\\deviceManager\\terminal-led.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] terminal-led.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-e72f1098", Component.options)
  } else {
    hotAPI.reload("data-v-e72f1098", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/apps/iptalk/deviceManager/terminal-panel.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-33e25aed\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-panel.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-panel.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-33e25aed\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-panel.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-33e25aed",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\iptalk\\deviceManager\\terminal-panel.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] terminal-panel.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-33e25aed", Component.options)
  } else {
    hotAPI.reload("data-v-33e25aed", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/apps/iptalk/deviceManager/terminal-video.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-489b5c38\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-video.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-video.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-489b5c38\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal-video.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-489b5c38",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\iptalk\\deviceManager\\terminal-video.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] terminal-video.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-489b5c38", Component.options)
  } else {
    hotAPI.reload("data-v-489b5c38", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/apps/iptalk/deviceManager/terminal.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-c74d6214\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-c74d6214\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/deviceManager/terminal.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-c74d6214",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\iptalk\\deviceManager\\terminal.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] terminal.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c74d6214", Component.options)
  } else {
    hotAPI.reload("data-v-c74d6214", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/apps/iptalk/home.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4724d7c1\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/iptalk/home.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/iptalk/home.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-4724d7c1\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/iptalk/home.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-4724d7c1",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\iptalk\\home.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] home.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4724d7c1", Component.options)
  } else {
    hotAPI.reload("data-v-4724d7c1", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/apps/iptalk/images/TBV-6213B.jpg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/TBV-6213B.0bd4d9.jpg";

/***/ }),

/***/ "./src/apps/iptalk/images/microphone.jpg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/microphone.da3dff.jpg";

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

/***/ "./src/assets/js/semantic/components/accordion.min.css":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./src/assets/js/semantic/components/accordion.min.css");
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
		module.hot.accept("!!../../../../../node_modules/css-loader/index.js!./accordion.min.css", function() {
			var newContent = require("!!../../../../../node_modules/css-loader/index.js!./accordion.min.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/assets/js/semantic/components/accordion.min.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/*!
 * # Semantic UI 2.2.10 - Accordion
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */
!function(e,n,t,i){"use strict";n="undefined"!=typeof n&&n.Math==Math?n:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.accordion=function(t){var o,a=e(this),s=(new Date).getTime(),r=[],c=arguments[0],l="string"==typeof c,u=[].slice.call(arguments,1);n.requestAnimationFrame||n.mozRequestAnimationFrame||n.webkitRequestAnimationFrame||n.msRequestAnimationFrame||function(e){setTimeout(e,0)};return a.each(function(){var d,g,f=e.isPlainObject(t)?e.extend(!0,{},e.fn.accordion.settings,t):e.extend({},e.fn.accordion.settings),m=f.className,p=f.namespace,h=f.selector,v=f.error,b="."+p,y="module-"+p,C=a.selector||"",O=e(this),x=O.find(h.title),F=O.find(h.content),A=this,T=O.data(y);g={initialize:function(){g.debug("Initializing",O),g.bind.events(),f.observeChanges&&g.observeChanges(),g.instantiate()},instantiate:function(){T=g,O.data(y,g)},destroy:function(){g.debug("Destroying previous instance",O),O.off(b).removeData(y)},refresh:function(){x=O.find(h.title),F=O.find(h.content)},observeChanges:function(){"MutationObserver"in n&&(d=new MutationObserver(function(e){g.debug("DOM tree modified, updating selector cache"),g.refresh()}),d.observe(A,{childList:!0,subtree:!0}),g.debug("Setting up mutation observer",d))},bind:{events:function(){g.debug("Binding delegated events"),O.on(f.on+b,h.trigger,g.event.click)}},event:{click:function(){g.toggle.call(this)}},toggle:function(n){var t=n!==i?"number"==typeof n?x.eq(n):e(n).closest(h.title):e(this).closest(h.title),o=t.next(F),a=o.hasClass(m.animating),s=o.hasClass(m.active),r=s&&!a,c=!s&&a;g.debug("Toggling visibility of content",t),r||c?f.collapsible?g.close.call(t):g.debug("Cannot close accordion content collapsing is disabled"):g.open.call(t)},open:function(n){var t=n!==i?"number"==typeof n?x.eq(n):e(n).closest(h.title):e(this).closest(h.title),o=t.next(F),a=o.hasClass(m.animating),s=o.hasClass(m.active),r=s||a;return r?void g.debug("Accordion already open, skipping",o):(g.debug("Opening accordion content",t),f.onOpening.call(o),f.exclusive&&g.closeOthers.call(t),t.addClass(m.active),o.stop(!0,!0).addClass(m.animating),f.animateChildren&&(e.fn.transition!==i&&O.transition("is supported")?o.children().transition({animation:"fade in",queue:!1,useFailSafe:!0,debug:f.debug,verbose:f.verbose,duration:f.duration}):o.children().stop(!0,!0).animate({opacity:1},f.duration,g.resetOpacity)),void o.slideDown(f.duration,f.easing,function(){o.removeClass(m.animating).addClass(m.active),g.reset.display.call(this),f.onOpen.call(this),f.onChange.call(this)}))},close:function(n){var t=n!==i?"number"==typeof n?x.eq(n):e(n).closest(h.title):e(this).closest(h.title),o=t.next(F),a=o.hasClass(m.animating),s=o.hasClass(m.active),r=!s&&a,c=s&&a;!s&&!r||c||(g.debug("Closing accordion content",o),f.onClosing.call(o),t.removeClass(m.active),o.stop(!0,!0).addClass(m.animating),f.animateChildren&&(e.fn.transition!==i&&O.transition("is supported")?o.children().transition({animation:"fade out",queue:!1,useFailSafe:!0,debug:f.debug,verbose:f.verbose,duration:f.duration}):o.children().stop(!0,!0).animate({opacity:0},f.duration,g.resetOpacity)),o.slideUp(f.duration,f.easing,function(){o.removeClass(m.animating).removeClass(m.active),g.reset.display.call(this),f.onClose.call(this),f.onChange.call(this)}))},closeOthers:function(n){var t,o,a,s=n!==i?x.eq(n):e(this).closest(h.title),r=s.parents(h.content).prev(h.title),c=s.closest(h.accordion),l=h.title+"."+m.active+":visible",u=h.content+"."+m.active+":visible";f.closeNested?(t=c.find(l).not(r),a=t.next(F)):(t=c.find(l).not(r),o=c.find(u).find(l).not(r),t=t.not(o),a=t.next(F)),t.length>0&&(g.debug("Exclusive enabled, closing other content",t),t.removeClass(m.active),a.removeClass(m.animating).stop(!0,!0),f.animateChildren&&(e.fn.transition!==i&&O.transition("is supported")?a.children().transition({animation:"fade out",useFailSafe:!0,debug:f.debug,verbose:f.verbose,duration:f.duration}):a.children().stop(!0,!0).animate({opacity:0},f.duration,g.resetOpacity)),a.slideUp(f.duration,f.easing,function(){e(this).removeClass(m.active),g.reset.display.call(this)}))},reset:{display:function(){g.verbose("Removing inline display from element",this),e(this).css("display",""),""===e(this).attr("style")&&e(this).attr("style","").removeAttr("style")},opacity:function(){g.verbose("Removing inline opacity from element",this),e(this).css("opacity",""),""===e(this).attr("style")&&e(this).attr("style","").removeAttr("style")}},setting:function(n,t){if(g.debug("Changing setting",n,t),e.isPlainObject(n))e.extend(!0,f,n);else{if(t===i)return f[n];e.isPlainObject(f[n])?e.extend(!0,f[n],t):f[n]=t}},internal:function(n,t){return g.debug("Changing internal",n,t),t===i?g[n]:void(e.isPlainObject(n)?e.extend(!0,g,n):g[n]=t)},debug:function(){!f.silent&&f.debug&&(f.performance?g.performance.log(arguments):(g.debug=Function.prototype.bind.call(console.info,console,f.name+":"),g.debug.apply(console,arguments)))},verbose:function(){!f.silent&&f.verbose&&f.debug&&(f.performance?g.performance.log(arguments):(g.verbose=Function.prototype.bind.call(console.info,console,f.name+":"),g.verbose.apply(console,arguments)))},error:function(){f.silent||(g.error=Function.prototype.bind.call(console.error,console,f.name+":"),g.error.apply(console,arguments))},performance:{log:function(e){var n,t,i;f.performance&&(n=(new Date).getTime(),i=s||n,t=n-i,s=n,r.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:A,"Execution Time":t})),clearTimeout(g.performance.timer),g.performance.timer=setTimeout(g.performance.display,500)},display:function(){var n=f.name+":",t=0;s=!1,clearTimeout(g.performance.timer),e.each(r,function(e,n){t+=n["Execution Time"]}),n+=" "+t+"ms",C&&(n+=" '"+C+"'"),(console.group!==i||console.table!==i)&&r.length>0&&(console.groupCollapsed(n),console.table?console.table(r):e.each(r,function(e,n){console.log(n.Name+": "+n["Execution Time"]+"ms")}),console.groupEnd()),r=[]}},invoke:function(n,t,a){var s,r,c,l=T;return t=t||u,a=A||a,"string"==typeof n&&l!==i&&(n=n.split(/[\. ]/),s=n.length-1,e.each(n,function(t,o){var a=t!=s?o+n[t+1].charAt(0).toUpperCase()+n[t+1].slice(1):n;if(e.isPlainObject(l[a])&&t!=s)l=l[a];else{if(l[a]!==i)return r=l[a],!1;if(!e.isPlainObject(l[o])||t==s)return l[o]!==i?(r=l[o],!1):(g.error(v.method,n),!1);l=l[o]}})),e.isFunction(r)?c=r.apply(a,t):r!==i&&(c=r),e.isArray(o)?o.push(c):o!==i?o=[o,c]:c!==i&&(o=c),r}},l?(T===i&&g.initialize(),g.invoke(c)):(T!==i&&T.invoke("destroy"),g.initialize())}),o!==i?o:this},e.fn.accordion.settings={name:"Accordion",namespace:"accordion",silent:!1,debug:!1,verbose:!1,performance:!0,on:"click",observeChanges:!0,exclusive:!0,collapsible:!0,closeNested:!1,animateChildren:!0,duration:350,easing:"easeOutQuad",onOpening:function(){},onOpen:function(){},onClosing:function(){},onClose:function(){},onChange:function(){},error:{method:"The method you called is not defined"},className:{active:"active",animating:"animating"},selector:{accordion:".accordion",title:".title",trigger:".title",content:".content"}},e.extend(e.easing,{easeOutQuad:function(e,n,t,i,o){return-i*(n/=o)*(n-2)+t}})}(jQuery,window,document);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./src/assets/js/semantic/components/form.min.css":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./src/assets/js/semantic/components/form.min.css");
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
		module.hot.accept("!!../../../../../node_modules/css-loader/index.js!./form.min.css", function() {
			var newContent = require("!!../../../../../node_modules/css-loader/index.js!./form.min.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/assets/js/semantic/components/form.min.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/*!
 * # Semantic UI 2.2.10 - Form Validation
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */
!function(e,t,n,r){"use strict";t="undefined"!=typeof t&&t.Math==Math?t:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")(),e.fn.form=function(t){var i,a=e(this),o=a.selector||"",l=(new Date).getTime(),s=[],c=arguments[0],u=arguments[1],f="string"==typeof c,d=[].slice.call(arguments,1);return a.each(function(){var p,m,g,h,v,b,y,x,k,E,w,C,V,R,S,F,A,T,D,j=e(this),O=this,$=[],z=!1;D={initialize:function(){D.get.settings(),f?(T===r&&D.instantiate(),D.invoke(c)):(T!==r&&T.invoke("destroy"),D.verbose("Initializing form validation",j,x),D.bindEvents(),D.set.defaults(),D.instantiate())},instantiate:function(){D.verbose("Storing instance of module",D),T=D,j.data(F,D)},destroy:function(){D.verbose("Destroying previous module",T),D.removeEvents(),j.removeData(F)},refresh:function(){D.verbose("Refreshing selector cache"),p=j.find(w.field),m=j.find(w.group),g=j.find(w.message),h=j.find(w.prompt),v=j.find(w.submit),b=j.find(w.clear),y=j.find(w.reset)},submit:function(){D.verbose("Submitting form",j),j.submit()},attachEvents:function(t,n){n=n||"submit",e(t).on("click"+A,function(e){D[n](),e.preventDefault()})},bindEvents:function(){D.verbose("Attaching form events"),j.on("submit"+A,D.validate.form).on("blur"+A,w.field,D.event.field.blur).on("click"+A,w.submit,D.submit).on("click"+A,w.reset,D.reset).on("click"+A,w.clear,D.clear),x.keyboardShortcuts&&j.on("keydown"+A,w.field,D.event.field.keydown),p.each(function(){var t=e(this),n=t.prop("type"),r=D.get.changeEvent(n,t);e(this).on(r+A,D.event.field.change)})},clear:function(){p.each(function(){var t=e(this),n=t.parent(),r=t.closest(m),i=r.find(w.prompt),a=t.data(E.defaultValue)||"",o=n.is(w.uiCheckbox),l=n.is(w.uiDropdown),s=r.hasClass(C.error);s&&(D.verbose("Resetting error on field",r),r.removeClass(C.error),i.remove()),l?(D.verbose("Resetting dropdown value",n,a),n.dropdown("clear")):o?t.prop("checked",!1):(D.verbose("Resetting field value",t,a),t.val(""))})},reset:function(){p.each(function(){var t=e(this),n=t.parent(),i=t.closest(m),a=i.find(w.prompt),o=t.data(E.defaultValue),l=n.is(w.uiCheckbox),s=n.is(w.uiDropdown),c=i.hasClass(C.error);o!==r&&(c&&(D.verbose("Resetting error on field",i),i.removeClass(C.error),a.remove()),s?(D.verbose("Resetting dropdown value",n,o),n.dropdown("restore defaults")):l?(D.verbose("Resetting checkbox value",n,o),t.prop("checked",o)):(D.verbose("Resetting field value",t,o),t.val(o)))})},determine:{isValid:function(){var t=!0;return e.each(k,function(e,n){D.validate.field(n,e,!0)||(t=!1)}),t}},is:{bracketedRule:function(e){return e.type&&e.type.match(x.regExp.bracket)},empty:function(e){return e&&0!==e.length?e.is('input[type="checkbox"]')?!e.is(":checked"):D.is.blank(e):!0},blank:function(t){return""===e.trim(t.val())},valid:function(t){var n=!0;return t?(D.verbose("Checking if field is valid",t),D.validate.field(k[t],t,!1)):(D.verbose("Checking if form is valid"),e.each(k,function(e,t){D.is.valid(e)||(n=!1)}),n)}},removeEvents:function(){j.off(A),p.off(A),v.off(A),p.off(A)},event:{field:{keydown:function(t){var n=e(this),r=t.which,i=n.is(w.input),a=n.is(w.checkbox),o=n.closest(w.uiDropdown).length>0,l={enter:13,escape:27};r==l.escape&&(D.verbose("Escape key pressed blurring field"),n.blur()),t.ctrlKey||r!=l.enter||!i||o||a||(z||(n.one("keyup"+A,D.event.field.keyup),D.submit(),D.debug("Enter pressed on input submitting form")),z=!0)},keyup:function(){z=!1},blur:function(t){var n=e(this),r=n.closest(m),i=D.get.validation(n);r.hasClass(C.error)?(D.debug("Revalidating field",n,i),i&&D.validate.field(i)):"blur"!=x.on&&"change"!=x.on||i&&D.validate.field(i)},change:function(t){var n=e(this),r=n.closest(m),i=D.get.validation(n);i&&("change"==x.on||r.hasClass(C.error)&&x.revalidate)&&(clearTimeout(D.timer),D.timer=setTimeout(function(){D.debug("Revalidating field",n,D.get.validation(n)),D.validate.field(i)},x.delay))}}},get:{ancillaryValue:function(e){return e.type&&(e.value||D.is.bracketedRule(e))?e.value!==r?e.value:e.type.match(x.regExp.bracket)[1]+"":!1},ruleName:function(e){return D.is.bracketedRule(e)?e.type.replace(e.type.match(x.regExp.bracket)[0],""):e.type},changeEvent:function(e,t){return"checkbox"==e||"radio"==e||"hidden"==e||t.is("select")?"change":D.get.inputEvent()},inputEvent:function(){return n.createElement("input").oninput!==r?"input":n.createElement("input").onpropertychange!==r?"propertychange":"keyup"},prompt:function(e,t){var n,r,i,a=D.get.ruleName(e),o=D.get.ancillaryValue(e),l=e.prompt||x.prompt[a]||x.text.unspecifiedRule,s=-1!==l.search("{value}"),c=-1!==l.search("{name}");return(c||s)&&(r=D.get.field(t.identifier)),s&&(l=l.replace("{value}",r.val())),c&&(n=r.closest(w.group).find("label").eq(0),i=1==n.length?n.text():r.prop("placeholder")||x.text.unspecifiedField,l=l.replace("{name}",i)),l=l.replace("{identifier}",t.identifier),l=l.replace("{ruleValue}",o),e.prompt||D.verbose("Using default validation prompt for type",l,a),l},settings:function(){if(e.isPlainObject(t)){var n,i=Object.keys(t),a=i.length>0?t[i[0]].identifier!==r&&t[i[0]].rules!==r:!1;a?(x=e.extend(!0,{},e.fn.form.settings,u),k=e.extend({},e.fn.form.settings.defaults,t),D.error(x.error.oldSyntax,O),D.verbose("Extending settings from legacy parameters",k,x)):(t.fields&&(n=Object.keys(t.fields),("string"==typeof t.fields[n[0]]||e.isArray(t.fields[n[0]]))&&e.each(t.fields,function(n,r){"string"==typeof r&&(r=[r]),t.fields[n]={rules:[]},e.each(r,function(e,r){t.fields[n].rules.push({type:r})})})),x=e.extend(!0,{},e.fn.form.settings,t),k=e.extend({},e.fn.form.settings.defaults,x.fields),D.verbose("Extending settings",k,x))}else x=e.fn.form.settings,k=e.fn.form.settings.defaults,D.verbose("Using default form validation",k,x);S=x.namespace,E=x.metadata,w=x.selector,C=x.className,V=x.regExp,R=x.error,F="module-"+S,A="."+S,T=j.data(F),D.refresh()},field:function(t){return D.verbose("Finding field with identifier",t),t=D.escape.string(t),p.filter("#"+t).length>0?p.filter("#"+t):p.filter('[name="'+t+'"]').length>0?p.filter('[name="'+t+'"]'):p.filter('[name="'+t+'[]"]').length>0?p.filter('[name="'+t+'[]"]'):p.filter("[data-"+E.validate+'="'+t+'"]').length>0?p.filter("[data-"+E.validate+'="'+t+'"]'):e("<input/>")},fields:function(t){var n=e();return e.each(t,function(e,t){n=n.add(D.get.field(t))}),n},validation:function(t){var n,r;return k?(e.each(k,function(e,i){r=i.identifier||e,D.get.field(r)[0]==t[0]&&(i.identifier=r,n=i)}),n||!1):!1},value:function(e){var t,n=[];return n.push(e),t=D.get.values.call(O,n),t[e]},values:function(t){var n=e.isArray(t)?D.get.fields(t):p,r={};return n.each(function(t,n){var i=e(n),a=(i.prop("type"),i.prop("name")),o=i.val(),l=i.is(w.checkbox),s=i.is(w.radio),c=-1!==a.indexOf("[]"),u=l?i.is(":checked"):!1;a&&(c?(a=a.replace("[]",""),r[a]||(r[a]=[]),l?u?r[a].push(o||!0):r[a].push(!1):r[a].push(o)):s?u&&(r[a]=o):l?u?r[a]=o||!0:r[a]=!1:r[a]=o)}),r}},has:{field:function(e){return D.verbose("Checking for existence of a field with identifier",e),e=D.escape.string(e),"string"!=typeof e&&D.error(R.identifier,e),p.filter("#"+e).length>0?!0:p.filter('[name="'+e+'"]').length>0?!0:p.filter("[data-"+E.validate+'="'+e+'"]').length>0}},escape:{string:function(e){return e=String(e),e.replace(V.escape,"\\$&")}},add:{prompt:function(t,n){var i=D.get.field(t),a=i.closest(m),o=a.children(w.prompt),l=0!==o.length;n="string"==typeof n?[n]:n,D.verbose("Adding field error state",t),a.addClass(C.error),x.inline&&(l||(o=x.templates.prompt(n),o.appendTo(a)),o.html(n[0]),l?D.verbose("Inline errors are disabled, no inline error added",t):x.transition&&e.fn.transition!==r&&j.transition("is supported")?(D.verbose("Displaying error with css transition",x.transition),o.transition(x.transition+" in",x.duration)):(D.verbose("Displaying error with fallback javascript animation"),o.fadeIn(x.duration)))},errors:function(e){D.debug("Adding form error messages",e),D.set.error(),g.html(x.templates.error(e))}},remove:{prompt:function(t){var n=D.get.field(t),i=n.closest(m),a=i.children(w.prompt);i.removeClass(C.error),x.inline&&a.is(":visible")&&(D.verbose("Removing prompt for field",t),x.transition&&e.fn.transition!==r&&j.transition("is supported")?a.transition(x.transition+" out",x.duration,function(){a.remove()}):a.fadeOut(x.duration,function(){a.remove()}))}},set:{success:function(){j.removeClass(C.error).addClass(C.success)},defaults:function(){p.each(function(){var t=e(this),n=t.filter(w.checkbox).length>0,r=n?t.is(":checked"):t.val();t.data(E.defaultValue,r)})},error:function(){j.removeClass(C.success).addClass(C.error)},value:function(e,t){var n={};return n[e]=t,D.set.values.call(O,n)},values:function(t){e.isEmptyObject(t)||e.each(t,function(t,n){var r,i=D.get.field(t),a=i.parent(),o=e.isArray(n),l=a.is(w.uiCheckbox),s=a.is(w.uiDropdown),c=i.is(w.radio)&&l,u=i.length>0;u&&(o&&l?(D.verbose("Selecting multiple",n,i),a.checkbox("uncheck"),e.each(n,function(e,t){r=i.filter('[value="'+t+'"]'),a=r.parent(),r.length>0&&a.checkbox("check")})):c?(D.verbose("Selecting radio value",n,i),i.filter('[value="'+n+'"]').parent(w.uiCheckbox).checkbox("check")):l?(D.verbose("Setting checkbox value",n,a),n===!0?a.checkbox("check"):a.checkbox("uncheck")):s?(D.verbose("Setting dropdown value",n,a),a.dropdown("set selected",n)):(D.verbose("Setting field value",n,i),i.val(n)))})}},validate:{form:function(e,t){var n=D.get.values();if(z)return!1;if($=[],D.determine.isValid()){if(D.debug("Form has no validation errors, submitting"),D.set.success(),t!==!0)return x.onSuccess.call(O,e,n)}else if(D.debug("Form has errors"),D.set.error(),x.inline||D.add.errors($),j.data("moduleApi")!==r&&e.stopImmediatePropagation(),t!==!0)return x.onFailure.call(O,$,n)},field:function(t,n,i){i=i!==r?i:!0,"string"==typeof t&&(D.verbose("Validating field",t),n=t,t=k[t]);var a=t.identifier||n,o=D.get.field(a),l=t.depends?D.get.field(t.depends):!1,s=!0,c=[];return t.identifier||(D.debug("Using field name as identifier",a),t.identifier=a),o.prop("disabled")?(D.debug("Field is disabled. Skipping",a),s=!0):t.optional&&D.is.blank(o)?(D.debug("Field is optional and blank. Skipping",a),s=!0):t.depends&&D.is.empty(l)?(D.debug("Field depends on another value that is not present or empty. Skipping",l),s=!0):t.rules!==r&&e.each(t.rules,function(e,n){D.has.field(a)&&!D.validate.rule(t,n)&&(D.debug("Field is invalid",a,n.type),c.push(D.get.prompt(n,t)),s=!1)}),s?(i&&(D.remove.prompt(a,c),x.onValid.call(o)),!0):(i&&($=$.concat(c),D.add.prompt(a,c),x.onInvalid.call(o,c)),!1)},rule:function(t,n){var i=D.get.field(t.identifier),a=(n.type,i.val()),o=D.get.ancillaryValue(n),l=D.get.ruleName(n),s=x.rules[l];return e.isFunction(s)?(a=a===r||""===a||null===a?"":e.trim(a+""),s.call(i,a,o)):void D.error(R.noRule,l)}},setting:function(t,n){if(e.isPlainObject(t))e.extend(!0,x,t);else{if(n===r)return x[t];x[t]=n}},internal:function(t,n){if(e.isPlainObject(t))e.extend(!0,D,t);else{if(n===r)return D[t];D[t]=n}},debug:function(){!x.silent&&x.debug&&(x.performance?D.performance.log(arguments):(D.debug=Function.prototype.bind.call(console.info,console,x.name+":"),D.debug.apply(console,arguments)))},verbose:function(){!x.silent&&x.verbose&&x.debug&&(x.performance?D.performance.log(arguments):(D.verbose=Function.prototype.bind.call(console.info,console,x.name+":"),D.verbose.apply(console,arguments)))},error:function(){x.silent||(D.error=Function.prototype.bind.call(console.error,console,x.name+":"),D.error.apply(console,arguments))},performance:{log:function(e){var t,n,r;x.performance&&(t=(new Date).getTime(),r=l||t,n=t-r,l=t,s.push({Name:e[0],Arguments:[].slice.call(e,1)||"",Element:O,"Execution Time":n})),clearTimeout(D.performance.timer),D.performance.timer=setTimeout(D.performance.display,500)},display:function(){var t=x.name+":",n=0;l=!1,clearTimeout(D.performance.timer),e.each(s,function(e,t){n+=t["Execution Time"]}),t+=" "+n+"ms",o&&(t+=" '"+o+"'"),a.length>1&&(t+=" ("+a.length+")"),(console.group!==r||console.table!==r)&&s.length>0&&(console.groupCollapsed(t),console.table?console.table(s):e.each(s,function(e,t){console.log(t.Name+": "+t["Execution Time"]+"ms")}),console.groupEnd()),s=[]}},invoke:function(t,n,a){var o,l,s,c=T;return n=n||d,a=O||a,"string"==typeof t&&c!==r&&(t=t.split(/[\. ]/),o=t.length-1,e.each(t,function(n,i){var a=n!=o?i+t[n+1].charAt(0).toUpperCase()+t[n+1].slice(1):t;if(e.isPlainObject(c[a])&&n!=o)c=c[a];else{if(c[a]!==r)return l=c[a],!1;if(!e.isPlainObject(c[i])||n==o)return c[i]!==r?(l=c[i],!1):!1;c=c[i]}})),e.isFunction(l)?s=l.apply(a,n):l!==r&&(s=l),e.isArray(i)?i.push(s):i!==r?i=[i,s]:s!==r&&(i=s),l}},D.initialize()}),i!==r?i:this},e.fn.form.settings={name:"Form",namespace:"form",debug:!1,verbose:!1,performance:!0,fields:!1,keyboardShortcuts:!0,on:"submit",inline:!1,delay:200,revalidate:!0,transition:"scale",duration:200,onValid:function(){},onInvalid:function(){},onSuccess:function(){return!0},onFailure:function(){return!1},metadata:{defaultValue:"default",validate:"validate"},regExp:{htmlID:/^[a-zA-Z][\w:.-]*$/g,bracket:/\[(.*)\]/i,decimal:/^\d+\.?\d*$/,email:/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i,escape:/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,flags:/^\/(.*)\/(.*)?/,integer:/^\-?\d+$/,number:/^\-?\d*(\.\d+)?$/,url:/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/i},text:{unspecifiedRule:"Please enter a valid value",unspecifiedField:"This field"},prompt:{empty:"{name} must have a value",checked:"{name} must be checked",email:"{name} must be a valid e-mail",url:"{name} must be a valid url",regExp:"{name} is not formatted correctly",integer:"{name} must be an integer",decimal:"{name} must be a decimal number",number:"{name} must be set to a number",is:'{name} must be "{ruleValue}"',isExactly:'{name} must be exactly "{ruleValue}"',not:'{name} cannot be set to "{ruleValue}"',notExactly:'{name} cannot be set to exactly "{ruleValue}"',contain:'{name} cannot contain "{ruleValue}"',containExactly:'{name} cannot contain exactly "{ruleValue}"',doesntContain:'{name} must contain  "{ruleValue}"',doesntContainExactly:'{name} must contain exactly "{ruleValue}"',minLength:"{name} must be at least {ruleValue} characters",length:"{name} must be at least {ruleValue} characters",exactLength:"{name} must be exactly {ruleValue} characters",maxLength:"{name} cannot be longer than {ruleValue} characters",match:"{name} must match {ruleValue} field",different:"{name} must have a different value than {ruleValue} field",creditCard:"{name} must be a valid credit card number",minCount:"{name} must have at least {ruleValue} choices",exactCount:"{name} must have exactly {ruleValue} choices",maxCount:"{name} must have {ruleValue} or less choices"},selector:{checkbox:'input[type="checkbox"], input[type="radio"]',clear:".clear",field:"input, textarea, select",group:".field",input:"input",message:".error.message",prompt:".prompt.label",radio:'input[type="radio"]',reset:'.reset:not([type="reset"])',submit:'.submit:not([type="submit"])',uiCheckbox:".ui.checkbox",uiDropdown:".ui.dropdown"},className:{error:"error",label:"ui prompt label",pressed:"down",success:"success"},error:{identifier:"You must specify a string identifier for each field",method:"The method you called is not defined.",noRule:"There is no rule matching the one you specified",oldSyntax:"Starting in 2.0 forms now only take a single settings object. Validation settings converted to new syntax automatically."},templates:{error:function(t){var n='<ul class="list">';return e.each(t,function(e,t){n+="<li>"+t+"</li>"}),n+="</ul>",e(n)},prompt:function(t){return e("<div/>").addClass("ui basic red pointing prompt label").html(t[0])}},rules:{empty:function(t){return!(t===r||""===t||e.isArray(t)&&0===t.length)},checked:function(){return e(this).filter(":checked").length>0},email:function(t){return e.fn.form.settings.regExp.email.test(t)},url:function(t){return e.fn.form.settings.regExp.url.test(t)},regExp:function(t,n){if(n instanceof RegExp)return t.match(n);var r,i=n.match(e.fn.form.settings.regExp.flags);return i&&(n=i.length>=2?i[1]:n,r=i.length>=3?i[2]:""),t.match(new RegExp(n,r))},integer:function(t,n){var i,a,o,l=e.fn.form.settings.regExp.integer;return n&&-1===["",".."].indexOf(n)&&(-1==n.indexOf("..")?l.test(n)&&(i=a=n-0):(o=n.split("..",2),l.test(o[0])&&(i=o[0]-0),l.test(o[1])&&(a=o[1]-0))),l.test(t)&&(i===r||t>=i)&&(a===r||a>=t)},decimal:function(t){return e.fn.form.settings.regExp.decimal.test(t)},number:function(t){return e.fn.form.settings.regExp.number.test(t)},is:function(e,t){return t="string"==typeof t?t.toLowerCase():t,e="string"==typeof e?e.toLowerCase():e,e==t},isExactly:function(e,t){return e==t},not:function(e,t){return e="string"==typeof e?e.toLowerCase():e,t="string"==typeof t?t.toLowerCase():t,e!=t},notExactly:function(e,t){return e!=t},contains:function(t,n){return n=n.replace(e.fn.form.settings.regExp.escape,"\\$&"),-1!==t.search(new RegExp(n,"i"))},containsExactly:function(t,n){return n=n.replace(e.fn.form.settings.regExp.escape,"\\$&"),-1!==t.search(new RegExp(n))},doesntContain:function(t,n){return n=n.replace(e.fn.form.settings.regExp.escape,"\\$&"),-1===t.search(new RegExp(n,"i"))},doesntContainExactly:function(t,n){return n=n.replace(e.fn.form.settings.regExp.escape,"\\$&"),-1===t.search(new RegExp(n))},minLength:function(e,t){return e!==r?e.length>=t:!1},length:function(e,t){return e!==r?e.length>=t:!1},exactLength:function(e,t){return e!==r?e.length==t:!1},maxLength:function(e,t){return e!==r?e.length<=t:!1},match:function(t,n){var i;e(this);return e('[data-validate="'+n+'"]').length>0?i=e('[data-validate="'+n+'"]').val():e("#"+n).length>0?i=e("#"+n).val():e('[name="'+n+'"]').length>0?i=e('[name="'+n+'"]').val():e('[name="'+n+'[]"]').length>0&&(i=e('[name="'+n+'[]"]')),i!==r?t.toString()==i.toString():!1},different:function(t,n){var i;e(this);return e('[data-validate="'+n+'"]').length>0?i=e('[data-validate="'+n+'"]').val():e("#"+n).length>0?i=e("#"+n).val():e('[name="'+n+'"]').length>0?i=e('[name="'+n+'"]').val():e('[name="'+n+'[]"]').length>0&&(i=e('[name="'+n+'[]"]')),i!==r?t.toString()!==i.toString():!1},creditCard:function(t,n){var r,i,a={visa:{pattern:/^4/,length:[16]},amex:{pattern:/^3[47]/,length:[15]},mastercard:{pattern:/^5[1-5]/,length:[16]},discover:{pattern:/^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/,length:[16]},unionPay:{pattern:/^(62|88)/,length:[16,17,18,19]},jcb:{pattern:/^35(2[89]|[3-8][0-9])/,length:[16]},maestro:{pattern:/^(5018|5020|5038|6304|6759|676[1-3])/,length:[12,13,14,15,16,17,18,19]},dinersClub:{pattern:/^(30[0-5]|^36)/,length:[14]},laser:{pattern:/^(6304|670[69]|6771)/,length:[16,17,18,19]},visaElectron:{pattern:/^(4026|417500|4508|4844|491(3|7))/,length:[16]}},o={},l=!1,s="string"==typeof n?n.split(","):!1;if("string"==typeof t&&0!==t.length){if(t=t.replace(/[\-]/g,""),s&&(e.each(s,function(n,r){i=a[r],i&&(o={length:-1!==e.inArray(t.length,i.length),pattern:-1!==t.search(i.pattern)},o.length&&o.pattern&&(l=!0))}),!l))return!1;if(r={number:-1!==e.inArray(t.length,a.unionPay.length),pattern:-1!==t.search(a.unionPay.pattern)},r.number&&r.pattern)return!0;for(var c=t.length,u=0,f=[[0,1,2,3,4,5,6,7,8,9],[0,2,4,6,8,1,3,5,7,9]],d=0;c--;)d+=f[u][parseInt(t.charAt(c),10)],u^=1;return d%10===0&&d>0}},minCount:function(e,t){return 0==t?!0:1==t?""!==e:e.split(",").length>=t},exactCount:function(e,t){return 0==t?""===e:1==t?""!==e&&-1===e.search(","):e.split(",").length==t},maxCount:function(e,t){return 0==t?!1:1==t?-1===e.search(","):e.split(",").length<=t}}}}(jQuery,window,document);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.min.js")))

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