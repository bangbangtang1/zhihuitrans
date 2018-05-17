import React from 'react';
import { StyleSheet, View, Button, Text, TextInput, PixelRatio, TouchableOpacity, Platform, StatusBar, Dimensions, FlatList } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { Flex, Icon, Image, Placeholder, Page } from '../components';
import { login, getavailablefencelist } from './services';

export class FenceAvailableListScreen extends React.Component {
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
            <Page title='可选围栏列表' >
                <View style={{ height: '100%', backgroundColor: '#faf8f9' }}>
                    {/* 状态栏 */}
                    <StatusBar backgroundColor={'#3285ff'} translucent={true} barStyle='light-content' />                
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
            </Page>
        )
    }
    _keyExtractor = (item, index) => item.fenceNo;
    _renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                const { navigate, state, goBack } = this.props.navigation;
                state.params.bindfence(item.title, item.fenceNo);
                goBack()
            }}
            style={{ height: 42, borderBottomWidth: 1, borderBottomColor: '#d1d1d1', flexDirection: 'row', alignItems: 'center', overflow: 'hidden' }}>
            <Text style={{ flex: 1 }}  numberOfLines={1} >{item.title}</Text>
        </TouchableOpacity>
    );
    _renderFooter = () => {
        if (this.state.loadMore) {
            return (<Flex HW ></Flex>)
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
        getavailablefencelist(`page=${page}&rows=20`, (data) => {
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
}
