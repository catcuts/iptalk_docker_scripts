webpackJsonp([114],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/components/video.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, $) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _iptalkurls = __webpack_require__("./src/apps/iptalk/urls.js");

var urls = _interopRequireWildcard(_iptalkurls);

var _loadjs = __webpack_require__("./node_modules/loadjs/dist/loadjs.umd.js");

var _loadjs2 = _interopRequireDefault(_loadjs);

var _eventbus = __webpack_require__("./src/common/eventbus.js");

var _eventbus2 = _interopRequireDefault(_eventbus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ThirdPlayer = function () {
	function ThirdPlayer(player) {
		var _this = this;

		_classCallCheck(this, ThirdPlayer);

		this.player = videojs(player.id, player.opts, function () {
			player.ready(_this.player);
		});
	}

	_createClass(ThirdPlayer, [{
		key: "start",
		value: function start() {
			this.player.play();
		}
	}, {
		key: "stop",
		value: function stop() {
			this.player.dispose();
		}
	}, {
		key: "refresh",
		value: function refresh() {
			var src = this.player.reset().src({
				type: this.player.currentType(),
				src: this.player.currentSrc()
			});
			this.player.load(src).play();
		}
	}]);

	return ThirdPlayer;
}();

var NativePlayer = function () {
	function NativePlayer(player) {
		_classCallCheck(this, NativePlayer);

		this.player = player;
	}

	_createClass(NativePlayer, [{
		key: "start",
		value: function start() {}
	}, {
		key: "stop",
		value: function stop() {}
	}]);

	return NativePlayer;
}();

var dependencies = {
	videoCSS: "https://cdnjs.cloudflare.com/ajax/libs/video.js/6.2.8/video-js.min.css",
	videojs: "https://cdnjs.cloudflare.com/ajax/libs/video.js/6.2.8/video.min.js",
	videojsContribHls: "https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-hls/5.10.1/videojs-contrib-hls.min.js"
};

var defaultVideojsOpts = {
	controls: true,
	aspectRatio: "16:9",
	autoplay: true,
	preload: "auto"
};

exports.default = {
	components: {},
	data: function data() {
		return {
			player: null,
			id: "video_" + this.uuid()
		};
	},

	props: {
		dependencies: { type: Object, default: function _default() {
				return dependencies;
			} },
		videoType: { type: String, default: "" },
		videoSrc: { type: String, default: "" },
		command: { type: String, default: "" },
		playerOpts: { type: Object, default: function _default() {} },
		cameraObj: { type: Object, default: function _default() {} }
	},
	computed: {
		videojsOpts: function videojsOpts() {
			var videojsOpts = Object.assign({}, defaultVideojsOpts, this.playerOpts);
			return videojsOpts;
		}
	},
	methods: {
		test: function test() {
			console.log("meow");
		},
		loadDependencies: function loadDependencies() {
			var self = this;
			return new Promise(function (resolve, reject) {
				if (!self.depsToBeLoaded().length) {
					resolve();
				}
				(0, _loadjs2.default)(self.depsToBeLoaded(), {
					success: function success() {
						global.playerReady[self.videoType] = true;resolve();
					},
					error: function error(e) {
						reject(e);
					},
					async: false
				});
			});
		},
		initPlayer: function initPlayer(type, src) {
			var _this2 = this;

			if (this.player) {
				this.stopPlayer();
			}
			if (type) {
				var player = { id: this.id, opts: this.videojsOpts, ready: function ready(player) {
						_this2.onThirdPlayerReady(player, type, src);
					} };
				this.player = new ThirdPlayer(player);
			} else {
				var player = $("#" + this.id);
				this.player = new NativePlayer(player);
			}
		},
		onThirdPlayerReady: function onThirdPlayerReady(player, type, src) {
			console.log("player is ready");
			this.enablePlayerSizeResponsive(player);
			player.src({
				type: this.formatedType(type),
				src: src
			});


			var refreshComponent = this.createRefreshComponent(player);
			player.controlBar.addChild(refreshComponent, {}, 1);
			if (this.cameraObj.videoType === 'monitor') {
				var stopComponent = this.createStopComponent(player);
				player.controlBar.addChild(stopComponent, {}, 2);
			}
		},
		startPlayer: function startPlayer() {
			this.player.start();
		},
		stopPlayer: function stopPlayer() {
			this.player.stop();
		},
		enablePlayerSizeResponsive: function enablePlayerSizeResponsive(player) {
			var aspectRatio = player.aspectRatio().split(":");
			aspectRatio = aspectRatio[1] / aspectRatio[0];
			var width = $('#' + player.id()).parent().width();
			player.width(width);
			player.height(width * aspectRatio);
			window.onresize = function () {
				var width = $('#' + player.id()).parent().width();
				player.width(width);
				player.height(width * aspectRatio);
			};
		},
		depsToBeLoaded: function depsToBeLoaded() {
			var deps;
			switch (this.videoType) {
				case "hls":
					deps = [this.dependencies.videoCSS, this.dependencies.videojs, this.dependencies.videojsContribHls];break;
				case "rtmp":
					deps = [this.dependencies.videoCSS, this.dependencies.videojs];break;
				case "http":
					deps = [];break;
			}
			return deps;
		},
		formatedType: function formatedType(type) {
			switch (type) {
				case "hls":
					return "application/x-mpegURL";break;
				case "rtmp":
					return "rtmp/flv";break;
				case "http":
					return "";break;
			}
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
		createRefreshComponent: function createRefreshComponent(player) {
			var Component = videojs.getComponent("Component");

			var RefreshComponent = videojs.extend(Component, {
				createEl: function createEl() {
					var button = document.createElement("button");
					button.innerHTML = "刷新";
					return button;
				}
			});

			var refreshComponent = new RefreshComponent();

			var self = this;
			refreshComponent.on("click", function () {
				self.player.refresh();
			});

			refreshComponent.on("dispose", function () {});


			return refreshComponent;
		},
		createStopComponent: function createStopComponent(player) {
			var Component = videojs.getComponent("Component");

			var StopComponent = videojs.extend(Component, {
				createEl: function createEl() {
					var button = document.createElement("button");
					button.innerHTML = "结束";
					return button;
				}
			});

			var stopComponent = new StopComponent();

			var self = this;
			stopComponent.on("click", function () {
				var camera = self.cameraObj;
				if (camera.type === 'mic') {
					for (var i = 0; i < global.callStack.length; i++) {
						if ((global.callStack[i] || {}).DevIP === camera.key) {
							if (global.callStack[i].DevRelatedIPC.length === 0) {
								self.emitStopPaly(camera);
							} else {
								confirm(L("结束终端视频，联动摄像头的视频将被一起结束，确定结束吗？")).then(function (obj) {
									if (obj.button.classs === "positive") {
										self.emitStopPaly(camera);
									}
								});
							}
							break;
						}
					}
				} else {
					self.emitStopPaly(camera);
				}
			});

			stopComponent.on("dispose", function () {});


			return stopComponent;
		},
		emitStopPaly: function emitStopPaly(camera) {
			_eventbus2.default.$emit("stopOneVideoPlayer", camera);
		},
		addRefreshButton: function addRefreshButton(player, refreshComponent) {
			player.controlBar.addChild(refreshComponent, {}, 5);
		}
	},
	created: function created() {},
	beforeDestroy: function beforeDestroy() {
		this.stopPlayer();
	},
	mounted: function mounted() {
		this.$nextTick(function () {
			if (!global.playerReady[this.videoType]) {
				var self = this;
				this.loadDependencies().then(function () {
					self.initPlayer(self.videoType, self.videoSrc);
				}, function (e) {
					console.error(e);
				});
			} else {
				this.initPlayer(this.videoType, this.videoSrc);
			}
		});
	}
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js"), __webpack_require__("./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./test/lth/video/lth.video.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _video = __webpack_require__("./src/components/video.vue");

var _video2 = _interopRequireDefault(_video);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    components: { player: _video2.default },
    mixins: [],
    name: "testapp",
    events: {},
    data: function data() {
        return {
            videoType: "rtmp",
            videoSrc: "rtmp://live.hkstv.hk.lxdns.com/live/hks",
            dependencies: {
                videoCSS: "/js/video.js/dist/video-js.min.css",
                videojs: "/js/video.js/dist/video.min.js",
                videojsContribHls: "/js/videojs-contrib-hls/dist/videojs-contrib-hls.min.js"
            }
        };
    },

    methods: {},
    created: function created() {},
    mounted: function mounted() {}
};

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7a48d305\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/video.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.videoContainer[data-v-7a48d305] {\n\tposition: relative;\n\ttop: 50%;\n\ttransform: translateY(-50%);\n}\n\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e6105db6\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./test/lth/video/lth.video.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e6105db6\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./test/lth/video/lth.video.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.lth_testapp {\n}\n.lth_testapp,\r\n.container {\r\n    height:100%;\r\n    width:100%;\n}\r\n\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/loadjs/dist/loadjs.umd.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference common_library"))(11);

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-7a48d305\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/components/video.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "videoContainer",
    on: {
      "click": _vm.test
    }
  }, [_c('video', {
    staticClass: "video-js vjs-default-skin",
    attrs: {
      "id": _vm.id
    }
  })])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-7a48d305", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-e6105db6\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./test/lth/video/lth.video.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "lth_testapp"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('player', {
    attrs: {
      "videoType": _vm.videoType,
      "videoSrc": _vm.videoSrc,
      "dependencies": _vm.dependencies
    }
  })], 1)])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-e6105db6", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7a48d305\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/video.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7a48d305\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/video.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("5ef9b8df", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7a48d305\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../utils/lang-loader.js!./video.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7a48d305\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../utils/lang-loader.js!./video.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e6105db6\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./test/lth/video/lth.video.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e6105db6\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./test/lth/video/lth.video.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("f92aa282", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e6105db6\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../utils/lang-loader.js!./lth.video.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e6105db6\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../utils/lang-loader.js!./lth.video.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e6105db6\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./test/lth/video/lth.video.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e6105db6\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./test/lth/video/lth.video.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("85955ec4", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e6105db6\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!../../../utils/lang-loader.js!./lth.video.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e6105db6\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!../../../utils/lang-loader.js!./lth.video.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__("dll-reference common_library"))(31);

