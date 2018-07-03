import {
  doc,
  code,
  textColor,
  p,
  createEditor,
  a,
  strong,
} from '@atlaskit/editor-test-helpers';
import {
  TextColorState,
  stateKey as textColorPluginKey,
} from '../../../../plugins/text-color/pm-plugins/main';
import textColorPlugin from '../../../../plugins/text-color';

describe('text-color', () => {
  const editor = (doc: any) =>
    createEditor<TextColorState>({
      doc,
      editorPlugins: [textColorPlugin],
      pluginKey: textColorPluginKey,
    });

  const testColor1 = '#97a0af';
  const testColor2 = '#0747a6';
  const createTextColor = (color: string) => textColor({ color });

  it('should allow a change handler to be attached', () => {
    const { pluginState } = editor(doc(p('text')));
    const spy = jest.fn();
    pluginState.subscribe(spy);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(pluginState);
  });

  it('should be able to replace textColor on a character', () => {
    const { editorView, pluginState } = editor(doc(p('{<}t{>}ext')));

    expect(
      pluginState.toggleTextColor(
        editorView.state,
        editorView.dispatch,
        testColor1,
      ),
    );
    expect(editorView.state.doc).toEqualDocument(
      doc(p(createTextColor(testColor1)('t'), 'ext')),
    );
    expect(
      pluginState.toggleTextColor(
        editorView.state,
        editorView.dispatch,
        testColor2,
      ),
    );
    expect(editorView.state.doc).toEqualDocument(
      doc(p(createTextColor(testColor2)('t'), 'ext')),
    );
  });

  it('should expose whether textColor has any color on an empty selection', () => {
    const { editorView, pluginState } = editor(doc(p('te{<>}xt')));

    expect(pluginState.color).toBe(pluginState.defaultColor);
    expect(
      pluginState.toggleTextColor(
        editorView.state,
        editorView.dispatch,
        testColor1,
      ),
    );
    expect(pluginState.color).toBe(testColor1);
  });

  it('should expose whether textColor has any color on a text selection', () => {
    const { editorView, pluginState } = editor(doc(p('t{<}e{>}xt')));

    expect(pluginState.color).toBe(pluginState.defaultColor);
    expect(
      pluginState.toggleTextColor(
        editorView.state,
        editorView.dispatch,
        testColor1,
      ),
    );
    expect(pluginState.color).toBe(testColor1);
  });

  it('exposes textColor as disabled when the mark cannot be applied', () => {
    const { pluginState } = editor(doc(p(code('te{<>}xt'))));

    expect(pluginState.disabled).toBe(true);
  });

  it('exposes textColor as disabled when inside hyperlink', () => {
    const { pluginState } = editor(
      doc(p(a({ href: 'http://www.atlassian.com' })('te{<>}xt'))),
    );

    expect(pluginState.disabled).toBe(true);
  });

  it('exposes textColor as not disabled when the mark can be applied', () => {
    const { pluginState } = editor(doc(p('te{<>}xt')));

    expect(pluginState.disabled).toBe(false);
  });

  it('should expose no color when selection has multiple color marks', () => {
    const { pluginState } = editor(
      doc(
        p(
          '{<}',
          createTextColor(testColor1)('te'),
          createTextColor(testColor2)('xt'),
          '{>}',
        ),
      ),
    );

    expect(pluginState.color).toBe(undefined);
  });

  it('should expose no color when selection has mixed content', () => {
    const { pluginState } = editor(
      doc(p('{<}', createTextColor(testColor1)('te'), 'xt', '{>}')),
    );

    expect(pluginState.color).toBe(undefined);
  });

  it('should expose default color when selection has no color marks', () => {
    const { pluginState } = editor(doc(p('{<}text{>}')));

    expect(pluginState.color).toBe(pluginState.defaultColor);
  });

  it('should expose default color when selection has other marks', () => {
    const { pluginState } = editor(doc(p('{<}', strong('te'), 'xt{>}')));

    expect(pluginState.color).toBe(pluginState.defaultColor);
  });

  it('should expose color when the cursor is inside a textColor mark', () => {
    const { pluginState } = editor(
      doc(p(createTextColor(testColor1)('te{<>}xt'))),
    );

    expect(pluginState.color).toBe(testColor1);
  });

  it('should expose color when the cursor is at the ending of a textColor mark', () => {
    const { pluginState } = editor(
      doc(p(createTextColor(testColor1)('text'), '{<>}')),
    );

    expect(pluginState.color).toBe(testColor1);
  });

  it('should expose default color when the cursor is at the begnining of a textColor mark', () => {
    const { pluginState } = editor(
      doc(p('hello', createTextColor(testColor1)('{<>}text'))),
    );

    expect(pluginState.color).toBe(pluginState.defaultColor);
  });

  it('should expose color when the cursor is at begnining of doc with textColor mark', () => {
    const { pluginState } = editor(
      doc(p('', createTextColor(testColor1)('{<>}text'))),
    );

    expect(pluginState.color).toBe(testColor1);
  });

  it('should expose color when selection has other marks with textColor mark', () => {
    const { pluginState } = editor(
      doc(
        p(
          '{<}',
          createTextColor(testColor1)('hello ', strong('world'), '!'),
          '{>}',
        ),
      ),
    );

    expect(pluginState.color).toBe(testColor1);
  });
});
