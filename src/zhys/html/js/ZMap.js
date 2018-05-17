/**
 * 百度地图 api 功能整合
 */

ZMap = {
	mapObj: null,
	mapId: '',
	opts: ''
};

ZMap.defaultMap = function(mapId, opts) {
	ZMap.createMap(mapId, opts);
	ZMap.enables.scrollWheel();
	ZMap.enables.continuous();
	ZMap.controls.addNavi({});
	ZMap.controls.addScale({
		offset: new BMap.Size(0, 40)
	});
};

ZMap.createMap = function(mapId, opts) {
	if (ZMap.mapObj) {
		ZMap.mapObj.clearOverlays();
	}

	ZMap.mapObj = new BMap.Map(mapId);
	ZMap.mapId = mapId;
	ZMap.opts = opts;

	if (opts) {
		var level = opts.level || 15;
		if (opts.lng && opts.lat) {
			var point = new BMap.Point(opts.lng, opts.lat);
			ZMap.mapObj.centerAndZoom(point, level);
		} else if (opts.addr) {
			ZMap.mapObj.centerAndZoom(opts.addr, level);
		} else {
			ZMap.mapObj.centerAndZoom('北京', 14);
		}
	} else {
		ZMap.mapObj.centerAndZoom('北京', 14);
	}

	opts.callback && opts.callback();

};

ZMap.enables = {
	scrollWheel: function() {
		ZMap.mapObj.enableScrollWheelZoom();
	},
	continuous: function() {
		ZMap.mapObj.enableContinuousZoom();
	}
};

ZMap.disables = {
	doubleClkZoom: function() {
		ZMap.mapObj.disableDoubleClickZoom();
	}
};

ZMap.controls = {
	addNavi: function(opts) {
		ZMap.mapObj.addControl(new BMap.NavigationControl(opts));
	},
	addScale: function(opts) {
		ZMap.mapObj.addControl(new BMap.ScaleControl(opts));
	},
	addOverview: function(opts) {
		ZMap.mapObj.addControl(new BMap.OverviewMapControl(opts));
	},
	addMapType: function(opts) {
		ZMap.mapObj.addControl(new BMap.MapTypeControl(opts));
	},
	addGeolocation: function(opts) {
		try {
			ZMap.mapObj.addControl(new BMap.GeolocationControl(opts));
		} catch (e) {}
	}
};

ZMap.micon = function(icon) {
	var micon = new BMap.Icon(icon.img, new BMap.Size(icon.width, icon.height));
	return micon;
};

ZMap.setIcon = function(marker, icon) {
	marker.setIcon(icon);
};

ZMap.iconMarker = function(icon, point) {
	var micon = new BMap.Icon(icon.img, new BMap.Size(icon.width, icon.height));
	var marker = new BMap.Marker(point, {
		icon: micon
	});
	ZMap.mapObj.addOverlay(marker);
	return marker;
};

ZMap.marker = function(point) {
	var marker = new BMap.Marker(point, {
		icon: new BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
			scale: 1.2,
			strokeWeight: 0,
			rotation: 0,
			fillColor: 'red',
			strokeOpacity: 0.3,
			fillOpacity: 0.8
		})
	});
	ZMap.mapObj.addOverlay(marker);
	return marker;
};

ZMap.markerCallback = function(point, callback) {
	var marker = ZMap.marker(point);
	ZMap.addListener(marker, 'click', callback);
};

ZMap.addPolygon = function(points, opts) {
	var polygon = new BMap.Polygon(points, {
		strokeColor: opts.color,
		strokeWeight: (opts.weight || 5),
		strokeOpacity: (opts.opacity || 0.5)
	});
	ZMap.mapObj.addOverlay(polygon);
	return polygon;
};

ZMap.addPolyline = function(points, opts) {
	var polyline = new BMap.Polyline(points, {
		strokeColor: opts.color,
		strokeWeight: (opts.weight || 5),
		strokeOpacity: (opts.opacity || 0.5)
	});
	ZMap.mapObj.addOverlay(polyline);
	return polyline;
};

ZMap.getMap = function() {
	return ZMap.mapObj;
};

ZMap.addListener = function(obj, type, callback) {
	obj.addEventListener(type, function(e) {
		callback(e);
	});
};



