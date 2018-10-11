type ResultData = {
  resultId: string | number;
  type: string;
};

export interface ResultBase {
  elemAfter?: JSX.Element;
  href?: string;
  target?: string;
  isCompact?: boolean;
  isSelected?: boolean;
  onClick?: (resultData: ResultData) => any;
  resultId: string | number;
  type: string;
}
