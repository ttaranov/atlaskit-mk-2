import * as React from 'react';
import {
  StylelessFloatingToolbar,
  handlePositionCalculatedWith,
  getOffsetParent,
  getNearestNonTextNode,
  Coordinates,
} from '../../../ui/FloatingToolbar';

export interface Props {
  getNodeFromPos: (pos: number) => Node;
  getFixedCoordinatesFromPos: (pos: number) => Coordinates;

  searchFilter: string;
  showSnippetPanelAt: number;
  editorViewDOM: HTMLElement;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
}

const style = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  background: 'white',
  border: `#DFE1E6 1px solid`,
  borderRadius: 3,
  boxShadow: '0 3px 6px rgba(0, 0, 0, 0.2)',
  height: `350px`,
  width: `295px`,
  marginBottom: '8px',
};

export default class FloatingSnippetPanel extends React.Component<Props> {
  render() {
    const {
      getNodeFromPos,
      showSnippetPanelAt,
      editorViewDOM,
      popupsMountPoint,
      getFixedCoordinatesFromPos,
      popupsBoundariesElement,
    } = this.props;
    const target = getNodeFromPos(showSnippetPanelAt);
    const offsetParent = getOffsetParent(editorViewDOM, popupsMountPoint);
    const getFixedCoordinates = () =>
      getFixedCoordinatesFromPos(showSnippetPanelAt);
    const handlePositionCalculated = handlePositionCalculatedWith(
      offsetParent,
      target,
      getFixedCoordinates,
    );
    return (
      <StylelessFloatingToolbar
        target={getNearestNonTextNode(target)!}
        onPositionCalculated={handlePositionCalculated}
        popupsMountPoint={popupsMountPoint}
        popupsBoundariesElement={popupsBoundariesElement}
        offset={[0, 3]}
      >
        <div style={style as any}>Hello!</div>
      </StylelessFloatingToolbar>
    );
  }
}
