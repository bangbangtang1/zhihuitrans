(function($, doc, owner) {
	owner.regx = {
		project: 'http://gis.cloud.rtzltech.cn:8010/monitoringserver/',
		root: 'http://gis.cloud.rtzltech.cn:8010/',
		//		project: 'http://192.2.4.6/monitoringserver/',
		//		root: 'http://192.2.4.6/',
		phoneRegx: /^(1[3578][0-9]|147)\d{8}$/,
		pwdRegx: /^[0-9a-zA-Z]{6,16}$/,
		chineseRegx: /^[\u4e00-\u9fa5]*$/,
		commentRegx: /^\S{10,300}$/,
		items: 20,
		screen_width: doc.body.clientWidth,
		screen_height: doc.body.clientHeight
	};
	//不带参数请求
	owner.httpReq = function(path, callback) {
		callback = callback || $.noop;
		plus.nativeUI.showWaiting();
		$.ajax({
			type: "post",
			dataType: 'json',
			url: this.regx.project + path,
			timeout: 30000,
			success: function(data) {
				plus.nativeUI.closeWaiting();
				if(data && '99' == data.retcode) {
					mui.alert(data.retmsg);
					plus.runtime.restart();
					return;
				}
				return callback(data);
			},
			error: function(xhr, type, errorThrown) {
				plus.nativeUI.closeWaiting();
				// 异常处理；
				console.log(type);
			}
		});
	};
	//带参数请求
	owner.httpReqWithParams = function(params, path, callback) {
		callback = callback || $.noop;
		params = params || {};
		plus.nativeUI.showWaiting();
		$.ajax({
			type: "post",
			data: params,
			dataType: 'json',
			url: this.regx.project + path,
			timeout: 30000,
			success: function(data) {
				plus.nativeUI.closeWaiting();
				if(data && '99' == data.retcode) {
					mui.alert(data.retmsg);
					plus.runtime.restart();
					return;
				}
				return callback(data);
			},
			error: function(xhr, type, errorThrown) {
				plus.nativeUI.closeWaiting();
				// 异常处理；
				console.log(type);
			}
		});
	};

	//不带等待条
	owner.httpReqNoWait = function(path, callback) {
		callback = callback || $.noop;
		$.ajax({
			type: "post",
			dataType: 'json',
			url: this.regx.project + path,
			timeout: 30000,
			success: function(data) {
				if(data && '99' == data.retcode) {
					mui.alert(data.retmsg);
					plus.runtime.restart();
					return;
				}
				return callback(data);
			},
			error: function(xhr, type, errorThrown) {
				// 异常处理；
				console.log(type);
			}
		});
	};

	owner.httpReqWithParamsNoWait = function(params, path, callback) {
		callback = callback || $.noop;
		params = params || {};
		$.ajax({
			type: "post",
			data: params,
			dataType: 'json',
			url: this.regx.project + path,
			timeout: 30000,
			success: function(data) {
				if(data && '99' == data.retcode) {
					mui.alert(data.retmsg);
					plus.runtime.restart();
					return;
				}
				return callback(data);
			},
			error: function(xhr, type, errorThrown) {
				// 异常处理；
				console.log(type);
			}
		});
	};

	//不带参数重定向
	owner.sendRedirect = function(destPage, method) {
		var pageId = destPage.substr(0, destPage.lastIndexOf('.'));
		if(pageId.indexOf('pages') != -1) {
			pageId = pageId.substr(pageId.indexOf('/') + 1);
		}
		var page = plus.webview.getWebviewById(pageId);
		if(page) {
			$.fire(page, method);
			plus.webview.show(page);
		} else {
			$.openWindow({
				url: destPage,
				id: pageId
			});
		}
	};
	//带参数重定向
	owner.sendRedirectWithParams = function(params, destPage, method) {
		params = params || {};
		var pageId = destPage.substr(0, destPage.lastIndexOf('.'));
		if(pageId.indexOf('pages') != -1) {
			pageId = pageId.substr(pageId.indexOf('/') + 1);
		}
		var page = plus.webview.getWebviewById(pageId);
		if(page) {
			$.fire(page, method, params);
			plus.webview.show(page);
		} else {
			$.openWindow({
				url: destPage,
				id: pageId,
				extras: params
			});
		}
	};
	//退出登录
	owner.logout = function(callback) {
		callback = callback || $.noop;
		plus.storage.removeItem('userInfo');
		return callback();
	};
	//百度定位
	owner.baiduPos = function(callback) {
		plus.geolocation.getCurrentPosition(function(position) {
			return callback(position);
		}, function(e) {
			console.log("获取百度定位位置信息失败：" + e.message);
			return callback('fail');
		}, {
			provider: 'baidu'
		});
	};
	//获取当前登录用户的信息
	owner.getUser = function() {
		var userInfoStr = plus.storage.getItem('userInfo');
		return JSON.parse(userInfoStr);
	};
	//保存当前登录用户的信息
	owner.saveUser = function(userInfo) {
		var userInfoStr = JSON.stringify(userInfo);
		plus.storage.setItem('userInfo', userInfoStr);
	};
	//退出登录
	owner.removeUser = function() {
		plus.storage.removeItem('userInfo');
	};
	//保存地图刷新时间间隔
	owner.saveFreshTime = function(timeInfo) {
			var strfreshTime = JSON.stringify(timeInfo);
			plus.storage.setItem('freshTime', strfreshTime);
		}
		//获取地图刷新时间间隔
	owner.getFreshTime = function() {
		var strfreshTime = 30//plus.storage.getItem('freshTime');
		if(!strfreshTime) {
			return {
				second: 30
			};
		}
		return JSON.parse(strfreshTime);
	}
	owner.isEmpty = function(s) {
		return null == s || '' == s;
	};
	owner.isPhone = function(phone) {
		return phone.match(owner.regx.phoneRegx);
	};
	owner.isPwd = function(pwd) {
		return pwd.match(owner.regx.pwdRegx);
	};
	owner.isChinese = function(name) {
		return name.match(owner.regx.chineseRegx);
	};
	owner.commentLenLimit = function(cm) {
		return cm.match(owner.regx.commentRegx);
	};
	owner.isEqualPwd = function(pwd, conPwd) {
		return pwd == conPwd;
	};
	owner.getBLen = function(str) {
		if(str == null) return 0;
		if(typeof str != "string") {
			str += "";
		}
		return str.replace(/[^x00-xff]/g, "01").length;
	};
})(mui, document, window.app = {});