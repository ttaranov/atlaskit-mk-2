import { EditorView } from 'prosemirror-view';
import { Node } from 'prosemirror-model';
import rafSchedule from 'raf-schd';

const MATCH_NEWLINES = new RegExp('\n', 'g');

export class CodeBlockView {
  node: Node;
  dom: HTMLPreElement;
  contentDOM: HTMLElement;
  lineNumberGutter: HTMLElement;

  constructor(node: Node, view: EditorView, getPos: () => number) {
    this.node = node;
    this.dom = document.createElement('pre');
    this.contentDOM = document.createElement('code');
    this.contentDOM.setAttribute('data-language', node.attrs.language);
    this.contentDOM.setAttribute('spellcheck', 'false');

    this.lineNumberGutter = document.createElement('div');
    this.lineNumberGutter.setAttribute('contenteditable', 'false');
    this.lineNumberGutter.classList.add('line-numbers');

    this.dom.appendChild(this.lineNumberGutter);
    this.dom.appendChild(this.contentDOM);
    this.ensureLineNumbers();
  }

  private ensureLineNumbers = rafSchedule(() => {
    let lines = 1;
    this.node.forEach(node => {
      const text = node.text;
      if (text) {
        lines += (node.text!.match(MATCH_NEWLINES) || []).length;
      }
    });

    while (this.lineNumberGutter.childElementCount < lines) {
      this.lineNumberGutter.appendChild(document.createElement('span'));
    }
    while (this.lineNumberGutter.childElementCount > lines) {
      this.lineNumberGutter.removeChild(this.lineNumberGutter.lastChild!);
    }
  });

  update(node: Node) {
    if (node.type !== this.node.type) return false;
    if (node !== this.node) {
      if (node.attrs.language !== this.node.attrs.language) {
        this.contentDOM.setAttribute('data-language', node.attrs.language);
      }
      this.node = node;
      this.ensureLineNumbers();
    }
    return true;
  }

  ignoreMutation(record: MutationRecord) {
    // Ensure updating the line-number gutter doesn't trigger reparsing the codeblock
    return (
      record.target === this.lineNumberGutter ||
      record.target.parentNode === this.lineNumberGutter
    );
  }
}

export default (node: Node, view: EditorView, getPos: () => number) =>
  new CodeBlockView(node, view, getPos);
