import { Component, FormEvent } from 'react';

export interface Props {
  autoComplete?: 'on' | 'off';
  form?: string;
  pattern?: string;
  autoFocus?: boolean;
  compact?: boolean;
  disabled?: boolean;
  id?: string;
  invalidMessage?: React.ReactNode;
  isLabelHidden?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  isSpellCheckEnabled?: boolean;
  label?: string;
  name?: string;
  min?: number;
  max?: number;
  maxLength?: number;
  onChange?: (event: FormEvent<HTMLInputElement>) => void;
  onBlur?: (event: FormEvent<HTMLInputElement>) => void;
  onFocus?: (event: FormEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: FormEvent<HTMLInputElement>) => void;
  onKeyPess?: (event: FormEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: FormEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  shouldFitContainer?: boolean;
  type?: string;
  value?: string;
}

export class FieldTextStateless extends Component<Props, {}> {}
export default class extends Component<Props, {}> {}
