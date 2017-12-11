import * as React from 'react'; // eslint-disable-line
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { MainEditorView } from '../../../../../src/popup/components/views/editor/mainEditorView';
import { ErrorView } from '../../../../../src/popup/components/views/editor/errorView/errorView';
import { SpinnerView } from '../../../../../src/popup/components/views/editor/spinnerView/spinnerView';

describe('MainEditorView', () => {
  const binaryUploader: any = {};
  const onCloseEditor = jest.fn();
  const onShowEditorImage = jest.fn();
  const onShowEditorError = jest.fn();
  const onDeselectFile = jest.fn();

  it('should show spinner if no imageUrl, no error', () => {
    const mainView = shallow(
      <MainEditorView
        binaryUploader={binaryUploader}
        editorData={{}}
        onCloseEditor={onCloseEditor}
        onShowEditorImage={onShowEditorImage}
        onShowEditorError={onShowEditorError}
        onDeselectFile={onDeselectFile}
      />,
    );
    expect(mainView.find(SpinnerView)).to.have.length(1);
    expect(mainView.find(ErrorView)).to.have.length(0);
  });

  it('should show error if no imageUrl, but error defined', () => {
    const error = { message: 'some-message' };

    const mainView = shallow(
      <MainEditorView
        binaryUploader={binaryUploader}
        editorData={{ error }}
        onCloseEditor={onCloseEditor}
        onShowEditorImage={onShowEditorImage}
        onShowEditorError={onShowEditorError}
        onDeselectFile={onDeselectFile}
      />,
    );
    expect(mainView.find(SpinnerView)).to.have.length(0);
    expect(mainView.find(ErrorView)).to.have.length(1);
  });
});
