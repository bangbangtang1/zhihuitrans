import React from 'react';
import { StyleSheet, WebView, View, Button, TextInput, PixelRatio, TouchableOpacity, Platform, StatusBar, Dimensions, FlatList, Animated, Easing, ScrollView, Alert } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { Flex, Icon, Image, Placeholder, Text, Page } from '../components';
import { getWebViewData } from './services';
import { Slider, WingBlank, WhiteSpace, Toast } from 'antd-mobile';
import { Initializer, MapView } from 'react-native-baidumap-sdk';
Initializer.init('G0HzIpFi2Lny16YbmCkBj9kww9myuCXx').catch(e => console.error('地图错误', e))

export class AllListScreen extends React.Component {
    static navigationOptions = { title: 'Marker clustering' }

    onStatusChange = status => {
        this.status = status
        this.cluster.update(status)
    }

    onPress = cluster => {
        this.mapView.setStatus({
            center: cluster.coordinate,
            zoomLevel: this.status.zoomLevel + 1,
        }, 500)
    }

    markers = Array(100).fill(0).map((_, i) => ({
        coordinate: {
            latitude: 39.5 + Math.random(),
            longitude: 116 + Math.random(),
        },
        extra: { key: `Marker${i}` },
    }))

    renderMarker = item => (
        <MapView.Marker
            key={item.extra.key}
            title={item.extra.key}
            coordinate={item.coordinate}
        />
    )
    render() {
        const { navigate, state } = this.props.navigation;
        const props = {
            ref: ref => this.mapView = ref,
            style: StyleSheet.absoluteFill,
            onStatusChange: this.onStatusChange,
        }
        return (
            <Page title='全图统计'>
                <MapView {...props}>
                    <MapView.Cluster
                        onPress={this.onPress}
                        ref={ref => this.cluster = ref}
                        markers={this.markers}
                        renderMarker={this.renderMarker}
                    />
                </MapView>
                {/* <WebView
                    source={Platform.OS == 'ios' ? require('./html/pages/global-monitor.html') : { uri: 'file:///android_asset/html/pages/global-monitor.html' }}
                    // injectedJavaScript={`window.params_devNo=${state.params.devNo};`}
                    style={{ width: '100%', height: '100%' }}
                    onMessage={this.onMessage}
                    ref={(r) => { this.webView = r }}
                    onLoad={() => { this.webViewPostMessage({ url: "track/posDevDataQuery.action", callBackId: 'monitorList', params: {} }) }}
                >
                    <StatusBar backgroundColor={'#3285ff'} translucent={true} barStyle='light-content' />
                </WebView> */}
            </Page>
        )
    }
    /**
     * native发送数据给webview
     */
    webViewPostMessage = (params) => {
        // console.log('native获取数据');
        const { navigate, state } = this.props.navigation;
        getWebViewData(params.url, params.params, (data) => {
            // console.log('native获取数据成功发送给webview', data);
            if (this && this.webView && this.webView.postMessage) {
                this.webView.postMessage(JSON.stringify({ callBackId: params.callBackId, data, params2: params.params2 }));
            }
        });
    }
    /**
     * native收到webview请求
     */
    onMessage = (e) => {
        let data = e.nativeEvent.data;
        if (data) {
            let params = JSON.parse(data);
            this.webViewPostMessage(params);
        }
    }
    componentDidMount() {
        Toast.loading('加载中');
    }
}