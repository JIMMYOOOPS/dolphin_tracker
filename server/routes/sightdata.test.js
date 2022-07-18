const request = require('supertest');
const {app, server} = require('../../server');
const { NODE_ENV } = process.env;
const { 
    poolConnection,
    poolRelease
 } = require('../../utils/mysql');

beforeAll(async () => {
    if(NODE_ENV !== 'test') {
        throw 'not in test environment'
    }
    await poolConnection();
});

afterAll(async () => {
    server.close();
    await poolRelease();
})

describe('tracker API', () => {
    describe('Test Get /map/all', () => {
        test('It should response with 200 success', async ()=> {
                const response = await request(app).get('/api/1.0/data/map/all')
                .expect(200);
        });
    });
    
    describe('Test POST /map/date', () => {
        const searchData = {
            range: '2016. 01. 01. - 2020. 12. 31.'
        };
        const searchDataWithType = {
            range: '2016. 01. 01. - 2020. 12. 31.',
            type: 'Sl'
        };

        test('It should response with 200 success', async ()=> {
            const response = await request(app).post('/api/1.0/data/map/date')
                .send(searchData)
                .expect('Content-Type', /json/)
                .expect(200);
        });

        test('It should response with 200 success', async ()=> {
            const response = await request(app).post('/api/1.0/data/map/date')
                .send(searchDataWithType)
                .expect('Content-Type', /json/)
                .expect(200);
        });
    });
})

