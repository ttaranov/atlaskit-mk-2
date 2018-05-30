import * as React from 'react';
import PanelTextInput from '../../../../ui/PanelTextInput';
import FloatingToolbar, {
  handlePositionCalculatedWith,
  getOffsetParent,
  getNearestNonTextNode,
  Coordinates,
} from '../../../../ui/FloatingToolbar';

export interface Props {
  getNodeFromPos: (pos: number) => Node;
  getFixedCoordinatesFromPos: (pos: number) => Coordinates;
  insertPlaceholder: (value: string) => void;
  hidePlaceholderFloatingToolbar: () => void;
  setFocusInEditor: () => void;

  showInsertPanelAt: number;
  editorViewDOM: HTMLElement;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
}

export default class PlaceholderFloatingToolbar extends React.Component<Props> {
  handleSubmit = (value?: string) => {
    if (value) {
      this.props.insertPlaceholder(value);
      this.props.setFocusInEditor();
    } else {
      this.props.hidePlaceholderFloatingToolbar();
    }
  };

  handleBlur = () => {
    this.props.hidePlaceholderFloatingToolbar();
  };

  render() {
    const {
      getNodeFromPos,
      showInsertPanelAt,
      editorViewDOM,
      popupsMountPoint,
      getFixedCoordinatesFromPos,
      popupsBoundariesElement,
    } = this.props;
    const target = getNodeFromPos(showInsertPanelAt);
    const offsetParent = getOffsetParent(editorViewDOM, popupsMountPoint);
    const getFixedCoordinates = () =>
      getFixedCoordinatesFromPos(showInsertPanelAt);
    const handlePositionCalculated = handlePositionCalculatedWith(
      offsetParent,
      target,
      getFixedCoordinates,
    );
    return (
      <FloatingToolbar
        target={getNearestNonTextNode(target)!}
        onPositionCalculated={handlePositionCalculated}
        popupsMountPoint={popupsMountPoint}
        popupsBoundariesElement={popupsBoundariesElement}
        fitHeight={32}
        offset={[0, 12]}
      >
        <PanelTextInput
          placeholder="Add placeholder text"
          onSubmit={this.handleSubmit}
          onBlur={this.handleBlur}
          autoFocus
          width={300}
        />
      </FloatingToolbar>
    );
  }
}
