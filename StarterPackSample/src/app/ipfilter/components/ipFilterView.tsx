import * as React from 'react';
import { TranslationFunction } from 'i18next';
import { DefaultButton, MessageBarButton } from 'office-ui-fabric-react/lib/Button';
import { IpFilterRule, IpFilterActionType } from '@iotHubControlPlane/lib/models';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Overlay } from 'office-ui-fabric-react/lib/Overlay';
import { Shimmer, ShimmerElementType } from 'office-ui-fabric-react/lib/Shimmer';
import { InternetProtocolFilterRuleViewModel } from '../viewModel/internetProtocolFilterRuleViewModel';
import { IpFilterList } from './ipFilterList';
import { IpFilterMenuBar } from './ipFilterMenuBar';
import { IpFilterTestPanel } from './ipFilterTestPanel';
import { ResourceKeys } from '../../../localization/resourceKeys';

const NUMBER_OF_SHIMMER_ELEMENTS = 3;
export interface IpFilterRuleUpdate {
    action?: IpFilterActionType;
    filterName?: string;
    ipMask?: string;
    nameDirty?: boolean;
    addressDirty?: boolean;
}

interface InformationBar {
    show: boolean;
    message?: string;
    type?: MessageBarType;
}

interface IpFilterViewBase {
    filterRuleViewModels: InternetProtocolFilterRuleViewModel[];
    isLoading: boolean;
}

export interface IpFilterViewState extends IpFilterViewBase {
    initialFilterRuleViewModels: InternetProtocolFilterRuleViewModel[];
    informationBar: InformationBar;
    isConfirmingRevert: boolean;
    isDirty: boolean;
    requestMade: boolean;
    newItemIndex: number;
    showOverlay: boolean;
    showTestPanel: boolean;
}

export interface IpFilterViewProps extends IpFilterViewBase {
    fetch: () => void;
    save: (iPFilterRules: IpFilterRule[]) => void;
    t: TranslationFunction;
    informationBarMessage: string;
}

export class IpFilterView extends React.Component<IpFilterViewProps, IpFilterViewState> {

    constructor(props: IpFilterViewProps) {
        super(props);
        this.state = {
            filterRuleViewModels: props.filterRuleViewModels,
            informationBar: {
                message: this.props.informationBarMessage,
                show: false,
                type: MessageBarType.info
            },
            initialFilterRuleViewModels: props.filterRuleViewModels,
            isConfirmingRevert: false,
            isDirty: false,
            isLoading: props.isLoading,
            newItemIndex: props.filterRuleViewModels.length,
            requestMade: false,
            showOverlay: false,
            showTestPanel: false
        };
    }

    public componentDidMount() {
        this.props.fetch();
    }

    public static getDerivedStateFromProps(props: IpFilterViewProps, state: IpFilterViewState): Partial<IpFilterViewState> | null {
        if (!state.isDirty) {
            return {
                filterRuleViewModels: props.filterRuleViewModels,
                initialFilterRuleViewModels: props.filterRuleViewModels,
                newItemIndex: props.filterRuleViewModels.length,
                showOverlay: false
            };
        } else if (state.isDirty && state.requestMade && props.filterRuleViewModels !== state.initialFilterRuleViewModels) {
            return {
                filterRuleViewModels: props.filterRuleViewModels,
                informationBar: {
                    show: true,
                    type: MessageBarType.success
                },
                initialFilterRuleViewModels: props.filterRuleViewModels,
                isDirty: false,
                newItemIndex: props.filterRuleViewModels.length,
                requestMade: false,
                showOverlay: false
            };
        }
        return null;
    }

