import { Alert } from 'react-native'
import axios from 'axios';
import { Toast } from 'antd-mobile'

const BASEURL = 'http://gis.cloud.rtzltech.cn:8010/monitoringserver/';
// const BASEURL = 'http://app.test.cloud.rtzltech.cn/monitoringserver/';
// const BASEURL = 'http://192.2.4.115:8080/monitoringserver/';
function getData(url, params, callback, errorCallBack) {
    // fetch('http://gis.cloud.rtzltech.cn:8010/monitoringserver/' + url, {
    //     method: 'POST',
    //     headers: {
    //         // 'Accept': 'application/json',
    //         'X-Requested-With': 'XMLHttpRequest',
    //         'Accept': '*/*',
    //         'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    //     body:"loginname=changjiu&pwd=123334"
    //     // body: JSON.stringify({
    //     //     firstParam: 'yourValue',
    //     //     secondParam: 'yourOtherValue',
    //     // })
    // }).then((data) => {
    //     console.log('数据', data);
    //     if (data && '99' == data.retcode) {
    //         Alert(data.retmsg);
    //         // window.mui.alert(data.retmsg);
    //         // window.plus.runtime.restart();
    //         return;
    //     }
    //     callback(data);
    // }).catch((error) => {
    //     console.log(error)
    //     alert('错误')
    // });
    let instance = axios.create({
        timeout: 30000,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    });
    instance.post(BASEURL + url, params).then(({ data }) => {
        console.log('数据', data);
        if (data && '99' == data.retcode) {
            // Alert(data.retmsg);
            Toast.info(data.retmsg);
            return;
        }
        if (data && '-1' == data.retcode) {
            // Alert(data.retmsg);
            Toast.info(data.retmsg);
            return;
        }
        callback(data);
    }).catch((error) => {
        console.log(error.response)
        if (error.message == 'Network Error') {
            Toast.info('网络错误');
        } else {
            Toast.info(error.message);
        }
        if (errorCallBack) {
            errorCallBack(error);
        }
        // alert('错误')
    });
}
export function login(params, callback, errorCallBack) {
    getData('login', params, callback, errorCallBack);
}
export function getdevice(params, callback) {
    getData('track/devListPage.action', params, callback);
}
export function getfencelist(params, callback) {
    getData('fence/list.action', params, callback);
}
export function getavailablefencelist(params, callback) {
    getData('fence/availableFenceList.action', params, callback);
}
export function getpolicehistory(params, callback) {
    getData('alarm/alarmHistory.action', params, callback);
}
export function getpolicenew(params, callback) {
    getData('alarm/newestAlarmList.action', params, callback);
}
export function getpolicenewstate(params, callback) {
    getData('alarm/types.action', params, callback);
}
export function getfeedback(params, callback) {
    getData('feedback/submitFeedback.action', params, callback);
}
export function getbind(params, callback) {
    getData('fence/bind.action', params, callback);
}
export function getunbind(params, callback) {
    getData('fence/unbind.action', params, callback);
}
/**
 * 
 * @param {String} devNo 设备号
 * @param {Function} callback 回调函数
 */
export function getrealTimeTrack(devNo, callback) {
    getData('track/realTimeTrack.action', 'devNo=' + devNo, callback);
}

/**
 * 
 * @param {String} fenceNo 围栏名
 * @param {Function} callback 回调函数
 */
export function getfenceTimeTrack(fenceNo, callback) {
    getData('fence/showFence.action', 'fenceNo=' + fenceNo, callback);
}

/**
 * WebView通用获取数据
 * @param {String} url 接口路径
 * @param {String} param 参数格式{a:1,b:2},会自动转换为a=1&b=2
 * @param {Function} callback 
 */
export function getWebViewData(url, params, callback) {
    function toParams(paramsData) {
        let ret = '';
        for (const key in paramsData) {
            if (paramsData.hasOwnProperty(key)) {
                const element = paramsData[key];
                ret += (key + '=' + element + '&');
            }
        }
        return ret.substr(0, ret.length - 1);
    }
    getData(url, toParams(params), callback);
}