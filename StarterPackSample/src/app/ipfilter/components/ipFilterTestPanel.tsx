import * as React from 'react';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { TranslationFunction } from 'i18next';
import { IpFilterActionType } from '@iotHubControlPlane/lib/models';
import { checkIpAddressInRange, validateIpAddress } from '../utilities/ipUtilities';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { IconNames } from '../../shared/utils/iconNames';
import { InternetProtocolFilterRuleViewModel } from '../viewModel/internetProtocolFilterRuleViewModel';

export interface IpFilterTestPanelProps {
    filterRuleViewModels: InternetProtocolFilterRuleViewModel[];
    onDismissClick: () => void;
    t: TranslationFunction;
}

interface IpFilterTestPanelState {
    affectedIpFilter: InternetProtocolFilterRuleViewModel | undefined;
    ipAddress: string;
    showResult: boolean;
    validationMessage: string;
}

export class IpFilterTestPanel extends React.Component<IpFilterTestPanelProps, IpFilterTestPanelState> {
    constructor(props: IpFilterTestPanelProps) {
        super(props);
        this.state = {
            affectedIpFilter: undefined,
            ipAddress: '',
            showResult: false,
            validationMessage: ''
        };
    }

    public render(): JSX.Element {
        return (
            <Panel
                className="iot-panel"
                isOpen={true}
                type={PanelType.medium}
                onDismiss={this.props.onDismissClick}
                headerText={this.props.t(ResourceKeys.ipFilter.testPanelMessages.headerText)}
            >
                {this.renderPanelContent()}
            </Panel>
        );
    }

    private renderPanelContent(): JSX.Element {
        return (
            <div>
                <p className="ipFilter-testPanel-description">
                    {this.props.t(ResourceKeys.ipFilter.testPanelMessages.description)}
                </p>
                <p className="ipFilter-testPanel-ipAddress-textField-label">
                    {this.props.t(ResourceKeys.ipFilter.testIpAddress.label)}
                </p>
                <TextField
                    className="ipFilter-testPanel-ipAddress-textField"
                    placeholder={this.props.t(ResourceKeys.ipFilter.testIpAddress.placeHolder)}
                    value={this.state.ipAddress}
                    onChanged={this.onChangeHandler}
                    errorMessage={this.state.validationMessage}
                />
                {this.renderButtonsContent()}
                <div className="ipFilter-testPanel-results">
                    {this.state.showResult && this.renderTestResult()}
                </div>
            </div>
        );
    }

    private renderTestResult(): JSX.Element {
        const { t } = this.props;
        const { affectedIpFilter } = this.state;
        if (!affectedIpFilter) {
            return (<p>{this.props.t(ResourceKeys.ipFilter.testPanelMessages.noMatch)}</p>);
        }

        const action = affectedIpFilter.filterRule.action === IpFilterActionType.Accept ? t(ResourceKeys.ipFilter.testPanelMessages.acceptedAction) : t(ResourceKeys.ipFilter.testPanelMessages.rejectedAction);
        return (
            <>
                {this.renderMatchFoundMessage(action)}
                {this.renderRowResult(affectedIpFilter)}
            </>
        );
    }

    private renderMatchFoundMessage(action: string): JSX.Element {
        const { t } = this.props;
        return (
            <p className="ipFilter-testPanel-results-match-found-message">
                <span>{t(ResourceKeys.ipFilter.testPanelMessages.matches.prefix)}</span>
                <span className="ipFilter-testPanel-results-action-name">{` ${action} `}</span>
                <span>{t(ResourceKeys.ipFilter.testPanelMessages.matches.suffix)}</span>
            </p>
        );
    }

    private renderRowResult(filterRuleViewModel: InternetProtocolFilterRuleViewModel): JSX.Element {
        const actionIcon = filterRuleViewModel.filterRule.action === IpFilterActionType.Accept ?
            <Icon iconName={IconNames.Allow} className="ipFilter-testPanel-results-allow-icon"/> :
            <Icon iconName={IconNames.Block} className="ipFilter-testPanel-results-block-icon"/>;

        return (
            <p>
                <span className="ipFilter-testPanel-results-icon">{actionIcon}</span>
                <span className="ipFilter-testPanel-results-filter-name">{filterRuleViewModel.filterRule.filterName}</span>
                <span className="ipFilter-testPanel-results-ipMask">{`(${filterRuleViewModel.filterRule.ipMask})`}</span>
            </p>
        );
    }

    private renderButtonsContent(): JSX.Element {
        const { t } = this.props;
        const { validationMessage, ipAddress } = this.state;
        return (
            <div className="ipFilter-testPanel-buttons">
                <PrimaryButton
                    onClick={this.verifyClickHandler}
                    className="ipFilter-testPanel-verify-button"
                    disabled={!!validationMessage || !ipAddress}
                >
                    {t(ResourceKeys.ipFilter.testVerifyButton.name)}
                </PrimaryButton>
            </div>
        );
    }

    private onChangeHandler = (value: string): void => {
        const validationMessage = (!value || validateIpAddress(value)) ? '' : this.props.t(ResourceKeys.ipFilter.testIpAddress.errorMessage);
        this.setState({
            ipAddress: value,
            validationMessage
        });
    }

    private verifyClickHandler = (): void => {
        const affectedIpFilters = this.props.filterRuleViewModels.filter((model) => checkIpAddressInRange(this.state.ipAddress, model.filterRule.ipMask));
        const affectedIpFilter = affectedIpFilters && affectedIpFilters.pop();
        this.setState({
            affectedIpFilter,
            showResult: true
        });
    }
}
