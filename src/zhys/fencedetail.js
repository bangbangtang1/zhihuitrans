import React from 'react';
import { StyleSheet, WebView, View, Button, TextInput, PixelRatio, TouchableOpacity, Platform, StatusBar, Dimensions, FlatList } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { Flex, Icon, Image, Placeholder, Text, Page } from '../components';
import { login, getWebViewData } from './services';

export class FenceDetailScreen extends React.Component {
    static navigationOptions = {

    };
    constructor(props) {
        super(props);
    }
    coordinate = {
        latitude: 39.906901,
        longitude: 116.397972,
    }
    render() {
        const { navigate, state } = this.props.navigation;
        console.log(`window.webViewParams=${JSON.stringify(state.params)};`);
        // console.log('state.params.fenceNo', state.params.fenceNo);
        return (
            <Page title={state.params.title} >
            <WebView
            source={Platform.OS == 'ios' ? require('./html/pages/fence-detail.html') : { uri: 'file:///android_asset/html/pages/fence-detail.html' }}
                // source={require('./html/pages/fence-detail.html')}
                // injectedJavaScript={`window.webViewParams=${JSON.stringify(state.params)};`}
                injectedJavaScript={`webViewReady(${JSON.stringify(state.params)})`}
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
            console.log('getWebViewData');
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
        console.log('onMessage');
        let data = e.nativeEvent.data;
        if (data) {
            let params = JSON.parse(data);
            this.webViewPostMessage(params);
        }
    }
}