/***/ }),

/***/ "./src/apps/iptalk/urls.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var host = exports.host = "http://" + window.location.hostname + ":85/";
var getIptalkDeviceList = exports.getIptalkDeviceList = host + "devices/iptalk/getiptalkdevicelist";var getIptalkDeviceListByTreeNodeID = exports.getIptalkDeviceListByTreeNodeID = host + "devices/iptalk/getiptalkdevicelistbytreenodeid";var getIptalkTreeChildrenByID = exports.getIptalkTreeChildrenByID = host + "devices/iptalk/getiptalktreechildrenbyid";var addIptalkTreeNode = exports.addIptalkTreeNode = host + "devices/iptalk/addiptalktreenode";var editIptalkTreeNodeName = exports.editIptalkTreeNodeName = host + "devices/iptalk/editiptalktreenodename";var deleteIptalkTreeNode = exports.deleteIptalkTreeNode = host + "devices/iptalk/deleteiptalktreenode";var moveIptalkTreeNode = exports.moveIptalkTreeNode = host + "devices/iptalk/moveiptalktreenode";var getIptalkTreeNodeByID = exports.getIptalkTreeNodeByID = host + "devices/iptalk/getiptalktreenodebyid";var setIptalkTreeNodeByID = exports.setIptalkTreeNodeByID = host + "devices/iptalk/setiptalktreenodebyid";var getIptalkCallRecord = exports.getIptalkCallRecord = host + "devices/iptalk/getiptalkcallrecord";var getIptalkDeviceRecord = exports.getIptalkDeviceRecord = host + "devices/iptalk/getiptalkdevicerecord";var getIptalkAlarmRecord = exports.getIptalkAlarmRecord = host + "devices/iptalk/getiptalkalarmrecord";var getIptalkFeedBacks = exports.getIptalkFeedBacks = host + "devices/iptalk/getiptalkfeedbacks";var getIptalkCallRecordExcel = exports.getIptalkCallRecordExcel = host + "devices/iptalk/getiptalkcallrecordexcel";var warrantyVerify = exports.warrantyVerify = host + "devices/iptalk/warrantyverify";
var resetImpower = exports.resetImpower = host + "devices/iptalk/resetimpower";
var setLicenseKey = exports.setLicenseKey = host + "devices/iptalk/setlicensekey";
var getMikeByDevID = exports.getMikeByDevID = host + "devices/iptalk/getmikebydevid";var getTerminalByDevID = exports.getTerminalByDevID = host + "devices/iptalk/getterminalbydevid";var getDeviceIP = exports.getDeviceIP = host + "devices/iptalk/getdeviceip";var getOnCallingRecord = exports.getOnCallingRecord = host + "devices/iptalk/getoncallingrecord";var getSpeakerByDevID = exports.getSpeakerByDevID = host + "devices/iptalk/getspeakerbydevid";var getGK680ByDevID = exports.getGK680ByDevID = host + "devices/iptalk/getgk680bydevid";var setSpeakerVolumeByDevID = exports.setSpeakerVolumeByDevID = host + "devices/iptalk/setspeakervolumebydevid";var setGK680DefencseByDevID = exports.setGK680DefencseByDevID = host + "devices/iptalk/setgk680defencsebydevid";var setGK680UnDefencseByDevID = exports.setGK680UnDefencseByDevID = host + "devices/iptalk/setgk680undefencsebydevid";var setGK680Info = exports.setGK680Info = host + "devices/iptalk/setgk680info";var setGK680AlarmType = exports.setGK680AlarmType = host + "devices/iptalk/setgk680alarmtype";var setGK680AutoDefence = exports.setGK680AutoDefence = host + "devices/iptalk/setgk680autodefence";var getGK680Date = exports.getGK680Date = host + "devices/iptalk/getgk680date";var setGK680Date = exports.setGK680Date = host + "devices/iptalk/setgk680date";var getGK680Time = exports.getGK680Time = host + "devices/iptalk/getgk680time";var setGK680Time = exports.setGK680Time = host + "devices/iptalk/setgk680time";var getGK680AssistCtrl = exports.getGK680AssistCtrl = host + "devices/iptalk/getgk680assistctrl";var setGK680AssistCtrl = exports.setGK680AssistCtrl = host + "devices/iptalk/setgk680assistctrl";var getGK680AssistRelate = exports.getGK680AssistRelate = host + "devices/iptalk/getgk680assistrelate";var setGK680AssistRelate = exports.setGK680AssistRelate = host + "devices/iptalk/setgk680assistrelate";var setGK680AlarmInterval = exports.setGK680AlarmInterval = host + "devices/iptalk/setgk680alarminterval";var setGK680DriveAssistTime = exports.setGK680DriveAssistTime = host + "devices/iptalk/setgk680driveassisttime";var setgk680AreaAddr = exports.setgk680AreaAddr = host + "devices/iptalk/setgk680areaaddr";var syncKTSpeakerState = exports.syncKTSpeakerState = host + "devices/iptalk/syncktspeakerstate";var enableDeviceByDevID = exports.enableDeviceByDevID = host + "devices/iptalk/enabledevicebydevid";var disableDeviceByDevID = exports.disableDeviceByDevID = host + "devices/iptalk/disabledevicebydevid";var synchronizedDeviceByDevID = exports.synchronizedDeviceByDevID = host + "devices/iptalk/synchronizeddevicebydevid";var setDeviceInfo = exports.setDeviceInfo = host + "devices/iptalk/setdeviceinfo";var setTerminalPanel = exports.setTerminalPanel = host + "devices/iptalk/setterminalpanel";var setTerminalIO = exports.setTerminalIO = host + "devices/iptalk/setterminalio";var setTerminalVideo = exports.setTerminalVideo = host + "devices/iptalk/setterminalvideo";var setTerminalAlarm = exports.setTerminalAlarm = host + "devices/iptalk/setterminalalarm";var saveLEDInfo = exports.saveLEDInfo = host + "devices/iptalk/saveledinfo";var setLEDScrollMode = exports.setLEDScrollMode = host + "devices/iptalk/setledscrollmode";var setSyncTime = exports.setSyncTime = host + "devices/iptalk/setsynctime";var setLEDText = exports.setLEDText = host + "devices/iptalk/setledtext";var relateDeviceIPC = exports.relateDeviceIPC = host + "devices/iptalk/relatedeviceipc";var getIptalkUpdatePacks = exports.getIptalkUpdatePacks = host + "devices/iptalk/getiptalkupdatepacks";var addIptalkUpdatePack = exports.addIptalkUpdatePack = host + "devices/iptalk/addiptalkupdatepack";var deleteIptalkUpdatePack = exports.deleteIptalkUpdatePack = host + "devices/iptalk/deleteiptalkupdatepack";var deviceUpdate = exports.deviceUpdate = host + "devices/iptalk/deviceupdate";var deviceTest = exports.deviceTest = host + "devices/iptalk/alarmAudioBroadcast";var deviceControl = exports.deviceControl = host + "devices/iptalk/devicecontrol";var getIptalkDeviceMessage = exports.getIptalkDeviceMessage = host + "devices/iptalk/getiptalkdevicemessage";var multicastSearch = exports.multicastSearch = host + "devices/iptalk/iptalkmulticastsearch";var setDeviceInfoWithMulticast = exports.setDeviceInfoWithMulticast = host + "devices/iptalk/setdeviceinfowithmulticast";var getSelfInfo = exports.getSelfInfo = host + "devices/iptalk/getselfinfo";var editSelfInfo = exports.editSelfInfo = host + "devices/iptalk/editselfinfo";var getUserList = exports.getUserList = host + "devices/iptalk/getuserlist";var getIdentitys = exports.getIdentitys = host + "devices/iptalk/getidentitys";var addUser = exports.addUser = host + "devices/iptalk/adduser";var editUser = exports.editUser = host + "devices/iptalk/edituser";var deleteUserbyID = exports.deleteUserbyID = host + "devices/iptalk/deleteuserbyid";var getIdentityList = exports.getIdentityList = host + "devices/iptalk/getidentitylist";var getAuthoritysAndMaxWeight = exports.getAuthoritysAndMaxWeight = host + "devices/iptalk/getauthoritysandmaxweight";var addIdentity = exports.addIdentity = host + "devices/iptalk/addidentity";var editIdentity = exports.editIdentity = host + "devices/iptalk/editidentity";var deleteIdentitybyID = exports.deleteIdentitybyID = host + "devices/iptalk/deleteidentitybyid";var getIptalkAdPacks = exports.getIptalkAdPacks = host + "devices/iptalk/getiptalkadpacks";var addIptalkAdPack = exports.addIptalkAdPack = host + "devices/iptalk/addiptalkadpack";var deleteIptalkAdPack = exports.deleteIptalkAdPack = host + "devices/iptalk/deleteiptalkadpack";var getAdListByDevIds = exports.getAdListByDevIds = host + "devices/iptalk/getadlistbydevids";var addAdByDevIds = exports.addAdByDevIds = host + "devices/iptalk/addadbydevids";var deleteAdByDevIds = exports.deleteAdByDevIds = host + "devices/iptalk/deleteadbydevids";var clearAdByDevIds = exports.clearAdByDevIds = host + "devices/iptalk/clearadbydevids";var playAdByDevIds = exports.playAdByDevIds = host + "devices/iptalk/playadbydevids";var stopAdByDevIds = exports.stopAdByDevIds = host + "devices/iptalk/stopadbydevids";var sysConfig = exports.sysConfig = host + "config/sysconfig";var sysCorrectTime = exports.sysCorrectTime = host + "config/syscorrecttime";

