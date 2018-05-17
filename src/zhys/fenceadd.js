import React from 'react';
import { StyleSheet, WebView, View, Button, TextInput, PixelRatio, TouchableOpacity, Platform, StatusBar, Dimensions, FlatList, Animated, Easing, ScrollView } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { Flex, Icon, Image, Placeholder, Text, Page } from '../components';
import { getWebViewData } from './services';
import { Slider, WingBlank, WhiteSpace } from 'antd-mobile';


export class FenceAddScreen extends React.Component {
    divHeight: 0;
    constructor(props) {
        super(props)
        this.state = {
            translateValue: new Animated.Value(0),
            rotateValue: new Animated.Value(0),
            fenceradius: 100,
        };
    }
    render() {
        const { navigate, state } = this.props.navigation;
        return (
            <Page title='新增围栏' >
                <WebView
                    source={Platform.OS == 'ios' ? require('./html/pages/fence-add.html') : { uri: 'file:///android_asset/html/pages/fence-add.html' }}
                    // source={require('./html/pages/fence-add.html')}
                    // injectedJavaScript={`window.params_devNo=${state.params.devNo};`}
                    style={{ width: '100%', height: '100%' }}
                    onMessage={this.onMessage}
                    ref={(r) => { this.webView = r }}
                />
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
    startAnimation = () => {
        Animated.timing(
            this.state.translateValue,
            {
                toValue: this.state.translateValue._value == this.height ? 0 : this.height,
                // easing:Easing.back,
                duration: 200
            }
        ).start();
        Animated.timing(
            this.state.rotateValue,
            {
                toValue: this.state.rotateValue._value == 0 ? 1 : 0,
                // easing:Easing.back,
                duration: 200
            }
        ).start();
    }
    componentDidMount() {
    }
}