    public render(): JSX.Element {
        const { isDirty, filterRuleViewModels, informationBar, isConfirmingRevert, showOverlay, showTestPanel } = this.state;
        const { informationBarMessage, isLoading } = this.props;

        return (
            <div className="listViewDisplay">
                <div className="listViewDisplay-header">
                    {showTestPanel &&
                        <IpFilterTestPanel
                            filterRuleViewModels={filterRuleViewModels}
                            onDismissClick={this.dismissTestClickHandler}
                            t={this.props.t}
                        />
                    }

                    <IpFilterMenuBar
                        isSaveDisabled={!(isDirty && this.canSaveDirtyForm())}
                        isRevertDisabled={!isDirty}
                        onSaveClick={this.save}
                        onRevertClick={this.revertClickHandler}
                        onTestClick={this.testClickHandler}
                        t={this.props.t}
                    />

                    {informationBar.show &&
                        <MessageBar
                            className="listViewDisplay-message"
                            messageBarType={informationBar.type}
                            onDismiss={this.dismissInfoMessageBarHandler}
                        >
                            {informationBarMessage}
                        </MessageBar>
                    }

                    {isConfirmingRevert &&
                        <MessageBar
                            className="listViewDisplay-revert-message"
                            messageBarType={MessageBarType.blocked}
                            onDismiss={this.dismissRevertMessageBarHandler}
                            actions={
                                <div>
                                <MessageBarButton className="listViewDisplay-revert-button" onClick={this.revertChanges}>{this.props.t(ResourceKeys.ipFilter.revertDialogBox.yes)}</MessageBarButton>
                                <MessageBarButton className="listViewDisplay-cancel-revert-button" onClick={this.cancelRevertHandler}>{this.props.t(ResourceKeys.ipFilter.revertDialogBox.no)}</MessageBarButton>
                                </div>
                            }
                        >
                        {this.props.t(ResourceKeys.ipFilter.revertDialogBox.message)}
                        </MessageBar>
                    }
                </div>

                <div className="listViewDisplay-body">
                    <div className="listViewDisplay-content">
                        <p className="ipFilterList-header">
                            {this.props.t(ResourceKeys.ipFilter.listHeader.text)}
                        </p>
                        
                        {isLoading && filterRuleViewModels.length === 0 && this.generateShimmer()}
                        
                        <IpFilterList
                            filterRuleViewModels={filterRuleViewModels}
                            onRuleRemoved={this.removeRuleHandler}
                            onRuleChanged={this.updateRuleHandler}
                            onRuleMoved={this.reorderRuleHandler}
                            t={this.props.t}
                        />
                    </div>

                    <div className="listViewDisplay-content">
                        <DefaultButton
                            className="ipFilter-add-button"
                            text={this.props.t(ResourceKeys.ipFilter.addRuleButton.text)}
                            disabled={this.disableAddButton()}
                            iconProps={{ iconName: 'Add'}}
                            onClick={this.addClickHanlder}
                        />
                    </div>
                </div>
                {showOverlay && (<Overlay/>)}
            </div>
        );
    }

    private canSaveDirtyForm(): boolean {
        if (!this.state.filterRuleViewModels.every((value) => !!value.filterRule.filterName && !!value.filterRule.ipMask)) {
            return false;
        }
        
        return this.state.filterRuleViewModels.every((model) => { 
            if (model.addressRangeValidation && !model.addressRangeValidation.isValid) {
                return false;
            }

            if (model.nameValidation && !model.nameValidation.isValid) {
                return false;
            }

            return true;
        });
    }

    private testClickHandler = (): void => {
        this.setState({
            showTestPanel: true
        });
    }

    private dismissTestClickHandler = (): void => {
        this.setState({
            showTestPanel: false
        });
    }

    private revertClickHandler = (): void => {
        this.setState({
            isConfirmingRevert: true,
            showOverlay: true
        });
    }

    private dismissInfoMessageBarHandler = (): void => {
        this.setState({
            informationBar: {
                show: false
            }
        });
    }

    private dismissRevertMessageBarHandler = (): void => {
        this.setState({
            isConfirmingRevert: false,
            showOverlay: false
        });
    }

    private cancelRevertHandler = (): void => {
        this.setState({
            isConfirmingRevert: false,
            showOverlay: false
        });
    }

    private save = (): void => {
        this.setState({
            informationBar: {
                show: true,
                type: MessageBarType.info
            },
            requestMade: true,
            showOverlay: true
        });

        this.props.save(this.state.filterRuleViewModels.map((rule) => {
            return rule.filterRule;
        }));
    }

    private revertChanges = (): void => {
        this.setState({
            filterRuleViewModels: this.state.initialFilterRuleViewModels,
            isConfirmingRevert: false,
            isDirty: false,
            showOverlay: false
        });
    }

    private generateShimmer(): JSX.Element {
        const shimmerElements = this.generateShimmerElements(NUMBER_OF_SHIMMER_ELEMENTS);
        return (<div>{shimmerElements}</div>);
    }

    private generateShimmerElements(count: number): JSX.Element[] {
        const shimmerElements = [];

        while (!!count) {
            shimmerElements.push((
                <Shimmer
                    key={`shimmer-${count}`}
                    className="listViewDisplay-shimmer"
                    shimmerElements={[
                        { type: ShimmerElementType.line, width: '1%' },
                        { type: ShimmerElementType.gap, width: '1%' },
                        { type: ShimmerElementType.line, width: '30%' },
                        { type: ShimmerElementType.gap, width: '2%' },
                        { type: ShimmerElementType.line, width: '30%' },
                        { type: ShimmerElementType.gap, width: '2%' },
                        { type: ShimmerElementType.line, width: '5%' },
                        { type: ShimmerElementType.gap, width: '100%' },
                    ]}
                />
            ));

            count -= 1;
        }

        return shimmerElements;
    }

    private addClickHanlder = (): void => {
        const newFilterRule: IpFilterRule = {
            action: IpFilterActionType.Reject,
            filterName: '',
            ipMask: ''
        };

        const newFilterRuleModel = new InternetProtocolFilterRuleViewModel(newFilterRule, this.state.newItemIndex);
        this.setState({
            filterRuleViewModels: [...this.state.filterRuleViewModels, newFilterRuleModel],
            isDirty: true,
            newItemIndex: (this.state.newItemIndex + 1)
        });
    }

