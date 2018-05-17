import React from 'react';
import { StyleSheet, View, Button, Text, TextInput, PixelRatio, TouchableOpacity, Platform, StatusBar, Dimensions, FlatList, Animated, Easing, ScrollView } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { Flex, Icon, Image, Placeholder, Page } from '../components';
import { login, getpolicehistory } from './services';


export class PoliceHistoryScreen extends React.Component {
    static navigationOptions = {

    };
    constructor(props) {
        super(props)
        this.page = 1;
        this.state = {
            data: [],
            refreshing: true,
            loadMore: false
        }
    }
    render() {
        const { navigate, state } = this.props.navigation;
        return (
            <Page title={`设备号：${state.params.title}`} >
                <View style={{ height: '100%', backgroundColor: '#faf8f9' }}>
                    {/* 状态栏 */}
                    <StatusBar backgroundColor={'#3285ff'} translucent={true} barStyle='light-content' />
                    <Flex column style={{ paddingLeft: 15, backgroundColor: '#fff' }}>
                        <FlatList
                            data={this.state.data}
                            renderItem={this._renderItem}
                            refreshing={this.state.refreshing}
                            onRefresh={this.getData}
                            onEndReached={() => { this.getData(this.page + 1) }}
                            onEndReachedThreshold={0.1}
                            ListFooterComponent={this._renderfooter}
                        />
                    </Flex>
                </View>
            </Page>
        )
    }
    //渲染列表函数
    _renderItem = ({ item }) => {
        const { navigate } = this.props.navigation;
        let baojingstate;
        if (item.con.indexOf('离线') > -1) {
            baojingstate = <Text style={{ color: 'red' }} >离线</Text>
            // <Text label='离线' color='red' />
        } else {
            baojingstate = <Text>{item.con}</Text>
            // <Text label={item.con} />
        }
        return (
            <Flex column style={{ borderBottomWidth: 1, borderBottomColor: '#d1d1d1', paddingTop: 15, paddingBottom: 5 }}>
                <Flex vertical style={{ marginBottom: 8 }}>
                    <Text style={{ fontSize: 14 }} >报警时间：</Text>
                    <Text style={{ fontSize: 14 }} >{item.date}</Text>
                </Flex>
                <Flex vertical style={{ marginBottom: 8 }}>
                    <Text style={{ fontSize: 14 }} >车架号：</Text>
                    <Text style={{ fontSize: 14 }} >{item.num}</Text>
                </Flex>
                <Flex vertical style={{ marginBottom: 8 }}>
                    <Text style={{ fontSize: 14 }} >报警状态：</Text>
                    {baojingstate}
                </Flex>
            </Flex>
        )
    }
    //渲染尾部加载中
    _renderfooter = () => {
        if (this.state.loadMore) {
            return (<Flex HW height={50} ><Text label='加载中...' /></Flex>)
        } else {
            return null
        }
    }
    // 获取数据 默认第一个页面
    getData = (page = 1) => {
        // 当在第一个页面时，上拉加载，否则是下拉刷新
        let state = {}
        if (page == 1) {
            state.refreshing = true;
        } else {
            state.loadMore = true
        }
        this.setState(state);
        // 获取相关数据函数getpolice(params, callback)
        getpolicehistory(`page=${page}&rows=20&devNo=${this.props.navigation.state.params.title}`, (data) => {
            console.log(data)
            // 获取当前在第几个页面
            this.page = page;
            let rdata = [];
            // 判断页面大于1的时候，数据是当前状态的数据
            if (page > 1) {
                rdata = this.state.data;
            }
            // 接受数据并将数据初始化
            data.forEach((item) => {
                let rdataitem = {
                    id: item.devNo,
                    date: item.alarmTime,
                    num: item.vin,
                    con: item.strAlarmType
                }
                rdata.push(rdataitem);
            });
            this.setState({ data: rdata, refreshing: false, loadMore: false })
        })
    }

    componentDidMount() {
        this.getData()
    }
}