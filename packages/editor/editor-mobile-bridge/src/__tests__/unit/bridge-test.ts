jest.mock('@atlaskit/editor-core', () => {
  return {
    ...jest.genMockFromModule('@atlaskit/editor-core'),
    indentList: jest.fn(() => () => {}),
    outdentList: jest.fn(() => () => {}),
    toggleOrderedList: jest.fn(() => () => {}),
    toggleBulletList: jest.fn(() => () => {}),
  };
});

import WebBridgeImpl from '../../native-to-web';
import {
  indentList,
  outdentList,
  toggleOrderedList,
  toggleBulletList,
} from '@atlaskit/editor-core';

afterEach(() => {
  // @ts-ignore
  indentList.mockClear();
  // @ts-ignore
  outdentList.mockClear();
  // @ts-ignore
  toggleOrderedList.mockClear();
  // @ts-ignore
  toggleBulletList.mockClear();
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
  let bridge: any = new WebBridgeImpl();
  beforeEach(() => {
    bridge.editorView = {};
    bridge.listState = {};
  });

  afterEach(() => {
    bridge.editorView = undefined;
    bridge.listState = undefined;
  });

  it('should call ordered list toggle', () => {
    bridge.onOrderedListSelected();
    expect(toggleOrderedList).toBeCalled();
  });

  it('should not call ordered list if view is undefined', () => {
    bridge.editorView = undefined;
    bridge.onOrderedListSelected();
    expect(toggleOrderedList).not.toBeCalled();
  });

  it('should not call ordered list if state is undefined', () => {
    bridge.listState = undefined;
    bridge.onOrderedListSelected();
    expect(toggleOrderedList).not.toBeCalled();
  });

  it('should call bullet list toggle', () => {
    bridge.onBulletListSelected();
    expect(toggleBulletList).toBeCalled();
  });

  it('should not call bullet list if view is undefined', () => {
    bridge.editorView = undefined;
    bridge.onBulletListSelected();
    expect(toggleBulletList).not.toBeCalled();
  });

  it('should not call bullet list if state is undefined', () => {
    bridge.listState = undefined;
    bridge.onBulletListSelected();
    expect(toggleBulletList).not.toBeCalled();
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
