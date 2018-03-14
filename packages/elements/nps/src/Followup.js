//@flow
import React, { type Node } from 'react';
import Button from '@atlaskit/button';
import DropdownMenu, { DropdownItem } from '@atlaskit/dropdown-menu';
import Checkbox from '@atlaskit/checkbox';
import { type Role, type CanContact } from './NPS';
import { Header, Description } from './common';
import { Wrapper } from './styled/common';
import { Contact, RoleQuestion } from './styled/followup';

const RoleDropdown = ({
  roles,
  placeholder,
  selected,
  onRoleSelect,
}: {
  roles: Array<Role>,
  selected: Role | null,
  placeholder: string,
  onRoleSelect: Role => void,
}) => {
  const trigger = selected ? (selected: string) : placeholder;
  return (
    <DropdownMenu trigger={trigger} triggerType="button">
      {roles.map(role => (
        <DropdownItem
          key={`nps-item-${role}`}
          isSelected={role === selected}
          onClick={() => {
            onRoleSelect(role);
          }}
        >
          {role}
        </DropdownItem>
      ))}
    </DropdownMenu>
  );
};

export type Props = {
  messages: {
    title: Node,
    description: Node,
    optOut: Node,
    roleQuestion: Node,
    contactQuestion: string,
    send: Node,
    rolePlaceholder: string,
  },
  isDismissible: boolean,
  canOptOut: boolean,
  onDismiss: () => void,
  onOptOut: () => void,
  roles: Array<Role>,
  onRoleSelect: Role => void,
  onCanContactChange: CanContact => void,
  onSubmit: ({ role: Role | null, canContact: CanContact }) => void,
};

type State = {
  role: Role | null,
  canContact: CanContact,
};

export default class Followup extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      role: null,
      canContact: false,
    };
  }

  static defaultProps = {
    onRoleSelect: () => {},
    onCanContactChange: () => {},
  };

  onRoleSelect = (role: Role) => {
    this.setState({ role });
    this.props.onRoleSelect(role);
  };

  onCanContactChange = (e: any) => {
    const canContact = e.isChecked;
    this.setState({ canContact });
    this.props.onCanContactChange(canContact);
  };

  onSubmit = () => {
    const { role, canContact } = this.state;
    this.props.onSubmit({ role, canContact });
  };

  render() {
    const {
      messages,
      isDismissible,
      onDismiss,
      canOptOut,
      onOptOut,
      roles,
    } = this.props;
    return (
      <div>
        <Header
          title={messages.title}
          isDismissible={isDismissible}
          onDismiss={onDismiss}
          canOptOut={canOptOut}
          onOptOut={onOptOut}
          optOutLabel={messages.optOut}
        />
        <Description>{messages.description}</Description>
        <Wrapper>
          <RoleQuestion>{this.props.messages.roleQuestion}</RoleQuestion>
          <RoleDropdown
            roles={roles}
            onRoleSelect={this.onRoleSelect}
            selected={this.state.role}
            placeholder={messages.rolePlaceholder}
          />
          <Contact>
            <Checkbox
              name="nps-contact-me"
              value="Can Contact"
              label={messages.contactQuestion}
              onChange={this.onCanContactChange}
            />
          </Contact>
        </Wrapper>
        <Wrapper>
          <Button appearance="primary" onClick={this.onSubmit}>
            {messages.send}
          </Button>
        </Wrapper>
      </div>
    );
  }
}
