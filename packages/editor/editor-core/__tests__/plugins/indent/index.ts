import {
  doc,
  pWithAttrs,
  hWithAttrs,
  olWithAttrs,
  ulWithAttrs,
  sendKeyToPm,
  createEditor,
  panel,
  ol,
  ul,
  li,
  p,
} from '@atlaskit/editor-test-helpers';

const editor = (doc: any) =>
  createEditor({
    doc,
    editorProps: { allowIndent: true, allowLists: true, allowPanel: true },
  });

describe('indent plugin', () => {
  describe('indent when current indent is less than 6', () => {
    const nodes = [
      {
        name: 'paragraph',
        before: doc(pWithAttrs({ indentLevel: null })('{<>}test')),
        after: doc(pWithAttrs({ indentLevel: 1 })('test')),
      },
      {
        name: 'paragraph with selection in middle',
        before: doc(pWithAttrs({ indentLevel: null })('te{<>}st')),
        after: doc(pWithAttrs({ indentLevel: 1 })('test')),
      },
      {
        name: 'heading',
        before: doc(hWithAttrs({ level: 1, indentLevel: 3 })('{<>}test')),
        after: doc(hWithAttrs({ level: 1, indentLevel: 4 })('test')),
      },
      {
        name: 'heading with selection in middle',
        before: doc(hWithAttrs({ level: 1, indentLevel: 3 })('te{<>}st')),
        after: doc(hWithAttrs({ level: 1, indentLevel: 4 })('test')),
      },
      {
        name: 'orderedlist',
        before: doc(olWithAttrs({ indentLevel: 5 })(li(p('{<>}test')))),
        after: doc(olWithAttrs({ indentLevel: 6 })(li(p('test')))),
      },
      {
        name: 'orderedlist with selection in middle',
        before: doc(olWithAttrs({ indentLevel: 5 })(li(p('te{<>}st')))),
        after: doc(olWithAttrs({ indentLevel: 6 })(li(p('test')))),
      },
      {
        name: 'bulletList',
        before: doc(ulWithAttrs({ indentLevel: 2 })(li(p('{<>}test')))),
        after: doc(ulWithAttrs({ indentLevel: 3 })(li(p('test')))),
      },
      {
        name: 'bulletList with selection in middle',
        before: doc(ulWithAttrs({ indentLevel: 2 })(li(p('te{<>}st')))),
        after: doc(ulWithAttrs({ indentLevel: 3 })(li(p('test')))),
      },
    ];
    nodes.forEach(node => {
      it(`should add to indent in ${node.name} when tab key is pressed`, () => {
        const { editorView } = editor(node.before);
        sendKeyToPm(editorView, 'Tab');
        expect(editorView.state.doc).toEqualDocument(node.after);
      });
    });
  });

  describe('indent for wrong node selected', () => {
    const nodes = [
      {
        name: 'paragraph nested in panel',
        before: doc(panel()(p('{<>}test'))),
        after: doc(panel()(p('test'))),
      },
      {
        name: 'selection on second list item',
        before: doc(ol(li(p('test')), li(p('te{<>}st')))),
        after: doc(ol(li(p('test'), ol(li(p('test')))))),
      },
      {
        name: 'selection on nested list item',
        before: doc(ul(li(p('test'), ul(li(p('{<>}test')))))),
        after: doc(ul(li(p('test'), ul(li(p('test')))))),
      },
    ];
    nodes.forEach(node => {
      it(`should not add to indent in ${
        node.name
      } when tab key is pressed`, () => {
        const { editorView } = editor(node.before);
        sendKeyToPm(editorView, 'Tab');
        expect(editorView.state.doc).toEqualDocument(node.after);
      });
    });
  });

  describe('indent when current indent is 6', () => {
    const nodes = [
      {
        name: 'paragraph',
        before: doc(pWithAttrs({ indentLevel: 6 })('{<>}test')),
      },
      {
        name: 'heading',
        before: doc(hWithAttrs({ level: 1, indentLevel: 6 })('{<>}test')),
      },
      {
        name: 'orderedlist',
        before: doc(olWithAttrs({ indentLevel: 6 })(li(p('{<>}test')))),
      },
      {
        name: 'bulletList',
        before: doc(ulWithAttrs({ indentLevel: 6 })(li(p('{<>}test')))),
      },
    ];
    nodes.forEach(node => {
      it(`should not add to indent in ${
        node.name
      } when Tab is pressed if indent is aready 6`, () => {
        const { editorView } = editor(node.before);
        sendKeyToPm(editorView, 'Tab');
        expect(editorView.state.doc).toEqualDocument(node.before);
      });
    });
  });

  describe('outdent when current indent is defined', () => {
    const nodes = [
      {
        name: 'paragraph',
        before: doc(pWithAttrs({ indentLevel: 4 })('{<>}test')),
        after: doc(pWithAttrs({ indentLevel: 3 })('test')),
      },
      {
        name: 'heading',
        before: doc(hWithAttrs({ level: 1, indentLevel: 1 })('{<>}test')),
        after: doc(hWithAttrs({ level: 1, indentLevel: null })('test')),
      },
      {
        name: 'orderedlist',
        before: doc(olWithAttrs({ indentLevel: 6 })(li(p('{<>}test')))),
        after: doc(olWithAttrs({ indentLevel: 5 })(li(p('test')))),
      },
      {
        name: 'bulletList',
        before: doc(ulWithAttrs({ indentLevel: 2 })(li(p('{<>}test')))),
        after: doc(ulWithAttrs({ indentLevel: 1 })(li(p('test')))),
      },
    ];
    nodes.forEach(node => {
      ['Shift-Tab', 'Backspace'].forEach(key => {
        it(`should substract from indent in ${
          node.name
        } when ${key} key is pressed`, () => {
          const { editorView } = editor(node.before);
          sendKeyToPm(editorView, key);
          expect(editorView.state.doc).toEqualDocument(node.after);
        });
      });
    });
  });

  describe('outdent when current indent is null', () => {
    const nodes = [
      {
        name: 'paragraph',
        before: doc(pWithAttrs({ indentLevel: null })('{<>}test')),
      },
      {
        name: 'heading',
        before: doc(hWithAttrs({ level: 1, indentLevel: null })('{<>}test')),
      },
      {
        name: 'orderedlist',
        before: doc(olWithAttrs({ indentLevel: null })(li(p('{<>}test')))),
      },
      {
        name: 'bulletList',
        before: doc(ulWithAttrs({ indentLevel: null })(li(p('{<>}test')))),
      },
    ];
    nodes.forEach(node => {
      it(`should not add to indent in ${
        node.name
      } when Shift-Tab is pressed if indent is null`, () => {
        const { editorView } = editor(node.before);
        sendKeyToPm(editorView, 'Shift-Tab');
        expect(editorView.state.doc).toEqualDocument(node.before);
      });
    });
  });
});
