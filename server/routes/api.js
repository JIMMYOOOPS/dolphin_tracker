const express = require('express');
const path = require('path')
require('dotenv').config({path:__dirname+'/../../.env'});
const Data = require('../models/sightdata_model');
const { API_VERSION } = process.env 
const _ = require('lodash');
const xlsx = require('node-xlsx');
const fs = require('fs')

const api = express.Router();

const {
    trackerRouter
} = require('./tracker_router')
const {
    speciesRouter
} = require('./species_router')
const {
    getDataAllRouter,
    getDataMapRouter,
    getDataDolphinRouter,
    getDownloadExcelRouter
} = require('./sightdata_router')
const {
    createDataRouter,
    dataBasePageRouter,
    webConsoleRouter,
    webConsolePageRouter,
    userSignupRouter,
    userLoginRouter,
    usersPageRouter
} = require('./console_router');

api.use(`/api/${API_VERSION}/data`,  getDataAllRouter, getDataMapRouter, getDataDolphinRouter, getDownloadExcelRouter)
api.use(`/api/${API_VERSION}/tracker`, trackerRouter)
api.use(`/api/${API_VERSION}/species`, speciesRouter)

api.use('/admin/console', createDataRouter, dataBasePageRouter, webConsoleRouter, webConsolePageRouter, userSignupRouter, userLoginRouter, usersPageRouter);

