import { IntranetPage } from './app.po';

describe('intranet App', () => {
  let page: IntranetPage;

  beforeEach(() => {
    page = new IntranetPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
