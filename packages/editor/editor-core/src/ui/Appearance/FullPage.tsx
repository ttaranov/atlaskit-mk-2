import * as React from 'react';
import styled from 'styled-components';
import { akColorN30 } from '@atlaskit/util-shared-styles';
import { akEditorFullPageMaxWidth } from '@atlaskit/editor-common';
import { EditorAppearanceComponentProps, EditorAppearance } from '../../types';
import Avatars from '../../plugins/collab-edit/ui/avatars';
import PluginSlot from '../PluginSlot';
import Toolbar from '../Toolbar';
import ContentStyles from '../ContentStyles';
import { ClickAreaBlock } from '../Addon';
import WidthDetector from '../WidthDetector';

const FullPageEditorWrapper = styled.div`
  min-width: 340px;
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
  max-width: ${akEditorFullPageMaxWidth}px;
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

  && .ProseMirror {
    & > * {
      clear: both;
    }
    & > p,
    & > ul,
    & > ol,
    > h1,
    > h2,
    > h3,
    > h4,
    > h5,
    > h6 {
      clear: none;
    }
  }
  & .ProseMirror .table-container table {
    margin-left: 0;
    margin-right: 0;
    width: 100%;
  }
`;
ContentArea.displayName = 'ContentArea';

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

  stopPropagation = (event: MouseEvent) => event.stopPropagation();

  render() {
    const {
      editorDOMElement,
      editorView,
      editorActions,
      eventDispatcher,
      providerFactory,
      primaryToolbarComponents,
      contentComponents,
      customPrimaryToolbarComponents,
      customContentComponents,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      disabled,
    } = this.props;

    return (
      <FullPageEditorWrapper>
        <MainToolbar>
          <Toolbar
            editorView={editorView!}
            editorActions={editorActions}
            eventDispatcher={eventDispatcher!}
            providerFactory={providerFactory}
            appearance={this.appearance}
            items={primaryToolbarComponents}
            popupsMountPoint={popupsMountPoint}
            popupsBoundariesElement={popupsBoundariesElement}
            popupsScrollableElement={popupsScrollableElement}
            disabled={!!disabled}
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
          <ClickAreaBlock editorView={editorView}>
            <ContentArea>
              {customContentComponents}
              {
                <PluginSlot
                  editorView={editorView}
                  editorActions={editorActions}
                  eventDispatcher={eventDispatcher}
                  providerFactory={providerFactory}
                  appearance={this.appearance}
                  items={contentComponents}
                  popupsMountPoint={popupsMountPoint}
                  popupsBoundariesElement={popupsBoundariesElement}
                  popupsScrollableElement={popupsScrollableElement}
                  disabled={!!disabled}
                />
              }
              <div onClick={this.stopPropagation}>{editorDOMElement}</div>
            </ContentArea>
          </ClickAreaBlock>
        </ScrollContainer>
        <WidthDetector editorView={editorView!} />
      </FullPageEditorWrapper>
    );
  }
}
