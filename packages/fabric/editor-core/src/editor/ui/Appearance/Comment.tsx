import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import Button, { ButtonGroup } from '@atlaskit/button';
import { akColorR100, akColorN40, akBorderRadius, akGridSize } from '@atlaskit/util-shared-styles';
import SizeDetector from '@atlaskit/size-detector';
import PluginSlot from '../PluginSlot';
import WithPluginState from '../WithPluginState';
import ContentStyles from '../ContentStyles';
import {
  EditorAppearanceComponentProps,
  EditorAppearance
} from '../../types';
import { pluginKey as maxContentSizePluginKey } from '../../plugins/max-content-size';
import EditorWidth from '../../../utils/editor-width';
import { ReactElement } from '../../types';


const pulseBackground = keyframes`
  50% {
    background-color: ${akColorR100};
  }
`;

const pulseBackgroundReverse = keyframes`
  0% {
    background-color: ${akColorR100};
  }
  50% {
    background-color: auto;
  }
  100% {
    background-color: ${akColorR100};
  }
`;

export interface CommentEditorProps {
  isMaxContentSizeReached?: boolean;
  maxHeight?: number;
}

// tslint:disable-next-line:variable-name
const CommentEditor: any = styled.div`
  display: flex;
  flex-direction: column;

  min-height: 30px;
  height: auto;
  ${(props: CommentEditorProps) => props.maxHeight ? 'max-height: ' + props.maxHeight + 'px;' : ''}

  background-color: white;
  border: 1px solid ${akColorN40};
  box-sizing: border-box;
  border-radius: ${akBorderRadius};

  max-width: inherit;
  box-sizing: border-box;
  word-wrap: break-word;

  animation: ${(props: any) => props.isMaxContentSizeReached ? `.25s ease-in-out ${pulseBackground}` : 'none'};

  &.-flash {
    animation: .25s ease-in-out ${pulseBackgroundReverse};
  }

  div > .ProseMirror {
    outline: none;
    white-space: pre-wrap;
    padding: 0;
    margin: 0;
  }
`;
CommentEditor.displayName = 'CommentEditor';

// tslint:disable-next-line:variable-name
const MainToolbar = styled.div`
  position: relative;
  align-items: center;
  padding: ${akGridSize} ${akGridSize} 0;
  display: flex;
  height: auto;

  & > div > *:first-child {
    margin-left: 0;
  }
`;
MainToolbar.displayName = 'MainToolbar';

// tslint:disable-next-line:variable-name
const MainToolbarCustomComponentsSlot = styled.span`
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
  > div {
    display: flex;
  }
`;
MainToolbarCustomComponentsSlot.displayName = 'MainToolbar';

// tslint:disable-next-line:variable-name
const ContentArea = styled(ContentStyles)`
  padding: 12px 20px;
  flex-grow: 1;
  overflow-x: hidden;
  overflow-y: auto;
`;
ContentArea.displayName = 'ContentArea';

// tslint:disable-next-line:variable-name
const SecondaryToolbar = styled.div`
  box-sizing: border-box;
  justify-content: flex-end;
  align-items: center;
  display: flex;
  padding: 12px 20px;
`;
SecondaryToolbar.displayName = 'SecondaryToolbar';

export interface EditorAppearanceComponentState {}

export default class Editor extends React.Component<EditorAppearanceComponentProps, EditorAppearanceComponentState> {

  static displayName = 'CommentEditorAppearance';

  private flashToggle = false;

  private appearance: EditorAppearance = 'comment';

  private handleRef = ref => {
    if (this.props.onUiReady) {
      this.props.onUiReady(ref);
    }
  }

  private handleSave = () => {
    if (this.props.editorView && this.props.onSave) {
      this.props.onSave(this.props.editorView);
    }
  }

  private handleCancel = () => {
    if (this.props.editorView && this.props.onCancel) {
      this.props.onCancel(this.props.editorView);
    }
  }

  private getCustomPrimaryToolbarComponents = (width: number): ReactElement | undefined => {
    const { customPrimaryToolbarComponents } = this.props;
    let componentWithWidth: ReactElement | undefined;
    if (customPrimaryToolbarComponents) {
      if (customPrimaryToolbarComponents instanceof Array) {
        componentWithWidth = customPrimaryToolbarComponents.map((elm, key) => {
          return elm && React.cloneElement(elm, { key, editorWidth: width });
        });
      } else {
        componentWithWidth = React.cloneElement(
          customPrimaryToolbarComponents,
          { editorWidth: width }
        );
      }
    }
    return componentWithWidth;
  }

  private renderChrome = ({ maxContentSize }) => {
    const {
      editorView,
      eventDispatcher,
      providerFactory,
      contentComponents,
      customContentComponents,
      primaryToolbarComponents,
      customSecondaryToolbarComponents,
      popupsMountPoint,
      popupsBoundariesElement,
      maxHeight,
      onSave, onCancel
    } = this.props;
    const maxContentSizeReached = maxContentSize && maxContentSize.maxContentSizeReached;
    this.flashToggle = maxContentSizeReached && !this.flashToggle;

    return (
      <SizeDetector>
      {({ width }) => (
        <CommentEditor
          className={this.flashToggle ? '-flash' : ''}
          isMaxContentSizeReached={maxContentSizeReached}
          maxHeight={maxHeight}
        >
          <MainToolbar>
            <PluginSlot
              editorWidth={width}
              editorView={editorView}
              eventDispatcher={eventDispatcher}
              providerFactory={providerFactory}
              appearance={this.appearance}
              items={primaryToolbarComponents}
              popupsMountPoint={popupsMountPoint}
              popupsBoundariesElement={popupsBoundariesElement}
            />
            <MainToolbarCustomComponentsSlot
              width={width && (width > EditorWidth.BreakPoint6 ? 'large' : 'small')}
            >
              {this.getCustomPrimaryToolbarComponents(width)}
            </MainToolbarCustomComponentsSlot>
          </MainToolbar>
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
          <SecondaryToolbar>
            <ButtonGroup>
              {!onSave ? null :
                <Button appearance="primary" onClick={this.handleSave}>Save</Button>
              }
              {!onCancel ? null :
                <Button appearance="subtle" onClick={this.handleCancel}>Cancel</Button>
              }
            </ButtonGroup>
            <span style={{ flexGrow: 1 }} />
            {customSecondaryToolbarComponents}
          </SecondaryToolbar>
        </CommentEditor>
      )}
      </SizeDetector>
    );
  }

  render() {
    const { eventDispatcher, editorView } = this.props;

    return (
      <WithPluginState
        editorView={editorView}
        eventDispatcher={eventDispatcher}
        plugins={{ maxContentSize: maxContentSizePluginKey }}
        render={this.renderChrome}
      />
    );
  }
}
