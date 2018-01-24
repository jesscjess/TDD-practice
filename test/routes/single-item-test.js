const { assert } = require('chai');
const request = require('supertest');

const app = require('../../app');

const { parseTextFromHTML, seedItemToDatabase } = require('../test-utils');
const { connectDatabaseAndDropData, diconnectDatabase } = require('../setup-teardown-utils');

describe('Server path: /items/:id', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  // Write your test blocks below:
  describe('GET', () => {
    it('correct item rendered', async () => {
      const newItem = await seedItemToDatabase({
        title: 'Trippy',
        imageUrl: 'https://hdwallsource.com/img/2013/00/abstract-cool-wallpaper-723.jpg',
        description: 'Trippy pic I found'
      });
      const itemUrl = '/items/' + newItem._id.toString();

      const response = await request(app)
        .get(itemUrl);

      assert.equal(response.status, 200);
      assert.include(parseTextFromHTML(response.text, '#item-title'), newItem.title);
      assert.include(parseTextFromHTML(response.text, '#item-description'), newItem.description);
    })
  })

});
