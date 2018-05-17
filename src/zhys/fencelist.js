import React from 'react';
import { StyleSheet, View, Button, Text, TextInput, PixelRatio, TouchableOpacity, Platform, StatusBar, Dimensions, FlatList } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { Flex, Icon, Image, Placeholder, Page } from '../components';
import { login, getfencelist, getfenceTimeTrack } from './services';

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
export class FenceListScreen extends React.Component {
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
        const { navigate } = this.props.navigation;
        return (
            <View style={{ height: '100%', width: '100%', paddingBottom:34, backgroundColor:'#fff' }} >
                {/* 状态栏 */}
                <StatusBar backgroundColor={'#3285ff'} translucent={true} barStyle='light-content' />
                <View style={{ height:(isIphoneX())?44: 20, backgroundColor: '#3285ff' }}></View>
                <View style={{height: 45, backgroundColor:'#3285ff'}}>
                    <View style={{ position: 'absolute', left: 0, top: 0, zIndex: 10, flexDirection:'row'}}>
                        <TouchableOpacity onPress={() => {
                            const { navigate, goBack } = this.props.navigation;
                            goBack();
                        }} style={{ paddingLeft: 15, paddingRight: 15, height: 44, justifyContent: 'center' }} >
                            <View>
                                <Icon name='arrowLeft' color='#fff' height={24} width={24} />
                            </View>
                        </TouchableOpacity>
                        <View style={{flex:1}} />
                        <Flex style={{ height: '100%' }} HW>
                            <Text style={{ color: '#fff', fontSize: 18 }} >添加围栏</Text>
                        </Flex>
                        <View style={{flex:1}} />
                        <TouchableOpacity onPress={() => {
                            const { navigate, goBack } = this.props.navigation; 
                            navigate('FenceAdd') }}
                            style={{ marginRight: 10 }}>
                            <Image src={require('./img/addfence.png')} width={44} height={44} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ height: '100%', backgroundColor: '#faf8f9'}}>
                    <Flex flex1 style={{ paddingLeft: 15 }} column>
                        <FlatList
                            data={this.state.data}
                            renderItem={this._renderItem}
                            // keyExtractor={this._keyExtractor}
                            refreshing={this.state.refreshing}
                            onRefresh={this.handLoadData}
                            onEndReached={() => { console.log('onEndReached'); this.getData(this.page + 1) }}
                            onEndReachedThreshold={0.1}
                            ListFooterComponent={this._renderFooter}
                        />
                    </Flex>
                </View>
            </View>
        )
    }
    _keyExtractor = (item, index) => item.fenceNo;
    _renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                const { navigate, state } = this.props.navigation;
                navigate('FenceDetail', item)
                // navigate('FenceDetail', item)
            }}
            style={{ height: 42, borderBottomWidth: 1, borderBottomColor: '#d1d1d1', flexDirection: 'row', alignItems: 'center', overflow: 'hidden' }}>
            <Text style={{flex:1}} numberOfLines={1} >{item.title}</Text>
            <View style={{marginRight:5}} >
                <Icon name='arrowRight' height={20} width={20} color='#c1c1c1' />
            </View>
        </TouchableOpacity>
    );
    _renderFooter = () => {
        if (this.state.loadMore) {
            return (<Flex HW ><Text style={{lineHeight:50}}>加载中...</Text></Flex>)
        } else {
            return null;
        }
    }
    componentDidMount() {
        this.getData();
    }
    getData(page = 1) {
        let state = {}
        if (page == 1) {
            state.refreshing = true;
        } else {
            state.loadMore = true;
        }
        this.setState(state);
        getfencelist(`page=${page}&rows=20`, (data) => {
            this.page = page;
            let rdata = [];
            if (page > 1) {
                rdata = this.state.data;
            }
            data.forEach((item) => {
                let rdataitem = {
                    title: item.name,
                    fenceNo: item.fenceNo
                }
                rdata.push(rdataitem);
            });
            this.setState({ refreshing: false, data: rdata, loadMore: false });
        })
    }
    handLoadData = () => {
        this.getData();
    }
    handleLogin = () => {

    }

}
