import {
  createEditor,
  doc,
  p,
  code_block,
} from '@atlaskit/editor-test-helpers';
import {
  getStartOfCurrentLine,
  getEndOfCurrentLine,
  getLinesFromSelection,
  forEachLine,
  getLineInfo,
} from '../../../../../plugins/code-block/ide-ux/line-handling';

describe('IDE UX - Line Handling', () => {
  const getState = doc =>
    createEditor({
      doc,
      editorProps: { allowCodeBlocks: { enableKeybindingsForIDE: true } },
    });

  describe('#getStartOfCurrentLine', () => {
    it('should return empty string when the cursor is at the start of the code block', () => {
      const {
        editorView: { state },
      } = getState(doc(p('before'), code_block()('{<>}hello world')));
      expect(getStartOfCurrentLine(state)).toEqual({
        pos: 9,
        text: '',
      });
    });

    it('should return the text from the start to the cursor when no previous newline', () => {
      const {
        editorView: { state },
      } = getState(doc(p('before'), code_block()('hello world{<>}')));
      expect(getStartOfCurrentLine(state)).toEqual({
        pos: 9,
        text: 'hello world',
      });
    });

    it('should return the text from the start to the previous newline', () => {
      const {
        editorView: { state },
      } = getState(doc(p('before'), code_block()('hello\nworld{<>}')));
      expect(getStartOfCurrentLine(state)).toEqual({
        pos: 15,
        text: 'world',
      });
    });
  });

  describe('#getEndOfCurrentLine', () => {
    it('should return empty string when the cursor is at the end of the code block', () => {
      const {
        editorView: { state },
      } = getState(doc(p('before'), code_block()('hello world{<>}')));
      expect(getEndOfCurrentLine(state)).toEqual({
        pos: 20,
        text: '',
      });
    });

    it('should return the text from the cursor to the end when no successive newline', () => {
      const {
        editorView: { state },
      } = getState(doc(p('before'), code_block()('hello{<>}world')));
      expect(getEndOfCurrentLine(state)).toEqual({
        pos: 19,
        text: 'world',
      });
    });

    it('should return the text from the cursor to the next newline', () => {
      const {
        editorView: { state },
      } = getState(doc(p('before'), code_block()('{<>}hello\nworld\n')));
      expect(getEndOfCurrentLine(state)).toEqual({
        pos: 14,
        text: 'hello',
      });
    });
  });

  describe('#getLinesFromSelection', () => {
    it('should return the current line when cursor selection is in the middle of the line', () => {
      const {
        editorView: { state },
      } = getState(doc(code_block()('start\nmid{<>}dle\nend')));
      expect(getLinesFromSelection(state)).toEqual({
        text: 'middle',
        start: 7,
        end: 13,
      });
    });

    it('should return the current line when cursor selection is at the start of the line', () => {
      const {
        editorView: { state },
      } = getState(doc(code_block()('start\n{<>}middle\nend')));
      expect(getLinesFromSelection(state)).toEqual({
        text: 'middle',
        start: 7,
        end: 13,
      });
    });

    it('should return the current line when cursor selection is at the end of the line', () => {
      const {
        editorView: { state },
      } = getState(doc(code_block()('start\nmiddle{<>}\nend')));
      expect(getLinesFromSelection(state)).toEqual({
        text: 'middle',
        start: 7,
        end: 13,
      });
    });

    it('should return the neighbouring lines when selection only wraps a newline', () => {
      const {
        editorView: { state },
      } = getState(doc(code_block()('start{<}\n{>}middle\nend')));
      expect(getLinesFromSelection(state)).toEqual({
        text: 'start\nmiddle',
        start: 1,
        end: 13,
      });
    });

    it('should return the lines when selection is across multiple lines', () => {
      const {
        editorView: { state },
      } = getState(doc(code_block()('start{<}\nmiddle\ne{>}nd')));
      expect(getLinesFromSelection(state)).toEqual({
        text: 'start\nmiddle\nend',
        start: 1,
        end: 17,
      });
    });
  });

  describe('#forEachLine', () => {
    it('should execute the callback once for an empty line', () => {
      const callback = jest.fn();
      forEachLine('', callback);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toBeCalledWith('', 0);
    });

    it('should iterate over each line in a string and execute the callback', () => {
      const callback = jest.fn();
      forEachLine('start\nmiddle\nend\n!', callback);
      expect(callback).toHaveBeenCalledTimes(4);
      expect(callback).toHaveBeenCalledWith('start', 0);
      expect(callback).toHaveBeenCalledWith('middle', 6);
      expect(callback).toHaveBeenCalledWith('end', 13);
      expect(callback).toHaveBeenCalledWith('!', 17);
    });
  });

  describe('#getLineInfo', () => {
    it('should set `indentText` to empty string when line does not start with a space or tab', () => {
      expect(getLineInfo('hello world')).toEqual(
        expect.objectContaining({
          indentText: '',
        }),
      );
    });

    it('should default to using spaces as indent when line does not start with a tab', () => {
      expect(getLineInfo('hello world')).toEqual(
        expect.objectContaining({
          indentToken: expect.objectContaining({ token: ' ', size: 2 }),
        }),
      );
    });

    it('should set `indentText` to the spaces indentation at the start of the line', () => {
      expect(getLineInfo('      hello world')).toEqual(
        expect.objectContaining({
          indentText: '      ',
        }),
      );
    });

    it('should use spaces as indent when line does not starts with spaces', () => {
      expect(getLineInfo('  hello world')).toEqual(
        expect.objectContaining({
          indentToken: expect.objectContaining({ token: ' ', size: 2 }),
        }),
      );
    });

    it('should use tabs as indent when line starts with a tab', () => {
      expect(getLineInfo('\thello world')).toEqual(
        expect.objectContaining({
          indentToken: expect.objectContaining({ token: '\t', size: 1 }),
        }),
      );
    });

    it('should set `indentText` to the tab indentation at the start of the line', () => {
      expect(getLineInfo('\t\t\thello world')).toEqual(
        expect.objectContaining({
          indentText: '\t\t\t',
        }),
      );
    });
    it('should set `indentText` to an empty string when no indentation', () => {
      expect(getLineInfo('hello world')).toEqual(
        expect.objectContaining({
          indentText: '',
        }),
      );
    });
  });
});
