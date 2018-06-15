// @flow

import FocusMarshal from '../FocusMarshal';

const createBoundary = () => {
  const div = document.createElement('div');
  div.appendChild(createButton());
  return div;
};

const createButton = () => {
  const btn = document.createElement('button');
  btn.textContent = 'test';
  return btn;
};

test('restores focus', done => {
  const boundary = createBoundary();
  const marshal = new FocusMarshal();

  // Adding a lock is sync.
  marshal.addLock({ autoFocus: true, boundary });
  expect(marshal.storedElements.length).toBe(1);
  expect(marshal.storedElements[0]).toBe(document.body);
  expect(marshal.currentLock).toBe(boundary);

  // It doesn't refocus sync.
  marshal.clearLock({ shouldRestoreFocus: true });
  expect(marshal.storedElements.length).toBe(1);
  expect(marshal.storedElements[0]).toBe(document.body);
  expect(marshal.currentLock).toBe(null);
  setTimeout(() => {
    expect(marshal.storedElements.length).toBe(0);
    expect(marshal.currentLock).toBe(null);
    done();
  });
});
