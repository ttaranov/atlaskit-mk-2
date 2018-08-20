jest.mock('../../editorViewLoader');
import editorViewLoader from '../../editorViewLoader';
const editorViewLoaderMock = jest.fn();
(editorViewLoader as any) = editorViewLoaderMock;

import * as React from 'react'; // eslint-disable-line
import { Component } from 'react';
import { shallow } from 'enzyme';
import { MainEditorView, MainEditorViewStateProps } from '../../mainEditorView';
import { ErrorView } from '../../errorView/errorView';
import { SpinnerView } from '../../spinnerView/spinnerView';

describe('MainEditorView', () => {
  class FakeEditorView extends Component<{}, {}> {
    render() {
      return <div>FakeEditorView</div>;
    }
  }

  const setup = (props?: Partial<MainEditorViewStateProps>) => {
    const editorLoaderPromise = Promise.resolve(FakeEditorView);
    editorViewLoaderMock.mockReset();
    editorViewLoaderMock.mockReturnValue(editorLoaderPromise);
    delete MainEditorView.EditorViewComponent;
    const binaryUploader: any = {};
    const onCloseEditor = jest.fn();
    const onShowEditorImage = jest.fn();
    const onShowEditorError = jest.fn();
    const onDeselectFile = jest.fn();
    const mainView = shallow(
      <MainEditorView
        binaryUploader={binaryUploader}
        editorData={{}}
        onCloseEditor={onCloseEditor}
        onShowEditorImage={onShowEditorImage}
        onShowEditorError={onShowEditorError}
        onDeselectFile={onDeselectFile}
        {...props}
      />,
    );

    return {
      mainView,
      editorLoaderPromise,
    };
  };

  describe('UI states', () => {
    it('should show spinner if no imageUrl, no error', () => {
      const { mainView } = setup();
      expect(mainView.find(SpinnerView)).toHaveLength(1);
      expect(mainView.find(ErrorView)).toHaveLength(0);
    });

    it('should show error if no imageUrl, but error defined', () => {
      const props = { editorData: { error: { message: 'some-message' } } };
      const { mainView } = setup(props);

      expect(mainView.find(SpinnerView)).toHaveLength(0);
      expect(mainView.find(ErrorView)).toHaveLength(1);
    });
  });

  describe('should dynamically load the EditorView', () => {
    it('should not load the EditorView if there is not editorData', () => {
      const { mainView } = setup({ editorData: undefined });

      expect(editorViewLoaderMock).toHaveBeenCalledTimes(0);
      expect(mainView.state('EditorViewComponent')).toBeUndefined();
    });

    it('should load the editorView when there is editorData', async () => {
      const { mainView, editorLoaderPromise } = setup({
        editorData: {
          imageUrl: 'some-image',
          originalFile: { id: 'some-id', name: 'some-name' },
        },
      });

      await editorLoaderPromise;
      expect(editorViewLoaderMock).toHaveBeenCalledTimes(1);
      expect(mainView.state('EditorViewComponent')).toEqual(FakeEditorView);
      mainView.update();
      expect(mainView.find(FakeEditorView)).toHaveLength(1);
    });
  });
});
