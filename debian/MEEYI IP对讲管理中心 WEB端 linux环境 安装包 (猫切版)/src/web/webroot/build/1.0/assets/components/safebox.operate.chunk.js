webpackJsonp([39],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/devices/operates/safebox.operate.vue":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

var _devicescommon = __webpack_require__("./src/apps/voerka/modules/devices/components/main/common.js");

var _vuex = __webpack_require__("./node_modules/vuex/dist/vuex.esm.js");

var _voerkaurls = __webpack_require__("./src/apps/voerka/urls.js");

var urls = _interopRequireWildcard(_voerkaurls);

__webpack_require__("./src/assets/js/semantic/components/list.min.css");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      sn: '',
      username: '',
      safebox: {
        signal: '',
        door: '',
        power: '',
        temperature: '',
        humidity: '',
        battery: '',
        url: '',
        alarm: '',
        defence: '',
        coord: ''
      },
      items: [{ text: L("跟踪该保险箱位置"), desc: "", changestatus: true, icon: "marker", name: 'coord' }, { text: L("撤防/布防"), desc: "", changestatus: true, icon: "protect", name: "defence" }, { text: L("开启/关闭警铃"), desc: "", changestatus: false, icon: "alarm", name: "alarm" }, { text: L("箱门"), desc: "", changestatus: false, icon: "trello", name: "door" }, { text: L("GSM信号"), desc: "", changestatus: false, icon: "signal", name: "signal" }, { text: L("电池电量"), desc: "", changestatus: false, icon: "battery medium", name: "battery" }, { text: L("温度"), desc: "", changestatus: false, icon: "line chart", name: "temperature" }, { text: L("湿度"), desc: "", changestatus: false, icon: "theme", name: "humidity" }, { text: L("电源"), desc: "", changestatus: false, icon: "plug", name: "power" }]
    };
  },

  computed: _extends({}, (0, _vuex.mapState)({
    curUserInfo: function curUserInfo(state) {
      return state.curUserInfo;
    }
  })),
  props: {
    targetDeviceID: { type: String, default: '' },
    currentname: { type: String, default: '' }
  },
  methods: {
    loadSafeboxData: function loadSafeboxData() {
      _webservice2.default.getJSON(urls.getstatus, { sn: this.sn, agentAdmin: "true" }, function (response) {
        if (response.status == "success") {} else {
          (0, _devicescommon.failureCheck)(response.message);
        }
      }).fail(function (e) {
        toast(L("数据获取失败"));
      });
    },

    onOpen: function onOpen(item) {
      if (item.name == "defence") {
        if (this.safebox.defence == 'off') {
          var defences = 'on';
          _webservice2.default.getJSON(urls.setdefence, { defence: defences, sn: this.sn, agentAdmin: "true" }).then(function (response) {
            if (response.status == "success") {} else {
              (0, _devicescommon.failureCheck)(response.message);
            }
          }).fail(function () {
            alert(L("命令发送失败"));
          });
        } else {
          var defences = 'off';
          _webservice2.default.getJSON(urls.setdefence, { defence: defences, sn: this.sn, agentAdmin: "true" }).then(function (response) {
            if (response.status == "success") {} else {
              (0, _devicescommon.failureCheck)(response.message);
            }
          }).fail(function () {
            alert(L("命令发送失败"));
          });
        }
      } else if (item.name == "alarm") {
        if (this.safebox.alarm == 'off') {
          var alarms = 'on';
          _webservice2.default.getJSON(urls.setalarm, { alarm: alarms, sn: this.sn, agentAdmin: "true" }).then(function (response) {
            if (response.status == "success") {} else {
              (0, _devicescommon.failureCheck)(response.message);
            }
          }).fail(function () {
            alert(L("命令发送失败"));
          });
        } else {
          var alarms = 'off';
          _webservice2.default.getJSON(urls.setalarm, { alarm: alarms, sn: this.sn, agentAdmin: "true" }).then(function (response) {
            if (response.status == "success") {} else {
              (0, _devicescommon.failureCheck)(response.message);
            }
          }).fail(function () {
            alert(L("命令发送失败"));
          });
        }
      } else if (item.name == "coord") {
        _webservice2.default.getJSON(urls.getcoord, { sn: this.sn, agentAdmin: "true" }).then(function (response) {
          if (response.status == "success") {} else {
            (0, _devicescommon.failureCheck)(response.message);
          }
        }).fail(function () {
          toast(L("数据获取失败"));
        });
      }
    },
    onSafeBoxStatus: function onSafeBoxStatus(value) {
      var data = value.message;
      if (data.coord) {
        this.safebox.coord = data.coord;
        this.items[0].desc = value.translation;
      }
      if (data.defence) {
        this.safebox.defence = data.defence;
        if (data.defence == "on") {
          this.items[1].desc = '布防';
        } else {
          this.items[1].desc = '撤防';
        }
      }
      if (data.alarm) {
        this.safebox.alarm = data.alarm;
        if (data.alarm == "on") {
          this.items[2].desc = '警铃响';
        } else {
          this.items[2].desc = '警铃关闭';
        }
      }
      if (data.door) {
        this.safebox.door = data.door;
        if (data.door == "on") {
          this.items[3].desc = '箱门：开';
        } else {
          this.items[3].desc = '箱门：关';
        }
      }
      if (data.signal) {
        this.safebox.signal = data.signal;
        this.items[4].desc = data.signal;
      }
      if (data.battery) {
        this.safebox.battery = data.battery;
        this.items[5].desc = data.battery;
      }
      if (data.temperature) {
        this.safebox.temperature = data.temperature;
        this.items[6].desc = data.temperature;
      }
      if (data.humidity) {
        this.safebox.humidity = data.humidity;
        this.items[7].desc = data.humidity;
      }
      if (data.power) {
        this.safebox.power = data.power;
        if (data.power == "on") {
          this.items[8].desc = '电源：开';
        } else {
          this.items[8].desc = '电源：关';
        }
      }
    },
    startSubscribe: function startSubscribe() {
      var self = this;
      var alarmStreaming = StreamingManager.getStreaming("alarm_streaming");
      alarmStreaming.subscribe(function (value, channel) {
        if (value.sn == self.sn) {
          self.onSafeBoxStatus(value);
        }
      });
      var responseStreaming = StreamingManager.getStreaming("response_streaming");
      responseStreaming.subscribe(function (value, channel) {
        if (value.sn == self.sn) {
          self.onSafeBoxStatus(value);
        }
      });
    },
    cancelSubscribe: function cancelSubscribe() {}
  },
  created: function created() {},
  mounted: function mounted() {
    this.startSubscribe();
    this.sn = this.targetDeviceID || this.sn;
    this.username = this.currentname || this.username;
    if (this.sn) {
      this.loadSafeboxData();
    }
  }
};

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4bc157c9\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/devices/operates/safebox.operate.vue":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "\n.propertys[data-v-4bc157c9]{\r\n  padding-bottom:10px;\n}\n.propertys h3[data-v-4bc157c9]{\r\n  padding: 10px 10px;\r\n  border-bottom: 1px solid;\r\n  text-align: left;\r\n  margin: 0px;\r\n  background: #D6D6D6\n}\n.control[data-v-4bc157c9]{\r\n  padding-left: 10px;\n}\n.safeboxheader[data-v-4bc157c9]{\r\n  font-weight:bold;\n}\r\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./src/assets/js/semantic/components/list.min.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "/*!\r\n * # Semantic UI 2.2.10 - List\r\n * http://github.com/semantic-org/semantic-ui/\r\n *\r\n *\r\n * Released under the MIT license\r\n * http://opensource.org/licenses/MIT\r\n *\r\n */.ui.list,ol.ui.list,ul.ui.list{list-style-type:none;margin:1em 0;padding:0}.ui.list:first-child,ol.ui.list:first-child,ul.ui.list:first-child{margin-top:0;padding-top:0}.ui.list:last-child,ol.ui.list:last-child,ul.ui.list:last-child{margin-bottom:0;padding-bottom:0}.ui.list .list>.item,.ui.list>.item,ol.ui.list li,ul.ui.list li{display:list-item;table-layout:fixed;list-style-type:none;list-style-position:outside;padding:.21428571em 0;line-height:1.14285714em}.ui.list>.item:after,.ui.list>.list>.item,ol.ui.list>li:first-child:after,ul.ui.list>li:first-child:after{content:'';display:block;height:0;clear:both;visibility:hidden}.ui.list .list>.item:first-child,.ui.list>.item:first-child,ol.ui.list li:first-child,ul.ui.list li:first-child{padding-top:0}.ui.list .list>.item:last-child,.ui.list>.item:last-child,ol.ui.list li:last-child,ul.ui.list li:last-child{padding-bottom:0}.ui.list .list,ol.ui.list ol,ul.ui.list ul{clear:both;margin:0;padding:.75em 0 .25em .5em}.ui.list .list>.item,ol.ui.list ol li,ul.ui.list ul li{padding:.14285714em 0;line-height:inherit}.ui.list .list>.item>i.icon,.ui.list>.item>i.icon{display:table-cell;margin:0;padding-top:.07142857em;padding-right:.28571429em;vertical-align:top;-webkit-transition:color .1s ease;transition:color .1s ease}.ui.list .list>.item>i.icon:only-child,.ui.list>.item>i.icon:only-child{display:inline-block;vertical-align:top}.ui.list .list>.item>.image,.ui.list>.item>.image{display:table-cell;background-color:transparent;margin:0;vertical-align:top}.ui.list .list>.item>.image:not(:only-child):not(img),.ui.list>.item>.image:not(:only-child):not(img){padding-right:.5em}.ui.list .list>.item>.image img,.ui.list>.item>.image img{vertical-align:top}.ui.list .list>.item>.image:only-child,.ui.list .list>.item>img.image,.ui.list>.item>.image:only-child,.ui.list>.item>img.image{display:inline-block}.ui.list .list>.item>.content,.ui.list>.item>.content{line-height:1.14285714em}.ui.list .list>.item>.icon+.content,.ui.list .list>.item>.image+.content,.ui.list>.item>.icon+.content,.ui.list>.item>.image+.content{display:table-cell;padding:0 0 0 .5em;vertical-align:top}.ui.list .list>.item>img.image+.content,.ui.list>.item>img.image+.content{display:inline-block}.ui.list .list>.item>.content>.list,.ui.list>.item>.content>.list{margin-left:0;padding-left:0}.ui.list .list>.item .header,.ui.list>.item .header{display:block;margin:0;font-family:Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;font-weight:700;color:rgba(0,0,0,.87)}.ui.list .list>.item .description,.ui.list>.item .description{display:block;color:rgba(0,0,0,.7)}.ui.list .list>.item a,.ui.list>.item a{cursor:pointer}.ui.list .list>a.item,.ui.list>a.item{cursor:pointer;color:#4183C4}.ui.list .list>a.item:hover,.ui.list>a.item:hover{color:#1e70bf}.ui.list .list>a.item i.icon,.ui.list>a.item i.icon{color:rgba(0,0,0,.4)}.ui.list .list>.item a.header,.ui.list>.item a.header{cursor:pointer;color:#4183C4!important}.ui.list .list>.item a.header:hover,.ui.list>.item a.header:hover{color:#1e70bf!important}.ui[class*=\"left floated\"].list{float:left}.ui[class*=\"right floated\"].list{float:right}.ui.list .list>.item [class*=\"left floated\"],.ui.list>.item [class*=\"left floated\"]{float:left;margin:0 1em 0 0}.ui.list .list>.item [class*=\"right floated\"],.ui.list>.item [class*=\"right floated\"]{float:right;margin:0 0 0 1em}.ui.menu .ui.list .list>.item,.ui.menu .ui.list>.item{display:list-item;table-layout:fixed;background-color:transparent;list-style-type:none;list-style-position:outside;padding:.21428571em 0;line-height:1.14285714em}.ui.menu .ui.list .list>.item:before,.ui.menu .ui.list>.item:before{border:none;background:0 0}.ui.menu .ui.list .list>.item:first-child,.ui.menu .ui.list>.item:first-child{padding-top:0}.ui.menu .ui.list .list>.item:last-child,.ui.menu .ui.list>.item:last-child{padding-bottom:0}.ui.horizontal.list{display:inline-block;font-size:0}.ui.horizontal.list>.item{display:inline-block;margin-left:1em;font-size:1rem}.ui.horizontal.list:not(.celled)>.item:first-child{margin-left:0!important;padding-left:0!important}.ui.horizontal.list .list{padding-left:0;padding-bottom:0}.ui.horizontal.list .list>.item>.content,.ui.horizontal.list .list>.item>.icon,.ui.horizontal.list .list>.item>.image,.ui.horizontal.list>.item>.content,.ui.horizontal.list>.item>.icon,.ui.horizontal.list>.item>.image{vertical-align:middle}.ui.horizontal.list>.item:first-child,.ui.horizontal.list>.item:last-child{padding-top:.21428571em;padding-bottom:.21428571em}.ui.horizontal.list>.item>i.icon{margin:0;padding:0 .25em 0 0}.ui.horizontal.list>.item>.icon,.ui.horizontal.list>.item>.icon+.content{float:none;display:inline-block}.ui.list .list>.disabled.item,.ui.list>.disabled.item{pointer-events:none;color:rgba(40,40,40,.3)!important}.ui.inverted.list .list>.disabled.item,.ui.inverted.list>.disabled.item{color:rgba(225,225,225,.3)!important}.ui.list .list>a.item:hover .icon,.ui.list>a.item:hover .icon{color:rgba(0,0,0,.87)}.ui.inverted.list .list>a.item>.icon,.ui.inverted.list>a.item>.icon{color:rgba(255,255,255,.7)}.ui.inverted.list .list>.item .header,.ui.inverted.list>.item .header{color:rgba(255,255,255,.9)}.ui.inverted.list .list>.item .description,.ui.inverted.list>.item .description{color:rgba(255,255,255,.7)}.ui.inverted.list .list>a.item,.ui.inverted.list>a.item{cursor:pointer;color:rgba(255,255,255,.9)}.ui.inverted.list .list>a.item:hover,.ui.inverted.list>a.item:hover{color:#1e70bf}.ui.inverted.list .item a:not(.ui){color:rgba(255,255,255,.9)!important}.ui.inverted.list .item a:not(.ui):hover{color:#1e70bf!important}.ui.list [class*=\"top aligned\"],.ui.list[class*=\"top aligned\"] .content,.ui.list[class*=\"top aligned\"] .image{vertical-align:top!important}.ui.list [class*=\"middle aligned\"],.ui.list[class*=\"middle aligned\"] .content,.ui.list[class*=\"middle aligned\"] .image{vertical-align:middle!important}.ui.list [class*=\"bottom aligned\"],.ui.list[class*=\"bottom aligned\"] .content,.ui.list[class*=\"bottom aligned\"] .image{vertical-align:bottom!important}.ui.link.list .item,.ui.link.list .item a:not(.ui),.ui.link.list a.item{color:rgba(0,0,0,.4);-webkit-transition:.1s color ease;transition:.1s color ease}.ui.link.list .item a:not(.ui):hover,.ui.link.list a.item:hover{color:rgba(0,0,0,.8)}.ui.link.list .item a:not(.ui):active,.ui.link.list a.item:active{color:rgba(0,0,0,.9)}.ui.link.list .active.item,.ui.link.list .active.item a:not(.ui){color:rgba(0,0,0,.95)}.ui.inverted.link.list .item,.ui.inverted.link.list .item a:not(.ui),.ui.inverted.link.list a.item{color:rgba(255,255,255,.5)}.ui.inverted.link.list .active.item a:not(.ui),.ui.inverted.link.list .item a:not(.ui):active,.ui.inverted.link.list .item a:not(.ui):hover,.ui.inverted.link.list a.active.item,.ui.inverted.link.list a.item:active,.ui.inverted.link.list a.item:hover{color:#fff}.ui.selection.list .list>.item,.ui.selection.list>.item{cursor:pointer;background:0 0;padding:.5em;margin:0;color:rgba(0,0,0,.4);border-radius:.5em;-webkit-transition:.1s color ease,.1s padding-left ease,.1s background-color ease;transition:.1s color ease,.1s padding-left ease,.1s background-color ease}.ui.selection.list .list>.item:last-child,.ui.selection.list>.item:last-child{margin-bottom:0}.ui.selection.list.list>.item:hover,.ui.selection.list>.item:hover{background:rgba(0,0,0,.03);color:rgba(0,0,0,.8)}.ui.selection.list .list>.item:active,.ui.selection.list>.item:active{background:rgba(0,0,0,.05);color:rgba(0,0,0,.9)}.ui.selection.list .list>.item.active,.ui.selection.list>.item.active{background:rgba(0,0,0,.05);color:rgba(0,0,0,.95)}.ui.inverted.selection.list>.item{background:0 0;color:rgba(255,255,255,.5)}.ui.inverted.selection.list>.item:hover{background:rgba(255,255,255,.02);color:#fff}.ui.inverted.selection.list>.item.active,.ui.inverted.selection.list>.item:active{background:rgba(255,255,255,.08);color:#fff}.ui.celled.selection.list .list>.item,.ui.celled.selection.list>.item,.ui.divided.selection.list .list>.item,.ui.divided.selection.list>.item{border-radius:0}.ui.animated.list>.item{-webkit-transition:.25s color ease .1s,.25s padding-left ease .1s,.25s background-color ease .1s;transition:.25s color ease .1s,.25s padding-left ease .1s,.25s background-color ease .1s}.ui.animated.list:not(.horizontal)>.item:hover{padding-left:1em}.ui.fitted.list:not(.selection) .list>.item,.ui.fitted.list:not(.selection)>.item{padding-left:0;padding-right:0}.ui.fitted.selection.list .list>.item,.ui.fitted.selection.list>.item{margin-left:-.5em;margin-right:-.5em}.ui.bulleted.list,ul.ui.list{margin-left:1.25rem}.ui.bulleted.list .list>.item,.ui.bulleted.list>.item,ul.ui.list li{position:relative}.ui.bulleted.list .list>.item:before,.ui.bulleted.list>.item:before,ul.ui.list li:before{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;position:absolute;top:auto;left:auto;font-weight:400;margin-left:-1.25rem;content:'\\2022';opacity:1;color:inherit;vertical-align:top}.ui.bulleted.list .list>a.item:before,.ui.bulleted.list>a.item:before,ul.ui.list li:before{color:rgba(0,0,0,.87)}.ui.bulleted.list .list,ul.ui.list ul{padding-left:1.25rem}.ui.horizontal.bulleted.list,ul.ui.horizontal.bulleted.list{margin-left:0}.ui.horizontal.bulleted.list>.item,ul.ui.horizontal.bulleted.list li{margin-left:1.75rem}.ui.horizontal.bulleted.list>.item:first-child,ul.ui.horizontal.bulleted.list li:first-child{margin-left:0}.ui.horizontal.bulleted.list>.item::before,ul.ui.horizontal.bulleted.list li::before{color:rgba(0,0,0,.87)}.ui.horizontal.bulleted.list>.item:first-child::before,ul.ui.horizontal.bulleted.list li:first-child::before{display:none}.ui.ordered.list,.ui.ordered.list .list,ol.ui.list,ol.ui.list ol{counter-reset:ordered;margin-left:1.25rem;list-style-type:none}.ui.ordered.list .list>.item,.ui.ordered.list>.item,ol.ui.list li{list-style-type:none;position:relative}.ui.ordered.list .list>.item:before,.ui.ordered.list>.item:before,ol.ui.list li:before{position:absolute;top:auto;left:auto;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;margin-left:-1.25rem;counter-increment:ordered;content:counters(ordered,\".\") \" \";text-align:right;color:rgba(0,0,0,.87);vertical-align:middle;opacity:.8}.ui.ordered.inverted.list .list>.item:before,.ui.ordered.inverted.list>.item:before,ol.ui.inverted.list li:before{color:rgba(255,255,255,.7)}.ui.ordered.list>.item[data-value],.ui.ordered.list>.list>.item[data-value]{content:attr(data-value)}ol.ui.list li[value]:before{content:attr(value)}.ui.ordered.list .list,ol.ui.list ol{margin-left:1em}.ui.ordered.list .list>.item:before,ol.ui.list ol li:before{margin-left:-2em}.ui.ordered.horizontal.list,ol.ui.horizontal.list{margin-left:0}.ui.ordered.horizontal.list .list>.item:before,.ui.ordered.horizontal.list>.item:before,ol.ui.horizontal.list li:before{position:static;margin:0 .5em 0 0}.ui.divided.list>.item{border-top:1px solid rgba(34,36,38,.15)}.ui.divided.list .item .list>.item,.ui.divided.list .list>.item,.ui.divided.list .list>.item:first-child,.ui.divided.list>.item:first-child{border-top:none}.ui.divided.list:not(.horizontal) .list>.item:first-child{border-top-width:1px}.ui.divided.bulleted.list .list,.ui.divided.bulleted.list:not(.horizontal){margin-left:0;padding-left:0}.ui.divided.bulleted.list>.item:not(.horizontal){padding-left:1.25rem}.ui.divided.ordered.list{margin-left:0}.ui.divided.ordered.list .list>.item,.ui.divided.ordered.list>.item{padding-left:1.25rem}.ui.divided.ordered.list .item .list{margin-left:0;margin-right:0;padding-bottom:.21428571em}.ui.divided.ordered.list .item .list>.item{padding-left:1em}.ui.divided.selection.list .list>.item,.ui.divided.selection.list>.item{margin:0;border-radius:0}.ui.divided.horizontal.list{margin-left:0}.ui.divided.horizontal.list>.item:not(:first-child){padding-left:.5em}.ui.divided.horizontal.list>.item:not(:last-child){padding-right:.5em}.ui.divided.horizontal.list>.item{border-top:none;border-left:1px solid rgba(34,36,38,.15);margin:0;line-height:.6}.ui.horizontal.divided.list>.item:first-child{border-left:none}.ui.divided.inverted.horizontal.list>.item,.ui.divided.inverted.list>.item,.ui.divided.inverted.list>.list{border-color:rgba(255,255,255,.1)}.ui.celled.list>.item,.ui.celled.list>.list{border-top:1px solid rgba(34,36,38,.15);padding-left:.5em;padding-right:.5em}.ui.celled.list>.item:last-child{border-bottom:1px solid rgba(34,36,38,.15)}.ui.celled.list>.item:first-child,.ui.celled.list>.item:last-child{padding-top:.21428571em;padding-bottom:.21428571em}.ui.celled.list .item .list>.item{border-width:0}.ui.celled.list .list>.item:first-child{border-top-width:0}.ui.celled.bulleted.list{margin-left:0}.ui.celled.bulleted.list .list>.item,.ui.celled.bulleted.list>.item{padding-left:1.25rem}.ui.celled.bulleted.list .item .list{margin-left:-1.25rem;margin-right:-1.25rem;padding-bottom:.21428571em}.ui.celled.ordered.list{margin-left:0}.ui.celled.ordered.list .list>.item,.ui.celled.ordered.list>.item{padding-left:1.25rem}.ui.celled.ordered.list .item .list{margin-left:0;margin-right:0;padding-bottom:.21428571em}.ui.celled.ordered.list .list>.item{padding-left:1em}.ui.horizontal.celled.list{margin-left:0}.ui.horizontal.celled.list .list>.item,.ui.horizontal.celled.list>.item{border-top:none;border-left:1px solid rgba(34,36,38,.15);margin:0;padding-left:.5em;padding-right:.5em;line-height:.6}.ui.horizontal.celled.list .list>.item:last-child,.ui.horizontal.celled.list>.item:last-child{border-bottom:none;border-right:1px solid rgba(34,36,38,.15)}.ui.celled.inverted.horizontal.list .list>.item,.ui.celled.inverted.horizontal.list>.item,.ui.celled.inverted.list>.item,.ui.celled.inverted.list>.list{border-color:1px solid rgba(255,255,255,.1)}.ui.relaxed.list:not(.horizontal)>.item:not(:first-child){padding-top:.42857143em}.ui.relaxed.list:not(.horizontal)>.item:not(:last-child){padding-bottom:.42857143em}.ui.horizontal.relaxed.list .list>.item:not(:first-child),.ui.horizontal.relaxed.list>.item:not(:first-child){padding-left:1rem}.ui.horizontal.relaxed.list .list>.item:not(:last-child),.ui.horizontal.relaxed.list>.item:not(:last-child){padding-right:1rem}.ui[class*=\"very relaxed\"].list:not(.horizontal)>.item:not(:first-child){padding-top:.85714286em}.ui[class*=\"very relaxed\"].list:not(.horizontal)>.item:not(:last-child){padding-bottom:.85714286em}.ui.horizontal[class*=\"very relaxed\"].list .list>.item:not(:first-child),.ui.horizontal[class*=\"very relaxed\"].list>.item:not(:first-child){padding-left:1.5rem}.ui.horizontal[class*=\"very relaxed\"].list .list>.item:not(:last-child),.ui.horizontal[class*=\"very relaxed\"].list>.item:not(:last-child){padding-right:1.5rem}.ui.mini.list{font-size:.78571429em}.ui.tiny.list{font-size:.85714286em}.ui.small.list{font-size:.92857143em}.ui.list{font-size:1em}.ui.large.list{font-size:1.14285714em}.ui.big.list{font-size:1.28571429em}.ui.huge.list{font-size:1.42857143em}.ui.massive.list{font-size:1.71428571em}.ui.mini.horizontal.list .list>.item,.ui.mini.horizontal.list>.item{font-size:.78571429rem}.ui.tiny.horizontal.list .list>.item,.ui.tiny.horizontal.list>.item{font-size:.85714286rem}.ui.small.horizontal.list .list>.item,.ui.small.horizontal.list>.item{font-size:.92857143rem}.ui.horizontal.list .list>.item,.ui.horizontal.list>.item{font-size:1rem}.ui.large.horizontal.list .list>.item,.ui.large.horizontal.list>.item{font-size:1.14285714rem}.ui.big.horizontal.list .list>.item,.ui.big.horizontal.list>.item{font-size:1.28571429rem}.ui.huge.horizontal.list .list>.item,.ui.huge.horizontal.list>.item{font-size:1.42857143rem}.ui.massive.horizontal.list .list>.item,.ui.massive.horizontal.list>.item{font-size:1.71428571rem}", ""]);

// exports


/***/ }),

