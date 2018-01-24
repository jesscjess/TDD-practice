const { assert } = require('chai');
const { buildItemObject } = require('../test-utils');

describe('User posts new item', () => {
  describe('clicks on card view', () => {
    it('sees items full description', () => {
      browser.url('/items/create');
      const itemToCreate = {
        title: 'Trippy',
        imageUrl: 'https://hdwallsource.com/img/2013/00/abstract-cool-wallpaper-723.jpg',
        description : 'Trippy pic I found, which extra long description to show that all of it shows when you want it show in the other page where it should show so it shows. So yeah show it......'
      };

      browser.setValue('#title-input', itemToCreate.title);
      browser.setValue('#description-input', itemToCreate.description);
      browser.setValue('#imageUrl-input', itemToCreate.imageUrl);
      browser.click('#submit-button');
      // browser.sleep(1000);
      browser.click('.item-card a');

      assert.include(browser.getText('body'), itemToCreate.description);
      // assert.include(browser.getAttribute('body img', 'src'), itemToCreate.imageUrl);
    });
  });
})