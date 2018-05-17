import React from 'react';
import { StyleSheet, View, Button, Text, TextInput, PixelRatio, TouchableOpacity, TouchableWithoutFeedback, AsyncStorage, Keyboard, StatusBar } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { Flex, Icon, Image, Placeholder } from '../components';
import { login } from './services';
import { Slider, WingBlank, WhiteSpace } from 'antd-mobile';
import { Global } from './global';
// import { Initializer, MapView } from 'react-native-baidumap-sdk';
// Initializer.init('G0HzIpFi2Lny16YbmCkBj9kww9myuCXx').catch(e => console.error('地图错误', e))
/**
 * 登录
 */
export class LoginScreen extends React.Component {
    input = {
        name: '',
        pwd: ''
    }
    constructor(props) {
        super(props);
        this.state = {
            imgshow: false
        }
        Global.navigation = this.props.navigation;
    }
    render() {
        const { navigate } = this.props.navigation;
        let imgrequire = require('./img/checked.png');
        this.state.imgshow == true ? imgrequire : imgrequire = require('./img/Unchecked.png');
        return (
            <View onResponderGrant={Keyboard.dismiss} >
            {/* <MapView style={StyleSheet.absoluteFill} /> */}
                <StatusBar backgroundColor={'#EFEFF4'} translucent={true} barStyle='default' networkActivityIndicatorVisible={true} />
                <Flex column style={{ padding: 15 }}>
                    <Flex HW style={{ marginTop: 110, marginBottom: 65 }}>
                        <Text style={{ color: '#2299ee', fontSize: 40, fontWeight: 'bold' }} >智慧运输</Text>
                    </Flex>
                    <Flex column style={{ width: '100%', backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d1d1', borderRadius: 5 }}>
                        <Flex vertical style={{ borderBottomWidth: 1 / PixelRatio.get(), borderColor: '#d1d1d1', height: 50 }}>
                            <Text style={{ color: '#666', fontSize: 15, marginLeft: 10, marginRight: 10, lineHeight: 35 }} >账号</Text>
                            <TextInput
                                autoCapitalize='none'
                                autoCorrect={false}
                                // autoFocus={true} 自动获取光标
                                underlineColorAndroid={'transparent'}
                                onChange={(e) => { this.input.name = e.nativeEvent.text }}
                                style={{ borderWidth: 0, height: 35, flex: 1, padding: 0 }}
                            />
                        </Flex>
                        <Flex vertical style={{ height: 50 }}>
                            <Text style={{ color: '#666', fontSize: 15, marginLeft: 10, marginRight: 10, lineHeight: 35 }} >密码</Text>
                            <TextInput
                                secureTextEntry
                                underlineColorAndroid={'transparent'}
                                onChange={(e) => { this.input.pwd = e.nativeEvent.text }}
                                style={{ borderWidth: 0, height: 35, flex: 1, padding: 0 }}
                            />
                        </Flex>
                    </Flex>
                    <TouchableOpacity
                        onPress={this.handleLogin}
                        style={{ marginTop: 18, marginBottom: 14, justifyContent: 'center', alignItems: 'center', height: 50, backgroundColor: '#21b3ff', borderRadius: 5 }}>
                        <View>
                            <Text style={{ color: '#fff', fontSize: 17 }} >登录</Text>
                        </View>
                    </TouchableOpacity>
                    <Flex height={20} >
                        <TouchableWithoutFeedback
                            onPress={
                                () => (
                                    this.state.imgshow == false ? this.setState({ imgshow: true }) : this.setState({ imgshow: false })
                                )}
                            style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', height: 20 }}
                        >
                            <View vertical style={{ display: 'flex', flex: 1, flexDirection: 'row', height: 15 }}>
                                <Image src={imgrequire} width={15} height={15} />
                                <Text style={{ color: '#c1c1c1', fontSize: 14, marginLeft: 8, lineHeight: 15 }} >自动登录</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </Flex>
                </Flex>
            </View>
        );
    }
    handleLogin = () => {
        const { navigate } = this.props.navigation;
        console.log(this.input.name)
        // navigate('Home')

        // `loginname=changjiu&pwd=1234`
        login(`loginname=${this.input.name}&pwd=${this.input.pwd}`, (data) => {
            if (data && '0' == data.retcode) {
                // 登录即存储账号
                AsyncStorage.setItem('loginname', JSON.stringify(this.input.name), (error) => {
                    if (error) {
                        alert('存储失败')
                    }
                });
                //如果点击记住账号和密码，存储账号和密码
                if (this.state.imgshow == true) {
                    AsyncStorage.setItem('login', JSON.stringify(this.input), (error) => {
                        if (error) {
                            alert('存储失败')
                        }
                    });
                }
                else { //如果没有点击记住账号和密码，删除存储的账号和密码
                    AsyncStorage.removeItem('login', function (error) {
                        if (error) {
                            console.log('账号和密码清空失败');
                        }
                    });
                }
                const resetNav = (routeName) => {
                    const resetAction = NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName })
                        ]
                    })
                    this.props.navigation.dispatch(resetAction)
                }
                resetNav('Home')
            }

        });
    }
}

class ChatScreen extends React.Component {
    static navigationOptions = {
        title: 'Chat with Lucy',
    };
    render() {
        const { params } = this.props.navigation.state;
        return (
            <View>
                {/* <Text>参数：{JSON.stringify(params)}</Text> */}
            </View>
        );
    }
}
export const Login = StackNavigator({
    Home: {
        screen: LoginScreen,
        navigationOptions: {
            header: null
        }
    }
});
export const SimpleApp = StackNavigator({
    Home: {
        screen: Login,
    },
    Chat: { screen: ChatScreen },
});
export default class App extends React.Component {
    render() {
        return <Login />;
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
