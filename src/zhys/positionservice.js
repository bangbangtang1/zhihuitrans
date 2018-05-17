import React from 'react';
import { StyleSheet, View, Button, TextInput, PixelRatio, TouchableOpacity, Platform, StatusBar, Dimensions, FlatList, ScrollView, Alert, WebView } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Flex, Icon, Image, Placeholder, Page } from '../components';
import { login, getrealTimeTrack } from './services';
import { Initializer, MapView } from 'react-native-baidumap-sdk';
Initializer.init('G0HzIpFi2Lny16YbmCkBj9kww9myuCXx').catch(e => console.error('地图错误', e))

export class PositionServiceScreen extends React.Component {
    static navigationOptions = { title: 'Basic usage' }
    render() {
        const { navigate, state } = this.props.navigation;
        return (
            <Page title='最新定位' >
                <MapView style={StyleSheet.absoluteFill} zoomLevel={11}>
                    <MapView.Marker
                        selected
                        // title="This is a marker"
                        color="#3498db"
                        onPress={() => Alert.alert('You pressed the marker!')}
                        onCalloutPress={() => Alert.alert('You pressed the callout!')}
                        coordinate={{ latitude: 39.914884, longitude: 116.403883 }}
                    />
                </MapView>
                {/* <WebView
                    source={Platform.OS == 'ios' ? require('./html/pages/rtimemonitor.html') : { uri: 'file:///android_asset/html/pages/rtimemonitor.html' }}
                    // source={require('./html/pages/rtimemonitor.html')}
                    injectedJavaScript={`window.params_devNo=${state.params.devNo};`}
                    style={{ width: '100%', height: '100%' }}
                    onMessage={this.onMessage}
                    ref={(r) => { this.webView = r }}
                /> */}
            </Page>
        )

    }
    

    webViewGetRealTimeTrack = () => {
        // console.log('native获取数据');
        const { navigate, state } = this.props.navigation;
        getrealTimeTrack(state.params.devNo, (data) => {
            // console.log('native获取数据成功发送给webview', data);
            if (this && this.webView && this.webView.postMessage) {
                this.webView.postMessage(JSON.stringify({ callBack: 'callBackGetRealTimeTrack', data }));
            }
        });
    }
    onMessage = (e) => {
        console.log('native收到webview请求：' + e.nativeEvent.data);
        let callBack = null;
        if (e.nativeEvent.data) {
            let data = JSON.parse(e.nativeEvent.data);
            if (data.callBack == 'callBackGetRealTimeTrack') {
                callBack = data.callBack;
                this.webViewGetRealTimeTrack();
            }
        }
    }
}


