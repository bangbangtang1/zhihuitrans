import React from 'react';
import { StyleSheet, View, Button, TextInput, PixelRatio, TouchableOpacity, Platform, StatusBar, Dimensions, FlatList } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { Flex, Icon, Image, Placeholder, Text, Page } from '../components';
import { login } from './services';

export class AboutScreen extends React.Component {
    static navigationOptions = {

    };
    constructor(props) {
        super(props)
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <Page title='关于我们'>
                <View style={{ height: '100%', backgroundColor: '#faf8f9' }}>
                    {/* 状态栏 */}
                    <StatusBar backgroundColor={'#3285ff'} translucent={true} barStyle='light-content' />
                    <Flex style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 15, paddingRight: 15 }}>
                        <Text
                            label='北京融通智联科技有限公司是掌讯集团旗下，专注于移动互联和物联网技术应用及解决方案提供的高科技公司。 公司成立于2004年，主要从事物联网信息技术与RFID无线射频技术的研究、移动互联网技术与车联网技术相结合软硬件产品的研发、生产与服务，是一家具有多项自主知识产权和专利的、管理结构现代化的、有明确的市场定位与发展战略的北京市高新技术企业，是专注于移动互联和物联网技术应用及解决方案提供的高科技公司。公司通过和全球知名物联网技术、产品及解决方案提供商建立顶层合作，为中国市场的用户提供从专项到整体的物联网解决方案及产品服务。'
                            lineHeight={30} fontSize={16}
                            style={{ lineHeight: 30 }}
                        />
                    </Flex>
                </View>
            </Page>
        )
    }

}
