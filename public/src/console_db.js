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
        function createTableRow(numInfos, pageSize) {
        // let rowArray = ['sailing_id', 'sighting_id', 'mix', 'dolphin_type', 'year', 'month', 'day', 'period', 'departure', 'arrival', 'boat_size', 'sighting', 'gps_no',  'guide', 'recorder', 'observations', 'type_confirmation', 'dolphin_group_no', 'dolphin_type_no', 'dorsal_fin', 'exhalation', 'splash', 'exhibition', 'weather', 'wind_direction', 'wave_condition', 'current', 'latitude', 'latitude_min', 'latitude_sec', 'longitude', 'longitude_min', 'longitude_sec', 'approach_time', 'approach_gps_no', 'leaving_time', 'leaving_gps_no', 'leaving_method', 'sighting_method', 'mother_child', 'mother_child_no', 'group_size_lowest', 'group_size_probable', 'group_size_highest',  'mix_type'];
        // let attrArray = [];
            // for (i= numInfos; i < numInfos -1 + pageSize; i++) {
            //     for (j = 0; j< rowArray.length; j++) {
            //         attrArray.push(`<td data-label=${rowArray[j]}-${i}>${databaseData[i].rowArray[j]}</td>`)
            //     }
            // }
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
                `<td data-label=mix_type-${i} id=mix_type-${i} contenteditable="true">${databaseData[i].mix_type}</td>`
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
        console.log(updateDataResponse);
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
        let url = `${window.location.origin}/api/1.0/data/download`
        let options = {
            method: 'get',
            headers: {
                "Content-Type": "application/json",
            },
        }
        let rawdownlaodResponse = await fetch(url, options);
        let downlaodResponse = await rawdownlaodResponse.json();
        console.log(downlaodResponse);
        let dir = downlaodResponse.split('downloadfile/')
        console.log(dir)
        if (dir) {
            alert(`Your file is downloaded as ${dir[1]}`);
            window.location.href = "/console_db.html";
        } else {
            alert('the file has not been downloaded.')
        }
    } catch(err) {
        console.log('Error', err )
    }
}
$('.toggle-button').on('click', () => {
    document.querySelector('sidebar-component').shadowRoot.querySelector('.util')
    .classList.remove("hide")
    .classList.toggle("show");
})