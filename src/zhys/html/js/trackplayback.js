var tracklogDatas = []; //存放轨迹点数据
var tracklogLatLngs = [];
var curpalyindex = 0;

function mapinit(map, level, data) {
	var lng = 116.404;
	var lat = 39.915;
	if(data) {
		lng = data.longitude;
		lat = data.latitude;
	}
	ZMap.defaultMap(map, {
		lng: lng,
		lat: lat,
		level: level
	});
	var point = new BMap.Point(lng, lat);
	var markerOpt = {
		icon: getDevIcon(data.iconIndex),
		rotation: data.course,
	};
	var marker = new BMap.Marker(point, markerOpt);
	ZMap.mapObj.addOverlay(marker);
	ZMap.setCenterAndZoom(point, ZMap.mapObj.getZoom());

	var opts = {
		width: 280,
		offset: new BMap.Size(0, 0)
	};
	var htmlinfo = GGenerateWinowInfoHTMLTrack(data);
	var infoWindow = new BMap.InfoWindow(htmlinfo, opts);
	ZMap.mapObj.openInfoWindow(infoWindow, point);
	marker.addEventListener('click', function(e) {
		var opts = {
			width: 280,
			offset: new BMap.Size(0, 0)
		};

		var htmlinfo = GGenerateWinowInfoHTMLTrack(data);
		var infoWindow = new BMap.InfoWindow(htmlinfo, opts);
		ZMap.mapObj.openInfoWindow(infoWindow, e.target.point);
	});
}

function createMarker(data) {
	var point;
	for (var i = 0; i < data.length; i++) {
		point = new BMap.Point(data[i].longitude, data[i].latitude);
		if (i == 0) {
			tracklogLatLngs.push(point);
			setDevData(data[i]);
			ZMap.IsInMapView(point);

			var devIcon = new BMap.Icon("../images/trucks_0.png",
					new BMap.Size(32, 32));
			devIcon.iconAnchor = new BMap.Size(16, 16);
			var markerOpt = {
				icon : devIcon,
				rotation : data[i].course,
			};
			carmarker = new BMap.Marker(point, markerOpt);

			carmarker.addEventListener('click', function(e) {
				var opts = {
					width : 280,
					offset : new BMap.Size(0, 0)
				};
				if (curTrackData) {updateMarker
					var htmlinfo = GGenerateWinowInfoHTMLTrack(curTrackData);
					var infoWindow = new BMap.InfoWindow(htmlinfo, opts);
					ZMap.mapObj.openInfoWindow(infoWindow, e.target.point);
				}
			});

			ZMap.mapObj.addOverlay(carmarker);
		} else {
			if (!tracklogLatLngs[curpalyindex].equals(point)) {
				tracklogLatLngs.push(point);
				setDevData(data[i]);
				curpalyindex++;
			}
		}
	}

	if (tracklogLatLngs.length > 0) {
		var polyline = new BMap.Polyline(tracklogLatLngs);
		polyline.setStrokeColor("#000DFF");
		polyline.setStrokeWeight(4);
		polyline.setStrokeOpacity(1);
		ZMap.mapObj.addOverlay(polyline);// 创建线路标注
	}

}
/**
 * 获取设备图标
 * 
 * @param index
 * @returns {BMap.Icon}
 */
function getDevIcon(index) {
	var devIcon = new BMap.Icon("../images/arrow.png",
			new BMap.Size(32, 32));
	devIcon.setImageOffset(new BMap.Size(0, 32 - 32 * index)); //
	return devIcon;
}

function setDevData(data) {
	var trackData = {};
	trackData.devNo = data.devNo;
	trackData.vehicleNo = data.vehicleNo;
	trackData.gpsSpeed = data.gpsSpeed;
	trackData.gpsSign = data.gpsSign;
	trackData.addr = data.addr;
	trackData.longitude = data.longitude;
	trackData.latitude = data.latitude;
	trackData.acc = data.acc;
	trackData.gpsTime = data.gpsTime;
	trackData.course = data.course;
	trackData.vin = data.vin;
	trackData.battery = data.battery;
	trackData.rotateSpeed = data.rotateSpeed;
	tracklogDatas.push(trackData);
}

//初始化
function initPage() {
	ZMap.init();
	curpalyindex = 0;
	tracklogDatas.splice(0, tracklogDatas.length);
	tracklogLatLngs.splice(0, tracklogLatLngs.length);
}

function GGenerateWinowInfoHTMLTrack(data) {
	/** *标题部分Start** */
	var html = '<div style="border-bottom:solid 1px #ff0000;line-height:20px;margin-bottom:5px">';
	var vehicleNo = data.vehicleNo;
	var devNo = data.devNo;
	if (vehicleNo) {
		html += '<strong style="font-size:12px">车牌号：' + vehicleNo + '</strong>';
	} else {
		html += '<strong style="font-size:12px">设备号：' + devNo + '</strong>';
	}
	html += '</div>';

	var addr = data.addr;
	if (addr) {
		if (addr.length > 18) {
			addr = addr.substr(0, 18) + '...';
		}
	}

	var longitude = new Number(data.longitude);
	longitude = longitude.toFixed(6);
	var latitude = new Number(data.latitude);
	latitude = latitude.toFixed(6);

	/** *内容部分Start** */
	html += '<div style="margin:0;padding:2px;font-size:12px;">';
	var vehicleNo = data.vehicleNo;
	if (vehicleNo) {
		html += '<span style="color:#244FAF">设备号：</span>' + devNo + '<br/>';
	}
	var vin = data.vin;
	if (!vin || 'canNotGet' == vin || 'notGet' == vin) {
		vin = '未获取到VIN';
	}
	html += '<span style="color:#244FAF">VIN：</span>' + vin + '<br />';
	html += '<span style="color:#244FAF">经纬度：</span>' + longitude + '，'
			+ latitude + '<br />';
	html += '<span style="color:#244FAF">车速：</span>' + data.gpsSpeed
			+ 'KM/H<br />';
	html += '<span style="color:#244FAF">定位时间：</span>' + data.gpsTime
			+ '<br />';
	html += '<span style="color:#244FAF">位置：</span>' + addr + '<br />';

	html += '</div>';
	return html;
}