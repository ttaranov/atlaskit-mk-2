import * as React from 'react';
import styled from 'styled-components';
import { akColorN30 } from '@atlaskit/util-shared-styles';
import PluginSlot from '../PluginSlot';
import { EditorAppearanceComponentProps, EditorAppearance } from '../../types';
import ContentStyles from '../ContentStyles';

// tslint:disable-next-line:variable-name
const FullPageEditorWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;
FullPageEditorWrapper.displayName = 'FullPageEditorWrapper';

// tslint:disable-next-line:variable-name
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

// tslint:disable-next-line:variable-name
const ContentArea = styled.div`
  height: 100%;
  width: 100%;
  max-width: 600px;
  padding-top: 50px;
  margin: 0 auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  & .ProseMirror {
    flex-grow: 1;
    box-sizing: border-box;
    padding-bottom: 50px;
  }
`;
ContentArea.displayName = 'ContentArea';

// tslint:disable-next-line:variable-name
const MainToolbar = styled.div`
  position: relative;
  align-items: center;
  border-bottom: 1px solid ${akColorN30};
  display: flex;
  height: 80px;

  & > div > * {
    margin-left: 4px;
  }

  & > div > *:first-child {
    margin-left: 0;
    margin-right: 8px;
  }
`;
MainToolbar.displayName = 'MainToolbar';

// tslint:disable-next-line:variable-name
const MainToolbarCustomComponentsSlot = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
`;
MainToolbarCustomComponentsSlot.displayName = 'MainToolbar';

// tslint:disable-next-line:variable-name
const SecondaryToolbar = styled.div`
  box-sizing: border-box;
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;
  display: flex;
  padding: 24px 0;
`;
SecondaryToolbar.displayName = 'SecondaryToolbar';

export default class Editor extends React.Component<EditorAppearanceComponentProps, any> {
  static displayName = 'FullPageEditor';
  private appearance: EditorAppearance = 'full-page';

  private handleRef = ref => {
    if (this.props.onUiReady) {
      this.props.onUiReady(ref);
    }
  }

  render() {
    const {
      editorView,
      eventDispatcher,
      providerFactory,
      contentComponents, primaryToolbarComponents,
      customPrimaryToolbarComponents, customContentComponents,
      popupsMountPoint, popupsBoundariesElement,
      disabled
    } = this.props;

    return (
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
          />
          <MainToolbarCustomComponentsSlot>
            {customPrimaryToolbarComponents}
          </MainToolbarCustomComponentsSlot>
        </MainToolbar>
        <ScrollContainer>
          <ContentArea innerRef={this.handleRef}>
            {customContentComponents}
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
    );
  }
}
