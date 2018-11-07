import * as React from 'react';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { TranslationFunction } from 'i18next';
import { IconNames } from '../../shared/utils/iconNames';
import { ResourceKeys } from '../../../localization/resourceKeys';

export interface AzureSubscriptionsMenuBarProps {
  onRefreshClick: () => void;
  refreshDisabled: boolean;
  t: TranslationFunction;
}

export class AzureSubscriptionsMenuBar extends React.Component<AzureSubscriptionsMenuBarProps, {}> {
    public render(): JSX.Element {
        const refreshButtonProps = this.generateRefreshButtonProps();

        return (
            <CommandBar
                items={[refreshButtonProps]}
                overflowItems={[]}
                farItems={[]}
                ariaLabel={this.props.t(ResourceKeys.azureSubscriptions.commandBar.ariaLabel)}
            />
        );
    }

    private generateRefreshButtonProps(): ICommandBarItemProps {
        return {
            ariaLabel: this.props.t(ResourceKeys.azureSubscriptions.commandBar.refresh.ariaLabel),
            disabled: this.props.refreshDisabled,
            iconProps: {
                iconName: IconNames.Refresh
            },
            key: 'refresh',
            name: this.props.t(ResourceKeys.common.refresh),
            onClick: this.refreshClickHandler
        };
    }

    private refreshClickHandler = () => {
        this.props.onRefreshClick();
    }
}