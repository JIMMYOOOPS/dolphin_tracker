// const {app, server} = require('../server');
const {NODE_ENV} = process.env;

const {
  poolRelease,
} = require('../utils/mysql');
const {
  truncateTestData,
  generateTestData,
} = require('../test/generate_sightdata');

beforeAll(async () => {
  if (NODE_ENV !== 'test') {
    throw 'not in test environment';
  }
  await truncateTestData();
  await generateTestData();
});


afterAll(async () => {
  // server.close();
  await poolRelease();
});
