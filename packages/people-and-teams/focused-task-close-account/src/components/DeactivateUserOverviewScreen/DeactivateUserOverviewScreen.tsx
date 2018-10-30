import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '@atlaskit/button';
import SectionMessage from '@atlaskit/section-message';
import InfoIcon from '@atlaskit/icon/glyph/info';

import { commonMessages, deactivateOverviewMessages } from '../../messages';
import StatefulInlineDialog from '../StatefulInlineDialog';
import UserInfo from '../UserInfo';
import { DeactivateUserOverviewScreenProps } from './types';
import * as Styled from './styled';

/**
 * Copy not final - ROCKET-1610
 * i18n yet to be applied - ROCKET-1610
 */

export class DeactivateUserOverviewScreen extends React.Component<
  DeactivateUserOverviewScreenProps
> {
  static defaultProps: Partial<DeactivateUserOverviewScreenProps> = {
    isCurrentUser: false,
  };

  selectAdminOrSelfCopy = (adminCopy, selfCopy) => {
    return this.props.isCurrentUser ? selfCopy : adminCopy;
  };

  render() {
    const { accessibleSites, user } = this.props;

    return (
      <Styled.Screen>
        <Styled.Title>
          <FormattedMessage {...deactivateOverviewMessages.heading} />
        </Styled.Title>
        <FormattedMessage
          {...this.selectAdminOrSelfCopy(
            deactivateOverviewMessages.paragraphAboutToDeactivateAdmin,
            deactivateOverviewMessages.paragraphAboutToDeactivateSelf,
          )}
        />
        <UserInfo user={user} />
        <FormattedMessage
          {...this.selectAdminOrSelfCopy(
            deactivateOverviewMessages.paragraphWhenDeactivateAccountAdmin,
            deactivateOverviewMessages.paragraphWhenDeactivateAccountSelf,
          )}
        />
        <Styled.MainInformationList>
          <li>
            <FormattedMessage
              {...this.selectAdminOrSelfCopy(
                deactivateOverviewMessages.paragraphLoseAccessAdmin,
                deactivateOverviewMessages.paragraphLoseAccessSelf,
              )}
              values={{ fullName: user.fullName }}
            />
            <Styled.AccessibleSitesList>
              {accessibleSites.map((url, idx) => <li key={idx}>{url}</li>)}
            </Styled.AccessibleSitesList>
            <FormattedMessage
              {...this.selectAdminOrSelfCopy(
                deactivateOverviewMessages.paragraphLoseAccessFootnoteAdmin,
                deactivateOverviewMessages.paragraphLoseAccessFootnoteSelf,
              )}
              tagName="small"
            />
          </li>
          <li>
            <FormattedMessage
              {...this.selectAdminOrSelfCopy(
                deactivateOverviewMessages.paragraphContentCreatedAdmin,
                deactivateOverviewMessages.paragraphContentCreatedSelf,
              )}
            />{' '}
            <Styled.InfoIconWrapper>
              <StatefulInlineDialog
                placement="auto-start"
                content={
                  <FormattedMessage
                    {...this.selectAdminOrSelfCopy(
                      deactivateOverviewMessages.inlineDialogContentCreatedAdmin,
                      deactivateOverviewMessages.inlineDialogContentCreatedSelf,
                    )}
                  />
                }
              >
                <InfoIcon label="" size="small" />
              </StatefulInlineDialog>
            </Styled.InfoIconWrapper>
          </li>
          <li>
            <FormattedMessage
              {...this.selectAdminOrSelfCopy(
                deactivateOverviewMessages.paragraphNoLongerBilledAdmin,
                deactivateOverviewMessages.paragraphNoLongerBilledSelf,
              )}
            />
          </li>
        </Styled.MainInformationList>
        <FormattedMessage
          {...this.selectAdminOrSelfCopy(
            deactivateOverviewMessages.paragraphReactivateAtAnyTimeAdmin,
            deactivateOverviewMessages.paragraphReactivateAtAnyTimeSelf,
          )}
        />
      </Styled.Screen>
    );
  }
}

export default DeactivateUserOverviewScreen;
