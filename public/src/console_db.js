(async () => {
    try {
        let url =`${window.location.origin}/api/1.0/data/database`
        let options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
            },
        }
        async function getData(url, options) {
            let data;
            try {
                let rawData = await fetch(url, options);
                data = await rawData.json();
                return data;
            } catch (err) {
                console.log(err.message);
            }
            };
        result = await getData(url, options);
        let databaseData = result['data'];
        let databaseData2 = result['obvInteraction20mins'];
        let databaseData3 = result['obvInteraction30mins'];
        function createTableRow(numInfos, pageSize) {
            for (i= numInfos; i < numInfos -1 + pageSize; i++) {            
            let dataRow = '<tr>' +
                `<td data-label=id-${i} id=id-${i}>${databaseData[i].id}</td>` +
                `<td data-label=sailing_id-${i} id=sailing_id-${i} contenteditable="true">${databaseData[i].sailing_id}</td>` +
                `<td data-label=sighting_id-${i} id=sighting_id-${i} contenteditable="true">${databaseData[i].sighting_id}</td>` +
                `<td data-label=mix-${i} id=mix-${i} contenteditable="true">${databaseData[i].mix}</td>` +
                `<td data-label=dolphin_type-${i} id=dolphin_type-${i} contenteditable="true">${databaseData[i].dolphin_type}</td>` +
                `<td data-label=year-${i} id=year-${i} contenteditable="true">${databaseData[i].year}</td>` +
                `<td data-label=month-${i} id=month-${i} contenteditable="true">${databaseData[i].month}</td>` +
                `<td data-label=day-${i} id=day-${i} contenteditable="true">${databaseData[i].day}</td>` +
                `<td data-label=period-${i} id=period-${i} contenteditable="true">${databaseData[i].period}</td>` +
                `<td data-label=departure-${i} id=departure-${i} contenteditable="true">${databaseData[i].departure}</td>` +
                `<td data-label=arrival-${i} id=arrival-${i} contenteditable="true">${databaseData[i].arrival}</td>` +
                `<td data-label=boat_size-${i} id=boat_size-${i} contenteditable="true">${databaseData[i].boat_size}</td>` +
                `<td data-label=sighting-${i} id=sighting-${i} contenteditable="true">${databaseData[i].sighting}</td>` +
                `<td data-label=gps_no-${i} id=gps_no-${i} contenteditable="true">${databaseData[i].gps_no}</td>` +
                `<td data-label=guide-${i} id=guide-${i} contenteditable="true">${databaseData[i].guide}</td>` +
                `<td data-label=recorder-${i} id=recorder-${i} contenteditable="true">${databaseData[i].recorder}</td>` +
                `<td data-label=observations-${i} id=observations-${i} contenteditable="true">${databaseData[i].observations}</td>` +
                `<td data-label=weather-${i} id=weather-${i} contenteditable="true">${databaseData[i].weather}</td>` +
                `<td data-label=wind_direction-${i} id=wind_direction-${i} contenteditable="true">${databaseData[i].wind_direction}</td>` +
                `<td data-label=wave_condition-${i} id=wave_condition-${i} contenteditable="true">${databaseData[i].wave_condition}</td>` +
                `<td data-label=current-${i} id=current-${i} contenteditable="true">${databaseData[i].current}</td>` +
                `<td data-label=latitude-${i} id=latitude-${i} contenteditable="true">${databaseData[i].latitude}</td>` +
                `<td data-label=latitude_min-${i} id=latitude_min-${i} contenteditable="true">${databaseData[i].latitude_min}</td>` +
                `<td data-label=latitude_sec-${i} id=latitude_sec-${i} contenteditable="true">${databaseData[i].latitude_sec}</td>` +
                `<td data-label=longitude-${i} id=longitude-${i} contenteditable="true">${databaseData[i].longitude}</td>` +
                `<td data-label=longitude_min-${i} id=longitude_min-${i} contenteditable="true">${databaseData[i].longitude_min}</td>` +
                `<td data-label=longitude_sec-${i} id=longitude_sec-${i} contenteditable="true">${databaseData[i].longitude_sec}</td>` +
                `<td data-label=approach_time-${i} id=approach_time-${i} contenteditable="true">${databaseData[i].approach_time}</td>` +
                `<td data-label=approach_gps_no-${i} id=approach_gps_no-${i} contenteditable="true">${databaseData[i].approach_gps_no}</td>` +
                `<td data-label=leaving_time-${i} id=leaving_time-${i} contenteditable="true">${databaseData[i].leaving_time}</td>` +
                `<td data-label=leaving_gps_no-${i} id=leaving_gps_no-${i} contenteditable="true">${databaseData[i].leaving_gps_no}</td>` +
                `<td data-label=leaving_method-${i} id=leaving_method-${i} contenteditable="true">${databaseData[i].leaving_method}</td>` +
                `<td data-label=sighting_method-${i} id=sighting_method-${i} contenteditable="true">${databaseData[i].sighting_method}</td>` +
                `<td data-label=type_confirmation-${i} id=type_confirmation-${i} contenteditable="true">${databaseData[i].type_confirmation}</td>` +
                `<td data-label=dolphin_group_no-${i} id=dolphin_group_no-${i} contenteditable="true">${databaseData[i].dolphin_group_no}</td>` +
                `<td data-label=dolphin_type_no-${i} id=dolphin_type_no-${i} contenteditable="true">${databaseData[i].dolphin_type_no}</td>` +
                `<td data-label=dorsal_fin-${i} id=dorsal_fin-${i} contenteditable="true">${databaseData[i].dorsal_fin}</td>` +
                `<td data-label=exhalation-${i} id=exhalation-${i} contenteditable="true">${databaseData[i].exhalation}</td>` +
                `<td data-label=splash-${i} id=splash-${i} contenteditable="true">${databaseData[i].splash}</td>` +
                `<td data-label=exhibition-${i} id=exhibition-${i} contenteditable="true">${databaseData[i].exhibition}</td>` +
                `<td data-label=mother_child-${i} id=mother_child-${i} contenteditable="true">${databaseData[i].mother_child}</td>` +
                `<td data-label=mother_child_no-${i} id=mother_child_no-${i} contenteditable="true">${databaseData[i].mother_child_no}</td>` +
                `<td data-label=group_size_lowest-${i} id=group_size_lowest-${i} contenteditable="true">${databaseData[i].group_size_lowest}</td>` +
                `<td data-label=group_size_probable-${i} id=group_size_probable-${i} contenteditable="true">${databaseData[i].group_size_probable}</td>` +
                `<td data-label=group_size_highest-${i} id=group_size_highest-${i} contenteditable="true">${databaseData[i].group_size_highest}</td>` +
                `<td data-label=mix-${i} id=mix-${i} contenteditable="true">${databaseData[i].mix}</td>` +
                `<td data-label=time1-${i} id=time1-${i} contenteditable="true">${databaseData[i].time}</td>` +
                `<td data-label=boat_interaction1-${i} id=boat_interaction1-${i} contenteditable="true">${databaseData[i].boat_interaction}</td>` +
                `<td data-label=boat_distance1-${i} id=boat_distance1-${i} contenteditable="true">${databaseData[i].boat_distance}</td>` +
                `<td data-label=group_closeness_normal1-${i} id=group_closeness_normal1-${i} contenteditable="true">${databaseData[i].group_closeness_normal}</td>` +
                `<td data-label=group_closeness_spreaded1-${i} id=group_closeness_spreaded1-${i} contenteditable="true">${databaseData[i].group_closeness_spreaded}</td>` +
                `<td data-label=group_closeness_close1-${i} id=group_closeness_close1-${i} contenteditable="true">${databaseData[i].group_closeness_close}</td>` +
                `<td data-label=speed_slow1-${i} id=speed_slow1-${i} contenteditable="true">${databaseData[i].speed_slow}</td>` +
                `<td data-label=speed_moderate1-${i} id=speed_moderate1-${i} contenteditable="true">${databaseData[i].speed_moderate}</td>` +
                `<td data-label=speed_fast1-${i} id=speed_fast1-${i} contenteditable="true">${databaseData[i].speed_fast}</td>` +
                `<td data-label=speed_resting1-${i} id=speed_resting1-${i} contenteditable="true">${databaseData[i].speed_resting}</td>` +
                `<td data-label=speed_circling1-${i} id=speed_circling1-${i} contenteditable="true">${databaseData[i].speed_circling}</td>` +
                `<td data-label=foraging_maybe1-${i} id=foraging_maybe1-${i} contenteditable="true">${databaseData[i].foraging_maybe}</td>` +
                `<td data-label=foraging_sure1-${i} id=foraging_sure1-${i} contenteditable="true">${databaseData[i].foraging_sure}</td>` +
                `<td data-label=mating1-${i} id=mating1-${i} contenteditable="true">${databaseData[i].mating}</td>` +
                `<td data-label=splash_interaction1-${i} id=splash_interaction1-${i} contenteditable="true">${databaseData[i].splash_interaction}</td>` +
                `<td data-label=snorkel1-${i} id=snorkel1-${i} contenteditable="true">${databaseData[i].snorkel}</td>` +
                `<td data-label=racing1-${i} id=racing1-${i} contenteditable="true">${databaseData[i].racing}</td>` +
                `<td data-label=jump1-${i} id=jump1-${i} contenteditable="true">${databaseData[i].jump}</td>` +
                `<td data-label=surfing_artificial1-${i} id=surfing_artificial1-${i} contenteditable="true">${databaseData[i].surfing_artificial}</td>` +
                `<td data-label=surfing1-${i} id=surfing1-${i} contenteditable="true">${databaseData[i].surfing}</td>` +
                `<td data-label=tail_lift1-${i} id=tail_lift1-${i} contenteditable="true">${databaseData[i].tail_lift}</td>` +
                `<td data-label=contact1-${i} id=contact1-${i} contenteditable="true">${databaseData[i].contact}</td>` +
                `<td data-label=backstroke1-${i} id=backstroke1-${i} contenteditable="true">${databaseData[i].backstroke}</td>` +
                `<td data-label=boat_no1-${i} id=boat_no1-${i} contenteditable="true">${databaseData[i].boat_no}</td>` +
                `<td data-label=other1-${i} id=other1-${i} contenteditable="true">${databaseData[i].other}</td>` +
                `<td data-label=time2-${i} id=time2-${i} contenteditable="true">${databaseData2[i].time}</td>` +
                `<td data-label=boat_interaction2-${i} id=boat_interaction2-${i} contenteditable="true">${databaseData2[i].boat_interaction}</td>` +
                `<td data-label=boat_distance2-${i} id=boat_distance2-${i} contenteditable="true">${databaseData2[i].boat_distance}</td>` +
                `<td data-label=group_closeness_normal2-${i} id=group_closeness_normal2-${i} contenteditable="true">${databaseData2[i].group_closeness_normal}</td>` +
                `<td data-label=group_closeness_spreaded2-${i} id=group_closeness_spreaded2-${i} contenteditable="true">${databaseData2[i].group_closeness_spreaded}</td>` +
                `<td data-label=group_closeness_close2-${i} id=group_closeness_close2-${i} contenteditable="true">${databaseData2[i].group_closeness_close}</td>` +
                `<td data-label=speed_slow2-${i} id=speed_slow2-${i} contenteditable="true">${databaseData2[i].speed_slow}</td>` +
                `<td data-label=speed_moderate2-${i} id=speed_moderate2-${i} contenteditable="true">${databaseData2[i].speed_moderate}</td>` +
                `<td data-label=speed_fast2-${i} id=speed_fast2-${i} contenteditable="true">${databaseData2[i].speed_fast}</td>` +
                `<td data-label=speed_resting2-${i} id=speed_resting2-${i} contenteditable="true">${databaseData2[i].speed_resting}</td>` +
                `<td data-label=speed_circling2-${i} id=speed_circling2-${i} contenteditable="true">${databaseData2[i].speed_circling}</td>` +
                `<td data-label=foraging_maybe2-${i} id=foraging_maybe2-${i} contenteditable="true">${databaseData2[i].foraging_maybe}</td>` +
                `<td data-label=foraging_sure2-${i} id=foraging_sure2-${i} contenteditable="true">${databaseData2[i].foraging_sure}</td>` +
                `<td data-label=mating2-${i} id=mating2-${i} contenteditable="true">${databaseData2[i].mating}</td>` +
                `<td data-label=splash_interaction2-${i} id=splash_interaction2-${i} contenteditable="true">${databaseData2[i].splash_interaction}</td>` +
                `<td data-label=snorkel2-${i} id=snorkel2-${i} contenteditable="true">${databaseData2[i].snorkel}</td>` +
                `<td data-label=racing2-${i} id=racing2-${i} contenteditable="true">${databaseData2[i].racing}</td>` +
                `<td data-label=jump2-${i} id=jump2-${i} contenteditable="true">${databaseData2[i].jump}</td>` +
                `<td data-label=surfing_artificial2-${i} id=surfing_artificial2-${i} contenteditable="true">${databaseData2[i].surfing_artificial}</td>` +
                `<td data-label=surfing2-${i} id=surfing2-${i} contenteditable="true">${databaseData2[i].surfing}</td>` +
                `<td data-label=tail_lift2-${i} id=tail_lift2-${i} contenteditable="true">${databaseData2[i].tail_lift}</td>` +
                `<td data-label=contact2-${i} id=contact2-${i} contenteditable="true">${databaseData2[i].contact}</td>` +
                `<td data-label=backstroke2-${i} id=backstroke2-${i} contenteditable="true">${databaseData2[i].backstroke}</td>` +
                `<td data-label=boat_no2-${i} id=boat_no2-${i} contenteditable="true">${databaseData2[i].boat_no}</td>` +
                `<td data-label=other2-${i} id=other2-${i} contenteditable="true">${databaseData2[i].other}</td>` +
                `<td data-label=time3-${i} id=time3-${i} contenteditable="true">${databaseData3[i].time}</td>` +
                `<td data-label=boat_interaction3-${i} id=boat_interaction3-${i} contenteditable="true">${databaseData3[i].boat_interaction}</td>` +
                `<td data-label=boat_distance3-${i} id=boat_distance3-${i} contenteditable="true">${databaseData3[i].boat_distance}</td>` +
                `<td data-label=group_closeness_normal3-${i} id=group_closeness_normal3-${i} contenteditable="true">${databaseData3[i].group_closeness_normal}</td>` +
                `<td data-label=group_closeness_spreaded3-${i} id=group_closeness_spreaded3-${i} contenteditable="true">${databaseData3[i].group_closeness_spreaded}</td>` +
                `<td data-label=group_closeness_close3-${i} id=group_closeness_close3-${i} contenteditable="true">${databaseData3[i].group_closeness_close}</td>` +
                `<td data-label=speed_slow3-${i} id=speed_slow3-${i} contenteditable="true">${databaseData3[i].speed_slow}</td>` +
                `<td data-label=speed_moderate3-${i} id=speed_moderate3-${i} contenteditable="true">${databaseData3[i].speed_moderate}</td>` +
                `<td data-label=speed_fast3-${i} id=speed_fast3-${i} contenteditable="true">${databaseData3[i].speed_fast}</td>` +
                `<td data-label=speed_resting3-${i} id=speed_resting3-${i} contenteditable="true">${databaseData3[i].speed_resting}</td>` +
                `<td data-label=speed_circling3-${i} id=speed_circling3-${i} contenteditable="true">${databaseData3[i].speed_circling}</td>` +
                `<td data-label=foraging_maybe3-${i} id=foraging_maybe3-${i} contenteditable="true">${databaseData3[i].foraging_maybe}</td>` +
                `<td data-label=foraging_sure3-${i} id=foraging_sure3-${i} contenteditable="true">${databaseData3[i].foraging_sure}</td>` +
                `<td data-label=mating3-${i} id=mating3-${i} contenteditable="true">${databaseData3[i].mating}</td>` +
                `<td data-label=splash_interaction3-${i} id=splash_interaction3-${i} contenteditable="true">${databaseData3[i].splash_interaction}</td>` +
                `<td data-label=snorkel3-${i} id=snorkel3-${i} contenteditable="true">${databaseData3[i].snorkel}</td>` +
                `<td data-label=racing3-${i} id=racing3-${i} contenteditable="true">${databaseData3[i].racing}</td>` +
                `<td data-label=jump3-${i} id=jump3-${i} contenteditable="true">${databaseData3[i].jump}</td>` +
                `<td data-label=surfing_artificial3-${i} id=surfing_artificial3-${i} contenteditable="true">${databaseData3[i].surfing_artificial}</td>` +
                `<td data-label=surfing3-${i} id=surfing3-${i} contenteditable="true">${databaseData3[i].surfing}</td>` +
                `<td data-label=tail_lift3-${i} id=tail_lift3-${i} contenteditable="true">${databaseData3[i].tail_lift}</td>` +
                `<td data-label=contact3-${i} id=contact3-${i} contenteditable="true">${databaseData3[i].contact}</td>` +
                `<td data-label=backstroke3-${i} id=backstroke3-${i} contenteditable="true">${databaseData3[i].backstroke}</td>` +
                `<td data-label=boat_no3-${i} id=boat_no3-${i} contenteditable="true">${databaseData3[i].boat_no}</td>` +
                `<td data-label=other3-${i} id=other3-${i} contenteditable="true">${databaseData3[i].other}</td>`
                '</tr>';
                $('thead').append(dataRow);
            }
        }
        pageNum = result.next_paging -1
        pageSize = 10
        let numInfos = pageNum * pageSize
        createTableRow(numInfos, pageSize);
    } catch (err) {
        console.log(err);
    }
})()

