import * as React from 'react';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { TranslationFunction } from 'i18next';
import { IconNames } from '../../shared/utils/iconNames';
import { ResourceKeys } from '../../../localization/resourceKeys';

export interface IpFilterMenuBarProps {
  isRevertDisabled: boolean;
  isSaveDisabled: boolean;
  onSaveClick: () => void;
  onRevertClick: () => void;
  onTestClick: () => void;
  t: TranslationFunction;
}

export class IpFilterMenuBar extends React.Component<IpFilterMenuBarProps, {}> {
    public render(): JSX.Element {
        const saveButtonProps = this.generateSaveButtonProps();
        const revertButtonProps = this.generateRevertButtonProps();
        const testButtonProps = this.generateTestButtonProps();

        return (
            <CommandBar
                items={[saveButtonProps, revertButtonProps, testButtonProps]}
                overflowItems={[]}
                farItems={[]}
                ariaLabel={this.props.t(ResourceKeys.ipFilter.commandBar.ariaLabel)}
                className="iot-commandBar"
            />
        );
    }

    private generateSaveButtonProps(): ICommandBarItemProps {
        return {
            ariaLabel: this.props.t(ResourceKeys.ipFilter.saveButton.ariaLabel),
            className: 'ipFilter-save-button',
            disabled: this.props.isSaveDisabled,
            iconProps: {
                iconName: IconNames.Save
            },
            key: 'save',
            name: this.props.t(ResourceKeys.ipFilter.saveButton.name),
            onClick: this.saveClickHandler
        };
    }

    private generateRevertButtonProps(): ICommandBarItemProps {
        return {
            ariaLabel: this.props.t(ResourceKeys.ipFilter.revertButton.ariaLabel),
            className: 'ipFilter-revert-button',
            disabled: this.props.isRevertDisabled,
            iconProps: {
                iconName: IconNames.Undo
            },
            key: 'revert',
            name: this.props.t(ResourceKeys.ipFilter.revertButton.name),
            onClick: this.revertClickHandler
        };
    }

    private generateTestButtonProps(): ICommandBarItemProps {
        return {
            ariaLabel: this.props.t(ResourceKeys.ipFilter.testButton.ariaLabel),
            className: 'ipFilter-test-button',
            disabled: false,
            iconProps: {
                iconName: IconNames.TestCase
            },
            key: 'test',
            name: this.props.t(ResourceKeys.ipFilter.testButton.name),
            onClick: this.testClickHandler
        };
    }

    private testClickHandler = () => {
        this.props.onTestClick();
    }

    private saveClickHandler = () => {
        this.props.onSaveClick();
    }

    private revertClickHandler = () => {
        this.props.onRevertClick();
    }
}