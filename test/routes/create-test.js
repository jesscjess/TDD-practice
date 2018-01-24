const { assert } = require('chai');
const request = require('supertest');
const { jsdom } = require('jsdom');

const app = require('../../app');
const Item = require('../../models/item');

const { parseTextFromHTML, buildItemObject } = require('../test-utils');
const { connectDatabaseAndDropData, diconnectDatabase } = require('../setup-teardown-utils');

const findImageElementBySource = (htmlAsString, src) => {
  const image = jsdom(htmlAsString).querySelector(`img[src="${src}"]`);
  if (image !== null) {
    return image;
  } else {
    throw new Error(`Image with src "${src}" not found in HTML string`);
  }
};

describe('Server path: /items/create', () => {
  const itemToCreate = buildItemObject();

  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  // Write your describe blocks below:
  describe('GET', () => {
    it('renders empty input fields', async () => {
      const response = await request(app)
        .get('/items/create');

      assert.equal(parseTextFromHTML(response.text, 'input#title-input'), '');
      assert.equal(parseTextFromHTML(response.text, 'input#imageUrl-input'), '');
      assert.equal(parseTextFromHTML(response.text, 'textarea#description-input'), '');
    });
  });

  describe('POST', () => {
    it('creates a new item', async () => {
      const itemToCreate = buildItemObject();

      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(itemToCreate);

      const createdItem = await Item.findOne(itemToCreate);
      assert.isOk(createdItem, 'Looks like item was not created successfully in the database');

    });
    it('the route redirects the user to /', async () => {
      const itemToCreate = buildItemObject();
      const redirectCode = 302

      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(itemToCreate);

      assert.equal(response.status, redirectCode);
      assert.equal(response.headers.location, '/')

    });

    it('request with no title should display an error message', async () => {
      const itemToCreate = {
        description: 'Trippy pic I found',
        imageUrl: 'https://hdwallsource.com/img/2013/00/abstract-cool-wallpaper-723.jpg'
      }

      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(itemToCreate);

      const createdItem = await Item.findOne(itemToCreate);
      assert.deepEqual(await Item.find({}), []);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'Path `title` is required.');

    });

    it('request with no description should display an error message', async () => {
      const itemToCreate = {
        title: 'trippy',
        imageUrl: 'https://hdwallsource.com/img/2013/00/abstract-cool-wallpaper-723.jpg'
      }

      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(itemToCreate);

      const createdItem = await Item.findOne(itemToCreate);
      assert.deepEqual(await Item.find({}), []);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'Path `description` is required.');

    });

    it('request with no image url should display an error message', async () => {
      const itemToCreate = {
        title: 'Trippy',
        description: 'Trippy pic I found'
      }

      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(itemToCreate);

      const createdItem = await Item.findOne(itemToCreate);
      assert.deepEqual(await Item.find({}), []);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'Path `imageUrl` is required.');

    });
  });

});
