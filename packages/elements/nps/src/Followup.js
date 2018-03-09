//@flow
import React, { type Node } from 'react';
import Button from '@atlaskit/button';
import DropdownMenu, { DropdownItem } from '@atlaskit/dropdown-menu';
import Checkbox from '@atlaskit/checkbox';
import { type Role, type CanContact } from './NPS';
import { Header } from './common';
import { Section } from './styled/common';
import { Contact } from './styled/followup';

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
  strings: {
    title: Node,
    description: Node,
    optOut: Node,
    roleQuestion: Node,
    contactQuestion: string,
    done: Node,
    rolePlaceholder: string,
  },
  roles: Array<Role>,
  onRoleSelect: Role => void,
  onCanContactChange: CanContact => void,
  onSubmit: ({ role: Role | null, canContact: CanContact }) => void,
};

type State = {
  role: Role | null,
  canContact: CanContact,
};

export class Followup extends React.Component<Props, State> {
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
      strings,
      isDismissable,
      onDismiss,
      canOptOut,
      onOptOut,
      roles,
    } = this.props;
    return (
      <div>
        <Header
          title={strings.title}
          isDismissable
          onDismiss={onDismiss}
          canOptOut
          onOptOut={onOptOut}
          optOutLabel={strings.optOut}
        />
        <p>{strings.description}</p>
        <Section>
          <p>{this.props.strings.roleQuestion}</p>
          <RoleDropdown
            roles={roles}
            onRoleSelect={this.onRoleSelect}
            selected={this.state.role}
            placeholder={strings.rolePlaceholder}
          />
          <Contact>
            <Checkbox
              name="nps-contact-me"
              value="Can Contact"
              label={strings.contactQuestion}
              onChange={this.onCanContactChange}
            />
          </Contact>
        </Section>
        <Section>
          <Button appearance="primary" onClick={this.onSubmit}>
            {this.props.strings.done}
          </Button>
        </Section>
      </div>
    );
  }
}

export default Followup;
