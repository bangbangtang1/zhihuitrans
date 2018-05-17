import React from 'react';
import { StyleSheet, View, Button, Text, TextInput, PixelRatio, TouchableOpacity, Platform, StatusBar, Dimensions, FlatList } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { Flex, Icon, Image, Placeholder, Page } from '../components';
import { login, getfeedback } from './services';
import { Toast } from 'antd-mobile';
import config from './config.js';

export class FeedbackScreen extends React.Component {
    static navigationOptions = {

    };
    feedInfo: {
        content: '',
        env: ''
    }
    constructor(props) {
        super(props);
        this.feedvalue = ''
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <Page title='意见反馈' >
                <View style={{ height: '100%', backgroundColor: '#faf8f9' }}>
                    {/* 状态栏 */}
                    <StatusBar backgroundColor={'#3285ff'} translucent={true} barStyle='light-content' />
                    <Flex column style={{ paddingTop: 20, paddingBottom: 20, paddingLeft: 15, paddingRight: 15 }} >
                        <Text style={{ fontSize: 16 }} >问题和意见</Text>
                        <TextInput
                            multiline={true}
                            numberOfLines={4}
                            // multiline = {true}                                            
                            onChange={(e) => { this.feedvalue = e.nativeEvent.text }}
                            style={{ width: '100%', height: 100, marginTop: 10, paddingTop: 5, paddingBottom: 5, paddingLeft: 5, paddingRight: 5, borderWidth: 1, borderColor: '#d1d1d1', textAlignVertical: 'top' }}
                            underlineColorAndroid={'transparent'}
                        />
                        <TouchableOpacity
                            onPress={
                                this.submit
                            }
                            style={{ width: '100%', height: 50, marginTop: 10, marginBottom: 14, justifyContent: 'center', alignItems: 'center', backgroundColor: '#21b3ff', borderRadius: 5 }}
                        >
                            <Text style={{ fontSize: 18, color: '#fff' }} >提交</Text>
                        </TouchableOpacity>
                    </Flex>
                </View>
            </Page>
        )
    }
    submit = () => {
        const { goBack } = this.props.navigation;
        let feedInfo = {
            content: this.feedvalue,
            env: `软件版本号${config.versio}`
        }
        if (this.feedvalue.length == 0) {
            Toast.info('反馈内容不能为空');
            return;
        }
        getfeedback(`content=${feedInfo.content}&env=${feedInfo.env}`, (data) => {
            // let model=
            if ('0' != data.retcode) {
                Toast.info(data.retmsg);
                return;
            }
            Toast.info('感谢反馈')
            goBack();
        })
    }
}
