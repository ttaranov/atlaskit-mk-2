/**
 * This function will in browser context. Make sure you call `toJSON` otherwise you will get:
 * unknown error: Maximum call stack size exceeded
 * And, don't get too fancy with it ;)
 */
export const getDocFromElement = el => el.pmViewDesc.node.toJSON();
export const editorUrl =
  'http://localhost:9000/examples.html?groupId=editor&packageId=editor-core&exampleId';
export const editable = '.ProseMirror';

export const editors = [
  {
    name: 'comment',
    path: `${editorUrl}=comment`,
    placeholder: '[placeholder="What do you want to say?"]',
  },
  {
    name: 'fullpage',
    path: `${editorUrl}=full-page`,
    placeholder: 'p',
  },
];

export const clipboardHelper = `http://localhost:9000/examples.html?groupId=editor&packageId=editor-core&exampleId=clipboard-helper`;
