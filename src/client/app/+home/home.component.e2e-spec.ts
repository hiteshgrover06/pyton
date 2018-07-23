describe('Home', () => {

  beforeEach(() => {
    browser.get('/');
  });

  it('should have fields visible', () => {
    expect(element(by.css('input[type="text"]')).isPresent()).toEqual(true);

    expect(element(by.css('.dropdown-menu')).isPresent()).toEqual(true);
    expect(element(by.css('button[type="button"]')).getText())
      .toEqual('Google Search');

    expect(element(by.css('div.alert-info')).isPresent()).toEqual(true);
    expect(element(by.css('div.alert-info')).getText())
      .toEqual('To see search results , Start your quest by typing the query above....');

    expect(element(by.css('div.table-responsive')).isPresent()).toEqual(true);
  });

  // it('should show results on api call', () => {

  //   expect(element(by.css('table-responsive')).isPresent()).toEqual(true);

  //   let input = element(by.css('sd-home form input'));
  //   'Tim Berners-Lee'.split('').forEach((c) => input.sendKeys(c));
  //   element(by.css('sd-home form button')).click();

  // });

});
