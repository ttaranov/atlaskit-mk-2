declare module '@atlaskit/dynamic-table' {
  import { Component, ReactNode, ReactElement } from 'react';

  export type RowCellType = {
    readonly key?: string | number;
    readonly content: ReactNode;
  };

  export type StatelessProps = {
    readonly caption?: Node;
    readonly head?: HeadType;
    readonly rows?: Array<RowType>;
    readonly emptyView?: ReactElement<any>;
    readonly loadingSpinnerSize?: LoadingSpinnerSizeType;
    readonly isLoading?: boolean;
    readonly isFixedSize?: boolean;
    readonly rowsPerPage?: number;
    readonly onSetPage: Function;
    readonly onSort: Function;
    readonly page?: number;
    readonly sortKey?: string;
    readonly sortOrder?: SortOrderType;
  };

  export type RowType = {
    readonly cells: Array<RowCellType>;
  };

  export type SortOrderType = 'ASC' | 'DESC';

  export type SpinnerSizeType = 'small' | 'medium' | 'large' | 'xlarge';

  export type LoadingSpinnerSizeType = 'small' | 'large';

  export type HeadCellType = RowCellType & {
    readonly isSortable?: boolean;
    readonly width?: number;
    readonly shouldTruncate?: boolean;
  };

  export type HeadType = {
    readonly cells: Array<HeadCellType>;
  };

  export type DynamicTableStatelessProps = StatelessProps;

  export class DynamicTableStateless extends Component<
    DynamicTableStatelessProps
  > {}

  export type DynamicTableProps = {
    readonly defaultPage: number;
    readonly defaultSortKey?: string;
    readonly defaultSortOrder?: SortOrderType;
  } & StatelessProps;

  export type DynamicTableState = {
    readonly page: number;
    readonly sortKey?: string;
    readonly sortOrder?: SortOrderType;
  };

  class DynamicTable extends Component<DynamicTableProps, DynamicTableState> {}

  export default DynamicTable;
}
