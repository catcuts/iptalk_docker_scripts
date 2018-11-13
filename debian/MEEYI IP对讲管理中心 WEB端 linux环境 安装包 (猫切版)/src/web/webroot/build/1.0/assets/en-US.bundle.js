/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build/1.0/assets/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/common/language.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var currentLanguage = "zh-CN";

var TransDict = {};

function loadLanguage() {
    var _module = {};
    for (var mod in __webpack_require__.m) {
        try {
            __webpack_require__.m[mod](_module);
            var regionData = _module.exports;

            if ((typeof regionData === "undefined" ? "undefined" : _typeof(regionData)) == "object" && "__LANGUAGE__" in regionData) {
                if ("__REGION__" in regionData) {
                    TransDict[regionData["__REGION__"]] = regionData;
                }
                currentLanguage = regionData["__LANGUAGE__"];
            }
        } catch (e) {}
    }
}

loadLanguage();

var L = function L(msg) {
    var region = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "main";

    if (currentLanguage == "zh-CN") {
        return msg;
    }
    try {
        var return_msg = TransDict[region][msg];
        if (return_msg) {
            return return_msg;
        } else {
            return TransDict["main"][msg];
        }
    } catch (e) {
        return msg;
    }
};

window.L = L;

exports.default = L;

/***/ }),