api.get('/test', async (req, res) => {
        try {
            const columnName = [
                "航次編號",  
                "年", 
                "月", 
                "日", 
                "上午/下午", 
                "出港時間", 
                "進港時間", 
                "船隻大小", 
                "GPS編號", 
                "看到鯨豚", 
                "解說員", 
                "攝影者", 
                "特殊觀察與記錄", 
                "目擊記錄編號",
                "鯨豚群次", 
                "鯨豚種數", 
                "天氣", 
                "風向", 
                "浪況", 
                "海流", 
                "發現方式",
                "線索背鰭", 
                "線索噴氣", 
                "線索水花", 
                "線索展示",
                "靠近時間", 
                "靠近時GPS編號", 
                "離開時間", 
                "離開時GPS編號", 
                "離開方式", 
                "鯨豚緯度", 
                "鯨豚緯分", 
                "鯨豚緯秒", 
                "鯨豚經度", 
                "鯨豚經分", 
                "鯨豚經秒", 
                "船隻編號",
                "鯨豚種類", 
                "鯨豚確認", 
                "母子對", 
                "母子對數", 
                "群量至少", 
                "群量可能", 
                "群量最多",
                "混群", 
                "混群種類", 
                "船隻互動 一", 
                "最近距離 一", 
                "群體一般 一", 
                "群體零散 一", 
                "群體緊密 一", 
                "行進中慢 一", 
                "行進中平 一", 
                "行進中急 一", 
                "休息 一", 
                "兜圈 一", 
                "拍打水面 一", 
                "浮窺 一", 
                "飆船 一", 
                "空中展示 一", 
                "人為衝浪 一", 
                "自然衝浪 一", 
                "可能覓食 一", 
                "確定覓食 一", 
                "舉尾 一", 
                "交配 一", 
                "身體觸碰 一", 
                "仰泳 一", 
                "船數量 一", 
                "補充說明 一",
                "船隻互動 二", 
                "最近距離 二", 
                "群體二般 二", 
                "群體零散 二", 
                "群體緊密 二", 
                "行進中慢 二", 
                "行進中平 二", 
                "行進中急 二", 
                "休息 二", 
                "兜圈 二", 
                "拍打水面 二", 
                "浮窺 二", 
                "飆船 二", 
                "空中展示 二", 
                "人為衝浪 二", 
                "自然衝浪 二", 
                "可能覓食 二", 
                "確定覓食 二", 
                "舉尾 二", 
                "交配 二", 
                "身體觸碰 二", 
                "仰泳 二", 
                "船數量 二", 
                "補充說明 二",
                "船隻互動 三", 
                "最近距離 三", 
                "群體三般 三", 
                "群體零散 三", 
                "群體緊密 三", 
                "行進中慢 三", 
                "行進中平 三", 
                "行進中急 三", 
                "休息 三", 
                "兜圈 三", 
                "拍打水面 三", 
                "浮窺 三", 
                "飆船 三", 
                "空中展示 三", 
                "人為衝浪 三", 
                "自然衝浪 三", 
                "可能覓食 三", 
                "確定覓食 三", 
                "舉尾 三", 
                "交配 三", 
                "身體觸碰 三", 
                "仰泳 三", 
                "船數量 三", 
                "補充說明 三"
            ];
            const data = await Data.getDownloadExcel();
            let dataAll = {};
            dataResult = []
            for(i=0; i<data.all.length; i++) {
                dataAll = {
                    sailing_id: data.all[i].sailing_id,
                    year: data.all[i].year,
                    month: data.all[i].month,
                    day: data.all[i].day,
                    period: data.all[i].period,
                    departure: data.all[i].departure,
                    arrival: data.all[i].arrival,
                    boat_size: data.all[i].boat_size,
                    gps_no: data.all[i].gps_no,
                    sighting: data.all[i].sighting,
                    guide: data.all[i].guide,
                    recorder: data.all[i].recorder,
                    observatios: data.all[i].observatios,
                    sighting_id: data.all[i].sighting_id,
                    dolphin_group_no: data.all[i].dolphin_group_no,
                    dolphin_type_no: data.all[i].dolphin_type_no,
                    weather: data.all[i].weather,
                    wind_direction: data.all[i].wind_direction,
                    wave_condition: data.all[i].wave_condition,
                    current: data.all[i].current,
                    sighting_method: data.all[i].sighting_method,
                    dorsal_fin: data.all[i].dorsal_fin,
                    exhalation: data.all[i].exhalation,
                    splash: data.all[i].splash,
                    exhibition: data.all[i].exhibition,
                    approach_time: data.all[i].approach_time,
                    approach_gps_no: data.all[i].approach_gps_no,
                    leaving_time: data.all[i].leaving_time,
                    leaving_gps_no: data.all[i].leaving_gps_no,
                    leaving_method: data.all[i].leaving_method,
                    latitude: data.all[i].latitude,
                    latitude_min: data.all[i].latitude_min,
                    latitude_sec: data.all[i].latitude_sec,
                    longitude: data.all[i].longitude,
                    longitude_min: data.all[i].longitude_min,
                    longitude_sec: data.all[i].longitude_sec,
                    boat_number: data.all[i].boat_number,
                    dolphin_type: data.all[i].dolphin_type,
                    type_confirmation: data.all[i].type_confirmation,
                    mother_child: data.all[i].mother_child,
                    mother_child_no: data.all[i].mother_child_no,
                    group_size_lowest: data.all[i].group_size_lowest,
                    group_size_probable: data.all[i].group_size_probable,
                    group_size_highest: data.all[i].group_size_highest,
                    mix: data.all[i].mix,
                    mix_type: data.all[i].mix_type 
                }
                dataResult.push(dataAll)
            }
            let obvInteraction10 = data.obvInteraction10;
            let obvInteraction20 = data.obvInteraction20;
            let obvInteraction30 = data.obvInteraction30;
            let dataArray = [];
            let obvInteraction10Array = [];
            let obvInteraction20Array = [];
            let obvInteraction30Array = []; 
            dataResult.forEach(ele => {
                dataArray.push(Object.values(ele))   
            });
            obvInteraction10.forEach(ele => {
                delete ele.obv_id
                obvInteraction10Array.push(Object.values(ele))
            });
            obvInteraction20.forEach(ele => {
                delete ele.obv_id
                obvInteraction20Array.push(Object.values(ele))   
            });
            obvInteraction30.forEach(ele => {
                delete ele.obv_id
                obvInteraction30Array.push(Object.values(ele))   
            });
            let result = [];
            for (i = 0; i < dataArray.length; i++) {
                result.push(dataArray[i].concat(obvInteraction10Array[i], obvInteraction20Array[i], obvInteraction30Array[i]))
            }
            result.unshift(columnName);

            let currentDate = new Date().toISOString().split('T')[0];
            let buffer = xlsx.build([{name: `${currentDate}_dolphin_sighting`, data: result}]);
            let downloadDir = path.resolve(__dirname, '../../', 'public', 'downloadfile');
            let dir = downloadDir+ '/' + currentDate + '鯨豚目擊紀錄.xlsx';
            fs.writeFileSync(dir, buffer);
            res.status(200).json(dir);            
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: console.error()
            })
        }

        // return dir;
    }
)

module.exports = api;