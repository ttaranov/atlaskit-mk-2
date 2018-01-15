import { Component, ReactNode, MouseEvent, KeyboardEvent } from 'react';

type KeyboardOrMouseEvent = MouseEvent<any> | KeyboardEvent<any>;

interface Props {
  className?: string;
  isOpen?: boolean;
  header?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  height?: any;
  width?: string | number | 'small' | 'medium' | 'large' | 'x-large';
  onDialogDismissed?: (event: KeyboardOrMouseEvent) => void;
  onClose?: any;
  isChromeless?: any;
}

interface State {}

export default class ModalDialog extends Component<Props, State> {}

export class ModalHeader extends Component<any, any> {}
export class ModalFooter extends Component<any, any> {}
export class ModalTitle extends Component<any, any> {}