/***/ "./src/language/en-US/iptalk.json":
/***/ (function(module, exports) {

module.exports = {"__REGION__":"iptalk","报警记录":"Alarm record","ID":"ID","设备名称":"Alias","报警类型":"Alarm type","报警输入口":"Alarm input","输入口":"Input","Time":"Time","呼叫记录":"Call record","设备ID":"DeviceID","起始日期":"Start","结束日期":"End","查询":"Query","导出为excel":"Export as excel","主叫设备":"Call ID","主叫名称":"Call alias","被叫设备":"Called ID","被叫名称":"Called alias","开始时间":"Start","接听时间":"Answer","未接听":"no answer","结束时间":"End","呼叫类型":"Call type","接听状态":"Answer type","录像回放":"Replay","呼叫":"call","监视":"surveil","监听":"monitor","广播":"broadcast","正常接听":"answer","转接":"transfer","超时":"timeout","正常模式":"Normal","一呼多响":"Call to all","坐席制":"Seating","日期格式有误":"Date format is incorrect","日期有误":"Date is incorrect","意外错误":"Unexpected error","没有子节点":"No child nodes","所有设备":"All devices","监控设备":"Monitoring equipment","获取直播服务器IP时发生错误":"获取直播服务器IP时发生错误","系统配置":"System settings","用户设置":"User management","系统设置":"System settings","网络设置":"Net settings","系统升级":"System upgrade","用户管理":"User management","身份管理":"Identity management","设备登陆记录":"Login record","事件":"Event","时间":"Time","下线":"Offline","上线":"Online","设备列表":"Device list","IP地址":"IP address","子网掩码":"Subnet mask","网关":"Gateway","DNS":"DNS","版本":"Version","设备IP":"DeviceIP","设备版本":"Version","服务器IP":"服务器IP","设备状态":"State","其他":"Other","终端":"Terminal","话筒":"Microphone","未启用":"Disable","断开":"Offline","空闲":"Free","广播中...":"广播中...","通话中...":"通话中...","设置":"Setting","升级":"upgrade","列表模式":"List mode","图标模式":"Icon mode","设备树":"Device Tree","添加服务器":"Add server","开始监视监听":"开始监视监听","结束监视监听":"结束监视监听","新的设备":"New device","新的节点":"New node","无法增加子节点":"Unable to add child nodes","美一IP对讲管理中心":"Meeyi","首页":"Home","地图定位":"Map","指挥监控":"Monitor","记录查询":"Record","视频广播":"Video","退出登录":"Logout","提交":"Submit","设备经度":"Equipment longitude","设备纬度":"Equipment latitude","新增设备":"Add equipment","修改设备":"Modify equipment","设备属性":"Device properties","设备已存在，勿重复新增":"Equipment already exists, do not repeat new","设备类型不匹配，请选择主机设备(以2开头8位数)":"设备类型不匹配，请选择主机设备(以2开头8位数)","设备类型不匹配，请选择终端设备(以1开头8位数)":"设备类型不匹配，请选择终端设备(以1开头8位数)","设备类型不匹配，请选择音柱设备":"设备类型不匹配，请选择音柱设备","设备类型不匹配，请选择汇防报警设备":"设备类型不匹配，请选择汇防报警设备","设备ID不能为空":"Device ID cannot be empty","设备名称不能为空":"Device name cannot be empty","设备经纬度不能为空":"Latitude and longitude of the device cannot be null","新增成功":"New success","修改成功":"Modify success","新增失败":"New failure","修改失败":"Modify failure","IPTALK主机":"IPTALK host","IPTALK终端":"IPTALK terminal","广播音柱":"广播音柱","汇防报警设备":"汇防报警设备","实时事件定位":"Real-time event positioning","离线":"Offline","在线":"Online","告警":"Alarm","通话中":"On the line","未知状态":"Unknown state","告警！":"Alarm！","主机":"Host","指定地点":"Designated place","是否保存设备位置到\\n\" + address + \"？":"Whether to save the device location\\n\" + address + \"?","移除成功":"Remove success","保存成功":"Save success","移除失败":"Remove success","保存失败":"Save failure","是否继续？移除操作不会真的删除设备，只是从地图上抹去。您可以通过新增设备来恢复。":"Whether or not to continue?The removal operation does not really remove the device, just wipe it off the map. You can restore it by adding new devices.","没有搜索结果~":"No search results~","设备尚未添加到地图":"Device has not yet been added to the map","实时事件":"Real-time events","设备事件":"Device","呼叫事件":"Call","告警事件":"Alarm","清空":"Clear","备注信息":"Remark","报警":"Alarm","防拆报警":"Anti-tamper Alarm","开始广播":"开始广播","停止广播":"停止广播","__LANGUAGE__":"en-US","添加":"添加","系统授权":"系统授权","关于我们":"关于我们","设备类型不匹配，请选择主机设备(以2开头)":"Device type mismatch, please select host device (starting with 2)","设备类型不匹配，请选择终端设备(以1开头)":"Device type mismatch, please select terminal device (starting with 1)","康通IP对讲管理中心":"康通IP对讲管理中心","提交表单":"Form submit","立即复位":"Reset","立即重启":"Restart","已重启，请稍后刷新":"Restarted, please refresh later","修改成功，重启后生效":"Modify successfully，take effect after restart","未知错误":"Unknown error","账号":"Username","昵称":"Alias","密码":"Password","确认密码":"Confirm","当前版本":"Current version","添加升级包":"Add upgrade package","暂未选择任何文件":"No files selected","开始升级":"Upgrade","文件名：":"file name：","文件必须为 zip 类型":"File must be a zip type","大小：":"Size:","上传进度：":"Upload progress:","升级进度：":"Upgrade progress:","重试":"Retry","取消":"Cancel","未开始":"Unbegun","未知":"Unknown","即将开始":"About to begin","升级发生异常":"Upgrade occurrence anomaly","处理中":"In progress","处理完毕":"Processed","解压中":"UnZiping","解压出错，请重试":"UnZip error,please retry","解压完成":"UnZip finish","升级中":"Upgrading","升级失败，请重试":"Upgrade failure,please retry","升级成功，请重启后刷新页面":"Upgrade successfully, please restart and refresh page","请手动关闭CMD完成重启":"Please turn off CMD to complete restart","已重启":"Restarted","服务器异常, 请手动重启":"Server exception, please restart","设备管理":"Device management","设备升级复位":"Device upgrade&reset","组播扫描":"Multicast scanning","高级管理":"Senior management","视频回放":"Video playback","音视频广告":"Video advertisement","暂无设置":"No set up","点击右侧进入相应设置":"Click on the right side to enter Settings","IP对讲管理中心":"IP Speak Management Center","升级成功，请稍后刷新页面":"Upgrade successfully, please refresh the page later","设备升级":"Device upgrade"}

/***/ }),

