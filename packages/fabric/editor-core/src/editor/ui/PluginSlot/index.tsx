import * as React from 'react';
import styled from 'styled-components';
import { EditorView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common';
import { EditorAppearance } from '../../types';
import { EventDispatcher } from '../../event-dispatcher';

// tslint:disable-next-line:variable-name
const PluginsComponentsWrapper = styled.div`
  display: flex;
`;

export interface Props {
  items?: any[];
  editorView?: EditorView;
  eventDispatcher?: EventDispatcher;
  providerFactory: ProviderFactory;
  appearance: EditorAppearance;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  disabled?: boolean;
  editorWidth?: number;
}

export default class PluginSlot extends React.Component<Props, any> {
  shouldComponentUpdate(nextProps: Props) {
    const {
      editorView,
      items,
      providerFactory,
      eventDispatcher,
      popupsMountPoint,
      popupsBoundariesElement,
      disabled,
      editorWidth,
    } = this.props;
    return !(
      nextProps.editorView === editorView &&
      nextProps.items === items &&
      nextProps.providerFactory === providerFactory &&
      nextProps.eventDispatcher === eventDispatcher &&
      nextProps.popupsMountPoint === popupsMountPoint &&
      nextProps.popupsBoundariesElement === popupsBoundariesElement &&
      nextProps.disabled === disabled &&
      nextProps.editorWidth === editorWidth
    );
  }

  render() {
    const {
      items,
      editorWidth,
      editorView,
      eventDispatcher,
      providerFactory,
      appearance,
      popupsMountPoint,
      popupsBoundariesElement,
      disabled,
    } = this.props;

    if (!items) {
      return null;
    }

    return (
      <PluginsComponentsWrapper>
        {items.map((component, key) => {
          const props: any = { key };
          if (editorWidth) {
            props.editorWidth = editorWidth;
          }
          const element = component(
            editorView,
            eventDispatcher,
            providerFactory,
            appearance,
            popupsMountPoint,
            popupsBoundariesElement,
            disabled,
            editorWidth,
          );
          return element && React.cloneElement(element, props);
        })}
      </PluginsComponentsWrapper>
    );
  }
}
