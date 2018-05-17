import React from 'react';
import { StyleSheet, View, Button, Text, TextInput, PixelRatio, TouchableOpacity, Platform, StatusBar, Dimensions, FlatList, ScrollView, Alert, Animated } from 'react-native';
import { StackNavigator } from 'react-navigation';
import PropTypes from 'prop-types';
import { Toast } from 'antd-mobile';
import { Flex, Icon, Image, Placeholder, Page } from '../components';
import { getbind, getunbind, getrealTimeTrack } from './services';
/**
 * 设备详情
 */
export class DeviceDetailScreen extends React.Component {
    static navigationOptions = {

    };
    vehicleNo = '';
    constructor(props) {
        super(props);
        this.state = {
            translateValue: new Animated.Value(0),
            rotateValue: new Animated.Value(0),
            fenceradius: 100,
            textvalue: '点击选择围栏',
            fenceNo: '',
        }
        this.handlers = ([]: Array<() => boolean>)
    }
    render() {
        const { navigate, state } = this.props.navigation;
        return (
            <Page title={`设备号：${state.params.title}`}>
                <ScrollView style={{ height: Dimensions.get('screen').height, backgroundColor: '#f1f1f1' }}>
                    <StatusBar backgroundColor={'#3285ff'} translucent={true} barStyle='light-content' />
                    <Flex column style={{ paddingLeft: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#d1d1d1' }} >
                        <StatusBar barStyle='light-content' translucent={true} />
                        <TouchableOpacity
                            onPress={() => { getrealTimeTrack(state.params.title, (data) => { navigate('PositionService', data) }) }}
                            style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#d1d1d1', paddingTop: 12, paddingBottom: 12, flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center' }}>
                            <Flex HW style={{ width: 40, height: 40, marginRight: 10 }}>
                                <Image width={40} height={40} src={require(`./img/address.png`)} />
                            </Flex>
                            <Flex column horizontal>
                                <Text style={{ fontSize: 16, color: '#212121', marginBottom: 8 }} >
                                    最新定位
                            </Text>
                                <Text style={{ fontSize: 14, color: '#212121' }} >
                                    {state.params.adr}
                                </Text>
                            </Flex>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                // console.log(state.params.title)
                                navigate('PoliceHistory', { title: state.params.title })
                            }}
                            style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#d1d1d1', paddingTop: 12, paddingBottom: 12, flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center' }}>
                            <Flex HW style={{ width: 40, height: 40, marginRight: 10 }}>
                                <Image width={40} height={40} src={require(`./img/policeList.png`)} />
                            </Flex>
                            <Flex column horizontal >
                                <Text style={{ fontSize: 16, color: '#212121', marginBottom: 8 }} >
                                    报警历史
                            </Text>
                                <Text style={{ fontSize: 14, color: '#212121' }} >
                                    该车辆报警的OBD信息
                            </Text>
                            </Flex>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { getrealTimeTrack(state.params.title, (data) => { navigate('Trackplayback', data) }) }}
                            style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#d1d1d1', paddingTop: 12, paddingBottom: 12, flexDirection: 'row', backgroundColor: '#fff' }}>
                            <Flex HW style={{ width: 40, height: 40, marginRight: 10 }}>
                                <Image width={40} height={40} src={require(`./img/trackReplay.png`)} />
                            </Flex>
                            <Flex column horizontal>
                                <Text style={{ fontSize: 16, color: '#212121', marginBottom: 8 }} >
                                    轨迹回放
                            </Text>
                                <Text style={{ fontSize: 14, color: '#212121' }} >
                                    按时间段回放行车轨迹
                            </Text>
                            </Flex>
                        </TouchableOpacity>
                        {!state.params.vehicleNo && !state.params.fenceNo ?
                            <Flex column style={{ height: 'auto' }}>
                                <TouchableOpacity
                                    onPress={this.startAnimation}
                                    style={{ paddingTop: 12, paddingBottom: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Flex HW style={{ width: 40, height: 40, marginRight: 10 }}>
                                        <Image width={40} height={40} src={require(`./img/binding.png`)} />
                                    </Flex>
                                    <Flex column horizontal flex1>
                                        <Text style={{ fontSize: 16, color: '#212121', marginBottom: 8 }} >
                                            手动绑定
                                    </Text>
                                        <Text style={{ fontSize: 14, color: '#212121' }} >
                                            绑定设备，建立设备与车辆围栏绑定关系
                                    </Text>
                                    </Flex>
                                    <Animated.View style={{
                                        width: 30, height: 30, marginRight: 10,
                                        transform: [{
                                            rotate: this.state.rotateValue.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: ['0deg', '180deg']
                                            })
                                        }]
                                    }}>
                                        <Icon name='arrowUp' width={30} height={30} color='#808080' />
                                    </Animated.View>
                                </TouchableOpacity>
                                <Animated.View style={{
                                    height: this.state.translateValue,
                                    overflow: 'hidden',
                                    backgroundColor: '#fff',
                                }} >
                                    <Flex column
                                        style={{ height: 160 }}
                                        other={{
                                            onLayout: (e) => {
                                                // console.log(e.nativeEvent.layout.height)
                                                this.height = e.nativeEvent.layout.height
                                            }
                                        }}>
                                        <TouchableOpacity
                                            style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#d1d1d1', borderTopWidth: 1, borderTopColor: '#d1d1d1', height: 50, justifyContent: 'center', alignItems: 'center' }}
                                            onPress={() => {
                                                navigate('FenceAvailableList', { bindfence: this.bindfence })
                                                // this.binfence('was')
                                            }}>
                                            <Text style={{ flex: 1, fontSize: 16 }} numberOfLines={1} >{this.state.textvalue}</Text>
                                            <Flex style={{ marginRight: 10 }}>
                                                <Icon name='arrowRight' width={30} height={30} color='#808080' />
                                            </Flex>
                                        </TouchableOpacity>
                                        <Flex vertical style={{ borderBottomWidth: 1, borderBottomColor: '#d1d1d1', height: 50 }} >
                                            <TextInput
                                                placeholder='请输入车牌号'
                                                underlineColorAndroid="transparent"
                                                multiline={true}
                                                style={{ fontSize: 16, width: '100%', padding: 0 }}
                                                onChange={(e) => { this.vehicleNo = e.nativeEvent.text }}
                                            />
                                        </Flex>
                                        <Flex HW >
                                            <TouchableOpacity
                                                onPress={this.bindfn}
                                                style={{ marginTop: 10, marginBottom: 14, justifyContent: 'center', alignItems: 'center', height: 40, width: 100, backgroundColor: '#21b3ff', borderRadius: 5 }}>
                                                <Text style={{ fontSize: 17, color: '#fff' }} >确定</Text>
                                            </TouchableOpacity>
                                        </Flex>
                                    </Flex>
                                </Animated.View>
                            </Flex>
                            :
                            <TouchableOpacity
                                onPress={() => {
                                    Alert.alert(
                                        '您确定要解除当前设备与车辆的绑定关系吗？',
                                        '',
                                        [
                                            { text: '确定', onPress: () => this.unbindfn() },
                                            { text: '取消', onPress: () => console.log('你点击了取消') }
                                        ]
                                    )
                                }
                                }
                                style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#d1d1d1', paddingTop: 12, paddingBottom: 12, flexDirection: 'row' }}>
                                <Flex HW style={{ width: 40, height: 40, marginRight: 10 }}>
                                    <Image width={40} height={40} src={require(`./img/unbundling.png`)} />
                                </Flex>
                                <Flex column horizontal>
                                    <Text style={{ fontSize: 16, color: '#212121', marginBottom: 8 }} >
                                        手动解绑
                                </Text>
                                    <Text style={{ fontSize: 14, color: '#212121' }} >
                                        解除当前绑定设备，释放设备
                                </Text>
                                </Flex>
                            </TouchableOpacity>}
                    </Flex>
                </ScrollView>
            </Page>
        );
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
    unbindfn = () => {
        const { navigate, state } = this.props.navigation;
        getunbind(`devNo=${state.params.title}`, (data) => {
            // console.log(data)
            Toast.info(data.retmsg);
            if ('0' != data.retcode) {
                return;
            }
        })
    }
    bindfn = () => {
        const { navigate, state, goBack } = this.props.navigation;
        if (!this.vehicleNo && !this.state.fenceNo) {
            Toast.info('请输入车牌号或选择围栏');
            return;
        }
        if (!this.vehicleNo) {
            Toast.info('请输入车牌号');
            return;
        }
        getbind(`devNo=${state.params.title}&fenceNo=${this.state.fenceNo}&vehicleNo=${this.vehicleNo}`, (data) => {
            Toast.info(data.retmsg);
            if ('0' != data.retcode) {
                return;
            }
            goBack();
        })
    }
    bindfence = (value, id) => {
        this.setState({ textvalue: value, fenceNo: id })
    }
}
DeviceDetailScreen.contextTypes = {
    router: PropTypes.object
};