jest.mock('@atlaskit/editor-core', () => {
  return {
    ...jest.genMockFromModule('@atlaskit/editor-core'),
    indentList: jest.fn(() => () => {}),
    outdentList: jest.fn(() => () => {}),
    toggleOrderedList: jest.fn(() => () => {}),
    toggleBulletList: jest.fn(() => () => {}),
  };
});

import WebBridgeImpl from '../../editor/native-to-web';
import {
  indentList,
  outdentList,
  toggleOrderedList,
  toggleBulletList,
} from '@atlaskit/editor-core';

afterEach(() => {
  (indentList as jest.Mock<{}>).mockClear();
  (outdentList as jest.Mock<{}>).mockClear();
  (toggleOrderedList as jest.Mock<{}>).mockClear();
  (toggleBulletList as jest.Mock<{}>).mockClear();
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
