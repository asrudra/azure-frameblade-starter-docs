import { TranslationFunction } from 'i18next';
import { IpFilterRule } from '@iotHubControlPlane/lib/models';
import * as React from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import { InternetProtocolFilterRuleViewModel } from '../viewModel/internetProtocolFilterRuleViewModel';
import { IpFilterItem } from './ipFilterItem';
import { ResourceKeys } from '../../../localization/resourceKeys';

export interface IpFilterListProps {
    filterRuleViewModels: InternetProtocolFilterRuleViewModel[];
    onRuleRemoved: (filterRuleViewModel: InternetProtocolFilterRuleViewModel) => void;
    onRuleChanged: (filterRule: IpFilterRule, filterRuleViewModel: InternetProtocolFilterRuleViewModel) => void;
    onRuleMoved: (dragIndex: number, hoverIndex: number) => void;
    t: TranslationFunction;
}

@DragDropContext(HTML5Backend)
export class IpFilterList extends React.Component<IpFilterListProps> {

    public render(): JSX.Element {
        const { filterRuleViewModels, onRuleChanged, onRuleMoved, onRuleRemoved } = this.props;

        if (!filterRuleViewModels || filterRuleViewModels.length === 0) {
            return <></>;
        }
        
        const listColumnHeader =
        (
            <div className="ipFilterList-columnHeader listView-flex-wrapper">
                <p className="ipFilterList-columnRow-name listView-flex-column-name">
                    {this.props.t(ResourceKeys.ipFilter.filterName.title)}
                </p>
                <p className="ipFilterList-columnRow-range listView-flex-column-range">
                    {this.props.t(ResourceKeys.ipFilter.ipMask.title)}
                </p>
                <p className="ipFilterList-columnRow-action">
                    {this.props.t(ResourceKeys.ipFilter.action.title)}
                </p>
            </div>
        );

        const listViewDisplayItems = filterRuleViewModels.map((filterRuleViewModel, index) =>
            (
                <IpFilterItem
                    key={filterRuleViewModel.key}
                    filterRuleViewModel={filterRuleViewModel}
                    index={index}
                    moveCard={onRuleMoved}
                    onRuleChanged={onRuleChanged}
                    onRuleRemoved={onRuleRemoved}
                    t={this.props.t}
                />
            )
        );

        return (
            <div>
                {listColumnHeader}
                {listViewDisplayItems}
            </div>
        );
    }
}
