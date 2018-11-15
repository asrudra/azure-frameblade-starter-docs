import * as React from 'react';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { TranslationFunction } from 'i18next';
import { IconNames } from '../../shared/utils/iconNames';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { LocalizationContextConsumer, LocationContextInterface } from '../../contexts/localizationContext';

export interface AzureSubscriptionsMenuBarProps {
  onRefreshClick: () => void;
  refreshDisabled: boolean;
}

export class AzureSubscriptionsMenuBar extends React.Component<AzureSubscriptionsMenuBarProps, {}> {
    public render(): JSX.Element {
        return (
            <LocalizationContextConsumer>
                {(context: LocationContextInterface) => (
                    <CommandBar
                        items={[this.generateRefreshButtonProps(context.t)]}
                        overflowItems={[]}
                        farItems={[]}
                        ariaLabel={context.t(ResourceKeys.azureSubscriptions.commandBar.ariaLabel)}
                    />
                )}
            </LocalizationContextConsumer>

        );
    }

    private generateRefreshButtonProps(t: TranslationFunction): ICommandBarItemProps {
        return {
            ariaLabel: t(ResourceKeys.azureSubscriptions.commandBar.refresh.ariaLabel),
            disabled: this.props.refreshDisabled,
            iconProps: {
                iconName: IconNames.Refresh
            },
            key: 'refresh',
            name: t(ResourceKeys.common.refresh),
            onClick: this.refreshClickHandler
        };
    }

    private refreshClickHandler = () => {
        this.props.onRefreshClick();
    }
}