const request = require('supertest');
require('../../test/set_up')
const {app} = require('../../server');

describe('database API', () => {
    jest.setTimeout(20000);
    describe('Test POST /sighting', ()=> {
        test('It should response with 200 success', async ()=> {
            // Arrange import test data from testdata.js
            // Act
            result = await request(app).post('/admin/console/sighting')
            .send({    
            date: '2022-07-21',
            boat_time: '00:00',
            period: '-',
            departure: '00:00',
            arrival: '00:00',
            boat_size: '-',
            gps_no: '1',
            guide: '-',
            recorder: '-',
            sighting: '-',
            sighting_id: '',
            observations: '-',
            weather: '-',
            wind_direction: '-',
            wave_condition: '-',
            current: '-',
            latitude: '-',
            latitude_min: '',
            latitude_sec: '',
            longitude: '-',
            longitude_min: '',
            longitude_sec: '',
            boat_number: '',
            sighting_method: '-',
            dorsal_fin: '0',
            exhalation: '0',
            splash: '0',
            exhibition: '0',
            approach_time: '-',
            approach_gps_no: '',
            leaving_time: '-',
            leaving_gps_no: '',
            leaving_method: '-',
            dolphin_type: '-',
            type_confirmation: '-',
            dolphin_group_no: '',
            dolphin_type_no: '',
            mother_child: '-',
            mix: '-',
            mix_type: '-',
            time: [ '0-10', '11-20', '21-30' ],
            boat_interaction: [ '-', '-', '-' ],
            boat_distance: [ '', '', '' ],
            group_closeness_close: [ '0', '0', '0' ],
            group_closeness_normal: [ '0', '0', '0' ],
            group_closeness_spreaded: [ '0', '0', '0' ],
            speed_slow: [ '0', '0', '0' ],
            speed_moderate: [ '0', '0', '0' ],
            speed_fast: [ '0', '0', '0' ],
            speed_resting: [ '0', '0', '0' ],
            speed_circling: [ '0', '0', '0' ],
            foraging_maybe: [ '0', '0', '0' ],
            foraging_sure: [ '0', '0', '0' ],
            mating: [ '0', '0', '0' ],
            splash_interaction: [ '0', '0', '0' ],
            snorkel: [ '0', '0', '0' ],
            racing: [ '0', '0', '0' ],
            jump: [ '0', '0', '0' ],
            surfing_artificial: [ '0', '0', '0' ],
            surfing: [ '0', '0', '0' ],
            tail_lift: [ '0', '0', '0' ],
            contact: [ '0', '0', '0' ],
            backstroke: [ '0', '0', '0' ],
            boat_no: [ '', '', '' ],
            other: [ '-', '-', '-' ]
        })
            // Assert
            .expect('Content-Type', /json/)
            .expect(201);
        });
    });
})