/***/ "./src/language/en-US/main.json":
/***/ (function(module, exports) {

module.exports = {"1":"1","2":"2","3":"3","1111":"1111","__REGION__":"main","设备名称":"设备名称","未知":"未知","设备类型":"设备类型","设备所有者":"设备所有者","设备地址":"设备地址","安装坐标":"安装坐标","设备灵敏度":"设备灵敏度","所有设备":"All devices","没有访问的权限":"Limited access","添加节点":"add node","编辑节点":"edit node","删除节点":"delete node","刷新节点":"refresh","新的节点":"new node","无法增加子节点":"Unable to add child node","最大化/恢复":"最大化/恢复","移动":"Move","移除":"Remove","拖动要显示的内容到此处":"Drag to show the content here","点击加载更多...":"Click to load more...","加载完毕!":"Load finish!","刷新":"refresh","编辑":"Edit","增加":"增加","删除":"delete","搜索":"搜索","过滤":"过滤","高级搜索":"高级搜索","结束终端视频，联动摄像头的视频将被一起结束，确定结束吗？":"结束终端视频，联动摄像头的视频将被一起结束，确定结束吗？","姓名":"姓名","编号":"编号","通知组件加载失败!":"通知组件加载失败!","通知":"通知","个人设置":"个人设置","更换主题":"更换主题","切换帐号":"切换帐号","修改密码":"修改密码","退出登录":"退出登录","欢迎您，":"欢迎您，","警报":"警报","账号或手机号码":"账号或手机号码","密码":"Password","验证码":"验证码","看不清楚？点击更新":"看不清楚？点击更新","登录":"登录","尚未注册 ? 请联系管理员！":"尚未注册 ? 请联系管理员！","忘记密码":"忘记密码","保存":"保存","刷新成功":"刷新成功","提交表单":"提交表单","重填表单":"重填表单","清除内容":"清除内容","显示表单帮助":"显示表单帮助","提交失败":"提交失败","请输入一个有效值。":"请输入一个有效值。","字段":"字段","{name} 必须指定字段值。":"{name} 必须指定字段值。","{name} 必须选中。":"{name} 必须选中。","{name} 电子邮件地址格式无效。":"{name} 电子邮件地址格式无效。","{name} URL地址格式无效。":"{name} URL地址格式无效。","{name}格式不匹配。":"{name}格式不匹配。","{name} 必须是整型数值类型。":"{name} 必须是整型数值类型。","{name} 必须是十进制数字。":"{name} 必须是十进制数字。","{name} 必须是数值类型":"{name} 必须是数值类型","{name} 必须是 \\'{ruleValue}\\'":"{name} 必须是 \\'{ruleValue}\\'","{name} 必须精确等于 \\'{ruleValue}\\'":"{name} 必须精确等于 \\'{ruleValue}\\'","{name} 不能等于 \\'{ruleValue}\\'":"{name} 不能等于 \\'{ruleValue}\\'","{name} 不能精确等于 \\'{ruleValue}\\'":"{name} 不能精确等于 \\'{ruleValue}\\'","{name} 不能包含 \\'{ruleValue}\\'":"{name} 不能包含 \\'{ruleValue}\\'","{name} 不能精确包含 \\'{ruleValue}\\'":"{name} 不能精确包含 \\'{ruleValue}\\'","{name} 必须包含 \\'{ruleValue}\\'":"{name} 必须包含 \\'{ruleValue}\\'","{name} 必须精确包含 \\'{ruleValue}\\'":"{name} 必须精确包含 \\'{ruleValue}\\'","{name} 长度不能少于 {ruleValue} 个字符。":"{name} 长度不能少于 {ruleValue} 个字符。","{name} 长度必须等于 {ruleValue} 个字符。":"{name} 长度必须等于 {ruleValue} 个字符。","{name} 长度不能大于 {ruleValue} 个字符。":"{name} 长度不能大于 {ruleValue} 个字符。","{name} 必须与 {ruleValue} 字段匹配。":"{name} 必须与 {ruleValue} 字段匹配。","{name} 不能与 {ruleValue} 字段值相等。":"{name} 不能与 {ruleValue} 字段值相等。","{name} 必须是合法的信用卡号码。":"{name} 必须是合法的信用卡号码。","{name} 最少必须选择 {ruleValue} 项。":"{name} 最少必须选择 {ruleValue} 项。","{name} 至少应选择 {ruleValue} 项。":"{name} 至少应选择 {ruleValue} 项。","{name} 最多只能选择 {ruleValue} 项。":"{name} 最多只能选择 {ruleValue} 项。","正在处理...":"正在处理...","确定":"ok","取消":"Cancel","恢复默认":"恢复默认","加载中 ...":"加载中 ...","定位到":"Locate to","我的位置":"My location","选择设备":"Select device","默认模式":"Default mode","编辑模式":"Edit mode","绘图模式":"Drawing mode","围栏模式":"Fence mode","轨迹模式":"Trajectory model","追踪模式":"Tracking mode","配置":"Configuration","显示标注名称":"Display name","实时更新位置":"Real-time update location","更多选项":"更多选项","地理图层":"Geographic layer","地图":"Map","卫星":"Satellite","三维":"Three dimensional","设备图层":"Equipment layer","工具":"Tools","测距":"Ranging","分享":"Sharing","收藏":"Collect","动作":"Action","跟踪":"Tracking","锁定":"Lock","解锁":"Unlock","更名":"Rename","属性":"Attribute","新增":"Add","修改":"Modify","取消移动":"Cancel move","结束移动":"Ended mov","绘制图形":"Drawing graphics","圆形":"Circle","矩形":"Rectangle","多边形":"Polygon","标注":"Label","保险箱":"保险箱","IP对讲主机":"IP对讲主机","更多":"更多","调整":"调整","清空":"Clear","取消调整":"取消调整","完成调整":"完成调整","电子围栏":"电子围栏","显示/隐藏":"显示/隐藏","管理":"管理","显示":"显示","隐藏":"隐藏","圆形围栏":"圆形围栏","矩形围栏":"矩形围栏","多边形围栏":"多边形围栏","入围关联":"入围关联","出围关联":"出围关联","结束关联":"结束关联","轨迹":"轨迹","播放":"play","暂停":"暂停","开始":"开始","停止":"Stop","选取":"Select","点选":"点选","圆形框选":"圆形框选","矩形框选":"矩形框选","多边形框选":"多边形框选","查询周边":"查询周边","退出":"退出","添加一个保险箱":"添加一个保险箱","添加一个话筒":"添加一个话筒","喵汪呜吱":"喵汪呜吱","第一列":"第一列","第二列":"第二列","第三列":"第三列","上传一个新的升级文件包:":"Upload a new pack:","上传":"Upload","已有升级包列表:":"File list:","播放文件仅支持.dd,.rar":"File only support .dd,.rar","上传一个新的音视频:":"Upload a new video:","已有文件列表:":"File list:","播放文件仅支持.wav,.avi,.jpg":"File only support .wav,.avi,.jpg","清除记录":"Clear record","跟踪该保险箱位置":"跟踪该保险箱位置","撤防/布防":"撤防/布防","开启/关闭警铃":"开启/关闭警铃","箱门":"箱门","GSM信号":"GSM信号","电池电量":"电池电量","温度":"温度","湿度":"湿度","电源":"电源","数据获取失败":"数据获取失败","命令发送失败":"命令发送失败","没有子节点":"No child nodes","设备管理":"Device Management","添加服务器":"add server","新的设备":"New device","升级文件管理":"Upgrade file manager","升级":"upgrade","重启":"restart","复位":"reset","强拆":"demolition","强呼":"call","上一页":"prev","下一页":"next","设备ID":"DeviceId","设备IP":"DeviceIP","设备版本":"Version","设备状态":"State","升级状态":"Upgrade state","未启用":"Disable","断开":"offline","空闲":"Free","选择需要新增的文件":"Selected new file","勾选的设备均不在线":"No devices are online","设备不在线":"Device not online","准备升级中":"Upgrade readying","升级失败":"升级失败","设备信息":"Equipment Information","设置":"Setting","报警间隔时间（1-255秒）":"报警间隔时间（1-255秒）","驱动辅助时间（1-65535秒）":"驱动辅助时间（1-65535秒）","辅助号":"辅助号","所有辅助":"所有辅助","1号防区":"1号防区","2号防区":"2号防区","3防区":"3防区","4防区":"4防区","5号防区":"5号防区","6号防区":"6号防区","7号防区":"7号防区","8号防区":"8号防区","9号防区":"9号防区","10号防区":"10号防区","11号防区":"11号防区","12号防区":"12号防区","13号防区":"13号防区","14号防区":"14号防区","15号防区":"15号防区","16号防区":"16号防区","辅助1":"辅助1","辅助2":"辅助2","辅助3":"辅助3","辅助4":"辅助4","辅助5":"辅助5","辅助6":"辅助6","辅助7":"辅助7","辅助8":"辅助8","闭合":"闭合","读取":"读取","清除":"清除","防区":"防区","3号防区":"3号防区","4号防区":"4号防区","时段类型":"时段类型","布撤防":"布撤防","星期":"星期","星期日":"星期日","星期一":"星期一","星期二":"星期二","星期三":"星期三","星期四":"星期四","星期五":"星期五","星期六":"星期六","时":"时","分":"分","撤防":"撤防","布防":"布防","年":"年","月":"月","日":"日","秒":"seconds","一键布防":"一键布防","一键撤防":"一键撤防","区域设置":"区域设置","同步数据":"Synchronize","基本信息":"Essential Information","防区报警类型设置":"防区报警类型设置","IP地址":"IP address","状态":"State","服务器IP":"Server IP","分时段布撤防":"分时段布撤防","时间和日期设置":"时间和日期设置","辅助开关设置":"辅助开关设置","辅助与防区关联设置":"辅助与防区关联设置","报警状态设置":"报警状态设置","区域地址（1-65535）":"区域地址（1-65535）","分组信息":"Group Information","分组名称":"Group Name","分组策略":"Group Strategy","正常模式":"Normal","一呼多响":"Call to all","坐席制":"Seating","提交":"submit","音量设置":"音量设置","广播中...":"广播中...","音量":"音量","启用设备":"Enable","禁用设备":"Disable","未注册":"Unregistered","子网掩码":"Subnet mask","网关":"Gateway","DNS":"DNS","Mac地址":"Mac address","音频端口":"Audio port","视频端口":"Video port","上级地址":"Superior address","短路输出":"Output","无":"None","来电提示":"Call reminder","优先级别":"Priority level","一级":"Level 1","二级":"Level 2","三级":"Level 3","四级":"Level 4","五级":"Level 5","是否录像":"Video recording","升级方式":"Upgrade mode","手动":"manual","自动":"auto","是":"Yes","否":"No","控制类型":"Control type","主控":"Master","限制":"Limit","服务器信息":"Server Infomation","服务器ID":"Server ID","服务器名称":"Server Name","开始时间":"Start time","结束时间":"End time","布防开关":"Switch","报警延迟":"Alarm delay","短路输入":"Input","禁用":"Disable","启用":"Enable","打开":"Open","关闭":"Close","分钟":"minutes","小时":"hours","报警时长":"Alarm time","触发类型":"Trigger type","对应短路输出":"Output","反馈地址":"Feedback address","常开":"Open","常闭":"Close","呼叫地址":"Call address","咨询地址":"Service address","紧急地址":"Emergency address","巡更地址":"Patrol address","管理中心":"Management Center","延迟时间":"Delay","电控锁触发":"Electric lock","IPC地址1":"IPC Addr 1","IPC地址2":"IPC Addr 2","IPC地址3":"IPC Addr 3","文字模式":"Words mode","时间模式":"Time mode","红色":"Red","绿色":"Green","黄色":"Yellow","连续左移":"Left shift","连续上移":"Up move","左拉暮":"Left pull","立即打出":"Print immediately","闪烁显示":"Flashing display","连续下移":"Down move","连续右移":"Right move","右拉暮":"Right pull","结束行":"End line","1(最快)":"1(Fastest)","默认":"Default","上行静止，下行移动":"Up row static,following row move","上行移动，下行静止":"Up row move,following row static","显示模式":"Display mode","屏幕颜色":"Screen color","显示方式":"Display way","运行速度":"Run speed","停留时间":"Stay time","显示字数":"Display NO. of words","滚屏设置":"Roll setting","要发送的文字":"Text to be sent","保存信息":"Save","同步时间":"Sync time","发送文字":"Send text","子面板":"Subpanel","广播类型":"Broadcast type","喇叭":"horn","音箱":"speaker","无联动":"No action","视频分辨率":"Video resolution","关闭视频":"Close video","视频帧率":"FPS","视频压缩率":"Video compression","通话音量":"Call Volume","铃声音量":"Ringer Volume","音频编码":"Audio coding","面板设置":"Panel Settings","输入输出设置":"I/O Settings","音视频设置":"Video Settings","布防设置":"Switch Settings","LED设置":"LED Settings","IPC设置":"IPC Settings","名称":"Alias","组播设置":"Multicast Settings","只对终端有效":"Only terminal","组播扫描":"Multicast scanning","开始扫描":"Start","身份列表":"Identity list","新增身份":"New identity","身份":"Identity","超级管理员":"Super Admin","等级":"Level","添加身份":"Add identity","编辑身份":"Edit identity","删除身份":"Delete identity","网络设置":"网络设置","立即复位":"立即复位","立即重启":"立即重启","已重启，请稍后刷新":"已重启，请稍后刷新","修改成功":"修改成功","修改成功，重启后生效":"修改成功，重启后生效","未知错误":"未知错误","用户设置":"用户设置","账号":"Username","昵称":"Alias","确认密码":"确认密码","系统授权":"系统授权","授权口令":"授权口令","提交授权码":"提交授权码","两次密码输入不一致":"两次密码输入不一致","校正时间":"校正时间","系统升级":"系统升级","当前版本":"当前版本","添加升级包":"添加升级包","暂未选择任何文件":"暂未选择任何文件","开始升级":"开始升级","文件名：":"文件名：","文件必须为 zip 类型":"文件必须为 zip 类型","大小：":"大小：","上传进度：":"上传进度：","升级进度：":"升级进度：","重试":"重试","未开始":"未开始","即将开始":"即将开始","升级发生异常":"升级发生异常","处理中":"处理中","处理完毕":"处理完毕","解压中":"解压中","解压出错，请重试":"解压出错，请重试","解压完成":"解压完成","升级中":"升级中","升级失败，请重试":"升级失败，请重试","升级成功，请重启后刷新页面":"升级成功，请重启后刷新页面","请手动关闭CMD完成重启":"请手动关闭CMD完成重启","已重启":"已重启","服务器异常, 请手动重启":"服务器异常, 请手动重启","用户列表":"User list","新增用户":"Add user","注册时间":"Register time","最后登录时间":"Last logon","添加用户":"Add user","编辑用户":"Edit user","删除用户":"Delete user","开始播放时间":"开始播放时间","请输入日期":"请输入日期","结束播放时间":"结束播放时间","重复":"重复","请选择重复类型":"请选择重复类型","床位编号":"床位编号","病人姓名":"病人姓名","性别：":"性别：","男":"男","女":"女","出生日期":"出生日期","请选择日期":"请选择日期","入院时间":"入院时间","护理级别":"护理级别","一级护理":"一级护理","二级护理":"二级护理","三级护理":"三级护理","疾病名称":"疾病名称","床位地址":"床位地址","责任医生":"责任医生","责任护士":"责任护士","确定要删除所选曲目？":"确定要删除所选曲目？","年龄":"年龄","性别":"性别","请选择性别":"请选择性别","身份证":"身份证","籍贯":"籍贯","照片":"照片","入监时间":"入监时间","判刑出狱时间":"判刑出狱时间","减刑时长":"减刑时长","实际出狱时间":"实际出狱时间","犯罪行为":"犯罪行为","刑期":"刑期","亲属姓名":"亲属姓名","亲属关系":"亲属关系","亲属电话":"亲属电话","家庭住址":"家庭住址","备注信息":"备注信息","请选择财务":"请选择财务","办理意见":"办理意见","入狱时间":"入狱时间","姓名:":"姓名:","编号:":"编号:","设备名称:":"设备名称:","设备编号:":"设备编号:","商品ID":"商品ID","商品图片":"商品图片","商品名称":"商品名称","商品分类":"商品分类","价格":"价格","标题：":"标题：","有效期：":"有效期：","生成时间":"生成时间","采购单号":"采购单号","采购数量":"采购数量","金额":"金额","供应商":"供应商","购买时间":"购买时间","出货单号":"出货单号","购买数量":"购买数量","订单号":"订单号","联系方式":"联系方式","磁卡ID":"磁卡ID","最后登录":"最后登录","删除值日项目":"删除值日项目","部门名称":"部门名称","部门编号":"部门编号","部门名称:":"部门名称:","部门编号:":"部门编号:","身份编号":"身份编号","身份名称":"身份名称","名称:":"名称:","音视频文件管理":"Video file manager","操作日志":"Operation log","音视频文件":"Video file","成功":"success","忙":"busy","空间不够":"space is not enough","文件已存在":"file already exist","ftp连接失败":"FTP connection failed ","md5验证失败":"MD5 validation failed","其它原因":"other","文件不存在":"file does not exist ","没有文件":"no files","已停止":"stopped","台设备正在添加":" devices add new file","台设备正在清空文件":" devices clear all files","设备":"Device","下载":"download","失败":"fail","停止播放":"stop playing","清除文件":"clear all files","资源导航":"资源导航","请点击表格，查看具体设备信息":"请点击表格，查看具体设备信息","所有设备日志":"所有设备日志","请选择设备":"请选择设备","IP对讲机":"IP对讲机","病房门口机":"病房门口机","安装地址":"安装地址","请填写设备安装地址（支持模糊搜索）":"请填写设备安装地址（支持模糊搜索）","消息类型":"消息类型","请选择消息类型":"请选择消息类型","告警":"告警","监听":"监听","消息级别":"消息级别","请选择消息级别":"请选择消息级别","日期":"日期","保存搜索条件":"保存搜索条件","确定删除该条目？":"确定删除该条目？","设备浏览":"设备浏览","其他设备":"其他设备","设备位置":"设备位置","导航":"导航","空闲床位":"空闲床位","病人：":"病人：","出生日期：":"出生日期：","责任护士：":"责任护士：","责任医生：":"责任医生：","护理级别：":"护理级别：","入院时间：":"入院时间：","出院":"出院","更换床位":"更换床位","单击入住":"单击入住","床位不可用":"床位不可用","排序":"排序","分组":"分组","置顶":"置顶","多选":"多选","全选":"全选","首页":"首页","最后一页":"最后一页","表格":"表格","平面图":"平面图","":"","上一床":"上一床","下一床":"下一床","添加病人":"添加病人","编辑病人资料":"编辑病人资料","家庭地址：":"家庭地址：","联系电话：":"联系电话：","住院时间：":"住院时间：","所有值班日志":"所有值班日志","日志类型":"日志类型","请选择日志类型":"请选择日志类型","呼叫日志":"呼叫日志","告警日志":"告警日志","护理日志":"护理日志","日志级别":"日志级别","终端监控":"终端监控","视频监控":"视频监控","所在病房：":"所在病房：","病人姓名：":"病人姓名：","关联设备":"关联设备","使用中":"使用中","未使用":"未使用","设备详情":"设备详情","上一个":"上一个","下一个":"下一个","清空输入":"清空输入","操作":"操作","出售中商品":"出售中商品","未出售商品":"未出售商品","添加商品":"添加商品","下架":"下架","补货":"补货","上架":"上架","添加":"添加","发货":"发货","撤销":"撤销","分类":"分类","库存":"库存","销量":"销量","上架时间":"上架时间","商品编号":"商品编号","描述":"描述","进货价":"进货价","销售价":"销售价","限购量":"限购量","备注":"备注","人员点名签到确认":"人员点名签到确认","姓名：":"姓名：","编号：":"编号：","空床位":"空床位","监舍管理":"监舍管理","拖动人员 分配床位":"拖动人员 分配床位","床位编辑":"床位编辑","全部":"全部","未处理":"未处理","已处理":"已处理","投诉处理":"投诉处理","人员点名补卡确认":"人员点名补卡确认","时间":"时间","请选择时间":"请选择时间","保存监室值日信息":"保存监室值日信息","请选择年份":"请选择年份","请选择月份":"请选择月份","周":"周","请选择周":"请选择周","删除当前人员行为记录":"删除当前人员行为记录","会见亲属":"会见亲属","就医申请":"就医申请","会见律师":"会见律师","会见检察官":"会见检察官","会见狱长":"会见狱长","事务申请":"事务申请","通知操作":"通知操作","新建通知":"新建通知","草稿箱":"草稿箱","已发布":"已发布","已撤回":"已撤回","在线阅读":"在线阅读","拖动人员排班":"拖动人员排班","值班编辑":"值班编辑","上一步":"上一步","下一步":"下一步","清空人员":"清空人员","取消更改":"取消更改","弹窗":"弹窗","清空数据":"清空数据","登记":"登记","点名时间1":"点名时间1","点名时间2":"点名时间2","点名时间3":"点名时间3","点名时间4":"点名时间4","点名时间5":"点名时间5","点名时间6":"点名时间6","打卡时间间隔":"打卡时间间隔","打卡时间段":"打卡时间段","至":"至","第1班":"第1班","有效1":"有效1","有效2":"有效2","第2班":"第2班","第3班":"第3班","第4班":"第4班","磁卡冻结":"磁卡冻结","启动":"启动","禁止":"禁止","添加广播":"添加广播","添加广播计划":"添加广播计划","启动/":"启动/","编辑设备信息":"编辑设备信息","主治医生：":"主治医生：","广播声源":"广播声源","广播目标":"广播目标","广播控制":"广播控制","正在发布中":"正在发布中","信息发布":"信息发布","发布":"发布","定时发布":"定时发布","显示发布历史":"显示发布历史","增加保险箱设备":"增加保险箱设备","成功添加收藏":"成功添加收藏","请选择要收藏的设备":"请选择要收藏的设备","全部类型":"全部类型","设备添加成功":"设备添加成功","有数据未提交，确定关闭窗口？":"有数据未提交，确定关闭窗口？","__LANGUAGE__":"en-US","报警":"报警","卡号:":"卡号:","性别:":"性别:","年龄:":"年龄:","监区:":"监区:","监室:":"监室:","床位:":"床位:","设备别名:":"设备别名:","修改   ":"修改   ","查询":"查询","出狱时间":"出狱时间","住址":"住址","民警编号":"民警编号","值班民警":"值班民警","注意事项":"注意事项","床位":"床位","请选择人员姓名":"请选择人员姓名","部门人员":"部门人员","出货单管理":"出货单管理","订单管理":"订单管理","采购单管理":"采购单管理","查看明细":"查看明细","采购":"采购","出货单详情":"出货单详情","订单详情":"订单详情","采购单详情":"采购单详情","截止时间":"截止时间","商品数量":"商品数量","购物人数":"购物人数","订单单号":"订单单号","购买人":"购买人","数量":"数量","采购单单号":"采购单单号","单价":"单价","拍照":"拍照","开始指纹采集":"开始指纹采集","重置指纹":"重置指纹","开始读卡":"开始读卡","返回":"返回","区域编号":"区域编号","区域名称":"区域名称","清空下拉":"清空下拉","部门编码":"部门编码","身份编码":"身份编码","编码:":"编码:","磁卡登记":"磁卡登记","重新读卡":"重新读卡","第一监区101监室":"第一监区101监室","监狱":"监狱","换床":"换床","{name} 格式不匹配。":"{name} 格式不匹配。","房号:":"房号:","身份证号:":"身份证号:","住址:":"住址:","备注:":"备注:","床号":"床号","监区":"监区","监室":"监室","家人电话":"家人电话","何时出监":"何时出监","指纹编号":"指纹编号","左手食指":"左手食指","右手食指":"右手食指","磁卡卡号":"磁卡卡号","钱包余额":"钱包余额","购物记录":"购物记录","投诉记录":"投诉记录","值日记录":"值日记录","点名记录":"点名记录","事物申请":"事物申请","探监":"探监","求医":"求医","关押期限":"关押期限","结束该视频，联动摄像头的视频将被一起结束，确定结束吗？":"结束该视频，联动摄像头的视频将被一起结束，确定结束吗？","民警值班分配":"民警值班分配","开始监视监听":"开始监视监听","结束监视监听":"结束监视监听","未分配床位的在押人员":"未分配床位的在押人员","按区域查询区域排班信息":"按区域查询区域排班信息","关于我们":"关于我们","导入":"导入","管辖区域":"管辖区域","禁用旁路":"禁用旁路","取消旁路":"取消旁路","按监室查询监室排班信息":"按监室查询监室排班信息","时段1":"时段1","时段2":"时段2","时段3":"时段3","所有防区":"所有防区","时间和日期":"时间和日期","辅助设置":"辅助设置","拖动人员 分配值班":"拖动人员 分配值班","在岗民警":"在岗民警","值日项目":"值日项目","XX省第三监狱":"XX省第三监狱","全部监室":"全部监室","值日范围":"值日范围","拖地":"拖地","洗厕所":"洗厕所","倒垃圾":"倒垃圾","请选择监区":"请选择监区","请选择监室":"请选择监室","监区导航":"监区导航","待分配人员":"待分配人员","编辑人员信息":"编辑人员信息","添加人员":"添加人员","删除人员":"删除人员","查询人员":"查询人员","所处监区":"所处监区","完成搜索，请看搜索结果":"完成搜索，请看搜索结果","没有搜索到结果":"没有搜索到结果","添加成功":"Add success","添加失败":"Add fail","历史记录":"历史记录","事务申请审批":"事务申请审批","上一环节":"上一环节","下一环节":"下一环节","驳回":"驳回","申请通过":"申请通过","发布人：":"发布人：","发布时间：":"发布时间：","待处理":"待处理","已驳回":"已驳回","投诉人：张三丰":"投诉人：张三丰","001":"001","遭民警1殴打":"遭民警1殴打","进行中":"进行中","起始日期：":"起始日期：","结束日期：":"结束日期：","取消编辑":"取消编辑","新建两下监室表":"新建两下监室表","编辑两下监室表":"编辑两下监室表","删除两下监室表":"删除两下监室表","会见家属":"会见家属","同意并结束":"同意并结束","提交审批":"提交审批","拖动人员 分配监室":"拖动人员 分配监室","民警":"民警","新建值班表":"新建值班表","编辑值班表":"编辑值班表","删除值班表":"删除值班表","编辑值班信息":"编辑值班信息","已审批":"已审批","未审批":"未审批","医护申请":"医护申请","律师会见":"律师会见","家属会见":"家属会见","救助申请":"救助申请","申请人：张三丰":"申请人：张三丰","联系医生中":"联系医生中","联系家属中":"联系家属中","同意":"同意","所长会见":"所长会见","会见历史":"会见历史","男性":"男性","女性":"女性","人员详细信息":"人员详细信息","添加监区":"添加监区","通知公告":"通知公告","待办事项":"待办事项","最新订单":"最新订单","新进在押人员":"新进在押人员","房号":"房号","出货单明细":"出货单明细","订单明细":"订单明细","采购单明细":"采购单明细","姓名：张三丰":"姓名：张三丰","第二监区201监室":"第二监区201监室","发布目标：":"发布目标：","请选择":"请选择","民警1":"民警1","民警2":"民警2","民警3":"民警3","民警4":"民警4","民警5":"民警5","发布时间":"发布时间","历史轨迹":"历史轨迹","请选择升级包......":"Please select the upgrade pack ......","远程升级文件列表":"Upgrade list","获取远程升级包失败":"Failed to obtain remote upgrade package","远程暂无升级包":"Remote no upgrade pack","远程操作":"Remote operation","请选择升级包":"Please select the upgrade pack","请选择升级设备":"Please select the upgrade device","语音即时广播":"语音即时广播"}

/***/ }),

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./src/common/language.js");
__webpack_require__("./src/language/en-US/iptalk.json");
module.exports = __webpack_require__("./src/language/en-US/main.json");


/***/ })

/******/ });