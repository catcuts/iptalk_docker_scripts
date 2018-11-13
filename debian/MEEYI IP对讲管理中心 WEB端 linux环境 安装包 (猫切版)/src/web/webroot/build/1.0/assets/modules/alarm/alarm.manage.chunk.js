webpackJsonp([106],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/alarm/components/alarm.list.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _table = __webpack_require__("./src/components/table.vue");

var _table2 = _interopRequireDefault(_table);

var _voerkaurls = __webpack_require__("./src/apps/voerka/urls.js");

var _actions = __webpack_require__("./src/apps/voerka/modules/alarm/store/actions.js");

var _dialog = __webpack_require__("./src/common/dialog.rich.js");

var _vuex = __webpack_require__("./node_modules/vuex/dist/vuex.esm.js");

var _eventbus = __webpack_require__("./src/common/eventbus.js");

var _eventbus2 = _interopRequireDefault(_eventbus);

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

var _loading = __webpack_require__("./src/mixins/loading.mixin.js");

var _loading2 = _interopRequireDefault(_loading);

var _devicescommon = __webpack_require__("./src/apps/voerka/modules/devices/components/main/common.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = {
	mixins: [_loading2.default],
	components: { zwxtable: _table2.default },
	computed: _extends({}, (0, _vuex.mapState)({
		theme: function theme(state) {
			return state.theme;
		},
		alarmRecords: function alarmRecords(state) {
			return state.voerkaModule.alarm.alarmRecords;
		}
	})),
	data: function data() {
		return {
			url: _voerkaurls.alarmlist,
			rows: [],
			cols: [{ name: "sn", title: "设备编号", width: 80, visible: false }, { name: "level", title: "级别", width: 40, sortable: true }, { name: "message", title: "消息描述", align: "left" }, { name: "type", title: "消息类型", visible: false }, { name: "triggerTime", title: "时间", width: 100, sortable: true, icon: "wait" }, { name: "coord", title: "坐标", visible: false, icon: "marker", color: "red" }, { name: "address", title: "地址", visible: false }, { name: "description", title: "详细描述", visible: false }, { name: "source", title: "来源", width: 80 }, { name: "customer", title: "客户", visible: false, icon: "user", color: "green" }, { name: "telephone", title: "电话", visible: false, icon: "text telephone", color: "green" }, { name: "status", title: "状态", width: 60, type: "icon", sortable: true, icon: "wait", color: "red",
				tips: {
					0: "未处理",
					1: "已处理",
					2: "忽略",
					3: "误报",
					4: "合并",
					default: "未知"
				},
				icons: {
					0: "wait",
					1: "checkmark",
					2: "ban",
					3: "radio",
					4: "compress",
					default: "help"
				},
				colors: {
					0: "red",
					1: "green",
					2: "grey",
					3: "yellow",
					4: "grey"
				}
			}],
			footerbar: [{ name: "merge", text: "合并", icon: "compress", right: true, click: "merge" }, { name: "errreport", text: "误报", icon: "radio", iconColor: "yellow", right: true, click: "falseAlarm" }, { name: "handle", text: "处置", icon: "checkmark", iconColor: "green", right: true, click: "manage" }, { name: "neglect", text: "忽略", icon: "ban", iconColor: "grey", right: true, click: "neglect" }],
			pagination: {
				pageNumber: 1,
				pageCount: 2,
				pageSize: 20
			},
			loading: {
				timeout: 10000 },
			count: 10
		};
	},

	watch: {
		"rows": function rows(newvalue, oldvalue) {
			this.$store.dispatch('alarmRecords', newvalue);
		}
	},
	props: {
		selected: { type: Array, default: function _default() {
				return [];
			} },
		fit: { type: Boolean, default: true }
	},
	methods: {

		onLoadData: function onLoadData(context) {
			this.showLoading();
			this.ajaxLoadData(context);
		},
		ajaxLoadData: function ajaxLoadData(context) {
			var self = this;
			var params = this.pagination;
			if (context) {
				params.pageNumber = context.newPage;
			}

			this._ajax = _webservice2.default.getJSON(this.url, params, function (response) {
				if (response.status == "success") {
					self.pagination = {
						pageNumber: response.result.pageNumber,
						pageCount: response.result.pageCount,
						pageSize: response.result.pageSize
					};

					var result = response.result.records;
					var records = result.map(function (record) {
						var data = {
							'id': record.ID,
							'status': record.status,
							'sn': record.sn,
							'message': record.translation,
							'type': record.type,
							'level': record.level,
							'triggerTime': record.time,
							'acceptTime': '',
							'address': "",
							'coord': record.coord || " ",
							'source': "保险箱",
							'description': record.translation,
							'customer': self.curUser,
							'deviceType': record.deviceType
						};
						return data;
					});

					if (self.cols.length > 0) {
						if (self.paging) {
							var _self$rows;

							self.rows.length = 0;
							(_self$rows = self.rows).push.apply(_self$rows, _toConsumableArray(records));
						} else {
							var _self$rows2;

							(_self$rows2 = self.rows).push.apply(_self$rows2, _toConsumableArray(records));
						}
					}
					if (context) {
						context.success(self.pagination);
					}
					self.hideLoading();
				} else {
					if (response.message == "没有告警数据") {
						alert(response.message).then(function () {
							self.hideLoading();
						});
					} else if (response.message == "请先登录，才能进行操作！") {
						(0, _devicescommon.failureCheck)(response.message);
					}
				}
			}).fail(function (e) {
				if (context) {
					context.fail(e.responseText);
				}
			});
		},
		getAlarmRecord: function getAlarmRecord(id) {
			return {
				records: this.$refs.alarmtable.findRow("id", id),
				fields: this.$refs.alarmtable.cols
			};
		},
		startSubscribe: function startSubscribe() {
			var _this = this;

			var self = this;
			var alarmStreaming = StreamingManager.getStreaming("alarm_streaming");
			alarmStreaming.subscribe(function (value, channel) {
				var data = {
					'id': value.ID,
					'status': value.status,
					'sn': value.sn,
					'message': value.translation,
					'type': value.type,
					'level': value.level,
					'triggerTime': value.time,
					'acceptTime': '',
					'ip': '',
					'endTime': '',
					'mapId': '',
					'address': "",
					'coord': value.message.coord,
					'source': "保险箱",
					'description': value.translation,
					'customer': self.curUser,
					'deviceType': value.deviceType
				};

				_this.rows.unshift(data);
				if (_this.rows.length > 1000) {
					_this.rows.splice(1000 - _this.rows.length);
				}

				try {
					var eventInfo = value.message.coord || {};

					eventInfo = eventInfo.split(",");
					var longitude = eventInfo[1];
					var latitude = eventInfo[0];
					var point = { "id": "", "x": longitude, "y": latitude, "imgsrc": "assets/images/safebox.59b2a5.jpg", "title": "我", "color": "red", "active": true, "zoom": 15 };
					_eventbus2.default.$emit("to-baidumap", point);
				} catch (e) {}
			});
		},

		childCellclick: function childCellclick(row, cell) {},
		onLoadingTimeout: function onLoadingTimeout() {
			toast("数据加载超时，请耐心等待或检查网络环境");
		}
	},
	created: function created() {
		this.registerEvents({
			onCancelSubscribe: function onCancelSubscribe(item, $event) {
				this.$store.dispatch('filterAlarmRecord');
			},

			merge: function merge(item, $event) {
				self = this;
				var rows = this.$refs.alarmtable.getSelectedRowsData();
				var allsame = false;

				if (self.selected.length <= 1) {
					toast("请选择多条记录");
				} else {
					for (var i = 1; i < self.selected.length; i++) {
						if (rows[0].sn != rows[i].sn) {
							allsame = false;
							toast("请确认是同一个设备的报警记录");
							break;
						} else {
							allsame = true;
						}
					}
					if (allsame == true) {
						confirm("确认合并", "").then(function (item) {
							if (item.button.name == "ok") {
								var eventid = JSON.stringify(self.selected);
								_webservice2.default.getJSON(_voerkaurls.msgmerge, { eventid: eventid }, function (data) {
									if (data.status == "success") {
										self.$store.dispatch('mergeAlarmRecord', self.selected);
									} else {
										toast("data.message");
									}
								}).fail(function (e) {
									toast(e);
								});
							} else {}
						});
					}
				}
			},

			falseAlarm: function falseAlarm(item, $event) {
				self = this;
				confirm("确定设置为误报？", "").then(function (item) {
					if (item.button.name == "ok") {
						var eventid = JSON.stringify(self.selected);
						_webservice2.default.getJSON(_voerkaurls.msgerrreport, { eventid: eventid }, function (data) {
							if (data.status == "success") {
								self.$store.dispatch('errreportAlarmRecord', self.selected);
							} else {
								toast("data.message");
							}
						}).fail(function (e) {
							toast("e");
						});
					} else {}
				});
			},

			manage: function manage(item, $event) {
				self = this;
				confirm("确认告警已处理", "").then(function (item) {
					if (item.button.name == "ok") {
						var eventid = JSON.stringify(self.selected);
						_webservice2.default.getJSON(_voerkaurls.msghandle, { eventid: eventid }, function (data) {
							if (data.status == "success") {
								self.$store.dispatch('handleAlarmRecord', self.selected);
							} else {
								toast("data.message");
							}
						}).fail(function (e) {
							toast("e");
						});
					} else {}
				});
			},

			neglect: function neglect(item, $event) {
				self = this;
				confirm("确定忽略此报警信息？", "").then(function (item) {
					if (item.button.name == "ok") {
						var eventid = JSON.stringify(self.selected);
						_webservice2.default.getJSON(_voerkaurls.msgneglect, { eventid: eventid }, function (data) {
							if (data.status == "success") {
								self.$store.dispatch('neglectAlarmRecord', self.selected);
							} else {
								toast("data.message");
							}
						}).fail(function (e) {
							toast("e");
						});
					} else {}
				});
			}
		});
	},
	mounted: function mounted() {

		this.onLoadData();
		this.startSubscribe();
	}
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/alarm/components/alarm.manage.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _menubar = __webpack_require__("./src/components/menubar.vue");

var _menubar2 = _interopRequireDefault(_menubar);

var _layout = __webpack_require__("./src/components/layout.vue");

var _layout2 = _interopRequireDefault(_layout);

var _alarmList = __webpack_require__("./src/apps/voerka/modules/alarm/components/alarm.list.vue");

var _alarmList2 = _interopRequireDefault(_alarmList);

var _tree = __webpack_require__("./src/components/tree.vue");

var _tree2 = _interopRequireDefault(_tree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: { menubar: _menubar2.default, layout: _layout2.default, AlarmList: _alarmList2.default, tree: _tree2.default },
	data: function data() {
		return {};
	},

	watch: {
		selectedAlarmIds: function selectedAlarmIds(newValue, oldValue) {
			var record = this.$refs.alarmlist.getAlarmRecord(newValue[newValue.length - 1]);
			this.$store.dispatch('updateSelectedAlarmRecord', record);

			this.hasRelateDevice = true;
			var $Con = $(".alarm_device_operate").eq(0);
			if ($Con.length > 0) {
				if (record.records.deviceType) {
					record.records.deviceType = "iptalk.host";
					asyncLoadVue("devices/operates/" + record.records.deviceType + ".operate.vue", $Con.get(0), { targetDeviceID: record.records.sn });
				} else {
					asyncLoadVue("devices/operates/safebox.operate.vue", $Con.get(0), { targetDeviceID: record.records.sn });
				}
			}
		}
	},
	methods: {},
	computed: {},
	created: function created() {},
	mounted: function mounted() {}
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/components/layout.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vue = __webpack_require__("./node_modules/vue/dist/vue.min.js");

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.component('togglePanel', {
  css: false,
  enter: function enter(el, done) {
    var $Panel = $(el);
    var size = $Panel.attr("size");
    var isFloat = $Panel.hasClass("float");
    var hori = $Panel.hasClass("hori");
    var aniAttrs = hori ? { width: size + "px" } : { height: size + "px" };
    if ($Panel.hasClass("first")) {
      if ($Panel.hasClass("hori")) {
        aniAttrs.left = isFloat ? SplitbarSize : 0;
      } else {
        aniAttrs.top = isFloat ? SplitbarSize : 0;
      }
    } else {
      if ($Panel.hasClass("hori")) {
        aniAttrs.right = isFloat ? SplitbarSize : 0;
      } else {
        aniAttrs.bottom = isFloat ? SplitbarSize : 0;
      }
    }
    $Panel.animate(aniAttrs, 'fast', 'swing', done);
  },
  enterCancelled: function enterCancelled(el) {
    var $Panel = $(el);
    var size = $Panel.attr("size");
    var aniAttrs = $Panel.hasClass("hori") ? { width: size + "px" } : { height: size + "px" };
    $Panel.stop();
    $Panel.css(aniAttrs);
  },
  leave: function leave(el, done) {
    var $Panel = $(el);
    var hori = $Panel.hasClass("hori");
    var aniAttrs = hori ? { width: 0 } : { height: 0 };
    var size = hori ? $Panel.width() : $Panel.height();
    $Panel.attr("size", size).animate(aniAttrs, 'fast', 'swing', done);
  },
  leaveCancelled: function leaveCancelled(el) {
    var $Panel = $(el);
    var hori = $Panel.hasClass("hori");
    var aniAttrs = hori ? { width: 0 } : { height: 0 };
    $Panel.stop();
    $Panel.css(aniAttrs);
  }
});

var PanelMinSize = 20;
var SplitbarSize = 8;

exports.default = {
  data: function data() {
    return {
      dragging: null,
      offset: 0,
      dragSplitbar: null,
      firstIsShow: true,
      lastIsShow: true
    };
  },

  methods: {
    getPanelStatus: function getPanelStatus(panel) {
      if ($(this.$el).children("." + panel + ".panel").hasClass("float")) {
        return "close";
      } else {
        return "open";
      }
    },
    closePanel: function closePanel(panel) {},
    openPanel: function openPanel(panel) {
      if (panel == "first") {} else {}
    },
    firstSplitClick: function firstSplitClick() {
      var $Panel = $(this.$el).children(".first.panel");
      if ($Panel.hasClass("float")) {
        $Panel.removeClass("float");
        this.firstIsShow = true;
      } else {
        $Panel.removeClass("float");
        this.firstIsShow = !this.firstIsShow;
      }
      this.$emit(this.firstIsShow ? "onshow" : "onhide", $Panel.get(0));
    },
    lastSplitClick: function lastSplitClick() {
      var $Panel = $(this.$el).children(".last.panel");
      this.lastIsShow = !this.lastIsShow;
      $Panel.removeClass("float");
      this.$emit(this.lastIsShow ? "onshow" : "onhide", $Panel.get(0));
    },
    onOpenFloatPanel: function onOpenFloatPanel(panel, event) {
      if ($(event.target).hasClass("splitCtrl")) {
        return;
      }
      var $Panel = $(this.$el).children("." + panel + ".panel");
      var ctlBar = $(event.target).children(".splitCtrl");
      if (this.direction == "hori") {
        if (event.offsetY > ctlBar.position().top && event.offsetY < ctlBar.position().top + ctlBar.height()) {
          return;
        }
      } else {
        if (event.offsetX > ctlBar.offset().left && event.offsetX < ctlBar.offset().left + ctlBar.width()) {
          return;
        }
      }
      if (panel == "first") {
        if (this.firstIsShow || $(event.target).hasClass("splitCtrl")) {
          return;
        }
        if ($Panel.css("display") == 'none') {
          $Panel.addClass("float");
          this.firstIsShow = true;
        }
      } else {
        if (this.lastIsShow || $(event.target).hasClass("splitCtrl")) {
          return;
        }
        if ($Panel.css("display") == 'none') {
          $Panel.addClass("float");
          this.lastIsShow = true;
        }
      }
      this.$emit("onshow", $Panel.get(0));
    },
    onCloseFloatPanel: function onCloseFloatPanel(event) {
      var self = this;
      var $Target = $(event.target);
      if ($Target.hasClass("panel") && $Target.hasClass("float")) {
        if ($Target.hasClass("first")) {
          self.firstIsShow = false;
        }
        if ($Target.hasClass("last")) {
          self.lastIsShow = false;
        }
        self.$emit("onhide", $Target.get(0));
        event.stopPropagation();
      } else {
        $(this.$el).children(".float.panel").each(function () {
          var $Panel = $(this);
          if ($Panel.hasClass("first")) {
            self.firstIsShow = false;
            self.$emit("onhide", $Panel.get(0));
            return;
          }
          if ($Panel.hasClass("last")) {
            self.lastIsShow = false;
            self.$emit("onhide", $Panel.get(0));
            return;
          }
          if ($Panel.hasClass("center")) {
            self.firstIsShow = false;
            self.$emit("onhide", $Panel.prev(".panel").get(0));
            self.lastIsShow = false;
            self.$emit("onhide", $Panel.next(".panel").get(0));
            return;
          }
        });
      }
    },
    onResizePanel: function onResizePanel(event) {
      var target = event.target || event.srcElement;
      var layoutEle = this.$el;
      var direction = this.direction;
      switch (event.type) {
        case "mousedown":

          if (target.classList.contains("splitbar")) {
            this.dragSplitbar = target;
            if (this.dragSplitbar.classList.contains("first") && (!this.firstIsShow || !this.firstPanelCanResize)) {
              event.stopPropagation();
              return;
            }
            if (this.dragSplitbar.classList.contains("last") && (!this.lastIsShow || !this.lastPanelCanResize)) {
              event.stopPropagation();
              return;
            }
            if (direction == "hori") {
              this.dragging = $(target).clone().css({ "position": "absolute", "top": 0, "background": "black", opacity: 0.2, "z-index": 9, "left": $(target).position().left }).empty().appendTo(layoutEle)[0];
            } else {
              this.dragging = $(target).clone().css({ "position": "absolute", "left": 0, "background": "black", opacity: 0.2, "z-index": 9, "top": $(target).position().top }).empty().appendTo(layoutEle)[0];
            }
            this.offset = this.direction == "hori" ? event.offsetX : event.offsetY;
            event.stopPropagation();
          }
          break;

        case "mousemove":
          if (this.dragging && event.which == 1) {
            if (direction == "hori") {
              var size = event.clientX - this.offset - $(layoutEle).offset().left;
              if (this.dragSplitbar.classList.contains("first")) {
                if (size < PanelMinSize) size = PanelMinSize;
              } else {
                var lRect = layoutEle.getBoundingClientRect();
                if (lRect.right - lRect.left - size - this.dragSplitbar.clientWidth < PanelMinSize) {
                  size = lRect.right - lRect.left - PanelMinSize - this.dragSplitbar.clientWidth;
                }
              }
              this.dragging.style.left = size + 'px';
            } else {
              var _size = event.clientY - this.offset - $(layoutEle).offset().top;
              if (this.dragSplitbar.classList.contains("first")) {
                if (_size < PanelMinSize) _size = PanelMinSize;
              } else {
                var _lRect = layoutEle.getBoundingClientRect();
                if (_lRect.bottom - _lRect.top - _size - this.dragSplitbar.clientHeight < PanelMinSize) {
                  _size = _lRect.bottom - _lRect.top - PanelMinSize - this.dragSplitbar.clientHeight;
                }
              }
              this.dragging.style.top = _size + 'px';
            }
            event.preventDefault();
          } else {
            if (this.dragging) {
              this.dragging.remove();
              event.preventDefault();
            }
            this.dragging = null;
          }
          break;
        case "mouseup":
          if (this.dragging) {
            var _lRect2 = layoutEle.getBoundingClientRect();
            if (this.dragSplitbar.classList.contains("first")) {
              if (direction == "hori") {
                if (parseInt(this.dragging.style.left) <= PanelMinSize) {
                  this.firstIsShow = false;
                } else {
                  this.dragSplitbar.previousElementSibling.style.width = this.dragging.style.left;
                }
              } else {
                if (parseInt(this.dragging.style.top) <= PanelMinSize) {
                  this.firstIsShow = false;
                } else {
                  this.dragSplitbar.previousElementSibling.style.height = this.dragging.style.top;
                }
              }
              this.$emit("onresize", this.dragSplitbar.previousElementSibling);
            } else {
              if (direction == "hori") {
                var _size2 = _lRect2.right - _lRect2.left - parseInt(this.dragging.style.left) - this.dragSplitbar.clientWidth;
                if (_size2 <= PanelMinSize) {
                  this.lastIsShow = false;
                } else {
                  this.dragSplitbar.nextElementSibling.style.width = _size2 + 'px';
                }
              } else {
                var _size3 = _lRect2.bottom - _lRect2.top - parseInt(this.dragging.style.top) - this.dragSplitbar.clientHeight;
                if (_size3 <= PanelMinSize) {
                  this.lastIsShow = false;
                } else {
                  this.dragSplitbar.nextElementSibling.style.height = _size3 + 'px';
                }
              }
              this.$emit("onresize", this.dragSplitbar.nextElementSibling);
            }
            this.dragging.remove();
            this.dragging = null;
            event.stopPropagation();
          }
          break;
      }
    }
  },
  created: function created() {
    this.firstIsShow = this.firstPanelIsShow;
    this.lastIsShow = this.lastPanelIsShow;
  },
  mounted: function mounted() {
    var self = this;
    this.$nextTick(function () {
      $(this.$el).on("mouseleave", function (event) {
        self.onCloseFloatPanel(event);
      });
    });
  },

  props: {
    fit: { type: Boolean, default: true },
    border: { type: Boolean, default: false },
    splitbar: { type: String, default: "" },
    direction: { type: String, default: "hori" },
    hasFirstPanel: { type: Boolean, default: true },
    firstPanelSize: { type: String, default: "200px" },
    firstPanelIsShow: { type: Boolean, default: true },
    firstPanelCloseable: { type: Boolean, default: true },
    hasLastPanel: { type: Boolean, default: true },
    lastPanelSize: { type: String, default: "200px" },
    lastPanelIsShow: { type: Boolean, default: true },
    lastPanelCloseable: { type: Boolean, default: true },
    firstPanelCanResize: { type: Boolean, default: true },
    lastPanelCanResize: { type: Boolean, default: true }
  }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/components/table.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _vue = __webpack_require__("./node_modules/vue/dist/vue.min.js");

var _vue2 = _interopRequireDefault(_vue);

var _menubar = __webpack_require__("./src/components/menubar.vue");

var _menubar2 = _interopRequireDefault(_menubar);

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

var _loadingMixin = __webpack_require__("./src/mixins/loading.mixin.js");

var _loadingMixin2 = _interopRequireDefault(_loadingMixin);

var _deepAssign = __webpack_require__("./node_modules/deep-assign/index.js");

var _deepAssign2 = _interopRequireDefault(_deepAssign);

__webpack_require__("./src/assets/js/semantic/components/table.min.css");

__webpack_require__("./src/assets/js/semantic/components/checkbox.min.css");

__webpack_require__("./src/assets/js/semantic/components/checkbox.min.js");

__webpack_require__("./src/assets/js/semantic/components/button.min.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = {
  components: { menubar: _menubar2.default },
  mixins: [_loadingMixin2.default],
  data: function data() {
    return {
      loading: {
        selector: ".content"
      },
      _ajax: null,
      _H: 0,
      _W: 0,
      _isLoading: false,
      _colResizing: false };
  },

  computed: {
    gridLineClasss: function gridLineClasss() {
      return "gl-" + this.gridLineStyle;
    },
    visibleCols: function visibleCols() {
      return this.cols.filter(function (col) {
        return !(col.visible === false);
      });
    },
    selectedRows: {
      get: function get() {
        return this.selected;
      },
      set: function set(newvalue) {
        var _selected;

        this.clearSelected();
        (_selected = this.selected).push.apply(_selected, _toConsumableArray(newvalue));
      }
    },
    sortRows: function sortRows() {
      var sortKey = this.sort.key;
      var sortOrder = this.sort.order;
      if (this.sort.enabled == false || sortOrder == 'none' || sortKey == '') {
        return this.rows;
      } else {
        var sortCol = this.getColumnData(sortKey);
        if (sortCol == undefined) {
          return this.rows;
        }
        return this.rows.slice().sort(function (a, b) {
          var v1 = a[sortKey],
              v2 = b[sortKey];
          var result = 0;
          if (typeof v1 == "string") {
            result = sortOrder == "asc" ? v1.localeCompare(v2) : v2.localeCompare(v1);
          } else if (typeof v1 == "number") {
            result = sortOrder == "asc" ? v1 - v2 : v2 - v1;
          } else {
            if (sortOrder == "asc") {
              result = v1 > v2 ? 1 : v1 < v2 ? -1 : 0;
            } else {
              result = v1 < v2 ? 1 : v1 > v2 ? -1 : 0;
            }
          }
          return result;
        });
      }
    }
  },
  watch: {
    "pagination.pageNumber": function paginationPageNumber(newvalue, oldvalue) {
      this._updatePagination();
    },
    "pagination.pageCount": function paginationPageCount(newvalue, oldvalue) {
      this._updatePagination();
    },
    "pagination.pageSize": function paginationPageSize(newvalue, oldvalue) {
      this._updatePagination();
    },
    "cols": function cols(newvalue, oldvalue) {
      var _this = this;

      this.$nextTick(function () {
        _this.refresh();
      });
    },
    "rows": function rows(newvalue, oldvalue) {
      var _this2 = this;

      this.$nextTick(function () {
        if (!_this2._isSync()) {
          _this2.refresh();
        }
      });
    }
  },
  methods: {
    onEnterRowDetia: function onEnterRowDetia(el, done) {
      done();
      var pk = $(el).prev("tr").attr('pk');
      this.$emit("loadrowdetial", $(el).children("td").get(0), pk);
    },
    colhtml: function colhtml(row, col) {
      return col.output ? col.output(row, col) : this.formatCell(row[col.name], row, col);
    },

    findRowByPrimary: function findRowByPrimary(pk) {
      return this.findRow(this.primary, pk);
    },

    findRows: function findRows(field, value) {
      this.rows.filter(function (row) {
        return row[field] == value;
      });
    },
    getSelectedRowsData: function getSelectedRowsData() {
      var _this3 = this;

      if (this.primary) {
        return this.rows.filter(function (row) {
          return _this3.selected.includes(row[_this3.primary]);
        });
      } else {
        return this.rows.filter(function (row, index) {
          return _this3.selected.includes(index + 1);
        });
      }
    },
    formatCell: function formatCell(value, row, col) {
      var self = this;
      function formatFromDict(val, formatter) {
        var result = val;
        if (val in formatter.values) {
          result = formatter.values[val];
        } else {
          result = formatter.values.default || val;
        }
        return result;
      }
      function formatFromIcon(val, formatter) {
        var iconClassName = "";
        if (val in formatter.icons) {
          iconClassName = formatter.icons[String(val)];
        } else {
          iconClassName = formatter.icons.default || "";
        }
        if (typeof formatter.colors == "string") {
          var color = formatter.colors;
        } else if (formatter.colors) {
          var color = val in formatter.colors ? formatter.colors[String(val)] : formatter.colors.default || '';
        }
        if (iconClassName == "") {
          return val;
        } else {
          return "<i class='" + color + " " + iconClassName + " icon'></i>";
        }
      }

      function formatFromTemplate(val, formatter) {
        var result = val;
        if (formatter.template) {
          result = formatter.template.replace("{value}", val);
          try {
            result = result.replace("{colname}", col.name);
            if (self.primary in row) {
              result = result.replace("{pk}", row[self.primary]);
            }
          } catch (e) {
            console.log("FormatTemplate error:" + e.message);
          }
        }
        return result;
      }
      function formatFromColFormatter(val, formatter) {
        var fm = this.colFormatter[col.formatter];
        if ($.isFunction(fm)) {
          return fm.apply(this, [value, row, col]);
        }
      }

      function executeFormatter(val, formatter) {
        var result = val;
        switch (formatter.type) {
          case "map":
            result = formatFromDict(val, formatter);
            break;
          case "icon":
            result = formatFromIcon(val, formatter);
            break;
          case "template":
            result = formatFromTemplate(val, formatter);
            break;
          case "prefix":
            result = formatFromTemplate(val, formatter) + val;
            break;
          case "suffix":
            result = val + formatFromTemplate(val, formatter);
            break;
        }
        return result;
      }
      try {
        var result = value;
        if (this.colFormatter) {
          if (typeof col.formatter == "string") {
            result = formatFromColFormatter(value, col.formatter);
          } else if ($.isFunction(col.formatter)) {
            result = col.formatter(value, row, col);
          } else if ($.isPlainObject(col.formatter)) {
            result = executeFormatter(value, col.formatter);
          } else if (col.name in this.colFormatter) {
            result = formatFromColFormatter(value, col.name);
          } else if ("default" in this.colFormatter) {
            result = formatFromColFormatter(value, "default");
          }
        } else {
          result = value;
        }
      } catch (e) {
        console.warn("colFormatter run error:", e.message);
      }
      return result;
    },
    getCellTips: function getCellTips(row, col) {
      var title = '';
      if (col.tips == undefined) {
        title = '';
      } else {
        var value = row[col.name];
        if (_typeof(col.tips) == "object") {
          if (value in col.tips) {
            title = col.tips[value];
          } else if ("default" in col.tips) {
            title = col.tips["default"];
          }
        } else if (typeof col.tips == "string") {
          title = col.tips.replace("{value}", value);
        } else if (col.tips == true) {
          title = value;
        } else if (typeof col.tips == "function") {
          title = col.tips(row, col);
        }
      }
      return title;
    },
    _updatePagination: function _updatePagination() {
      if (this.paging && this.showFooter) {
        var pageTextbox = this.getFooterbar().findMenuItem("name", "pagenumber");
        pageTextbox.item.text = this.pagination.pageNumber + "/" + this.pagination.pageCount;
      } else {}
    },
    getToolbar: function getToolbar() {
      return this.$refs.toolbar;
    },
    getFooterbar: function getFooterbar() {
      return this.$refs.footerbar;
    },
    _calcResizeColumnWidth: function _calcResizeColumnWidth(colname, newWidth) {
      var $CurColumn = this.getColumnHeader(colname);
      var colItem = this.getColumnData(colname);
      var minWidth = colItem.minWidth == undefined ? 1 : colItem.minWidth;
      newWidth = newWidth < minWidth ? minWidth : newWidth;

      var $NextColumn = this.getNextColumn(colname);
      if ($NextColumn.length > 0 && newWidth > $CurColumn.outerWidth()) {
        var nextColItem = this.getColumnData($NextColumn.attr("name"));
        var allowSpace = nextColItem.minWidth == undefined ? $NextColumn.outerWidth() : $NextColumn.outerWidth() - $NextColumn.minWidth;
        if (newWidth > $CurColumn.outerWidth() + allowSpace) {
          newWidth = $CurColumn.outerWidth() + allowSpace;
        }
      }
      return newWidth;
    },
    onResizeColumn: function onResizeColumn(event) {
      var $targetColumn = $(event.target || event.srcElement);
      var offsetX = $targetColumn.outerWidth() - event.offsetX;
      var $Dragbar = $(this.$el).find(".dragbar");
      switch (event.type) {
        case "mousedown":
          if ($targetColumn.hasClass("hcell") && event.which == 1 && offsetX <= 4) {
            var col = this.getColumnData($targetColumn.attr("name"));
            if (col.resizable !== false) {
              this._colResizing = true;
              $Dragbar.css({
                left: $targetColumn.offset().left + $targetColumn.width(),
                top: this.showToolbar ? $(this.$el).children(".menubar.ui.menu").outerHeight() : 0
              });
              $Dragbar.data("col", $targetColumn);
              $Dragbar.show();
            }
            event.stopPropagation();
          }
        case "mousemove":
          if (this._colResizing && event.which == 1) {
            var $NextTargetColumn = !$targetColumn.next();
            $Dragbar.css({
              left: event.clientX - $(this.$el).offset().left
            });
            event.preventDefault();
          }
          break;
        case "mouseup":
          if (this._colResizing) {
            this._onEndResizeColumn();
            this._colResizing = false;
          }
          $Dragbar.hide();
          event.stopPropagation();
          break;
      }
    },
    _onEndResizeColumn: function _onEndResizeColumn() {
      var $Dragbar = $(this.$el).find(".dragbar");
      var $Col = $Dragbar.data("col");
      var colName = $Col.attr("name");

      var oldWidth = $Col.get(0).style.width == '' ? 0 : $Col.outerWidth();
      this._colResizing = false;

      var offset = $Dragbar.offset().left - $Col.offset().left - $Col.outerWidth();
      if (Math.abs(offset) > 4) {
        var $NextCol = this.getNextColumn(colName);
        var nextColName = $NextCol.attr("name");

        if (oldWidth == 0) {
          var newWidth = this._calcResizeColumnWidth(nextColName, $NextCol.offset().left - $Dragbar.offset().left + $NextCol.outerWidth());
          $NextCol.outerWidth(newWidth);
        } else {
          var newWidth = this._calcResizeColumnWidth(colName, $Dragbar.position().left - $Col.position().left);
          var offw = newWidth - $Col.outerWidth();
          $Col.outerWidth(newWidth);
          if ($NextCol.get(0).style.width != '') {
            $NextCol.outerWidth($NextCol.outerWidth() - offw);
          }
        }
        this.refresh(1);
      }
      $Dragbar.hide();
    },
    getColumnData: function getColumnData(colname) {
      if (colname == "__selector") {
        return {
          name: "__selector",
          resizable: false,
          sortable: false
        };
      } else if (colname == "__detail") {
        return {
          name: "__detail",
          resizable: false,
          sortable: false
        };
      } else {
        return this.cols.find(function (item) {
          return item.name == colname;
        });
      }
    },
    getCells: function getCells(colname) {
      var $Ele = $(this.$el);
      var index = $Ele.find(".header>table>thead>tr>th[name=" + colname + "]").index();
      return $Ele.find(".content>table>tbody>tr td:nth-child(" + (index + 1) + ")");
    },
    getNextColumn: function getNextColumn(colname) {
      var onlyVisible = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var col = this.getColumnHeader(colname);
      return col.nextAll(".hcell:not(.hide)").first();
    },
    getColumnHeader: function getColumnHeader(colname) {
      if (this.showHeader) {
        var $Ele = $(this.$el);
        if (this._isFixedHeight()) {
          return $Ele.children(".header").find("thead>tr>th[name=" + colname + "]");
        } else {
          return $Ele.children(".content").find("thead>tr>th[name=" + colname + "]");
        }
      } else {
        return null;
      }
    },
    getColumnWidth: function getColumnWidth(colname) {
      var curColumn = this.getColumnHeader(colname);
      return curColumn.outerWidth();
    },
    findRow: function findRow(col, value) {
      return this.rows.find(function (row) {
        return row[col] == value;
      });
    },
    _columnHeaderIsSync: function _columnHeaderIsSync(colname) {
      var $Ele = $(this.$el);
      var $HCol = $Ele.children(".header").find("thead>tr>th[name=" + colname + "]");
      var index = $Ele.children(".header").find("thead>tr>th[name=" + colname + "]").index();
      var $Col = $Ele.children(".content").find("tbody>tr:first>td").eq(index);
      var $Head = $Ele.children(".header").find("thead>tr>th[name=" + colname + "]");
      var R = $Col.width() == $HCol.width();
      $Head.outerWidth($Col.outerWidth());
      return R;
    },
    _fixColumnHeaderWidth: function _fixColumnHeaderWidth() {
      var self = this;
      var $Ele = $(this.$el);
      var $HCol = $Ele.children(".header").find("thead>tr>th");
      var $CCol = $Ele.children(".content").find("thead>tr>th");
      $CCol.each(function (index, col) {
        if (col.style.width != '' && parseInt(col.style.width) != $(col).outerWidth()) {
          col.style.width = $(col).outerWidth() + "px";
        }

        if (col.style.width != '' && $HCol.get(index)) {
          $HCol.get(index).style.width = col.style.width;
        }
      });

      var w = self._getScrollCompensateWidth();
      if (w > 0) {
        var HLastCol = $Ele.children(".header").find("thead>tr>th:not(.hide)").last().get(0);
        var CLastCol = $Ele.children(".content").find("thead>tr>th:not(.hide)").last().get(0);
        HLastCol.style.width = parseInt(CLastCol.style.width) + w + "px";
      }
    },
    _syncTableHeader: function _syncTableHeader() {
      var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      if (!this._isFixedHeight()) {
        return;
      }
      var $Ele = $(this.$el);
      var $Table = $Ele.find(".content>table");
      var $HeaderTable = $Ele.find(".header>table");
      if (dir == 0) {
        var $CloneTable = $Table.clone();
        $CloneTable.css("margin-top", 0).find("tbody").remove();
        var $LastTh = $CloneTable.find("thead>tr>th:last");
        $LastTh.width($LastTh.width() + this._getScrollCompensateWidth());
        $Ele.children(".header").empty().append($CloneTable);
      } else {
        var $CloneTable = $Ele.find(".header>table>thead").clone();
        var $LastTh = $CloneTable.find("tr>th:last");
        $LastTh.outerWidth($LastTh.outerWidth() - this._getScrollCompensateWidth());
        $Ele.find(".content>table>thead").replaceWith($CloneTable);
      }

      this._fixColumnHeaderWidth();
      $Table.css({
        "margin-top": -$Table.find("thead").height() + "px"
      });
      this._bindEvents();
    },
    _bindEvents: function _bindEvents() {
      var self = this;
      var $Ele = $(this.$el);
      var $Table = $Ele.find(".content>table");
      var $HeaderTable = $Ele.find(".header>table");
      $Table.off();
      $HeaderTable.off();

      $Table.on("click", "th", function () {
        var colname = $(this).attr("name");
        self.onHeaderClick(self.getColumnData(colname));
      });
      $HeaderTable.on("click", "th", function () {
        var colname = $(this).attr("name");
        self.onHeaderClick(self.getColumnData(colname));
      });

      $Table.on("click", "th>input[name=__selector]", function () {
        var colname = $(this).parents("th").eq(0).attr("name");
        self.onCheckall(self.getColumnData(colname), this);
      });
      $HeaderTable.on("click", "th>input[name=__selector]", function () {
        var colname = $(this).parents("th").eq(0).attr("name");
        self.onCheckall(self.getColumnData(colname), this);
      });
    },
    refresh: function refresh() {
      var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      var $Ele = $(this.$el);
      var $Content = $Ele.children(".content");
      var $Table = $Content.children("table");
      if (this.showHeader && this._isFixedHeight()) {
        var CH = $Ele.height();
        var XH = 0;
        if (this.showToolbar) {
          XH = $Ele.children(".menubar").outerHeight();
        }
        if (this.showHeader) {
          XH = XH + $Table.children("thead").outerHeight();
        }
        if (this.showFooter) {
          XH = XH + $Ele.children(".footer").outerHeight();
        }
        $Content.outerHeight(CH - XH);
        $Table.css({
          "margin-top": -$Table.find("thead").height() + "px"
        });
        this._syncTableHeader(dir);
      }
    },
    _isFixedHeight: function _isFixedHeight() {
      return this.height != "auto" && this.height != "" || this.fit;
    },
    scrollToRow: function scrollToRow(row) {
      var targetRow = this.getRowElement(row);
      if (targetRow) {
        var Content = $(this.$el).children(".content").get(0);
        $(Content).animate({
          scrollTop: targetRow.offsetTop
        });
      }
    },
    _getScrollCompensateWidth: function _getScrollCompensateWidth() {
      try {
        var $Ele = $(this.$el);
        var Content = $Ele.children(".content").get(0);
        var $lastTd = $Ele.find(".content>table>thead>tr>th:not(.hide)").last();
        return $(Content).width() - $lastTd.get(0).offsetLeft - $lastTd.outerWidth();
      } catch (e) {}
    },
    _isSync: function _isSync() {
      var self = this;
      var $Ele = $(this.$el);
      var $HeaderThs = $Ele.find(".header>table>thead>tr>th");
      var $ContentThs = $Ele.find(".content>table>thead>tr>th");
      if ($HeaderThs.length != $ContentThs.length) {
        return false;
      } else {
        var isSync = true;
        $HeaderThs.each(function (index, td) {
          if (index == $HeaderThs.length - 1) {
            isSync = $ContentThs.eq(index).width() + self._getScrollCompensateWidth() == $(td).width();
          } else {
            if (isSync) {
              isSync = $ContentThs.eq(index).width() == $(td).width();
            }
          }
        });
        return isSync;
      }
    },
    listenResize: function listenResize() {
      var _this4 = this;

      if (!this.fit || this.height == "auto" || this.height == "") {
        setInterval(function () {
          if (_this4._W != $(_this4.$el).width() || _this4._H != $(_this4.$el).height()) {
            _this4._W = $(_this4.$el).width();
            _this4._H = $(_this4.$el).height();
            _this4.$emit("resize");
          }
        }, 300);
      }
    },
    _addSelected: function _addSelected(item) {
      if (this.selected.indexOf(item) == -1) {
        this.selected.push(item);
        this.$emit("selectchange", this.selected);
      }
    },
    _toggleSelected: function _toggleSelected(item) {
      if (this.selected.indexOf(item) == -1) {
        this._addSelected(item);
      } else {
        this._removeSelected(item);
      }
    },
    _removeSelected: function _removeSelected(item) {
      var n = this.selected.indexOf(item);
      if (n != -1) {
        this.selected.splice(n, 1);
        this.$emit("selectchange", this.selected);
      }
    },
    clearSelected: function clearSelected() {
      this.selected.splice(0, this.selected.length);
      this.$emit("selectchange", this.selected);
    },
    onCheckall: function onCheckall(col, checkbox) {
      if (checkbox.checked) {
        var _selected2;

        var self = this;
        this.clearSelected();
        var sels = this.rows.map(function (item, index) {
          if (self.primary == "") {
            return index + 1;
          } else {
            return item[self.primary];
          }
        });
        (_selected2 = this.selected).push.apply(_selected2, _toConsumableArray(sels));
      } else {
        this.clearSelected();
      }
    },
    getRowElement: function getRowElement(rowpk) {
      var pk = rowpk;
      if ((typeof rowpk === "undefined" ? "undefined" : _typeof(rowpk)) == "object") {
        pk = rowpk[this.primary];
      }
      if (rowpk == "last") {
        return $(this.$el).find(".content>table>tbody>tr:last").get(0);
      } else if (rowpk == "first") {
        return $(this.$el).find(".content>table>tbody>tr:first").get(0);
      } else {
        return $(this.$el).find(".content>table>tbody>tr[pk=" + pk + "]").get(0);
      }
    },
    onRowExpand: function onRowExpand(row, event) {
      row.expand = !row.expand;
      this.$nextTick(function () {
        this.$emit("rowexpand", row, $(event.target).parents("tr").eq(0).next().get(0));
      });
      event.stopPropagation();
    },
    _isClickCellControl: function _isClickCellControl(ele) {
      var result = false;
      var tagName = ele.tagName;
      if (tagName == "INPUT") {
        result = true;
      } else if (tagName == "BUTTON") {
        result = true;
      } else if (tagName == "A") {
        result = true;
      } else {
        var tagNames = $(ele).parents().map(function (v, item) {
          return item.tagName;
        }).toArray();
        result = tagNames.some(function (tag) {
          return tag == "A" || tag == "BUTTON";
        });
      }
      return result;
    },
    onRowClick: function onRowClick(row, event) {
      var $RowEle = $(event.target).parents("tr").eq(0);
      var rowSelector = $RowEle.find("td>input[type=checkbox][name=__selector]").get(0);
      var target = event.target;
      var isClickSelector = event.target == rowSelector;
      var isClickControl = this._isClickCellControl(target);
      if (isClickSelector && isClickControl) {
        return false;
      }
      if (this.primary) {
        if (!this.multiSelect || !isClickSelector && !rowSelector.checked && this.multiSelect && !event.ctrlKey) {
          this.clearSelected();
        }
        if (this.multiSelect && event.ctrlKey && !isClickSelector || isClickSelector && rowSelector.checked) {
          this._addSelected(row[this.primary]);
        } else {
          if (isClickControl) {
            this._addSelected(row[this.primary]);
          } else {
            this._toggleSelected(row[this.primary]);
          }
        }
      } else {
        if (!this.multiSelect || !rowSelector.checked && this.multiSelect && !event.ctrlKey) {
          this._getTableElement().find("tbody>tr." + this.selectedClasss).removeClass(this.selectedClasss);
          this.clearSelected();
        }
        var $SelRow = $(event.target).parents("tr").eq(0);
        $SelRow.toggleClass(this.selectedClasss);
        if ($SelRow.hasClass(this.selectedClasss)) {
          this._toggleSelected($SelRow.index() + 1);
        } else {
          this._removeSelected($SelRow.index() + 1);
        }
      }
      this.$emit("rowclick", row);
    },
    onCellClick: function onCellClick(row, cell, $event) {
      this.$emit("cellclick", row, cell);
    },
    onLoadingRetry: function onLoadingRetry() {
      this.loadTableData(this._newPage);
    },
    onLoadingCancel: function onLoadingCancel() {
      this._isLoading = false;
      this._updatePagination();
    },
    onHeaderClick: function onHeaderClick(col) {
      var _this5 = this;

      if (this.sort.enabled && col.sortable) {
        this.sort.key = col.name;
        if (this.sort.order == "asc") {
          this.sort.order = "desc";
        } else if (this.sort.order == "desc") {
          this.sort.order = "asc";
        } else {
          this.sort.order = "asc";
        }
        this.$nextTick(function () {
          _this5._syncTableHeader(0);
          _this5._fixColumnHeaderWidth();
        });
      }
      this.$emit("headerclick", col);
    },
    _getTableElement: function _getTableElement() {
      return $(this.$el).children(".content").children("table");
    },
    _checkRowsData: function _checkRowsData(rowsData) {
      if (rowsData.length > 0) {
        var row = rowsData[0];
        var colnames = this.cols.map(function (col) {
          return col.name;
        });
        for (var colname in row) {
          if (!colnames.includes(colname)) {
            return false;
          }
        }
        return true;
      } else {
        return true;
      }
    },
    _createLoadContext: function _createLoadContext(pageNum) {
      var self = this;
      return new function () {
        var that = this;
        that.cancel = function () {
          self._updatePagination();
          self.hideLoading();
          self._isLoading = false;
        }, that.success = function (paging) {
          if (typeof paging == "number") {
            paging = {
              pageNumber: paging,
              pageCount: self.pagination.pageCount,
              pageSize: self.pagination.pageSize
            };
          }
          self.pagination.pageNumber = paging.pageNumber;
          self.pagination.pageCount = paging.pageCount;
          self.pagination.pageSize = paging.pageSize;
          self._updatePagination();
          self.hideLoading();
          self._isLoading = false;
          self.$nextTick(function () {
            self.scrollToRow("last");
          });
        };

        that.fail = function (msg) {
          self.retryLoading(null, msg);
        };

        that.updateRows = function () {
          var _self$rows;

          var rows = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

          var isValid = self._checkRowsData(rows);
          if (!isValid) {
            throw new Error("rows'data is invalid!");
          }
          self.rows.length = 0;
          (_self$rows = self.rows).push.apply(_self$rows, _toConsumableArray(rows));
        };

        that.newPage = pageNum;
        that.pageNumber = self.pagination.pageNumber;
        that.pageCount = self.pagination.pageCount;
        that.pageSize = self.pagination.pageSize;
        that.paging = self.paging;
      }();
    },
    loadTableData: function loadTableData(pageNum) {
      pageNum = pageNum > this.pagination.pageCount ? this.pagination.pageCount : pageNum;
      pageNum = pageNum < 1 ? 1 : pageNum;
      this._isLoading = true;

      this.showLoading();
      if (this.dataMode == "ajax") {
        this.ajaxLoadData(pageNum, this._createLoadContext(pageNum));
      } else {
        this.$emit("loaddata", this._createLoadContext(pageNum));
      }
    },
    ajaxLoadData: function ajaxLoadData(pageNum, context) {
      var self = this;
      if (this.sort) {
        var params = Object.assign({
          sortkey: this.sort.key,
          sortorder: this.sort.order
        }, this.pagination);
      } else {
        var params = this.pagination;
      }
      params.pageNumber = pageNum;
      this._ajax = _webservice2.default.getJSON(this.url, params, function (response) {
        if (response.status == "success") {
          var pageInfo = {
            pageNumber: response.result.pageNumber,
            pageCount: response.result.pageCount,
            pageSize: response.result.pageSize
          };

          if (response.result.fields) {
            var _self$cols;

            self.cols.length = 0;
            (_self$cols = self.cols).push.apply(_self$cols, _toConsumableArray(response.result.fields));
          }

          if (self.cols.length > 0) {
            if (self.paging) {
              var _self$rows2;

              self.rows.length = 0;
              (_self$rows2 = self.rows).push.apply(_self$rows2, _toConsumableArray(response.result.records));
            } else {
              var _self$rows3;

              (_self$rows3 = self.rows).push.apply(_self$rows3, _toConsumableArray(response.result.records));
            }
          }
          context.success(pageInfo);
        } else {
          context.fail(response.message);
        }
      }).fail(function (e) {
        context.fail(e.responseText);
      });
    },
    onLoadMore: function onLoadMore() {
      if (this.pagination.pageNumber < this.pagination.pageCount) {
        this.loadPage({ name: "next" });
      }
    },
    loadPage: function loadPage(item) {
      if (this._isLoading) {
        return;
      }
      var newPage = this.pagination.pageNumber;
      switch (item.name) {
        case "first":
          newPage = 1;
          break;
        case "previous":
          newPage -= 1;
          break;
        case "next":
          newPage += 1;
          break;
        case "last":
          newPage = this.pagination.pageCount;
          break;
      }
      newPage = newPage > this.pagination.pageCount ? this.pagination.pageCount : newPage;
      this.loadTableData(newPage);
    },
    _addDefaultFooterButtons: function _addDefaultFooterButtons() {
      var _this6 = this;

      var buttons = [{ name: "first", click: "pagechange", icon: "angle double left", tips: "首页" }, { name: "previous", click: "pagechange", icon: "angle left", tips: "上一页" }, { name: "pagenumber", type: "textbox", text: "1/1", align: "center", width: 80, expandWidth: 120, change: "pagenumberchange" }, { name: "next", click: "pagechange", icon: "angle right", tips: "下一页" }, { name: "last", click: "pagechange", icon: "angle double right", tips: "最后一页" }, { icon: "refresh", click: "refreshdata", showText: false, right: true }];
      buttons.forEach(function (btn) {
        if (_this6.footerbar.findIndex(function (button) {
          return button.name == btn.name;
        }) == -1) {
          _this6.footerbar.push(btn);
        }
      });
    },
    _addDefaultToolbarButtons: function _addDefaultToolbarButtons() {
      var _this7 = this;

      var buttons = [{ name: "refresh", text: L("刷新"), icon: "refresh", click: "refreshdata" }, { name: "edit", text: L("编辑"), icon: "edit", click: "onEdit" }, { name: "add", text: L("增加"), icon: "plus", "tips": "增加", click: "onAdd" }, { name: "delete", text: L("删除"), icon: "remove", click: "onDelete" }, { name: "search", change: "onSearch", icon: "find", "tips": L("搜索"), type: "search", right: true }, { name: "filter", icon: "filter", "tips": L("过滤"), right: true }, { name: "find", icon: "find", "tips": L("高级搜索"), right: true }];
      buttons.forEach(function (btn) {
        if (_this7.toolbar.findIndex(function (button) {
          return button.name == btn.name;
        }) == -1) {
          _this7.toolbar.push(btn);
        }
      });
    },
    initComponents: function initComponents() {
      $(this.$el).find('.ui.checkbox').checkbox();
    }
  },
  created: function created() {
    if (this.useDefaultFooter) {
      this._addDefaultFooterButtons();
    }
    if (this.useDefaultToolbar) {
      this._addDefaultToolbarButtons();
    }
    this.registerEvents({
      refreshdata: function refreshdata(item, $event) {
        this.loadTableData(this.pagination.pageNumber);
      },

      pagechange: function pagechange(item, $event) {
        this.loadPage(item);
      },
      pagenumberchange: function pagenumberchange(item, $event) {
        if (this._isLoading) {
          return;
        }
        if (item.text.indexOf("/") == -1) {
          var self = this;
          var newPage = parseInt(item.text);
          this.loadTableData(newPage);
        }
      },
      resize: function resize(item, $event) {
        if (!this._colResizing) {
          this.refresh();
        }
      }
    });
  },
  mounted: function mounted() {
    var _this8 = this;

    this.$nextTick(function () {
      _this8.initComponents();
      _this8._W = $(_this8.$el).width();
      _this8._H = $(_this8.$el).height();
      _this8.refresh();
      _this8.listenResize();
      _this8._updatePagination();
      _this8._bindEvents();

      if (_this8.dataMode == "ajax") {
        _this8.loadTableData(1);
      }
    });
  },

  props: {
    classes: { type: String, default: "" },
    selectedClasss: { type: String, default: "selected" },
    multiSelect: { type: Boolean, default: true },
    showBorder: { type: Boolean, default: true },
    showToolbar: { type: Boolean, default: true },
    showFooter: { type: Boolean, default: true },
    showDetialRow: { type: Boolean, default: false },
    showHeader: { type: Boolean, default: true },
    showSelector: { type: Boolean, default: true },
    gridLineStyle: { type: String, default: "gl-none" },
    gridLine: { type: String, default: "gl-none" },
    paging: { type: Boolean, default: true },
    dataMode: { type: String, default: "local" },
    rowFormatter: Function,
    colFormatter: { type: Object, default: function _default() {} },
    cols: { type: Array, default: function _default() {
        return [];
      } },
    rows: { type: Array, default: function _default() {
        return [];
      } },
    sort: { type: Object, default: function _default() {
        return {
          enabled: true,
          range: "local",
          key: "",
          order: "none" };
      }
    },
    url: { type: String, default: "" },
    useDefaultFooter: { type: Boolean, default: true },
    useDefaultToolbar: { type: Boolean, default: true },
    toolbar: { type: Array, default: function _default() {
        return [];
      } },
    footerbar: { type: Array, default: function _default() {
        return [];
      } },
    fit: { type: Boolean, default: false },
    height: { type: String, default: 'auto' },
    primary: { type: String, default: "id" },
    selected: { type: Array, default: function _default() {
        return [];
      } },
    pagination: { type: Object, default: function _default() {
        return {
          pageNumber: 1,
          pageCount: 1,
          pageSize: 20
        };
      } },
    header: { type: Object, default: function _default() {
        return {
          compact: false,
          classes: ""
        };
      } }
  }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/components/tree.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__("./node_modules/ztree/js/jquery.ztree.all.js");

__webpack_require__("./node_modules/ztree/css/zTreeStyle/zTreeStyle.css");

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: {},
	data: function data() {
		var map = new Map();
		return {
			treeObj: null,
			asyncLock: map,
			setting: {
				view: {
					showLine: true,
					selectedMulti: false,
					showIcon: true
				},
				data: {
					keep: {
						leaf: true,
						parent: true
					},
					simpleData: {
						enable: true
					}
				},
				callback: {
					beforeExpand: this.onLoadChildren,
					beforeDragOpen: this.beforeDragOpen,
					beforeDrop: this.beforeDrop,
					onClick: this.onTreeItemClick,
					onDrop: this.onDrop
				},
				edit: {
					enable: this.isMove || this.showRenameBtn || this.showRemoveBtn,
					showRemoveBtn: this.showRemoveBtn,
					showRenameBtn: this.showRenameBtn,
					drag: {
						isMove: this.isMove,
						prev: this.movePrevOrNext,
						next: this.movePrevOrNext,
						autoOpenTime: 0
					}
				}
			}
		};
	},

	props: {
		items: { type: Array, default: [] },
		async: { type: Boolean, default: true },
		asyncURL: { type: String, default: "loadChildrentrees" },
		scroll: { type: Boolean, default: true },
		ztreeID: { type: String, default: "ztree" },
		notOpen: { type: String, default: "没有访问的权限" },
		isMove: { type: Boolean, default: false },
		movePrevOrNext: { type: Boolean, default: false },
		showRenameBtn: { type: Boolean, default: false },
		showRemoveBtn: { type: Boolean, default: false },
		beforeDrop: { type: Function, default: null } },
	watch: {
		items: function items(newValue, oldValue) {
			this.beforeCreate();
		}
	},
	methods: {
		beforeCreate: function beforeCreate() {
			$.fn.zTree.init($("#" + this.ztreeID), this.setting, this.items);
			this.treeObj = $.fn.zTree.getZTreeObj(this.ztreeID);
		},
		getTreeObj: function getTreeObj() {
			if (this.treeObj == null) {
				this.treeObj = $.fn.zTree.getZTreeObj(this.ztreeID);
			}
			return this.treeObj;
		},
		onLoadChildren: function onLoadChildren(treeId, treeNode) {
			var notOpenMsg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

			var self = this;
			if (this.async && treeNode.isParent && (treeNode.children == undefined || treeNode.children.length == 0)) {
				if (this.asyncLock.get(treeNode.id)) {
					return false;
				}
				this.asyncLock.set(treeNode.id, true);
				var jqobj = $("#" + treeNode.tId + "_switch");
				jqobj.addClass("loading");
				_webservice2.default.getJSON(this.asyncURL, { id: treeNode.id }, function (response) {
					jqobj.removeClass("loading");
					if (response.status == "success" && response.result && response.result.length > 0) {
						self.treeObj.addNodes(treeNode, 0, response.result, false);
					} else {
						if (notOpenMsg) {
							alert(self.notOpen);
						}
					}
					self.asyncLock.delete(treeNode.id);
				});
				return false;
			}
			return true;
		},
		onTreeItemClick: function onTreeItemClick(event, treeId, treeNode, clickFlag) {
			this.$emit("item-click", treeNode);
		},
		beforeDragOpen: function beforeDragOpen(treeId, treeNode) {
			this.onLoadChildren(treeId, treeNode, false);
		},
		onDrop: function onDrop(event, treeId, treeNodes, targetNode, moveType, isCopy) {
			this.$emit("item-drop", treeNodes, targetNode, moveType);
		}
	},
	mounted: function mounted() {
		this.beforeCreate();
	},
	destroyed: function destroyed() {
		this.asyncLock.clear();
	}
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-463d7590\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/layout.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.layout[data-v-463d7590]{\n  position: relative;\n  padding:0px;\n  background: #FAFAFA; \n  display: flex;\n  align-items:stretch;\n}\n.layout .panel[data-v-463d7590]{\n  position: relative;\n}\n.layout.hori[data-v-463d7590]{\n  flex-direction:row;\n}\n.layout.vert[data-v-463d7590]{\n  flex-direction:column;\n}\n.layout.fit[data-v-463d7590]{\n  position: absolute;\n  top:0px;\n  left:0px;\n  width:100%;\n  height:100%;\n}\n.layout > div[data-v-463d7590]{\n  /*position: relative;*/\n}\n.layout > div.center[data-v-463d7590]{\n  top:0px;\n  flex:1;\n}\n.layout > div.panel.float[data-v-463d7590]{\n  z-index: 9;\n}\n.layout > div.hori.first.float[data-v-463d7590]{\n  position: absolute;\n  height:100%;\n  background: #FAFAFA;\n  border-right:1px solid #DEDEDE;\n  box-shadow: 2px 0px 8px #dedede;\n}\n.layout > div.hori.last.float[data-v-463d7590]{\n  position: absolute;\n  height:100%;\n  background: #FAFAFA;\n  border-left:1px solid #DEDEDE;\n  box-shadow: -2px 0px 10px #dedede;\n  right:-8px;\n}\n.layout > div.vert.first.float[data-v-463d7590]{\n  position: absolute;\n  width:100%;\n  background: #FAFAFA;\n  border-bottom:1px solid #DEDEDE;\n  box-shadow: 0px 2px 8px #dedede;\n}\n.layout > div.vert.last.float[data-v-463d7590]{\n  position: absolute;\n  width:100%;\n  background: #FAFAFA;\n  border-top:1px solid #DEDEDE;\n  box-shadow: 0px -2px 10px #dedede;\n}\n\n/*分割条*/\n.layout > div.splitbar[data-v-463d7590]{    \n  position: relative;\n  background: white;    \n  flex-shrink:0;\n  box-sizing:border-box;\n  border:0px;\n}\n.layout > div.hori.splitbar[data-v-463d7590]{\n  border-left:1px solid #DEDEDE;\n  border-right:1px solid #DEDEDE;\n  height:100%;\n  width:8px;\n  cursor: e-resize;\n}\n.layout > div.vert.splitbar[data-v-463d7590]{\n  border-top:1px solid #DEDEDE;\n  border-bottom:1px solid #DEDEDE;\n  width:100%;\n  height:8px;\n  cursor: s-resize;\n}\n.layout > div.splitbar>.splitCtrl[data-v-463d7590]{\n  position:absolute;\n  box-sizing:border-box;\n  background: white;\n  cursor: pointer;\n  font-size: 4px;\n}\n.layout > div.hori.splitbar>.splitCtrl[data-v-463d7590]{\n  top:45%;\n  left:0px;\n  height:10%;\n  width: 100%;\n  border-top:1px solid #DADADA;\n  border-bottom:1px solid #DADADA;\n}\n.layout > div.vert.splitbar>.splitCtrl[data-v-463d7590]{\n  top:0px;\n  left:45%;\n  width:10%;\n  height: 100%;\n  border-left:1px solid #DADADA;\n  border-right:1px solid #DADADA;\n}\n.layout > div.splitbar>.splitCtrl[data-v-463d7590]:hover{\n  background: #DEDEDE;\n  color:white;\n}\n.layout div[slot][data-v-463d7590]{\n  position: absolute;\n  top:0px;\n  left:0px;\n  width:100%;\n  height: 100%;\n}\n\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-53f06f84\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/components/tree.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\r\n/*ul.ztree li span{\r\n\tfont-size: 1.17em;\r\n}\r\nul.ztree li a{\r\n\theight:2.34em;\r\n\tpadding: 4px;\r\n}\r\nul.ztree li a.curSelectedNode{\r\n\theight:2.34em;\r\n\tpadding: 4px;\r\n}\r\nul.ztree li span.button.switch{\r\n\tbackground-image: none;\r\n}\r\n.ztree li span.button.ico_open,\r\n.ztree li span.button.ico_close,\r\n.ztree li span.button.ico_docu{\r\n\r\n}\r\n.ztree li span.button.switch.roots_open,\r\n.ztree li span.button.switch.center_open,\r\n.ztree li span.button.switch.bottom_open\r\n{\r\n\tmargin: 4px 4px 0px 4px;\r\n\twidth:0;\r\n\theight:0;\r\n\tborder-top:8px solid transparent;\r\n\tborder-bottom:8px solid transparent;\r\n\tborder-left:8px solid #0066cc;\r\n}\r\n.ztree li span.button.switch.roots_close,\r\n.ztree li span.button.switch.center_close,\r\n.ztree li span.button.switch.bottom_close\r\n{\r\n\tmargin: 4px 0px 0px 0px;\r\n\twidth:0;\r\n\theight:0;\r\n\tborder-left:8px solid transparent;\r\n\tborder-right:8px solid transparent;\r\n\tborder-top:8px solid #0066cc;\r\n}\r\n.ztree li span.button.loading.switch.roots_close,\r\n.ztree li span.button.loading.switch.center_close,\r\n.ztree li span.button.loading.switch.bottom_close\r\n{\r\n\twidth:16px;\r\n\theight:16px;\r\n\tborder-radius:50%;\r\n\tborder:2px solid #767676;\r\n\tborder-right-color:transparent;\r\n\t-webkit-transform: rotate(360deg); \r\n\t-webkit-animation: spin 1s linear infinite; \r\n}\r\n@-webkit-keyframes spin { \r\n\tfrom {-webkit-transform: rotate(0deg);} \r\n\tto {-webkit-transform: rotate(360deg);} \r\n}\r\n@keyframes spin { \r\n\tfrom {transform: rotate(0deg);} \r\n\tto {transform: rotate(360deg);} \r\n}*/\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-53f06f84\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/tree.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.treevue[data-v-53f06f84]{\r\n\tposition: relative;\r\n\twidth: 100%;\r\n\theight: 100%;\n}\n.scroll[data-v-53f06f84]{\r\n\toverflow-y: auto;\n}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6675a1b6\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/alarm/components/alarm.list.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6e1460ac\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/alarm/components/alarm.manage.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-9761ce50\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/table.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.zwxtable[data-v-9761ce50]{\n   position: relative;\n   padding:0px;\n}\n.zwxtable .dragbar[data-v-9761ce50]{\n   display:none;\n   background:#AAA;\n   opacity: 0.7;\n   position: absolute;\n   top:0px;\n   left:0px;\n   bottom:0px;\n   width:1px;\n   z-index: 9;\n}\n.zwxtable.border[data-v-9761ce50]{\n   border:1px solid #D4D4D5 ;\n}\n.zwxtable.fit[data-v-9761ce50]{\n   position: absolute;\n   top:0px;\n   left:0px;\n   right:0px;\n   /*width: 100%;*/\n   height: 100%;\n}\n.zwxtable.fixedheight[data-v-9761ce50]{\n}\n.zwxtable>.header[data-v-9761ce50]{\n   width: 100%; \n   z-index:9;\n   background:#FBFBFB;\n}\n.zwxtable>.header>table[data-v-9761ce50]{\n   border:none;\n   border-radius: 0;\n}\n.zwxtable>.header>table>thead[data-v-9761ce50]{\n   opacity:1;\n}\n.zwxtable>.header>table>thead.compact>tr>th[data-v-9761ce50]{\n   padding:4px;\n   padding-top:5px;\n   padding-bottom: 5px;\n}\n.zwxtable>.header>table th[data-v-9761ce50],.zwxtable>.content>table th[data-v-9761ce50]{\n   position: relative;\n   text-align: center;\n   cursor: pointer;\n}\n.zwxtable>.header>table th[data-v-9761ce50]:before,.zwxtable>.content>table th[data-v-9761ce50]:before{\n   content: ' ';\n   position:absolute;\n   top:0px;\n   right:-3px;\n   height:100%;\n   width:5px;\n   cursor:ew-resize;\n   z-index: 9;\n}\n.zwxtable span.row-detail-switch[data-v-9761ce50]{\n   display: block;\n   height:15px;\n   width:15px;\n   border:1px solid #DDD;\n   position:relative;\n   font-size: 9px;\n   cursor: pointer;\n}\n.zwxtable span.row-detail-switch[data-v-9761ce50]:before{\n   content: \"+\";\n   position:absolute;\n   top:-3px;\n   left:3px;\n}\n.zwxtable span.row-detail-switch.expand[data-v-9761ce50]:before{\n   content: \"-\";\n   position:absolute;\n   top:-4px;\n   left:5px;\n}\n.zwxtable>.header>table th.left[data-v-9761ce50]{\n   text-align:left;\n}\n.zwxtable>.header>table th.right[data-v-9761ce50]{\n   text-align:left;\n}\n.zwxtable>.content[data-v-9761ce50]{\n     position: relative;\n}\n.zwxtable.fixedheight>.content[data-v-9761ce50]{\n   overflow-y:auto; \n   overflow-x:hidden;\n}\n.zwxtable>.content>table[data-v-9761ce50]{\n   margin:0px;\n   border:none;\n}\n.zwxtable.fixedheight>.content>table>thead[data-v-9761ce50]{\n   opacity:0;\n}\n.zwxtable>.content>table>thead[data-v-9761ce50] {\n}\n.zwxtable>.content>table>thead.compact>tr>th[data-v-9761ce50]{\n   padding:4px;\n   padding-top:5px;\n   padding-bottom: 5px;\n}\n.zwxtable>.content tr.selected[data-v-9761ce50]{\n   background: #2185D0!important;\n   color:white!important;\n}\n.zwxtable>.content tr.paging td[data-v-9761ce50]{\n   text-align:center;\n   color:#999;\n   background: #EEE;\n}\n.zwxtable>.content tr.paging td>span[data-v-9761ce50]{\n   padding:1em;\n   padding-left:3em;\n   padding-right:3em;\n   cursor:pointer;\n}\n /*排序图标*/\n.zwxtable .sort.icon[data-v-9761ce50]{\n   float:right;\n   color:#AAA;\n}\n.zwxtable .sort.icon[data-v-9761ce50]:hover{\n   color:red;\n}\n.zwxtable>.footer[data-v-9761ce50]{\n   background: #F9FAFB;\n   position: relative;\n   height:3em;\n   border-top:1px solid #D4D4D5;\n}\n.zwxtable input[type=checkbox][data-v-9761ce50]{\n   cursor: pointer;\n}\n.expandrow-enter-active[data-v-9761ce50], .expandrow-leave-active[data-v-9761ce50] {\n   transition: opacity .5s;\n}\n.expandrow-enter[data-v-9761ce50], .expandrow-leave-active[data-v-9761ce50] {\n   opacity: 0;\n}\n\n\n\n\n /* 表格线样式*/\n/*\n   none:无线条\n   solid:实线\n   dotted:点线\n   dashed:\n*/\n \n\n\n\n\n", ""]);

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

/***/ "./node_modules/css-loader/index.js!./src/assets/js/semantic/components/table.min.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "/*!\r\n * # Semantic UI 2.2.10 - Table\r\n * http://github.com/semantic-org/semantic-ui/\r\n *\r\n *\r\n * Released under the MIT license\r\n * http://opensource.org/licenses/MIT\r\n *\r\n */.ui.table{width:100%;background:#FFF;margin:1em 0;border:1px solid rgba(34,36,38,.15);box-shadow:none;border-radius:.28571429rem;text-align:left;color:rgba(0,0,0,.87);border-collapse:separate;border-spacing:0}.ui.table:first-child{margin-top:0}.ui.table:last-child{margin-bottom:0}.ui.table td,.ui.table th{-webkit-transition:background .1s ease,color .1s ease;transition:background .1s ease,color .1s ease}.ui.table thead{box-shadow:none}.ui.table thead th{cursor:auto;background:#F9FAFB;text-align:inherit;color:rgba(0,0,0,.87);padding:.92857143em .78571429em;vertical-align:inherit;font-style:none;font-weight:700;text-transform:none;border-bottom:1px solid rgba(34,36,38,.1);border-left:none}.ui.table thead tr>th:first-child{border-left:none}.ui.table thead tr:first-child>th:first-child{border-radius:.28571429rem 0 0}.ui.table thead tr:first-child>th:last-child{border-radius:0 .28571429rem 0 0}.ui.table thead tr:first-child>th:only-child{border-radius:.28571429rem .28571429rem 0 0}.ui.table tfoot{box-shadow:none}.ui.table tfoot th{cursor:auto;border-top:1px solid rgba(34,36,38,.15);background:#F9FAFB;text-align:inherit;color:rgba(0,0,0,.87);padding:.78571429em;vertical-align:middle;font-style:normal;font-weight:400;text-transform:none}.ui.table tfoot tr>th:first-child{border-left:none}.ui.table tfoot tr:first-child>th:first-child{border-radius:0 0 0 .28571429rem}.ui.table tfoot tr:first-child>th:last-child{border-radius:0 0 .28571429rem}.ui.table tfoot tr:first-child>th:only-child{border-radius:0 0 .28571429rem .28571429rem}.ui.table tr td{border-top:1px solid rgba(34,36,38,.1)}.ui.table tr:first-child td{border-top:none}.ui.table td{padding:.78571429em;text-align:inherit}.ui.table>.icon{vertical-align:baseline}.ui.table>.icon:only-child{margin:0}.ui.table.segment{padding:0}.ui.table.segment:after{display:none}.ui.table.segment.stacked:after{display:block}@media only screen and (max-width:767px){.ui.table:not(.unstackable){width:100%;padding:0}.ui.table:not(.unstackable) tbody,.ui.table:not(.unstackable) tr,.ui.table:not(.unstackable) tr>td,.ui.table:not(.unstackable) tr>th{width:auto!important;display:block!important}.ui.table:not(.unstackable) tfoot,.ui.table:not(.unstackable) thead{display:block}.ui.table:not(.unstackable) tr{padding-top:1em;padding-bottom:1em;box-shadow:0 -1px 0 0 rgba(0,0,0,.1) inset!important}.ui.table:not(.unstackable) tr>td,.ui.table:not(.unstackable) tr>th{background:0 0;border:none!important;padding:.25em .75em!important;box-shadow:none!important}.ui.table:not(.unstackable) td:first-child,.ui.table:not(.unstackable) th:first-child{font-weight:700}.ui.definition.table:not(.unstackable) thead th:first-child{box-shadow:none!important}}.ui.table td .image,.ui.table td .image img,.ui.table th .image,.ui.table th .image img{max-width:none}.ui.structured.table{border-collapse:collapse}.ui.structured.table thead th{border-left:none;border-right:none}.ui.structured.sortable.table thead th{border-left:1px solid rgba(34,36,38,.15);border-right:1px solid rgba(34,36,38,.15)}.ui.structured.basic.table th{border-left:none;border-right:none}.ui.structured.celled.table tr td,.ui.structured.celled.table tr th{border-left:1px solid rgba(34,36,38,.1);border-right:1px solid rgba(34,36,38,.1)}.ui.definition.table thead:not(.full-width) th:first-child{pointer-events:none;background:0 0;font-weight:400;color:rgba(0,0,0,.4);box-shadow:-1px -1px 0 1px #FFF}.ui.definition.table tfoot:not(.full-width) th:first-child{pointer-events:none;background:0 0;font-weight:rgba(0,0,0,.4);color:normal;box-shadow:1px 1px 0 1px #FFF}.ui.celled.definition.table thead:not(.full-width) th:first-child{box-shadow:0 -1px 0 1px #FFF}.ui.celled.definition.table tfoot:not(.full-width) th:first-child{box-shadow:0 1px 0 1px #FFF}.ui.definition.table tr td.definition,.ui.definition.table tr td:first-child:not(.ignored){background:rgba(0,0,0,.03);font-weight:700;color:rgba(0,0,0,.95);text-transform:'';box-shadow:'';text-align:'';font-size:1em;padding-left:'';padding-right:''}.ui.definition.table td:nth-child(2),.ui.definition.table tfoot:not(.full-width) th:nth-child(2),.ui.definition.table thead:not(.full-width) th:nth-child(2){border-left:1px solid rgba(34,36,38,.15)}.ui.table td.positive,.ui.table tr.positive{box-shadow:0 0 0 #A3C293 inset;background:#FCFFF5!important;color:#2C662D!important}.ui.table td.negative,.ui.table tr.negative{box-shadow:0 0 0 #E0B4B4 inset;background:#FFF6F6!important;color:#9F3A38!important}.ui.table td.error,.ui.table tr.error{box-shadow:0 0 0 #E0B4B4 inset;background:#FFF6F6!important;color:#9F3A38!important}.ui.table td.warning,.ui.table tr.warning{box-shadow:0 0 0 #C9BA9B inset;background:#FFFAF3!important;color:#573A08!important}.ui.table td.active,.ui.table tr.active{box-shadow:0 0 0 rgba(0,0,0,.87) inset;background:#E0E0E0!important;color:rgba(0,0,0,.87)!important}.ui.table tr td.disabled,.ui.table tr.disabled td,.ui.table tr.disabled:hover,.ui.table tr:hover td.disabled{pointer-events:none;color:rgba(40,40,40,.3)}@media only screen and (max-width:991px){.ui[class*=\"tablet stackable\"].table,.ui[class*=\"tablet stackable\"].table tbody,.ui[class*=\"tablet stackable\"].table tr,.ui[class*=\"tablet stackable\"].table tr>td,.ui[class*=\"tablet stackable\"].table tr>th{width:100%!important;display:block!important}.ui[class*=\"tablet stackable\"].table{padding:0}.ui[class*=\"tablet stackable\"].table tfoot,.ui[class*=\"tablet stackable\"].table thead{display:block}.ui[class*=\"tablet stackable\"].table tr{padding-top:1em;padding-bottom:1em;box-shadow:0 -1px 0 0 rgba(0,0,0,.1) inset!important}.ui[class*=\"tablet stackable\"].table tr>td,.ui[class*=\"tablet stackable\"].table tr>th{background:0 0;border:none!important;padding:.25em .75em;box-shadow:none!important}.ui.definition[class*=\"tablet stackable\"].table thead th:first-child{box-shadow:none!important}}.ui.table [class*=\"left aligned\"],.ui.table[class*=\"left aligned\"]{text-align:left}.ui.table [class*=\"center aligned\"],.ui.table[class*=\"center aligned\"]{text-align:center}.ui.table [class*=\"right aligned\"],.ui.table[class*=\"right aligned\"]{text-align:right}.ui.table [class*=\"top aligned\"],.ui.table[class*=\"top aligned\"]{vertical-align:top}.ui.table [class*=\"middle aligned\"],.ui.table[class*=\"middle aligned\"]{vertical-align:middle}.ui.table [class*=\"bottom aligned\"],.ui.table[class*=\"bottom aligned\"]{vertical-align:bottom}.ui.table td.collapsing,.ui.table th.collapsing{width:1px;white-space:nowrap}.ui.fixed.table{table-layout:fixed}.ui.fixed.table td,.ui.fixed.table th{overflow:hidden;text-overflow:ellipsis}.ui.selectable.table tbody tr:hover,.ui.table tbody tr td.selectable:hover{background:rgba(0,0,0,.05)!important;color:rgba(0,0,0,.95)!important}.ui.inverted.table tbody tr td.selectable:hover,.ui.selectable.inverted.table tbody tr:hover{background:rgba(255,255,255,.08)!important;color:#fff!important}.ui.table tbody tr td.selectable{padding:0}.ui.table tbody tr td.selectable>a:not(.ui){display:block;color:inherit;padding:.78571429em}.ui.selectable.table tr.error:hover,.ui.selectable.table tr:hover td.error,.ui.table tr td.selectable.error:hover{background:#ffe7e7!important;color:#943634!important}.ui.selectable.table tr.warning:hover,.ui.selectable.table tr:hover td.warning,.ui.table tr td.selectable.warning:hover{background:#fff4e4!important;color:#493107!important}.ui.selectable.table tr.active:hover,.ui.selectable.table tr:hover td.active,.ui.table tr td.selectable.active:hover{background:#E0E0E0!important;color:rgba(0,0,0,.87)!important}.ui.selectable.table tr.positive:hover,.ui.selectable.table tr:hover td.positive,.ui.table tr td.selectable.positive:hover{background:#f7ffe6!important;color:#275b28!important}.ui.selectable.table tr.negative:hover,.ui.selectable.table tr:hover td.negative,.ui.table tr td.selectable.negative:hover{background:#ffe7e7!important;color:#943634!important}.ui.attached.table{top:0;bottom:0;border-radius:0;margin:0 -1px;width:calc(100% + 2px);max-width:calc(100% + 2px);box-shadow:none;border:1px solid #D4D4D5}.ui.attached+.ui.attached.table:not(.top){border-top:none}.ui[class*=\"top attached\"].table{bottom:0;margin-bottom:0;top:0;margin-top:1em;border-radius:.28571429rem .28571429rem 0 0}.ui.table[class*=\"top attached\"]:first-child{margin-top:0}.ui[class*=\"bottom attached\"].table{bottom:0;margin-top:0;top:0;margin-bottom:1em;box-shadow:none,none;border-radius:0 0 .28571429rem .28571429rem}.ui[class*=\"bottom attached\"].table:last-child{margin-bottom:0}.ui.striped.table tbody tr:nth-child(2n),.ui.striped.table>tr:nth-child(2n){background-color:rgba(0,0,50,.02)}.ui.inverted.striped.table tbody tr:nth-child(2n),.ui.inverted.striped.table>tr:nth-child(2n){background-color:rgba(255,255,255,.05)}.ui.striped.selectable.selectable.selectable.table tbody tr.active:hover{background:#EFEFEF!important;color:rgba(0,0,0,.95)!important}.ui.table [class*=\"single line\"],.ui.table[class*=\"single line\"]{white-space:nowrap}.ui.red.table{border-top:.2em solid #DB2828}.ui.inverted.red.table{background-color:#DB2828!important;color:#FFF!important}.ui.orange.table{border-top:.2em solid #F2711C}.ui.inverted.orange.table{background-color:#F2711C!important;color:#FFF!important}.ui.yellow.table{border-top:.2em solid #FBBD08}.ui.inverted.yellow.table{background-color:#FBBD08!important;color:#FFF!important}.ui.olive.table{border-top:.2em solid #B5CC18}.ui.inverted.olive.table{background-color:#B5CC18!important;color:#FFF!important}.ui.green.table{border-top:.2em solid #21BA45}.ui.inverted.green.table{background-color:#21BA45!important;color:#FFF!important}.ui.teal.table{border-top:.2em solid #00B5AD}.ui.inverted.teal.table{background-color:#00B5AD!important;color:#FFF!important}.ui.blue.table{border-top:.2em solid #2185D0}.ui.inverted.blue.table{background-color:#2185D0!important;color:#FFF!important}.ui.violet.table{border-top:.2em solid #6435C9}.ui.inverted.violet.table{background-color:#6435C9!important;color:#FFF!important}.ui.purple.table{border-top:.2em solid #A333C8}.ui.inverted.purple.table{background-color:#A333C8!important;color:#FFF!important}.ui.pink.table{border-top:.2em solid #E03997}.ui.inverted.pink.table{background-color:#E03997!important;color:#FFF!important}.ui.brown.table{border-top:.2em solid #A5673F}.ui.inverted.brown.table{background-color:#A5673F!important;color:#FFF!important}.ui.grey.table{border-top:.2em solid #767676}.ui.inverted.grey.table{background-color:#767676!important;color:#FFF!important}.ui.black.table{border-top:.2em solid #1B1C1D}.ui.inverted.black.table{background-color:#1B1C1D!important;color:#FFF!important}.ui.one.column.table td{width:100%}.ui.two.column.table td{width:50%}.ui.three.column.table td{width:33.33333333%}.ui.four.column.table td{width:25%}.ui.five.column.table td{width:20%}.ui.six.column.table td{width:16.66666667%}.ui.seven.column.table td{width:14.28571429%}.ui.eight.column.table td{width:12.5%}.ui.nine.column.table td{width:11.11111111%}.ui.ten.column.table td{width:10%}.ui.eleven.column.table td{width:9.09090909%}.ui.twelve.column.table td{width:8.33333333%}.ui.thirteen.column.table td{width:7.69230769%}.ui.fourteen.column.table td{width:7.14285714%}.ui.fifteen.column.table td{width:6.66666667%}.ui.sixteen.column.table td,.ui.table td.one.wide,.ui.table th.one.wide{width:6.25%}.ui.table td.two.wide,.ui.table th.two.wide{width:12.5%}.ui.table td.three.wide,.ui.table th.three.wide{width:18.75%}.ui.table td.four.wide,.ui.table th.four.wide{width:25%}.ui.table td.five.wide,.ui.table th.five.wide{width:31.25%}.ui.table td.six.wide,.ui.table th.six.wide{width:37.5%}.ui.table td.seven.wide,.ui.table th.seven.wide{width:43.75%}.ui.table td.eight.wide,.ui.table th.eight.wide{width:50%}.ui.table td.nine.wide,.ui.table th.nine.wide{width:56.25%}.ui.table td.ten.wide,.ui.table th.ten.wide{width:62.5%}.ui.table td.eleven.wide,.ui.table th.eleven.wide{width:68.75%}.ui.table td.twelve.wide,.ui.table th.twelve.wide{width:75%}.ui.table td.thirteen.wide,.ui.table th.thirteen.wide{width:81.25%}.ui.table td.fourteen.wide,.ui.table th.fourteen.wide{width:87.5%}.ui.table td.fifteen.wide,.ui.table th.fifteen.wide{width:93.75%}.ui.table td.sixteen.wide,.ui.table th.sixteen.wide{width:100%}.ui.sortable.table thead th{cursor:pointer;white-space:nowrap;border-left:1px solid rgba(34,36,38,.15);color:rgba(0,0,0,.87)}.ui.sortable.table thead th:first-child{border-left:none}.ui.sortable.table thead th.sorted,.ui.sortable.table thead th.sorted:hover{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.ui.sortable.table thead th:after{display:none;font-style:normal;font-weight:400;text-decoration:inherit;content:'';height:1em;width:auto;opacity:.8;margin:0 0 0 .5em;font-family:Icons}.ui.sortable.table thead th.ascending:after{content:'\\F0D8'}.ui.sortable.table thead th.descending:after{content:'\\F0D7'}.ui.sortable.table th.disabled:hover{cursor:auto;color:rgba(40,40,40,.3)}.ui.sortable.table thead th:hover{background:rgba(0,0,0,.05);color:rgba(0,0,0,.8)}.ui.sortable.table thead th.sorted{background:rgba(0,0,0,.05);color:rgba(0,0,0,.95)}.ui.sortable.table thead th.sorted:after{display:inline-block}.ui.sortable.table thead th.sorted:hover{background:rgba(0,0,0,.05);color:rgba(0,0,0,.95)}.ui.inverted.sortable.table thead th.sorted{background:-webkit-linear-gradient(transparent,rgba(0,0,0,.05)) rgba(255,255,255,.15);background:linear-gradient(transparent,rgba(0,0,0,.05)) rgba(255,255,255,.15);color:#fff}.ui.inverted.sortable.table thead th:hover{background:-webkit-linear-gradient(transparent,rgba(0,0,0,.05)) rgba(255,255,255,.08);background:linear-gradient(transparent,rgba(0,0,0,.05)) rgba(255,255,255,.08);color:#fff}.ui.inverted.sortable.table thead th{border-left-color:transparent;border-right-color:transparent}.ui.inverted.table{background:#333;color:rgba(255,255,255,.9);border:none}.ui.inverted.table th{background-color:rgba(0,0,0,.15);border-color:rgba(255,255,255,.1)!important;color:rgba(255,255,255,.9)}.ui.inverted.table tr td{border-color:rgba(255,255,255,.1)!important}.ui.inverted.table tr td.disabled,.ui.inverted.table tr.disabled td,.ui.inverted.table tr.disabled:hover td,.ui.inverted.table tr:hover td.disabled{pointer-events:none;color:rgba(225,225,225,.3)}.ui.inverted.definition.table tfoot:not(.full-width) th:first-child,.ui.inverted.definition.table thead:not(.full-width) th:first-child{background:#FFF}.ui.inverted.definition.table tr td:first-child{background:rgba(255,255,255,.02);color:#fff}.ui.collapsing.table{width:auto}.ui.basic.table{background:0 0;border:1px solid rgba(34,36,38,.15);box-shadow:none}.ui.basic.table tfoot,.ui.basic.table thead{box-shadow:none}.ui.basic.table th{background:0 0;border-left:none}.ui.basic.table tbody tr{border-bottom:1px solid rgba(0,0,0,.1)}.ui.basic.table td{background:0 0}.ui.basic.striped.table tbody tr:nth-child(2n){background-color:rgba(0,0,0,.05)!important}.ui[class*=\"very basic\"].table{border:none}.ui[class*=\"very basic\"].table:not(.sortable):not(.striped) td,.ui[class*=\"very basic\"].table:not(.sortable):not(.striped) th{padding:''}.ui[class*=\"very basic\"].table:not(.sortable):not(.striped) td:first-child,.ui[class*=\"very basic\"].table:not(.sortable):not(.striped) th:first-child{padding-left:0}.ui[class*=\"very basic\"].table:not(.sortable):not(.striped) td:last-child,.ui[class*=\"very basic\"].table:not(.sortable):not(.striped) th:last-child{padding-right:0}.ui[class*=\"very basic\"].table:not(.sortable):not(.striped) thead tr:first-child th{padding-top:0}.ui.celled.table tr td,.ui.celled.table tr th{border-left:1px solid rgba(34,36,38,.1)}.ui.celled.table tr td:first-child,.ui.celled.table tr th:first-child{border-left:none}.ui.padded.table th{padding-left:1em;padding-right:1em}.ui.padded.table td,.ui.padded.table th{padding:1em}.ui[class*=\"very padded\"].table th{padding-left:1.5em;padding-right:1.5em}.ui[class*=\"very padded\"].table td{padding:1.5em}.ui.compact.table th{padding-left:.7em;padding-right:.7em}.ui.compact.table td{padding:.5em .7em}.ui[class*=\"very compact\"].table th{padding-left:.6em;padding-right:.6em}.ui[class*=\"very compact\"].table td{padding:.4em .6em}.ui.small.table{font-size:.9em}.ui.table{font-size:1em}.ui.large.table{font-size:1.1em}", ""]);

// exports


/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-463d7590\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/components/layout.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "layout",
    class: [_vm.direction, {
      'fit': _vm.fit
    }],
    on: {
      "click": _vm.onCloseFloatPanel,
      "mousedown": _vm.onResizePanel,
      "mousemove": _vm.onResizePanel,
      "mouseup": _vm.onResizePanel
    }
  }, [_c('transition', {
    attrs: {
      "name": "togglePanel"
    }
  }, [(_vm.hasFirstPanel) ? _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.firstIsShow),
      expression: "firstIsShow"
    }],
    class: [_vm.direction, 'first', 'panel'],
    style: (_vm.direction == 'hori' ? {
      width: _vm.firstPanelSize
    } : {
      height: _vm.firstPanelSize
    })
  }, [_vm._t("first")], 2) : _vm._e()]), _vm._v(" "), (_vm.hasFirstPanel) ? _c('div', {
    class: [_vm.direction, 'first', 'splitbar'],
    on: {
      "mousemove": function($event) {
        _vm.onOpenFloatPanel('first', $event)
      }
    }
  }, [(_vm.firstPanelCloseable) ? _c('div', {
    staticClass: "splitCtrl",
    on: {
      "click": _vm.firstSplitClick
    }
  }) : _vm._e()]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "center panel"
  }, [_vm._t("center")], 2), _vm._v(" "), (_vm.hasLastPanel) ? _c('div', {
    class: [_vm.direction, 'last', 'splitbar'],
    on: {
      "mousemove": function($event) {
        _vm.onOpenFloatPanel('last', $event)
      }
    }
  }, [(_vm.lastPanelCloseable) ? _c('div', {
    staticClass: "splitCtrl",
    on: {
      "click": _vm.lastSplitClick
    }
  }) : _vm._e()]) : _vm._e(), _vm._v(" "), _c('transition', {
    attrs: {
      "name": "togglePanel"
    }
  }, [(_vm.hasLastPanel) ? _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.lastIsShow),
      expression: "lastIsShow"
    }],
    class: [_vm.direction, 'last', 'panel'],
    style: (_vm.direction == 'hori' ? {
      width: _vm.lastPanelSize
    } : {
      height: _vm.lastPanelSize
    })
  }, [_vm._t("last")], 2) : _vm._e()])], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-463d7590", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-53f06f84\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/components/tree.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "treevue",
    class: _vm.scroll ? 'scroll' : ''
  }, [_c('ul', {
    staticClass: "ztree",
    attrs: {
      "id": _vm.ztreeID
    }
  })])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-53f06f84", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-6675a1b6\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/alarm/components/alarm.list.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('zwxtable', {
    ref: "alarmtable",
    attrs: {
      "cols": _vm.cols,
      "rows": _vm.rows,
      "selected": _vm.selected,
      "show-border": false,
      "show-toolbar": false,
      "footerbar": _vm.footerbar,
      "fit": _vm.fit,
      "primary": "id",
      "pagination": _vm.pagination
    },
    on: {
      "cellclick": _vm.childCellclick,
      "loaddata": _vm.onLoadData
    }
  })
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-6675a1b6", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-6e1460ac\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/alarm/components/alarm.manage.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "alarmmanage"
  }, [_c('layout', {
    attrs: {
      "has-last-panel": false
    }
  }, [_c('div', {
    attrs: {
      "slot": "first"
    },
    slot: "first"
  }, [_c('tree', {
    attrs: {
      "items": _vm.items
    },
    on: {
      "item-click": _vm.onItemClick
    }
  })], 1), _vm._v(" "), _c('div', {
    attrs: {
      "slot": "center"
    },
    slot: "center"
  }, [_c('alarm-list', {
    ref: "alarmlist",
    attrs: {
      "selected": _vm.selectedAlarmIds
    }
  })], 1)])], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-6e1460ac", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-9761ce50\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/components/table.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "zwxtable",
    class: {
      'fit': _vm.fit,
      'border': _vm.showBorder,
      'fixedheight': _vm._isFixedHeight(),
        'showheader': _vm.showHeader
    },
    style: (_vm.fit ? '' : {
      height: _vm.height
    }),
    on: {
      "mousedown": _vm.onResizeColumn,
      "mousemove": _vm.onResizeColumn,
      "mouseup": _vm.onResizeColumn
    }
  }, [(_vm.showToolbar) ? _c('menubar', {
    ref: "toolbar",
    staticStyle: {
      "width": "100%"
    },
    attrs: {
      "items": _vm.toolbar,
      "attached": "top",
      "docked": "top"
    }
  }) : _vm._e(), _vm._v(" "), (_vm.showHeader && _vm._isFixedHeight()) ? _c('div', {
    staticClass: "header"
  }) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "content"
  }, [_c('table', {
    class: [
      _vm.classes,
      'ui',
      'celled',
      'striped',
      'compact',
      _vm.gridLineClasss,
      'table'
    ]
  }, [_c('thead', {
    class: [
      _vm.header.classes,
      {
        compact: _vm.header.compact
      }
    ]
  }, [_c('tr', [(_vm.showDetialRow) ? _c('th', {
    staticClass: "hcell",
    staticStyle: {
      "width": "32px"
    },
    attrs: {
      "name": "__detail"
    }
  }) : _vm._e(), _vm._v(" "), (_vm.showSelector && _vm.cols.length > 0) ? _c('th', {
    staticClass: "hcell",
    staticStyle: {
      "width": "32px"
    },
    attrs: {
      "name": "__selector"
    }
  }, [_c('input', {
    staticClass: "checkall",
    attrs: {
      "name": "__selector",
      "type": "checkbox"
    }
  })]) : _vm._e(), _vm._v(" "), _vm._l((_vm.cols), function(col) {
    return _c('th', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (col.visible == undefined ? true : col.visible),
        expression: "col.visible==undefined ? true:col.visible"
      }],
      staticClass: "hcell",
      class: {
        'hide': !(col.visible == undefined ? true : col.visible)
      },
      style: ({
        width: parseInt(col.width) + 'px',
        textAlign: col.headerAlign || 'center'
      }),
      attrs: {
        "name": col.name
      }
    }, [_vm._v("                           \n           " + _vm._s(col.title) + "\n            "), (_vm.sort.enabled && _vm.sort.key == col.name && col.sortable == true) ? [(_vm.sort.order == 'desc') ? _c('i', {
      staticClass: "sort angle down icon"
    }) : _vm._e(), _vm._v(" "), (_vm.sort.order == 'asc') ? _c('i', {
      staticClass: "sort angle up icon"
    }) : _vm._e()] : _vm._e()], 2)
  })], 2)]), _vm._v(" "), _c('tbody', [_vm._l((_vm.sortRows), function(row, index) {
    return [_c('tr', {
      key: row[_vm.primary],
      class: _vm.selected.indexOf(row[_vm.primary]) != -1 ? _vm.selectedClasss : '',
      style: (_vm.rowFormatter ? _vm.rowFormatter(row) : ''),
      attrs: {
        "pk": _vm.primary == '' ? index + 1 : row[_vm.primary]
      },
      on: {
        "click": function($event) {
          _vm.onRowClick(row, $event)
        }
      }
    }, [(_vm.showDetialRow) ? _c('td', {
      staticClass: "cell"
    }, [_c('span', {
      staticClass: "row-detail-switch",
      class: {
        'expand': row.expand == undefined ? false : row.expand
      },
      on: {
        "click": function($event) {
          _vm.onRowExpand(row, $event)
        }
      }
    })]) : _vm._e(), _vm._v(" "), (_vm.showSelector) ? _c('td', {
      staticClass: "cell"
    }, [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (_vm.selectedRows),
        expression: "selectedRows"
      }],
      staticClass: "check",
      attrs: {
        "name": "__selector",
        "type": "checkbox"
      },
      domProps: {
        "value": _vm.primary == '' ? index + 1 : row[_vm.primary],
        "checked": Array.isArray(_vm.selectedRows) ? _vm._i(_vm.selectedRows, _vm.primary == '' ? index + 1 : row[_vm.primary]) > -1 : (_vm.selectedRows)
      },
      on: {
        "__c": function($event) {
          var $$a = _vm.selectedRows,
            $$el = $event.target,
            $$c = $$el.checked ? (true) : (false);
          if (Array.isArray($$a)) {
            var $$v = _vm.primary == '' ? index + 1 : row[_vm.primary],
              $$i = _vm._i($$a, $$v);
            if ($$el.checked) {
              $$i < 0 && (_vm.selectedRows = $$a.concat([$$v]))
            } else {
              $$i > -1 && (_vm.selectedRows = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
            }
          } else {
            _vm.selectedRows = $$c
          }
        }
      }
    })]) : _vm._e(), _vm._v(" "), _vm._l((_vm.visibleCols), function(col) {
      return [(col.formatter) ? _c('td', {
        staticClass: "cell",
        style: ([{
            textAlign: col.align || 'center',
            verticalAlign: col.vAlign,
            color: col.color,
            background: col.background
          },
          col.cellStyle ? col.cellStyle(row, col) : ''
        ]),
        attrs: {
          "title": col.tips == undefined ? '' : _vm.getCellTips(row, col)
        },
        domProps: {
          "innerHTML": _vm._s(_vm.formatCell(row[col.name], row, col))
        },
        on: {
          "click": function($event) {
            _vm.onCellClick(row, col, $event)
          }
        }
      }) : _c('td', {
        staticClass: "cell",
        style: ([{
            textAlign: col.align || 'center',
            verticalAlign: col.vAlign,
            color: col.color,
            background: col.background
          },
          col.cellStyle ? col.cellStyle(row, col) : ''
        ]),
        attrs: {
          "title": col.tips == undefined ? '' : _vm.getCellTips(row, col)
        },
        on: {
          "click": function($event) {
            _vm.onCellClick(row, col, $event)
          }
        }
      }, [(col.type == 'checkbox') ? [_c('input', {
        directives: [{
          name: "model",
          rawName: "v-model",
          value: (row[col.name]),
          expression: "row[col.name]"
        }],
        attrs: {
          "type": "checkbox"
        },
        domProps: {
          "checked": Array.isArray(row[col.name]) ? _vm._i(row[col.name], null) > -1 : (row[col.name])
        },
        on: {
          "__c": function($event) {
            var $$a = row[col.name],
              $$el = $event.target,
              $$c = $$el.checked ? (true) : (false);
            if (Array.isArray($$a)) {
              var $$v = null,
                $$i = _vm._i($$a, $$v);
              if ($$el.checked) {
                $$i < 0 && (row[col.name] = $$a.concat([$$v]))
              } else {
                $$i > -1 && (row[col.name] = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
              }
            } else {
              _vm.$set(row, col.name, $$c)
            }
          }
        }
      })] : _vm._e(), _vm._v(" "), (col.type == 'icon') ? [_c('i', {
        class: [
          col.colors[row[col.name]] ? col.colors[row[col.name]] : col.colors['default'],
          col.icons[row[col.name]] ? col.icons[row[col.name]] : col.icons['default'],
          'icon'
        ]
      })] : _vm._e(), _vm._v(" "), (col.type == 'switch') ? [_c('div', {
        staticClass: "ui toggle checkbox"
      }, [_c('input', {
        directives: [{
          name: "model",
          rawName: "v-model",
          value: (row[col.name]),
          expression: "row[col.name]"
        }],
        attrs: {
          "type": "checkbox"
        },
        domProps: {
          "checked": Array.isArray(row[col.name]) ? _vm._i(row[col.name], null) > -1 : (row[col.name])
        },
        on: {
          "__c": function($event) {
            var $$a = row[col.name],
              $$el = $event.target,
              $$c = $$el.checked ? (true) : (false);
            if (Array.isArray($$a)) {
              var $$v = null,
                $$i = _vm._i($$a, $$v);
              if ($$el.checked) {
                $$i < 0 && (row[col.name] = $$a.concat([$$v]))
              } else {
                $$i > -1 && (row[col.name] = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
              }
            } else {
              _vm.$set(row, col.name, $$c)
            }
          }
        }
      })])] : _vm._e(), _vm._v(" "), (col.type == 'button') ? [(col.buttons) ? _vm._l((col.buttons), function(btn) {
        return _c('button', {
          class: [
            'ui', 'mini', 'compact',
            btn.class ? btn.class : 'basic',
            btn.color,
            btn.icon ? 'icon' : '',
            'button'
          ],
          on: {
            "click": function($event) {
              btn.click ? btn.click(row, col, $event) : void(0)
            }
          }
        }, [(btn.icon) ? _c('i', {
          class: [btn.icon, 'icon']
        }) : _vm._e(), _vm._v("\n                                      " + _vm._s(btn.text) + "\n                                  ")])
      }) : [_c('button', {
        class: [
          'ui', 'mini', 'compact',
          col.buttons.class ? col.buttons.class : 'basic',
          col.buttons.color,
          col.buttons.icon ? 'icon' : '',
          'button'
        ],
        on: {
          "click": function($event) {
            _vm.btn.click ? _vm.btn.click(row, col, $event) : void(0)
          }
        }
      }, [(col.buttons.icon) ? _c('i', {
        class: [col.buttons.icon, 'icon']
      }) : _vm._e(), _vm._v("\n                                      " + _vm._s(col.buttons.text) + "\n                                  ")])]] : _vm._e(), _vm._v(" "), (col.type == 'custom') ? _c('div', {
        domProps: {
          "innerHTML": _vm._s(_vm.colhtml(row, col))
        }
      }) : _vm._e(), _vm._v(" "), (!col.type || col.type == 'default') ? [_vm._v("\n                              " + _vm._s(row[col.name]) + "\n                          ")] : _vm._e()], 2)]
    })], 2), _vm._v(" "), _c('transition', {
      attrs: {
        "name": "expandrow"
      },
      on: {
        "enter": _vm.onEnterRowDetia
      }
    }, [(_vm.showDetialRow && (row.expand == undefined ? false : row.expand)) ? _c('tr', [_c('td', {
      attrs: {
        "colspan": _vm.cols.length + (_vm.showSelector ? 1 : 0) + (_vm.showDetialRow ? 1 : 0)
      }
    }, [_vm._t("rowdetial", null, {
      row: row
    })], 2)]) : _vm._e()])]
  }), _vm._v(" "), (!_vm.paging) ? _c('tr', {
    staticClass: "paging"
  }, [_c('td', {
    attrs: {
      "colspan": _vm.cols.length + (_vm.showSelector ? 1 : 0) + (_vm.showDetialRow ? 1 : 0)
    }
  }, [(_vm.pagination.pageNumber < _vm.pagination.pageCount) ? _c('span', {
    on: {
      "click": _vm.onLoadMore
    }
  }, [_vm._v("\n                " + _vm._s(_vm.L("点击加载更多...")) + "\n              ")]) : _c('span', [_vm._v("\n                " + _vm._s(_vm.L("加载完毕!")) + "\n              ")])])]) : _vm._e()], 2)])]), _vm._v(" "), _vm._t("footer", [(_vm.showFooter) ? _c('menubar', {
    ref: "footerbar",
    staticClass: "footer",
    attrs: {
      "items": _vm.footerbar,
      "docked": "bottom"
    }
  }) : _vm._e()]), _vm._v(" "), _c('div', {
    staticClass: "dragbar"
  })], 2)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-9761ce50", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-463d7590\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/layout.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-463d7590\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/layout.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("0b548e96", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-463d7590\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../utils/lang-loader.js!./layout.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-463d7590\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../utils/lang-loader.js!./layout.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-53f06f84\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/components/tree.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-53f06f84\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/components/tree.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("ae080e78", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-53f06f84\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!../../utils/lang-loader.js!./tree.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-53f06f84\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!../../utils/lang-loader.js!./tree.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-53f06f84\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/tree.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-53f06f84\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/tree.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("15e5d9a4", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-53f06f84\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../utils/lang-loader.js!./tree.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-53f06f84\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../utils/lang-loader.js!./tree.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6675a1b6\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/alarm/components/alarm.list.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6675a1b6\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/alarm/components/alarm.list.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("41c67542", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6675a1b6\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../../../utils/lang-loader.js!./alarm.list.vue", function() {
     var newContent = require("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6675a1b6\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../../../utils/lang-loader.js!./alarm.list.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6e1460ac\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/alarm/components/alarm.manage.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6e1460ac\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/alarm/components/alarm.manage.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("a2d87d78", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6e1460ac\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../../../utils/lang-loader.js!./alarm.manage.vue", function() {
     var newContent = require("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6e1460ac\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../../../utils/lang-loader.js!./alarm.manage.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-9761ce50\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/table.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-9761ce50\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/table.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("69376590", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-9761ce50\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../utils/lang-loader.js!./table.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-9761ce50\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../utils/lang-loader.js!./table.vue");
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

/***/ "./src/apps/voerka/modules/alarm/components/alarm.list.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6675a1b6\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/alarm/components/alarm.list.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/alarm/components/alarm.list.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-6675a1b6\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/alarm/components/alarm.list.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-6675a1b6",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\voerka\\modules\\alarm\\components\\alarm.list.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] alarm.list.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6675a1b6", Component.options)
  } else {
    hotAPI.reload("data-v-6675a1b6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/apps/voerka/modules/alarm/components/alarm.manage.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6e1460ac\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/alarm/components/alarm.manage.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/alarm/components/alarm.manage.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-6e1460ac\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/alarm/components/alarm.manage.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-6e1460ac",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\voerka\\modules\\alarm\\components\\alarm.manage.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] alarm.manage.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6e1460ac", Component.options)
  } else {
    hotAPI.reload("data-v-6e1460ac", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/assets/js/semantic/components/table.min.css":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./src/assets/js/semantic/components/table.min.css");
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
		module.hot.accept("!!../../../../../node_modules/css-loader/index.js!./table.min.css", function() {
			var newContent = require("!!../../../../../node_modules/css-loader/index.js!./table.min.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/components/layout.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-463d7590\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/layout.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/components/layout.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-463d7590\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/components/layout.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-463d7590",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\components\\layout.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] layout.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-463d7590", Component.options)
  } else {
    hotAPI.reload("data-v-463d7590", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/components/table.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-9761ce50\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/table.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/components/table.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-9761ce50\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/components/table.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-9761ce50",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\components\\table.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] table.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-9761ce50", Component.options)
  } else {
    hotAPI.reload("data-v-9761ce50", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/components/tree.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-53f06f84\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/tree.vue")
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-53f06f84\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./src/components/tree.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/components/tree.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-53f06f84\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/components/tree.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-53f06f84",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\components\\tree.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] tree.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-53f06f84", Component.options)
  } else {
    hotAPI.reload("data-v-53f06f84", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ })

});