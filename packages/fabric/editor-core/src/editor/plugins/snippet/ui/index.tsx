import * as React from 'react';
import {
  StylelessFloatingToolbar,
  handlePositionCalculatedWith,
  getOffsetParent,
  getNearestNonTextNode,
  Coordinates,
} from '../../../../ui/FloatingToolbar';
import { PickerList, PickerScroll } from './styles';
import { Snippet } from './data';
import SnippetItem from './List';

export interface Props {
  getNodeFromPos: (pos: number) => Node;
  getFixedCoordinatesFromPos: (pos: number) => Coordinates;
  onSnippetSelected: (id: string) => void;
  getListOfSnippets: (query?: string) => Promise<Snippet[]>;

  searchFilter: string;
  showSnippetPanelAt: number;
  editorViewDOM: HTMLElement;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
}

export interface State {
  snippets: Snippet[];
  error?: boolean;
}

export default class FloatingSnippetPanel extends React.Component<
  Props,
  State
> {
  state: State = { snippets: [] };

  componentDidMount() {
    this.props
      .getListOfSnippets(this.props.searchFilter)
      .then(results => {
        this.setState({ snippets: results, error: false });
      })
      .catch(() => this.setState({ error: true }));
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.searchFilter !== nextProps.searchFilter) {
      this.props
        .getListOfSnippets(this.props.searchFilter)
        .then(results => {
          this.setState({ snippets: results, error: false });
        })
        .catch(() => this.setState({ error: true }));
    }
    return true;
  }

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
        fitHeight={350}
        fitWidth={350}
        offset={[0, 3]}
      >
        <PickerList>
          <PickerScroll>
            {this.state.snippets.map(snippet => (
              <SnippetItem
                key={snippet.id}
                snippet={snippet}
                onSelection={s => this.props.onSnippetSelected(s.id)}
              />
            ))}
          </PickerScroll>
        </PickerList>
      </StylelessFloatingToolbar>
    );
  }
}
