import { connect } from 'react-redux';
import { Dispatch, compose } from 'redux';
import { AnyAction } from 'typescript-fsa';
import { translate } from 'react-i18next';
import { TranslationFunction } from 'i18next';
import { AzureSubscriptionsView, AzureSubscriptionsViewProps } from './azureSubscriptionsView';
import { AzureSubscriptionsStateInterface } from '../state';
import { fetchAzureSubscriptionsAction } from '../actions';
import { IM, NonFunctionProperties, FunctionProperties, StateInterface } from '../../types';
import { getAzureSubscriptionsSelector, getFetchingStatusSelector, getErrorStatusSelector, getFetchedStatusSelector } from '../selectors';
import { TRANSLATION_NAMESPACE } from '../../constants';
import { ResourceKeys } from '../../../localization/resourceKeys';

const mapStateToProps = (state: StateInterface, ownProps: AzureSubscriptionsViewProps): NonFunctionProperties<Partial<AzureSubscriptionsViewProps>> => {
    const azureSubscriptionsState = state.azureSubscriptions as IM<AzureSubscriptionsStateInterface>;
    return {
        azureSubscriptions: getAzureSubscriptionsSelector(azureSubscriptionsState),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): FunctionProperties<Partial<AzureSubscriptionsStateInterface>> => {
    return {
        fetch: () =>  dispatch(fetchAzureSubscriptionsAction.started()),
    };
};

export function generateMessage(state: IM<AzureSubscriptionsStateInterface>, t: TranslationFunction) {
    const value = getErrorStatusSelector(state) ? t(ResourceKeys.ipFilter.infoMessages.updateFailure) :
        getFetchedStatusSelector(state) ? t(ResourceKeys.ipFilter.infoMessages.updateSuccess) :
        getFetchingStatusSelector(state) ? t(ResourceKeys.ipFilter.infoMessages.updatePending) :
        t(ResourceKeys.ipFilter.infoMessages.retrievePending);
    return value;
}

export default compose(
    translate(TRANSLATION_NAMESPACE),
    connect(mapStateToProps, mapDispatchToProps)
)(AzureSubscriptionsView);
