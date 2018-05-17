import React from 'react';
import { StyleSheet, View, Button, TextInput, PixelRatio, TouchableOpacity, Platform, StatusBar, Dimensions, AsyncStorage, ImageBackground, Image } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { Flex, Icon, Placeholder, Text, Page } from '../components';
import { Global } from './global';
import config from './config'

export class UserScreen extends React.Component {
    static navigationOptions = {
        // title: 'Welcome',
    };
    constructor(props) {
        super(props)
        this.state = {
            loginname: '',
        }
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <Page title='个人中心'>
                <View style={{ height: '100%', backgroundColor: '#faf8f9' }}>
                    {/* 状态栏 */}
                    <StatusBar backgroundColor={'#3285ff'} translucent={true} barStyle='light-content' />
                    <Flex column>
                        <ImageBackground style={{ height: 80, width: '100%', flexDirection: 'row', alignItems: 'center' }} source={require('./img/user-bg.png')} >
                            <Image
                                source={require('./img/head-sculpture.png')}
                                style={{ height: 65, width: 65, marginRight: 20, marginLeft: 20 }} />
                            <Text bold label={this.state.loginname} color='#fff' fontSize={20} style={{ marginTop: 15 }} />
                        </ImageBackground>
                        <Flex column>
                            <TouchableOpacity
                                style={{ height: 50, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#d1d1d1', paddingLeft: 15, paddingRight: 15, flexDirection: 'row', alignItems: 'center' }}
                                onPress={
                                    () => {
                                        navigate('About')
                                    }
                                }
                            >
                                <Text label='关于我们' fontSize={16} lineHeight={50} />
                                <Placeholder />
                                <Icon name='arrowRight' height={20} width={20} color='#808080' />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ height: 50, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#d1d1d1', paddingLeft: 15, paddingRight: 15, flexDirection: 'row', alignItems: 'center' }}
                                onPress={
                                    () => {
                                        navigate('Feedback')
                                    }
                                }
                            >
                                <Text label='问题建议' fontSize={16} style={{ lineHeight: 50 }} />
                                <Placeholder />
                                <Icon name='arrowRight' height={20} width={20} color='#808080' />
                            </TouchableOpacity>
                            <Flex style={{ height: 50, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#d1d1d1', justifyContent: 'center', paddingLeft: 15, paddingRight: 15 }}>
                                <Text label='软件版本：' fontSize={16} lineHeight={50} style={{ lineHeight: 50 }} />
                                <Placeholder />
                                <Text label={config.version} fontSize={16} lineHeight={50} style={{ lineHeight: 50 }} />
                            </Flex>
                            <TouchableOpacity
                                style={{ height: 50, backgroundColor: '#21b3ff', justifyContent: 'center', alignItems: 'center', marginTop: 60, borderRadius: 8, marginLeft: 15, marginRight: 15 }}
                                onPress={() => {
                                    const resetNav = (routeName) => {
                                        const resetAction = NavigationActions.reset({
                                            index: 0,
                                            actions: [
                                                NavigationActions.navigate({ routeName })
                                            ]
                                        })
                                        this.props.navigation.dispatch(resetAction)
                                    }
                                    resetNav('Login')
                                    // resetNav('Login')
                                    // navigate('Login')
                                    AsyncStorage.removeItem('login', function (error) {
                                        if (error) {
                                            console.log('账号和密码清空失败');
                                        }
                                    })
                                }} >
                                <Text label='退出登录' color='#fff' fontSize={18} lineHeight={50} style={{ textAlign: 'center' }} />
                            </TouchableOpacity>
                        </Flex>
                    </Flex>
                </View>
            </Page>
        )
    }
    logname = () => {
        const { navigate } = this.props.navigation;
        AsyncStorage.getItem('loginname', (error, result) => {
            if (error || !result) {
                const resetNav = (routeName) => {
                    const resetAction = NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName })
                        ]
                    })
                    this.props.navigation.dispatch(resetAction)
                }
                resetNav('Login')
                // resetNav('Login')
            } else {
                let loginstr = JSON.parse(result);
                console.log(loginstr);
                this.setState({ loginname: loginstr })
            }
        })
    }
    componentDidMount() {
        this.logname();
    }
}

// const resetNav = (routeName) => {
//     const resetAction = NavigationActions.reset({
//         index: 0,
//         actions: [
//             NavigationActions.navigate({ routeName })
//         ]
//     })
//     console.log('导航', Global.navigation);
//     Global.navigation.dispatch(resetAction)
//     // this.props.navigation.dispatch(resetAction)
// }