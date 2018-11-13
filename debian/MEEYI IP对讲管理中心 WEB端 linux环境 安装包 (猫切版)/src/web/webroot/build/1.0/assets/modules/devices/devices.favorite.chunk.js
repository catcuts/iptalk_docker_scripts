webpackJsonp([112],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/devices/components/main/collection.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _layout = __webpack_require__("./src/components/layout.vue");

var _layout2 = _interopRequireDefault(_layout);

var _menubar = __webpack_require__("./src/components/menubar.vue");

var _menubar2 = _interopRequireDefault(_menubar);

var _table = __webpack_require__("./src/components/table.vue");

var _table2 = _interopRequireDefault(_table);

var _common = __webpack_require__("./src/apps/voerka/modules/devices/components/main/common.js");

var _eventbus = __webpack_require__("./src/common/eventbus.js");

var _eventbus2 = _interopRequireDefault(_eventbus);

var _vuex = __webpack_require__("./node_modules/vuex/dist/vuex.esm.js");

var _devicesColsMixin = __webpack_require__("./src/apps/voerka/modules/devices/components/main/devices.cols.mixin.js");

var _devicesColsMixin2 = _interopRequireDefault(_devicesColsMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: { layout: _layout2.default, menubar: _menubar2.default, commontable: _table2.default },
	mixins: [_devicesColsMixin2.default],
	props: {},
	data: function data() {
		return {
			filterkey: null,
			Menus: [],
			filteddata: [],
			collectiontoolbar: [{ name: "refresh", text: L("刷新"), icon: "refresh", click: "onRefreshData" }, { name: "delete", text: L("删除"), icon: "remove", click: "onDelDevice" }, { name: "search", change: "onSearch", icon: "find", "tips": L("搜索"), type: "search", right: true }, { name: "filter", icon: "filter", "tips": L("过滤"), right: true }, { name: "adv", icon: "find", "tips": L("高级搜索"), right: true }],
			pagination: {
				pageNumber: 0,
				pageCount: 0,
				pageSize: 10
			},
			currentDevices: {},
			selectedRowsSN: []
		};
	},

	watch: {
		collectionDevices: function collectionDevices(newValue, oldValue) {
			var self = this;
			var curData = this.collectionDevices[this.collectionDevices.length - 1];
			if (this.collectionDevices.length > 0) {
				this.pagination = {
					pageNumber: curData.result.pageNumber,
					pageCount: curData.result.pageCount,
					pageSize: curData.result.pageSize
				};
				self.currentDevices = curData.result;
			}
		},
		selectedDevices: function selectedDevices(newValue, oldValue) {
			var rowsdata = this.$refs.collectiontable.getSelectedRowsData();
			this.onGetRowsSN(rowsdata);
		}
	},
	computed: _extends({}, (0, _vuex.mapState)({
		theme: function theme(state) {
			return state.theme;
		},
		collectionDevices: function collectionDevices(state) {
			return state.voerkaModule.devices.collectionDevices;
		},
		selectedDevices: function selectedDevices(state) {
			return state.voerkaModule.devices.selectedDevices;
		},
		curUserInfo: function curUserInfo(state) {
			return state.curUserInfo;
		}
	}), {
		typeitems: function typeitems() {
			var apptypes = [];
			var istype = function istype(apptypes, type) {
				var i = apptypes.length;
				while (i--) {
					if (apptypes[i].filterkey == type) {
						return false;
					}
				}
				return true;
			};
			this.collectionDevices.forEach(function (item) {
				var type = item.type;
				if (istype(apptypes, type)) {
					apptypes.push({
						text: item.typeName,
						icon: item.icon,
						filterkey: item.type,
						group: "appfilter"
					});
				}
			});
			apptypes.unshift({ text: L("全部类型"), icon: "grid layout", active: true, filterkey: null, group: "appfilter" });
			return this.Menus = apptypes;
		}
	}),

	methods: {
		onLoadData: function onLoadData(context) {
			var self = this;
			var newPage = context ? context.newPage : 1;
			if (context) {
				var flag = true;
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = self.collectionDevices[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var item = _step.value;

						if (item.result.pageNumber == newPage) {
							self.pagination = {
								pageNumber: item.result.pageNumber,
								pageCount: item.result.pageCount,
								pageSize: item.result.pageSize
							};
							self.currentDevices = item.result;
							context.success(newPage);
							flag = false;
							break;
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

				if (flag) {
					this.$store.dispatch("loadCollection", newPage);
					context.success(newPage);
				}
			} else {
				this.$store.dispatch("loadCollection", newPage);
			}
		},
		onDynamicRowStyle: function onDynamicRowStyle(row) {},

		onGetRowsSN: function onGetRowsSN(data) {
			var temp = [];
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var item = _step2.value;

					temp.push(item.sn);
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

			this.selectedRowsSN = temp;
		},
		delDevices: function delDevices() {
			var searchResult = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
			var label = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			if (label == "collection" || label == null) {
				(0, _common.onDeleteDevice)(this.selectedDevices, this.collectionDevices, this.selectedRowsSN, searchResult, "fromColl");
			}
		}

	},
	created: function created() {
		this.onLoadData();
		this.$on('onDelDevice', function () {
			this.delDevices();
		});
		this.$on("onRefreshData", function () {
			this.$store.dispatch("loadCollection", 0);
			this.onLoadData();
			toast(L("刷新成功"), 1000);
		});
		this.$on('onSearch', function (item) {
			(0, _common.onSearchData)(this.collectionDevices, item, "collection");
		});
		_eventbus2.default.$on("module.devices.searchresult.deldevices", this.delDevices);
	},
	mounted: function mounted() {
		var _this = this;

		this.$nextTick(function () {
			$(_this.$el).find('.accordion').accordion({
				exclusive: false
			});
		});
	},
	beforeDestroy: function beforeDestroy() {
		_eventbus2.default.$off("module.devices.searchresult.deldevices", this.delDevices);
	},
	destroyed: function destroyed() {}
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

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-463d7590\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/layout.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.layout[data-v-463d7590]{\n  position: relative;\n  padding:0px;\n  background: #FAFAFA; \n  display: flex;\n  align-items:stretch;\n}\n.layout .panel[data-v-463d7590]{\n  position: relative;\n}\n.layout.hori[data-v-463d7590]{\n  flex-direction:row;\n}\n.layout.vert[data-v-463d7590]{\n  flex-direction:column;\n}\n.layout.fit[data-v-463d7590]{\n  position: absolute;\n  top:0px;\n  left:0px;\n  width:100%;\n  height:100%;\n}\n.layout > div[data-v-463d7590]{\n  /*position: relative;*/\n}\n.layout > div.center[data-v-463d7590]{\n  top:0px;\n  flex:1;\n}\n.layout > div.panel.float[data-v-463d7590]{\n  z-index: 9;\n}\n.layout > div.hori.first.float[data-v-463d7590]{\n  position: absolute;\n  height:100%;\n  background: #FAFAFA;\n  border-right:1px solid #DEDEDE;\n  box-shadow: 2px 0px 8px #dedede;\n}\n.layout > div.hori.last.float[data-v-463d7590]{\n  position: absolute;\n  height:100%;\n  background: #FAFAFA;\n  border-left:1px solid #DEDEDE;\n  box-shadow: -2px 0px 10px #dedede;\n  right:-8px;\n}\n.layout > div.vert.first.float[data-v-463d7590]{\n  position: absolute;\n  width:100%;\n  background: #FAFAFA;\n  border-bottom:1px solid #DEDEDE;\n  box-shadow: 0px 2px 8px #dedede;\n}\n.layout > div.vert.last.float[data-v-463d7590]{\n  position: absolute;\n  width:100%;\n  background: #FAFAFA;\n  border-top:1px solid #DEDEDE;\n  box-shadow: 0px -2px 10px #dedede;\n}\n\n/*分割条*/\n.layout > div.splitbar[data-v-463d7590]{    \n  position: relative;\n  background: white;    \n  flex-shrink:0;\n  box-sizing:border-box;\n  border:0px;\n}\n.layout > div.hori.splitbar[data-v-463d7590]{\n  border-left:1px solid #DEDEDE;\n  border-right:1px solid #DEDEDE;\n  height:100%;\n  width:8px;\n  cursor: e-resize;\n}\n.layout > div.vert.splitbar[data-v-463d7590]{\n  border-top:1px solid #DEDEDE;\n  border-bottom:1px solid #DEDEDE;\n  width:100%;\n  height:8px;\n  cursor: s-resize;\n}\n.layout > div.splitbar>.splitCtrl[data-v-463d7590]{\n  position:absolute;\n  box-sizing:border-box;\n  background: white;\n  cursor: pointer;\n  font-size: 4px;\n}\n.layout > div.hori.splitbar>.splitCtrl[data-v-463d7590]{\n  top:45%;\n  left:0px;\n  height:10%;\n  width: 100%;\n  border-top:1px solid #DADADA;\n  border-bottom:1px solid #DADADA;\n}\n.layout > div.vert.splitbar>.splitCtrl[data-v-463d7590]{\n  top:0px;\n  left:45%;\n  width:10%;\n  height: 100%;\n  border-left:1px solid #DADADA;\n  border-right:1px solid #DADADA;\n}\n.layout > div.splitbar>.splitCtrl[data-v-463d7590]:hover{\n  background: #DEDEDE;\n  color:white;\n}\n.layout div[slot][data-v-463d7590]{\n  position: absolute;\n  top:0px;\n  left:0px;\n  width:100%;\n  height: 100%;\n}\n\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-821dfb64\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/devices/components/main/collection.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\r\n/*.collectionstyle{\r\n\tposition: relative;\r\n\twidth: 100%;\r\n\theight: 100%;\r\n\tborder: 1px solid gray;\r\n}\r\n.collectionstyle .first {\r\n\tposition: absolute;\r\n\twidth: 100%;\r\n\theight: 100%;\r\n\tbackground-color:#fff;\r\n\tborder:1px solid black; \r\n\toverflow: auto;\r\n}\r\n.collectionstyle .center{\r\n\tposition: absolute;\r\n\twidth: 100%;\r\n\theight: 100%;\r\n\tbackground-color:#fff;\r\n\tpadding: 10px;\r\n\toverflow: auto;\r\n}\r\n.collectionstyle .last{\r\n\tposition: absolute;\r\n\twidth: 100%;\r\n\theight: 100%;\r\n\tbackground-color:#fff;\r\n\tpadding: 10px;\r\n}\r\n.collectionstyle{\r\n\twidth: 100%;\r\n}\r\n.button{\r\n\twidth: 100%;\r\n\tmargin-top: 5px;\r\n}*/\r\n", ""]);

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

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-821dfb64\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/devices/components/main/collection.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "collectionstyle"
  }, [_c('commontable', {
    ref: "collectiontable",
    attrs: {
      "fit": true,
      "cols": _vm.cols,
      "rows": _vm.currentDevices.records,
      "selected": _vm.selectedDevices,
      "show-border": false,
      "row-style": _vm.onDynamicRowStyle,
      "pagination": _vm.pagination,
      "toolbar": _vm.collectiontoolbar,
      "use-default-toolbar": false
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
     require("vue-hot-reload-api").rerender("data-v-821dfb64", module.exports)
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

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-821dfb64\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/devices/components/main/collection.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-821dfb64\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/devices/components/main/collection.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("b4d0edb6", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../../node_modules/css-loader/index.js!../../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-821dfb64\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../../../../utils/lang-loader.js!./collection.vue", function() {
     var newContent = require("!!../../../../../../../node_modules/css-loader/index.js!../../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-821dfb64\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../../../../utils/lang-loader.js!./collection.vue");
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

/***/ "./src/apps/voerka/modules/devices/components/main/collection.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-821dfb64\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/devices/components/main/collection.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/devices/components/main/collection.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-821dfb64\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/devices/components/main/collection.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-821dfb64",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\voerka\\modules\\devices\\components\\main\\collection.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] collection.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-821dfb64", Component.options)
  } else {
    hotAPI.reload("data-v-821dfb64", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/apps/voerka/modules/devices/components/main/devices.cols.mixin.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _dialog = __webpack_require__("./src/common/dialog.rich.js");

var _eventbus = __webpack_require__("./src/common/eventbus.js");

var _eventbus2 = _interopRequireDefault(_eventbus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ColsMixin = {
	data: function data() {
		return {
			cols: [{ name: 'id', title: 'ID', width: "100px", sortable: true, color: "blue", align: "center", visible: false }, { name: 'sn', title: L('设备编码'), width: "150px", type: "custom" }, { name: 'status', title: L('状态'), width: "60px", sortable: true }, { name: 'type', title: L('类型'), width: "100px", type: "custom", visible: false }, { name: 'typename', title: L('类型'), width: "80px", type: "custom" }, { name: 'devicename', title: L('设备名称'), width: "120px" }, { name: 'owner', title: L('所有者'), width: "80px" }, { name: 'install_location', title: L('设备地址'), width: "200px" }, { name: 'coord', title: L('坐标'), width: "200px" }, { name: 'sensitivity', title: L('灵敏度'), width: "70px" }, { name: 'remark', title: L('备注') }, { name: 'edit', title: L('编辑'), width: "50px",
				buttons: [{ icon: "edit", class: "positive", click: function click(row, col, event) {
						var row_temp = {};
						Object.assign(row_temp, row);
						var data = {};
						function commitData() {
							if (row_temp.devicename != row.devicename) {
								data.devicename = row_temp.devicename;
							}
							if (row_temp.install_location != row.install_location) {
								data.install_location = row_temp.install_location;
							}
							if (row_temp.remark != row.remark) {
								data.remark = row_temp.remark;
							}
						}
						var objDialog = new _dialog.RichDialog(col.dialogOptions, { items: row_temp });
						objDialog.show().then(function (item) {
							if (item.button.name == "close") {
								commitData();
								if (Object.keys(data).length > 0) {
									confirm("数据未提交，是否提交数据？").then(function (obj) {
										if (obj.button.classs == "positive") {
											data.sn = row_temp.sn;
											_eventbus2.default.$emit("module.devices.DevicesRowEdit", data, event);
										}
									});
								}
							} else if (item.button.name == "ok") {
								commitData();
								if (Object.keys(data).length > 0) {
									data.sn = row_temp.sn;
									_eventbus2.default.$emit("module.devices.DevicesRowEdit", data, event);
								}
							}
						});
					} }], type: "button",
				dialogOptions: {
					title: L("编辑设备信息"),
					fit: false,
					maxable: true,
					closeable: true,
					header: {
						visible: true
					},
					footer: {},
					popup: {
						enabled: false
					},
					width: '500px',
					height: '600px',
					moveable: true,
					resizable: true,
					dimmer: true,
					type: "vue",
					source: "devices/operates/editDevices.vue",
					autoDestroy: true
				}
			}]
		};
	},

	methods: {},
	created: function created() {}
};

exports.default = ColsMixin;

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


/***/ })

});