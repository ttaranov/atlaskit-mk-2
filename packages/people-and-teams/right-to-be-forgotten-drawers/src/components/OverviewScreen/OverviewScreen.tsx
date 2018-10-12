import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button, { ButtonGroup } from '@atlaskit/button';
import SectionMessage from '@atlaskit/section-message';
import InfoIcon from '@atlaskit/icon/glyph/info';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import Spinner from '@atlaskit/spinner';

import { commonMessages, overviewMessages } from '../../messages';
import StatefulInlineDialog from '../StatefulInlineDialog';
import UserInfo from '../UserInfo';
import { OverviewScreenProps } from './types';
import * as Styled from './styled';

type Props = OverviewScreenProps;

/**
 * Copy not final - ROCKET-1610
 * i18n yet to be applied - ROCKET-1610
 */

export class OverviewScreen extends React.Component<Props> {
  componentDidMount() {
    const { getAccessibleSites, user } = this.props;
    getAccessibleSites(user.id);
  }

  static defaultProps: Partial<Props> = {
    isCurrentUser: false,
  };

  selectAdminOrSelfCopy = (adminCopy, selfCopy) => {
    return this.props.isCurrentUser ? selfCopy : adminCopy;
  };

  render() {
    const { accessibleSites, onCancel, onNext, user, isLoading } = this.props;

    if (isLoading) {
      return (
        <Styled.LoadingWrapper>
          <Spinner size="large" />
        </Styled.LoadingWrapper>
      );
    }

    if (!accessibleSites) {
      return null;
    }

    return (
      <Styled.Screen>
        <Styled.Title>
          <FormattedMessage {...overviewMessages.heading} />
        </Styled.Title>
        <UserInfo user={user} />
        <Styled.SectionMessageOuter>
          <SectionMessage appearance="warning">
            <FormattedMessage {...overviewMessages.warningSectionBody} />
            <p>
              <a href="#">
                <FormattedMessage {...commonMessages.deactivateAccount} />
              </a>
            </p>
          </SectionMessage>
        </Styled.SectionMessageOuter>
        <FormattedMessage
          {...this.selectAdminOrSelfCopy(
            overviewMessages.paragraphAboutToDeleteAdmin,
            overviewMessages.paragraphAboutToDeleteSelf,
          )}
        />
        <Styled.MainInformationList>
          <li>
            <FormattedMessage
              {...this.selectAdminOrSelfCopy(
                overviewMessages.paragraphLoseAccessAdmin,
                overviewMessages.paragraphLoseAccessSelf,
              )}
              values={{ fullName: user.fullName }}
            />
            <Styled.AccessibleSitesList>
              {accessibleSites.sites.map(({ url }, idx) => (
                <li key={idx}>{url}</li>
              ))}
            </Styled.AccessibleSitesList>
            <FormattedMessage
              {...this.selectAdminOrSelfCopy(
                overviewMessages.paragraphLoseAccessFootnoteAdmin,
                overviewMessages.paragraphLoseAccessFootnoteSelf,
              )}
              tagName="small"
            />
          </li>
          <li>
            <FormattedMessage
              {...this.selectAdminOrSelfCopy(
                overviewMessages.paragraphContentCreatedAdmin,
                overviewMessages.paragraphContentCreatedSelf,
              )}
            />{' '}
            <Styled.InfoIconWrapper>
              <StatefulInlineDialog
                position="top left"
                content={
                  <FormattedMessage
                    {...this.selectAdminOrSelfCopy(
                      overviewMessages.inlineDialogContentCreatedAdmin,
                      overviewMessages.inlineDialogContentCreatedSelf,
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
                overviewMessages.paragraphPersonalDataWillBeDeletedAdmin,
                overviewMessages.paragraphPersonalDataWillBeDeletedSelf,
              )}
            />
            <FormattedMessage
              {...overviewMessages.paragraphPersonalDataWillBeDeletedFootnote}
              tagName="small"
            />{' '}
            <Styled.InfoIconWrapper>
              <StatefulInlineDialog
                position="top left"
                content={
                  <div>
                    <FormattedMessage
                      {...this.selectAdminOrSelfCopy(
                        overviewMessages.inlineDialogDataWillBeDeletedP1Admin,
                        overviewMessages.inlineDialogDataWillBeDeletedP1Self,
                      )}
                      tagName="p"
                    />
                    <FormattedMessage
                      {...this.selectAdminOrSelfCopy(
                        overviewMessages.inlineDialogDataWillBeDeletedP2Admin,
                        overviewMessages.inlineDialogDataWillBeDeletedP2Self,
                      )}
                      tagName="p"
                    />
                  </div>
                }
              >
                <InfoIcon label="" size="small" />
              </StatefulInlineDialog>
            </Styled.InfoIconWrapper>
          </li>
        </Styled.MainInformationList>
        <Styled.Footer>
          <Button appearance="subtle-link">
            <FormattedMessage {...commonMessages.learnMore} />{' '}
            <ShortcutIcon size="small" label="" />
          </Button>
          <ButtonGroup>
            <Button onClick={onCancel}>
              <FormattedMessage {...commonMessages.cancel} />
            </Button>
            <Button appearance="primary" onClick={onNext}>
              <FormattedMessage {...commonMessages.next} />
            </Button>
          </ButtonGroup>
        </Styled.Footer>
      </Styled.Screen>
    );
  }
}

export default OverviewScreen;
