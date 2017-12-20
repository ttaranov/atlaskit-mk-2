import * as React from 'react';
import styled from 'styled-components';
import { akColorN30 } from '@atlaskit/util-shared-styles';
import SizeDetector from '@atlaskit/size-detector';
import PluginSlot from '../PluginSlot';
import { EditorAppearanceComponentProps, EditorAppearance } from '../../types';
import ContentStyles from '../ContentStyles';
import Avatars from '../../plugins/collab-edit/ui/avatars';

const FullPageEditorWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;
FullPageEditorWrapper.displayName = 'FullPageEditorWrapper';

const ScrollContainer = styled(ContentStyles)`
  flex-grow: 1;
  overflow-y: scroll;
  overflow-x: hidden;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
`;
ScrollContainer.displayName = 'ScrollContainer';

const ContentArea = styled.div`
  height: 100%;
  width: 100%;
  padding-top: 50px;
  margin: 0 auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  & .ProseMirror {
    flex-grow: 1;
    box-sizing: border-box;
    padding-bottom: 55px;
  }

  && .ProseMirror > * {
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  & .ProseMirror .table-decoration {
    left: 0;
  }

  & .ProseMirror table {
    margin-left: 0;
    margin-right: 0;
    width: 100%;
  }
`;
ContentArea.displayName = 'ContentArea';

const ContentAreaCustomComponentsSlot = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;
ContentAreaCustomComponentsSlot.displayName = 'ContentAreaCustomComponentsSlot';

const MainToolbar = styled.div`
  position: relative;
  align-items: center;
  border-bottom: 1px solid ${akColorN30};
  display: flex;
  height: 80px;
`;
MainToolbar.displayName = 'MainToolbar';

const MainToolbarCustomComponentsSlot = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
`;
MainToolbarCustomComponentsSlot.displayName = 'MainToolbar';

const SecondaryToolbar = styled.div`
  box-sizing: border-box;
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;
  display: flex;
  padding: 24px 0;
`;
SecondaryToolbar.displayName = 'SecondaryToolbar';

export default class Editor extends React.Component<
  EditorAppearanceComponentProps,
  any
> {
  static displayName = 'FullPageEditor';
  private appearance: EditorAppearance = 'full-page';

  private handleRef = ref => {
    if (this.props.onUiReady) {
      this.props.onUiReady(ref);
    }
  };

  render() {
    const {
      editorView,
      eventDispatcher,
      providerFactory,
      primaryToolbarComponents,
      contentComponents,
      customPrimaryToolbarComponents,
      customContentComponents,
      popupsMountPoint,
      popupsBoundariesElement,
      disabled,
    } = this.props;

    return (
      <SizeDetector>
        {({ width }) => (
          <FullPageEditorWrapper>
            <MainToolbar>
              <PluginSlot
                editorView={editorView}
                eventDispatcher={eventDispatcher}
                providerFactory={providerFactory}
                appearance={this.appearance}
                items={primaryToolbarComponents}
                popupsMountPoint={popupsMountPoint}
                popupsBoundariesElement={popupsBoundariesElement}
                disabled={disabled}
                editorWidth={width}
              />
              <MainToolbarCustomComponentsSlot>
                <Avatars
                  editorView={editorView}
                  eventDispatcher={eventDispatcher}
                />
                {customPrimaryToolbarComponents}
              </MainToolbarCustomComponentsSlot>
            </MainToolbar>
            <ScrollContainer>
              <ContentArea innerRef={this.handleRef}>
                <ContentAreaCustomComponentsSlot>
                  {customContentComponents}
                </ContentAreaCustomComponentsSlot>
                <PluginSlot
                  editorView={editorView}
                  eventDispatcher={eventDispatcher}
                  providerFactory={providerFactory}
                  appearance={this.appearance}
                  items={contentComponents}
                  popupsMountPoint={popupsMountPoint}
                  popupsBoundariesElement={popupsBoundariesElement}
                />
              </ContentArea>
            </ScrollContainer>
          </FullPageEditorWrapper>
        )}
      </SizeDetector>
    );
  }
}
