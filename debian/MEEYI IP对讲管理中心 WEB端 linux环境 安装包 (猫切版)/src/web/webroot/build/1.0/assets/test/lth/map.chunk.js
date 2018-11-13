webpackJsonp([103],{

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

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./test/lth/map/lth.map.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _map = __webpack_require__("./src/components/richmap/map.vue");

var _map2 = _interopRequireDefault(_map);

var _device = __webpack_require__("./src/common/device/device.vue");

var _device2 = _interopRequireDefault(_device);

var _device3 = __webpack_require__("./src/common/device.js");

var _device4 = _interopRequireDefault(_device3);

var _urls = __webpack_require__("./src/urls.js");

var urls = _interopRequireWildcard(_urls);

var _MapManager = __webpack_require__("./test/lth/utils/MapManager.js");

var _MapManager2 = _interopRequireDefault(_MapManager);

var _deepAssign = __webpack_require__("./node_modules/deep-assign/index.js");

var _deepAssign2 = _interopRequireDefault(_deepAssign);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DeviceDataManager = new _MapManager2.default({ refresh: urls.getdevicedatas });

exports.default = {
    components: { baidumapa: _map2.default, baidumapb: _map2.default },
    mixins: [],
    name: "testapp",
    events: {},
    data: function data() {
        return {
            baiduMapMeta: {
                debug: false,
                id: "_A_",
                mapControllers: {
                    NavigationControl: false,
                    ScaleControl: false
                },
                drawingOpt: {
                    markerOptions: {},
                    circleOptions: {},
                    polylineOptions: {},
                    polygonOptions: {},
                    rectangleOptions: {} },
                markerOpts: {
                    followText: "添加一个设备"
                },
                modes: {
                    edit: true,
                    draw: true
                },
                rightCorners: {
                    search: true
                },
                itemOptions: {
                    safebox: {
                        name: "safebox",
                        category: "safebox",
                        text: L("保险箱"),
                        icon: "drto-safebox iconfont",
                        anicolor: "red",
                        imgsrc: "http://orih6r7i8.bkt.clouddn.com/safebox_32.png",
                        markerIcon: { url: "https://i.imgur.com/4Dki7z3.png", size: [16, 16] },
                        actions: [{ name: "deploy", text: L("布防"), icon: "", url: "url/to/execute/deploy" }, { name: "alarm", text: L("警报"), icon: "", url: "url/to/execute/alarm" }]
                    },
                    iptalk: {
                        name: "iptalk",
                        category: "iptalk",
                        text: L("IP对讲主机"),
                        icon: "drto-mic iconfont",
                        anicolor: "blue",
                        imgsrc: "http://orih6r7i8.bkt.clouddn.com/mic_32.png",
                        markerIcon: { url: "https://i.imgur.com/zqUinzF.png", size: [16, 16] },
                        actions: [{ name: "call", text: L("呼叫"), icon: "", url: "url/to/execute/call" }, { name: "broadcast", text: L("广播"), icon: "", url: "url/to/execute/broadcast" }]
                    }
                },
                infoWindowContent: "components/richmap/device.async.vue",
                itemPropMapping: {
                    id: "id",
                    type: "type",
                    name: "title",
                    x: "x",
                    y: "y",
                    active: "active",
                    imgsrc: "imgsrc",
                    anicolor: "color"
                }
            },
            baiduMapMetab: {
                id: "_B_"
            },
            baiduMapData: {
                centerX: 118.62,
                centerY: 24.90,
                centerCity: "泉州",
                centerAuto: true,
                zoomScale: 5,

                markers: [],
                devices: [],
                selectedDevices: [],
                favoriteDevices: [],
                trackedDevices: [],
                markedDevices: [],

                shapes: [],
                fences: []
            },
            devices: [],
            devices0: [],
            fences: {},
            fencesb: {}
        };
    },

    methods: {
        onNewItems: function onNewItems(e) {
            var self = this;
            var newItem = e.context.newItems[0];
            var x = newItem.x;
            var y = newItem.y;
            var type = newItem.type;
            var imgsrc = newItem.imgsrc;
            var color = newItem.color;
            setTimeout(function () {
                var newItem = {
                    id: self.uuid(),
                    type: type,
                    x: x,
                    y: y,
                    imgsrc: imgsrc,
                    color: color,
                    active: false,
                    title: "新建设备"
                };
                self.devices.push(newItem);
                console.log("wong back");
                e.callback("wong");
            }, 2000);
        },
        onRemoveItems: function onRemoveItems(e) {
            var self = this;
            setTimeout(function () {
                var resolvedItemsId = [];
                var devicesId = self.devicesId();
                var itemsId = e.context.selectedItemsId;
                for (var k in itemsId) {
                    var i = self.devicesId().indexOf(itemsId[k]);
                    if (i !== -1) {
                        resolvedItemsId.push(self.devices[i].id);
                        self.devices.splice(i, 1);
                    }
                }
                console.log("wong back");
                var status = "resolved";
                var reply = { resolvedItemsId: resolvedItemsId };
                e.callback(reply, status);
            }, 1500);
        },
        onModifyItems: function onModifyItems(e) {
            setTimeout(function () {
                console.log("meowdified");
                e.callback("meowdified");
            }, 1000);
        },
        onMoveItems: function onMoveItems(e) {
            setTimeout(function () {
                console.log("meowved");
                e.callback("meowved");
            }, 2000);
        },
        onNewFences: function onNewFences(e) {
            var self = this;
            setTimeout(function () {
                console.log("meow back");

                for (var k in e.context.newFences) {
                    var f = e.context.newFences[k];

                    var newFenceId = self.uuid();
                    var newShape = e.context.shapeFactory(f.shape, newFenceId, { strokeWeight: 1 });

                    var newFence = {
                        id: newFenceId,
                        title: "新增围栏",
                        items: [],
                        itemsId: [],
                        shape: newShape
                    };

                    self.$set(self.fences, newFence.id, newFence);
                }

                e.callback("meowved");
            }, 2000);
        },
        onNewFencesb: function onNewFencesb(e) {
            console.log("meow~b");
        },
        uuid: function uuid() {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
            });
            return uuid;
        },
        devicesId: function devicesId() {
            var devicesId = [];
            for (var k in this.devices) {
                devicesId.push(this.devices[k].id);
            }
            return devicesId;
        }
    },
    created: function created() {
        var self = this;
        DeviceDataManager.refresh().then(function (data) {
            self.devices = data;
        }).catch(function (reason) {
            console.error(reason);
        });

        setTimeout(function ajaxPolling() {

            self.devices = [{
                id: "2002",
                type: "safebox",
                x: 118.63,
                y: 24.91,

                imgsrc: "http://i.imgur.com/ilIyCYi.png",
                color: "light red",
                active: false,
                title: "保险箱1号"
            }, {
                id: "2003",
                type: "iptalk",
                x: 116.404,
                y: 39.915,

                imgsrc: "http://i.imgur.com/dv0sSay.png",
                color: "light blue",
                active: false,
                title: "1号话筒"
            }, {
                id: "2004",
                type: "safebox",
                x: 91.06,
                y: 29.36,

                imgsrc: "http://i.imgur.com/ilIyCYi.png",
                color: "red",
                active: false,
                title: "3号保险箱"
            }];
            setTimeout(function () {
                self.$set(self.devices[0], "active", true);
                setTimeout(function () {
                    self.$set(self.devices[0], "color", "blue");
                }, 2000);
            }, 6000);
        }, 1000);
    }
};

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-09f709d0\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/contextmenu.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.contextmenu[data-v-09f709d0] {\n  position: fixed; /* 这里不能是 absolute */\n  background-color: white;\n  border-radius: 2px;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1196a064\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/common/device/device.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.vue-device {\n\t\tposition: relative;\n}\n.vue-device .device-attr-container,\n\t .vue-device .device-status-container {\n\t\tdisplay: flex;\n\t\tflex-wrap: wrap;\n\t\tjustify-content: center;\n}\n.vue-device .device-status-container,\n\t.vue-device .device-tab-container {\n\t\tpadding: 0;\n}\n.vue-device.borderless .device-attr-container,\n\t .vue-device.borderless .device-status-container,\n\t .vue-device.borderless .device-tab-container{\n\t\tborder-left: none!important;\n\t\tborder-right: none!important;\n}\n.vue-device.borderless .device-attr-container{\n\t\tborder-top: none!important;\n}\n.vue-device.borderless .device-tab-container{\n\t\tborder-bottom: none!important;\n}\n.vue-device .device-status-container .menubar {\n\t\tborder: 0;\n}\n.vue-device .device-tab-container .tabbar {\n\t\tborder-top: none!important;\n\t\tborder-right: none!important;\n\t\tborder-left: none!important;\n}\n.vue-device .device-tab-container .tabbar .active.item {\n\t\tfont-weight: bold;\n}\n.vue-device .device-tab-container .tabpanel {\n\t\tborder-right: none!important;\n\t\tborder-left: none!important;\n\t\tborder-bottom: none!important;\n\t\tpadding: 0;\n}\n.vue-device .device-attr-container>* {\n\t\tmargin: 0 5px 0 5px;\n}\n.vue-device .device-attr-container>*:first-child {\n\t\tmargin-left: 0;\n}\n.vue-device .device-attr-container>*:last-child {\n\t\tmargin-right: 0;\n}\n.vue-device .device-attr-container .device-title,\n\t.vue-device .device-attr-container .device-image-container,\n\t.vue-device .device-attr-container .device-attr {\n\t\tposition: relative;\n\t\toverflow: hidden;\n\t\tpadding: 0;\n\t\tborder: 0;\n    \tbox-shadow: none;\n}\n.vue-device .device-attr-container .device-name {\n\t\tdisplay: block!important;\n\t\ttext-align: center!important;\n}\n.vue-device .device-attr-container .device-image-container img {\n\t\theight: inherit;\n\t\twidth: inherit;\n}\n.vue-device .device-attr-container .device-image-container span {\n\t    position: absolute;\n\t\ttop: 50%;\n\t\tleft: 50%;\n\t\ttransform: translate(-50%,-50%);\n}\n.vue-device .device-attr .key {\n\t\tdisplay: inline-block;\n\t\tfont-weight: bold;\n}\n.vue-device .device-attr .value {\n\t\tpadding-left: 5px;\n}\n.vue-device .device-attr i {\n\t\tcursor: pointer;\n}\n.vue-device .device-status {\n\t\tposition: relative;\n}\n.vue-device .device-status i {\n\t\tmargin: 0;\n}\n.vue-device .device-status span {\n\t\tmargin-right: 10px;\n}\n.vue-device .device-status .empty.label {\n\t\tmargin: 10px 0 0 -15px!important;\n}\n,\n    .vue-device .ui.bottom.right.attached.label {\n}\n.vue-device .fade-enter-active, .vue-device .fade-leave-active {\n        transition: opacity 1s\n}\n.vue-device .fade-enter, .vue-device .fade-leave-active {\n        opacity: 0\n}\n.vue-device .tips {\n\t\tposition: absolute;\n\t\ttransform: translate(-50%,-50%);\n\t\tleft: 50%;\n\t\ttop: 50%;\n\t\tfont-weight: bold;\n}\n\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-12812b32\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./test/lth/map/lth.map.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.lth_testapp {\r\n    white-space: nowrap;\r\n    overflow: hidden;\n}\n.lth_testapp,\r\n.container {\r\n    height:100%;\n}\n.lth_testapp .container {\r\n    width:50%;\r\n    display: inline-block;\r\n    white-space: normal;\n}\r\n\r\n", ""]);

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

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-12812b32\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./test/lth/map/lth.map.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "lth_testapp"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('baidumapa', {
    attrs: {
      "meta": _vm.baiduMapMeta,
      "data": _vm.baiduMapData,
      "items": _vm.devices,
      "fences": _vm.fences
    },
    on: {
      "newItems": _vm.onNewItems,
      "removeItems": _vm.onRemoveItems,
      "modifyItems": _vm.onModifyItems,
      "moveItems": _vm.onMoveItems,
      "newFences": _vm.onNewFences
    }
  }, [_vm._v("\n            百度地图加载失败  \n        ")])], 1), _vm._v(" "), _c('div', {
    staticClass: "container"
  }, [_c('baidumapb', {
    attrs: {
      "meta": _vm.baiduMapMetab,
      "data": _vm.baiduMapData,
      "fences": _vm.fencesb
    },
    on: {
      "newFences": _vm.onNewFencesb
    }
  })], 1)])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-12812b32", module.exports)
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

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-12812b32\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./test/lth/map/lth.map.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-12812b32\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./test/lth/map/lth.map.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("0f18e498", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-12812b32\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../utils/lang-loader.js!./lth.map.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-12812b32\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../utils/lang-loader.js!./lth.map.vue");
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

/***/ "./src/assets/images/loading.gif":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/loading.64d7c5.gif";

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

/***/ "./test/lth/map/lth.map.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-12812b32\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./test/lth/map/lth.map.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./test/lth/map/lth.map.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-12812b32\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./test/lth/map/lth.map.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\test\\lth\\map\\lth.map.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] lth.map.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-12812b32", Component.options)
  } else {
    hotAPI.reload("data-v-12812b32", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./test/lth/utils/MapManager.js":
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

var _deepAssign = __webpack_require__("./node_modules/deep-assign/index.js");

var _deepAssign2 = _interopRequireDefault(_deepAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MapManager = function () {
    function MapManager(urls) {
        _classCallCheck(this, MapManager);

        this.urls = (0, _deepAssign2.default)({
            refresh: ""

        }, urls);
        this.data = [];
    }

    _createClass(MapManager, [{
        key: "subscribe",
        value: function subscribe() {
            var curUserName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "map";

            var self = this;

            StreamingManager.registerStreaming("device_streaming", new _datastreaming2.default());

            var deviceStreaming = StreamingManager.getStreaming("device_streaming");
            deviceStreaming.subscribe(function (value, channel) {
                self.data = value.data;
            });
        }
    }, {
        key: "refresh",
        value: function refresh() {
            var self = this;
            return new Promise(function (resolve, reject) {
                var opts = {};
                _webservice2.default.getJSON(self.urls.refresh, opts).then(function (response) {
                    if (response.status == "success") {
                        self.data = response.result.payload.data;
                    }
                    resolve(response.result.payload.data);
                }).catch(function (reason) {
                    reject(reason);
                });
            });
        }
    }]);

    return MapManager;
}();

exports.default = MapManager;

/***/ })

});