ZMap.msgAlert = function(msg, pObj, point) {
	var infoWindow = new BMap.InfoWindow(msg, {
		enableMessage: false
	});
	ZMap.mapObj.openInfoWindow(infoWindow, point);
};

ZMap.setZoom = function(level) {
	ZMap.mapObj.setZoom(level);
};

ZMap.panTo = function(point) {
	ZMap.mapObj.panTo(point);
};

ZMap.setCenterAndZoom = function(point, level) {
	ZMap.mapObj.centerAndZoom(point, level);
};

ZMap.init = function() {
	if (ZMap.mapObj) {
		ZMap.mapObj.clearOverlays();
	}

	var evts = ['click', 'dblclick', 'dragend', 'mouseover', 'mouseout'];

	for (itm in evts) {
		ZMap.mapObj.removeEventListener(evts[itm]);
	}
};

ZMap.clear = function() {
	ZMap.mapObj.clearOverlays();
};

ZMap.getPoint = function(lnglat) {
	if (typeof lnglat != 'string')
		return null;

	var point = null;
	try {
		eval('point=new BMap.Point(' + lnglat + ');');
	} catch (e) {}

	return point;
};

/**
 * 定位城市
 * @param opts
 * @param flag
 */
ZMap.locaCity = function(opts, flag) {
	if (flag) {
		ZMap.createMap(ZMap.mapId, ZMap.opts);
	}

	if (!opts.city) {
		opts.city = '北京';
	}
	if (!opts.level) {
		opts.level = 14;
	}

	ZMap.mapObj.centerAndZoom(opts.city, opts.level);
};


//放大地图级别
ZMap.AmplifyZoom = function(lat, lng) {
	ZMap.mapObj.setCenter(new BMap.Point(lng, lat));
	ZMap.mapObj.zoomIn();
};


//缩小地图级别
ZMap.NarrowZoom = function(lat, lng) {
	ZMap.mapObj.setCenter(new BMap.Point(lng, lat));
	ZMap.mapObj.zoomOut();
};

//判断点是否在当前界面
ZMap.IsInMapView = function(point) {
	var bounds = ZMap.mapObj.getBounds();
	if (!bounds.containsPoint(point)) {
		ZMap.mapObj.setCenter(point);
	}
};

//根据地图上的点确定缩放级别
ZMap.GetZoomLevelFromPoints = function(points) {
	var newpoints = [];
	for (var i = 0; i < points.length; i++) {
		if (!(points[i].lat == 0 && points[i].lng == 0)) {
			newpoints.push(points[i]);
		}
	}
	if (newpoints != null && newpoints.length > 0) {
		if (points.length == 1) {
			var point = new BMap.Point(points[0].lng, points[0].lat);
			ZMap.mapObj.setCenter(point);
		} else {
			var minlat = newpoints[0].lat;
			var minlng = newpoints[0].lng;
			var maxlat = newpoints[0].lat;
			var maxlng = newpoints[0].lng;
			for (var i = 1; i < newpoints.length; i++) {
				if (newpoints[i].lat > maxlat) {
					maxlat = newpoints[i].lat;
				}
				if (newpoints[i].lat < minlat) {
					minlat = newpoints[i].lat;
				}
				if (newpoints[i].lng > maxlng) {
					maxlng = newpoints[i].lng;
				}
				if (newpoints[i].lng < minlng) {
					minlng = newpoints[i].lng;
				}
			}
			var sw = new BMap.Point(minlng, minlat);
			var ne = new BMap.Point(maxlng, maxlat);

			var bound = new BMap.Bounds(sw, ne);
			var center = bound.getCenter();

			var distance = ZMap.mapObj.getDistance(sw, ne);
			if (distance < 10000) {
				ZMap.mapObj.setZoom(13);
			} else if (distance < 50000) {
				ZMap.mapObj.setZoom(11);
			} else if (distance < 100000) {
				ZMap.mapObj.setZoom(10);
			}

			ZMap.mapObj.setCenter(center);

		}
	} else {
		var centerLatlng = new BMap.Point(104.03999609375, 34.421349589195096);
		ZMap.mapObj.setCenter(centerLatlng);
	}

};

//二点间距离
ZMap.getDistance = function(point1, point2) {
	return ZMap.mapObj.getDistance(point1, point2);
};