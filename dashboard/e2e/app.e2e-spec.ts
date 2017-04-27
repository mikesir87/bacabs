import { Dashboard2Page } from './app.po';

describe('dashboard2 App', () => {
  let page: Dashboard2Page;

  beforeEach(() => {
    page = new Dashboard2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
