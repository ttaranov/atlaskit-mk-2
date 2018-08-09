import * as React from 'react';
import styled from 'styled-components';
import { NodeView } from 'prosemirror-view';
import ReactNodeView from '../../../nodeviews/ReactNodeView';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { ProviderFactory, EmojiAttributes } from '@atlaskit/editor-common';
import Emoji from '../../emoji/ui/Emoji';

// tslint:disable-next-line:variable-name
const EmojiWrapper = styled.span`
  display: inline-block;
  position: absolute;
  left: -25px;
`;

export interface Props {
  emojiBullet: EmojiAttributes;
  forwardRef: (ref: HTMLElement | null) => void;
  providerFactory: ProviderFactory;
}

class ListItemComponent extends React.Component<Props> {
  shouldComponentUpdate(nextProps) {
    return false;
  }

  render() {
    const { emojiBullet, forwardRef } = this.props;

    return (
      <>
        {emojiBullet && (
          <EmojiWrapper>
            <Emoji
              providers={this.props.providerFactory}
              id={emojiBullet.id}
              shortName={emojiBullet.shortName}
              fallback={emojiBullet.text}
            />
          </EmojiWrapper>
        )}
        <div ref={forwardRef} />
      </>
    );
  }
}

class ListItem extends ReactNodeView {
  createDomRef() {
    const domRef = document.createElement('li');
    domRef.setAttribute(
      'data-emojiBullet',
      JSON.stringify(this.node.attrs.emojiBullet),
    );
    return domRef;
  }

  getContentDOM() {
    const dom = document.createElement('div');
    dom.className = 'list-item-content-dom';
    return { dom };
  }

  render(props, forwardRef) {
    const { emojiBullet } = this.node.attrs;
    return (
      <ListItemComponent
        {...props}
        emojiBullet={emojiBullet}
        forwardRef={forwardRef}
      />
    );
  }

  update(node, decorations) {
    return false;
  }

  ignoreMutation(record: MutationRecord) {
    return true;
  }
}

export const listItemNodeView = (
  portalProviderAPI: PortalProviderAPI,
  providerFactory: ProviderFactory,
) => (node: any, view: any, getPos: () => number): NodeView => {
  return new ListItem(node, view, getPos, portalProviderAPI, {
    providerFactory,
  }).init();
};
