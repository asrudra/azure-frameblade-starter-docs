import * as React from 'react';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Toggle } from 'office-ui-fabric-react';
import { IpFilterActionType } from '@iotHubControlPlane/lib/models';
import { findDOMNode } from 'react-dom';
import {
    DragSource,
    DropTarget,
    ConnectDropTarget,
    ConnectDragPreview,
    ConnectDragSource,
    DropTargetMonitor,
    DropTargetConnector,
    DragSourceConnector,
    DragSourceMonitor,
} from 'react-dnd';
import { XYCoord } from 'dnd-core';
import { TranslationFunction } from 'i18next';
import { InternetProtocolFilterRuleViewModel } from '../viewModel/internetProtocolFilterRuleViewModel';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { IconNames } from '../../shared/utils/iconNames';
import { IpFilterRuleUpdate } from './ipFilterView';

const itemSource = {
    beginDrag(props: IpFilterItemProps) {
        return {
            id: props.filterRuleViewModel.key,
            index: props.index,
        };
    }
};

const itemTarget = {
    hover(props: IpFilterItemProps, monitor: DropTargetMonitor, component: IpFilterItem | null) {
        if (!component) {
            return null;
        }
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Determine rectangle on screen
        const hoverBoundingRect = (findDOMNode(
            component,
        ) as Element).getBoundingClientRect();

        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%
        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
        }

        // Time to actually perform the action
        props.moveCard(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
        return;
    },
};

export interface IpFilterItemProps {
    connectDragPreview?: ConnectDragPreview;
    connectDragSource?: ConnectDragSource;
    connectDropTarget?: ConnectDropTarget;
    filterRuleViewModel: InternetProtocolFilterRuleViewModel;
    index: number;
    isDragging?: boolean;
    moveCard: (dragIndex: number, hoverIndex: number) => void;
    onRuleRemoved: (filterRuleViewModel: InternetProtocolFilterRuleViewModel) => void;
    onRuleChanged: (filterRule: IpFilterRuleUpdate, filterRuleViewModel: InternetProtocolFilterRuleViewModel) => void;
    t: TranslationFunction;
}

@DropTarget('IpFilterItem', itemTarget, (connect: DropTargetConnector) => ({
    connectDropTarget: connect.dropTarget(),
}))
@DragSource(
    'IpFilterItem',
    itemSource,
    (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
        connectDragPreview: connect.dragPreview(),
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }),
)
export class IpFilterItem extends React.Component<IpFilterItemProps, {}> {

    constructor(props: IpFilterItemProps) {
        super(props);
    }

    public render(): JSX.Element | null {
        const {
            connectDragPreview,
            connectDragSource,
            connectDropTarget,
            filterRuleViewModel,
            isDragging,
        } = this.props;

        if (!connectDragPreview || !connectDragSource || !connectDropTarget) {
            return null;
        }

        // connectDragSource(connectDropTarget(itemControl), undefined)
        const opacity = isDragging ? 0 : 1;
        const itemControl = this.getItemControl();
        const control = (
            <div style={{ opacity }} className="listViewDisplay-itemWrapper" key={filterRuleViewModel.key}>
                {connectDragSource(<div className="listViewDisplay-itemGrip" />)}
                {connectDropTarget(itemControl)}
            </div>
        );
        return (
            connectDragPreview(control)
        );
    }

