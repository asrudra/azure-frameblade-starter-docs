import { connect } from 'react-redux';
import { Dispatch, compose } from 'redux';
import { AnyAction } from 'typescript-fsa';
import { translate } from 'react-i18next';
import { AzureSubscriptionsView, AzureSubscriptionsViewProps } from './azureSubscriptionsView';
import { AzureSubscriptionsStateInterface } from '../state';
import { fetchAzureSubscriptionsAction } from '../actions';
import { IM, NonFunctionProperties, FunctionProperties, StateInterface } from '../../types';
import { getAzureSubscriptionsSelector, getNextLinkSelector, getFetchedStatusSelector, getFetchingStatusSelector, getErrorStatusSelector } from '../selectors';
import { TRANSLATION_NAMESPACE } from '../../constants';

export const mapStateToProps = (state: StateInterface, ownProps: AzureSubscriptionsViewProps): NonFunctionProperties<Partial<AzureSubscriptionsViewProps>> => {
    const azureSubscriptionsState = state.azureSubscriptions as IM<AzureSubscriptionsStateInterface>;
    return {
        azureSubscriptions: getAzureSubscriptionsSelector(azureSubscriptionsState),
        errorFetchingAzureSubscriptions: getErrorStatusSelector(azureSubscriptionsState),
        hasFetchedAzureSubscriptions: getFetchedStatusSelector(azureSubscriptionsState),
        isFetchingAzureSubscriptions: getFetchingStatusSelector(azureSubscriptionsState),
        nextLink: getNextLinkSelector(azureSubscriptionsState)
    };
};

export const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): FunctionProperties<Partial<AzureSubscriptionsViewProps>> => {
    return {
        fetchAzureSubscriptions: (nextLink: string) => dispatch(fetchAzureSubscriptionsAction.started({nextLink}))
    };
};

export default compose(
    translate(TRANSLATION_NAMESPACE),
    connect(mapStateToProps, mapDispatchToProps)
)(AzureSubscriptionsView);