var netConfig = exports.netConfig = host + "config/netconfig";var resetNetConfig = exports.resetNetConfig = host + "config/resetnetconfig";var sysUpgrade = exports.sysUpgrade = host + "upgrade/sysUpgrade";var getCurrentVersion = exports.getCurrentVersion = host + "upgrade/getCurrentVersion";var sysRestart = exports.sysRestart = host + "upgrade/sysRestart";var recstoreage = exports.recstoreage = host + "recstoreage";var playback = exports.playback = host + "playback";var getDevicesForMap = exports.getDevicesForMap = host + "devices/iptalk/getdevicesformap";var addDevicesByMap = exports.addDevicesByMap = host + "devices/iptalk/adddevicesbymap";var delDevicesByMap = exports.delDevicesByMap = host + "devices/iptalk/deldevicesbymap";var modDevicesByMap = exports.modDevicesByMap = host + "devices/iptalk/moddevicesbymap";var movDevicesByMap = exports.movDevicesByMap = host + "devices/iptalk/movdevicesbymap";var liveControl = exports.liveControl = host + "live";

/***/ }),

/***/ "./src/common/eventbus.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vue = __webpack_require__("./node_modules/vue/dist/vue.min.js");

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var eventbus = new _vue2.default();

exports.default = eventbus;

/***/ }),

/***/ "./src/components/video.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7a48d305\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/components/video.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/components/video.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-7a48d305\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/components/video.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-7a48d305",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\components\\video.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] video.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7a48d305", Component.options)
  } else {
    hotAPI.reload("data-v-7a48d305", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ "./test/lth/video/lth.video.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e6105db6\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./test/lth/video/lth.video.vue")
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e6105db6\",\"scoped\":false,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=1!./utils/lang-loader.js!./test/lth/video/lth.video.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./test/lth/video/lth.video.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-e6105db6\",\"hasScoped\":false}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./test/lth/video/lth.video.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\test\\lth\\video\\lth.video.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] lth.video.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-e6105db6", Component.options)
  } else {
    hotAPI.reload("data-v-e6105db6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ })

});