/***/ "./node_modules/process/browser.js":
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-4bc157c9\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/devices/operates/safebox.operate.vue":
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "propertys"
  }, [_vm._m(0), _vm._v(" "), _vm._l((_vm.items), function(item) {
    return _c('div', {
      staticClass: "control ui animated list"
    }, [_c('div', {
      staticClass: "item"
    }, [_c('i', {
      staticClass: "large middle aligned icon",
      class: item.icon
    }), _vm._v(" "), _c('div', {
      staticClass: "content"
    }, [_c('a', {
      staticClass: "safeboxheader",
      on: {
        "click": function($event) {
          _vm.onOpen(item)
        }
      }
    }, [_vm._v(_vm._s(item.text))]), _vm._v(" "), _c('div', {
      staticClass: "description"
    }, [_vm._v(_vm._s(item.desc))])])])])
  })], 2)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    attrs: {
      "align": "center"
    }
  }, [_c('img', {
    attrs: {
      "src": __webpack_require__("./src/assets/images/safebox.jpg"),
      "height": "128",
      "width": "128"
    }
  })])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-4bc157c9", module.exports)
  }
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4bc157c9\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/devices/operates/safebox.operate.vue":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4bc157c9\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/devices/operates/safebox.operate.vue");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("./node_modules/vue-style-loader/lib/addStylesClient.js")("e53eb620", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4bc157c9\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../utils/lang-loader.js!./safebox.operate.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4bc157c9\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../utils/lang-loader.js!./safebox.operate.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vuex/dist/vuex.esm.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(process) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Store", function() { return Store; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapState", function() { return mapState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapMutations", function() { return mapMutations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapGetters", function() { return mapGetters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapActions", function() { return mapActions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createNamespacedHelpers", function() { return createNamespacedHelpers; });
/**
 * vuex v2.4.0
 * (c) 2017 Evan You
 * @license MIT
 */
var applyMixin = function (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
};

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  this._children = Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors$1 = { namespaced: {} };

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  if (process.env.NODE_ENV !== 'production') {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (path, targetModule, newModule) {
  if (process.env.NODE_ENV !== 'production') {
    assertRawModule(path, newModule);
  }

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
            'manual reload is needed'
          );
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

function assertRawModule (path, rawModule) {
  ['getters', 'actions', 'mutations'].forEach(function (key) {
    if (!rawModule[key]) { return }

    forEachValue(rawModule[key], function (value, type) {
      assert(
        typeof value === 'function',
        makeAssertionMessage(path, key, type, value)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value) {
  var buf = key + " should be function but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";

  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  if (process.env.NODE_ENV !== 'production') {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store, "Store must be called with the new operator.");
  }

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  var state = options.state; if ( state === void 0 ) state = {};
  if (typeof state === 'function') {
    state = state();
  }

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1); });

  if (Vue.config.devtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors = { state: {} };

prototypeAccessors.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors.state.set = function (v) {
  if (process.env.NODE_ENV !== 'production') {
    assert(false, "Use store.replaceState() to explicit replace store state.");
  }
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
    process.env.NODE_ENV !== 'production' &&
    options && options.silent
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var entry = this._actions[type];
  if (!entry) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(("[vuex] unknown action type: " + type));
    }
    return
  }
  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  var subs = this._subscribers;
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof getter === 'function', "store.watch only accepts a function.");
  }
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule) {
  if (typeof path === 'string') { path = [path]; }

  if (process.env.NODE_ENV !== 'production') {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path));
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if (process.env.NODE_ENV !== 'production') {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); };
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var namespacedType = namespace + key;
    registerAction(store, namespacedType, action, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if (process.env.NODE_ENV !== 'production' && !store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if (process.env.NODE_ENV !== 'production' && !store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(("[vuex] duplicate getter key: " + type));
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if (process.env.NODE_ENV !== 'production') {
      assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

// auto install in dist mode
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      if (namespace && !getModuleByNamespace(this.$store, 'mapMutations', namespace)) {
        return
      }
      return this.$store.commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if (process.env.NODE_ENV !== 'production' && !(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      if (namespace && !getModuleByNamespace(this.$store, 'mapActions', namespace)) {
        return
      }
      return this.$store.dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var createNamespacedHelpers = function (namespace) { return ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
}); };

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if (process.env.NODE_ENV !== 'production' && !module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '2.4.0',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions,
  createNamespacedHelpers: createNamespacedHelpers
};

/* harmony default export */ __webpack_exports__["default"] = (index_esm);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/apps/voerka/modules/devices/components/main/common.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.failureCheck = exports.onSearchData = exports.onRefreshData = exports.onDeleteDevice = undefined;

var _eventbus = __webpack_require__("./src/common/eventbus.js");

var _eventbus2 = _interopRequireDefault(_eventbus);

var _webservice = __webpack_require__("./src/common/webservice.js");

var _webservice2 = _interopRequireDefault(_webservice);

var _voerkaurls = __webpack_require__("./src/apps/voerka/urls.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var onDeleteDevice = exports.onDeleteDevice = function onDeleteDevice() {
  var selectedDevices = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var devicesData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var selectedRowsSN = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var searchResult = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var label = arguments[4];

  if (selectedDevices.length == 0) {
    alert(L("请选择要删除设备"));
  } else {
    confirm(L("确定要删除所选设备？")).then(function (obj) {
      if (obj.button.classs == "positive") {
        _webservice2.default.getJSON(label == "fromAll" ? _voerkaurls.removedevice : _voerkaurls.removefavorite, { sn: JSON.stringify(selectedRowsSN) }).then(function (response) {
          if (response.status == "success") {
            selectedDevices.forEach(function (item) {
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = devicesData[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var temp = _step.value;

                  var flag = false;
                  var rows = temp.result.records;
                  var _iteratorNormalCompletion2 = true;
                  var _didIteratorError2 = false;
                  var _iteratorError2 = undefined;

                  try {
                    for (var _iterator2 = rows[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                      var opt = _step2.value;

                      if (opt.id == item) {
                        var index = rows.indexOf(opt);
                        rows.splice(index, 1);
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

            if (searchResult.length > 0) {
              selectedDevices.forEach(function (item) {
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                  for (var _iterator3 = searchResult[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var option = _step3.value;

                    if (option.id == item) {
                      var index = searchResult.indexOf(option);
                      searchResult.splice(index, 1);
                      break;
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
              });
            }
            alert(response.message);
          } else {
            failureCheck(response.message);
          }
        }).fail(function (e) {
          alert(e.responseText + "; status:" + e.status);
        });
      }
    });
  }
};

var onRefreshData = exports.onRefreshData = function onRefreshData(url) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var callback = arguments[2];

  $.getJSON(url, props).then(function (response) {
    callback(response);
    alert(L("刷新成功！"));
  }).fail(function (e) {
    alert(L("没有获取到数据"));
  });
};

var onSearchData = exports.onSearchData = function onSearchData() {
  var datalist = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var searchItem = arguments[1];
  var label = arguments[2];

  var result = [];
  var item = searchItem.text.replace(/(^\s*)|(\s*$)/g, "");
  datalist.forEach(function (option1) {
    if (option1.hasOwnProperty("result")) {
      option1.result.records.forEach(function (option2) {
        if (option2.id == item || option2.sn == item || option2.devicename == item || option2.status == item || option2.type == item || option2.typename == item || option2.owner == item || option2.install_location == item || option2.coord == item || option2.sensitivity == item) {
          result.push(option2);
        }
      });
    } else {
      if (option2.id == item || option2.sn == item || option2.devicename == item || option2.status == item || option2.type == item || option2.typename == item || option2.owner == item || option2.install_location == item || option2.coord == item || option2.sensitivity == item) {
        result.push(option1);
      }
    }
  });

  if (result.length == 0) {
    alert(L("没有搜索到结果"));
  } else {
    _eventbus2.default.$emit("searchresult", result, label);
    alert(L("完成搜索，请看搜索结果"));
  }
};

var failureCheck = exports.failureCheck = function failureCheck(msg) {
  if (msg == "请先登录，才能进行操作！") {
    alert(msg).then(function () {
      window.location.href = "/build/dev/auth.html";
    });
  } else if (msg == "没有绑定保险箱或者设备未上线") {
    toast(msg, 1000);
  } else {
    alert(msg);
  }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/jquery/dist/jquery.min.js")))

/***/ }),

/***/ "./src/apps/voerka/urls.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _urls = __webpack_require__("./src/urls.js");

Object.keys(_urls).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _urls[key];
    }
  });
});

String.prototype.params = function (args, params) {
  var srcstr = this;
  var pattern = new UrlPattern(srcstr);
  return pattern.stringify(params);
};

var baseUrl = "/mock";

var alarmlist = exports.alarmlist = baseUrl + '/voerka/getalarmmessage/';var msgerrreport = exports.msgerrreport = baseUrl + '/voerka/msgerrreport/';var getterminaluser = exports.getterminaluser = baseUrl + '/voerka/getterminaluser/';var msghandle = exports.msghandle = baseUrl + '/voerka/msghandle/';var msgmerge = exports.msgmerge = baseUrl + '/voerka/msgmerge/';var msgneglect = exports.msgneglect = baseUrl + '/voerka/msgneglect/';var newestalarms = exports.newestalarms = baseUrl + '/voerka/newestalarms/';var buildagentuser = exports.buildagentuser = baseUrl + '/voerka/buildagentuser/';var addfavorite = exports.addfavorite = baseUrl + '/voerka/addfavorite/';var allotdevice = exports.allotdevice = baseUrl + '/voerka/allotdevice/';var removedevice = exports.removedevice = baseUrl + '/voerka/removedevice/';var removefavorite = exports.removefavorite = baseUrl + '/voerka/removefavorite/';var getstatus = exports.getstatus = baseUrl + '/devices/safebox/getstatus/';var getcoord = exports.getcoord = baseUrl + '/devices/safebox/getcoord/';var getagentuser = exports.getagentuser = baseUrl + '/voerka/getagentuser/';var getdevicesinfo = exports.getdevicesinfo = baseUrl + '/voerka/getdevicesinfo/';var getdevices = exports.getdevices = baseUrl + '/voerka/getdevices/';var getfavorite = exports.getfavorite = baseUrl + '/voerka/getfavorite/';var setdeviceinfo = exports.setdeviceinfo = baseUrl + '/voerka/setdeviceinfo/';var setalarm = exports.setalarm = baseUrl + '/devices/safebox/setalarm/';var setdefence = exports.setdefence = baseUrl + '/devices/safebox/setdefence/';var modifypassword = exports.modifypassword = baseUrl + '/voerka/modifypassword/';var setuserinfo = exports.setuserinfo = baseUrl + '/voerka/setuserinfo/';

/***/ }),

/***/ "./src/assets/images/safebox.jpg":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/safebox.59b2a5.jpg";

/***/ }),

/***/ "./src/assets/js/semantic/components/list.min.css":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./src/assets/js/semantic/components/list.min.css");
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
		module.hot.accept("!!../../../../../node_modules/css-loader/index.js!./list.min.css", function() {
			var newContent = require("!!../../../../../node_modules/css-loader/index.js!./list.min.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

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

/***/ "./src/devices/operates/safebox.operate.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__("./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4bc157c9\",\"scoped\":true,\"hasInlineConfig\":false}!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./utils/lang-loader.js!./src/devices/operates/safebox.operate.vue")
}
var Component = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")(
  /* script */
  __webpack_require__("./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./utils/lang-loader.js!./src/devices/operates/safebox.operate.vue"),
  /* template */
  __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-4bc157c9\",\"hasScoped\":true}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./utils/lang-loader.js!./src/devices/operates/safebox.operate.vue"),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-4bc157c9",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\project\\webfrontend\\stwebfrontend\\src\\devices\\operates\\safebox.operate.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] safebox.operate.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4bc157c9", Component.options)
  } else {
    hotAPI.reload("data-v-4bc157c9", Component.options)
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

/***/ })

});