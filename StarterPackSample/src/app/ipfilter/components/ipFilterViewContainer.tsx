import { connect } from 'react-redux';
import { Dispatch, compose } from 'redux';
import { AnyAction } from 'typescript-fsa';
import { IpFilterRule } from '@iotHubControlPlane/lib/models';
import { translate } from 'react-i18next';
import { TranslationFunction } from 'i18next';
import { IpFilterView, IpFilterViewProps } from './ipFilterView';
import { IpFilterStateInterface } from '../state';
import { fetchIpFiltersAction, saveIpFiltersAction } from '../actions';
import { IM, NonFunctionProperties, FunctionProperties, StateInterface } from '../../types';
import { getFetchingStatusSelector, getFilterRulesSelector, getErrorStatusSelector, getFetchedStatusSelector } from '../selectors';
import { TRANSLATION_NAMESPACE } from '../../constants';
import { ResourceKeys } from '../../../localization/resourceKeys';

const mapStateToProps = (state: StateInterface, ownProps: IpFilterViewProps): NonFunctionProperties<Partial<IpFilterViewProps>> => {
    const filterState = state.ipFilter as IM<IpFilterStateInterface>;
    return {
        filterRuleViewModels: getFilterRulesSelector(filterState),
        informationBarMessage: generateMessage(filterState, ownProps.t),
        isLoading: getFetchingStatusSelector(filterState)
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): FunctionProperties<Partial<IpFilterViewProps>> => {
    return {
        fetch: () =>  dispatch(fetchIpFiltersAction.started()),
        save: (filterRules: IpFilterRule[]) => dispatch(saveIpFiltersAction.started({filterRules}))
    };
};

export function generateMessage(state: IM<IpFilterStateInterface>, t: TranslationFunction) {
    const value = getErrorStatusSelector(state) ? t(ResourceKeys.ipFilter.infoMessages.updateFailure) :
        getFetchedStatusSelector(state) ? t(ResourceKeys.ipFilter.infoMessages.updateSuccess) :
        getFetchingStatusSelector(state) ? t(ResourceKeys.ipFilter.infoMessages.updatePending) :
        t(ResourceKeys.ipFilter.infoMessages.retrievePending);
    return value;
}

export default compose(
    translate(TRANSLATION_NAMESPACE),
    connect(mapStateToProps, mapDispatchToProps)
)(IpFilterView);
