import * as React from 'react';

export interface Props {
  table?: HTMLTableElement;
  top?: number;
  left?: number;
  width?: number;
}

export default class StickyHeader extends React.Component<Props> {
  private renderContent() {
    const { table } = this.props;
    if (!table) {
      return;
    }

    const clonedTable = table.cloneNode() as HTMLTableElement;
    const colgroup = table.querySelector('colgroup');
    if (colgroup) {
      clonedTable.appendChild(colgroup.cloneNode(true));
    }

    const tbody = document.createElement('tbody');
    clonedTable.appendChild(tbody);

    const thNode = table.querySelector('th');
    if (!thNode) {
      return;
    }

    const tableRow = thNode.parentNode!.cloneNode(true);
    tbody.appendChild(tableRow);

    clonedTable.style.marginTop = '0';

    return (
      <div
        className="pm-table-wrapper"
        dangerouslySetInnerHTML={{ __html: clonedTable.outerHTML }}
      />
    );
  }

  render() {
    const { table, left, top, width } = this.props;

    if (!table) {
      return <div />;
    }

    return (
      <div
        className="ProseMirror"
        style={{
          position: 'fixed',
          left,
          top,
          width,
          zIndex: 99999,
        }}
      >
        {this.renderContent()}
      </div>
    );
  }
}
