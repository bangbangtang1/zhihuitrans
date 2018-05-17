var map = null;
var mapType = BMAP_NORMAL_MAP;
var distTool = null;
var trafficCtrl = null;
var isShowTraffic = false;

var isShowCarNum = 0;
var markerClusterer = null;
var clustererData = [];
var truckData = [];
var posData;
var refreshTime = 0;
var getFreshTime = 0;

function mapinit(fn) {
	ZMap.defaultMap("allmap", {
		lng: 116.404,
		lat: 39.915,
		level: 5,
		callback: fn
	});
}

function anotation(json) {
	//重置标记物
	mapReset();
	//清空聚合数组
	clustererData.splice(0, clustererData.length);
	for (var i = 0; i < json.length; i++) {
		if (json[i].longitude && json[i].latitude) {
			var marker = addMarker(json[i]);
			clustererData.push(marker);
		}
	}
	markerClusterer = new BMapLib.MarkerClusterer(ZMap.mapObj, {
		markers: clustererData,
		gridSize: 100,
		maxZoom: 11
	});
}

function refreshPoint(json) {
	for (var i = 0; i < json.length; i++) {
		if (json[i].longitude && json[i].latitude) {
			updTruckData(json[i]);
		}
	}
}

function addMarker(data) {
	var course = data.course;
	if (!course) {
		course = 0;
	}
	var markerOpt = {
		icon: getTruckIcon(data.iconIndex),
		rotation: course,
	};

	var point = new BMap.Point(data.longitude, data.latitude);
	var marker = new BMap.Marker(point, markerOpt);
	marker.setRotation(course);

	marker.addEventListener('click', function (e) {
		window.postMessage(JSON.stringify({
			url: "alarm/devDetail.action", callBackId: 'devDetail', params: {
				devNo: data.devNo
			}, params2: {
				point: e.target.point
			}
		}));
		// app.httpReqWithParams({
		// 	devNo: data.devNo
		// }, 'alarm/devDetail.action', function (d) {
		// 	var opts = {
		// 		width: 220,
		// 		offset: new BMap.Size(0, 0)
		// 	};
		// 	posData = d;
		// 	var htmlinfo = GGenerateWinowInfoHTML(d);
		// 	var infoWindow = new BMap.InfoWindow(htmlinfo, opts);
		// 	ZMap.mapObj.openInfoWindow(infoWindow, e.target.point);
		// });
	});
	return marker;
}

function updTruckData(data) {
	var curLng = data.longitude;
	var curLat = data.latitude;
	var curDevNo = data.devNo;
	for (var i = 0; i < truckData.length; i++) {
		if (curDevNo != truckData[i].devNo) {
			continue;
		}
		if (curLng == truckData[i].longitude && curLat == truckData[i].latitude) {
			continue;
		}
		var point = new BMap.Point(curLng, curLat);
		truckData[i].longitude = data.longitude;
		truckData[i].latitude = data.latitude;
		var marker = truckData[i].marker;
		marker.setPosition(point);
		marker.setRotation(data.course);
		marker.setIcon(getTruckIcon(data.iconIndex));
		var htmlinfo = GGenerateWinowInfoHTML(data);
		var lbl = marker.getLabel();
		lbl.setContent(htmlinfo);
	}
}

function addTruckData(data, marker) {
	var truck = {
		devNo: data.devNo,
		longitude: data.longitude,
		latitude: data.latitude,
		marker: marker
	};

	truckData.push(truck);
}

function getTruckIcon(index) {
	var myIcon = new BMap.Icon("../images/arrow.png", new BMap.Size(32, 32));
	myIcon.setImageOffset(new BMap.Size(0, 32 - 32 * index)); //
	return myIcon;
}

function GGenerateWinowInfoHTML(data) {
	var html = '<ul class="mui-table-view" style="font-size:12px;">';
	var vehicleNo = data.vehicleNo;
	var devNo = data.devNo;
	if (vehicleNo) {
		html += '<li class="mui-table-view-cell" style="border-bottom:solid 1px #ff0000;padding: 0px;">车牌号：' + vehicleNo + '</li>';
	} else {
		html += '<li class="mui-table-view-cell" style="border-bottom:solid 1px #ff0000;padding: 0px;">设备号：' + devNo + '</li>';
	}

	html += '<li class="mui-table-view-cell" style="padding: 0px;font-size:11px;">';
	if (vehicleNo) {
		html += '<div class="mui-col-xs-12"><span style="color:#244FAF">设备号：</span>' + data.devNo + '</div>';
	}
	var vin = data.vin;
	if (!vin || 'notGet' == vin || 'canNotGet' == vin) {
		vin = 'NG';
	}
	html += '<div class="mui-col-xs-12"><span style="color:#244FAF">车架号：</span>' + vin + '</div>';
	html += '<div class="mui-col-xs-12"><span style="color:#244FAF">速度：</span>' + data.gpsSpeed + 'km/h</div>';
	html += '<div class="mui-col-xs-12"><span style="color:#244FAF">经纬度：</span>' + data.longitude + ',' + data.latitude + '</div>';
	html += '<div class="mui-col-xs-12"><span style="color:#244FAF">定位时间：</span>' + data.gpsTime + '</div>';
	html += '<div class="mui-col-xs-12 mui-ellipsis"><span style="color:#244FAF">位置：</span>' + data.addr + '</div>';
	html += '</li>';

	html += '<li class="mui-table-view-cell" style="padding: 0px; font-size:14px;">';
	html += '<div class="mui-row">';
	html += '<a href="#" style ="color:blue;font-weight: bold;" onclick="rtimemon(\'' + data.devNo + '\')">跟踪</a>&nbsp;|&nbsp;';
	html += '<a href="#" style ="color:blue;font-weight: bold;" onclick="playback(\'' + data.devNo + ',' + data.vehicleNo + '\')">回放</a>&nbsp;|&nbsp;';
	html += '<a href="#" style ="color:blue;font-weight: bold;" onclick="device()">设备</a>&nbsp;|&nbsp;';
	html += '<a href="#" style ="color:blue;font-weight: bold;" onclick="alarm(\'' + data.devNo + '\')" >报警</a>&nbsp;';
	html += '</div>';
	html += '</li>';
	html += '</ul>';

	return html;
}

function mapReset() {
	if (markerClusterer) {
		markerClusterer.clearMarkers();
	}

	clustererData.splice(0, clustererData.length);
	truckData.splice(0, truckData.length);
	ZMap.clear();
}

/*倒计时*/
function countdownTime() {
	var interval = setInterval(function () {
		document.querySelector('#refreshSecs').innerText = refreshTime + '秒';
		refreshTime--;
		if (refreshTime < 0) {
			//刷新地图
			window.postMessage(JSON.stringify({
				url: "track/posDevDataQuery.action", callBackId: 'posDevDataQuery', params: {
					// devNo: data.devNo
				}, params2: {
					point: ''
				}
			}));
			// app.httpReqNoWait('track/posDevDataQuery.action', function (data) {
			// 	refreshPoint(data);
			// });

			refreshTime = getFreshTime;
		}
	}, 1000);
}