webpackJsonp([113],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/devices/components/main/map.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _baidumap = __webpack_require__("./src/components/baidumap/baidumap.vue");

var _baidumap2 = _interopRequireDefault(_baidumap);

var _eventbus = __webpack_require__("./src/common/eventbus.js");

var _eventbus2 = _interopRequireDefault(_eventbus);

var _vuex = __webpack_require__("./node_modules/vuex/dist/vuex.esm.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: { baidumap: _baidumap2.default },
	data: function data() {
		return {
			NodeData: null
		};
	},

	computed: _extends({}, (0, _vuex.mapState)({
		theme: function theme(state) {
			return state.theme;
		},
		devices: function devices(state) {
			return state.voerkaModule.devices.devices;
		},
		selectedDevices: function selectedDevices(state) {
			return state.voerkaModule.devices.selectedDevices;
		},
		curUserInfo: function curUserInfo(state) {
			return state.curUserInfo;
		}
	})),
	props: {
		devices: { type: Array, default: function _default() {
				return [];
			} },
		selectedDevices: { type: Array, default: function _default() {
				return [];
			} }
	},
	watch: {
		selectedDevices: function selectedDevices(newValue, oldValue) {
			this.filtrate(newValue);
		}
	},
	methods: {
		onMackerClick: function onMackerClick(NEOverlay) {
			var NEAttr = { "devicename": NEOverlay._title, "typename": NEOverlay._type, "id": NEOverlay._id, "install_location": NEOverlay._info.addr, "owner": NEOverlay._info.owner, "sensitivity": NEOverlay._info.sensitivity, "coord": NEOverlay._info.coord };

			_eventbus2.default.$emit("fromMapMarker", NEAttr);
		},
		joinFavorites: function joinFavorites(point) {},

		filtrate: function filtrate(value) {
			var collection = [];
			var self = this;
			var myImg = __webpack_require__("./src/assets/images/safebox.jpg");
			value.forEach(function (item1) {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = self.devices[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var item2 = _step.value;

						var flag = false;
						var _iteratorNormalCompletion2 = true;
						var _didIteratorError2 = false;
						var _iteratorError2 = undefined;

						try {
							for (var _iterator2 = item2.result.records[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
								var item3 = _step2.value;

								if (item3.id == item1) {
									collection.push(item3);
									flag = true;
									break;
								}
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

						if (flag) {
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
			});
			if (collection.length == 1) {
				var coord = collection[0].coord.split(",");
				var lat = coord[0];
				var lon = coord[1];
				var point = { "id": collection[0].id, "type": collection[0].typename, "x": lon, "y": lat, "imgsrc": myImg, "color": "blue", "active": true, "title": collection[0].devicename, "zoom": 15, "addr": collection[0].install_location, "owner": collection[0].owner, "sensitivity": collection[0].sensitivity, "coord": collection[0].coord };
				this.toBaiduMap(point);
			} else if (collection.length > 1) {
				var pointlist = [];
				collection.forEach(function (item) {
					var coord = item.coord.split(",");
					var lat = coord[0];
					var lon = coord[1];
					var point = { "id": item.id, "type": item.typename, "x": lon, "y": lat, "imgsrc": myImg, "color": "blue", "active": true, "title": item.devicename, "zoom": 15, "addr": item.install_location, "owner": item.owner, "sensitivity": item.sensitivity };
					pointlist.push(point);
				});
				this.toBaiduMap(pointlist);
			}
		},

		toBaiduMap: function toBaiduMap(value) {
			if (value instanceof Array && value.length > 1) {
				value.forEach(function (item) {
					item["info"] = { "addr": item.addr, "owner": item.owner, "sensitivity": item.sensitivity, "coord": item.coord };
				});
			} else {
				value["info"] = { "addr": value.addr, "owner": value.owner, "sensitivity": value.sensitivity, "coord": value.coord };
			}

			_eventbus2.default.$emit("module.devices.map.pointdata", value);
		}
	},
	events: {
		treeNodeData: function treeNodeData(msg) {
			msg["info"] = { "addr": msg.addr, "net": msg.net, "org": msg.org };

			_eventbus2.default.$emit("to-baidumap", msg);
		}
	},
	created: function created() {
		_eventbus2.default.$on("treeNodeData", this.treeNodeData);
	},
	beforeDestroy: function beforeDestroy() {
		_eventbus2.default.$off("treeNodeData", this.treeNodeData);
	},
	mounted: function mounted() {
		this.filtrate(this.selectedDevices);
	}
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/components/baidumap/baidumap-iptalk.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/components/baidumap/baidumap.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _vue = __webpack_require__("./node_modules/vue/dist/vue.min.js");

var _vue2 = _interopRequireDefault(_vue);

var _menubar = __webpack_require__("./src/components/menubar.vue");

var _menubar2 = _interopRequireDefault(_menubar);

var _baidumapIptalk = __webpack_require__("./src/components/baidumap/baidumap-iptalk.vue");

var _baidumapIptalk2 = _interopRequireDefault(_baidumapIptalk);

var _eventbus = __webpack_require__("./src/common/eventbus.js");

var _eventbus2 = _interopRequireDefault(_eventbus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	components: { menubar: _menubar2.default },
	data: function data() {
		Array.prototype.remove = function (val) {
			var index = this.indexOf(val);
			if (index > -1) {
				this.splice(index, 1);
			}
		};
		return {
			baidumap: null,
			markerMenu: [{ text: "属性", type: "property" }, { text: "移动", type: "move" }, { text: "删除", type: "delete" }, { text: "加入收藏夹", type: "joinFavorites" }, { text: "轨迹回放", type: "moveAnimation" }, { text: "追踪", type: "track" }, { text: "导航", type: "navigation" }, { text: "更多功能", type: "other" }],
			filterList: [],
			filteredArray: [],
			searchBoxArray: [] };
	},

	computed: {
		menuitems: function menuitems() {
			var pro = {
				reducedMode: { text: this.reducedMode, icon: "toggle off", click: "changeReduced", color: "black" },
				filterMode: { id: "filterMode", text: this.filterMode, icon: "list", type: "menu", children: [] },
				traffic: { text: "开启" + this.traffic, icon: "road", click: "openTraffic" },
				searchBox: { id: "searchBox", text: this.searchBox, type: "search", options: {
						source: [],
						onSelect: this.searchMarker
					} },
				point: { text: this.point, icon: "point", click: "drawing", drawingType: "marker" },
				circle: { text: this.circle, icon: "circle", click: "drawing", drawingType: "circle" },
				minus: { text: this.minus, icon: "minus", click: "drawing", drawingType: "polyline" },
				square: { text: this.square, icon: "square outline", click: "drawing", drawingType: "rectangle" },
				polygon: { text: this.polygon, icon: "map outline", click: "drawing", drawingType: "polygon" },
				clear: { text: this.clear, icon: "trash", click: "drawing", drawingType: "clear" },
				favorites: { id: "favorites", text: this.favorites, icon: "book", type: "menu", children: [{ text: "加入收藏夹", icon: "world", click: "joinFavorites" }] }
			};
			var list = this.menu.split(" ");
			var menulite = new Array();
			list.forEach(function (item) {
				if (item in pro) {
					menulite.push(pro[item]);
				}
			});
			return menulite;
		}
	},
	events: {
		changeReduced: function changeReduced(item) {
			item.icon = this.isReduced ? "toggle off" : "toggle on";
			this.isReduced = !this.isReduced;
			this.changeReducedState();
		},
		filterMarker: function filterMarker(item) {
			var self = this;
			var text = item.text;
			var allOverlay = self.baidumap.getOverlays();
			var show = function show(type, isShow) {
				allOverlay.forEach(function (ol, i) {
					if (typeof ol.reduced != "undefined" && ol._type == type) {
						isShow ? ol.show() : ol.hide();
					}
				});
			};
			var num = this.filteredArray.indexOf(text);
			if (num > -1) {
				this.filteredArray.remove(text);
				show(text, true);
			} else {
				this.filteredArray.push(text);
				show(text, false);
			}
		},
		openTraffic: function openTraffic(item) {
			if (!this.baidumapTrafficControl) {
				this.baidumapTrafficControl = new BMapLib.TrafficControl();
				this.baidumap.addControl(this.baidumapTrafficControl);
				this.isOpenTraffic = false;
			}
			this.isOpenTraffic = !this.isOpenTraffic;
			if (this.isOpenTraffic) {
				item.text = "关闭" + this.traffic;
				this.baidumapTrafficControl.showTraffic();
			} else {
				item.text = "开启" + this.traffic;
				this.baidumapTrafficControl.hideTraffic();
			}
		},
		drawing: function drawing(item) {
			var self = this;
			if (item.drawingType == "clear") {
				this.baidumapDrawingManager.close();
				var allOverlay = this.baidumap.getOverlays();
				allOverlay.forEach(function (ol, i) {
					if (typeof ol.reduced == "undefined") {
						self.baidumap.removeOverlay(ol);
					}
				});
				return;
			}
			if (!this.baidumapDrawingManager) {
				this.baidumapDrawingManager = new BMapLib.DrawingManager(this.baidumap, {
					isOpen: true,
					enableCalculate: true,
					polylineOptions: {
						strokeColor: "#333"
					} });
				this.baidumap.addControl(this.baidumapDrawingManager);
				this.baidumapDrawingManager.addEventListener('overlaycomplete', function (e) {
					self.baidumapDrawingManager.close();
					self.$emit("drawing-finish", e);
				});
			}
			this.baidumapDrawingManager.open();
			this.baidumapDrawingManager.setDrawingMode(item.drawingType);
		},
		joinFavorites: function joinFavorites() {
			var point = this.baidumap.getCenter();
			point.zoom = this.baidumap.getZoom();
			this.$emit("join-favorites", point);
		},
		gotoFavorite: function gotoFavorite(item) {
			this.baidumap.setZoom(item.zoom);
			this.baidumap.panTo(new BMap.Point(item.x, item.y));
		},
		showNE: function showNE(item) {
			this.showNE(item);
		}
	},
	props: {
		enableMapClick: { type: Boolean, default: false },
		panoramaControl: { type: Boolean, default: true },
		browserLocation: { type: Boolean, default: true },
		fit: { type: Boolean, default: true },
		x: { type: String, default: '118.62' },
		y: { type: String, default: '24.90' },
		city: { type: String, default: '泉州市' },
		markers: { type: Array },
		isReduced: { type: Boolean, default: false },
		markerIsMove: { type: Boolean, default: false },
		loadingColor: { type: String, default: 'blue' },
		loadingText: { type: String, default: '正在加载中...' },
		loadingBackground: { type: String, default: '#DDDDDD' },

		minAnimationFps: { type: Number, default: 30 },
		animationTime: { type: Number, default: 10 },
		menu: { type: String, default: 'reducedMode filterMode traffic searchBox point circle minus square polygon clear favorites' },
		reducedMode: { type: String, default: '简化模式' },
		filterMode: { type: String, default: '过滤模式' },
		traffic: { type: String, default: '实时路况' },
		searchBox: { type: String, default: '搜索' },
		point: { type: String, default: '画点' },
		circle: { type: String, default: '画圆' },
		minus: { type: String, default: '画线' },
		square: { type: String, default: '画矩形' },
		polygon: { type: String, default: '画多边形' },
		clear: { type: String, default: '清除图案' },
		favorites: { type: String, default: '地图收藏夹' }
	},
	methods: {
		loadBaidumapJs: function loadBaidumapJs(sign, url) {
			var script = document.querySelector("script[" + sign + "]");
			if (!script) {
				script = document.createElement("script");
				script.setAttribute(sign, "true");
				script.type = "text/javascript";
				script.src = url;
				document.body.appendChild(script);
			}
		},
		loadBaidumapCss: function loadBaidumapCss(sign, url) {
			var css = document.querySelector("link[" + sign + "]");
			if (!css) {
				css = document.createElement("link");
				css.setAttribute(sign, "true");
				css.rel = "stylesheet";
				css.href = url;
				document.body.appendChild(css);
			}
		},
		createMarkerElement: function createMarkerElement(item) {
			var active = item.active ? "active" : "";
			var marker_template = '\n\t\t\t\t<div class="marker">\n\t\t\t\t\t<div class="baiduicon ' + item.color + ' ' + active + '">\n\t\t\t\t\t\t<img src="' + item.imgsrc + '">\n\t\t\t\t\t\t<div></div>\n\t\t\t\t\t\t<div></div>\n\t\t\t\t\t\t<div></div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="pointer ' + item.color + '" title="' + item.title + '"></div>\n\t\t\t\t\t<div class="ignored ui popup top left transition">\n\t\t\t\t\t\t<div class="loadingtext">\u6B63\u5728\u52A0\u8F7D\u4E2D...</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t';
			var markerEle = $(marker_template).get(0);
			return markerEle;
		},
		createMarker: function createMarker(item) {
			var self = this;

			function NEOverlay(item) {
				var point = new BMap.Point(item.x, item.y);
				this._id = item.id;
				this._type = item.type;
				this._point = point;
				this._imgsrc = item.imgsrc;
				this._color = item.color;
				this._isActive = item.active;
				this._title = item.title;
				this._info = item.info;
				this._showMarkerTop = false;
				this._context = item.context;
				this.html = item.html;
			}

			NEOverlay.prototype = new BMap.Overlay();

			NEOverlay.prototype.initialize = function (map) {
				this._map = map;

				var div = self.createMarkerElement(item);

				map.getPanes().markerPane.appendChild(div);

				this._div = div;

				this.reduced(self.isReduced);

				if (self.filteredArray.indexOf(this._type) > -1) {
					this.hide();
				}
				var ne = this;
				var neClick = function neClick() {
					self.$emit("marker-click", ne);
					if (ne._showMarkerTop) {
						ne.showContext(false);
					} else {
						var allOverlay = self.baidumap.getOverlays();
						allOverlay.forEach(function (ol, i) {
							if (typeof ol.reduced != "undefined") {
								ol.showContext(false);
							}
						});
						ne.showContext(true);
					}
				};

				$(this._div).children(".baiduicon")[0].onclick = neClick;
				$(this._div).children(".pointer")[0].onclick = neClick;
				return this._div;
			};

			NEOverlay.prototype.draw = function () {
				var position = this._map.pointToOverlayPixel(this._point);
				this._div.style.left = position.x - 16 + "px";
				this._div.style.top = position.y - 44 + "px";
			};

			NEOverlay.prototype.show = function () {
				if (this._div) {
					this._div.style.display = "inline";
				}
			};

			NEOverlay.prototype.hide = function () {
				if (this._div) {
					this._div.style.display = "none";
				}
			};

			NEOverlay.prototype.update = function (item) {
				this._point = new BMap.Point(item.x, item.y);
				this._imgsrc = item.imgsrc;
				this._color = item.color;
				this._isActive = item.isActive;
				this._title = item.title;
				this._context = item.context;

				var div = this._div;
				var active = item.isActive ? ' active' : '';
				div.setAttribute("class", 'marker ' + item.color + active);
				var img = div.getElementsByTagName('img')[0];
				img.setAttribute("src", item.imgsrc);
				var pointer = div.getElementsByClassName('pointer')[0];
				pointer.setAttribute("class", "pointer " + item.color);
				pointer.setAttribute("title", item.title);
			};

			NEOverlay.prototype.reduced = function (b) {
				var icon = $(this._div).children(".baiduicon")[0];
				icon.style.display = b ? "none" : "inline";
			};

			NEOverlay.prototype.showContext = function (b) {
				this._showMarkerTop = b;
				var markertop = $(this._div).children(".ignored").get(0);
				var ne = this;
				if (this._context != undefined && b) {
					markertop.className = "ignored ui popup top center transition visible";
					markertop.innerHTML = this._context;
				} else if (b) {
					markertop.className = "ignored ui popup top center transition visible";
					if (this.html != undefined) {
						markertop.innerHTML = '<div class="loadingtext">' + this.html + '</div>';
					} else {
						var ajaxurl = '../../test/zwq/json/markercontext' + this._id + '.json';
						$.ajax({
							type: "GET",
							url: ajaxurl,
							dataType: 'json',
							contentType: "application/json",
							success: function success(data) {
								if (ne._showMarkerTop) {
									if (data.type == "html") {
										markertop.innerHTML = data.info;
									} else if (data.type == "vue") {
										if (data.target == "iptalk") {
											var myComponent = _vue2.default.extend(_baidumapIptalk2.default);
											var inst = new myComponent(data.parameters);
											inst.$mount(markertop);
										}
									}
								}
							},
							error: function error(data) {
								if (ne._showMarkerTop) {
									markertop.innerHTML = '<div class="loadingtext">数据请求失败</div>';
								}
							}
						});
					}
				} else {
					markertop.className = "ignored ui popup top left transition";
				}
			};
			var marker = new NEOverlay(item);
			return marker;
		},

		initBaiduMapScript: function initBaiduMapScript() {
			var self = this;
			if (window.BaiduMapCallback == undefined) {
				window.BaiduMapCallback = function () {
					$(".baidumap").trigger("baiduMapReady");
				};
				self.loadBaidumapJs("baidumap", "http://api.map.baidu.com/api?v=2.0&ak=8de0cddf67519eeb66e3886c4596365c&callback=BaiduMapCallback");
				self.loadBaidumapJs("DistanceTool", "http://api.map.baidu.com/library/DistanceTool/1.2/src/DistanceTool.js");
			} else {
				$(".baidumap").trigger("baiduMapReady");
			}
		},
		createBaibuMap: function createBaibuMap() {
			var self = this;
			var container = $(this.$el).children(".baidumap").get(0);
			var map = new BMap.Map(container, { enableMapClick: this.enableMapClick });
			map._container = container;
			map.enableScrollWheelZoom(true);
			map.addControl(new BMap.ScaleControl());
			map.centerAndZoom(this.city, 15);
			map.addEventListener("zoomend", function (type, target) {
				var bounds = map.getBounds();
				bounds.zoom = map.getZoom();
				self.$emit("view-change", bounds);
			});

			map.addEventListener("moveend", function (type, target) {
				var bounds = map.getBounds();
				bounds.zoom = map.getZoom();
				self.$emit("view-change", bounds);
			});

			this.loadBaidumapJs("TrafficControl", "http://api.map.baidu.com/library/TrafficControl/1.2/src/TrafficControl.js");

			this.loadBaidumapJs("DrawingManager", "http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager.js");
			this.loadBaidumapCss("DrawingManager", "http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css");

			if (this.panoramaControl) {
				var pcCtrl = new BMap.PanoramaControl();
				pcCtrl.setOffset(new BMap.Size(20, 20));
				map.addControl(pcCtrl);
			}
			this.baidumap = map;
			if (this.browserLocation) {
				this.getCurrentPosition();
			}
		},
		getCurrentPosition: function getCurrentPosition() {
			var geolocation = new BMap.Geolocation();
			var map = this.baidumap;
			var self = this;
			geolocation.getCurrentPosition(function (r) {
				if (this.getStatus() == BMAP_STATUS_SUCCESS) {
					self.addMarkers({ "id": "-1", "type": "用户", "x": r.point.lng, "y": r.point.lat, "imgsrc": "../../../test/zwq/image/dog.png", "color": "red", "active": true, "title": "我", "info": "你自己啦！" });
					map.panTo(r.point);
				} else {
					alert('failed:' + this.getStatus());
				}
			}, {
				enableHighAccuracy: true
			});
		},
		deleteMarkers: function deleteMarkers(items) {
			var self = this;
			var allOverlay = self.baidumap.getOverlays();
			var deleteMarker = function deleteMarker(item) {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = allOverlay[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var ol = _step.value;

						if (ol._id == item.id) {
							self.baidumap.removeOverlay(ol);
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
			};
			if (items[0] != undefined) {
				items.forEach(function (item) {
					deleteMarker(item);
				});
			} else {
				deleteMarker(items);
			}
		},
		updateMarkers: function updateMarkers(items) {
			this.addMarkers(items);
		},
		getMarker: function getMarker(allOverlay, itemID) {
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = allOverlay[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var ol = _step2.value;

					if (ol._id == itemID) {
						return ol;
					}
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

			return null;
		},
		getMarkerByTitle: function getMarkerByTitle(allOverlay, itemTitle) {
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = allOverlay[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var ol = _step3.value;

					if (ol._title == itemTitle) {
						return ol;
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

			return null;
		},
		addMarkers: function addMarkers(items) {
			var self = this;
			var addFilterItem = function addFilterItem(item) {
				if (self.filterList.indexOf(item.type) == -1) {
					var temp = { text: item.type, type: "checkbox", change: "filterMarker" };
					if (self.menuitems.length > 0) {
						self.$refs.menubar.addMenuItem("filterMode", temp);
					}
					self.filterList.push(item.type);
				}
			};
			var addSerachArray = function addSerachArray(item) {
				self.searchBoxArray.push({ title: item.id });
				self.searchBoxArray.push({ title: item.title });
				$(".menubar.ui #searchBox").search({ source: self.searchBoxArray });
			};
			var addMarker = function addMarker(item) {
				var marker = self.getMarker(allOverlay, item.id);
				if (marker == null) {
					marker = self.createMarker(item);
					self.baidumap.addOverlay(marker);

					addFilterItem(item);

					addSerachArray(item);
				} else {
					marker.update(item);

					marker.draw();
				}
			};
			if (self.baidumap) {
				var allOverlay = this.baidumap.getOverlays();
				if (items[0] != undefined) {
					items.forEach(function (item) {
						addMarker(item);
					});
				} else {
					addMarker(items);
				}
			} else {
				if (self.markers) {
					self.markers = self.markers.concat(items);
				} else {
					self.markers = items;
				}
			}
		},
		changeReducedState: function changeReducedState() {
			var self = this;
			var allOverlay = this.baidumap.getOverlays();
			allOverlay.forEach(function (ol, i) {
				if (typeof ol.reduced != "undefined") {
					ol.reduced(self.isReduced);
				}
			});
		},
		markerMoveAnimation: function markerMoveAnimation(item) {
			var self = this;
			if (this.markerIsMove) {
				alert("当前有动画正在播放");
			} else {
				var allOverlay = this.baidumap.getOverlays();
				var marker = this.getMarker(allOverlay, item.id);
				var length = item.points.length;

				var points = new Array();
				item.points.forEach(function (point, i) {
					points.push(new BMap.Point(point.x, point.y));
				});
				var polyline = new BMap.Polyline(points);
				this.baidumap.addOverlay(polyline);

				var realTime = item.points[length - 1].time - item.points[0].time;
				var temp = realTime / this.animationTime;
				var playList = new Array();
				var i = void 0;
				for (i = 0; i < length - 1; i++) {
					var x = item.points[i + 1].x - item.points[i].x;
					var y = item.points[i + 1].y - item.points[i].y;
					var time = item.points[i + 1].time - item.points[i].time;
					var con = parseInt(time / temp * this.minAnimationFps);
					var j = void 0;
					for (j = 0; j < con; j++) {
						var _playItem = new Object();
						_playItem.x = item.points[i].x + x * j / con;
						_playItem.y = item.points[i].y + y * j / con;
						_playItem.time = time / temp / con;
						playList.push(_playItem);
					}
				}

				var playItem = new Object();
				playItem.x = item.points[length - 1].x;
				playItem.y = item.points[length - 1].y;
				playItem.time = 0;
				playList.push(playItem);

				var k = 0;
				var updateMarkPoint = function updateMarkPoint() {
					if (k < playList.length) {
						marker._point = new BMap.Point(playList[k].x, playList[k].y);
						marker.draw();
						setTimeout(updateMarkPoint, playList[k].time * 1000);
						k++;
					} else {
						self.markerIsMove = false;
					}
				};
				this.markerIsMove = true;
				updateMarkPoint();
			}
		},
		searchMarker: function searchMarker(result, response) {
			var value = result.title;
			var allOverlay = this.baidumap.getOverlays();
			var marker = this.getMarker(allOverlay, value);
			if (!marker) {
				marker = this.getMarkerByTitle(allOverlay, value);
			}
			if (marker) {
				this.baidumap.panTo(marker._point);
				this.$emit("search-marker", marker);
			} else {
				alert("未找到对象");
			}
		},
		loadFavorites: function loadFavorites(items) {
			var self = this;
			items.forEach(function (item) {
				item.click = "gotoFavorite";
				item.icon = "star";
				if (self.menuitems.length > 0) {
					self.$refs.menubar.addMenuItem("favorites", item);
				}
			});
		},
		centerAndZoom: function centerAndZoom(x, y, zoom) {
			this.baidumap.centerAndZoom(new BMap.Point(x, y), zoom);
		},
		showNE: function showNE(item) {
			var pointFrom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
			var pointTo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;

			var translateCallback = function translateCallback(data) {
				if (data.status === 0) {
					item.x = data.points[0].lng;
					item.y = data.points[0].lat;
				}
				self._showNE(item);
			};
			var self = this;
			var convertor = new BMap.Convertor();
			var pointArr = [];
			var ggPoint = new BMap.Point(item.x, item.y);
			pointArr.push(ggPoint);
			convertor.translate(pointArr, pointFrom, pointTo, translateCallback);
		},
		_showNE: function _showNE(item) {
			if (this.baidumap) {
				if (item instanceof Array && item.length > 1) {
					this.addMarkers(item);
				} else {
					if (item.x && item.y) {
						this.addMarkers(item);
						this.centerAndZoom(item.x, item.y, item.zoom);
					}
				}
			}
		},
		tracking: function tracking(item) {
			if (item.NEOverlay) {
				this.showNE(item.NEOverlay);
			}
			if (item.trackings) {
				this.markerMoveAnimation(item.trackings);
			}
		}
	},
	mounted: function mounted() {
		var self = this;
		$(this.$el).on("baiduMapReady", function () {
			self.createBaibuMap();
			if (self.markers) {
				self.addMarkers(self.markers);
			}
		});
		this.initBaiduMapScript();
	},
	created: function created() {
		_eventbus2.default.$on('to-baidumap', this.showNE);
		_eventbus2.default.$on("module.devices.map.pointdata", this.showNE);
		_eventbus2.default.$on("tracking", this.tracking);
	},

	beforeDestroy: function beforeDestroy() {
		_eventbus2.default.$off('to-baidumap', this.showNE);
		_eventbus2.default.$off("tracking", this.tracking);
	}
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-341cda12\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/baidumap/baidumap-iptalk.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\ndiv[data-v-341cda12] {\n\twhite-space:nowrap;/*强制不换行*/\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7017f7d9\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/baidumap/baidumap.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports
exports.i(__webpack_require__("./node_modules/css-loader/index.js!./src/components/baidumap/baidumap.css"), "");

// module
exports.push([module.i, "\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7e5e94dc\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/devices/components/main/map.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\r\n/*.mymap{\r\n}*/\r\n\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./src/components/baidumap/baidumap.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ".mapwrapper.fit{\r\n\tposition: absolute;\r\n\ttop:0px;\r\n\tleft:0px;\r\n\twidth: 100%;\r\n\theight:100%;\r\n}\r\n.baidumap {\r\n\tposition: absolute;\r\n\ttop:42px;\r\n\tleft:0px;\r\n\tright: 0px;\r\n\tbottom:0px;\r\n}\r\n.baidumap.fit{\r\n  top:0px;\r\n}\r\n.baidumap .marker{\r\n\tposition: absolute;\r\n}\r\n.baidumap .marker .ignored.ui.popup{\r\n\tposition: absolute;\r\n\tright :auto;\r\n\ttop :auto;\r\n\tbottom: 0px;\r\n  min-width: 300px;\r\n  left: -134px;/*150-32/2*/\r\n\tmax-width:1000px;/*覆盖原有320px*/\r\n\tpadding:2px;/*覆盖原有.833em 1em*/\r\n\tbox-shadow: 10px -10px 10px rgba(0,0,0,.4);\r\n  text-align: center;\r\n}\r\n.baidumap .marker .ignored.ui.popup:before{\r\n\tz-index: -1;\r\n}\r\n.baidumap .marker .ignored.ui.popup .loadingtext{\r\n\twhite-space:nowrap;/*强制不换行*/\r\n}\r\n/*点*/\r\n.baidumap .marker > .pointer{\r\n\tposition: absolute;\r\n\ttop:40px;\r\n    left:12px;\r\n\twidth:8px;\r\n\theight:8px;\r\n\tborder-radius:4px;\r\n}\r\n.baidumap .marker > .pointer:before{\r\n\tcontent: attr(title);\r\n\tposition: absolute;\r\n\ttop:12px;\r\n  background:none;\r\n  padding:2px;\r\n\twhite-space:nowrap;\r\n\tfont-family:\"\\5B8B\\4F53\";\r\n\tfont-size: 12px;\r\n\tleft: 50%;\r\n\twidth: 200px;\r\n\tmargin-left: -100px;\r\n\ttext-align: center;\r\n}\r\n@-webkit-keyframes marker {\r\n    0% {\r\n      -webkit-transform : scale(1);\r\n      transform         : scale(1);\r\n      opacity           : 0;\r\n    }\r\n    15% {\r\n      opacity : 1;\r\n    }\r\n\r\n    100% {\r\n      -webkit-transform : scale(3);\r\n      transform         : scale(3);\r\n      opacity           : 0;\r\n    }\r\n\t}\r\n@-moz-keyframes marker {\r\n    0% {\r\n      -webkit-transform : scale(1);\r\n      transform         : scale(1);\r\n      opacity           : 0;\r\n    }\r\n    15% {\r\n      opacity : 1;\r\n    }\r\n\r\n    100% {\r\n      -webkit-transform : scale(3);\r\n      transform         : scale(3);\r\n      opacity           : 0;\r\n    } \r\n}\r\n\r\n@keyframes marker {\r\n    0% {\r\n      -webkit-transform           : scale(1);\r\n      transform                   : scale(1);\r\n      opacity                     : 0; \r\n    }\r\n    15% {\r\n      opacity                     : 1; \r\n    }\r\n    100% {\r\n      -webkit-transform           : scale(3);\r\n      transform                   : scale(3);\r\n      opacity                     : 0; \r\n    } \r\n}\r\n.baidumap .marker > .baiduicon{\r\n    position      : absolute;\r\n    top           : 0px;\r\n    left          : 0px;\r\n    width         : 32px;\r\n    height        : 32px;\r\n    border-radius : 16px;\r\n    background    : white;\r\n    -webkit-box-shadow: 0px 0px 4px #555;\r\n    -moz-box-shadow: 0px 0px 4px #555;\r\n    box-shadow: 0px 0px 4px #555;\r\n    cursor: pointer;\r\n}\r\n.baidumap .marker > .baiduicon.active {   \r\n/*  -webkit-transform : translateY(-30px);\r\n    -moz-transform    : translateY(-30px);\r\n    transform         : translateY(-30px);*/\r\n}\r\n/*文字部分*/\r\n.baidumap .marker > .baiduicon > .title{\r\n\tposition:absolute;\r\n\tleft: 36px;\r\n\ttop: 6px;\r\n\tsize : 12px;\r\n\theight : 20px;\r\n\tline-height : 20px;\r\n\tfont-family:\"\\5B8B\\4F53\";\r\n\twhite-space:nowrap;/*强制不换行*/\r\n}\r\n.baidumap .marker > .baiduicon > div{\r\n    position      : absolute;\r\n    box-sizing    : border-box;\r\n    width         : 32px;\r\n    height        : 32px;\r\n    border-radius : 100%;\r\n    margin        : 0px;\r\n}\r\n.baidumap .marker > .baiduicon:hover > div{\r\n    border                      : 1px solid #DDD;\r\n    -webkit-animation-fill-mode : both;\r\n    animation-fill-mode         : both;\r\n    opacity                     : 0;\r\n    -webkit-animation           : marker 1s 0s linear infinite;\r\n    -moz-animation              : marker 1s 0s linear infinite;\r\n    animation                   : marker 1s 0s linear infinite;\r\n}\r\n.baidumap .marker > .baiduicon.active > div{\r\n    border                      : 1px solid #DDD;\r\n    -webkit-animation-fill-mode : both;\r\n    animation-fill-mode         : both;\r\n    opacity                     : 0;\r\n    -webkit-animation           : marker 1s 0s linear infinite;\r\n    -moz-animation              : marker 1s 0s linear infinite;\r\n    animation                   : marker 1s 0s linear infinite;\r\n}\r\n.baidumap .marker > .baiduicon.active > div:nth-child(2) {\r\n    -webkit-animation-delay : 0.3s;\r\n    -moz-animation-delay    : 0.3s;\r\n    animation-delay         : 0.3s;\r\n}\r\n.baidumap .marker > .baiduicon.active > div:nth-child(3) {\r\n    -webkit-animation-delay : 0.8s;\r\n    -moz-animation-delay    : 0.8s;\r\n    animation-delay         : 0.8s;\r\n}\r\n\r\n.baidumap .marker > .baiduicon:after{\r\n    content       : \"\";\r\n    position      : absolute;\r\n    display       : block;\r\n    top           : 98%;\r\n    width         : 8px;\r\n    height        : 16px;\r\n    left          : 12px;\r\n    border-top    : 8px solid white;\r\n    border-bottom : 8px solid transparent;\r\n    border-left   : 4px solid transparent;\r\n    border-right  : 4px solid transparent;\r\n    box-sizing    : border-box;\r\n}\r\n.baidumap .marker > .baiduicon:before{\r\n    content       : \"\";\r\n    display       : block;\r\n    position      : absolute;\r\n    top           : 3px;\r\n    left          : 3px;\r\n    width         : 26px;\r\n    height        : 26px;\r\n    border-radius : 13px;\r\n    background    : white;\r\n    border        : 1px solid #AAA;\r\n    box-sizing    : border-box;\r\n}\r\n.baidumap .marker > .baiduicon>img{\r\n\tposition      : absolute;\r\n\ttop           : 4px;\r\n\tleft          : 4px;\r\n\twidth         : 24px;\r\n\theight        : 24px;\r\n\tborder-radius : 12px;\r\n  }\r\n.baidumap .marker > .baiduicon:hover{\r\n    -moz-box-shadow: 0px 0px 55px #d6d6d6;\r\n    -webkit-box-shadow: 0px 0px 55px #d6d6d6;\r\n    box-shadow: 0px 0px 55px #d6d6d6,0px 2px 2px #555;\r\n}\r\n/*选择*/\r\n.baidumap .marker > .baiduicon.selected{\r\n    -webkit-box-shadow: inset 0px 1px 4px #555;\r\n    -moz-box-shadow: inset 0px 1px 4px #555;\r\n    box-shadow: inset 0px 1px 4px #555;\r\n}\r\n\r\n/*影响范围*/\r\n@keyframes  marker_scope {\r\n    0% {\r\n      -webkit-transform           : scale(1);\r\n      transform                   : scale(1);\r\n      opacity                     : 0; \r\n    }\r\n    15% {\r\n      opacity                     : 1; \r\n    }\r\n    100% {\r\n      -webkit-transform           : scale(3);\r\n      transform                   : scale(3);\r\n      opacity                     : 1; \r\n    } \r\n}\r\n.baidumap .marker > .baiduicon:before:before{\r\n    position: absolute;\r\n    display: block;\r\n    top:0px;\r\n    left:0px;\r\n    height:300%;\r\n    height:300%;\r\n    border:1px solid blue;\r\n    box-sizing:border-box;\r\n}\r\n.baidumap .marker .red{background: #DB2828;}\r\n.baidumap .marker .orange{background: #F2711C;}\r\n.baidumap .marker .yellow{background: #FBBD08;}\r\n.baidumap .marker .olive{background: #B5CC18;}\r\n.baidumap .marker .green{background: #21BA45;}\r\n.baidumap .marker .teal{background: #00B5AD;}\r\n.baidumap .marker .blue{background: #2185D0;}\r\n.baidumap .marker .violet{background: #6435C9;}\r\n.baidumap .marker .purple{background: #A333C8;}\r\n.baidumap .marker .pink{background: #E03997;}\r\n.baidumap .marker .brown{background: #A5673F;}\r\n.baidumap .marker .grey{background: #767676;}\r\n.baidumap .marker .black{background: #1B1C1D;}\r\n\r\n.baidumap .marker .active.red > div{border : 1px solid #DB2828;}\r\n.baidumap .marker .active.orange > div{border : 1px solid #F2711C;}\r\n.baidumap .marker .active.yellow > div{border : 1px solid #FBBD08;}\r\n.baidumap .marker .active.olive > div{border : 1px solid #B5CC18;}\r\n.baidumap .marker .active.green > div{border : 1px solid #21BA45;}\r\n.baidumap .marker .active.teal > div{border : 1px solid #00B5AD;}\r\n.baidumap .marker .active.blue > div{border : 1px solid #2185D0;}\r\n.baidumap .marker .active.violet > div{border : 1px solid #6435C9;}\r\n.baidumap .marker .active.purple > div{border : 1px solid #A333C8;}\r\n.baidumap .marker .active.pink > div{border : 1px solid #E03997;}\r\n.baidumap .marker .active.brown > div{border : 1px solid #A5673F;}\r\n.baidumap .marker .active.grey > div{border : 1px solid #767676;}\r\n.baidumap .marker .active.grey > div{border : 1px solid #767676;}\r\n.baidumap .marker .active.black > div{border : 1px solid #1B1C1D;}\r\n\r\n.baidumap .marker .red:after{border-top : 8px solid #DB2828;}\r\n.baidumap .marker .orange:after{border-top : 8px solid #F2711C;}\r\n.baidumap .marker .yellow:after{border-top : 8px solid #FBBD08;}\r\n.baidumap .marker .olive:after{border-top : 8px solid #B5CC18;}\r\n.baidumap .marker .green:after{border-top : 8px solid #21BA45;}\r\n.baidumap .marker .teal:after{border-top : 8px solid #00B5AD;}\r\n.baidumap .marker .blue:after{border-top : 8px solid #2185D0;}\r\n.baidumap .marker .violet:after{border-top : 8px solid #6435C9;}\r\n.baidumap .marker .purple:after{border-top : 8px solid #A333C8;}\r\n.baidumap .marker .pink:after{border-top : 8px solid #E03997;}\r\n.baidumap .marker .brown:after{border-top : 8px solid #A5673F;}\r\n.baidumap .marker .grey:after{border-top : 8px solid #767676;}\r\n.baidumap .marker .black:after{border-top : 8px solid #1B1C1D;}", ""]);

// exports


/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-341cda12\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/components/baidumap/baidumap-iptalk.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('p', [_vm._v("我是百度地图测试demo")]), _vm._v(" "), _c('p', [_vm._v(_vm._s(_vm.message))])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-341cda12", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-7017f7d9\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/components/baidumap/baidumap.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "mapwrapper",
    class: {
      'fit': _vm.fit
    }
  }, [(_vm.menuitems.length > 0) ? _c('menubar', {
    ref: "menubar",
    staticStyle: {
      "height": "42px"
    },
    attrs: {
      "items": _vm.menuitems,
      "docked": "top"
    }
  }) : _vm._e(), _vm._v(" "), _c('div', {
    class: _vm.menuitems.length > 0 ? 'baidumap' : 'baidumap fit'
  })], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-7017f7d9", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-7e5e94dc\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/devices/components/main/map.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "mymap"
  }, [_c('div', [_c('baidumap', {
    ref: "baidumap",
    attrs: {
      "menu": "traffic searchBox point polygon clear favorites",
      "point": "L(定位)",
      "polygon": "L(电子围栏)",
      "clear": "L(清除电子围栏)",
      "browser-location": false
    },
    on: {
      "join-favorites": _vm.joinFavorites,
      "marker-click": _vm.onMackerClick
    }
  })], 1)])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-7e5e94dc", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-341cda12\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/baidumap/baidumap-iptalk.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-341cda12\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/baidumap/baidumap-iptalk.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("ef8e9df0", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-341cda12\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../utils/lang-loader.js!./baidumap-iptalk.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-341cda12\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../utils/lang-loader.js!./baidumap-iptalk.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7017f7d9\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/baidumap/baidumap.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7017f7d9\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/baidumap/baidumap.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("296a9855", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7017f7d9\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../utils/lang-loader.js!./baidumap.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7017f7d9\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../utils/lang-loader.js!./baidumap.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7e5e94dc\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/devices/components/main/map.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7e5e94dc\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/devices/components/main/map.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("bc586978", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../../node_modules/css-loader/index.js!../../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7e5e94dc\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../../../../utils/lang-loader.js!./map.vue", function() {
     var newContent = require("!!../../../../../../../node_modules/css-loader/index.js!../../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7e5e94dc\",\"scoped\":true,\"hasInlineConfig\":false}!../../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../../../../../utils/lang-loader.js!./map.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/apps/voerka/modules/devices/components/main/map.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7e5e94dc\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/devices/components/main/map.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/devices/components/main/map.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-7e5e94dc\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/apps/voerka/modules/devices/components/main/map.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-7e5e94dc",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\apps\\voerka\\modules\\devices\\components\\main\\map.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] map.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7e5e94dc", Component.options)
  } else {
    hotAPI.reload("data-v-7e5e94dc", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/assets/images/safebox.jpg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/safebox.59b2a5.jpg";

/***/ }),

/***/ "./src/components/baidumap/baidumap-iptalk.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-341cda12\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/baidumap/baidumap-iptalk.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/components/baidumap/baidumap-iptalk.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-341cda12\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/components/baidumap/baidumap-iptalk.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-341cda12",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\components\\baidumap\\baidumap-iptalk.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] baidumap-iptalk.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-341cda12", Component.options)
  } else {
    hotAPI.reload("data-v-341cda12", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./src/components/baidumap/baidumap.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7017f7d9\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/baidumap/baidumap.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/components/baidumap/baidumap.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-7017f7d9\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/components/baidumap/baidumap.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\components\\baidumap\\baidumap.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] baidumap.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7017f7d9", Component.options)
  } else {
    hotAPI.reload("data-v-7017f7d9", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ })

});