import React from 'react';
import { StyleSheet, View, Button, TextInput, PixelRatio, TouchableOpacity, Platform, StatusBar, Dimensions, FlatList, AsyncStorage } from 'react-native';
import { Flex, Text, Image } from '../components';
import { login } from './services';
import { StackNavigator, NavigationActions } from 'react-navigation';


export class LoadPageScreen extends React.Component {
    render() {
        return (
            <View style={{ width:'100%', height: '100%', backgroundColor: '#f7f5f1' }} >
                <StatusBar backgroundColor={'#EFEFF4'} translucent={true} barStyle='default' networkActivityIndicatorVisible={true}/>
                <Flex column style={{ width:'100%', height: '100%', position: 'relative' }}>
                    <Flex horizontal style={{ position: 'absolute', top: '30%', left: 0, right: 0}} >
                        <Image width={237} height={36} src={ require('./img/loadtitle.png')} />
                    </Flex>
                    <Flex horizontal style={{ position: 'absolute', bottom: 70, left: 40, right: 40 }}>
                        <Image width={140} height={33} src={require('./img/loadlogo.png')} />
                    </Flex>
                    <Flex horizontal style={{ position: 'absolute', bottom: 30, left: 0, right: 0 }}>
                        <Text label='版权归业民科技 2015-2020' color='#999' />
                    </Flex>
                </Flex>
            </View>
        )
    }
    islogin = () => {
        const { navigate } = this.props.navigation;
        const resetNav = (routeName) => {
            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName })
                ]
            })
            this.props.navigation.dispatch(resetAction)
        }
        //region1.判断是否存储过账号和密码,如果没有存储过直接跳到login登录页面
        AsyncStorage.getItem('login', (error, result) => {
            if (error || !result) {
                resetNav('Login')
            } else { //如果存储过
                console.log(result)
                let loginstr = JSON.parse(result)
                // 2.通过接口验证账号密码，如果密码正确直接跳转到首页，密码错误跳转到登录页
                login(`loginname=${loginstr.name}&pwd=${loginstr.pwd}`, (data) => {
                    if (data && '0' == data.retcode) {
                        // NavigationActions.reset();
                        resetNav('Home')
                    } else {
                        resetNav('Login')
                    }
                }, () => {
                    // resetNav('Login')
                })
                // console.log(loginname, pwd)
            }
        })
        //endregion
    }
    componentDidMount() {
        const { navigate } = this.props.navigation;
        this.islogin()
    }
}