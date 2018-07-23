// @flow
import React from 'react';
import { shallow, mount } from 'enzyme';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import AkButton from '@atlaskit/button';
import { Presence } from '@atlaskit/avatar';
import AkProfilecardResourced, { AkProfilecard, AkProfileClient } from '../..';
import ErrorMessage from '../../components/ErrorMessage';
import presences from '../../internal/presences';
import { FullNameLabel, ActionButtonGroup } from '../../styled/Card';

describe('Profilecard', () => {
  it('should export default AkProfilecardResourced', () => {
    expect(AkProfilecardResourced).toBeInstanceOf(Object);
  });

  it('should export named AkProfilecard and AkProfileClient', () => {
    expect(AkProfilecard).toBeInstanceOf(Object);
    expect(AkProfileClient).toBeInstanceOf(Object);
  });

  describe('AkProfilecard', () => {
    it('should be possible to create a component', () => {
      const card = shallow(<AkProfilecard />);
      expect(card.length).toBeGreaterThan(0);
    });

    describe('fullName property', () => {
      const fullName = 'This is an avatar!';
      const card = shallow(<AkProfilecard fullName={fullName} />);
      it('should show the full name on the card if property is set', () => {
        const el = card.find(FullNameLabel).dive();
        expect(el.text()).toBe(fullName);
      });

      it('should not render a card if full name is not set', () => {
        card.setProps({ fullName: undefined });
        expect(card.children()).toHaveLength(0);
      });
    });

    describe('presence property', () => {
      describe('presence properties should render label', () => {
        const presenceWithoutNone = Object.keys(presences).filter(
          p => p !== 'none',
        );

        presenceWithoutNone.forEach(presence => {
          it(`should render label with content ${presence}`, () => {
            const card = mount(
              <AkProfilecard fullName="name" presence={presence} />,
            );
            const el = card.find('IconLabel').first();
            expect(el.length).toBeGreaterThan(0);
            expect(el.text()).toBe(presences[presence]);
          });
        });
      });

      it('should not render a presence label if property is not set', () => {
        const card = mount(<AkProfilecard fullName="name" />);
        const el = card.find(Presence);
        expect(el.exists()).toBe(false);
      });
    });

    describe('presenceMessage property', () => {
      describe('presence properties should render presenceMessage if set', () => {
        const presenceWithoutNone = Object.keys(presences).filter(
          p => p !== 'none',
        );

        presenceWithoutNone.forEach(presence => {
          it(`should render label with content ${presence}`, () => {
            const card = mount(
              <AkProfilecard
                fullName="name"
                presence={presence}
                presenceMessage="Test message"
              />,
            );
            const el = card.find('IconLabel').first();
            expect(el.length).toBeGreaterThan(0);
            expect(el.text()).toBe('Test message');
          });
        });
      });

      it('should not render a presence label if presenceMessage is set but presence is not', () => {
        const card = mount(
          <AkProfilecard fullName="name" presenceMessage="Test message" />,
        );
        const el = card.find(Presence);
        expect(el.exists()).toBe(false);
      });
    });

    describe('isLoading property', () => {
      it('should render the LoadingMessage component', () => {
        const card = mount(<AkProfilecard isLoading />);
        expect(card.find('SpinnerContainer').length).toBe(1);
      });
    });

    describe('hasError property', () => {
      it('should render the ErrorMessage component', () => {
        const card = mount(<AkProfilecard hasError />);
        expect(card.find(ErrorMessage).length).toBe(1);
      });

      it('should render the ErrorMessage component with retry button if clientFetchProfile is provided', () => {
        const card = mount(
          <AkProfilecard hasError clientFetchProfile={() => {}} />,
        );
        const errorComponent = card.find(ErrorMessage);
        expect(errorComponent.length).toBe(1);
        expect(errorComponent.find(CrossCircleIcon).length).toBe(1);
        expect(errorComponent.find(AkButton).length).toBe(1);
      });
    });

    describe('actions property', () => {
      const actions = [
        {
          id: 'one',
          label: 'one',
        },
        {
          id: 'two',
          label: 'two',
        },
        {
          id: 'three',
          label: 'three',
        },
      ];
      const card = mount(<AkProfilecard fullName="name" actions={actions} />);

      it('should render an action button for every item in actions property', () => {
        const actionsWrapper = card.find(ActionButtonGroup);
        const buttonTexts = card
          .find(AkButton)
          .children()
          .map(node => node.text());

        expect(
          actionsWrapper
            .children()
            .first()
            .children(),
        ).toHaveLength(actions.length);
        expect(buttonTexts).toEqual(actions.map(action => action.label));
      });

      it('should call callback handler when action button is clicked', () => {
        const spy = jest.fn().mockImplementation(() => {}); // eslint-disable-line no-undef
        card.setProps({
          actions: [
            {
              label: 'test',
              callback: spy,
            },
          ],
        });
        const actionsWrapper = card.find(ActionButtonGroup);
        actionsWrapper
          .find(AkButton)
          .first()
          .simulate('click');
        expect(spy.mock.calls.length).toBe(1);
      });

      it('should not render any action buttons if actions property is not set', () => {
        card.setProps({ actions: undefined });
        const actionsWrapper = card.find(ActionButtonGroup);
        expect(actionsWrapper.children().length).toBe(0);
      });
    });
  });
});