    private getItemControl(): JSX.Element {
        const { filterRuleViewModel } = this.props;

        return (
            <div className="listViewDisplay-item listView-flex-wrapper" data-is-focusable={true}>
                <div className="listViewDisplay-item-name listView-flex-column-name">
                    <TextField
                        autoFocus={true}
                        borderless={false}
                        className="listViewDisplay-filter-name-textbox"
                        ariaLabel={this.props.t(ResourceKeys.ipFilter.filterName.placeHolder)}
                        value={filterRuleViewModel.filterRule.filterName}
                        errorMessage={(
                            !!filterRuleViewModel.nameValidation &&
                            !filterRuleViewModel.nameValidation.isValid &&
                            filterRuleViewModel.nameValidation.validationMessageKey) ?
                                this.props.t(filterRuleViewModel.nameValidation.validationMessageKey) : ''
                        }
                        onBlur={this.blurFilterNameHandler}
                        onChange={this.updateFilterNameHandler}
                        required={true}
                    />
                </div>
                <div className="listViewDisplay-item-range listView-flex-column-range">
                    <TextField
                        ariaLabel={this.props.t(ResourceKeys.ipFilter.ipMask.placeHolder)}
                        borderless={false}
                        value={filterRuleViewModel.filterRule.ipMask}
                        errorMessage={(
                            !!filterRuleViewModel.addressRangeValidation &&
                            !filterRuleViewModel.addressRangeValidation.isValid &&
                            filterRuleViewModel.addressRangeValidation.validationMessageKey) ?
                                this.props.t(filterRuleViewModel.addressRangeValidation.validationMessageKey) : ''
                        }
                        onBlur={this.blurIpMaskHandler}
                        onChange={this.updateIpMaskHandler}
                        onFocus={this.updateIpMaskHandler}
                        required={true}
                    />
                </div>
                <div className="listViewDisplay-item-action">
                    <Toggle
                        key={filterRuleViewModel.filterRule.filterName + filterRuleViewModel.key}
                        onText={this.props.t(ResourceKeys.ipFilter.action.toggle.accept)}
                        offText={this.props.t(ResourceKeys.ipFilter.action.toggle.reject)}
                        checked={filterRuleViewModel.filterRule.action === IpFilterActionType.Accept}
                        onChange={this.updateActionTypeHandler}
                    />
                </div>
                <div className="listViewDisplay-item-commands">
                    <IconButton
                        iconProps={{
                            iconName: IconNames.Delete
                        }}
                        ariaLabel={this.props.t(ResourceKeys.ipFilter.removeButton.ariaLabel)}
                        title={this.props.t(ResourceKeys.ipFilter.removeButton.title)}
                        onClick={this.ruleRemovedHandler}
                        className="icon-button-overloads"
                    />
                </div>
            </div>);
    }

    private ruleRemovedHandler = (): void => {
        const { filterRuleViewModel, onRuleRemoved } = this.props;
        onRuleRemoved(filterRuleViewModel);
    }

    private blurFilterNameHandler = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => { 
        // fire validation if field is empty and lacks a validation (e.g. has been touched but not changed)
        if (!this.props.filterRuleViewModel.nameValidation && !this.props.filterRuleViewModel.filterRule.filterName) {
            this.props.onRuleChanged(
            {
                filterName: this.props.filterRuleViewModel.filterRule.filterName
            },
            this.props.filterRuleViewModel);
        }
    }

    private blurIpMaskHandler = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => { 
        // fire validation if field is empty and lacks a validation (e.g. has been touched but not changed)
        if (!this.props.filterRuleViewModel.addressRangeValidation && !this.props.filterRuleViewModel.filterRule.ipMask) {
            this.props.onRuleChanged(
            {
                ipMask: this.props.filterRuleViewModel.filterRule.ipMask
            },
            this.props.filterRuleViewModel);
        }
    }

    private updateActionTypeHandler = (event: React.MouseEvent<HTMLElement>, checked?: boolean) => {
        this.props.onRuleChanged(
        {
            action: !!checked ? IpFilterActionType.Accept : IpFilterActionType.Reject
        },
        this.props.filterRuleViewModel);
    }

    private updateFilterNameHandler = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => {
        this.props.onRuleChanged(
        {
            filterName: value
        },
        this.props.filterRuleViewModel);
    }

    private updateIpMaskHandler = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => {
        this.props.onRuleChanged(
        {
            ipMask: value
        },
        this.props.filterRuleViewModel);
    }
}
