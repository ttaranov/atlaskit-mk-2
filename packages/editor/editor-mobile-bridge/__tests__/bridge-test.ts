jest.mock('@atlaskit/editor-core', () => {
  return {
    ...jest.genMockFromModule('@atlaskit/editor-core'),
    indentList: jest.fn(() => () => {}),
    outdentList: jest.fn(() => () => {}),
  };
});

import WebBridgeImpl from '../src/native-to-web';
import { indentList, outdentList } from '@atlaskit/editor-core';

afterEach(() => {
  indentList.mockClear();
  outdentList.mockClear();
});

describe('headings should work', () => {
  let toggle;
  let bridge: any = new WebBridgeImpl();
  beforeEach(() => {
    toggle = jest.fn();
    bridge.editorView = {};
    bridge.blockState = {};
    bridge.blockState.setBlockType = toggle;
  });

  afterEach(() => {
    bridge.editorView = undefined;
    bridge.blockState = undefined;
  });

  it('should change heading level on call from native side', () => {
    bridge.onBlockSelected('h2');
    expect(toggle).toBeCalledWith('h2', bridge.editorView);
  });

  it('should not toggle if block state is undefined', () => {
    bridge.blockState = undefined;
    bridge.onBlockSelected('h1');
    expect(toggle).not.toBeCalled();
  });

  it('should not toggle if editor view is undefined', () => {
    bridge.editorView = undefined;
    bridge.onBlockSelected('h1');
    expect(toggle).not.toBeCalled();
  });
});

describe('lists should work', () => {
  let orderListToggle;
  let bulletListToggle;
  let bridge: any = new WebBridgeImpl();
  beforeEach(() => {
    orderListToggle = jest.fn();
    bulletListToggle = jest.fn();
    bridge.editorView = {};
    bridge.listState = {};
    bridge.listState.toggleOrderedList = orderListToggle;
    bridge.listState.toggleBulletList = bulletListToggle;
  });

  afterEach(() => {
    bridge.editorView = undefined;
    bridge.listState = undefined;
  });

  it('should call ordered list toggle', () => {
    bridge.onOrderedListSelected();
    expect(orderListToggle).toBeCalled();
  });

  it('should not call ordered list if view is undefined', () => {
    bridge.editorView = undefined;
    bridge.onOrderedListSelected();
    expect(orderListToggle).not.toBeCalled();
  });

  it('should not call ordered list if state is undefined', () => {
    bridge.listState = undefined;
    bridge.onOrderedListSelected();
    expect(orderListToggle).not.toBeCalled();
  });

  it('should call bullet list toggle', () => {
    bridge.onBulletListSelected();
    expect(bulletListToggle).toBeCalled();
  });

  it('should not call bullet list if view is undefined', () => {
    bridge.editorView = undefined;
    bridge.onBulletListSelected();
    expect(bulletListToggle).not.toBeCalled();
  });

  it('should not call bullet list if state is undefined', () => {
    bridge.listState = undefined;
    bridge.onBulletListSelected();
    expect(bulletListToggle).not.toBeCalled();
  });

  it('should call indent list', () => {
    bridge.onIndentList();
    expect(indentList).toBeCalled();
  });

  it('should not call indent list if view is undefined', () => {
    bridge.editorView = undefined;
    bridge.onIndentList();
    expect(indentList).not.toBeCalled();
  });

  it('should not call indent list if state is undefined', () => {
    bridge.listState = undefined;
    bridge.onIndentList();
    expect(indentList).not.toBeCalled();
  });

  it('should call outdent list', () => {
    bridge.onOutdentList();
    expect(outdentList).toBeCalled();
  });

  it('should not call outdent list if view is undefined', () => {
    bridge.editorView = undefined;
    bridge.onOutdentList();
    expect(outdentList).not.toBeCalled();
  });

  it('should not call outdent list if state is undefined', () => {
    bridge.listState = undefined;
    bridge.onOutdentList();
    expect(outdentList).not.toBeCalled();
  });
});
