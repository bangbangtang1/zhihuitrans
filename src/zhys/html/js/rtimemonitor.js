var intervalTime = 0;
var trackTimer = null;
var trackMarker = null;
var trackDataReal = {};

function mapinit(map, level, lng, lat) {
	ZMap.defaultMap(map, {
		lng: lng,
		lat: lat,
		level: level,
		callback: getRTimePoint
	});
}

function getRTimePoint() {
	window.postMessage(JSON.stringify({ callBack: "callBackGetRealTimeTrack" }));
}

function procJson(json) {
	if(!trackDataReal.devNo) {
		setTrackDataReal(json);
		var myIcon = new BMap.Icon("../images/arrow.png",
			new BMap.Size(32, 32));
		myIcon.setImageOffset(new BMap.Size(0, 32 - 32 * json.iconIndex)); //
		myIcon.iconAnchor = new BMap.Size(16, 16);
		var markerOpt = {
			icon: myIcon,
			rotation: json.course
		};

		if(trackMarker == null) {
			var point = new BMap.Point(json.longitude, json.latitude);
			trackMarker = new BMap.Marker(point, markerOpt);
			ZMap.mapObj.addOverlay(trackMarker);
			ZMap.setCenterAndZoom(point, ZMap.mapObj.getZoom());
			var opts = {
				width: 280,
				offset: new BMap.Size(0, 0)
			};

			var htmlinfo = GGenerateWinowInfoHTMLRealTime(trackDataReal);
			var infoWindow = new BMap.InfoWindow(htmlinfo, opts);
			ZMap.mapObj.openInfoWindow(infoWindow, point);
			trackMarker.addEventListener('click', function(e) {
				var opts = {
					width: 280,
					offset: new BMap.Size(0, 0)
				};

				var htmlinfo = GGenerateWinowInfoHTMLRealTime(trackDataReal);
				var infoWindow = new BMap.InfoWindow(htmlinfo, opts);
				ZMap.mapObj.openInfoWindow(infoWindow, e.target.point);
			});
		}
	} else {
		if(trackDataReal.longitude == json.longitude &&
			trackDataReal.latitude == json.latitude) {
			Sleep(this, 100);
			this.NextStep = function() {
				getRTimePoint();
			};
			return;
		}
	}
	moveMarker(json);
}

function drawLine(stPoint, enPoint) {
	var polyline = new BMap.Polyline([stPoint, enPoint]);
	polyline.setStrokeColor("#000DFF");
	polyline.setStrokeWeight(4);
	polyline.setStrokeOpacity(1);
	ZMap.mapObj.addOverlay(polyline);
}

function updateMarker(trunk) {
	var point = new BMap.Point(trunk.longitude, trunk.latitude);
	trackMarker.setPosition(point);
	trackMarker.setRotation(trunk.course);
	var bounds = ZMap.mapObj.getBounds();
	if (!bounds.containsPoint(point)) {
		ZMap.setCenterAndZoom(point, ZMap.mapObj.getZoom());
	}
}

function setTrackDataReal(data) {
	trackDataReal.vehicleNo = data.vehicleNo;
	trackDataReal.timestamp=data.timestamp;
	trackDataReal.gpsSpeed = data.gpsSpeed;
	trackDataReal.gpsSign = data.gpsSign;
	trackDataReal.gpsTime = data.gpsTime;
	trackDataReal.addr = data.addr;
	trackDataReal.longitude = Number(data.longitude);
	trackDataReal.latitude = Number(data.latitude);
	trackDataReal.online = data.strStatus;
	trackDataReal.course = data.course;
	trackDataReal.devNo = data.devNo;
	trackDataReal.vin = data.vin;
	trackDataReal.battery = data.battery;
	trackDataReal.rotateSpeed = data.rotateSpeed;
}

