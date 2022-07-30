const request = require('supertest');
require('../../test/set_up');
const {app} = require('../../server');

describe('tracker API', () => {
  jest.setTimeout(20000);
  describe('Test POST /data/map/', () => {
    test('Expect response to be 200 success', async ()=> {
      // Arrange
      const searchData = {
        range: '2016. 01. 01. - 2020. 12. 31.',
      };
      // Act
      await request(app).post('/api/1.0/data/map/date')
          .send(searchData)
      // Assert
          .expect('Content-Type', /json/)
          .expect(200);
    });

    test('Expect response to be 200 success', async ()=> {
      // Arrange
      const searchDataWithType = {
        range: '2016. 01. 01. - 2020. 12. 31.',
        type: 'Sl',
      };
      // Act
      await request(app).post('/api/1.0/data/map/date')
          .send(searchDataWithType)
      // Assert
          .expect('Content-Type', /json/)
          .expect(200);
    });
  });
});

describe('database API', () => {
  describe('GET /:category', ()=> {
    test('Expect response to be 200 success', async ()=> {
      // Act
      await request(app).get('/api/1.0/data/all')
      // Assert
          .expect('Content-Type', /json/)
          .expect(200);
    });

    test('Expect response to be 200 success', async ()=> {
      // Act
      await request(app).get('/api/1.0/data/database')
      // Assert
          .expect('Content-Type', /json/)
          .expect(200);
    });
  });
});


