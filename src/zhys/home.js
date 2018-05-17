import React from 'react';
import { StyleSheet, View, Button, Text, TextInput, PixelRatio, TouchableOpacity, Platform, StatusBar, Dimensions, AsyncStorage } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { Flex, Icon, Image, Placeholder } from '../components';
import { login } from './services';
import { Global } from './global';

const X_WIDTH = 375;  
const X_HEIGHT = 812;  
  
// screen  
const SCREEN_WIDTH = Dimensions.get('window').width;  
const SCREEN_HEIGHT = Dimensions.get('window').height;  
  
export function isIphoneX() {  
    return (  
        Platform.OS === 'ios' &&   
        ((SCREEN_HEIGHT === X_HEIGHT && SCREEN_WIDTH === X_WIDTH) ||   
        (SCREEN_HEIGHT === X_WIDTH && SCREEN_WIDTH === X_HEIGHT))  
    )  
}
/**
 * 登录
 */
export class HomeScreen extends React.Component {
    static navigationOptions = {
        // title: 'Welcome',
    };
    constructor(props) {
        super(props);
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={{ height: Dimensions.get('screen').height }}>
                <StatusBar backgroundColor={'#3285ff'} translucent={true} barStyle='light-content' />
                <View style={{ height:(isIphoneX())? 44:20, backgroundColor: '#3285ff' }}></View>
                <Flex HW style={{ position:'relative', backgroundColor: '#3285ff', height:60}}>
                    <Text style={{lineHeight:60, color:'#fff', fontSize:18, fontWeight:'bold', textAlign:'center'}} >智慧运输</Text>
                    
                    <TouchableOpacity onPress={() => {
                        navigate('User')
                        // navigate('Content', {}, NavigationActions.navigate({ routeName: 'User' }))
                    }}
                    style={{ position:'absolute', top:0, right:10, width:60, height:60 }}>
                    <Text style={{color:'#fff', lineHeight:60, textAlign:'right'}} >设置</Text>
                    </TouchableOpacity>
                </Flex>
                <Flex>
                    <Image height={214} width='100%' src={require('./img/banner.png')} />
                </Flex>
                <Flex flex1 column style={{ paddingLeft: 38, paddingRight: 38, backgroundColor: '#fff', height:60}}>
                    <TouchableOpacity onPress={() => {
                        const { navigate } = this.props.navigation;
                        navigate('AllList')
                        // navigate('Content', {}, NavigationActions.navigate({ routeName: 'AllList' }))
                    }}
                        style={{ borderBottomWidth: 1, borderBottomColor: '#d8d8d8', paddingTop: 18, paddingBottom: 18 }}>
                        <Flex vertical>
                            <Flex HW style={{ width: 70, height: 70, marginRight: 15, backgroundColor: '#fff' }}>
                                <Image width={70} height={70} src={require('./img/indexOne.png')} />
                            </Flex>
                            <Flex column horizontal>
                                <Text style={{fontSize:16, color:'#6089f4', marginBottom: 15}} >全图统计</Text>
                                <Text style={{fontSize:14, color:'#a1a1a1'}} >即时为您更新、展示最新数据</Text>
                            </Flex>
                        </Flex>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        const { navigate } = this.props.navigation;
                        navigate('PoliceNew')
                        // navigate('Content', {}, NavigationActions.navigate({ routeName: 'PoliceNew' }))
                    }}
                        style={{ borderBottomWidth: 1, borderBottomColor: '#d8d8d8', paddingTop: 18, paddingBottom: 18 }}>
                        <Flex vertical>
                            <Flex HW style={{ width: 70, height: 70, marginRight: 15, backgroundColor: '#fff' }}>
                                <Image width={70} height={70} src={require('./img/indexTwo.png')} />
                            </Flex>
                            <Flex column horizontal>
                                <Text style={{fontSize:16, color:'#ef9952', marginBottom: 15}} >设备预警</Text>
                                <Text style={{fontSize:14, color:'#a1a1a1'}} >位置服务、轨迹回放、报警历史</Text>
                            </Flex>
                        </Flex>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        const { navigate } = this.props.navigation;
                        navigate('FenceList')
                        // navigate('Content', {}, NavigationActions.navigate({ routeName: 'FenceList' }))
                        // Global.navigation.navigate('Fencelist')
                    }}
                        style={{ borderBottomWidth: 1, borderBottomColor: '#d8d8d8', paddingTop: 18, paddingBottom: 18 }}>
                        <Flex vertical>
                            <Flex HW style={{ width: 70, height: 70, marginRight: 15, backgroundColor: '#fff' }}>
                                <Image width={70} height={70} src={require('./img/indexThree.png')} />
                            </Flex>
                            <Flex column horizontal>
                                <Text style={{fontSize:16, color:'#37bd90', marginBottom: 15}} >围栏管理</Text>
                                <Text style={{fontSize:14, color:'#a1a1a1'}} >创建围栏、选择管理围栏</Text>
                            </Flex>
                        </Flex>
                    </TouchableOpacity>
                </Flex>

            </View>
        );
    }
    handleLogin = () => {

    }
}