function moveMarker(newTruck) {
	if(trackTimer) {
		clearInterval(trackTimer);
	}

	if(!newTruck.timestamp) {
		return;
	}
	var moveDone = false;
	intervalTime = 1000 / 4;
	var total_time = (new Number(newTruck.timestamp) - new Number(trackDataReal.timestamp)) / 1000;
	var stepNum = total_time * 4;
	if(stepNum < 1) {
		setTrackDataReal(newTruck);
		getRTimePoint();
		return;
	}
	var latSpeed = (new Number(newTruck.latitude) - trackDataReal.latitude) /
		stepNum;
	if(latSpeed) {
		var strLatSpeed = latSpeed.toString();
		var latSpeedArr = strLatSpeed.split('.');
		var speedArr_prex = latSpeedArr[0];
		var speedArr_subfix = latSpeedArr[1];
		if(speedArr_subfix.length > 6) {
			var substr = speedArr_subfix.substr(0, 6);
			latSpeed = Number(speedArr_prex + '.' + substr);
		}

	}
	var lngSpeed = (new Number(newTruck.longitude) - trackDataReal.longitude) /
		stepNum;
	if(lngSpeed) {
		var strLngSpeed = lngSpeed.toString();
		var lngSpeedArr = strLngSpeed.split('.');
		var speedArr_prex = lngSpeedArr[0];
		var speedArr_subfix = lngSpeedArr[1];
		if(speedArr_subfix.length > 6) {
			var substr = speedArr_subfix.substr(0, 6);
			lngSpeed = Number(speedArr_prex + '.' + substr);
		}
	}
	trackTimer = setInterval(
		function() {
			var stPoint = new BMap.Point(trackDataReal.longitude,
				trackDataReal.latitude);
			trackDataReal.latitude += latSpeed;
			trackDataReal.longitude += lngSpeed;

			if((latSpeed > 0 && trackDataReal.latitude >= newTruck.latitude) ||
				(latSpeed < 0 && trackDataReal.latitude <= newTruck.latitude)) {
				trackDataReal.latitude = new Number(newTruck.latitude);
			}
			if((lngSpeed > 0 && trackDataReal.longitude >= newTruck.longitude) ||
				(lngSpeed < 0 && trackDataReal.longitude <= newTruck.longitude)) {
				trackDataReal.longitude = new Number(newTruck.longitude);
			}
			if(trackDataReal.latitude == newTruck.latitude &&
				trackDataReal.longitude == newTruck.longitude) {
				moveDone = true;
			}

			var enPoint = new BMap.Point(trackDataReal.longitude,
				trackDataReal.latitude);
			drawLine(stPoint, enPoint);
			updateMarker(trackDataReal);

			if(moveDone) {
				setTrackDataReal(newTruck);
				clearInterval(trackTimer);
				getRTimePoint();
			}
		}, intervalTime);
}

function GGenerateWinowInfoHTMLRealTime(data) {
	/** *标题部分Start** */
	var html = '<div style="border-bottom:solid 1px #ff0000;line-height:20px;margin-bottom:5px">';
	var vehicleNo = data.vehicleNo;
	var devNo = data.devNo;
	if(vehicleNo) {
		html += '<strong style="font-size:12px">车牌号：' + vehicleNo + '</strong>';
	} else {
		html += '<strong style="font-size:12px">设备号：' + devNo + '</strong>';
	}
	html += '</div>';

	var addr = data.addr;
	if(addr) {
		if(addr.length > 18) {
			addr = addr.substr(0, 18) + '...';
		}
	}

	var longitude = new Number(data.longitude);
	longitude = longitude.toFixed(6);
	var latitude = new Number(data.latitude);
	latitude = latitude.toFixed(6);

	/** *内容部分Start** */
	html += '<div style="margin:0;padding:2px;font-size:12px;">';
	if(vehicleNo) {
		html += '<span style="color:#244FAF">设备号：</span>' + devNo + '<br/>';
	}
	var vin = data.vin;
	if(!vin || 'canNotGet' == vin || 'notGet' == vin) {
		vin = '未获取到VIN';
	}
	html += '<span style="color:#244FAF">VIN：</span>' + vin + '<br />';
	html += '<span style="color:#244FAF">经纬度：</span>' + longitude + '，' +
		latitude + '<br />';
	html += '<span style="color:#244FAF">车速：</span>' + data.gpsSpeed +
		'KM/H<br />';
	html += '<span style="color:#244FAF">定位时间：</span>' + data.gpsTime +
		'<br />';
	html += '<span style="color:#244FAF">位置：</span>' + addr + '<br />';

	html += '</div>';
	return html;
}

function Sleep(obj, iMinSecond) {
	if(window.eventList == null) {
		window.eventList = new Array();
	}

	var ind = -1;
	for(var i = 0; i < window.eventList.length; i++) {
		if(window.eventList[i] == null) {
			window.eventList[i] = obj;
			ind = i;
			break;
		}
	}

	if(ind == -1) {
		ind = window.eventList.length;
		window.eventList[ind] = obj;
	}

	timer = setTimeout("GoOn(" + ind + ")", iMinSecond);
}

function GoOn(ind) {
	var obj = window.eventList[ind];
	window.eventList[ind] = null;
	if(obj.NextStep) {
		obj.NextStep();
	} else {
		obj();
	}
}