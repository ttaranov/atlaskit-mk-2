import WebBridgeImpl from '../src/native-to-web';

describe('headings should work', () => {
  let toggle;
  let bridge: any = new WebBridgeImpl();
  beforeEach(() => {
    toggle = jest.fn();
    bridge.editorView = jest.mock('prosemirror-view');
    bridge.blockState = jest.mock('@atlaskit/editor-core');
    bridge.blockState.toggleBlockType = toggle;
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