    public removeRuleHandler = (filterRuleViewModelToRemove: InternetProtocolFilterRuleViewModel): void => {
        let newViewModels = this.state.filterRuleViewModels.filter((filterRuleViewModel) => filterRuleViewModel.key !== filterRuleViewModelToRemove.key);
        const duplicates = InternetProtocolFilterRuleViewModel.getDuplicates(newViewModels);    

        // check duplicates
        newViewModels = newViewModels.map((filterRuleViewModel) => {
            if (filterRuleViewModel.filterRule &&
                filterRuleViewModel.filterRule.filterName &&
                filterRuleViewModel.filterRule.filterName === filterRuleViewModelToRemove.filterRule.filterName) {
                    const updatedFilterRuleModel = new InternetProtocolFilterRuleViewModel(
                    {
                        action: filterRuleViewModel.filterRule.action,
                        filterName: filterRuleViewModel.filterRule.filterName,
                        ipMask: filterRuleViewModel.filterRule.ipMask
                    }, 
                    filterRuleViewModel.key);

                    updatedFilterRuleModel.validateName(duplicates);
                    updatedFilterRuleModel.addressRangeValidation = filterRuleViewModel.addressRangeValidation;
                    return updatedFilterRuleModel;
            }

            return filterRuleViewModel;
        });

        this.setState({
            filterRuleViewModels: newViewModels,
            isDirty: true
        });
    }

    public updateRuleHandler = (
        filterRuleUpdate: IpFilterRuleUpdate,
        filterRuleViewModelToUpdate: InternetProtocolFilterRuleViewModel): void => {

        const newFilterRule: IpFilterRule = {
            action: filterRuleUpdate.action !== undefined ? filterRuleUpdate.action : filterRuleViewModelToUpdate.filterRule.action,
            filterName: filterRuleUpdate.filterName !== undefined ? filterRuleUpdate.filterName : filterRuleViewModelToUpdate.filterRule.filterName,
            ipMask: filterRuleUpdate.ipMask !== undefined ? filterRuleUpdate.ipMask : filterRuleViewModelToUpdate.filterRule.ipMask
        };

        const newFilterRuleModel = new InternetProtocolFilterRuleViewModel(newFilterRule, filterRuleViewModelToUpdate.key);
        newFilterRuleModel.nameValidation = filterRuleViewModelToUpdate.nameValidation;
        newFilterRuleModel.addressRangeValidation = filterRuleViewModelToUpdate.addressRangeValidation;

        let newViewModels = this.state.filterRuleViewModels.map((filterRuleViewModel) => {
            return filterRuleViewModel.key === filterRuleViewModelToUpdate.key ? newFilterRuleModel : filterRuleViewModel;
        });

        const duplicates = InternetProtocolFilterRuleViewModel.getDuplicates(newViewModels);
        if (filterRuleUpdate.filterName !== undefined) {
            newFilterRuleModel.validateName(duplicates);
        
            newViewModels = newViewModels.map((filterRuleViewModel) => {
                if (filterRuleViewModel.key === newFilterRuleModel.key) {
                    return newFilterRuleModel;
                }
               
                if (filterRuleViewModel.filterRule && 
                    filterRuleViewModel.filterRule.filterName && (
                    filterRuleViewModel.filterRule.filterName === filterRuleUpdate.filterName ||
                    filterRuleViewModel.filterRule.filterName === filterRuleViewModelToUpdate.filterRule.filterName)) {

                        const updatedFilterRuleModel = new InternetProtocolFilterRuleViewModel(
                        {
                            action: filterRuleViewModel.filterRule.action,
                            filterName: filterRuleViewModel.filterRule.filterName,
                            ipMask: filterRuleViewModel.filterRule.ipMask
                        }, 
                        filterRuleViewModel.key);

                        updatedFilterRuleModel.validateName(duplicates);
                        updatedFilterRuleModel.addressRangeValidation = filterRuleViewModel.addressRangeValidation;
                        return updatedFilterRuleModel;
                }

                return filterRuleViewModel;
            });
        }
        
        if (filterRuleUpdate.ipMask !== undefined) {
            newFilterRuleModel.validateAddressRange();
        }

        this.setState({
            filterRuleViewModels: newViewModels,
            isDirty: true
        });
    }

    private reorderRuleHandler = (dragIndex: number, hoverIndex: number): void => {
        const newFilterRuleViewModels = [...this.state.filterRuleViewModels];
        const item = newFilterRuleViewModels[dragIndex];

        newFilterRuleViewModels.splice(dragIndex, 1);
        newFilterRuleViewModels.splice(hoverIndex, 0, item);

        this.setState({
            filterRuleViewModels: newFilterRuleViewModels,
            isDirty: true
        });
    }

    private disableAddButton(): boolean {
        return this.state.filterRuleViewModels.length > 9;
    }
}
