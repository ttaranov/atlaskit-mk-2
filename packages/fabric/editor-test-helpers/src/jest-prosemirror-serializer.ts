import { EditorState } from 'prosemirror-state';

export default (serialize?: (state) => object) => ({
  print(state, jestSerialize) {
    const { doc, selection } = state;
    let rest = {};
    if (serialize) {
      rest = serialize(state);
    }
    return jestSerialize({
      doc,
      selection,
      ...rest,
    });
  },
  test(val) {
    return val instanceof EditorState;
  },
});
