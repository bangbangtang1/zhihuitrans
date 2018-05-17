import React from 'react';
import { StyleSheet, View, Button, TextInput, PixelRatio, TouchableOpacity, Platform, StatusBar, Dimensions, FlatList, ScrollView, Alert, WebView } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Flex, Icon, Image, Placeholder, Page } from '../components';
import { login, getWebViewData } from './services';
import { Initializer, MapView, Location } from 'react-native-baidumap-sdk';
Initializer.init('G0HzIpFi2Lny16YbmCkBj9kww9myuCXx').catch(e => console.error('地图错误', e))
import icon from './img/location.png';

const style = StyleSheet.create({
    button: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#fff',
        borderRadius: 40,
        elevation: 2,
    },
    icon: {
        width: 24,
        height: 24,
        margin: 12,
        tintColor: '#616161',
    },
})
export class TrackplaybackScreen extends React.Component {
    static navigationOptions = { title: 'Location in MapView' }

    state = {}

    async componentDidMount() {
        await Location.init()
        Location.setOptions({ gps: true })
        this.listener = Location.addLocationListener(location => {
            this.setState({ location })
        })
        Location.start()
    }

    componentWillUnmount() {
        Location.stop()
        this.listener.remove()
    }

    location = () => this.mapView.setStatus({ center: this.state.location }, 1000)

    render() {
        const { navigate, state } = this.props.navigation;
        // console.log('state.params.devNo:', state.params.devNo);
        return (
            <Page title='轨迹回放' >
                <View style={StyleSheet.absoluteFill}>
                    <MapView
                        ref={ref => this.mapView = ref}
                        style={StyleSheet.absoluteFill}
                        zoomLevel={18}
                        location={this.state.location}
                        locationEnabled
                        zoomControlsDisabled
                    />
                    <View style={style.button}>
                        <TouchableOpacity onPress={this.location}>
                            <Image style={style.icon} source={icon} />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* <WebView
                    source={Platform.OS == 'ios' ? require('./html/pages/trackplayback.html') : { uri: 'file:///android_asset/html/pages/trackplayback.html' }}
                    // source={require('./html/pages/trackplayback.html')}
                    injectedJavaScript={`window.webViewParams={devNo:${state.params.devNo},vehicleNo:'${state.params.vehicleNo}'}`}
                    style={{ width: '100%', height: '100%' }}
                    onMessage={this.onMessage}
                    ref={(r) => { this.webView = r }}
                /> */}
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
                this.webView.postMessage(JSON.stringify({ callBackId: params.callBackId, data }));
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
}



