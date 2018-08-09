// @flow
import UIController from '../../UIController';

const initialState = {
  isPeekHinting: true,
  isPeeking: true,
  isCollapsed: true,
  productNavWidth: 100,
};

const cacheController = {
  get: jest.fn(),
  set: jest.fn(),
};

describe('NavigationNext UI Controller: UIController', () => {
  afterEach(() => {
    cacheController.get.mockRestore();
    cacheController.set.mockRestore();
  });

  it('should add the default state if a cache controller was not passed', () => {
    const uiController = new UIController(initialState, false);
    expect(uiController.state).toEqual({
      isCollapsed: true,
      isPeekHinting: true,
      isPeeking: true,
      isResizing: false,
      productNavWidth: 100,
    });
  });

  it('should add the cache controller functions into the controller', () => {
    const uiController = new UIController(initialState, cacheController);

    expect(uiController.getCache === cacheController.get).toBe(true);
    expect(uiController.setCache === cacheController.set).toBe(true);
  });

  it('should toggle collapse state if `toggleCollapse` is called', () => {
    const uiController = new UIController(initialState, cacheController);

    uiController.toggleCollapse();

    expect(uiController.state.isCollapsed).toEqual(false);

    uiController.toggleCollapse();

    expect(uiController.state.isCollapsed).toEqual(true);
    expect(cacheController.set).toHaveBeenCalled();
  });

  it('should toggle peek hint state if `togglePeekHint` is called', () => {
    const uiController = new UIController(initialState, cacheController);

    uiController.togglePeekHint();

    expect(uiController.state.isPeekHinting).toEqual(false);

    uiController.togglePeekHint();

    expect(uiController.state.isPeekHinting).toEqual(true);
    expect(cacheController.set).toHaveBeenCalled();
  });

  it('should toggle peek state if `togglePeek` is called', () => {
    const uiController = new UIController(initialState, cacheController);

    uiController.togglePeek();

    expect(uiController.state.isPeeking).toEqual(false);

    uiController.togglePeek();

    expect(uiController.state.isPeeking).toEqual(true);
    expect(cacheController.set).toHaveBeenCalled();
  });

  it('should manually start the resize event', () => {
    const uiController = new UIController(initialState, cacheController);
    const resizeData = {
      productNavWidth: 200,
      isCollapsed: false,
    };

    uiController.manualResizeStart(resizeData);

    expect(uiController.state).toMatchObject({
      ...resizeData,
      isResizing: true,
    });
  });

  it('should manually stop the resize event', () => {
    const uiController = new UIController(initialState, cacheController);
    const resizeData = {
      productNavWidth: 200,
      isCollapsed: false,
    };

    uiController.manualResizeEnd(resizeData);

    expect(uiController.state).toMatchObject({
      ...resizeData,
      isResizing: false,
    });
  });
});
