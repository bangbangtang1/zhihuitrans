import React from 'react';
import { StyleSheet, View, Button, Text, TextInput, PixelRatio, TouchableOpacity, Platform, StatusBar, Dimensions, FlatList, Animated, Easing, ScrollView, DatePickerIOS } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { Flex, Icon, Image, Placeholder, Page } from '../components';
import { login, getpolicenew, getpolicenewstate, getdevice } from './services';
import { DatePicker, Picker } from 'antd-mobile';

/**
 * 车辆预警
 */
export class PoliceNewScreen extends React.Component {
    // static navigationOptions = {

    // };
    constructor(props) {
        super(props)
        this.page = 1;
        this.alarmTime = null;
        this.alarmType = '0';
        this.isrefreshing = false;
        this.state = {
            data: [],
            refreshing: true,
            loadMore: false,
            date: new Date(),
            staticdata: [],
            // staticdata: [{ value: 3, label: '接入OBD' }, { value: 4, label: '拔掉OBD' }, { value: 5, label: '启动' }, { value: 6, label: '熄火' }, { value: 8, label: '上线' }, { value: 9, label: '离线' }],
            cols: 1,
            // pickerValue: ['熄火', '拔掉OBD', '设备离线', '在线', '接入OBD'],
            datevisible: false,
            pickervisible: false,
        }
    }
    render() {
        const { navigate, state } = this.props.navigation;
        let content = null
        if (this.isrefreshing) {
            if (this.state.data.length > 0) {
                content = <FlatList
                    data={this.state.data}
                    renderItem={this._renderItem}
                    refreshing={this.state.refreshing}
                    onRefresh={this.getData}
                    onEndReached={() => { console.log('onEndReached'); this.getData(this.page + 1) }}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={this._renderfooter}
                />
            } else {
                content = <Text style={{ textAlign: 'center', marginTop: 20 }} >无相关预警</Text>
            }
        } else {
            content = <Text style={{ textAlign: 'center', marginTop: 20 }} >加载中...</Text>
        }
        return (
            <Page title='设备预警'>
                <View style={{ height: '100%', backgroundColor: '#fff' }}>
                    {/* 状态栏 */}
                    <StatusBar backgroundColor={'#3285ff'} translucent={true} barStyle='light-content' />
                    <Flex HW style={{ flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: "#d1d1d1", height: 40 }}>
                        <TouchableOpacity
                            onPress={() => { this.setState({ datevisible: true }) }}
                            style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ textAlign: 'center', fontSize: 16, lineHeight: 40 }} >日期选择</Text>
                            <Icon name='arrowDown' width={20} height={20} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { this.setState({ pickervisible: true }) }}
                            style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ textAlign: 'center', fontSize: 16, lineHeight: 40 }} >报警选择</Text>
                            <Icon name='arrowDown' width={20} height={20} />
                        </TouchableOpacity>
                    </Flex>
                    <Flex>
                        <DatePicker
                            mode='date'
                            title="日期选择"
                            visible={this.state.datevisible}
                            value={this.state.date}
                            onOk={(v) => { this.setState({ datevisible: false }); this.alarmTime = v; }}
                            onDismiss={() => this.setState({ datevisible: false })}
                        // onChange={() => (console.log(this.state.date))}
                        />
                        <Picker
                            visible={this.state.pickervisible}
                            data={this.state.staticdata}
                            title="报警类型"
                            cols={this.state.cols}
                            value={this.state.pickerValue}
                            onOk={(v) => { this.setState({ pickervisible: false }), this.alarmType = v; }}
                            onDismiss={() => this.setState({ pickervisible: false })} />
                    </Flex>
                    <Flex column>
                        <Flex column style={{ paddingLeft: 15, backgroundColor: '#fff' }}>
                            {content}
                        </Flex>
                    </Flex>
                </View>
            </Page>
        )
    }
    _renderItem = ({ item }) => {
        const { navigate } = this.props.navigation;
        return (
            <TouchableOpacity
                onPress={() => {
                    const { navigate } = this.props.navigation;
                    navigate('DeviceDetail', item)
                }}
                style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#d1d1d1', paddingTop: 15, paddingBottom: 5 }}>
                <Flex key={item.id} column style={{ width: '78%', paddingTop: 5, paddingBottom: 5, paddingRight: 10 }}>
                    {JSON.stringify(item.vehicleNo) == '' ?
                        <Flex vertical style={{ marginBottom: 8 }}>
                            <Text style={{ fontSize: 14, color: '#000' }} >车牌号：</Text>
                            <Text>{item.vehicleNo}</Text>
                            {/* <Text label='车牌号：' color='#000' fontSize={14} />
                            <Text label={item.vehicleNo} /> */}
                        </Flex> : null
                    }
                    <Flex vertical style={{ marginBottom: 8 }}>
                        <Text style={{ fontSize: 14, color: '#000' }} >设备号：</Text>
                        <Text>{item.title}</Text>
                        {/* <Text label='设备号：' color='#000' fontSize={14} />
                        <Text label={item.title} /> */}
                    </Flex>
                    <Flex vertical style={{ marginBottom: 8 }}>
                        <Text style={{ fontSize: 14, color: '#000' }} >车架号：</Text>
                        <Text>{item.num}</Text>
                        {/* <Text label='车架号：' color='#000' fontSize={14} />
                        <Text label={item.num} /> */}
                    </Flex>
                    {/* {console.log(JSON.stringify(item.name))} */}
                    {JSON.stringify(item.name) == '' ?
                        <Flex style={{ marginBottom: 8 }}>
                            <Text style={{ fontSize: 14, color: '#000' }} >围栏名：</Text>
                            <Text>{item.name}</Text>
                            {/* <Text label='围栏名：' color='#000' fontSize={14} />
                            <Text label={item.name} /> */}
                        </Flex> : null
                    }
                    <Flex vertical style={{ marginBottom: 8 }}>
                        <Text style={{ fontSize: 14, color: '#000' }} >时间：</Text>
                        <Text>{item.date}</Text>
                        {/* <Text label='时间：' color='#000' fontSize={14} />
                        <Text label={item.date} /> */}
                    </Flex>
                    <Flex style={{ marginBottom: 8 }}>
                        <Text style={{ fontSize: 14, color: '#000' }} >地址：</Text>
                        <Text style={{ lineHeight: 20, flex: 1 }} >{item.adr}</Text>
                        {/* <Text label='地址：' />
                        <Text label={item.adr} lineHeight={30} style={{ flex: 1 }} /> */}
                    </Flex>
                </Flex>
                <Flex column flex1 >
                    <Text style={{ marginBottom: 5 }} >{item.state}</Text>
                    <Text label={item.state} />
                    <Image width={30} height={30} src={this.getImg(item.state)} />
                </Flex>
                <Flex style={{ marginLeft: 10, marginRight: 10 }}>
                    <Icon name='arrowRight' width={25} height={25} color='#808080' />
                </Flex>
            </TouchableOpacity>
        )
    }
    _renderfooter = () => {
        if (this.state.loadMore) {
            return (
                <Flex HW height={50} >
                    <Text>加载中...</Text>
                </Flex>
            )
        } else {
            return null;
        }
    }
    getImg = (state) => {
        switch (state) {
            case '设备离线':
                return require(`./img/offline.png`);
            case '熄火':
                return require(`./img/flameout.png`);
            case '拔掉OBD':
                return require(`./img/pullout.png`);
            case '启动':
                return require(`./img/qidong.png`);
            case '上线':
                return require(`./img/line.png`);
            case '接入OBD':
                return require(`./img/onOBD.png`);
            case '出围栏':
                return require(`./img/outfence.png`);
            case '入围栏':
                return require(`./img/onfence.png`);
            case '低电压':
                return require(`./img/lowvoltage.png`);
            default:
                break;
        }
    }
    getState = () => {
        let data1 = [
            {
                "3": "接入OBD",
                "4": "拔掉OBD",
                "5": "启动",
                "6": "熄火",
                "7": "VIN变化",
                "8": "上线",
                "9": "离线",
                "10": "低电压",
                "11": "车辆拖吊",
                "12": "出围栏",
                "13": "进围栏"
            }
        ]
        let dataobj = data1[0];
        let Aobj = [{ value: '0', label: '全部状态' }];
        Object.keys(dataobj).forEach((item) => {
            Aobj.push({ value: item, label: dataobj[item] })
        })
        this.setState({ staticdata: Aobj })
    }
    getData = (page = 1) => {
        let state = {};
        if (page == 1) {
            state.refreshing = true
        } else {
            state.loadMore = true
        }
        this.setState(state);
        // console.log(this.alarmTime, this.alarmType)
        getdevice(`page=${page}&rows=20&alarmTime=${this.alarmTime}&alarmType=${this.alarmType}`, (data) => {
            this.isrefreshing = true;
            this.page = page;
            let rdata = [];
            if (page > 1) {
                rdata = this.state.data;
            }
            // console.log(data)
            data.forEach((item) => {
                let rdataitem = {
                    id: item.devNo,
                    title: item.devNo,
                    date: item.alarmTime,
                    num: item.vin,
                    adr: item.addr,
                    state: item.strAlarmType,
                    name: item.fenceName,
                    vehicleNo: item.vehicleNo,
                    fenceNo: item.fenceNo,
                }
                rdata.push(rdataitem)
            })
            this.setState({ data: rdata, refreshing: false, loadMore: false });
        })
    }
    componentDidMount() {
        this.getData()
        this.getState()
    }
    // handLoadData = () => {
    //     this.getData()
    // }
}