import * as React from 'react';
import styled from 'styled-components';
import { EditorView } from 'prosemirror-view';
import ProviderFactory from '../../../providerFactory';
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
}

export default class PluginSlot extends React.Component<Props, any> {
  shouldComponentUpdate(nextProps: Props) {
    const { editorView, items, providerFactory, eventDispatcher, popupsMountPoint, popupsBoundariesElement, disabled } = this.props;
    return !(nextProps.editorView === editorView
      && nextProps.items === items
      && nextProps.providerFactory === providerFactory
      && nextProps.eventDispatcher === eventDispatcher
      && nextProps.popupsMountPoint === popupsMountPoint
      && nextProps.popupsBoundariesElement === popupsBoundariesElement
      && nextProps.disabled === disabled
    );
  }

  render() {
    const { items, editorView, eventDispatcher, providerFactory, appearance, popupsMountPoint, popupsBoundariesElement, disabled } = this.props;

    if (!items) {
      return null;
    }

    return (
      <PluginsComponentsWrapper>
        {items.map((component, key) => {
          const element = component(editorView, eventDispatcher, providerFactory, appearance, popupsMountPoint, popupsBoundariesElement, disabled);
          return element && React.cloneElement(element, { key });
        })}
      </PluginsComponentsWrapper>
    );
  }
}