async function updateSubmit() {
    try{
        pageSize = 10
        let id =[];
        let sailing_id = [];
        let sighting_id = [];
        let mix = [];
        let dolphin_type = [];
        let year = [];
        let month = [];
        let day = [];
        let period = [];
        let departure = [];
        let arrival = [];
        let boat_size = [];
        let sighting = [];
        let gps_no = [];
        let guide = [];
        let recorder = [];
        let observations = [];
        let weather = [];
        let wind_direction = [];
        let wave_condition = [];
        let current = [];
        let latitude = [];
        let latitude_min = [];
        let latitude_sec = [];
        let longitude = [];
        let longitude_min = [];
        let longitude_sec = [];
        let approach_time = [];
        let approach_gps_no = [];
        let leaving_time = [];
        let leaving_gps_no = [];
        let leaving_method = [];
        let sighting_method = [];
        let type_confirmation = [];
        let dolphin_group_no = [];
        let dolphin_type_no = [];
        let dorsal_fin = [];
        let exhalation = [];
        let splash = [];
        let exhibition = [];
        let mother_child = [];
        let mother_child_no = [];
        let group_size_lowest = [];
        let group_size_probable = [];
        let group_size_highest = [];
        let mix_type = [];
        let time1 = [];
        let boat_interaction1 = [];
        let boat_distance1 = [];
        let group_closeness_normal1 = [];
        let group_closeness_spreaded1 = [];
        let group_closeness_close1 = [];
        let speed_slow1 = [];
        let speed_moderate1 = [];
        let speed_fast1 = [];
        let speed_resting1 = [];
        let speed_circling1 = [];
        let foraging_maybe1 = [];
        let foraging_sure1 = [];
        let mating1 = [];
        let splash_interaction1 = [];
        let snorkel1 = [];
        let racing1 = [];
        let jump1 = [];
        let surfing_artificial1 = [];
        let surfing1 = [];
        let tail_lift1 = [];
        let contact1 = [];
        let backstroke1 = [];
        let boat_no1 = [];
        let other1 = [];
        let time2 = [];
        let boat_interaction2 = [];
        let boat_distance2 = [];
        let group_closeness_normal2 = [];
        let group_closeness_spreaded2 = [];
        let group_closeness_close2 = [];
        let speed_slow2 = [];
        let speed_moderate2 = [];
        let speed_fast2 = [];
        let speed_resting2 = [];
        let speed_circling2 = [];
        let foraging_maybe2 = [];
        let foraging_sure2 = [];
        let mating2 = [];
        let splash_interaction2 = [];
        let snorkel2 = [];
        let racing2 = [];
        let jump2 = [];
        let surfing_artificial2 = [];
        let surfing2 = [];
        let tail_lift2 = [];
        let contact2 = [];
        let backstroke2 = [];
        let boat_no2 = [];
        let other2 = [];
        let time3 = [];
        let boat_interaction3 = [];
        let boat_distance3 = [];
        let group_closeness_normal3 = [];
        let group_closeness_spreaded3 = [];
        let group_closeness_close3 = [];
        let speed_slow3 = [];
        let speed_moderate3 = [];
        let speed_fast3 = [];
        let speed_resting3 = [];
        let speed_circling3 = [];
        let foraging_maybe3 = [];
        let foraging_sure3 = [];
        let mating3 = [];
        let splash_interaction3 = [];
        let snorkel3 = [];
        let racing3 = [];
        let jump3 = [];
        let surfing_artificial3 = [];
        let surfing3 = [];
        let tail_lift3 = [];
        let contact3 = [];
        let backstroke3 = [];
        let boat_no3 = [];
        let other3 = [];


        for (i=0; i < pageSize; i++) {
            id.push($(`#id-${i}`).text())
            sailing_id.push($(`#sailing_id-${i}`).text())
            sighting_id.push($(`#sighting_id-${i}`).text())
            mix.push($(`#mix-${i}`).text())
            dolphin_type.push($(`#dolphin_type-${i}`).text())
            year.push($(`#year-${i}`).text())
            month.push($(`#month-${i}`).text())
            day.push($(`#day-${i}`).text())
            period.push($(`#period-${i}`).text())
            departure.push($(`#departure-${i}`).text())
            arrival.push($(`#arrival-${i}`).text())
            boat_size.push($(`#boat_size-${i}`).text())
            sighting.push($(`#sighting-${i}`).text())
            gps_no.push($(`#gps_no-${i}`).text())
            guide.push($(`#guide-${i}`).text())
            recorder.push($(`#recorder-${i}`).text())
            observations.push($(`#observations-${i}`).text())
            weather.push($(`#weather-${i}`).text())
            wind_direction.push($(`#wind_direction-${i}`).text())
            wave_condition.push($(`#wave_condition-${i}`).text())
            current.push($(`#current-${i}`).text())
            latitude.push($(`#latitude-${i}`).text())
            latitude_min.push($(`#latitude_min-${i}`).text())
            latitude_sec.push($(`#latitude_sec-${i}`).text())
            longitude.push($(`#longitude-${i}`).text())
            longitude_min.push($(`#longitude_min-${i}`).text())
            longitude_sec.push($(`#longitude_sec-${i}`).text())
            approach_time.push($(`#approach_time-${i}`).text())
            approach_gps_no.push($(`#approach_gps_no-${i}`).text())
            leaving_time.push($(`#leaving_time-${i}`).text())
            leaving_gps_no.push($(`#leaving_gps_no-${i}`).text())
            leaving_method.push($(`#leaving_method-${i}`).text())
            sighting_method.push($(`#sighting_method-${i}`).text())
            type_confirmation.push($(`#type_confirmation-${i}`).text())
            dolphin_group_no.push($(`#dolphin_group_no-${i}`).text())
            dolphin_type_no.push($(`#dolphin_type_no-${i}`).text())
            dorsal_fin.push($(`#dorsal_fin-${i}`).text())
            exhalation.push($(`#exhalation-${i}`).text())
            splash.push($(`#splash-${i}`).text())
            exhibition.push($(`#exhibition-${i}`).text())
            mother_child.push($(`#mother_child-${i}`).text())
            mother_child_no.push($(`#mother_child_no-${i}`).text())
            group_size_lowest.push($(`#group_size_lowest-${i}`).text())
            group_size_probable.push($(`#group_size_probable-${i}`).text())
            group_size_highest.push($(`#group_size_highest-${i}`).text())
            mix_type.push($(`#mix_type-${i}`).text())
            time1.push($(`#time1-${i}`).text())
            boat_interaction1.push($(`#boat_interaction1-${i}`).text())
            boat_distance1.push($(`#boat_distance1-${i}`).text())
            group_closeness_normal1.push($(`#group_closeness_normal1-${i}`).text())
            group_closeness_spreaded1.push($(`#group_closeness_spreaded1-${i}`).text())
            group_closeness_close1.push($(`#group_closeness_close1-${i}`).text())
            speed_slow1.push($(`#speed_slow1-${i}`).text())
            speed_moderate1.push($(`#speed_moderate1-${i}`).text())
            speed_fast1.push($(`#speed_fast1-${i}`).text())
            speed_resting1.push($(`#speed_resting1-${i}`).text())
            speed_circling1.push($(`#speed_circling1-${i}`).text())
            foraging_maybe1.push($(`#foraging_maybe1-${i}`).text())
            foraging_sure1.push($(`#foraging_sure1-${i}`).text())
            mating1.push($(`#mating1-${i}`).text())
            splash_interaction1.push($(`#splash_interaction1-${i}`).text())
            snorkel1.push($(`#snorkel1-${i}`).text())
            racing1.push($(`#racing1-${i}`).text())
            jump1.push($(`#jump1-${i}`).text())
            surfing_artificial1.push($(`#surfing_artificial1-${i}`).text())
            surfing1.push($(`#surfing1-${i}`).text())
            tail_lift1.push($(`#tail_lift1-${i}`).text())
            contact1.push($(`#contact1-${i}`).text())
            backstroke1.push($(`#backstroke1-${i}`).text())
            boat_no1.push($(`#boat_no1-${i}`).text())
            other1.push($(`#other1-${i}`).text())
            time2.push($(`#time2-${i}`).text())
            boat_interaction2.push($(`#boat_interaction2-${i}`).text())
            boat_distance2.push($(`#boat_distance2-${i}`).text())
            group_closeness_normal2.push($(`#group_closeness_normal2-${i}`).text())
            group_closeness_spreaded2.push($(`#group_closeness_spreaded2-${i}`).text())
            group_closeness_close2.push($(`#group_closeness_close2-${i}`).text())
            speed_slow2.push($(`#speed_slow2-${i}`).text())
            speed_moderate2.push($(`#speed_moderate2-${i}`).text())
            speed_fast2.push($(`#speed_fast2-${i}`).text())
            speed_resting2.push($(`#speed_resting2-${i}`).text())
            speed_circling2.push($(`#speed_circling2-${i}`).text())
            foraging_maybe2.push($(`#foraging_maybe2-${i}`).text())
            foraging_sure2.push($(`#foraging_sure2-${i}`).text())
            mating2.push($(`#mating2-${i}`).text())
            splash_interaction2.push($(`#splash_interaction2-${i}`).text())
            snorkel2.push($(`#snorkel2-${i}`).text())
            racing2.push($(`#racing2-${i}`).text())
            jump2.push($(`#jump2-${i}`).text())
            surfing_artificial2.push($(`#surfing_artificial2-${i}`).text())
            surfing2.push($(`#surfing2-${i}`).text())
            tail_lift2.push($(`#tail_lift2-${i}`).text())
            contact2.push($(`#contact2-${i}`).text())
            backstroke2.push($(`#backstroke2-${i}`).text())
            boat_no2.push($(`#boat_no2-${i}`).text())
            other2.push($(`#other2-${i}`).text())
            time3.push($(`#time3-${i}`).text())
            boat_interaction3.push($(`#boat_interaction3-${i}`).text())
            boat_distance3.push($(`#boat_distance3-${i}`).text())
            group_closeness_normal3.push($(`#group_closeness_normal3-${i}`).text())
            group_closeness_spreaded3.push($(`#group_closeness_spreaded3-${i}`).text())
            group_closeness_close3.push($(`#group_closeness_close3-${i}`).text())
            speed_slow3.push($(`#speed_slow3-${i}`).text())
            speed_moderate3.push($(`#speed_moderate3-${i}`).text())
            speed_fast3.push($(`#speed_fast3-${i}`).text())
            speed_resting3.push($(`#speed_resting3-${i}`).text())
            speed_circling3.push($(`#speed_circling3-${i}`).text())
            foraging_maybe3.push($(`#foraging_maybe3-${i}`).text())
            foraging_sure3.push($(`#foraging_sure3-${i}`).text())
            mating3.push($(`#mating3-${i}`).text())
            splash_interaction3.push($(`#splash_interaction3-${i}`).text())
            snorkel3.push($(`#snorkel3-${i}`).text())
            racing3.push($(`#racing3-${i}`).text())
            jump3.push($(`#jump3-${i}`).text())
            surfing_artificial3.push($(`#surfing_artificial3-${i}`).text())
            surfing3.push($(`#surfing3-${i}`).text())
            tail_lift3.push($(`#tail_lift3-${i}`).text())
            contact3.push($(`#contact3-${i}`).text())
            backstroke3.push($(`#backstroke3-${i}`).text())
            boat_no3.push($(`#boat_no3-${i}`).text())
            other3.push($(`#other3-${i}`).text())
        }
        const body = {
            id,
            sailing_id,
            sighting_id,
            mix,
            dolphin_type,
            year,
            month,
            day,
            period,
            departure,
            arrival,
            boat_size,
            sighting,
            gps_no,
            guide,
            recorder,
            observations,
            weather,
            wind_direction,
            wave_condition,
            current,
            latitude,
            latitude_min,
            latitude_sec,
            longitude,
            longitude_min,
            longitude_sec,
            approach_time,
            approach_gps_no,
            leaving_time,
            leaving_gps_no,
            leaving_method,
            sighting_method,
            type_confirmation,
            dolphin_group_no,
            dolphin_type_no,
            dorsal_fin,
            exhalation,
            splash,
            exhibition,
            mother_child,
            mother_child_no,
            group_size_lowest,
            group_size_probable,
            group_size_highest,
            mix_type,
            time1,
            boat_interaction1,
            boat_distance1,
            group_closeness_normal1,
            group_closeness_spreaded1,
            group_closeness_close1,
            speed_slow1,
            speed_moderate1,
            speed_fast1,
            speed_resting1,
            speed_circling1,
            foraging_maybe1,
            foraging_sure1,
            mating1,
            splash_interaction1,
            snorkel1,
            racing1,
            jump1,
            surfing_artificial1,
            surfing1,
            tail_lift1,
            contact1,
            backstroke1,
            boat_no1,
            other1,
            time2,
            boat_interaction2,
            boat_distance2,
            group_closeness_normal2,
            group_closeness_spreaded2,
            group_closeness_close2,
            speed_slow2,
            speed_moderate2,
            speed_fast2,
            speed_resting2,
            speed_circling2,
            foraging_maybe2,
            foraging_sure2,
            mating2,
            splash_interaction2,
            snorkel2,
            racing2,
            jump2,
            surfing_artificial2,
            surfing2,
            tail_lift2,
            contact2,
            backstroke2,
            boat_no2,
            other2,
            time3,
            boat_interaction3,
            boat_distance3,
            group_closeness_normal3,
            group_closeness_spreaded3,
            group_closeness_close3,
            speed_slow3,
            speed_moderate3,
            speed_fast3,
            speed_resting3,
            speed_circling3,
            foraging_maybe3,
            foraging_sure3,
            mating3,
            splash_interaction3,
            snorkel3,
            racing3,
            jump3,
            surfing_artificial3,
            surfing3,
            tail_lift3,
            contact3,
            backstroke3,
            boat_no3,
            other3
        };
        let url = `${window.location.origin}/admin/console/database`
        let options = {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        }
        let raUpdateDataResponse = await fetch(url, options);
        let updateDataResponse = await raUpdateDataResponse.json();
        if (updateDataResponse == 'Success') {
            alert('update table successful!');
            window.location.href = "/console_db.html";
        } else {
            alert('the table has not been updated.')
        }
    } catch(err) {
        console.log('Error', err )
    }
}

async function download() {
    try {
        const accessToken = localStorage.getItem('access_token');
        let url = `${window.location.origin}/api/1.0/data/download`
        let options = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + accessToken
            },
        }
        let rawResponse = await fetch(url, options);
        let response = await rawResponse.json();
        if(response.error) {
            alert(response.error);
        }
        let filenameArr = response.headers.get('Content-Disposition').split('=') 
        let filename = filenameArr[1]
        const reader = response.body.getReader();
        let receivedLength = 0; 
        let chunks = [];
        while(true) {
            const {done, value} = await reader.read();
            if (done) {
              break;
            }
            chunks.push(value);
            receivedLength += value.length;
            console.log(`Received ${receivedLength}`)
          }
        let blob = new Blob(chunks);
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', `${filename}`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch(err) {
        console.log('Error', err )
    }
}

$('.toggle-button').on('click', () => {
    document.querySelector('sidebar-component').shadowRoot.querySelector('.util')
    .classList.remove("hide");
})