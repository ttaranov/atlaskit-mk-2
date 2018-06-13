import * as React from 'react';
import styled from 'styled-components';
import { EditorView } from 'prosemirror-view';
import { borderRadius, colors } from '@atlaskit/theme';
import { Popup } from '@atlaskit/editor-common';
import { TypeAheadItemsList } from './TypeAheadItemsList';
import { selectByIndex } from '../commands/select-item';
import { TypeAheadItem } from '../types';

export const TypeAheadContent: React.ComponentClass<
  React.HTMLAttributes<{}>
> = styled.div`
  background: white;
  border: 1px solid ${() => colors.N40};
  border-radius: ${() => borderRadius() + 'px'};
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  color: #333;
  width: 340px;
`;

export type TypeAheadProps = {
  active: boolean;
  items?: Array<TypeAheadItem>;
  isLoading?: boolean;
  currentIndex: number;
  editorView: EditorView;
  anchorElement?: HTMLElement;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
};

export function TypeAhead({
  active,
  items,
  isLoading,
  anchorElement,
  currentIndex,
  editorView,
  popupsMountPoint,
  popupsBoundariesElement,
  popupsScrollableElement,
}: TypeAheadProps) {
  if (!active || !anchorElement || !items || !items.length) {
    return null;
  }

  return (
    <Popup
      target={anchorElement}
      mountTo={popupsMountPoint}
      boundariesElement={popupsBoundariesElement}
      scrollableElement={popupsScrollableElement}
      fitHeight={300}
      fitWidth={340}
    >
      <TypeAheadContent>
        {Array.isArray(items) ? (
          <TypeAheadItemsList
            insertByIndex={index =>
              selectByIndex(index)(editorView.state, editorView.dispatch)
            }
            items={items}
            currentIndex={currentIndex}
          />
        ) : !items && isLoading ? (
          'loading...'
        ) : (
          'no items'
        )}
      </TypeAheadContent>
    </Popup>
  );
}
